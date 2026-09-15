"use client";

import { motion } from "framer-motion";
import { HeartPulse, GraduationCap, Microscope, ShieldCheck, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const pillars = [
  {
    title: "Healthcare Services",
    description: "Accessible, high-quality medical care and health camps for underprivileged communities across the nation.",
    icon: HeartPulse,
    color: "bg-rose-500",
    link: "/healthcare",
    span: "col-span-1 md:col-span-2 row-span-2",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop"
  },
  {
    title: "Education & Training",
    description: "Empowering the next generation of professionals through our state-of-the-art Learning Management System.",
    icon: GraduationCap,
    color: "bg-blue-500",
    link: "/education",
    span: "col-span-1 md:col-span-1 row-span-1",
  },
  {
    title: "Research & Innovation",
    description: "Pioneering clinical research and publishing breakthrough findings in medical science.",
    icon: Microscope,
    color: "bg-emerald-500",
    link: "/research",
    span: "col-span-1 md:col-span-1 row-span-1",
  },
  {
    title: "Humanitarian Aid",
    description: "Rapid response teams providing crucial disaster relief and continuous support.",
    icon: ShieldCheck,
    color: "bg-amber-500",
    link: "/humanitarian",
    span: "col-span-1 md:col-span-2 row-span-1",
  }
];

export function CorePillars() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-black w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
            Our Core Pillars
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Driving systemic change through a multi-faceted approach to public welfare, 
            combining direct action with long-term capacity building.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[250px]">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group relative overflow-hidden rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all ${pillar.span}`}
              >
                {pillar.image && (
                  <div className="absolute inset-0 z-0">
                    <img src={pillar.image} alt={pillar.title} className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
                  </div>
                )}
                
                <div className={`relative z-10 h-full flex flex-col p-8 ${pillar.image ? 'justify-end text-white' : 'justify-between'}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${pillar.color} text-white ${pillar.image ? 'mb-auto' : ''}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <div>
                    <h3 className={`text-2xl font-heading font-bold mb-3 ${pillar.image ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      {pillar.title}
                    </h3>
                    <p className={`mb-6 ${pillar.image ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}`}>
                      {pillar.description}
                    </p>
                    <Link 
                      href={pillar.link}
                      className={`inline-flex items-center gap-2 font-medium group/link ${pillar.image ? 'text-white hover:text-blue-300' : 'text-blue-600 dark:text-blue-400 hover:text-blue-700'}`}
                    >
                      Learn more 
                      <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
