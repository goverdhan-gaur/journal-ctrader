import { CleanedTradeData } from "./cleanData";
import { v4 as uuidv4 } from 'uuid';
export interface AggregatedData {
    id: string;
    symbol: string;
    openPrice: number;
    date: string;
    openTime: string;
    totalProfit: number;
    totalCommission: number;
    totalLots: number;
    totalPips: number;
    closeTime: string | null;
    finalClose: number | null;
    partialTP: Record<string, object>; // Partial take profits
    partialSL: Record<string, object>; // Partial stop losses
    trades: CleanedTradeData[]; // Store all trades in the group
}

export function aggregateTrades(trades: CleanedTradeData[]): AggregatedData[] {
    const aggregated: Record<string, AggregatedData> = {};
    const positionTracking: Record<string, { remainingLots: number; totalPips: number; lastClosingPrice: number }> = {};

    // Step 1: Precompute total lots for each grouping
    const totalLotsMap: Record<string, number> = {};
    trades.forEach(trade => {
        const openKey = `${trade.symbol}_${trade.entryPrice}_${trade.openingTime}`;
        if (!totalLotsMap[openKey]) {
            totalLotsMap[openKey] = 0;
        }
        totalLotsMap[openKey] += trade.closingQuantity; // Sum up all lots for this grouping
    });

    trades.forEach((trade, index) => {
        const symbol = trade.symbol;
        const openKey = `${trade.symbol}_${trade.entryPrice}_${trade.openingTime}`;

        if (!aggregated[openKey]) {
            aggregated[openKey] = {
                id: uuidv4(),
                symbol,
                date: trade.openingDate,
                openPrice: trade.entryPrice,
                openTime: trade.openingTime,
                totalProfit: 0,
                totalCommission: 0,
                totalLots: totalLotsMap[openKey], // Set totalLots upfront
                totalPips: 0,
                closeTime: null,
                finalClose: null,
                partialTP: {}, // Initialize partial TP
                partialSL: {}, // Initialize partial SL
                trades: [] // Initialize trades array
            };
            positionTracking[openKey] = { remainingLots: 0, totalPips: 0, lastClosingPrice: 0 };
        }

        // Add a unique key to each trade
        // const uniqueKey = `trade_${openKey}_${index}`; // Example: trade_symbol_entryTime_index
        const tradeWithKey = { ...trade, id:uuidv4() }; // Create a new trade object with uniqueKey

        // Push the trade with the unique key into the trades array
        aggregated[openKey].trades.push(tradeWithKey);

        // Aggregate profits, lots, pips, etc.
        aggregated[openKey].totalProfit += trade.net;
        positionTracking[openKey].totalPips += trade.pips;
        positionTracking[openKey].remainingLots += trade.closingQuantity;

        // Track the closing price of the last trade
        positionTracking[openKey].lastClosingPrice = trade.closingPrice;

        // Track partial TP and SL dynamically based on trades between open and finalClose
        if (trade.closingTime > trade.openingTime) { // If this trade is after opening
            if (trade.net > 0 || trade.pips > 0) {
                // Add this as a partial Take Profit (TP)
                const tpKey = `tp${Object.keys(aggregated[openKey].partialTP).length + 1}`;
                aggregated[openKey].partialTP[tpKey] = {
                    id: uuidv4(),
                    pips: trade.pips,
                    price: trade.closingPrice,
                    lotsClosed: trade.closingQuantity,
                    closedTime: trade.closingTime,
                    percentageClosed: (Math.round(((trade.closingQuantity / totalLotsMap[openKey]) * 100)*100) / 100).toFixed(2)
                };
            } else if (trade.net < 0 || trade.pips < 0) {
                // Add this as a partial Stop Loss (SL)
                const slKey = `sl${Object.keys(aggregated[openKey].partialSL).length + 1}`;
                aggregated[openKey].partialSL[slKey] = {
                    id: uuidv4(),
                    pips: trade.pips,
                    price: trade.closingPrice,
                    closedTime: trade.closingTime,
                    lotsClosed: trade.closingQuantity,
                    percentageClosed: (Math.round(((trade.closingQuantity / totalLotsMap[openKey]) * 100)*100) / 100).toFixed(2)
                };
            }
        }
    });

    // Update finalClose for each openKey
    Object.keys(aggregated).forEach(openKey => {
        const lastTrade = trades.filter(trade => `${trade.symbol}_${trade.entryPrice}_${trade.openingTime}` === openKey)
            .reduce((latest, current) => (current.closingTime > latest.closingTime ? current : latest));
        aggregated[openKey].closeTime = lastTrade.closingTime;
        aggregated[openKey].finalClose = lastTrade.closingPrice;
        aggregated[openKey].totalPips = positionTracking[openKey].totalPips;
    });

    return Object.values(aggregated);
}
