import { s } from "framer-motion/client";
import { AggregatedData } from "./groupedTrades";

export interface Overview {
    id?: string
    totalProfit: number;
    totalLots: number;
    totalPips: number;
    createdDate: string;
    totalTrades: number;
    sessionDates: { startDate: string | null, endDate: string | null};
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
        totalProfit: Number(totalProfit.toFixed(2)),
        totalLots: Number(totalLots.toFixed(2)),
        totalPips,
        createdDate: new Date().toISOString(),
        totalTrades,
        sessionDates: {
            startDate: getSessionDates(aggregatedData).startDate,
            endDate: getSessionDates(aggregatedData).endDate
        },
        tradeSummary: aggregatedData
    };
}


const getSessionDates = (tradeSummaries: any[]) => {
    // Ensure there are trade summaries
    if (tradeSummaries.length === 0) {
        return { startDate: null, endDate: null };
    }
    const getDate = (trade: any) => {
        // Convert it to a Date object
        const [day, month, year] = trade.date.split('/');
        const [hours, minutes, seconds] = trade.openTime.split(':');

        // Create a new Date object
        return new Date(year, month - 1, day, hours, minutes, seconds.split('.')[0], seconds.split('.')[1]);
    }
    // Get the earliest openTime and latest closeTime
    let startDate: Date = new Date(Math.min(...tradeSummaries.map((trade: any) => getDate(trade).getTime())));
    let endDate: Date = new Date(Math.max(...tradeSummaries.map((trade: any) => getDate(trade).getTime())));
    // Convert to a formatted string (or adjust format as needed)
    const formattedStartDate = startDate.toLocaleString(); // or use .toISOString() for standard format
    const formattedEndDate = endDate.toLocaleString(); // or use .toISOString()

    return { startDate: formattedStartDate, endDate: formattedEndDate };
};

