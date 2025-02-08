import { Overview } from "@/utils/aggregatedOverview";
import { create } from "zustand";
import { persist } from "zustand/middleware";



interface TradesStore {
    tradesData: Overview[];
    setTradesData: (data: Overview[]) => void;
    getTradeById: (id: string) => Overview | undefined;
}


export const useTradesStore = create(
    persist<TradesStore>(
        (set, get) => ({
            tradesData: [],
            setTradesData: (data) => set({ tradesData: data }),
            getTradeById: (id) => get().tradesData.find(trade => trade.id === id),
        }),
        {
            name: "trades-storage", // Key for localStorage
        }
    )
);
