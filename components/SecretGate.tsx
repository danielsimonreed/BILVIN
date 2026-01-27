import React, { useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { authenticateUser, USER_CREDENTIALS, UserType } from '../constants';

interface SecretGateProps {
  onUnlock: (user: UserType) => void;
}

const SecretGate: React.FC<SecretGateProps> = ({ onUnlock }) => {
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [authenticatedUser, setAuthenticatedUser] = useState<UserType | null>(null);
  const controls = useAnimation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = authenticateUser(inputCode);
    if (user) {
      setError('');
      setIsSuccess(true);
      setFailedAttempts(0);
      setAuthenticatedUser(user);
    } else {
      setFailedAttempts(prev => prev + 1);
      setError("Waduh.. bukan itu passwordnya euy");
      await controls.start({
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.4 }
      });
    }
  };

  const handleEnterMain = () => {
    if (authenticatedUser) {
      onUnlock(authenticatedUser);
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
      {!isSuccess && (
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
      )}

      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success-popup"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative bg-gradient-to-b from-white/90 via-rose-50/80 to-white/90 dark:from-stone-900/95 dark:via-rose-950/30 dark:to-stone-900/95 backdrop-blur-xl p-10 rounded-3xl shadow-2xl max-w-sm w-full border border-rose-100/50 dark:border-rose-900/30 overflow-hidden"
          >
            {/* Decorative sparkles */}
            <div className="absolute top-4 left-6 text-rose-300 dark:text-rose-400 text-xs opacity-60">✦</div>
            <div className="absolute top-8 right-8 text-rose-300 dark:text-rose-400 text-sm opacity-40">✧</div>
            <div className="absolute bottom-12 left-8 text-rose-300 dark:text-rose-400 text-xs opacity-50">✦</div>
            <div className="absolute bottom-6 right-6 text-rose-300 dark:text-rose-400 text-sm opacity-30">✧</div>

            {/* Animated unlock icon - show user emoji */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }}
              className="text-5xl mb-6 text-center"
            >
              <span className="drop-shadow-lg">{authenticatedUser ? USER_CREDENTIALS[authenticatedUser].emoji : '🔓'}</span>
            </motion.div>

            {/* Main headline */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl md:text-3xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-pink-500 to-rose-600 dark:from-rose-400 dark:via-pink-300 dark:to-rose-400 mb-2 font-bold tracking-wide text-center"
            >
              Hi, {authenticatedUser ? USER_CREDENTIALS[authenticatedUser].displayName : 'Sayang'}! 💕
            </motion.h2>

            {/* Access granted subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xs uppercase tracking-[0.3em] text-rose-400 dark:text-rose-500 mb-6 font-medium"
            >
              Welcome to Our World
            </motion.p>

            {/* Special italic welcome text */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="font-serif italic text-base md:text-lg text-stone-600 dark:text-stone-300 mb-8 leading-relaxed"
            >
              <span className="text-rose-500 dark:text-rose-400">"</span>
              Selamat datang di dunia{' '}
              <span className="font-bold bg-gradient-to-r from-rose-500 to-pink-500 dark:from-rose-400 dark:to-pink-400 bg-clip-text text-transparent">BILVIN</span>
              <span className="text-rose-500 dark:text-rose-400">"</span>
            </motion.p>

            {/* Premium enter button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleEnterMain}
              className="w-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 hover:from-rose-600 hover:via-pink-600 hover:to-rose-600 text-white rounded-full py-4 text-sm font-semibold tracking-[0.2em] uppercase transition-all shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/30"
            >
              ✨ Enter Our Story ✨
            </motion.button>
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

            {failedAttempts >= 3 && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-stone-500 dark:text-stone-400 text-xs mt-3 font-medium leading-relaxed text-center"
              >
                ngga tau ya passwordnya? huhu kasian.. coba buka ini gih:{' '}
                <a
                  href="https://bit.ly/bilqispoho"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rose-500 dark:text-rose-400 underline hover:text-rose-600 dark:hover:text-rose-300 transition-colors font-semibold"
                >
                  https://bit.ly/bilqispoho
                </a>
              </motion.p>
            )}
          </motion.form>
        )}
      </AnimatePresence>


    </motion.div>
  );
};

export default SecretGate;