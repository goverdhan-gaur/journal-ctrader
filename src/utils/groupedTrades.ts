import { CleanedTradeData } from "./cleanData";

export interface Trade {
    symbol: string;
    openingDir: string;
    closingDir: string;
    entry: number;
    exit: number;
    pL: number;
    volume: number;
    openingTime: string;
    closingTime: string;
}

export interface Position {
    symbol: string;
    openingDir: string;
    entry: number;
    initialVolume: number;
    remainingVolume: number;
    openingTime: string;
    trades: Trade[];
    partialTPs: {
        price: number;
        volume: number;
        pL: number;
        time: string;
    }[];
    partialSLs: {
        price: number;
        volume: number;
        pL: number;
        time: string;
    }[];
    status: 'open' | 'closed';
    totalPL: number;
}

// Helper function to parse date strings consistently
const parseDate = (dateStr: string): number => {
    try {
        if (!dateStr) return 0;

        // Handle the format: "DD/MM/YYYY HH:mm:ss.SSS"
        const [datePart, timePart] = dateStr.split(' ');
        if (!datePart || !timePart) {
            console.error('Invalid date format:', dateStr);
            return 0;
        }

        const [day, month, year] = datePart.split('/').map(Number);
        const [time, ms] = timePart.split('.');
        const [hours, minutes, seconds] = time.split(':').map(Number);

        // Month is 0-based in JavaScript Date
        const date = new Date(year, month - 1, day, hours, minutes, seconds, ms ? parseInt(ms) : 0);
        const timestamp = date.getTime();

        if (isNaN(timestamp)) {
            console.error('Invalid date components:', { day, month, year, hours, minutes, seconds, ms });
            return 0;
        }

        return timestamp;
    } catch (error) {
        console.error('Error parsing date:', dateStr, error);
        return 0;
    }
};

// Helper function to format a date for display
const formatDisplayDate = (timestamp: number): string => {
    try {
        if (!timestamp) return '';
        
        const date = new Date(timestamp);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    } catch (error) {
        console.error('Error formatting date:', timestamp, error);
        return '';
    }
};

function isSamePosition(pos1: Position, trade: Trade): boolean {
    // Time window for considering trades part of the same position (5 minutes = 300000ms)
    const TIME_WINDOW = 300000;
    
    const timeDiff = Math.abs(
        parseDate(pos1.openingTime) - parseDate(trade.openingTime)
    );
    
    // Check if trades are within the time window and have the same direction and symbol
    const isWithinTimeWindow = timeDiff < TIME_WINDOW;
    const sameSymbol = pos1.symbol === trade.symbol;
    const sameDirection = pos1.openingDir === trade.openingDir;
    
    // For entries very close to each other (within 0.0001), consider them the same position
    const sameEntry = Math.abs(pos1.entry - trade.entry) < 0.0001;
    
    // If entries are exactly the same and everything else matches, it's definitely the same position
    if (sameSymbol && sameDirection && sameEntry) {
        return true;
    }
    
    // If within time window and same symbol/direction, might be a partial close
    if (isWithinTimeWindow && sameSymbol && sameDirection) {
        // Check if this trade's entry is close to any exit price of existing trades
        // This would indicate a re-entry after partial close
        const hasRelatedExit = pos1.trades.some(existingTrade => 
            Math.abs(existingTrade.exit - trade.entry) < 0.0001
        );
        
        return hasRelatedExit;
    }
    
    return false;
}

function isRelatedTrade(existingTrade: Trade, newTrade: Trade): boolean {
    // Time window for considering trades as related (5 minutes = 300000ms)
    const TIME_WINDOW = 300000;
    
    const closingTimeExisting = parseDate(existingTrade.closingTime);
    const openingTimeNew = parseDate(newTrade.openingTime);
    
    // Check if the new trade opens right after the existing trade closes
    const timeDiff = Math.abs(openingTimeNew - closingTimeExisting);
    
    // Basic conditions for related trades
    const sameSymbol = existingTrade.symbol === newTrade.symbol;
    const sameDirection = existingTrade.openingDir === newTrade.openingDir;
    
    // Check for same price points (within a small tolerance)
    const isClosePriceMatch = Math.abs(existingTrade.exit - newTrade.entry) < 0.0001;
    
    // If it's the same symbol, direction, price, and within time window, it's likely a partial close
    if (sameSymbol && sameDirection && isClosePriceMatch && timeDiff <= TIME_WINDOW) {
        return true;
    }
    
    return false;
}

export function aggregateTrades(trades: CleanedTradeData[]): Position[] {
    if (!Array.isArray(trades)) {
        console.error('Expected trades to be an array');
        return [];
    }

    console.log('Processing trades:', trades.length, 'entries');

    // Convert CleanedTradeData to Trade
    const convertedTrades = trades.map(trade => ({
        symbol: trade.symbol,
        openingDir: trade.direction,
        closingDir: trade.direction,
        entry: parseFloat(trade.entryPrice.toString()),
        exit: parseFloat(trade.closingPrice.toString()),
        pL: parseFloat(trade.net.toString()),
        volume: parseFloat(trade.closingQuantity.toString()),
        openingTime: trade.openingTime,
        closingTime: trade.closingTime
    }));

    // Sort trades by opening time
    const sortedTrades = [...convertedTrades].sort((a, b) => 
        parseDate(a.openingTime) - parseDate(b.openingTime)
    );

    const positions: Position[] = [];
    let uniqueTradeCount = 0;

    sortedTrades.forEach(trade => {
        // Try to find an existing position that matches this trade
        let foundPosition = positions.find(pos => isSamePosition(pos, trade));

        if (!foundPosition) {
            // This is a new unique trade
            uniqueTradeCount++;
            
            // Create new position
            foundPosition = {
                symbol: trade.symbol,
                openingDir: trade.openingDir,
                entry: trade.entry,
                initialVolume: trade.volume,
                remainingVolume: trade.volume,
                openingTime: trade.openingTime,
                trades: [],
                partialTPs: [],
                partialSLs: [],
                status: 'open',
                totalPL: 0
            };
            positions.push(foundPosition);
        }

        // Add trade to position
        foundPosition.trades.push(trade);

        // Calculate if this is a TP or SL
        const isProfitable = trade.pL > 0;
        const closeVolume = trade.volume;
        
        if (isProfitable) {
            foundPosition.partialTPs.push({
                price: trade.exit,
                volume: closeVolume,
                pL: trade.pL,
                time: trade.closingTime
            });
        } else {
            foundPosition.partialSLs.push({
                price: trade.exit,
                volume: closeVolume,
                pL: trade.pL,
                time: trade.closingTime
            });
        }

        // Update remaining volume and total P/L
        foundPosition.remainingVolume -= closeVolume;
        foundPosition.totalPL += trade.pL;

        // Check if position is fully closed
        if (foundPosition.remainingVolume <= 0) {
            foundPosition.status = 'closed';
        }
    });

    // Sort positions by opening time
    positions.sort((a, b) => 
        parseDate(a.openingTime) - parseDate(b.openingTime)
    );

    console.log(`Processed ${trades.length} trade entries into ${uniqueTradeCount} unique trades`);
    console.log('Positions:', positions);
    
    return positions;
}

// Helper function to calculate pip difference between prices
const getPipDifference = (price1: number, price2: number, symbol: string): number => {
    // For most forex pairs, 1 pip = 0.0001
    // For JPY pairs, 1 pip = 0.01
    const pipMultiplier = symbol.includes('JPY') ? 0.01 : 0.0001;
    return Math.abs(price1 - price2) / pipMultiplier;
};

export function getUniqueTradesCount(trades: CleanedTradeData[]): { uniqueTrades: Trade[], count: number } {
    if (!trades || trades.length === 0) {
        return { uniqueTrades: [], count: 0 };
    }

    const TIME_WINDOW = 900000; // 15 minutes in milliseconds for XAUUSD
    const MAX_PIP_DISTANCE = 10; // Increased pip distance for XAUUSD

    // Group trades by symbol and direction
    const tradesBySymbolAndDir: { [key: string]: CleanedTradeData[] } = {};
    trades.forEach(trade => {
        const key = `${trade.symbol}-${trade.direction}`;
        if (!tradesBySymbolAndDir[key]) {
            tradesBySymbolAndDir[key] = [];
        }
        tradesBySymbolAndDir[key].push(trade);
    });

    const uniqueTradeGroups: CleanedTradeData[][] = [];

    // Process trades by symbol and direction
    Object.entries(tradesBySymbolAndDir).forEach(([key, symbolTrades]) => {
        // Sort trades by opening time
        symbolTrades.sort((a, b) => parseDate(a.openingTime) - parseDate(b.openingTime));

        // Special handling for XAUUSD
        const isGold = key.startsWith('XAUUSD');
        const timeWindow = isGold ? TIME_WINDOW : 300000; // 15 mins for gold, 5 mins for others
        const pipDistance = isGold ? MAX_PIP_DISTANCE : 5; // 10 pips for gold, 5 for others

        let currentGroup: CleanedTradeData[] = [];
        
        symbolTrades.forEach((currentTrade, index) => {
            if (currentTrade.parentOrderId) return; // Skip trades that are already linked

            // Start a new group if this is the first trade
            if (currentGroup.length === 0) {
                currentGroup = [currentTrade];
                uniqueTradeGroups.push(currentGroup);
                return;
            }

            const lastTrade = currentGroup[currentGroup.length - 1];
            const timeDiff = parseDate(currentTrade.openingTime) - parseDate(lastTrade.closingTime);
            
            // For XAUUSD, also check if trades are at similar times on different days
            const isSimilarTimeOfDay = isGold && areSimilarTimesOfDay(currentTrade.openingTime, lastTrade.openingTime);
            
            // Calculate pip differences
            const pipDiff = getPipDifference(currentTrade.entryPrice, lastTrade.entryPrice, currentTrade.symbol);

            if ((Math.abs(timeDiff) <= timeWindow || (isGold && isSimilarTimeOfDay)) && 
                pipDiff <= pipDistance &&
                currentTrade.direction === lastTrade.direction) {
                // Add to current group
                currentGroup.push(currentTrade);
                currentTrade.parentOrderId = currentGroup[0].orderId;
                currentTrade.isPartialClose = true;
            } else {
                // Start a new group
                currentGroup = [currentTrade];
                uniqueTradeGroups.push(currentGroup);
            }
        });
    });

    // Convert trade groups to unique trades
    const uniqueTrades = uniqueTradeGroups.map(group => {
        const parentTrade = group[0];
        const lastTrade = group[group.length - 1];

        // Calculate total volume and P&L
        const totalVolume = group.reduce((sum, t) => sum + t.closingQuantity, 0);
        const totalPL = group.reduce((sum, t) => sum + t.net, 0);

        // Calculate average entry and exit prices weighted by volume
        const weightedEntry = group.reduce((sum, t) => sum + (t.entryPrice * t.closingQuantity), 0) / totalVolume;
        const weightedExit = group.reduce((sum, t) => sum + (t.closingPrice * t.closingQuantity), 0) / totalVolume;

        return {
            symbol: parentTrade.symbol,
            openingDir: parentTrade.direction,
            closingDir: parentTrade.direction,
            entry: weightedEntry,
            exit: weightedExit,
            pL: totalPL,
            volume: totalVolume,
            openingTime: parentTrade.openingTime,
            closingTime: lastTrade.closingTime
        };
    });

    // Log detailed information about XAUUSD trades
    const goldGroups = uniqueTradeGroups.filter(group => group[0].symbol === 'XAUUSD');
    console.log('\nXAUUSD Trade Groups:');
    goldGroups.forEach((group, index) => {
        console.log(`\nGroup ${index + 1}:`);
        console.log(`  Trades: ${group.length}`);
        console.log(`  Direction: ${group[0].direction}`);
        console.log(`  Total Volume: ${group.reduce((sum, t) => sum + t.closingQuantity, 0)}`);
        console.log(`  Total P&L: ${group.reduce((sum, t) => sum + t.net, 0).toFixed(2)}`);
        console.log(`  Trade Times:`, group.map(t => formatDisplayDate(parseDate(t.openingTime))));
    });

    return {
        uniqueTrades,
        count: uniqueTrades.length
    };
}

// Helper function to check if two times are similar (ignoring date)
function areSimilarTimesOfDay(time1: string, time2: string): boolean {
    try {
        const [, t1] = time1.split(' ');
        const [, t2] = time2.split(' ');
        
        const [h1, m1] = t1.split(':').map(Number);
        const [h2, m2] = t2.split(':').map(Number);
        
        // Convert both times to minutes since midnight
        const mins1 = h1 * 60 + m1;
        const mins2 = h2 * 60 + m2;
        
        // Check if times are within 30 minutes of each other
        return Math.abs(mins1 - mins2) <= 30;
    } catch (error) {
        console.error('Error comparing times:', time1, time2, error);
        return false;
    }
}

// Helper function to format duration
function formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
        return `${hours}h ${minutes % 60}m`;
    }
    if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
}
