import React from 'react';
import { motion } from 'framer-motion';
import { TIMELINE_STEPS } from '../constants';

const Gallery: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-20 px-4 pb-32"
    >
      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl text-stone-800 dark:text-rose-50">Our Gallery</h1>
        <p className="font-sans text-rose-400 text-sm italic mt-2">Captured moments</p>
      </div>

      <div className="columns-2 gap-4 space-y-4">
        {TIMELINE_STEPS.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="break-inside-avoid relative group rounded-xl overflow-hidden shadow-md bg-white dark:bg-slate-800"
          >
            <img 
              src={step.image} 
              alt={step.caption}
              className="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
               <p className="text-[10px] text-white font-sans bg-black/50 backdrop-blur-sm p-1.5 rounded-md truncate">
                 {step.caption}
               </p>
            </div>
          </motion.div>
        ))}
        {/* Placeholder extras to fill grid */}
        <motion.div className="break-inside-avoid h-32 bg-rose-100 dark:bg-rose-900/20 rounded-xl flex items-center justify-center text-rose-300">
           <span className="text-2xl">❤️</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Gallery;