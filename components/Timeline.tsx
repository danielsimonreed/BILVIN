import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TimelineStep from './TimelineStep';
import { TIMELINE_STEPS, CLOSING_MESSAGE } from '../constants';

const Timeline: React.FC = () => {
  const [daysCount, setDaysCount] = useState<number>(0);

  useEffect(() => {
    // Target start date: September 9, 2025, 00:00:00 UTC+7 (Jakarta Time)
    const startDate = new Date("2025-09-09T00:00:00+07:00");
    const now = new Date();
    const diffTime = now.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    setDaysCount(Math.max(0, diffDays));
  }, []);

  return (
    <motion.div
      key="timeline"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
      className="relative z-10 w-full min-h-full pb-32"
    >
      {/* Header Area */}
      <div className="pt-20 pb-12 px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <span className="font-serif italic text-rose-400 dark:text-rose-300 text-lg">For</span>
          <h1 className="font-serif text-3xl text-stone-800 dark:text-rose-50 mt-1 mb-2">Bilqis Tazqia Qalby</h1>
          <div className="w-12 h-0.5 bg-rose-200 dark:bg-rose-800 mx-auto rounded-full" />
          
          {/* Dynamic Day Counter */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-5 flex items-baseline justify-center gap-2"
          >
             <span className="font-typewriter font-bold text-rose-500 dark:text-rose-400 text-2xl tracking-tighter">
               {daysCount}
             </span>
             <span className="font-serif italic text-stone-500 dark:text-stone-400 text-lg">
               hari bersamamu..
             </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Steps Container */}
      <div className="px-4">
        {TIMELINE_STEPS.map((step, index) => (
          <TimelineStep
            key={step.id}
            heading={step.heading}
            text={step.text}
            image={step.image}
            caption={step.caption}
            secretMessage={step.secretMessage}
            isLast={index === TIMELINE_STEPS.length - 1}
          />
        ))}

        {/* Closing Message */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mt-16 px-6 text-center"
        >
          <div className="mb-8">
             <div className="text-3xl mb-2 text-rose-300 dark:text-rose-700">❦</div>
          </div>
          
          <h3 className="font-serif text-xl text-stone-800 dark:text-rose-50 mb-4">{CLOSING_MESSAGE.recipient}</h3>
          <p className="font-sans text-stone-600 dark:text-stone-400 leading-relaxed text-[15px] mb-12">
            {CLOSING_MESSAGE.body}
          </p>

          <div className="text-xs text-rose-400 dark:text-rose-600 font-medium tracking-widest uppercase opacity-70">
            {CLOSING_MESSAGE.signature}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Timeline;