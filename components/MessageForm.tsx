import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface MessageFormProps {
    onCancel: () => void;
}

const MessageForm: React.FC<MessageFormProps> = ({ onCancel }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Format the message for WhatsApp
        const whatsappMessage = `💌 Balasan dari Bilqis:\n\n${message}`;
        const encodedMessage = encodeURIComponent(whatsappMessage);

        // Open WhatsApp with the message
        window.open(`https://wa.me/6287780771094?text=${encodedMessage}`, '_blank');

        // Close form after a short delay
        setTimeout(() => {
            onCancel();
        }, 500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-stone-900 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden"
            >
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">💬</span>
                        <h3 className="text-xl font-serif text-rose-500">Balas Kevin</h3>
                    </div>
                    <p className="text-sm text-stone-500 dark:text-stone-400 mb-4">
                        Tulis sesuatu yang manis... (Akan buka WhatsApp)
                    </p>

                    <form onSubmit={handleSubmit}>
                        <textarea
                            className="w-full h-32 p-3 rounded-xl bg-stone-50 dark:bg-black border border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none text-stone-700 dark:text-stone-300 font-sans"
                            placeholder="Ketik pesanmu disini..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />

                        <div className="flex gap-3 mt-6">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="flex-1 py-3 px-4 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-medium hover:bg-stone-200 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="flex-1 py-3 px-4 rounded-xl bg-green-500 text-white font-medium hover:bg-green-600 shadow-lg shadow-green-500/30 transition-all hover:scale-105 flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                Kirim
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default MessageForm;
