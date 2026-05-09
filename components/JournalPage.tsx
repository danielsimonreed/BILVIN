import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { UserType, USER_CREDENTIALS } from '../constants';
import {
    isSupabaseConfigured,
    JournalEntryDB,
    JournalMood,
    journalService,
    storageService
} from '../lib/supabase';

interface JournalPageProps {
    currentUser: UserType | null;
}

type JournalFilter = 'all' | UserType | 'with-photo';

interface JournalFormState {
    mood: JournalMood;
    title: string;
    body: string;
    imageFile: File | null;
    imagePreview: string;
}

const LOCAL_STORAGE_KEY = 'bilvin-journal-v1';
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const moodOptions: { id: JournalMood; emoji: string; label: string; accent: string }[] = [
    { id: 'happy', emoji: '😊', label: 'Happy', accent: 'from-amber-400 to-orange-400' },
    { id: 'grateful', emoji: '💖', label: 'Grateful', accent: 'from-rose-400 to-pink-400' },
    { id: 'miss_you', emoji: '🥺', label: 'Miss You', accent: 'from-sky-400 to-cyan-400' },
    { id: 'soft', emoji: '🌙', label: 'Soft', accent: 'from-violet-400 to-fuchsia-400' },
    { id: 'excited', emoji: '✨', label: 'Excited', accent: 'from-emerald-400 to-teal-400' }
];

const filterOptions: { id: JournalFilter; label: string }[] = [
    { id: 'all', label: 'Semua' },
    { id: 'bilqis', label: 'Bilqis' },
    { id: 'kevin', label: 'Kevin' },
    { id: 'with-photo', label: 'Dengan Foto' }
];

const emptyForm = (): JournalFormState => ({
    mood: 'grateful',
    title: '',
    body: '',
    imageFile: null,
    imagePreview: ''
});

const toSortedEntries = (entries: JournalEntryDB[]) =>
    [...entries].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

const upsertEntry = (entries: JournalEntryDB[], entry: JournalEntryDB) => {
    const existingIndex = entries.findIndex((item) => item.id === entry.id);
    const nextEntries = existingIndex >= 0
        ? entries.map((item) => (item.id === entry.id ? entry : item))
        : [entry, ...entries];

    return toSortedEntries(nextEntries);
};

const formatDate = (value: string) =>
    new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short'
    }).format(new Date(value));

const getMoodMeta = (mood: JournalMood) =>
    moodOptions.find((option) => option.id === mood) || moodOptions[0];

const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });

const MoodPicker: React.FC<{
    value: JournalMood;
    onChange: (mood: JournalMood) => void;
}> = ({ value, onChange }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {moodOptions.map((option) => {
            const isActive = option.id === value;
            return (
                <button
                    key={option.id}
                    type="button"
                    onClick={() => onChange(option.id)}
                    className={`relative overflow-hidden rounded-2xl border px-4 py-3 text-left transition-all ${isActive
                        ? 'border-rose-300 bg-white/80 dark:bg-slate-900/80 shadow-lg shadow-rose-500/10'
                        : 'border-white/40 bg-white/50 dark:bg-slate-900/50'
                        }`}
                >
                    <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${option.accent}`} />
                    <div className="text-xl">{option.emoji}</div>
                    <div className="mt-2 text-sm font-medium text-stone-700 dark:text-slate-100">{option.label}</div>
                </button>
            );
        })}
    </div>
);

const JournalEntryCard: React.FC<{
    entry: JournalEntryDB;
    canManage: boolean;
    onEdit: (entry: JournalEntryDB) => void;
    onDelete: (entry: JournalEntryDB) => void;
}> = ({ entry, canManage, onEdit, onDelete }) => {
    const mood = getMoodMeta(entry.mood);
    const author = USER_CREDENTIALS[entry.author];

    return (
        <motion.article
            layout
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="rounded-[28px] border border-white/40 dark:border-white/10 bg-white/65 dark:bg-slate-900/55 backdrop-blur-xl p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <div className="flex items-center gap-2 text-sm text-stone-500 dark:text-slate-400">
                        <span className="text-base">{author.emoji}</span>
                        <span className="font-medium text-stone-700 dark:text-slate-100">{author.displayName}</span>
                        <span>•</span>
                        <span>{formatDate(entry.created_at)}</span>
                    </div>
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/70 dark:bg-slate-800/80 px-3 py-1 text-xs font-medium text-stone-600 dark:text-slate-200">
                        <span>{mood.emoji}</span>
                        <span>{mood.label}</span>
                    </div>
                </div>

                {canManage && (
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => onEdit(entry)}
                            className="rounded-full bg-white/80 dark:bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-stone-700 dark:text-slate-100"
                        >
                            Edit
                        </button>
                        <button
                            type="button"
                            onClick={() => onDelete(entry)}
                            className="rounded-full bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-500"
                        >
                            Hapus
                        </button>
                    </div>
                )}
            </div>

            {entry.title && (
                <h3 className="mt-4 text-lg font-semibold tracking-tight text-stone-800 dark:text-white">
                    {entry.title}
                </h3>
            )}

            <p className="mt-3 whitespace-pre-wrap leading-7 text-stone-600 dark:text-slate-200">
                {entry.body}
            </p>

            {entry.image_url && (
                <div className="mt-4 overflow-hidden rounded-3xl border border-white/40 dark:border-white/10">
                    <img
                        src={entry.image_url}
                        alt={entry.title || 'Journal memory'}
                        loading="lazy"
                        className="h-auto w-full object-cover"
                    />
                </div>
            )}
        </motion.article>
    );
};

const JournalComposerModal: React.FC<{
    formData: JournalFormState;
    editingEntry: JournalEntryDB | null;
    isSaving: boolean;
    onClose: () => void;
    onSubmit: () => void;
    onBodyChange: (value: string) => void;
    onTitleChange: (value: string) => void;
    onMoodChange: (mood: JournalMood) => void;
    onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveImage: () => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
}> = ({
    formData,
    editingEntry,
    isSaving,
    onClose,
    onSubmit,
    onBodyChange,
    onTitleChange,
    onMoodChange,
    onImageChange,
    onRemoveImage,
    fileInputRef
}) => (
    <motion.div
        className="fixed inset-0 z-30 flex items-end justify-center bg-black/35 px-4 pb-4 pt-12 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
    >
        <motion.div
            initial={{ y: 32, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="max-h-full w-full max-w-md overflow-y-auto rounded-[32px] border border-white/30 bg-[#fff9f8]/95 p-5 shadow-2xl dark:border-white/10 dark:bg-slate-950/95"
            onClick={(event) => event.stopPropagation()}
        >
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-rose-400">Our Little Notes</p>
                    <h2 className="mt-2 text-2xl font-semibold text-stone-800 dark:text-white">
                        {editingEntry ? 'Edit momen ini' : 'Tulis momen hari ini'}
                    </h2>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-full bg-white/80 p-2 text-stone-500 dark:bg-slate-800/80 dark:text-slate-300"
                    aria-label="Close composer"
                >
                    ✕
                </button>
            </div>

            <div className="mt-6">
                <label className="mb-3 block text-sm font-medium text-stone-600 dark:text-slate-300">Mood hari ini</label>
                <MoodPicker value={formData.mood} onChange={onMoodChange} />
            </div>

            <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-stone-600 dark:text-slate-300">Judul (opsional)</label>
                <input
                    value={formData.title}
                    onChange={(event) => onTitleChange(event.target.value)}
                    placeholder="Misalnya: Hari yang bikin aku tenang"
                    className="w-full rounded-2xl border border-white/50 bg-white/80 px-4 py-3 text-stone-700 outline-none placeholder:text-stone-400 dark:border-white/10 dark:bg-slate-900/75 dark:text-slate-100"
                />
            </div>

            <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-stone-600 dark:text-slate-300">Cerita hari ini</label>
                <textarea
                    value={formData.body}
                    onChange={(event) => onBodyChange(event.target.value)}
                    placeholder="Tulis hal kecil yang pengin kamu simpan bareng..."
                    rows={6}
                    className="w-full rounded-2xl border border-white/50 bg-white/80 px-4 py-3 text-stone-700 outline-none placeholder:text-stone-400 dark:border-white/10 dark:bg-slate-900/75 dark:text-slate-100"
                />
            </div>

            <div className="mt-5">
                <div className="flex items-center justify-between gap-3">
                    <label className="text-sm font-medium text-stone-600 dark:text-slate-300">Foto kenangan (opsional)</label>
                    {formData.imagePreview && (
                        <button
                            type="button"
                            onClick={onRemoveImage}
                            className="text-sm font-medium text-rose-500"
                        >
                            Hapus foto
                        </button>
                    )}
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onImageChange}
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-3 w-full rounded-2xl border border-dashed border-rose-200 bg-rose-50/70 px-4 py-4 text-sm font-medium text-rose-500 dark:border-rose-400/30 dark:bg-rose-500/10"
                >
                    {formData.imagePreview ? 'Ganti foto' : 'Tambah foto'}
                </button>
                {formData.imagePreview && (
                    <div className="mt-4 overflow-hidden rounded-3xl border border-white/40 dark:border-white/10">
                        <img
                            src={formData.imagePreview}
                            alt="Preview jurnal"
                            className="h-auto w-full object-cover"
                        />
                    </div>
                )}
            </div>

            <div className="mt-6 flex items-center gap-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 rounded-2xl bg-white/80 px-4 py-3 font-medium text-stone-600 dark:bg-slate-800/80 dark:text-slate-200"
                >
                    Batal
                </button>
                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={!formData.body.trim() || isSaving}
                    className="flex-1 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-3 font-medium text-white shadow-lg shadow-rose-500/25 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSaving ? 'Menyimpan...' : editingEntry ? 'Simpan ✨' : 'Posting ✨'}
                </button>
            </div>
        </motion.div>
    </motion.div>
);

const JournalPage: React.FC<JournalPageProps> = ({ currentUser }) => {
    const [entries, setEntries] = useState<JournalEntryDB[]>([]);
    const [activeFilter, setActiveFilter] = useState<JournalFilter>('all');
    const [showComposer, setShowComposer] = useState(false);
    const [editingEntry, setEditingEntry] = useState<JournalEntryDB | null>(null);
    const [formData, setFormData] = useState<JournalFormState>(emptyForm);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const toastTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        const loadEntries = async () => {
            setIsLoading(true);

            if (isSupabaseConfigured()) {
                const data = await journalService.getAll();
                setEntries(toSortedEntries(data));
            } else {
                const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
                if (saved) {
                    setEntries(toSortedEntries(JSON.parse(saved)));
                }
            }

            setIsLoading(false);
        };

        void loadEntries();

        if (isSupabaseConfigured()) {
            const subscription = journalService.subscribeToChanges((payload) => {
                if (payload.eventType === 'INSERT') {
                    const nextEntry = payload.new as JournalEntryDB;
                    setEntries((prev) => upsertEntry(prev, nextEntry));
                    if (nextEntry.author !== currentUser) {
                        showToast(`${USER_CREDENTIALS[nextEntry.author].displayName} baru saja menulis sesuatu 💌`, 'info');
                    }
                } else if (payload.eventType === 'UPDATE') {
                    setEntries((prev) => upsertEntry(prev, payload.new as JournalEntryDB));
                } else if (payload.eventType === 'DELETE') {
                    setEntries((prev) => prev.filter((entry) => entry.id !== payload.old.id));
                }
            });

            return () => {
                subscription.unsubscribe();
            };
        }

        return undefined;
    }, [currentUser]);

    useEffect(() => () => {
        if (toastTimeoutRef.current !== null) {
            clearTimeout(toastTimeoutRef.current);
        }
    }, []);

    const showToast = (message: string, type: 'success' | 'info') => {
        setToast({ message, type });
        if (toastTimeoutRef.current !== null) {
            clearTimeout(toastTimeoutRef.current);
        }
        toastTimeoutRef.current = window.setTimeout(() => setToast(null), 3000);
    };

    const resetForm = () => {
        if (formData.imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(formData.imagePreview);
        }
        setFormData(emptyForm());
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const openComposer = (entry?: JournalEntryDB) => {
        if (entry) {
            setEditingEntry(entry);
            setFormData({
                mood: entry.mood,
                title: entry.title || '',
                body: entry.body,
                imageFile: null,
                imagePreview: entry.image_url || ''
            });
        } else {
            setEditingEntry(null);
            resetForm();
        }

        setShowComposer(true);
    };

    const closeComposer = () => {
        setShowComposer(false);
        setEditingEntry(null);
        resetForm();
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            showToast('Ukuran file maksimal 5MB', 'info');
            return;
        }

        if (formData.imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(formData.imagePreview);
        }

        setFormData((prev) => ({
            ...prev,
            imageFile: file,
            imagePreview: URL.createObjectURL(file)
        }));
    };

    const handleRemoveImage = () => {
        if (formData.imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(formData.imagePreview);
        }

        setFormData((prev) => ({
            ...prev,
            imageFile: null,
            imagePreview: ''
        }));

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const persistOfflineEntries = (nextEntries: JournalEntryDB[]) => {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(nextEntries));
            setEntries(toSortedEntries(nextEntries));
            return true;
        } catch (error) {
            console.error('Failed to persist offline journal entries:', error);
            showToast('Penyimpanan lokal penuh. Coba kurangi foto atau aktifkan Supabase.', 'info');
            return false;
        }
    };

    const handleSubmit = async () => {
        if (!currentUser || !formData.body.trim()) {
            return;
        }

        setIsSaving(true);

        let imageUrl = editingEntry?.image_url || null;

        try {
            const previousImageUrl = editingEntry?.image_url || null;

            if (formData.imageFile) {
                if (isSupabaseConfigured()) {
                    const { data, error } = await storageService.uploadJournalImage(formData.imageFile, currentUser);
                    if (error) {
                        showToast(`Gagal upload: ${error.message || 'Unknown error'}`, 'info');
                        setIsSaving(false);
                        return;
                    }
                    imageUrl = data;
                } else {
                    imageUrl = await readFileAsDataUrl(formData.imageFile);
                }
            } else if (!formData.imagePreview) {
                imageUrl = null;
            }

            if (editingEntry) {
                if (editingEntry.author !== currentUser) {
                    showToast('Hanya penulis yang bisa mengubah catatan ini.', 'info');
                    setIsSaving(false);
                    return;
                }

                const updates = {
                    mood: formData.mood,
                    title: formData.title.trim() || null,
                    body: formData.body.trim(),
                    image_url: imageUrl
                };

                if (isSupabaseConfigured()) {
                    const updated = await journalService.update(editingEntry.id, updates);
                    if (updated) {
                        setEntries((prev) => upsertEntry(prev, updated));
                        if (previousImageUrl && previousImageUrl !== imageUrl && formData.imageFile) {
                            await storageService.deleteJournalImage(previousImageUrl);
                        }
                    }
                } else {
                    const nextEntries = entries.map((entry) =>
                        entry.id === editingEntry.id
                            ? { ...entry, ...updates, updated_at: new Date().toISOString() }
                            : entry
                    );
                    if (!persistOfflineEntries(nextEntries)) {
                        setIsSaving(false);
                        return;
                    }
                }

                showToast('Catatan berhasil diupdate ✨', 'success');
            } else {
                const newEntryBase = {
                    author: currentUser,
                    mood: formData.mood,
                    title: formData.title.trim() || null,
                    body: formData.body.trim(),
                    image_url: imageUrl
                };

                if (isSupabaseConfigured()) {
                    const created = await journalService.create(newEntryBase);
                    if (created) {
                        setEntries((prev) => upsertEntry(prev, created));
                    }
                } else {
                    const offlineEntry: JournalEntryDB = {
                        ...newEntryBase,
                        id: `journal-${Date.now()}`,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    };
                    if (!persistOfflineEntries([offlineEntry, ...entries])) {
                        setIsSaving(false);
                        return;
                    }
                }

                showToast('Catatan baru tersimpan 💌', 'success');
            }

            closeComposer();
        } catch (error) {
            console.error('Failed to save journal entry:', error);
            showToast('Catatan belum bisa disimpan sekarang.', 'info');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (entry: JournalEntryDB) => {
        if (!currentUser || entry.author !== currentUser) {
            showToast('Hanya penulis yang bisa menghapus catatan ini.', 'info');
            return;
        }

        const confirmed = window.confirm('Hapus catatan ini?');
        if (!confirmed) {
            return;
        }

        if (isSupabaseConfigured()) {
            const success = await journalService.delete(entry.id);
            if (!success) {
                showToast('Catatan belum bisa dihapus sekarang.', 'info');
                return;
            }

            if (entry.image_url) {
                await storageService.deleteJournalImage(entry.image_url);
            }

            setEntries((prev) => prev.filter((item) => item.id !== entry.id));
        } else {
            const nextEntries = entries.filter((item) => item.id !== entry.id);
            if (!persistOfflineEntries(nextEntries)) {
                return;
            }
        }

        showToast('Catatan dihapus', 'success');
    };

    const filteredEntries = useMemo(() => {
        switch (activeFilter) {
            case 'bilqis':
            case 'kevin':
                return entries.filter((entry) => entry.author === activeFilter);
            case 'with-photo':
                return entries.filter((entry) => Boolean(entry.image_url));
            case 'all':
            default:
                return entries;
        }
    }, [activeFilter, entries]);

    return (
        <div className="min-h-full px-5 pb-28 pt-8 text-stone-800 dark:text-slate-100">
            <motion.section
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="rounded-[32px] border border-white/35 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(255,245,247,0.7)_58%,_rgba(255,255,255,0.35)_100%)] p-6 shadow-[0_24px_80px_rgba(244,63,94,0.08)] backdrop-blur-2xl dark:border-white/10 dark:bg-[radial-gradient(circle_at_top,_rgba(30,41,59,0.92),_rgba(15,23,42,0.84)_58%,_rgba(15,23,42,0.72)_100%)]"
            >
                <p className="text-xs uppercase tracking-[0.35em] text-rose-400">Private Couple Journal</p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 dark:text-white">
                    Our Little Notes
                </h1>
                <p className="mt-3 max-w-md leading-7 text-stone-600 dark:text-slate-300">
                    Tempat kecil untuk nyimpen rasa, cerita, dan momen yang pengin kita inget bareng.
                </p>

                <div className="mt-6 flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => openComposer()}
                        className="rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-rose-500/20"
                    >
                        Tulis Catatan ✨
                    </button>
                    {!isSupabaseConfigured() && (
                        <span className="rounded-full bg-white/70 px-3 py-1.5 text-xs font-medium text-stone-500 dark:bg-slate-800/80 dark:text-slate-300">
                            Offline mode aktif
                        </span>
                    )}
                </div>
            </motion.section>

            <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
                {filterOptions.map((filter) => {
                    const isActive = filter.id === activeFilter;
                    return (
                        <button
                            key={filter.id}
                            type="button"
                            onClick={() => setActiveFilter(filter.id)}
                            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${isActive
                                ? 'bg-rose-500 text-white'
                                : 'bg-white/70 text-stone-600 dark:bg-slate-900/70 dark:text-slate-300'
                                }`}
                        >
                            {filter.label}
                        </button>
                    );
                })}
            </div>

            <div className="mt-6 space-y-4">
                {isLoading ? (
                    <div className="rounded-[28px] border border-white/30 bg-white/55 p-6 text-center text-stone-500 dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-300">
                        Memuat journal...
                    </div>
                ) : filteredEntries.length > 0 ? (
                    <AnimatePresence initial={false}>
                        {filteredEntries.map((entry) => (
                            <JournalEntryCard
                                key={entry.id}
                                entry={entry}
                                canManage={entry.author === currentUser}
                                onEdit={openComposer}
                                onDelete={handleDelete}
                            />
                        ))}
                    </AnimatePresence>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-[28px] border border-dashed border-rose-200 bg-white/60 p-7 text-center dark:border-rose-400/20 dark:bg-slate-900/50"
                    >
                        <div className="text-4xl">💌</div>
                        <h2 className="mt-4 text-xl font-semibold text-stone-800 dark:text-white">
                            Belum ada catatan di sini
                        </h2>
                        <p className="mt-2 leading-7 text-stone-500 dark:text-slate-300">
                            Mulai dari cerita kecil hari ini. Yang sederhana justru biasanya paling hangat untuk dibaca lagi nanti.
                        </p>
                        <button
                            type="button"
                            onClick={() => openComposer()}
                            className="mt-5 rounded-2xl bg-rose-500/10 px-5 py-3 text-sm font-medium text-rose-500"
                        >
                            Tulis Catatan Pertama
                        </button>
                    </motion.div>
                )}
            </div>

            <AnimatePresence>
                {showComposer && (
                    <JournalComposerModal
                        formData={formData}
                        editingEntry={editingEntry}
                        isSaving={isSaving}
                        onClose={closeComposer}
                        onSubmit={() => void handleSubmit()}
                        onBodyChange={(body) => setFormData((prev) => ({ ...prev, body }))}
                        onTitleChange={(title) => setFormData((prev) => ({ ...prev, title }))}
                        onMoodChange={(mood) => setFormData((prev) => ({ ...prev, mood }))}
                        onImageChange={handleImageChange}
                        onRemoveImage={handleRemoveImage}
                        fileInputRef={fileInputRef}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 16 }}
                        className={`fixed bottom-24 left-1/2 z-20 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-2xl px-4 py-3 text-sm font-medium shadow-xl ${toast.type === 'success'
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-900 text-white'
                            }`}
                    >
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default JournalPage;
