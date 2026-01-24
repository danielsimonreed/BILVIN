import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface VoiceMessagePageProps {
    onBack: () => void;
}

const VoiceMessagePage: React.FC<VoiceMessagePageProps> = ({ onBack }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        audioRef.current = new Audio('/voice/forbilqis.m4a');

        audioRef.current.addEventListener('loadedmetadata', () => {
            setDuration(audioRef.current?.duration || 0);
            setIsLoaded(true);
        });

        audioRef.current.addEventListener('timeupdate', () => {
            setCurrentTime(audioRef.current?.currentTime || 0);
        });

        audioRef.current.addEventListener('ended', () => {
            setIsPlaying(false);
            setCurrentTime(0);
        });

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-rose-50 to-stone-100 dark:from-slate-900 dark:to-slate-950 relative overflow-hidden">

            {/* Animated Background Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Floating Hearts */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{
                            opacity: 0,
                            y: '100vh',
                            x: `${15 + i * 15}%`
                        }}
                        animate={{
                            opacity: [0, 0.6, 0.6, 0],
                            y: '-20vh',
                        }}
                        transition={{
                            duration: 8 + i * 2,
                            repeat: Infinity,
                            delay: i * 1.5,
                            ease: 'easeOut'
                        }}
                        className="absolute text-2xl"
                    >
                        💕
                    </motion.div>
                ))}

                {/* Sound wave decoration */}
                <motion.div
                    animate={{ opacity: isPlaying ? [0.3, 0.6, 0.3] : 0.2 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute top-10 left-1/2 -translate-x-1/2 flex items-end gap-1"
                >
                    {[...Array(12)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={isPlaying ? {
                                height: [8 + Math.random() * 16, 24 + Math.random() * 24, 8 + Math.random() * 16],
                            } : { height: 8 }}
                            transition={{
                                duration: 0.4 + Math.random() * 0.3,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: i * 0.05
                            }}
                            className="w-1 bg-gradient-to-t from-rose-400 to-pink-300 dark:from-rose-500 dark:to-pink-400 rounded-full"
                            style={{ height: 8 }}
                        />
                    ))}
                </motion.div>
            </div>

            {/* Main Content Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="max-w-sm w-full bg-white/70 dark:bg-black/50 backdrop-blur-2xl border border-white/50 dark:border-white/10 rounded-[2rem] shadow-2xl z-10 overflow-hidden"
            >
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 dark:from-rose-600 dark:via-pink-600 dark:to-rose-500 px-6 py-5 text-center relative overflow-hidden">
                    {/* Sparkle effects */}
                    <motion.div
                        animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute top-2 right-6 text-lg"
                    >
                        ✨
                    </motion.div>
                    <motion.div
                        animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        className="absolute top-3 left-8 text-sm"
                    >
                        💫
                    </motion.div>

                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="text-4xl mb-2"
                    >
                        🎙️
                    </motion.div>
                    <h2 className="font-serif text-xl text-white font-bold tracking-wide">
                        Voice Message
                    </h2>

                </div>

                {/* Voice Player Body */}
                <div className="px-6 py-8">
                    {/* Animated microphone/speaker */}
                    <div className="flex justify-center mb-8">
                        <motion.div
                            animate={isPlaying ? {
                                scale: [1, 1.05, 1],
                                boxShadow: [
                                    '0 0 0 0 rgba(244, 114, 182, 0.4)',
                                    '0 0 0 20px rgba(244, 114, 182, 0)',
                                    '0 0 0 0 rgba(244, 114, 182, 0)'
                                ]
                            } : {}}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-28 h-28 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/50 dark:to-pink-900/50 flex items-center justify-center shadow-lg border-4 border-white/50 dark:border-rose-500/30"
                        >
                            <motion.div
                                animate={isPlaying ? { scale: [1, 1.15, 1] } : {}}
                                transition={{ duration: 0.8, repeat: Infinity }}
                                className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 dark:from-rose-500 dark:to-pink-600 flex items-center justify-center shadow-inner"
                            >
                                <span className="text-4xl">
                                    {isPlaying ? '🔊' : '🎧'}
                                </span>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-6">
                        <div className="relative w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                            <motion.div
                                className="absolute left-0 top-0 h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"
                                style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                            />
                            <input
                                type="range"
                                min="0"
                                max={duration || 0}
                                step="0.01"
                                value={currentTime}
                                onChange={handleSeek}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={!isLoaded}
                            />
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-stone-500 dark:text-stone-400">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    {/* Play/Pause Button */}
                    <div className="flex justify-center mb-8">
                        <motion.button
                            onClick={togglePlay}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={!isLoaded}
                            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all ${isLoaded
                                ? 'bg-gradient-to-br from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700'
                                : 'bg-stone-300 dark:bg-stone-700 cursor-not-allowed'
                                }`}
                        >
                            {!isLoaded ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                    className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full"
                                />
                            ) : isPlaying ? (
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                                    <rect x="6" y="4" width="4" height="16" rx="1" />
                                    <rect x="14" y="4" width="4" height="16" rx="1" />
                                </svg>
                            ) : (
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            )}
                        </motion.button>
                    </div>

                    {/* Sweet message */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-center mb-6"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-700/50">
                            <span className="text-sm">💝</span>
                            <span className="text-xs text-rose-600 dark:text-rose-300 font-medium italic">
                                Dengerin sampe abis ya, cantik...
                            </span>
                        </div>
                    </motion.div>

                    {/* From signature */}
                    <p className="text-center font-sans text-xs text-rose-500 dark:text-rose-400 uppercase tracking-widest mb-6">
                        - Kevin 💕
                    </p>
                </div>

                {/* Back button */}
                <div className="px-6 pb-8 flex justify-center">
                    <motion.button
                        onClick={onBack}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-8 py-3 rounded-full bg-stone-200/80 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 font-medium text-sm hover:bg-stone-300 dark:hover:bg-stone-700 transition-all shadow-md"
                    >
                        ← Kembali
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default VoiceMessagePage;
