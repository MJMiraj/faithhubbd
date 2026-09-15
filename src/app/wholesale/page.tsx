"use client";

import { motion } from "framer-motion";
import { Building2, Package, Percent, ShieldCheck } from "lucide-react";

export default function WholesalePage() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block py-1 px-3 rounded-full bg-brand/10 text-brand text-xs font-bold tracking-widest uppercase mb-4">
              B2B Portal
            </span>
            <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter text-gray-900 dark:text-white mb-6">
              Scale Your Business with <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-purple-600">FaithHub</span>
            </h1>
            <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">
              Join our wholesale network to access exclusive tier-based pricing, dedicated support, and priority fulfillment.
            </p>
          </motion.div>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {[
            { icon: <Percent />, title: "Tiered Discounts", desc: "Unlock margins up to 45% off retail based on volume." },
            { icon: <Package />, title: "Bulk Ordering", desc: "Streamlined checkout optimized for large quantity orders." },
            { icon: <Building2 />, title: "Dedicated Agent", desc: "Direct line to a B2B specialist for your account." },
            { icon: <ShieldCheck />, title: "Priority Support", desc: "Fast-tracked issue resolution and premium warranty." }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white dark:bg-black rounded-3xl p-8 border border-gray-100 dark:border-gray-800 text-center"
            >
              <div className="w-16 h-16 bg-brand/10 text-brand rounded-2xl flex items-center justify-center mx-auto mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-gray-500 dark:text-gray-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Application Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-2xl mx-auto bg-white dark:bg-black rounded-3xl p-8 md:p-12 border border-gray-100 dark:border-gray-800 shadow-xl"
        >
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-8 text-center">Apply for Wholesale</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">First Name</label>
                <input className="w-full mt-2 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-brand focus:outline-none dark:text-white" />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Last Name</label>
                <input className="w-full mt-2 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-brand focus:outline-none dark:text-white" />
              </div>
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Company Name</label>
              <input className="w-full mt-2 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-brand focus:outline-none dark:text-white" />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Business Email</label>
              <input type="email" className="w-full mt-2 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-brand focus:outline-none dark:text-white" />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Tax ID / Trade License Number</label>
              <input className="w-full mt-2 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-brand focus:outline-none dark:text-white" />
            </div>
            
            <button type="button" onClick={() => alert("Application Submitted! Our team will review and contact you.")} className="w-full bg-brand text-white font-black uppercase tracking-widest py-4 rounded-xl hover:bg-brand-dark transition-colors mt-8">
              Submit Application
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
