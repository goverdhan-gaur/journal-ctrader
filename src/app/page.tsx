"use client";
import AddDataModal from "@/components/AddDataModal";
import BatchList from "@/components/BatchList";
import Header from "@/components/Header";
import { database } from "@/utils/firebase.config";
import { onValue, ref } from "firebase/database";
import { useEffect } from "react";
import { useTradesStore } from "@/store/useTradeStore";

export default function Home() {
    const { tradesData, setTradesData } = useTradesStore();

    useEffect(() => {
        const cachedData = localStorage.getItem("tradesData");
        
        if (cachedData) {
            setTradesData(JSON.parse(cachedData));
        }

        const dbRef = ref(database, "trades");

        const unsubscribe = onValue(dbRef, (snapshot) => {
            const data = snapshot.exists() ? snapshot.val() : {};
            const newDataArray = Object.keys(data).map(key => ({
                id: key,
                ...data[key]
            }));

            // Update Zustand state and localStorage
            setTradesData(newDataArray);
            localStorage.setItem("tradesData", JSON.stringify(newDataArray));
        });

        return () => unsubscribe(); // Cleanup
    }, [setTradesData]);

    return (
        <div className="container mx-auto p-4">
            <Header />
            <BatchList batches={tradesData}/> 
            <AddDataModal />
        </div>
    );
}
