import React from 'react';
import AddDataModal, { Button } from './AddDataModal';
import { useModalStore } from '@/store/useModalStore';
import { motion } from 'framer-motion';

interface HeaderProps {
    className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
    const { openModal } = useModalStore();
    
    return (
        <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`${className} flex justify-between items-center z-10 mb-6 p-4 bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg rounded-xl`}
        >
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex items-center space-x-4"
            >
                <div className="relative group">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                        Journal cTrader
                    </h1>
                    <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </div>
            </motion.div>
            
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
            >
                <Button 
                    onClick={openModal}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2.5 rounded-lg font-medium transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                    + Add Trades
                </Button>
            </motion.div>
        </motion.header>
    );
};

export default Header;