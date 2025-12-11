
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface BurstProps {
    id: number;
    x: number;
    y: number;
    onComplete: (id: number) => void;
}

const PARTICLE_COUNT = 12;

const HeartBurst: React.FC<BurstProps> = ({ id, x, y, onComplete }) => {
    useEffect(() => {
        // Self-cleanup after animation
        const timer = setTimeout(() => {
            onComplete(id);
        }, 1500);
        return () => clearTimeout(timer);
    }, [id, onComplete]);

    return (
        <div
            className="fixed pointer-events-none z-[9999]"
            style={{ left: x, top: y }}
        >
            {/* Central big heart pop */}
            <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: [0, 1.5, 0], opacity: [1, 1, 0] }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute -translate-x-1/2 -translate-y-1/2 text-rose-500 dark:text-rose-400"
            >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
            </motion.div>

            {/* Exploding Particles */}
            {Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
                const angle = (i / PARTICLE_COUNT) * 360;
                const distance = Math.random() * 60 + 40; // 40-100px radius
                const size = Math.random() * 0.5 + 0.5; // Scale 0.5-1.0

                return (
                    <motion.div
                        key={i}
                        className="absolute text-rose-400/80 dark:text-rose-300/80"
                        initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                        animate={{
                            x: Math.cos((angle * Math.PI) / 180) * distance,
                            y: Math.sin((angle * Math.PI) / 180) * distance,
                            scale: [0, size, 0],
                            opacity: [1, 1, 0]
                        }}
                        transition={{ duration: 1 + Math.random() * 0.5, ease: "easeOut" }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default HeartBurst;
