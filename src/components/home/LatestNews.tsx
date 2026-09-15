"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";

const news = [
  {
    id: 1,
    title: "Breakthrough in Tropical Disease Prevention Research",
    category: "Research",
    date: "Oct 24, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "FaithHub Launches New Mobile Clinics in Rural Areas",
    category: "Healthcare",
    date: "Oct 20, 2026",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1504813184591-01572f98c85f?q=80&w=2071&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Annual Global Health Summit 2026 Registration Open",
    category: "Events",
    date: "Oct 15, 2026",
    readTime: "2 min read",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
  }
];

export function LatestNews() {
  return (
    <section className="py-24 bg-white dark:bg-[#111111] w-full border-t border-gray-100 dark:border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              Latest from FaithHub
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Stay updated with our latest research findings, humanitarian efforts, and upcoming organizational events.
            </p>
          </div>
          <Link href="/news" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 transition-colors">
            View All Updates <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-2xl mb-6 aspect-[4/3]">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-900 dark:text-white shadow-sm">
                    {item.category}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> {item.date}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> {item.readTime}
                </div>
              </div>
              
              <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                {item.title}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
