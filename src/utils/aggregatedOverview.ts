import { AggregatedData } from "./groupedTrades";

interface Overview {
    totalProfit: number;
    totalLots: number;
    totalPips: number;
    totalTrades: number;
    tradeSummary: AggregatedData[];
}

export function generateOverview(aggregatedData: AggregatedData[]): Overview {
    let totalProfit = 0;
    let totalLots = 0;
    let totalPips = 0;
    let totalTrades = 0;

    aggregatedData.forEach(group => {
        // Sum up profit, commission, and lots from each group
        totalProfit += group.totalProfit;
        totalLots += group.totalLots;
        totalPips += group.totalPips;  
    });
    totalTrades = aggregatedData.length;
    return {
        totalProfit : Number(totalProfit.toFixed(2)),
        totalLots : Number(totalLots.toFixed(2)),
        totalPips,
        totalTrades,
        tradeSummary: aggregatedData
    };
}
