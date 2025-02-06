import { CleanedTradeData } from "./cleanData";

interface AggregatedData {
    symbol: string;
    openPrice: number;
    openTime: string;
    totalProfit: number;
    totalCommission: number;
    totalLots: number;
    totalPips: number;
    finalClose: number | null;
    partialTP: Record<string, number>; // Partial take profits
    partialSL: Record<string, number>; // Partial stop losses
    trades: CleanedTradeData[]; // Store all trades in the group
}

export function aggregateTrades(trades: CleanedTradeData[]): AggregatedData[] {
    const aggregated: Record<string, AggregatedData> = {};
    const positionTracking: Record<string, { remainingLots: number; totalPips: number; lastClosingPrice: number }> = {};

    trades.forEach(trade => {
        const symbol = trade.symbol;
        const openKey = `${trade.symbol}_${trade.entryPrice}_${trade.openingTime}`;
        
        if (!aggregated[openKey]) {
            aggregated[openKey] = {
                symbol,
                openPrice: trade.entryPrice,
                openTime: trade.openingTime,
                totalProfit: 0,
                totalCommission: 0,
                totalLots: 0,
                totalPips: 0,
                finalClose: null,
                partialTP: {}, // Initialize partial TP
                partialSL: {}, // Initialize partial SL
                trades: [] // Initialize trades array
            };
            positionTracking[openKey] = { remainingLots: 0, totalPips: 0, lastClosingPrice: 0 };
        }

        // Push the trade into the trades array
        aggregated[openKey].trades.push(trade);

        // Aggregate profits, lots, pips, etc.
        aggregated[openKey].totalProfit += trade.net;
        // aggregated[openKey].totalCommission += trade.commission; // Uncomment if you want to include commissions.
        aggregated[openKey].totalLots += trade.closingQuantity;
        positionTracking[openKey].totalPips += trade.pips;
        positionTracking[openKey].remainingLots += trade.closingQuantity;

        // Track the closing price of the last trade
        positionTracking[openKey].lastClosingPrice = trade.closingPrice;

        // Track partial TP and SL dynamically based on trades between open and finalClose
        if (trade.closingTime > trade.openingTime) { // If this trade is after opening
            if (trade.net > 0 || trade.pips > 0) {
                // Add this as a partial Take Profit (TP)
                const tpKey = `tp${Object.keys(aggregated[openKey].partialTP).length + 1}`;
                aggregated[openKey].partialTP[tpKey] = trade.pips;
            } else if (trade.net < 0 || trade.pips < 0) {
                // Add this as a partial Stop Loss (SL)
                const slKey = `sl${Object.keys(aggregated[openKey].partialSL).length + 1}`;
                aggregated[openKey].partialSL[slKey] = trade.pips;
            }
        }
    });

    // Update finalClose for each openKey
    Object.keys(aggregated).forEach(openKey => {
        // Set finalClose to the closing price of the last trade
        const lastTrade = trades.filter(trade => `${trade.symbol}_${trade.entryPrice}_${trade.openingTime}` === openKey)
                                 .reduce((latest, current) => (current.closingTime > latest.closingTime ? current : latest));

        aggregated[openKey].finalClose = lastTrade.closingPrice; // Set the final close to the closing price of the last trade
        aggregated[openKey].totalPips = positionTracking[openKey].totalPips;
    });

    return Object.values(aggregated);
}
