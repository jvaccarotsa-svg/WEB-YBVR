"use client";

import { useState } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    bucketName?: string;
    folderPath?: string;
    className?: string;
}

export default function ImageUpload({
    value,
    onChange,
    bucketName = "media",
    folderPath = "uploads",
    className = ""
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            setError("");

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error("You must select an image to upload.");
            }

            const file = event.target.files[0];
            const fileExt = file.name.split(".").pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
            const filePath = `${folderPath}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            // Get Public URL
            const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
            onChange(data.publicUrl);

        } catch (error: any) {
            console.error("Error uploading image:", error);
            setError(error.message || "Error al subir la imagen");
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        // Optional: Delete from storage if needed, but for now just clear the value
        onChange("");
    };

    return (
        <div className={`w-full ${className}`}>
            {value ? (
                <div className="relative group rounded-xl overflow-hidden border border-slate-700 aspect-video bg-slate-900">
                    <img
                        src={value}
                        alt="Uploaded image"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                            onClick={handleRemove}
                            type="button"
                            className="p-2 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-700 border-dashed rounded-xl cursor-pointer bg-slate-900/50 hover:bg-slate-800/50 hover:border-primary/50 transition-all group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {uploading ? (
                            <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                        ) : (
                            <Upload className="w-8 h-8 text-slate-500 group-hover:text-primary transition-colors mb-2" />
                        )}
                        <p className="text-xs text-slate-500 group-hover:text-slate-300">
                            {uploading ? "Subiendo..." : "Click para subir imagen"}
                        </p>
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={uploading}
                    />
                </label>
            )}
            {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
        </div>
    );
}
