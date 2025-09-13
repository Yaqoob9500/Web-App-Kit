
import React from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const TextInput: React.FC<TextInputProps> = ({ label, ...props }) => {
    const { required } = props;
    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
                {label} {required && <span className="text-red-400">*</span>}
            </label>
            <input
                {...props}
                className="w-full bg-gray-700 border border-gray-600 text-gray-200 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
            />
        </div>
    );
};

export default TextInput;
