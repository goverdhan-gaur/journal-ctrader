import { Overview } from '@/utils/aggregatedOverview';
import { database } from '@/utils/firebase.config';
import { ref, remove } from 'firebase/database';
import Link from 'next/link';
import React from 'react';
import { Button } from './AddDataModal';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiDollarSign, FiPieChart, FiTrash2, FiEye } from 'react-icons/fi';

interface BatchListProps {
    batches: Overview[];
    className?: string;
}

const BatchList: React.FC<BatchListProps> = ({ className, batches }) => {
    const handleDelete = async (id: string | undefined) => {
        try {
            const batchRef = ref(database, `trades/${id}`);
            await remove(batchRef);
        } catch (error) {
            console.error("Error deleting batch: ", error);
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className={`mt-8 ${className}`}
        >
            <motion.ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {batches.map((batch, index) => (
                    <motion.li 
                        key={index}
                        variants={item}
                        className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 border border-gray-700 shadow-lg hover:shadow-2xl transition-shadow duration-300"
                    >
                        <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                            Trade Summary
                        </h2>
                        
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <FiPieChart className="text-blue-400" />
                                <p className="text-white/90">
                                    <span className="font-medium">Total Lots:</span> {batch.totalLots}
                                </p>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                                <FiTrendingUp className="text-purple-400" />
                                <p className="text-white/90">
                                    <span className="font-medium">Total Pips:</span> {batch.totalPips}
                                </p>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                                <FiDollarSign className={batch.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'} />
                                <p className="text-white/90">
                                    <span className="font-medium">Total Profit:</span>{' '}
                                    <span className={batch.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}>
                                        ${batch.totalProfit.toFixed(2)}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex space-x-3">
                            <Link href={`/batch/${batch.id}`} className="flex-1">
                                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2">
                                    <FiEye />
                                    <span>View Details</span>
                                </Button>
                            </Link>
                            <Button 
                                onClick={() => handleDelete(batch.id)}
                                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg font-medium transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                            >
                                <FiTrash2 />
                            </Button>
                        </div>
                    </motion.li>
                ))}
            </motion.ul>
        </motion.div>
    );
};

export default BatchList;