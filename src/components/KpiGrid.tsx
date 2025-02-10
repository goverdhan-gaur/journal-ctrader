import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface KpiGridProps {
    children: ReactNode;
    layout?: "grid" | "flex";
    className?: string;
}

const KpiGrid: React.FC<KpiGridProps> = ({ className, children, layout = "grid" }) => {
    const gridClasses = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8";
    const flexClasses = "flex flex-wrap justify-center gap-8";

    return (
        <div className="relative p-10">
            {/* 🔥 Animated Background */}
            <div className="absolute inset-0 overflow-hidden z-0">
                <div className="absolute top-[-50%] left-[20%] w-[400px] h-[400px] bg-purple-500 rounded-full blur-[120px] opacity-30 animate-pulse"></div>
                <div className="absolute bottom-[-50%] right-[10%] w-[500px] h-[500px] bg-blue-500 rounded-full blur-[140px] opacity-30 animate-pulse"></div>
            </div>

            {/* 🌟 Main Grid with Glassmorphism & Glow */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`
                    relative z-10
                    ${layout === "grid" ? gridClasses : flexClasses} 
                    ${className} p-8 bg-white/10 backdrop-blur-lg 
                    border border-white/20 rounded-2xl shadow-2xl 
                    hover:shadow-xl transition-shadow duration-300
                `}
            >
                {children}
            </motion.div>
        </div>
    );
};

export default KpiGrid;
