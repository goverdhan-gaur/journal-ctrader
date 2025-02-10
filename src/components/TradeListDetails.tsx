import { CleanedTradeData } from '@/utils/cleanData';
import Link from 'next/link';
import React from 'react';

interface TradeListProps {
    id: string;
    tradeId: string;
    trades: CleanedTradeData[];
}

const TradeListDetails: React.FC<TradeListProps> = ({ id, tradeId, trades }) => {
    return (
        <div className='mt-5 p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg'>
            <h2 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center'>Trade List Details</h2>

            <div className="relative overflow-x-auto">
                <table className="w-full border-collapse bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                    <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm uppercase">
                        <tr>
                            {['Symbol', 'Date', 'Open Time', 'Open Price', 'Close Price', 'Lots', 'PnL', 'Positions', 'Actions'].map((header) => (
                                <th key={header} className="px-6 py-3 text-left font-semibold">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {trades.map((trade, index) => (
                            <tr key={index} className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{trade.symbol}</td>
                                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{trade.openingDate}</td>
                                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{trade.openingTime}</td>
                                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{trade.entryPrice}</td>
                                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{trade.closingPrice}</td>
                                <td className="px-6 py-4 font-semibold text-blue-600 dark:text-blue-400">{trade.closingQuantity}</td>
                                <td className={`px-6 py-4 font-semibold ${trade.net >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                    {trade.net.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{index + 1}</td>
                                <td className="px-6 py-4 text-center">
                                    <Link href={`/batch/${id}/trade/${tradeId}/${index}`}>
                                        <button className="px-4 py-2 text-white font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg shadow-md transition-transform transform hover:scale-105">
                                            View Details
                                        </button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TradeListDetails;
