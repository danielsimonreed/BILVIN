import React from 'react';
import { motion } from 'framer-motion';

interface SecretMessagePageProps {
    onBack: () => void;
}

const SecretMessagePage: React.FC<SecretMessagePageProps> = ({ onBack }) => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-rose-50 to-stone-100 dark:from-slate-900 dark:to-slate-950 relative overflow-hidden">

            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-md w-full bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/40 dark:border-white/10 p-8 rounded-3xl shadow-xl z-10 text-center"
            >
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="text-4xl mb-4">🤫</div>
                    <h2 className="font-serif text-2xl mb-6 text-stone-800 dark:text-rose-100">Untuk Cantiknya Akuu ❤️</h2>
                    <div className="font-handwriting text-lg leading-relaxed text-stone-700 dark:text-stone-300 mb-8 italic whitespace-pre-line">
                        "Hai, Sayang.

                        Cuma mau bilang makasih ya, udah jadi bagian terbaik di hidup aku.
                        In a world full of noise, you are my favorite quiet spot. Tempat aku ngerasa tenang dan simply be myself.

                        Jangan pernah ragu sama kita ya. I promise to hold your hand through it all, baik hari yang cerah maupun badai sekalipun.
                        You are my luckiest finding. I love you, heaps!"
                    </div>
                    <p className="font-sans text-xs text-rose-500 dark:text-rose-400 uppercase tracking-widest mb-8">
                        - Forever Yours
                    </p>

                    <button
                        onClick={onBack}
                        className="px-6 py-2 rounded-full bg-stone-800 dark:bg-white text-white dark:text-black font-medium text-sm hover:scale-105 active:scale-95 transition-transform"
                    >
                        Close Secret
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default SecretMessagePage;
