"use client";

import { useState } from "react";
import { Save, Globe, Phone, Mail, MapPin, CreditCard, CheckCircle } from "lucide-react";
import { updateStoreSettings } from "./actions";

export function SettingsForm({ settings }: { settings: any }) {
  const [isPending, setIsPending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setSuccess(false);
    
    const formData = new FormData(e.currentTarget);
    const res = await updateStoreSettings(formData);
    
    if (res.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setIsPending(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-black rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Settings Header */}
      <div className="p-8 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <Globe className="text-brand w-6 h-6" /> General Information
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 font-medium">This information is displayed publicly on your storefront.</p>
        </div>
      </div>

      <div className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Store Name</label>
            <input 
              name="storeName"
              defaultValue={settings?.storeName || "FaithHub BD"}
              className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand dark:text-white outline-none transition-shadow"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Currency</label>
            <input 
              name="currency"
              defaultValue={settings?.currency || "BDT (৳)"}
              className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand dark:text-white outline-none transition-shadow"
              required
            />
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 pt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2"><Phone className="w-4 h-4"/> Contact Phone</label>
            <input 
              name="contactPhone"
              defaultValue={settings?.contactPhone || ""}
              className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand dark:text-white outline-none transition-shadow"
              placeholder="+880 1234 567890"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2"><Mail className="w-4 h-4"/> Contact Email</label>
            <input 
              name="contactEmail"
              defaultValue={settings?.contactEmail || ""}
              type="email"
              className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand dark:text-white outline-none transition-shadow"
              placeholder="support@faithhubbd.com"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2"><MapPin className="w-4 h-4"/> Physical Address</label>
            <input 
              name="address"
              defaultValue={settings?.address || ""}
              className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand dark:text-white outline-none transition-shadow"
              placeholder="Dhaka, Bangladesh"
            />
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 pt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <CreditCard className="text-brand w-5 h-5" /> Checkout & Payment
            </h3>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">WhatsApp Number (For Checkout)</label>
            <input 
              name="whatsappNumber"
              defaultValue={settings?.whatsappNumber || ""}
              className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand dark:text-white outline-none transition-shadow"
              placeholder="e.g. 01852379890"
            />
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-2">
              Customers will be redirected here after checkout.
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Free Shipping Threshold (৳)</label>
            <input 
              name="freeShippingThreshold"
              type="number"
              defaultValue={settings?.freeShippingThreshold ?? 1500}
              className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand dark:text-white outline-none transition-shadow"
              placeholder="1500"
            />
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-2">
              Orders equal to or above this amount will get free shipping. Set to 0 to disable.
            </p>
          </div>
        </div>
      </div>

      <div className="p-8 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 flex justify-end items-center gap-4">
        {success && (
          <span className="text-green-600 dark:text-green-400 text-sm font-bold flex items-center gap-1 animate-in fade-in">
            <CheckCircle className="w-4 h-4" /> Settings saved successfully
          </span>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="bg-brand text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand/20 active:scale-95"
        >
          {isPending ? 'Saving...' : <><Save className="w-5 h-5" /> Save Changes</>}
        </button>
      </div>
    </form>
  );
}
