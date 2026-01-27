import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TimelineStep from './TimelineStep';
import { TIMELINE_STEPS, CLOSING_MESSAGE } from '../constants';

interface TimelineProps {
  onLogout?: () => void;
  onReadyChange?: (isReady: boolean) => void;
  hasSeenWelcome?: boolean;
  onWelcomeSeen?: () => void;
}

const Timeline: React.FC<TimelineProps> = ({ onLogout, onReadyChange, hasSeenWelcome = false, onWelcomeSeen }) => {
  const [showScrollGuide, setShowScrollGuide] = useState(true);

  useEffect(() => {
    // Hide scroll guide after 5 seconds or on scroll
    const timer = setTimeout(() => {
      setShowScrollGuide(false);
    }, 5000);

    const handleScroll = () => {
      setShowScrollGuide(false);
    };

    window.addEventListener('scroll', handleScroll, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  // Notify parent when ready state changes (based on hasSeenWelcome)
  useEffect(() => {
    if (onReadyChange) {
      onReadyChange(hasSeenWelcome);
    }
  }, [hasSeenWelcome, onReadyChange]);

  const handleReady = () => {
    // Scroll to top to show the header and countdown section
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (onWelcomeSeen) {
      onWelcomeSeen();
    }
  };

  const handleNotReady = () => {
    if (onLogout) {
      onLogout();
    }
  };

  // Welcome Message Section
  if (!hasSeenWelcome) {
    return (
      <motion.div
        key="welcome-message"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full min-h-full flex flex-col items-center justify-center px-6 py-12"
      >
        {/* Decorative Hearts */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <span className="text-4xl">💕</span>
        </motion.div>

        {/* Welcome Message Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-md mx-auto bg-gradient-to-br from-rose-50/30 to-pink-50/30 dark:from-rose-950/30 dark:to-pink-950/30 backdrop-blur-sm rounded-2xl p-6 border border-rose-200/30 dark:border-rose-800/30 shadow-xl"
        >
          <p className="font-serif text-stone-700 dark:text-stone-200 leading-relaxed text-base whitespace-pre-line text-center">
            <span className="text-rose-500 dark:text-rose-400 font-semibold text-lg">Hai cantik.. 💗</span>
            {"\n\n"}
            Sebelumnya aku mau terimakasih karena kamu udah mau buka website ini, dan selamat.. kamu berhasil nemuin website ini.. yeayyyy..
            {"\n\n"}
            Aku buat website terbaru ini sebagai bentuk rasa bersyukur karena kamu udah nerima aku jadi partner/pasangan kamu, semoga bisa jadi partner selamanya ya sayangg.. Aaamin.. 🤲
            {"\n\n"}
            Terimakasih sayang udah nemenin aku selama ini, buat hari hari aku berarti dan jadi alasan aku untuk terus semangat dan bahagia setiap harinya.. karena ada kamu, aku tau rasanya dicintai sama orang yang tepat, yang selalu support aku, dan selalu berdiri disamping aku, semoga kamu bisa terus nemenin aku achieve hal hal baru dihidup aku nanti yaa sayangg.. ❤️
            {"\n\n"}
            So please enjoy the website sayang.. 🌸
            {"\n"}
            Semoga kamu suka yaa sama website ini..
            {"\n\n"}
            <span className="text-rose-500 dark:text-rose-400 font-semibold italic">I love you so much My Sweet Baby 🤍</span>
          </p>
        </motion.div>

        {/* Confirmation Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-8 text-center"
        >
          <p className="font-serif text-lg text-stone-700 dark:text-rose-100 mb-6 italic">
            Apakah kamu udah siap?
          </p>

          <div className="flex gap-4 justify-center">
            {/* Siap Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReady}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 text-white font-semibold shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 transition-all duration-300"
            >
              Siap
            </motion.button>

            {/* Belum Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNotReady}
              className="px-8 py-3 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 font-semibold shadow-lg hover:bg-stone-300 dark:hover:bg-stone-600 transition-all duration-300"
            >
              Belum
            </motion.button>
          </div>
        </motion.div>

        {/* Floating hearts animation */}
        <motion.div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-rose-300/30 dark:text-rose-600/30 text-2xl"
              initial={{
                x: Math.random() * 100 + '%',
                y: '100%',
                opacity: 0
              }}
              animate={{
                y: '-20%',
                opacity: [0, 0.8, 0]
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: i * 2,
                ease: "linear"
              }}
              style={{ left: `${15 + i * 18}%` }}
            >
              💗
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="timeline"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
      className="relative z-10 w-full min-h-full pb-32"
    >
      {/* Scroll/Swipe Guide Indicator */}
      <AnimatePresence>
        {showScrollGuide && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 1.5 }}
            className="fixed bottom-32 inset-x-0 z-40 flex flex-col items-center justify-center pointer-events-none"
          >
            {/* Animated arrow */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="mb-2"
            >
              <svg
                className="w-6 h-6 text-rose-400 dark:text-rose-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </motion.div>

            {/* Guide text */}
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-center"
            >
              <p className="text-xs font-medium tracking-widest uppercase text-rose-400 dark:text-rose-300">
                <span className="hidden sm:inline">Hai.. Scroll ke atas yaa Cantik.. 😉</span>
                <span className="sm:hidden">Swipe up</span>
              </p>
            </motion.div>

            {/* Decorative line */}
            <motion.div
              animate={{ scaleY: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-px h-8 mt-2 bg-gradient-to-b from-rose-400/50 to-transparent dark:from-rose-300/50"
            />
          </motion.div>
        )}
      </AnimatePresence>

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
            className="mt-6"
          >
            <DetailedCounter />
            <AlternativeCounter />
            <div className="mt-2 text-stone-500 dark:text-stone-400 font-serif italic text-sm">
              bersamamu...
            </div>
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

const DetailedCounter = () => {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Shared start date - ideally this should be a const constant outside but for now we keep it consistent
    const startDate = new Date("2025-09-09T00:00:00+07:00");

    const updateTime = () => {
      const now = new Date();
      const diff = now.getTime() - startDate.getTime();

      if (diff >= 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTime({ days, hours, minutes, seconds });
      }
    };

    const timer = setInterval(updateTime, 1000);
    updateTime(); // Initial call

    return () => clearInterval(timer);
  }, []);

  const TimeUnit = ({ value, label }: { value: number, label: string }) => (
    <div className="flex flex-col items-center mx-2">
      <span className="font-typewriter font-bold text-2xl text-rose-500 dark:text-rose-400 tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[10px] uppercase tracking-wider text-rose-300 dark:text-rose-600 font-medium">
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center items-center">
        <TimeUnit value={time.days} label="Days" />
        <span className="text-rose-300 -mt-4">:</span>
        <TimeUnit value={time.hours} label="Hrs" />
        <span className="text-rose-300 -mt-4">:</span>
        <TimeUnit value={time.minutes} label="Min" />
        <span className="text-rose-300 -mt-4">:</span>
        <TimeUnit value={time.seconds} label="Sec" />
      </div>
    </div>
  );
};

const AlternativeCounter = () => {
  const [duration, setDuration] = useState({ months: 0, days: 0 });

  useEffect(() => {
    const startDate = new Date("2025-09-09T00:00:00+07:00");
    const now = new Date();

    let months = (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth());
    let days = now.getDate() - startDate.getDate();

    if (days < 0) {
      months--;
      // Get days in previous month
      const prevMonthDate = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonthDate.getDate();
    }

    // Safety check if date is in future relative to start (should be handled but good to be safe)
    if (months < 0) {
      months = 0;
      days = 0;
    }

    setDuration({ months, days });
  }, []);

  return (
    <div className="flex flex-col items-center mt-3 animate-pulse">
      <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-stone-400 dark:text-stone-500 mb-2 uppercase">
        Atau
      </span>
      <span className="font-serif italic text-lg sm:text-xl text-rose-400 dark:text-rose-300">
        {duration.months} Bulan {duration.days} Hari
      </span>
    </div>
  );
};

export default Timeline;