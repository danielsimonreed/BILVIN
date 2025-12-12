import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface SettingsPageProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  onLock: () => void;
  textSize: 'sm' | 'md' | 'lg';
  setTextSize: (size: 'sm' | 'md' | 'lg') => void;
  reducedMotion: boolean;
  setReducedMotion: (enabled: boolean) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({
  isDarkMode,
  toggleTheme,
  onLock,
  textSize,
  setTextSize,
  reducedMotion,
  setReducedMotion
}) => {
  const [notifications, setNotifications] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="pt-20 px-8 pb-32"
    >
      <h1 className="font-serif text-3xl text-stone-800 dark:text-rose-50 mb-8">Settings</h1>

      <div className="flex flex-col gap-6">

        {/* Appearance Section */}
        <section>
          <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 dark:text-slate-500 mb-4">Appearance</h3>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-stone-100 dark:border-slate-700 overflow-hidden">

            {/* Dark Mode Toggle */}
            <div className="p-4 flex items-center justify-between border-b border-stone-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${isDarkMode ? 'bg-indigo-100 text-indigo-500' : 'bg-amber-100 text-amber-500'}`}>
                  {isDarkMode ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" /></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0 0 1.41.996.996 0 0 0 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06z" /></svg>
                  )}
                </div>
                <span className="font-sans font-medium text-stone-700 dark:text-slate-200">Dark Mode</span>
              </div>
              <button
                onClick={toggleTheme}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${isDarkMode ? 'bg-rose-500' : 'bg-stone-300'}`}
              >
                <motion.div
                  className="w-4 h-4 rounded-full bg-white shadow-sm"
                  animate={{ x: isDarkMode ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            {/* Text Size */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-stone-100 dark:bg-slate-700 text-stone-500 dark:text-slate-300">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M2.5 4v3h5v12h3V7h5V4h-13zm19 5h-9v3h3v7h3v-7h3V9z" /></svg>
                </div>
                <span className="font-sans font-medium text-stone-700 dark:text-slate-200">Text Size</span>
              </div>
              <div className="flex bg-stone-100 dark:bg-slate-900 rounded-lg p-1">
                {(['sm', 'md', 'lg'] as const).map(size => (
                  <button
                    key={size}
                    onClick={() => setTextSize(size)}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${textSize === size ? 'bg-white dark:bg-slate-700 shadow-sm text-stone-800 dark:text-white' : 'text-stone-400 dark:text-slate-500'}`}
                  >
                    {size === 'sm' ? 'A' : size === 'md' ? 'A+' : 'A++'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Preferences Section */}
        <section>
          <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 dark:text-slate-500 mb-4">Preferences</h3>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-stone-100 dark:border-slate-700 overflow-hidden">

            {/* Notifications */}
            <div className="p-4 flex items-center justify-between border-b border-stone-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-500">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" /></svg>
                </div>
                <span className="font-sans font-medium text-stone-700 dark:text-slate-200">Notifications</span>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${notifications ? 'bg-rose-500' : 'bg-stone-300'}`}
              >
                <motion.div
                  className="w-4 h-4 rounded-full bg-white shadow-sm"
                  animate={{ x: notifications ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            {/* Reduced Motion */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-500">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
                </div>
                <span className="font-sans font-medium text-stone-700 dark:text-slate-200">Reduced Motion</span>
              </div>
              <button
                onClick={() => setReducedMotion(!reducedMotion)}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${reducedMotion ? 'bg-rose-500' : 'bg-stone-300'}`}
              >
                <motion.div
                  className="w-4 h-4 rounded-full bg-white shadow-sm"
                  animate={{ x: reducedMotion ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Account / Lock */}
        <button
          onClick={onLock}
          className="mt-4 w-full py-4 bg-stone-200 dark:bg-slate-800 rounded-xl text-stone-600 dark:text-slate-400 font-medium hover:bg-rose-100 hover:text-rose-500 dark:hover:bg-slate-700 dark:hover:text-rose-400 transition-colors flex items-center justify-center gap-2"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" /></svg>
          Lock App
        </button>

        <div className="text-center mt-4">
          <p className="text-[10px] text-stone-400 dark:text-slate-600 uppercase tracking-widest">
            Bilvin App v1.2.0
          </p>
        </div>

      </div>
    </motion.div>
  );
};

export default SettingsPage;