"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const categories = [
  {
    id: "new",
    title: "New Arrivals",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop",
    link: "/category/new",
    span: "md:col-span-2 md:row-span-2",
    theme: "dark"
  },
  {
    id: "men",
    title: "Men's Essentials",
    image: "https://images.unsplash.com/photo-1516826957135-700ede19ebc1?q=80&w=2070&auto=format&fit=crop",
    link: "/category/men",
    span: "md:col-span-1 md:row-span-1",
    theme: "light"
  },
  {
    id: "ladies",
    title: "Women's Collection",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1962&auto=format&fit=crop",
    link: "/category/ladies",
    span: "md:col-span-1 md:row-span-1",
    theme: "light"
  }
];

export function CategoryShowcase() {
  const { t } = useTranslation();

  return (
    <section className="py-24 md:py-32 bg-gray-50 dark:bg-black transition-colors duration-500 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-16 flex justify-between items-end">
          <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tighter text-black dark:text-white">
            {t("categories" as any)}
          </h2>
          <Link href="/shop" className="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black dark:hover:text-white transition-colors">
            {t("explore" as any)} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:auto-rows-[350px]">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`group relative overflow-hidden rounded-[2rem] bg-gray-200 dark:bg-gray-900 ${cat.span}`}
            >
              <img 
                src={cat.image} 
                alt={cat.title} 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out opacity-90 dark:opacity-70" 
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.theme === 'dark' ? 'from-black/80 via-black/20' : 'from-black/50 via-black/10'} to-transparent`} />
              
              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                <div className="flex justify-between items-end">
                  <h3 className="text-3xl md:text-4xl font-heading font-black text-white leading-tight max-w-[80%]">
                    {cat.title}
                  </h3>
                  <Link 
                    href={cat.link}
                    className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-black hover:scale-110 transition-all duration-300"
                  >
                    <ArrowRight className="w-6 h-6" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
