"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "../../actions";
import { Save, AlertCircle, UploadCloud, X, Image as ImageIcon, Plus, Trash2, List } from "lucide-react";

const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  sku: z.string().min(3, "SKU is required"),
  price: z.number().min(1, "Price must be greater than 0"),
  categoryId: z.string().min(1, "Please select a category"),
  description: z.string().optional(),
  isCombo: z.boolean(),
  isOffer: z.boolean(),
  isUpcoming: z.boolean(),
  isPreBooking: z.boolean(),
  discountPercent: z.number().optional(),
  availableDate: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export function ProductForm({ categories, product }: { categories: any[], product?: any }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // State for images
  const [existingImages, setExistingImages] = useState<string[]>(
    product?.images?.map((img: any) => img.url) || []
  );
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for attributes
  const [attributes, setAttributes] = useState<{name: string, value: string}[]>(
    product?.attributes?.map((attr: any) => ({ name: attr.name, value: attr.value })) || []
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      name: product.name,
      sku: product.sku,
      price: product.basePrice,
      categoryId: product.categoryId,
      description: product.description || "",
      isCombo: product.isCombo || false,
      isOffer: product.isOffer || false,
      isUpcoming: product.isUpcoming || false,
      isPreBooking: product.isPreBooking || false,
      discountPercent: product.discountPercent || 0,
      availableDate: product.availableDate ? new Date(product.availableDate).toISOString().split('T')[0] : "",
    } : {
      // International standard alphanumeric SKU (e.g. SKU-A7X9F2M1)
      sku: `SKU-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      isCombo: false,
      isOffer: false,
      isUpcoming: false,
      isPreBooking: false,
      discountPercent: 0,
      availableDate: "",
    }
  });

  const isOffer = watch("isOffer");
  const isUpcoming = watch("isUpcoming");
  const isPreBooking = watch("isPreBooking");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setNewFiles(prev => [...prev, ...filesArray]);
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewFile = (index: number) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addAttribute = () => {
    setAttributes([...attributes, { name: "", value: "" }]);
  };

  const updateAttribute = (index: number, field: "name" | "value", val: string) => {
    const newAttrs = [...attributes];
    newAttrs[index][field] = val;
    setAttributes(newAttrs);
  };

  const removeAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormValues) => {
    setIsPending(true);
    setError("");

    try {
      let finalImageUrls = [...existingImages];

      // Upload new files if any
      if (newFiles.length > 0) {
        setIsUploading(true);
        const uploadData = new FormData();
        newFiles.forEach(file => uploadData.append("files", file));

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadData
        });

        if (!uploadRes.ok) throw new Error("Failed to upload images");
        
        const uploadJson = await uploadRes.json();
        if (uploadJson.urls) {
          finalImageUrls = [...finalImageUrls, ...uploadJson.urls];
        }
        setIsUploading(false);
      }

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("sku", data.sku);
      formData.append("price", data.price.toString());
      formData.append("categoryId", data.categoryId);
      if (data.description) formData.append("description", data.description);
      
      // Pass images and attributes as JSON string
      formData.append("images", JSON.stringify(finalImageUrls));
      
      // Filter out empty attributes before saving
      const validAttributes = attributes.filter(a => a.name.trim() !== "" && a.value.trim() !== "");
      formData.append("attributes", JSON.stringify(validAttributes));

      // Append marketing flags
      formData.append("isCombo", String(data.isCombo));
      formData.append("isOffer", String(data.isOffer));
      formData.append("isUpcoming", String(data.isUpcoming));
      formData.append("isPreBooking", String(data.isPreBooking));
      if (data.discountPercent) formData.append("discountPercent", data.discountPercent.toString());
      if (data.availableDate) formData.append("availableDate", data.availableDate);

      if (product) {
        const res = await updateProduct(product.id, formData);
        if (res.error) throw new Error(res.error);
      } else {
        const res = await createProduct(formData);
        if (res.error) throw new Error(res.error);
      }
      
      router.push("/admin/products");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setIsPending(false);
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2 border border-red-100">
          <AlertCircle className="w-5 h-5" />
          <p className="font-semibold text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Product Name</label>
          <input
            {...register("name")}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand focus:outline-none text-gray-900 bg-white"
            placeholder="e.g. Premium Cotton T-Shirt"
          />
          {errors.name && <p className="text-red-500 text-xs font-bold">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">SKU (Stock Keeping Unit)</label>
          <input
            {...register("sku")}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand focus:outline-none text-gray-900 bg-white"
            placeholder="e.g. SKU-A7X9F2M1"
          />
          {errors.sku && <p className="text-red-500 text-xs font-bold">{errors.sku.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Base Price (৳)</label>
          <input
            type="number"
            {...register("price", { valueAsNumber: true })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand focus:outline-none text-gray-900 bg-white"
            placeholder="e.g. 500"
          />
          {errors.price && <p className="text-red-500 text-xs font-bold">{errors.price.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Category</label>
          <select
            {...register("categoryId")}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand focus:outline-none text-gray-900 bg-white"
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.categoryId && <p className="text-red-500 text-xs font-bold">{errors.categoryId.message}</p>}
        </div>

        {/* Marketing Flags */}
        <div className="space-y-4 md:col-span-2 border-t border-gray-100 pt-6 mt-2">
          <label className="text-sm font-bold text-gray-700 flex items-center gap-2">🚀 Advanced Merchandising (Top 1 Features)</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="flex items-center gap-2 p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-brand transition-colors bg-white">
              <input type="checkbox" {...register("isCombo")} className="w-5 h-5 text-brand rounded focus:ring-brand" />
              <span className="font-bold text-gray-700 text-sm">Combo Product</span>
            </label>
            <label className="flex items-center gap-2 p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-brand transition-colors bg-white">
              <input type="checkbox" {...register("isOffer")} className="w-5 h-5 text-brand rounded focus:ring-brand" />
              <span className="font-bold text-gray-700 text-sm">Flash Offer</span>
            </label>
            <label className="flex items-center gap-2 p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-brand transition-colors bg-white">
              <input type="checkbox" {...register("isUpcoming")} className="w-5 h-5 text-brand rounded focus:ring-brand" />
              <span className="font-bold text-gray-700 text-sm">Upcoming (Teaser)</span>
            </label>
            <label className="flex items-center gap-2 p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-brand transition-colors bg-white">
              <input type="checkbox" {...register("isPreBooking")} className="w-5 h-5 text-brand rounded focus:ring-brand" />
              <span className="font-bold text-gray-700 text-sm">Pre-Booking Allowed</span>
            </label>
          </div>

          {(isOffer || isUpcoming || isPreBooking) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-brand/5 border border-brand/20 rounded-xl animate-in fade-in">
              {isOffer && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Discount Percentage (%)</label>
                  <input
                    type="number"
                    {...register("discountPercent", { valueAsNumber: true })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand focus:outline-none text-gray-900 bg-white"
                    placeholder="e.g. 20"
                  />
                </div>
              )}
              {(isUpcoming || isPreBooking) && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Available Date</label>
                  <input
                    type="date"
                    {...register("availableDate")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand focus:outline-none text-gray-900 bg-white"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Multi-Image Uploader */}
        <div className="space-y-2 md:col-span-2 border-t border-gray-100 pt-6 mt-2">
          <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><ImageIcon className="w-4 h-4"/> Product Images</label>
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-gray-300 hover:border-brand bg-gray-50 hover:bg-brand/5 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors text-gray-500 group"
          >
            <UploadCloud className="w-10 h-10 mb-3 text-gray-400 group-hover:text-brand transition-colors" />
            <p className="font-bold text-gray-700">Click to upload images</p>
            <p className="text-sm">PNG, JPG, WEBP up to 5MB</p>
            <input 
              type="file" 
              multiple 
              accept="image/*"
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileSelect}
            />
          </div>

          {/* Image Previews */}
          {(existingImages.length > 0 || newFiles.length > 0) && (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
              {existingImages.map((url, i) => (
                <div key={`existing-${i}`} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                  <img src={url} alt="Product preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={() => removeExistingImage(i)} className="bg-white text-red-600 p-2 rounded-full hover:scale-110 transition-transform">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {i === 0 && <span className="absolute top-2 left-2 bg-brand text-white text-[10px] font-bold px-2 py-1 rounded">Primary</span>}
                </div>
              ))}
              
              {newFiles.map((file, i) => (
                <div key={`new-${i}`} className="relative aspect-square rounded-xl overflow-hidden border border-brand group">
                  <img src={URL.createObjectURL(file)} alt="New upload" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={() => removeNewFile(i)} className="bg-white text-red-600 p-2 rounded-full hover:scale-110 transition-transform">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded">New</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2 md:col-span-2 border-t border-gray-100 pt-6 mt-2">
          <label className="text-sm font-bold text-gray-700">Description</label>
          <textarea
            {...register("description")}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand focus:outline-none text-gray-900 bg-white"
            placeholder="Detailed product description..."
          />
        </div>

        {/* Specifications / Attributes Builder */}
        <div className="space-y-4 md:col-span-2 border-t border-gray-100 pt-6 mt-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <List className="w-4 h-4" /> Product Specifications (Attributes)
            </label>
            <button
              type="button"
              onClick={addAttribute}
              className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Specification
            </button>
          </div>
          
          {attributes.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center text-gray-500 text-sm">
              No specifications added yet. Click "Add Specification" to list sizes, colors, fabric, etc.
            </div>
          ) : (
            <div className="space-y-3">
              {attributes.map((attr, index) => (
                <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <div className="w-1/3">
                    <input
                      type="text"
                      value={attr.name}
                      onChange={(e) => updateAttribute(index, "name", e.target.value)}
                      placeholder="e.g. Color"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:outline-none text-sm text-gray-900"
                    />
                  </div>
                  <div className="w-full">
                    <input
                      type="text"
                      value={attr.value}
                      onChange={(e) => updateAttribute(index, "value", e.target.value)}
                      placeholder="e.g. Ash, Blue, Maroon"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:outline-none text-sm text-gray-900"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAttribute(index)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="bg-brand hover:bg-brand-dark text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          {isUploading ? "Uploading Images..." : isPending ? "Saving..." : <><Save className="w-5 h-5" /> Save Product</>}
        </button>
      </div>
    </form>
  );
}
