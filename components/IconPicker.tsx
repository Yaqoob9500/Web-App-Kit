import React, { useState, useRef, ChangeEvent } from 'react';

interface IconPickerProps {
    onIconSelect: (base64: string | null) => void;
}

const IconPicker: React.FC<IconPickerProps> = ({ onIconSelect }) => {
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.type === 'image/png') {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = reader.result as string;
                    setPreview(base64String);
                    // Pass only the base64 content, not the data URL prefix
                    onIconSelect(base64String.split(',')[1] || null);
                };
                reader.readAsDataURL(file);
            } else {
                alert('Please select a PNG file.');
            }
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">App Icon (512x512 PNG)</label>
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-700 rounded-md flex items-center justify-center border-2 border-dashed border-gray-600">
                    {preview ? (
                        <img src={preview} alt="Icon Preview" className="w-full h-full object-cover rounded-md" />
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    )}
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/png"
                    className="hidden"
                />
                <button
                    type="button"
                    onClick={handleButtonClick}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition"
                >
                    Choose Icon
                </button>
            </div>
        </div>
    );
};

export default IconPicker;