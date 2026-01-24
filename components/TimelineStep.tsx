import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';

interface TimelineStepProps {
  heading: string;
  text: string;
  image: string;
  caption: string;
  secretMessage?: string;
  isLast?: boolean;
}

const containerVariants: Variants = {
  offscreen: {
    opacity: 0,
    y: 40,
    scale: 0.95,
    filter: "blur(6px)",
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.9
    }
  },
  onscreen: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.9,
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const childVariants: Variants = {
  offscreen: {
    opacity: 0,
    y: 20,
    filter: "blur(2px)"
  },
  onscreen: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: "easeOut"
    }
  }
};

// Singleton Audio Context to prevent memory leaks (limit 6 per browser)
let sharedAudioCtx: AudioContext | null = null;

const getAudioContext = () => {
  if (!sharedAudioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      sharedAudioCtx = new AudioContextClass();
    }
  }
  return sharedAudioCtx;
};

const TimelineStep: React.FC<TimelineStepProps> = ({ heading, text, image, caption, secretMessage, isLast }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const playFlipSound = () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      // Resume context if suspended (browser policy)
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Noise buffer for texture
      const bufferSize = ctx.sampleRate * 0.15;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      // Filter to simulate paper friction (Lowpass)
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch (e) {
      console.error("Audio play failed", e);
    }
  };

  const handleCardClick = () => {
    playFlipSound();
    setIsFlipped(!isFlipped);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      playFlipSound();
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <motion.div
      className={`relative pl-8 pr-6 py-16 ${!isLast ? 'border-l border-rose-200/40 dark:border-rose-900/30' : ''} ml-6`}
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: false, amount: 0.4, margin: "-20% 0px -20% 0px" }}
      variants={containerVariants}
    >
      {/* Timeline Dot */}
      <motion.div
        variants={childVariants}
        className="absolute left-[-5px] top-20 w-2.5 h-2.5 rounded-full bg-rose-300 dark:bg-rose-500 ring-4 ring-[#FFF5F5] dark:ring-slate-900"
      />

      {/* Content */}
      <div className="flex flex-col gap-6">
        <div>
          <motion.h2
            variants={childVariants}
            className="font-serif text-2xl text-stone-800 dark:text-rose-50 mb-3 font-medium tracking-tight leading-tight"
          >
            {heading}
          </motion.h2>
          <motion.p
            variants={childVariants}
            className="font-sans text-stone-600 dark:text-stone-300 leading-relaxed text-[15px] max-w-prose"
          >
            {text}
          </motion.p>
        </div>

        {/* Card Container with Perspective */}
        <motion.div variants={childVariants} className="mt-2 relative w-full perspective-1000 group">
          <motion.div
            className="relative w-full cursor-pointer preserve-3d focus:outline-none focus:ring-4 focus:ring-rose-200/50 rounded-lg"
            style={{ transformStyle: 'preserve-3d' }}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 200, damping: 25 }}
            onClick={handleCardClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={isFlipped ? "Flip back to photo" : "Flip to see secret message"}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            layout={false}
          >
            {/* Front of Card */}
            <div className="backface-hidden relative overflow-hidden rounded-lg shadow-xl bg-white dark:bg-stone-800 p-3 transform rotate-1 transition-transform duration-500 group-hover:rotate-0">
              <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-rose-50 dark:bg-stone-700">
                <img
                  src={image}
                  alt={heading}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-50" />
              </div>
              <div className="pt-3 pb-1 text-center">
                <span className="font-serif italic text-xs text-stone-500 dark:text-stone-400">
                  {caption}
                </span>
              </div>
            </div>

            {/* Back of Card (Secret) */}
            <div
              className="absolute inset-0 backface-hidden rounded-lg shadow-xl bg-black border border-stone-800 p-8 flex flex-col items-center justify-center text-center overflow-hidden"
              style={{ transform: 'rotateY(180deg)' }}
            >
              {/* Background Image for Back Card */}
              <div className="absolute inset-0 z-0">
                <img src={image} alt="" className="w-full h-full object-cover" />
                {/* Dark Overlay for readability */}
                <div className="absolute inset-0 bg-black/50" />
              </div>

              {/* Decorative corners */}
              <div className="absolute top-3 right-3 text-rose-500 opacity-80 z-10">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <div className="absolute bottom-3 left-3 text-rose-500 opacity-80 z-10">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center z-10 gap-2">
                <h3 className="font-typewriter text-rose-400 text-xl leading-loose tracking-widest drop-shadow-md">
                  "{secretMessage || 'I love you'}"
                </h3>
                <span className="text-2xl animate-pulse">❤️</span>
              </div>

              <p className="mt-auto text-[10px] uppercase tracking-[0.3em] text-stone-300/60 font-sans z-10">
                Secret Note
              </p>
            </div>

          </motion.div>

          <motion.div
            className={`absolute -bottom-7 left-0 right-0 text-center text-[10px] text-stone-400 dark:text-stone-500 italic pointer-events-none transition-opacity duration-500 ${isFlipped ? 'opacity-0' : 'opacity-70'}`}
          >
            (tap to reveal secret)
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TimelineStep;