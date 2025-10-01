
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  prefix?: string;
}

export const Input: React.FC<InputProps> = ({ className, prefix, ...props }) => {
    return (
        <div className="relative flex-1">
            {prefix && (
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 text-sm">
                    {prefix}
                </span>
            )}
            <input
                className={`w-full bg-gray-700 border border-gray-600 rounded-md py-2 text-sm text-white focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${prefix ? 'pl-9 pr-3' : 'px-3'} ${className}`}
                {...props}
            />
        </div>
    );
};
