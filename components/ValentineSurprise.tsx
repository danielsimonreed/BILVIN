import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

interface ValentineSurpriseProps {
    onDismiss: () => void;
}

// ─── LETTER CONTENT ──────────────────────────────────────────────────

const LETTER_PAGES = [
    {
        title: "Bilqis, sayangkuuu 🤍",
        body: `Happy Valentine's Day sayangg. Jujur ini kali pertama aku ngerayain yang namanya 'Valentine Day', dan itu bareng kamu.. yeayyy.. Tapi terlepas dari apapun makna hari spesial ini, menurut aku setiap hari bareng kamu itu hari special, aku bisa tenang karena aku tau dan sadar kalau kamu milik aku seorang, aku bisa ngechat kamu tanpa kuatir ada orang lain yang marah, dan aku bisa cium dan peluk kamu kapanpun hehe.. wlee

I love you so much.. kata ini mungkin udah sering banget aku bilang sayang, tapi emang bener, aku sayang banget sama kamu, not only words, but you always in my mind, everyday and everytime. Kamu selalu jadi semangat buatkuuu, cantik..!`,
        emoji: "�",
    },
    {
        title: "Beruntungnya Aku...",
        body: `Makasih yang sayang selalu kasih energi positif buat aku, beruntungnya aku punya kamu yang cantik banget kaya bidadari (jangan ngelakk :p), baik kaya si bawang putih, dan perhatian banget sama aku. Terus jadi diri kamu sendiri ya sayang, i love you so so soooooomayy 🤍

Aku nulis ini sambil senyum-senyum sendiri tau, karena jujur ajaa sayangg… aku bersyukur banget bisa sampai di titik ini bareng kamu.`,
        emoji: "🌹",
    },
    {
        title: "5 Bulan Bareng Kamu",
        body: `Ngga kerasa yaa.. udah 5 bulan kita ngejalanin hubungan ini bareng. Mungkin buat orang lain itu masih dibilang "baru", atau belum lama, tapi buatku, 5 bulan ini justru terasa cepet banget, ngga berasa aja, ngga tau yaa.. aku sih ngerasa mungkin karena selama 5 bulan bareng kamu, hidup aku dipenuhin rasa bahagia, jadinya terasa cepet dan nyaman banget jalaninnya hehe :p

Kita udah ngelewatin banyak hal, banyak cerita, banyak tawa, mungkin juga beberapa drama kecil yang justru bikin kita makin ngerti satu sama lain. And I'm really grateful for every single moment.`,
        emoji: "✨",
    },
    {
        title: "Kamu Semangat Aku",
        body: `Aku mau kamu tau, aku sayang banget sama kamu. Kamu itu selalu jadi semangat aku buat lakuin hal-hal baru, buat achieve sesuatu yang lebih baik di hidup aku. Kamu bikin aku pengen jadi versi terbaik dari diri aku sendiri.

Aku mau terus sama kamu. Aku pengen hubungan ini panjang. Bukan hanya sekedar pacaran, tapi aku mau nikah sama kamu. Aaaaminnn.. Semoga kamupun punya angan angan yang sama kaya akuu… please stay with me, grow with me. Aku mau jadi yang terakhir buat kamu. Aku ngga mau kehilangan kamu, ngga bisa kebayang juga kalau harus tanpa kamu :(`,
        emoji: "💍",
    },
    {
        title: "Your Safe Place",
        body: `Aku mau selalu ada di sisi kamu, waktu kamu lagi down, capek, overthinking, atau lagi happy banget dan pengen cerita semua hal random. I want to be your safe place, and I hope I can always call you mine too.

Aku juga pengen kamu terus nemenin aku ngewujudin semua wishlist kita satu satu. Yang kita tulis panjang listnya di chat WA, yang kita juga tulis di website onlyforbilqis itu… semua mimpi kecil sampai mimpi besar kita. Aku pengen satu-satu kita gapai bareng bareng. Pelan-pelan, tapi harus bareng!!`,
        emoji: "🏡",
    },
    {
        title: "Happy Valentine's Day 🤍",
        body: `Thank you for choosing me every day. Thank you udah jadi diri kamu yang sabar, yang perhatian, yang selalu bikin aku ngerasa cukup.

I love you so much, Bilqisku sayangg. More than I can explain in words.

Happy Valentine's Day, my favorite person 🤍`,
        emoji: "💝",
        isFinale: true,
    },
];

// ─── FLOATING HEART PARTICLE ─────────────────────────────────────────
const FloatingHeart: React.FC<{ delay: number; size: number; x: number }> = ({ delay, size, x }) => (
    <motion.div
        className="absolute text-rose-400/30 dark:text-rose-300/20 pointer-events-none"
        style={{ left: `${x}%`, bottom: -20, fontSize: size }}
        initial={{ y: 0, opacity: 0, rotate: 0 }}
        animate={{
            y: [-20, -600 - Math.random() * 200],
            opacity: [0, 0.7, 0.5, 0],
            rotate: [0, Math.random() > 0.5 ? 25 : -25],
            x: [0, (Math.random() - 0.5) * 80],
        }}
        transition={{
            duration: 6 + Math.random() * 4,
            delay,
            repeat: Infinity,
            ease: "easeOut",
        }}
    >
        ❤
    </motion.div>
);

// ─── SPARKLE PARTICLE ────────────────────────────────────────────────
const Sparkle: React.FC<{ delay: number; x: number; y: number }> = ({ delay, x, y }) => (
    <motion.div
        className="absolute pointer-events-none"
        style={{ left: `${x}%`, top: `${y}%` }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
            scale: [0, 1.2, 0],
            opacity: [0, 1, 0],
            rotate: [0, 180],
        }}
        transition={{
            duration: 1.5,
            delay,
            repeat: Infinity,
            repeatDelay: 2 + Math.random() * 3,
        }}
    >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
                d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
                fill="currentColor"
                className="text-yellow-300 dark:text-yellow-200"
            />
        </svg>
    </motion.div>
);

// ─── PETAL PARTICLE ──────────────────────────────────────────────────
const FallingPetal: React.FC<{ delay: number; x: number }> = ({ delay, x }) => (
    <motion.div
        className="absolute pointer-events-none text-pink-300/50 dark:text-pink-400/30"
        style={{ left: `${x}%`, top: -20, fontSize: 14 + Math.random() * 10 }}
        initial={{ y: 0, opacity: 0, rotate: 0 }}
        animate={{
            y: [0, 700],
            opacity: [0, 0.8, 0.6, 0],
            rotate: [0, 360],
            x: [0, (Math.random() - 0.5) * 120],
        }}
        transition={{
            duration: 5 + Math.random() * 3,
            delay,
            repeat: Infinity,
            ease: "linear",
        }}
    >
        🌸
    </motion.div>
);

// ─── TYPEWRITER TEXT ─────────────────────────────────────────────────
const TypewriterText: React.FC<{ text: string; onComplete?: () => void }> = ({ text, onComplete }) => {
    const [displayed, setDisplayed] = useState('');
    const indexRef = useRef(0);

    useEffect(() => {
        indexRef.current = 0;
        setDisplayed('');

        const interval = setInterval(() => {
            if (indexRef.current < text.length) {
                setDisplayed(text.slice(0, indexRef.current + 1));
                indexRef.current++;
            } else {
                clearInterval(interval);
                onComplete?.();
            }
        }, 30);

        return () => clearInterval(interval);
    }, [text, onComplete]);

    return (
        <span className="font-typewriter text-sm sm:text-base leading-relaxed text-stone-700 dark:text-stone-300 whitespace-pre-line">
            {displayed}
            <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="text-rose-500"
            >
                |
            </motion.span>
        </span>
    );
};

// ─── CONFETTI BURST (finale) ─────────────────────────────────────────
const ConfettiBurst: React.FC = () => {
    const confetti = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        emoji: ['✨', '💕', '🌹', '💖', '🎀', '💗', '🌸'][Math.floor(Math.random() * 7)],
        size: 12 + Math.random() * 14,
    }));

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {confetti.map((c) => (
                <motion.div
                    key={c.id}
                    className="absolute"
                    style={{ left: `${c.x}%`, top: '40%', fontSize: c.size }}
                    initial={{ y: 0, opacity: 0, scale: 0 }}
                    animate={{
                        y: [0, -(100 + Math.random() * 200), 300],
                        x: [(Math.random() - 0.5) * 100, (Math.random() - 0.5) * 150],
                        opacity: [0, 1, 1, 0],
                        scale: [0, 1.2, 1, 0.5],
                        rotate: [0, Math.random() * 360],
                    }}
                    transition={{
                        duration: 2.5 + Math.random(),
                        delay: c.delay,
                        ease: "easeOut",
                    }}
                >
                    {c.emoji}
                </motion.div>
            ))}
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════

const ValentineSurprise: React.FC<ValentineSurpriseProps> = ({ onDismiss }) => {
    const [phase, setPhase] = useState<'envelope' | 'opening' | 'letter'>('envelope');
    const [currentPage, setCurrentPage] = useState(0);
    const [typewriterDone, setTypewriterDone] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    const handleEnvelopeClick = () => {
        setPhase('opening');
        setTimeout(() => setPhase('letter'), 1400);
    };

    const handleNextPage = () => {
        if (currentPage < LETTER_PAGES.length - 1) {
            setTypewriterDone(false);
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setTypewriterDone(false);
            setCurrentPage((prev) => prev - 1);
        }
    };

    const handleTypewriterComplete = useCallback(() => {
        setTypewriterDone(true);
        if (LETTER_PAGES[currentPage]?.isFinale) {
            setShowConfetti(true);
        }
    }, [currentPage]);

    const handleDismiss = () => {
        sessionStorage.setItem('valentineSurprise2026Seen', 'true');
        onDismiss();
    };

    // ── Floating hearts data (persistent across phases)
    const hearts = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        delay: i * 0.8,
        size: 16 + Math.random() * 20,
        x: Math.random() * 100,
    }));

    const sparkles = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        delay: i * 0.6 + Math.random(),
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 80,
    }));

    const petals = Array.from({ length: 10 }, (_, i) => ({
        id: i,
        delay: i * 0.7,
        x: Math.random() * 100,
    }));

    return (
        <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
        >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-rose-100 via-pink-50 to-red-100 dark:from-slate-950 dark:via-[#1a0a1a] dark:to-[#0d0515]" />

            {/* Floating hearts (always visible) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {hearts.map((h) => (
                    <FloatingHeart key={h.id} delay={h.delay} size={h.size} x={h.x} />
                ))}
            </div>

            {/* Sparkles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {sparkles.map((s) => (
                    <Sparkle key={s.id} delay={s.delay} x={s.x} y={s.y} />
                ))}
            </div>

            {/* ── PHASE 1: ENVELOPE ──────────────────────────────────── */}
            <AnimatePresence mode="wait">
                {phase === 'envelope' && (
                    <motion.div
                        key="envelope-scene"
                        className="relative z-10 flex flex-col items-center gap-6 px-6"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -40, scale: 0.9 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Teaser text */}
                        <motion.p
                            className="font-serif text-lg sm:text-xl text-rose-600 dark:text-rose-300 text-center italic"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                        >
                            You have a special letter... 💌
                        </motion.p>

                        {/* 3D Envelope */}
                        <motion.div
                            className="cursor-pointer perspective-1000"
                            onClick={handleEnvelopeClick}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            animate={{
                                y: [0, -8, 0],
                            }}
                            transition={{
                                y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
                            }}
                        >
                            <div className="relative w-64 h-44 sm:w-72 sm:h-48">
                                {/* Envelope body */}
                                <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-pink-500 dark:from-rose-600 dark:to-pink-700 rounded-2xl shadow-2xl shadow-rose-500/40 dark:shadow-rose-800/60 overflow-hidden">
                                    {/* Envelope flap (triangle) */}
                                    <div className="absolute top-0 left-0 w-full h-1/2 overflow-hidden">
                                        <div
                                            className="absolute top-0 left-1/2 -translate-x-1/2 w-[160%] h-full bg-gradient-to-b from-rose-300 to-rose-400 dark:from-rose-500 dark:to-rose-600"
                                            style={{
                                                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                                            }}
                                        />
                                    </div>

                                    {/* Heart seal */}
                                    <motion.div
                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                                        animate={{
                                            scale: [1, 1.15, 1],
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                    >
                                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/90 dark:bg-white/80 rounded-full flex items-center justify-center shadow-lg shadow-rose-300/50">
                                            <span className="text-2xl sm:text-3xl">💌</span>
                                        </div>
                                    </motion.div>

                                    {/* Decorative line */}
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-white/30 rounded-full" />
                                    <div className="absolute bottom-7 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-white/20 rounded-full" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Tap instruction */}
                        <motion.p
                            className="text-xs text-rose-400 dark:text-rose-500 tracking-widest uppercase font-medium"
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            Tap to open
                        </motion.p>
                    </motion.div>
                )}

                {/* ── PHASE 2: OPENING ANIMATION ──────────────────────── */}
                {phase === 'opening' && (
                    <motion.div
                        key="opening-scene"
                        className="relative z-10 flex items-center justify-center"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Envelope opens and letter rises */}
                        <div className="relative w-64 h-44 sm:w-72 sm:h-48 perspective-1000">
                            {/* Envelope body stays */}
                            <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-pink-500 dark:from-rose-600 dark:to-pink-700 rounded-2xl shadow-2xl">
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-white/30 rounded-full" />
                            </div>

                            {/* Flap opens */}
                            <motion.div
                                className="absolute top-0 left-0 w-full h-1/2 origin-top"
                                initial={{ rotateX: 0 }}
                                animate={{ rotateX: -180 }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                <div
                                    className="absolute inset-0 bg-gradient-to-b from-rose-300 to-rose-400 dark:from-rose-500 dark:to-rose-600 backface-hidden"
                                    style={{
                                        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                                    }}
                                />
                            </motion.div>

                            {/* Letter slides up */}
                            <motion.div
                                className="absolute left-1/2 -translate-x-1/2 w-[85%] bg-white dark:bg-stone-900 rounded-xl shadow-xl"
                                initial={{ top: '30%', height: '50%', opacity: 0 }}
                                animate={{ top: '-120%', height: '130%', opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                            >
                                <div className="p-4 flex flex-col items-center justify-center h-full">
                                    <motion.span
                                        className="text-3xl"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    >
                                        💝
                                    </motion.span>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {/* ── PHASE 3 & 4: LETTER CONTENT ─────────────────────── */}
                {phase === 'letter' && (
                    <motion.div
                        key="letter-scene"
                        className="relative z-10 flex flex-col items-center w-full max-w-md px-4"
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                    >
                        {/* Falling petals */}
                        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                            {petals.map((p) => (
                                <FallingPetal key={p.id} delay={p.delay} x={p.x} />
                            ))}
                        </div>

                        {/* Letter card */}
                        <div className="relative w-full bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-rose-200/40 dark:shadow-rose-900/30 border border-rose-100/60 dark:border-rose-800/30 overflow-hidden">
                            {/* Top decorative bar */}
                            <div className="h-1.5 bg-gradient-to-r from-rose-400 via-pink-400 to-red-400" />

                            {/* Page content */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentPage}
                                    className="p-6 sm:p-8 min-h-[340px] flex flex-col"
                                    initial={{ opacity: 0, x: 40 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -40 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    {/* Page emoji */}
                                    <motion.div
                                        className="text-3xl mb-3 text-center"
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                                    >
                                        {LETTER_PAGES[currentPage].emoji}
                                    </motion.div>

                                    {/* Page title */}
                                    <motion.h2
                                        className="font-serif text-xl sm:text-2xl text-center text-stone-800 dark:text-rose-100 mb-5"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        {LETTER_PAGES[currentPage].title}
                                    </motion.h2>

                                    {/* Typewriter body */}
                                    <div className="flex-1">
                                        <TypewriterText
                                            text={LETTER_PAGES[currentPage].body}
                                            onComplete={handleTypewriterComplete}
                                        />
                                    </div>

                                    {/* Signature on last page */}
                                    {LETTER_PAGES[currentPage].isFinale && typewriterDone && (
                                        <motion.div
                                            className="mt-6 text-center"
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <p className="font-serif text-xs text-rose-500 dark:text-rose-400 uppercase tracking-[0.2em]">
                                                With all my love,
                                            </p>
                                            <p className="font-serif text-lg text-stone-800 dark:text-rose-200 mt-1 italic">
                                                — Kevin ❤️
                                            </p>
                                        </motion.div>
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            {/* Bottom controls */}
                            <div className="px-6 pb-5 flex items-center justify-between">
                                {/* Page dots */}
                                <div className="flex gap-2">
                                    {LETTER_PAGES.map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className={`h-2 rounded-full transition-all duration-300 ${i === currentPage
                                                ? 'w-6 bg-rose-500'
                                                : i < currentPage
                                                    ? 'w-2 bg-rose-300 dark:bg-rose-600'
                                                    : 'w-2 bg-stone-300 dark:bg-stone-600'
                                                }`}
                                        />
                                    ))}
                                </div>

                                {/* Navigation buttons */}
                                <div className="flex gap-2">
                                    {currentPage > 0 && (
                                        <motion.button
                                            onClick={handlePrevPage}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="w-9 h-9 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-500 dark:text-stone-400 text-sm hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                                        >
                                            ←
                                        </motion.button>
                                    )}

                                    {currentPage < LETTER_PAGES.length - 1 ? (
                                        <motion.button
                                            onClick={handleNextPage}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="px-4 h-9 rounded-full bg-rose-500 text-white text-sm font-medium hover:bg-rose-600 shadow-md shadow-rose-500/20 transition-all flex items-center gap-1"
                                        >
                                            Next <span className="text-xs">→</span>
                                        </motion.button>
                                    ) : typewriterDone ? (
                                        <motion.button
                                            onClick={handleDismiss}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-4 h-9 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm font-medium shadow-lg shadow-rose-500/30 transition-all flex items-center gap-1.5"
                                        >
                                            Our Memories <span className="text-xs">💕</span>
                                        </motion.button>
                                    ) : null}
                                </div>
                            </div>
                        </div>

                        {/* Valentine date label */}
                        <motion.p
                            className="mt-4 text-xs text-rose-400/70 dark:text-rose-600/70 tracking-widest uppercase font-medium"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                        >
                            Valentine's Day 2026
                        </motion.p>

                        {/* Confetti on finale */}
                        {showConfetti && <ConfettiBurst />}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ValentineSurprise;
