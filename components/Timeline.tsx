import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TimelineStep from './TimelineStep';
import { TIMELINE_STEPS, CLOSING_MESSAGE } from '../constants';
import { GALLERY_ITEMS } from '../lib/gallery';
import { AnniversaryState, RELATIONSHIP_START_DATE, getMonthsSinceStart } from '../lib/anniversary';

interface TimelineProps {
  onLogout?: () => void;
  onReadyChange?: (isReady: boolean) => void;
  hasSeenWelcome?: boolean;
  onWelcomeSeen?: () => void;
  anniversaryState: AnniversaryState;
  reducedMotion?: boolean;
}

const Timeline: React.FC<TimelineProps> = ({
  onLogout,
  onReadyChange,
  hasSeenWelcome = false,
  onWelcomeSeen,
  anniversaryState,
  reducedMotion = false,
}) => {
  const [showScrollGuide, setShowScrollGuide] = useState(true);
  const [romanticLineIndex, setRomanticLineIndex] = useState(0);
  const romanticLines = useMemo(() => (
    anniversaryState.isYearlyAnniversary
      ? [
'Setahun berlalu, dan kamu masih jadi alasan kenapa semua terasa indah.',
'Satu tahun bersama kamu terasa seperti rumah yang selalu ingin aku pulangin.',
'Dari semua hal baik yang datang tahun ini, kamu tetap yang paling aku syukuri.',
'Satu tahun berlalu, dan aku masih jatuh cinta pada senyum yang sama.',
'365 hari bersama kamu, dan tidak ada satu pun yang ingin aku tukar.',
'Satu tahun ini penuh cerita kecil, tapi semuanya terasa besar karena ada kamu.',
'Kalau waktu bisa diulang, aku tetap akan memilih jatuh cinta sama kamu lagi.',
'Satu tahun bersama kamu membuatku percaya kalau cinta bisa setenang dan seindah ini.',
'Terima kasih sudah hadir dan membuat satu tahun ini terasa begitu berarti.',
'Satu tahun mungkin terdengar singkat, tapi cukup untuk membuatku semakin yakin sama kamu.',
'Setahun berlalu, dan kamu masih jadi bagian paling indah dari semuanya.',
'Satu tahun yang hangat, lembut, dan dipenuhi cerita kecil tentang kita.',
'Dari semua hari yang sudah lewat, tetap kamu yang paling tinggal di hati.',
'Satu tahun berlalu, dan rasanya aku masih jatuh cinta pada orang yang sama.'

      ]
      : [
        'Tanggal 9 selalu punya cara sendiri untuk membuatku semakin sayang sama kamu.',
        'Entah kenapa, setiap tanggal 9 rasanya dunia jadi lebih manis sejak ada kamu.',
        'Ada banyak hari indah, tapi tanggal 9 selalu terasa paling hangat karena kamu.',
        'Setiap tanggal 9 bikin aku inget kalau mencintaimu adalah hal terbaik yang pernah terjadi.',
        'Anniversary kecil tetap berarti besar, karena dirayakan bersama kamu.',
'Tanggal 9 bukan cuma angka, tapi pengingat bahwa aku masih jatuh cinta sama orang yang sama.',
'Hari ini terasa lebih tenang, lebih manis, dan lebih lengkap karena ada kamu di sisiku.',
'Mungkin dunia biasa saja hari ini, tapi bagiku tanggal 9 selalu spesial karena ada cerita kita di dalamnya.',
'Setiap anniversary bersamamu selalu terasa seperti alasan baru untuk bersyukur.',
'Kalau cinta punya tanggal favorit, mungkin pilihannya akan selalu jatuh di tanggal 9.',
'Tanggal 9 selalu terasa lebih indah sejak ada kamu.',
'Hari ini terasa lebih manis, mungkin karena ada kamu di dalamnya.',
'Ada hari yang terasa biasa, dan ada hari yang selalu mengingatkanku pada kamu.',
'Setiap anniversary kecil tetap punya caranya sendiri untuk terasa spesial.'
      ]
  ), [anniversaryState.isYearlyAnniversary]);
  const anniversaryPhotos = useMemo(() => {
    if (!anniversaryState.isAnniversaryDay) {
      return [];
    }

    const photoPool = GALLERY_ITEMS.filter((item) => !item.isGif);
    const targetCount = anniversaryState.isYearlyAnniversary ? 8 : 6;
    const seedSource = anniversaryState.sessionKey;
    let seed = 0;

    for (let index = 0; index < seedSource.length; index += 1) {
      seed = (seed * 31 + seedSource.charCodeAt(index)) % 2147483647;
    }

    const selected: typeof photoPool = [];
    const usedIndexes = new Set<number>();

    while (selected.length < Math.min(targetCount, photoPool.length)) {
      seed = (seed * 48271) % 2147483647;
      const nextIndex = seed % photoPool.length;

      if (usedIndexes.has(nextIndex)) {
        continue;
      }

      usedIndexes.add(nextIndex);
      selected.push(photoPool[nextIndex]);
    }

    return selected;
  }, [anniversaryState.isAnniversaryDay, anniversaryState.isYearlyAnniversary, anniversaryState.sessionKey]);
  const floatingHearts = useMemo(() => (
    Array.from({ length: 5 }, (_, i) => ({
      id: i,
      left: `${15 + i * 18}%`,
      startX: `${Math.random() * 100}%`,
      duration: 8 + Math.random() * 4,
      delay: i * 2
    }))
  ), []);

  useEffect(() => {
    // Hide scroll guide after 5 seconds or on scroll
    const timer = setTimeout(() => {
      setShowScrollGuide(false);
    }, 5000);

    const handleScroll = () => {
      setShowScrollGuide(false);
      window.removeEventListener('scroll', handleScroll, true);
    };

    window.addEventListener('scroll', handleScroll, { capture: true, passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  useEffect(() => {
    if (!anniversaryState.isAnniversaryDay || reducedMotion || romanticLines.length <= 1) {
      setRomanticLineIndex(0);
      return;
    }

    const timer = window.setInterval(() => {
      setRomanticLineIndex((current) => (current + 1) % romanticLines.length);
    }, 3200);

    return () => clearInterval(timer);
  }, [anniversaryState.isAnniversaryDay, reducedMotion, romanticLines]);

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
          {floatingHearts.map((heart) => (
            <motion.div
              key={heart.id}
              className="absolute text-rose-300/30 dark:text-rose-600/30 text-2xl"
              initial={{
                x: heart.startX,
                y: '100%',
                opacity: 0
              }}
              animate={{
                y: '-20%',
                opacity: [0, 0.8, 0]
              }}
              transition={{
                duration: heart.duration,
                repeat: Infinity,
                delay: heart.delay,
                ease: "linear"
              }}
              style={{ left: heart.left }}
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
          {anniversaryState.isAnniversaryDay && (
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className={`mx-auto mb-8 max-w-md overflow-hidden rounded-[2rem] border text-left shadow-[0_18px_45px_rgba(15,23,42,0.08)] ${
                anniversaryState.isYearlyAnniversary
                  ? 'border-amber-200/60 bg-[linear-gradient(180deg,rgba(255,250,240,0.98),rgba(255,244,229,0.92)_56%,rgba(255,244,229,0.2)_100%)] dark:border-amber-300/15 dark:bg-[linear-gradient(180deg,rgba(49,28,18,0.82),rgba(17,24,39,0.9)_60%,rgba(17,24,39,0.18)_100%)]'
                  : 'border-rose-200/60 bg-[linear-gradient(180deg,rgba(255,248,246,0.98),rgba(255,238,234,0.94)_56%,rgba(255,238,234,0.18)_100%)] dark:border-rose-300/15 dark:bg-[linear-gradient(180deg,rgba(60,24,39,0.82),rgba(17,24,39,0.9)_60%,rgba(17,24,39,0.18)_100%)]'
              }`}
            >
              <div className="relative h-[17.5rem] overflow-hidden px-3 pt-3">
                {anniversaryPhotos.map((photo, index) => {
                  const desktopLayouts = [
                    { left: '-2%', top: '8%', rotate: -10, width: '31%' },
                    { left: '16%', top: '2%', rotate: -3, width: '28%' },
                    { left: '36%', top: '11%', rotate: 7, width: '29%' },
                    { left: '58%', top: '1%', rotate: -6, width: '27%' },
                    { left: '76%', top: '14%', rotate: 8, width: '22%' },
                    { left: '4%', top: '34%', rotate: 5, width: '25%' },
                    { left: '31%', top: '37%', rotate: -8, width: '27%' },
                    { left: '60%', top: '35%', rotate: 4, width: '25%' },
                  ];
                  const layout = desktopLayouts[index % desktopLayouts.length];

                  return (
                    <div
                      key={`${photo.src}-${index}`}
                      className="absolute overflow-hidden rounded-[1.45rem] bg-white/90 p-[3px] shadow-[0_18px_35px_rgba(15,23,42,0.14)] dark:bg-white/10"
                      style={{
                        left: layout.left,
                        top: layout.top,
                        width: layout.width,
                        transform: `rotate(${layout.rotate}deg)`,
                        zIndex: index + 1,
                      }}
                    >
                      <img
                        src={photo.src}
                        alt={`Bilvin moment ${index + 1}`}
                        className="h-28 w-full rounded-[1.2rem] object-cover sm:h-32"
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                      />
                    </div>
                  );
                })}

                <div className={`absolute inset-x-0 bottom-0 h-28 ${
                  anniversaryState.isYearlyAnniversary
                    ? 'bg-[linear-gradient(180deg,rgba(255,250,240,0)_0%,rgba(255,246,235,0.58)_42%,rgba(255,244,229,0.96)_100%)] dark:bg-[linear-gradient(180deg,rgba(49,28,18,0)_0%,rgba(24,26,38,0.45)_42%,rgba(17,24,39,0.94)_100%)]'
                    : 'bg-[linear-gradient(180deg,rgba(255,248,246,0)_0%,rgba(255,242,238,0.56)_42%,rgba(255,238,234,0.96)_100%)] dark:bg-[linear-gradient(180deg,rgba(60,24,39,0)_0%,rgba(28,26,40,0.44)_42%,rgba(17,24,39,0.94)_100%)]'
                }`} />
              </div>

              <div className={`relative px-5 pb-5 pt-4 ${
                anniversaryState.isYearlyAnniversary
                  ? 'bg-[radial-gradient(circle_at_top_right,_rgba(251,191,36,0.18),_transparent_38%)]'
                  : 'bg-[radial-gradient(circle_at_top_right,_rgba(244,63,94,0.16),_transparent_38%)]'
              }`}>
                <div className="flex items-center justify-between gap-3">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] ${
                    anniversaryState.isYearlyAnniversary
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-200'
                      : 'bg-rose-100 text-rose-600 dark:bg-rose-400/10 dark:text-rose-200'
                  }`}>
                    {anniversaryState.badgeLabel}
                  </span>
                  <span className={`text-xs font-medium ${
                    anniversaryState.isYearlyAnniversary
                      ? 'text-amber-600/80 dark:text-amber-200/70'
                      : 'text-rose-500/80 dark:text-rose-200/70'
                  }`}>
                    09 / Bilvin Day
                  </span>
                </div>

                <div className="mt-5 flex items-end gap-4">
                  <div className={`leading-none ${
                    anniversaryState.isYearlyAnniversary
                      ? 'text-amber-500 dark:text-amber-300'
                      : 'text-rose-500 dark:text-rose-300'
                  }`}>
                    <span className="font-typewriter text-5xl sm:text-6xl">
                      {String(
                        anniversaryState.isYearlyAnniversary
                          ? Math.max(anniversaryState.yearCount, 1)
                          : anniversaryState.monthCount
                      ).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="pb-1">
                    <p className={`text-[11px] font-semibold uppercase tracking-[0.32em] ${
                      anniversaryState.isYearlyAnniversary
                        ? 'text-amber-700 dark:text-amber-200/80'
                        : 'text-rose-600 dark:text-rose-200/80'
                    }`}>
                      {anniversaryState.isYearlyAnniversary ? 'Years of Us' : 'Month of Us'}
                    </p>
                    <h2 className="mt-2 font-serif text-[1.75rem] leading-[1.05] text-stone-900 dark:text-white">
                      {anniversaryState.isYearlyAnniversary
                        ? 'Still warm. Still ours.'
                        : 'A little brighter today.'}
                    </h2>
                  </div>
                </div>

                <div className="mt-4 min-h-[3.25rem] max-w-sm">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={romanticLineIndex}
                      initial={reducedMotion ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reducedMotion ? {} : { opacity: 0, y: -6 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="text-sm italic leading-6 text-stone-600 dark:text-stone-300"
                    >
                      {romanticLines[romanticLineIndex]}
                    </motion.p>
                  </AnimatePresence>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <div className={`h-[3px] w-14 rounded-full ${
                    anniversaryState.isYearlyAnniversary ? 'bg-amber-400/80' : 'bg-rose-400/80'
                  }`} />
                  <div className="h-[3px] w-6 rounded-full bg-white/70 dark:bg-white/20" />
                </div>
              </div>
            </motion.div>
          )}

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
            <DetailedCounter anniversaryState={anniversaryState} />
            <AlternativeCounter anniversaryState={anniversaryState} />
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

const DetailedCounter: React.FC<{ anniversaryState: AnniversaryState }> = ({ anniversaryState }) => {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const diff = now.getTime() - RELATIONSHIP_START_DATE.getTime();

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
        <TimeUnit value={time.days} label="Hari" />
        <span className="text-rose-300 -mt-4">:</span>
        <TimeUnit value={time.hours} label="Jam" />
        <span className="text-rose-300 -mt-4">:</span>
        <TimeUnit value={time.minutes} label="Menit" />
        <span className="text-rose-300 -mt-4">:</span>
        <TimeUnit value={time.seconds} label="Detik" />
      </div>
      {anniversaryState.isAnniversaryDay && (
        <div className={`mt-4 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] ${
          anniversaryState.isYearlyAnniversary
            ? 'bg-amber-100/80 text-amber-700 dark:bg-amber-900/35 dark:text-amber-200'
            : 'bg-rose-100/80 text-rose-600 dark:bg-rose-900/35 dark:text-rose-200'
        }`}>
          Today is our day
        </div>
      )}
    </div>
  );
};

const AlternativeCounter: React.FC<{ anniversaryState: AnniversaryState }> = ({ anniversaryState }) => {
  const [duration, setDuration] = useState({ months: 0, days: 0 });

  useEffect(() => {
    const updateDuration = () => {
      const now = new Date();
      let months = getMonthsSinceStart(now);
      let anchorDate = new Date(RELATIONSHIP_START_DATE);
      anchorDate.setMonth(anchorDate.getMonth() + months);

      if (anchorDate.getTime() > now.getTime()) {
        months = Math.max(0, months - 1);
        anchorDate = new Date(RELATIONSHIP_START_DATE);
        anchorDate.setMonth(anchorDate.getMonth() + months);
      }

      const days = Math.max(
        0,
        Math.floor((now.getTime() - anchorDate.getTime()) / (1000 * 60 * 60 * 24))
      );

      setDuration({ months, days });
    };

    updateDuration();
    const timer = setInterval(updateDuration, 60000);

    return () => clearInterval(timer);
  }, []);

  const monthWords = [
    'Nol',
    'Satu',
    'Dua',
    'Tiga',
    'Empat',
    'Lima',
    'Enam',
    'Tujuh',
    'Delapan',
    'Sembilan',
    'Sepuluh',
    'Sebelas',
    'Dua Belas',
    'Tiga Belas',
    'Empat Belas',
    'Lima Belas',
    'Enam Belas',
    'Tujuh Belas',
    'Delapan Belas',
    'Sembilan Belas',
    'Dua Puluh',
    'Dua Puluh Satu',
    'Dua Puluh Dua',
    'Dua Puluh Tiga',
    'Dua Puluh Empat',
  ];

  const displayLabel = anniversaryState.isAnniversaryDay && duration.days === 0
    ? `${monthWords[duration.months] ?? duration.months} Bulan`
    : `${duration.months} Bulan ${duration.days} Hari`;

  return (
    <div className="flex flex-col items-center mt-3">
      <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-stone-400 dark:text-stone-500 mb-2 uppercase">
        Atau
      </span>
      <span className={`font-serif italic text-rose-400 dark:text-rose-300 ${
        anniversaryState.isAnniversaryDay
          ? 'text-[1.65rem] sm:text-[1.9rem] leading-tight'
          : 'text-lg sm:text-xl'
      }`}>
        {displayLabel}
      </span>
    </div>
  );
};

export default Timeline;
