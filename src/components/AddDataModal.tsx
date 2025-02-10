"use client";
import { motion, AnimatePresence } from "framer-motion";
import ReadXL from "./ReadXL";
import { ReactNode, MouseEventHandler } from "react";
import { useModalStore } from "@/store/useModalStore";
import { FiX } from "react-icons/fi";

// Reusable Button Component
export function Button({
    onClick,
    children,
    className = "",
}: {
    onClick?: MouseEventHandler<HTMLButtonElement>;
    children: ReactNode;
    className?: string;
}) {
    return (
        <button
            onClick={onClick}
            className={`px-6 py-3 rounded-lg transition-all duration-300 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg hover:scale-105 active:scale-95 ${className}`}
        >
            {children}
        </button>
    );
}

// Animation Variants
const backdrop = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const modal = {
    hidden: { opacity: 0, y: -50, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", damping: 25, stiffness: 500 },
    },
    exit: { opacity: 0, y: 50, scale: 0.95, transition: { duration: 0.2 } },
};

// Modal Component
export default function AddDataModal() {
    const { isOpen, closeModal } = useModalStore();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Modal Backdrop */}
                    <motion.div
                        variants={backdrop}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="fixed inset-0 bg-black/50 backdrop-blur-md z-50"
                        onClick={closeModal}
                    />
                    {/* Modal Box */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <motion.div
                            variants={modal}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl shadow-2xl w-full max-w-lg relative border border-white/10 transition-all duration-300 hover:scale-105"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={closeModal}
                                aria-label="Close modal"
                                className="absolute top-4 right-4 text-white/80 hover:text-white transition-transform transform hover:scale-110"
                            >
                                <FiX size={28} />
                            </button>

                            {/* Modal Header */}
                            <div className="mb-6 text-center">
                                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 animate-pulse">
                                    Add Trade Data
                                </h2>
                                <p className="text-white/70 mt-2">
                                    Upload your trade data from an Excel file
                                </p>
                            </div>

                            {/* File Upload Component */}
                            <ReadXL />
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
