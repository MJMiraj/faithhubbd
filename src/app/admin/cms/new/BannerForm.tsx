"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Save, AlertCircle, UploadCloud, X } from "lucide-react";
import { createBanner } from "../actions";

export function BannerForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    setIsPending(true);
    setError("");

    try {
      if (!file) throw new Error("Please select a banner image.");

      // Upload image
      setIsUploading(true);
      const uploadData = new FormData();
      uploadData.append("files", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: uploadData
      });

      if (!uploadRes.ok) throw new Error("Failed to upload image");
      const uploadJson = await uploadRes.json();
      const imageUrl = uploadJson.urls[0];
      setIsUploading(false);

      // Create banner
      formData.append("images", JSON.stringify([imageUrl]));
      
      const res = await createBanner(formData);
      if (res.error) throw new Error(res.error);
      
      router.push("/admin/cms");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setIsPending(false);
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2 border border-red-100">
          <AlertCircle className="w-5 h-5" />
          <p className="font-semibold text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Banner Title (Optional)</label>
          <input
            name="title"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl focus:ring-2 focus:ring-brand focus:outline-none dark:text-white"
            placeholder="e.g. Summer Sale 2026"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Target Link (Optional)</label>
          <input
            name="link"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl focus:ring-2 focus:ring-brand focus:outline-none dark:text-white"
            placeholder="e.g. /shop?tag=summer"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Display Order</label>
            <input
              name="order"
              type="number"
              defaultValue={0}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl focus:ring-2 focus:ring-brand focus:outline-none dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Visibility</label>
            <select name="isActive" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl focus:ring-2 focus:ring-brand focus:outline-none dark:text-white">
              <option value="true">Active (Visible)</option>
              <option value="false">Hidden</option>
            </select>
          </div>
        </div>

        <div className="space-y-2 pt-4">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Desktop Banner Image (21:9 ratio recommended)</label>
          {!file ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-brand dark:hover:border-brand bg-gray-50 dark:bg-gray-900/50 hover:bg-brand/5 rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer transition-colors text-gray-500 group"
            >
              <UploadCloud className="w-10 h-10 mb-3 text-gray-400 group-hover:text-brand transition-colors" />
              <p className="font-bold text-gray-700 dark:text-gray-300">Click to upload banner</p>
              <p className="text-sm">High-res JPG or WEBP</p>
              <input 
                type="file" 
                accept="image/*"
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileSelect}
              />
            </div>
          ) : (
            <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden border border-brand group bg-gray-100">
              <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button type="button" onClick={() => setFile(null)} className="bg-white text-red-600 p-3 rounded-full hover:scale-110 transition-transform shadow-xl">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="pt-6 flex justify-end">
        <button 
          type="submit"
          disabled={isPending || isUploading}
          className="bg-brand hover:bg-brand-dark text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-brand/20 hover:-translate-y-0.5 active:translate-y-0"
        >
          {isPending || isUploading ? "Uploading & Saving..." : <><Save className="w-5 h-5" /> Publish Slider</>}
        </button>
      </div>
    </form>
  );
}
