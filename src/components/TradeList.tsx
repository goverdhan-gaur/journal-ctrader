import { TradeData } from '@/utils/cleanData';
import { AggregatedData } from '@/utils/groupedTrades';
import Link from 'next/link';
import React from 'react';
import { motion } from 'framer-motion';
import { FiEye } from 'react-icons/fi';

interface TradeListProps {
    id?: string;
    trades: AggregatedData[];
}

const TradeList: React.FC<TradeListProps> = ({ id, trades }) => {
    return (
        <motion.div 
            className='mt-5 p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center'>Trade List</h2>
            <div className="overflow-x-auto">
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
                            <motion.tr 
                                key={trade.id} 
                                className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{trade.symbol}</td>
                                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{trade.date}</td>
                                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{trade.openTime}</td>
                                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{trade.openPrice}</td>
                                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{trade.finalClose}</td>
                                <td className="px-6 py-4 font-semibold text-blue-600 dark:text-blue-400">{trade.totalLots.toFixed(2)}</td>
                                <td className={`px-6 py-4 font-semibold ${trade.totalProfit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                    {trade.totalProfit.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{trade.trades.length}</td>
                                <td className="px-6 py-4 text-center">
                                    <Link href={`/batch/${id}/trade/${trade.id}`}>
                                        <motion.button 
                                            className="flex items-center justify-center gap-2 px-4 py-2 text-white font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg shadow-md transition-transform transform hover:scale-105"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <FiEye size={18} /> View
                                        </motion.button>
                                    </Link>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default TradeList;
