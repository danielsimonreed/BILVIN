import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { SECRET_CODE } from '../constants';

interface SecretGateProps {
  onUnlock: () => void;
}

const SecretGate: React.FC<SecretGateProps> = ({ onUnlock }) => {
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState('');
  const controls = useAnimation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.toLowerCase().trim() === SECRET_CODE) {
      setError('');
      onUnlock();
    } else {
      setError("Oops, that's not our magic word 🦕");
      await controls.start({
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.4 }
      });
    }
  };

  return (
    <motion.div
      key="gate"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center p-8 text-center backdrop-blur-sm bg-white/30 dark:bg-black/40"
    >
      <div className="mb-12">
        <h1 className="font-serif text-5xl text-stone-800 dark:text-rose-50 tracking-tighter mb-2 shadow-sm">
          BILVIN
        </h1>
        <p className="font-sans text-rose-500 dark:text-rose-200 text-sm tracking-widest uppercase font-medium">
          a tiny love timeline
        </p>
      </div>

      <motion.form 
        onSubmit={handleSubmit}
        animate={controls}
        className="w-full max-w-[280px] flex flex-col gap-4"
      >
        <div className="relative">
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="Enter our secret code..."
            className="w-full bg-white/70 dark:bg-stone-900/60 border border-rose-200 dark:border-stone-600 rounded-full py-3 px-6 text-center text-stone-700 dark:text-stone-200 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-700 focus:bg-white dark:focus:bg-stone-800 transition-all text-sm shadow-lg backdrop-blur-md"
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-stone-800 dark:bg-rose-700 text-rose-50 rounded-full py-3 text-sm font-medium tracking-wide hover:bg-stone-700 dark:hover:bg-rose-600 active:scale-95 transition-all shadow-xl hover:shadow-2xl"
        >
          Unlock
        </button>

        {error && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-rose-600 dark:text-rose-400 text-xs mt-2 font-medium bg-white/50 dark:bg-black/50 px-3 py-1 rounded-full inline-block"
          >
            {error}
          </motion.p>
        )}
      </motion.form>

      <div className="absolute bottom-10 opacity-50 text-rose-500 dark:text-rose-300">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>
    </motion.div>
  );
};

export default SecretGate;