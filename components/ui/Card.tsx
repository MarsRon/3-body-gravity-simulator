
import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
    return (
        <div className={`bg-gray-900/50 p-4 rounded-lg border border-gray-700/50 ${className}`}>
            {children}
        </div>
    );
};
