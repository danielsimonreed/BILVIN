import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MusicPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="pt-20 px-8 pb-32 h-full flex flex-col items-center"
    >
      <h1 className="font-serif text-3xl text-stone-800 dark:text-rose-50 mb-10">Our Playlist</h1>

      {/* Vinyl Record */}
      <div className="relative w-64 h-64 mb-12">
        <motion.div
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatType: "loop" }}
          className={`w-full h-full rounded-full bg-stone-900 dark:bg-black shadow-2xl flex items-center justify-center border-4 border-stone-800 dark:border-slate-800 ${isPlaying ? '' : 'paused'}`}
          style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
        >
          {/* Vinyl Grooves */}
          <div className="absolute inset-2 rounded-full border border-stone-800 opacity-50" />
          <div className="absolute inset-8 rounded-full border border-stone-800 opacity-50" />
          <div className="absolute inset-16 rounded-full border border-stone-800 opacity-50" />
          
          {/* Label */}
          <div className="w-24 h-24 rounded-full bg-rose-300 flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-tr from-rose-400 to-rose-200" />
             <span className="relative text-[8px] font-bold text-rose-900 tracking-widest uppercase">BILVIN Records</span>
          </div>
        </motion.div>

        {/* Tone arm simulation */}
        <motion.div 
           animate={{ rotate: isPlaying ? 25 : 0 }}
           className="absolute -top-10 -right-10 w-32 h-40 origin-top-right transition-transform duration-700"
        >
          <svg width="100%" height="100%" viewBox="0 0 100 120">
             <path d="M90,10 L90,30 L40,100" stroke="#57534e" strokeWidth="6" fill="none" />
             <circle cx="90" cy="10" r="10" fill="#292524" />
             <rect x="35" y="95" width="12" height="18" fill="#1c1917" />
          </svg>
        </motion.div>
      </div>

      {/* Track Info */}
      <div className="text-center mb-10">
        <h3 className="font-bold text-xl text-stone-800 dark:text-white mb-2">Sempurna</h3>
        <p className="text-rose-500 dark:text-rose-400 text-sm">Andra & The Backbone</p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-8">
        <button className="text-stone-400 hover:text-stone-600 dark:text-slate-500 dark:hover:text-slate-300">
           <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
        </button>

        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-16 h-16 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
        >
          {isPlaying ? (
             <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          ) : (
             <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>

        <button className="text-stone-400 hover:text-stone-600 dark:text-slate-500 dark:hover:text-slate-300">
           <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
        </button>
      </div>

      <p className="mt-auto text-xs text-stone-400 italic mb-4">
        (Visual Demo - No audio file linked)
      </p>
    </motion.div>
  );
};

export default MusicPage;