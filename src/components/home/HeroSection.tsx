"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useState, useEffect } from "react";

export function HeroSection({ banners = [] }: { banners?: any[] }) {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % banners.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);

  if (banners.length > 0) {
    return (
      <section className="relative h-[80vh] md:h-[90vh] w-full overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <img 
              src={banners[currentSlide].imageUrl} 
              alt={banners[currentSlide].title || "Banner"} 
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute inset-0 flex items-center justify-center text-center px-4">
              <div className="max-w-4xl mx-auto space-y-6">
                {banners[currentSlide].title && (
                  <motion.h2 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-5xl md:text-7xl font-black text-white tracking-tight"
                  >
                    {banners[currentSlide].title}
                  </motion.h2>
                )}
                {banners[currentSlide].link && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Link href={banners[currentSlide].link} className="inline-flex items-center justify-center gap-3 bg-white text-black hover:scale-105 px-8 py-4 rounded-full text-sm font-bold tracking-widest uppercase transition-all shadow-2xl group mt-4">
                      {t("shopNow" as any)}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        {banners.length > 1 && (
          <>
            <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 backdrop-blur-md text-white p-3 rounded-full transition-all">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 backdrop-blur-md text-white p-3 rounded-full transition-all">
              <ChevronRight className="w-6 h-6" />
            </button>
            
            {/* Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all ${currentSlide === idx ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'}`}
                />
              ))}
            </div>
          </>
        )}
      </section>
    );
  }

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white dark:bg-gray-950 transition-colors duration-500 pt-20 pb-32">
      
      {/* Background Subtle Gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gray-100 dark:bg-gray-900 rounded-full blur-[100px] opacity-50 pointer-events-none" />

      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          <span className="text-gray-400 dark:text-gray-500 font-bold tracking-[0.3em] uppercase text-xs mb-8 block">
            {t("heroSubtitle" as any)}
          </span>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-heading font-black text-black dark:text-white tracking-tighter leading-[0.9] mb-12 transition-colors duration-500">
            {t("heroTitle" as any).split(' ').map((word: string, i: number) => (
              <span key={i} className="block">{word}</span>
            ))}
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-6 mt-8">
            <Link href="/shop" className="inline-flex items-center justify-center gap-3 bg-black dark:bg-white text-white dark:text-black hover:scale-105 px-10 py-5 rounded-full text-sm font-bold tracking-widest uppercase transition-all duration-300 shadow-2xl shadow-black/20 dark:shadow-white/10 group">
              {t("shopNow" as any)}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
