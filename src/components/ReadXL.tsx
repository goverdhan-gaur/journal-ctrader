"use client";
import { writeData } from '@/utils/addTradesData';
import { generateOverview } from '@/utils/aggregatedOverview';
import {  cleanTradeData, convertKeysToCamelCase } from '@/utils/cleanData';

import { getJsonDataFromExcel } from '@/utils/getJsonFromExcel';
import { aggregateTrades } from '@/utils/groupedTrades';
import React from 'react';


const ReadXL: React.FC = () => {


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
        <div >
            <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} className="mb-4" />

        </div>
    );
};

export default ReadXL;