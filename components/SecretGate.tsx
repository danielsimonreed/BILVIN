import React, { useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { SECRET_CODE } from '../constants';

interface SecretGateProps {
  onUnlock: () => void;
}

const SecretGate: React.FC<SecretGateProps> = ({ onUnlock }) => {
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const controls = useAnimation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.toLowerCase().trim() === SECRET_CODE) {
      setError('');
      setIsSuccess(true);
      // Removed immediate onUnlock() call
    } else {
      setError("Oops, that's not our magic word 🦕");
      await controls.start({
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.4 }
      });
    }
  };

  const handleEnterMain = () => {
    onUnlock();
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
      <div className="mb-8">
        <h1 className="font-serif text-4xl md:text-5xl text-stone-800 dark:text-stone-100 tracking-tight mb-3 shadow-sm">
          KEVIN MADIAN
        </h1>
        <p className="font-sans text-stone-500 dark:text-stone-400 text-xs md:text-sm tracking-[0.2em] uppercase font-medium mb-6">
          PORTFOLIO & SHOWCASE
        </p>
        <p className="font-sans text-stone-600 dark:text-stone-300 text-sm max-w-md mx-auto leading-relaxed opacity-80">
          Welcome to my personal space. If you want to know more about me, then insert the secret code below.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success-popup"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white/80 dark:bg-black/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-sm w-full border border-stone-100 dark:border-stone-800"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
              className="text-4xl mb-4 text-center"
            >
              🔓
            </motion.div>
            <h3 className="text-xl font-serif text-stone-800 dark:text-stone-200 mb-4 font-medium italic">
              "Access Granted"
            </h3>
            <p className="text-stone-600 dark:text-stone-300 text-sm mb-8 leading-relaxed">
              Welcome to the world of BILVIN.
            </p>
            <button
              onClick={handleEnterMain}
              className="w-full bg-stone-800 hover:bg-black dark:bg-stone-700 dark:hover:bg-stone-600 text-white rounded-full py-3 text-sm font-medium tracking-widest transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              ENTER
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="login-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="w-full max-w-[280px] flex flex-col gap-4"
          >
            <div className="relative">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Enter access code..."
                className="w-full bg-white/70 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-700 rounded-full py-3 px-6 text-center text-stone-800 dark:text-stone-200 placeholder:text-stone-400 dark:placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600 focus:bg-white dark:focus:bg-stone-800 transition-all text-sm shadow-lg backdrop-blur-md"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-stone-900 dark:bg-white text-white dark:text-black rounded-full py-3 text-sm font-medium tracking-wide hover:bg-stone-800 dark:hover:bg-stone-200 active:scale-95 transition-all shadow-xl hover:shadow-2xl"
            >
              Explore Work
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
        )}
      </AnimatePresence>


    </motion.div>
  );
};

export default SecretGate;