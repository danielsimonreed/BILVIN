import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SecretNotificationProps {
    isVisible: boolean;
    onClick: () => void;
    onClose: () => void;
}

const SecretNotification: React.FC<SecretNotificationProps> = ({ isVisible, onClick, onClose }) => {
    // Auto-dismiss after 15 seconds
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 15000); // 15 seconds

            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -100, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -100, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(_, info) => {
                        if (Math.abs(info.offset.x) > 100) {
                            onClose();
                        }
                    }}
                    className="absolute top-4 left-4 right-4 z-[60] flex justify-center touch-none"
                >
                    <div
                        onClick={onClick}
                        className="pointer-events-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/20 dark:border-slate-700/50 shadow-lg rounded-2xl p-3 flex items-center gap-3 w-full max-w-sm cursor-pointer hover:bg-white/90 dark:hover:bg-slate-900/90 transition-colors select-none"
                    >
                        {/* Icon */}
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                            <span className="text-xl">💌</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-0.5">
                                <h4 className="font-semibold text-sm text-stone-900 dark:text-stone-100 truncate">Kamu Dapet Pesan Baru!</h4>
                                <span className="text-[10px] text-stone-500 dark:text-stone-400">now</span>
                            </div>
                            <p className="text-xs text-stone-600 dark:text-stone-300 truncate">
                                Geser untuk hapus • Tap untuk buka
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SecretNotification;
