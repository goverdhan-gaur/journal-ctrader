import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaQuestionCircle } from "react-icons/fa";

interface KpiCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon?: React.ReactNode;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, description, icon }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <motion.div
            className="relative bg-gradient-to-br from-[#1e293b] to-[#0f172a] p-6 sm:p-8 rounded-3xl shadow-2xl border border-gray-700 backdrop-blur-xl transition-all duration-300 transform hover:scale-[1.07] hover:shadow-blue-500/40 overflow-hidden w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <motion.div 
                className="absolute inset-0 rounded-3xl border-2 border-transparent hover:border-[#60a5fa] transition-all duration-300 opacity-30" 
                whileHover={{ opacity: 1 }} 
            />
            
            <div className="flex flex-col items-center text-center relative">
                <div className="flex items-center gap-4">
                    {icon && <div className="text-4xl text-[#60a5fa] drop-shadow-lg">{icon}</div>}
                    <h3 className="text-xl font-bold text-gray-200 drop-shadow-md">{title}</h3>
                </div>
                {description && (
                    <div
                        className="absolute top-0 right-0 p-1 cursor-pointer"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                    >
                        <FaQuestionCircle className="text-xl text-gray-400 hover:text-gray-100 transition-all" />
                    </div>
                )}
            </div>

            <motion.p
                className="text-4xl font-extrabold text-white mt-6 mb-2 drop-shadow-xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {value}
            </motion.p>

            {showTooltip && description && (
                <motion.div
                    className="absolute top-10 right-0 mt-2 p-2 bg-gray-900 text-white text-xs rounded-md shadow-lg max-w-xs"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                >
                    {description}
                </motion.div>
            )}
        </motion.div>
    );
};

export default KpiCard;
