"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface InfoPageProps {
  title: string;
  description: string;
  content?: React.ReactNode;
}

export function InfoPage({ title, description, content }: InfoPageProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-500 pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-black dark:hover:text-white transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-5xl md:text-6xl font-heading font-black text-black dark:text-white tracking-tighter mb-6">
            {title}
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed mb-12">
            {description}
          </p>
          
          <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
            {content || (
              <div className="p-8 rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-center">
                <p className="text-sm font-bold uppercase tracking-widest mb-2 text-brand">System Update</p>
                <p>This page is currently being updated for the upcoming season. Please check back soon.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
