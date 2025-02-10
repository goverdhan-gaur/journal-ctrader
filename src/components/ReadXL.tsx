"use client";
import useFileProcessing from "@/hooks/useFileProcessing";
import { useModalStore } from "@/store/useModalStore";
import { writeData } from "@/utils/addTradesData";
import { generateOverview } from "@/utils/aggregatedOverview";
import { cleanTradeData, convertKeysToCamelCase } from "@/utils/cleanData";
import { getJsonDataFromExcel } from "@/utils/getJsonFromExcel";
import { aggregateTrades } from "@/utils/groupedTrades";
import React, { DragEventHandler, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUploadCloud, FiFile, FiLoader, FiCheckCircle } from "react-icons/fi";

const ReadXL: React.FC = () => {
    const { closeModal } = useModalStore();
    const { isLoading, processFileData } = useFileProcessing();
    const [isDragging, setIsDragging] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploadSuccess(false);
        const data = await getJsonDataFromExcel(file);
        if (data) {
            processFileData(data, async (processedData) => {
                try {
                    const cleanedKeys = convertKeysToCamelCase(processedData);
                    const cleanedData = await cleanTradeData(cleanedKeys);
                    const gTrades = aggregateTrades(cleanedData);
                    const finalData = generateOverview(gTrades);
                    console.log(finalData);
                    await writeData(finalData);
                    setUploadSuccess(true);
                    setTimeout(closeModal, 1500);
                } catch (e) {
                    console.log(e);
                }
            });
        }
    };

    const handleDrop: DragEventHandler<HTMLDivElement> = async (event) => {
        event.preventDefault();
        setIsDragging(false);

        const file = event.dataTransfer.files?.[0];
        if (!file) return;

        setUploadSuccess(false);
        const data = await getJsonDataFromExcel(file);
        if (data) {
            processFileData(data, async (processedData) => {
                try {
                    const cleanedKeys = convertKeysToCamelCase(processedData);
                    const cleanedData = await cleanTradeData(cleanedKeys);
                    const gTrades = aggregateTrades(cleanedData);
                    const finalData = generateOverview(gTrades);
                    console.log(finalData);
                    await writeData(finalData);
                    setUploadSuccess(true);
                    setTimeout(closeModal, 1500);
                } catch (e) {
                    console.log(e);
                }
            });
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <motion.div
                className={`w-full relative ${isLoading ? "pointer-events-none" : ""}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div
                    className={`
                        relative group
                        w-full h-48 
                        rounded-xl
                        transition-all duration-300
                        ${isDragging
                            ? "border-2 border-dashed border-blue-400 bg-blue-400/10 shadow-lg shadow-blue-400/50"
                            : "border-2 border-dashed border-white/20 hover:border-blue-400/50 hover:bg-white/5"
                        }
                    `}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                >
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex flex-col items-center justify-center text-white/60"
                            >
                                <FiLoader className="w-8 h-8 animate-spin mb-3 text-blue-400" />
                                <p className="text-sm">Processing your file...</p>
                            </motion.div>
                        ) : uploadSuccess ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex flex-col items-center justify-center text-green-400"
                            >
                                <FiCheckCircle className="w-12 h-12 mb-3" />
                                <p className="text-lg font-medium">Upload Successful!</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="upload"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex flex-col items-center justify-center"
                            >
                                <div className="relative">
                                    <FiUploadCloud className={`w-12 h-12 mb-4 transition-colors duration-300 ${isDragging ? "text-blue-400" : "text-white/40 group-hover:text-white/60"}`} />
                                    <motion.div
                                        animate={{ y: [0, -8, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute -top-1 -right-1"
                                    >
                                        <FiFile className="w-4 h-4 text-blue-400" />
                                    </motion.div>
                                </div>

                                <p className={`text-lg font-medium mb-1 transition-colors duration-300 ${isDragging ? "text-blue-400" : "text-white/90"}`}>
                                    Drop your file here
                                </p>
                                <p className="text-sm text-white/60">
                                    or <span className="text-blue-400 hover:text-blue-500 cursor-pointer">browse</span>
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <label htmlFor="file-upload" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                        <input
                            id="file-upload"
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleFileUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </label>

                </div>
            </motion.div>
        </div>
    );
};

export default ReadXL;
