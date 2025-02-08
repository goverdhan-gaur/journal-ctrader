import React, { ReactNode } from "react";

interface KpiGridProps {
    children: ReactNode; // Accept children as ReactNode
    layout?: "grid" | "flex"; // Allow flexible layout (grid or flex)
    className?: string; // Allow custom class names
}

const KpiGrid: React.FC<KpiGridProps> = ({ className, children, layout = "grid" }) => {
    const gridClasses = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"; // Grid classes for responsive design
    const flexClasses = "flex flex-wrap justify-start gap-6"; // Flex classes for responsive design

    return (
        <div className={`${layout === "grid" ? gridClasses : flexClasses} ${className}`}>
            {children} {/* Render the children passed to KpiGrid */}
        </div>
    );
};

export default KpiGrid;
