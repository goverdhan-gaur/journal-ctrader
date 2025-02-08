import { TradeData } from '@/utils/cleanData';
import { AggregatedData } from '@/utils/groupedTrades';
import { tr } from 'framer-motion/client';
import Link from 'next/link';
import React from 'react';

interface TradeListProps {
    id? :string;
    trades: AggregatedData[];
}

const TradeList: React.FC<TradeListProps> = ({ id, trades }) => {
    console.log(id)
    return (
        <div className='mt-5'>
            <h2>Trade List</h2>


            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Symbol
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Date
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Open Time
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Open Price
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Close Price
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Lots
                            </th>
                            <th scope="col" className="px-6 py-3">
                                PnL
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Positions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {trades.map((trade, index) => (
                            <tr key={trade.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {trade.symbol}
                                </th>
                                <td className="px-6 py-4">
                                    {trade.date}
                                </td>
                                <td className="px-6 py-4">
                                    {trade.openTime}
                                </td>
                                <td className="px-6 py-4">
                                    {trade.openPrice}
                                </td>
                                <td className="px-6 py-4">
                                    {trade.finalClose}
                                </td>
                                <td className="px-6 py-4">
                                    {trade.totalLots.toFixed(2)}
                                </td>
                                <td className="px-6 py-4">
                                    {trade.totalProfit.toFixed(2)}
                                </td>
                                <td className="px-6 py-4">
                                    {trade.trades.length}
                                </td>
                                <td className="px-6 sticky right-0 py-4">
                                    <Link href={`/batch/${id}/trade/${trade.id}`} >
                                    View Details </Link>
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default TradeList;