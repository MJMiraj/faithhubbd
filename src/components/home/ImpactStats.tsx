"use client";

import { motion } from "framer-motion";
import { Users, BookOpen, GraduationCap, Building2 } from "lucide-react";

const stats = [
  { id: 1, name: 'Lives Impacted', value: '2.5M+', icon: Users, color: 'text-blue-500' },
  { id: 2, name: 'Research Papers', value: '450+', icon: BookOpen, color: 'text-emerald-500' },
  { id: 3, name: 'Trained Professionals', value: '12k+', icon: GraduationCap, color: 'text-purple-500' },
  { id: 4, name: 'Active Projects', value: '85', icon: Building2, color: 'text-amber-500' },
];

export function ImpactStats() {
  return (
    <section className="relative -mt-16 z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-xl bg-gray-50 dark:bg-gray-800 ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {stat.name}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
