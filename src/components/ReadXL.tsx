"use client";
import { writeData } from '@/utils/addTradesData';
import { cleanTradeData, convertKeysToCamelCase, CleanedTradeData } from '@/utils/cleanData';
import { getJsonDataFromExcel } from '@/utils/getJsonFromExcel';
import { aggregateTrades, Position } from '@/utils/groupedTrades';
import React from 'react';

interface ReadXLProps {
    onTradesUpdate: (positions: Position[], trades: CleanedTradeData[]) => void;
}

const ReadXL: React.FC<ReadXLProps> = ({ onTradesUpdate }) => {
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            console.log('File upload started');
            const data = await getJsonDataFromExcel(event);
            console.log('Raw Excel data:', data);
            
            if (data) {
                const cleanedKeys = convertKeysToCamelCase(data);
                console.log('Data with cleaned keys:', cleanedKeys);
                
                const cleanedData = await cleanTradeData(cleanedKeys);
                console.log('Cleaned trade data:', cleanedData);
                
                const positions = aggregateTrades(cleanedData);
                console.log('Aggregated positions:', positions);
                
                if (!Array.isArray(positions)) {
                    console.error('Expected positions to be an array');
                    return;
                }

                // Validate each position has required fields
                const validPositions = positions.filter(position => {
                    const isValid = position && 
                           position.symbol && 
                           position.openingDir && 
                           position.trades && 
                           Array.isArray(position.trades);
                    
                    if (!isValid) {
                        console.error('Invalid position:', position);
                    }
                    return isValid;
                });

                console.log('Valid positions:', validPositions);
                onTradesUpdate(validPositions, cleanedData);
                await writeData(validPositions);
            }
        } catch (error) {
            console.error('Error processing file:', error);
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