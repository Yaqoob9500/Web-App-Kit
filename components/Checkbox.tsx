
import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, ...props }) => {
    return (
        <label className="flex items-center space-x-2 cursor-pointer bg-gray-700 p-2 rounded-md hover:bg-gray-600 transition">
            <input
                type="checkbox"
                {...props}
                className="h-4 w-4 rounded bg-gray-800 border-gray-600 text-cyan-500 focus:ring-cyan-600 focus:ring-offset-gray-800"
            />
            <span className="text-sm text-gray-300">{label}</span>
        </label>
    );
};

export default Checkbox;
