"use client";
import { writeData } from '@/utils/addTradesData';
import { generateOverview } from '@/utils/aggregatedOverview';
import {  cleanTradeData, convertKeysToCamelCase } from '@/utils/cleanData';

import { getJsonDataFromExcel } from '@/utils/getJsonFromExcel';
import { aggregateTrades, Position } from '@/utils/groupedTrades';
import React from 'react';

interface ReadXLProps {
    onTradesUpdate: (positions: Position[], trades: CleanedTradeData[]) => void;
}

const ReadXL: React.FC<ReadXLProps> = ({ onTradesUpdate }) => {
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const data = await getJsonDataFromExcel(event);
        // Clean the data
        if (data) {
            const cleanedKeys = convertKeysToCamelCase(data);
            const cleanedData = await cleanTradeData(cleanedKeys);
            const gTrades = aggregateTrades(cleanedData);
            const finalData = generateOverview(gTrades)
            console.log(finalData);
            // writeData(gTrades);
            // add aggregated columns
            // const aggregatedData = addAggregatedColumns(cleanedData);
          
        }
    };

    return (
        <label 
            htmlFor="excel-upload" 
            className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-gray-400 focus:outline-none"
        >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">Excel files only (.xlsx, .xls, .csv)</p>
            </div>
            <input
                id="excel-upload"
                type="file"
                className="hidden"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
            />
        </label>
    );
};

export default ReadXL;