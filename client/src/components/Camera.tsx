import React, { useRef, useState } from 'react';
import { Camera as CameraIcon, Upload } from 'lucide-react';
import { Button } from './Button';

interface CameraProps {
    onCapture: (file: File) => void;
}

export const Camera: React.FC<CameraProps> = ({ onCapture }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            onCapture(file);
        }
    };

    const triggerCamera = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
            />

            {preview ? (
                <div className="w-64 h-64 border-4 border-black bg-gray-100 relative">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                        onClick={() => setPreview(null)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 border-2 border-black font-bold"
                    >
                        X
                    </button>
                </div>
            ) : (
                <div className="w-64 h-64 border-4 border-black border-dashed flex items-center justify-center bg-gray-50">
                    <p className="text-gray-400 font-bold">No Image</p>
                </div>
            )}

            <Button onClick={triggerCamera} variant="primary" className="flex items-center gap-2">
                <CameraIcon />
                <span>SNAP PROOF</span>
            </Button>
        </div>
    );
};
