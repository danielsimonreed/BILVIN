import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const START_DATE = new Date("2025-09-09T00:00:00+07:00");

interface MonthlyDate {
    date: Date;
    monthNumber: number; // 1 = 1 bulan, 2 = 2 bulan, etc.
    label: string;
    isUnlocked: boolean;
    isCurrent: boolean;
    isStartDate: boolean;
}

const generateMonthlyDates = (): MonthlyDate[] => {
    const now = new Date();
    const dates: MonthlyDate[] = [];

    // Start date entry (month 0)
    dates.push({
        date: new Date(START_DATE),
        monthNumber: 0,
        label: 'Hari Jadian 💕',
        isUnlocked: true,
        isCurrent: false,
        isStartDate: true,
    });

    // Generate monthly dates from month 1 to 12
    for (let i = 1; i <= 12; i++) {
        const d = new Date(START_DATE);
        d.setMonth(d.getMonth() + i);
        const isUnlocked = now >= d;

        dates.push({
            date: d,
            monthNumber: i,
            label: i === 12 ? '1 Tahun Anniversary! 🎊' : `${i} Bulan Anniversary`,
            isUnlocked,
            isCurrent: false,
            isStartDate: false,
        });
    }

    // Mark the most recent unlocked date as "current"
    const unlockedDates = dates.filter(d => d.isUnlocked && !d.isStartDate);
    if (unlockedDates.length > 0) {
        const lastUnlocked = unlockedDates[unlockedDates.length - 1];
        lastUnlocked.isCurrent = true;
    }

    return dates;
};

const getNextLockedDate = (dates: MonthlyDate[]): MonthlyDate | null => {
    return dates.find(d => !d.isUnlocked) || null;
};

const formatDate = (date: Date): string => {
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

// Countdown component
const Countdown: React.FC<{ targetDate: Date; monthNumber: number }> = ({ targetDate, monthNumber }) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const update = () => {
            const now = new Date();
            const diff = targetDate.getTime() - now.getTime();
            if (diff <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }
            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((diff % (1000 * 60)) / 1000),
            });
        };
        update();
        const timer = setInterval(update, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    const TimeUnit = ({ value, label }: { value: number; label: string }) => (
        <div className="flex flex-col items-center">
            <span className="font-typewriter font-bold text-xl sm:text-2xl text-rose-500 dark:text-rose-400 tabular-nums">
                {String(value).padStart(2, '0')}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-rose-300 dark:text-rose-600 font-medium">
                {label}
            </span>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-rose-50/60 to-pink-50/40 dark:from-rose-950/40 dark:to-pink-950/30 border border-rose-200/50 dark:border-rose-800/40 backdrop-blur-sm"
        >
            <div className="text-center mb-3">
                <motion.span
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="inline-block text-2xl"
                >
                    💗
                </motion.span>
                <p className="text-xs font-bold tracking-[0.15em] uppercase text-rose-400 dark:text-rose-500 mt-1">
                    Menuju Anniversary {monthNumber} Bulan
                </p>
            </div>
            <div className="flex justify-center items-center gap-2">
                <TimeUnit value={timeLeft.days} label="Hari" />
                <span className="text-rose-300 dark:text-rose-600 font-bold -mt-3">:</span>
                <TimeUnit value={timeLeft.hours} label="Jam" />
                <span className="text-rose-300 dark:text-rose-600 font-bold -mt-3">:</span>
                <TimeUnit value={timeLeft.minutes} label="Menit" />
                <span className="text-rose-300 dark:text-rose-600 font-bold -mt-3">:</span>
                <TimeUnit value={timeLeft.seconds} label="Detik" />
            </div>
        </motion.div>
    );
};

// Individual date card
const DateCard: React.FC<{ item: MonthlyDate; index: number }> = ({ item, index }) => {
    const achievementEmojis = ['🌸', '⭐', '✨', '🌙', '🎀', '💎', '🦋', '🌺', '🪷', '💫', '🌟', '🎊'];

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.06, duration: 0.4 }}
            className="relative pl-7"
        >
            {/* Timeline dot */}
            <div
                className={`absolute -left-[7px] top-3 w-3.5 h-3.5 rounded-full border-[3px] transition-all ${item.isStartDate
                    ? 'bg-rose-500 border-rose-200 dark:border-stone-800 shadow-[0_0_8px_rgba(244,63,94,0.5)]'
                    : item.isCurrent
                        ? 'bg-amber-400 border-amber-200 dark:border-stone-800 shadow-[0_0_12px_rgba(251,191,36,0.6)]'
                        : item.isUnlocked
                            ? 'bg-rose-400 border-rose-100 dark:border-stone-800 shadow-[0_0_6px_rgba(244,63,94,0.3)]'
                            : 'bg-stone-300 dark:bg-stone-600 border-stone-200 dark:border-stone-800'
                    }`}
            />

            {/* Card */}
            <div
                className={`p-3 rounded-xl transition-all ${item.isStartDate
                    ? 'bg-gradient-to-r from-rose-500/10 to-pink-500/10 dark:from-rose-500/15 dark:to-pink-500/15 border border-rose-300/50 dark:border-rose-700/50 shadow-sm'
                    : item.isCurrent
                        ? 'bg-gradient-to-r from-amber-50/80 to-rose-50/80 dark:from-amber-900/20 dark:to-rose-900/20 border border-amber-300/60 dark:border-amber-700/40 shadow-md shadow-amber-200/30 dark:shadow-amber-900/20'
                        : item.isUnlocked
                            ? 'bg-white/60 dark:bg-stone-800/60 border border-rose-100/60 dark:border-stone-700/60 shadow-sm'
                            : 'bg-stone-50/40 dark:bg-stone-800/30 border border-dashed border-stone-200/60 dark:border-stone-700/40'
                    }`}
            >
                <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        {/* Date */}
                        <p
                            className={`text-[11px] font-bold tracking-wider uppercase ${item.isCurrent
                                ? 'text-amber-500 dark:text-amber-400'
                                : item.isUnlocked
                                    ? 'text-rose-400 dark:text-rose-500'
                                    : 'text-stone-400 dark:text-stone-500'
                                }`}
                        >
                            {formatDate(item.date)}
                        </p>

                        {/* Label */}
                        <p
                            className={`text-sm font-serif mt-0.5 ${item.isUnlocked
                                ? 'text-stone-800 dark:text-stone-200'
                                : 'text-stone-400 dark:text-stone-500'
                                }`}
                        >
                            {item.label}
                        </p>

                        {/* Current badge */}
                        {item.isCurrent && (
                            <motion.div
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="mt-1.5"
                            >
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full">
                                    📍 we are here!
                                </span>
                            </motion.div>
                        )}
                    </div>

                    {/* Right side icon */}
                    <div className="flex-shrink-0">
                        {item.isUnlocked ? (
                            <motion.span
                                initial={{ scale: 0, rotate: -180 }}
                                whileInView={{ scale: 1, rotate: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.06 + 0.2, type: "spring", stiffness: 200 }}
                                className="text-xl"
                            >
                                {item.isStartDate ? '❤️' : (achievementEmojis[item.monthNumber - 1] || '🎉')}
                            </motion.span>
                        ) : (
                            <span className="text-lg opacity-40">🔒</span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const MonthlyAnniversary: React.FC = () => {
    const dates = generateMonthlyDates();
    const nextDate = getNextLockedDate(dates);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-10"
        >
            {/* Section Header */}
            <div className="text-center mb-6">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="text-2xl">🗓️</span>
                    <h3 className="font-serif text-xl text-stone-800 dark:text-rose-50 mt-2 mb-1">
                        Monthly Anniversary Journey
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 italic font-serif">
                        Setiap tanggal 9 adalah harinya Bilvin 🤍
                    </p>
                    <div className="w-10 h-0.5 bg-rose-200 dark:bg-rose-800 mx-auto mt-3 rounded-full" />
                </motion.div>
            </div>

            {/* Countdown to next date */}
            {nextDate && (
                <Countdown targetDate={nextDate.date} monthNumber={nextDate.monthNumber} />
            )}

            {/* Timeline */}
            <div className="relative border-l-[2px] border-rose-200 dark:border-rose-900/70 ml-3 space-y-3">
                {dates.map((item, index) => (
                    <DateCard key={item.monthNumber} item={item} index={index} />
                ))}
            </div>

            {/* Footer note */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="text-center mt-6"
            >
                <p className="text-[10px] text-rose-300 dark:text-rose-700 font-medium tracking-widest uppercase">
                    Love you so much my Sweet Baby 🤍
                </p>
            </motion.div>
        </motion.div>
    );
};

export default MonthlyAnniversary;
