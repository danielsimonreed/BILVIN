import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingMusicControlProps {
    isPlaying: boolean;
    onTogglePlay: () => void;
    className?: string;
}

const FloatingMusicControl: React.FC<FloatingMusicControlProps> = ({
    isPlaying,
    onTogglePlay,
    className = ""
}) => {
    return (
        <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={onTogglePlay}
            className={`relative w-14 h-14 rounded-full bg-stone-900 border-2 border-white/20 shadow-xl overflow-hidden flex items-center justify-center group active:scale-95 transition-transform ${className}`}
        >
            {/* Vinyl Texture */}
            <motion.div
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatType: "loop" }}
                className="absolute inset-0 w-full h-full rounded-full"
            >
                {/* Grooves */}
                <div className="absolute inset-[2px] rounded-full border border-white/10" />
                <div className="absolute inset-[6px] rounded-full border border-white/10" />
                <div className="absolute inset-[10px] rounded-full border border-white/10" />

                {/* Label Background */}
                <div className="absolute inset-[15px] rounded-full bg-rose-400 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-rose-500 to-rose-300 opacity-80" />
                </div>
            </motion.div>

            {/* Control Icon Overlay */}
            <div className="relative z-10 text-white drop-shadow-md">
                {isPlaying ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                )}
            </div>

            {/* Glossy Reflection */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
        </motion.button>
    );
};

export default FloatingMusicControl;
