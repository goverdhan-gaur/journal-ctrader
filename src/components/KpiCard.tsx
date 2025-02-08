import React, { useState } from "react";
import { FaQuestionCircle } from "react-icons/fa"; // Example question mark icon

interface KpiCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon?: React.ReactNode;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, description, icon }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center w-full relative">
            <div className="flex items-center mb-4">
            {icon && <div className="mr-2" aria-hidden="true">{icon}</div>}
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            {description && (
            <div
            className="absolute top-0 right-0 p-1 cursor-pointer"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            aria-describedby="tooltip"
            >
            <FaQuestionCircle className="text-xl text-gray-700" aria-hidden="true" />
            </div>
            )}
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-2">{value}</p>
            {showTooltip && description && (
            <div
            id="tooltip"
            role="tooltip"
            className="absolute top-0 right-0 mt-8 p-2 bg-gray-700 text-white text-xs rounded-md shadow-lg max-w-xs"
            >
            {description}
            </div>
            )}
        </div>
    );
};

export default KpiCard;
