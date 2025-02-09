import { Overview } from "@/utils/aggregatedOverview";
import { AggregatedData } from "@/utils/groupedTrades";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TradesStore {
    tradesData: Overview[];
    setTradesData: (data: Overview[]) => void;
    getTradeById: (id: string) => Overview | undefined;
    getSpecificTrade: (id: string, tradeId: string) => AggregatedData | undefined;
}

export const useTradesStore = create(
    persist<TradesStore>(
        (set, get) => ({
            tradesData: [],
            setTradesData: (data) => set({ tradesData: data }),
            getTradeById: (id) => get().tradesData.find(trade => trade.id === id),
            getSpecificTrade: (id, tradeId) => {
                console.log(id, tradeId);
                const trades = get().getTradeById(id);
                console.log(trades);
                return trades?.tradeSummary.find(t => t.id === tradeId);
            }
        }),
        {
            name: "trades-storage", // Key for localStorage
        }
    )
);
