import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MILESTONES } from '../constants';
import MonthlyAnniversary from './MonthlyAnniversary';

const Milestones: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [showButtons, setShowButtons] = useState(false);
    const [showDatePickerSection, setShowDatePickerSection] = useState(false);
    const [showNotReadyPopup, setShowNotReadyPopup] = useState(false);
    const [hideWeddingButtons, setHideWeddingButtons] = useState(false);
    const datePickerRef = useRef<HTMLDivElement>(null);

    // Format date for display
    const formatDateDisplay = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Handle date selection
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value);
        if (e.target.value) {
            setShowButtons(true);
        }
    };

    // Handle "Pilih Tanggal" button click
    const handlePilihTanggal = () => {
        setShowDatePickerSection(true);
        // Smooth scroll to the section after a short delay to allow animation
        setTimeout(() => {
            datePickerRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 100);
    };

    // Handle "Aku belum siap" button click
    const handleNotReady = () => {
        setShowNotReadyPopup(true);
        setHideWeddingButtons(true);
        // Auto hide popup after 7 seconds
        setTimeout(() => {
            setShowNotReadyPopup(false);
        }, 9000);
    };

    // Generate WhatsApp message link
    const getWhatsAppLink = () => {
        const formattedDate = formatDateDisplay(selectedDate);
        const message = `Halo sayangku Kevin yang ganteng! 😛\n\n InsyaAllah aku udah siap buat nikah sama kamu dan aku udah milih tanggal. 💍✨\n\nInsyaAllah aku mau tanggal: ${formattedDate}\n\nAyo lebih semangat lagi untuk bisa nikah sesuai tanggal yang aku pilih! 🥰\n\n- Bilqis`;
        const encodedMessage = encodeURIComponent(message);
        // Replace with your WhatsApp number
        return `https://wa.me/6287780771094?text=${encodedMessage}`;
    };

    // Generate Google Calendar link
    const getGoogleCalendarLink = () => {
        if (!selectedDate) return '#';
        const date = new Date(selectedDate);
        const formattedDate = date.toISOString().split('T')[0].replace(/-/g, '');
        const title = encodeURIComponent('💍 Hari Pernikahan Kevin & Bilqis');
        const details = encodeURIComponent('Hari yang paling ditunggu-tunggu! InsyaAllah di hari ini kita resmi menjadi satu. ❤️');
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formattedDate}/${formattedDate}&details=${details}`;
    };

    return (
        <div className="w-full min-h-full pb-36 pt-24 px-6 flex flex-col gap-10">
            {/* Not Ready Popup */}
            <AnimatePresence>
                {showNotReadyPopup && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                        onClick={() => setShowNotReadyPopup(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.5, opacity: 0, y: 50 }}
                            transition={{ type: "spring", damping: 15, stiffness: 200 }}
                            className="bg-gradient-to-b from-stone-800 via-stone-900 to-stone-800 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center border-2 border-stone-700 relative overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Background decorations */}
                            <div className="absolute top-2 left-2 text-2xl opacity-20">💔</div>
                            <div className="absolute bottom-2 right-2 text-2xl opacity-20">💔</div>

                            {/* Animated sad emoji */}
                            <motion.div
                                animate={{
                                    y: [0, -10, 0],
                                    rotate: [-5, 5, -5]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="text-7xl mb-6"
                            >
                                🥺
                            </motion.div>

                            {/* Message */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="font-serif text-xl text-stone-300 leading-relaxed mb-4"
                            >
                                Huuhuuuu.. baik sayangg.. 😔
                            </motion.p>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="font-serif text-lg text-stone-400 italic leading-relaxed"
                            >
                                aku akan lebih sabar lagi nungguin kamu..
                            </motion.p>

                            {/* Heart decoration */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                                className="mt-6 text-rose-500/50 text-sm"
                            >
                                buat nunggu iqis sampe siap..
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-4"
            >
                <h2 className="font-serif text-3xl text-white mb-2">Our Special Moments</h2>

            </motion.div>

            <div className="relative border-l-2 border-rose-200 dark:border-rose-900 ml-4 space-y-8">
                {MILESTONES.map((milestone, index) => (
                    <motion.div
                        key={milestone.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="relative pl-8"
                    >
                        {/* Dot */}
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-rose-500 border-4 border-stone-100 dark:border-stone-900" />

                        <div className="bg-white dark:bg-stone-800 p-4 rounded-xl shadow-sm border border-rose-100 dark:border-stone-700">
                            <span className="text-2xl mb-2 block">{milestone.icon}</span>
                            <span className="text-xs font-bold tracking-widest text-rose-400 uppercase mb-1 block">
                                {milestone.date}
                            </span>
                            <h3 className="font-serif text-xl text-stone-800 dark:text-stone-200 mb-1">
                                {milestone.title}
                            </h3>
                            <p className="text-stone-600 dark:text-stone-400 text-sm font-sans leading-relaxed">
                                {milestone.description}
                            </p>

                            {/* Buttons for the Wedding milestone (id: 3) */}
                            {milestone.id === 3 && !showDatePickerSection && !hideWeddingButtons && (
                                <div className="mt-4 space-y-3">
                                    {/* Pilih Tanggal Button */}
                                    <motion.button
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        onClick={handlePilihTanggal}
                                        className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl py-3 px-4 text-sm font-semibold tracking-wide transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <span>💍</span>
                                        <span>Pilih Tanggal</span>
                                        <span>✨</span>
                                    </motion.button>

                                    {/* Aku Belum Siap Button */}
                                    <motion.button
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        onClick={handleNotReady}
                                        className="w-full bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600 text-stone-600 dark:text-stone-300 rounded-xl py-3 px-4 text-sm font-medium tracking-wide transition-all shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center gap-2"
                                    >

                                        <span>Aku belum siap</span>
                                    </motion.button>
                                </div>
                            )}

                            {/* Not Ready Text - Shows after clicking "Aku belum siap" */}
                            {milestone.id === 3 && hideWeddingButtons && !showDatePickerSection && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ type: "spring", damping: 12, stiffness: 200 }}
                                    className="mt-4 text-center"
                                >
                                    <p className="text-red-500 font-bold text-lg tracking-wide">
                                        BILQIS BELUM SIAP 😭
                                    </p>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Special Wedding Date Picker Section - Hidden by default */}
            <AnimatePresence>
                {showDatePickerSection && (
                    <motion.div
                        ref={datePickerRef}
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -30, scale: 0.95 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="relative mt-8"
                    >
                        {/* Decorative elements */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-rose-300 dark:text-rose-600 text-2xl">✧</div>

                        <div className="bg-gradient-to-b from-rose-50 via-white to-rose-50 dark:from-stone-800 dark:via-stone-900 dark:to-stone-800 p-8 rounded-3xl shadow-xl border-2 border-rose-200 dark:border-rose-900/50 relative overflow-hidden">
                            {/* Background decoration */}
                            <div className="absolute top-2 right-2 text-rose-200 dark:text-rose-900/30 text-4xl opacity-50">💍</div>
                            <div className="absolute bottom-2 left-2 text-rose-200 dark:text-rose-900/30 text-3xl opacity-30">💕</div>

                            {/* Header */}
                            <div className="text-center mb-6 relative z-10">
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="text-4xl mb-3"
                                >
                                    💒
                                </motion.div>
                                <h3 className="font-serif text-2xl text-rose-600 dark:text-rose-400 mb-2">
                                    Kapan Kita Nikah?
                                </h3>
                                <p className="text-stone-500 dark:text-stone-400 text-sm italic font-serif">
                                    Pilih tanggal impianmu ya, cantik...
                                </p>
                            </div>

                            {/* Date Picker */}
                            <div className="flex flex-col items-center gap-4 relative z-10">
                                <div className="relative w-full max-w-xs">
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full bg-white dark:bg-stone-800 border-2 border-rose-300 dark:border-rose-700 rounded-2xl py-4 px-6 text-center text-stone-800 dark:text-stone-200 font-serif text-lg focus:outline-none focus:ring-4 focus:ring-rose-200 dark:focus:ring-rose-800 focus:border-rose-400 transition-all shadow-inner cursor-pointer"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-rose-400 dark:text-rose-500">
                                        📅
                                    </div>
                                </div>

                                {/* Selected Date Display */}
                                <AnimatePresence>
                                    {selectedDate && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="text-center"
                                        >
                                            <p className="text-xs text-rose-400 dark:text-rose-500 uppercase tracking-widest mb-1">
                                                Tanggal Terpilih
                                            </p>
                                            <p className="font-serif text-lg text-rose-600 dark:text-rose-300 font-semibold">
                                                {formatDateDisplay(selectedDate)}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Action Buttons */}
                            <AnimatePresence>
                                {showButtons && selectedDate && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-8 space-y-4"
                                    >

                                        {/* WhatsApp Button */}
                                        <motion.a
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 }}
                                            href={getWhatsAppLink()}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl py-4 px-6 font-semibold tracking-wide transition-all shadow-lg hover:shadow-xl active:scale-95"
                                        >
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                            </svg>
                                            <span>Kirim ke WhatsApp Kevin 💌</span>
                                        </motion.a>

                                        {/* Google Calendar Button */}
                                        <motion.a
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 }}
                                            href={getGoogleCalendarLink()}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-2xl py-4 px-6 font-semibold tracking-wide transition-all shadow-lg hover:shadow-xl active:scale-95"
                                        >
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
                                            </svg>
                                            <span>Simpan di Calendar 📆</span>
                                        </motion.a>

                                        {/* Sweet note */}
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.5 }}
                                            className="text-center pt-4"
                                        >
                                            <p className="text-xs text-rose-400 dark:text-rose-500">
                                                💕 Aku siap nunggu kamu kok, sayang.. 😛

                                            </p>
                                            <p className="text-xs text-rose-400 dark:text-rose-500">Ayo kita berdoa dulu, semoga pilihan kamu ini bakalan jadi kenyataan nanti, Aaammin...</p>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="text-center mt-8 p-6 bg-rose-50 dark:bg-stone-900 rounded-2xl border border-rose-100 dark:border-stone-800"
            >
                <p className="text-stone-600 dark:text-stone-400 font-serif italic">
                    "Semoga akan segera datang banyak kenangan indah yang akan kita buat bareng.."
                </p>
            </motion.div>

            {/* Monthly Anniversary Tracker */}
            <MonthlyAnniversary />
        </div>
    );
};

export default Milestones;
