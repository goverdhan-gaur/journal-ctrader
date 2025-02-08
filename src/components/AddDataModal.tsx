"use client";
import { motion } from "framer-motion";
import ReadXL from "./ReadXL";
import { ReactNode, MouseEventHandler } from "react";
import { useModalStore } from "@/store/useModalStore";

export function Button({ onClick, children }: { onClick?: MouseEventHandler<HTMLButtonElement>; children: ReactNode }) {
    return (
        <button
            onClick={onClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
            {children}
        </button>
    );
}

export default function AddDataModal() {
    const { isOpen, closeModal } = useModalStore();

    return (
        <div className="flex">
            {isOpen && (
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-9999" />
                    <div
                        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white p-6 rounded-2xl shadow-lg w-96 relative"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
                        >
                            <ReadXL />
                        </motion.div>
                    </div>
                </>
            )}
        </div>

    );
}
