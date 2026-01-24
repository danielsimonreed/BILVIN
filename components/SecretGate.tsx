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
  const [showPassword, setShowPassword] = useState(false);
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
                type={showPassword ? "text" : "password"}
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Enter access code..."
                className="w-full bg-white/70 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-700 rounded-full py-3 px-6 pr-12 text-center text-stone-800 dark:text-stone-200 placeholder:text-stone-400 dark:placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600 focus:bg-white dark:focus:bg-stone-800 transition-all text-sm shadow-lg backdrop-blur-md"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
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