import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserType, USER_CREDENTIALS } from '../constants';
import { wishlistService, storageService, isSupabaseConfigured, WishlistItemDB } from '../lib/supabase';

interface WishlistPageProps {
    currentUser: UserType | null;
}

type CategoryType = 'all' | 'travel' | 'couple' | 'life';

const WishlistPage: React.FC<WishlistPageProps> = ({ currentUser }) => {
    const [wishlist, setWishlist] = useState<WishlistItemDB[]>([]);
    const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingItem, setEditingItem] = useState<WishlistItemDB | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form state
    const [formData, setFormData] = useState({
        emoji: '✨',
        title: '',
        description: '',
        category: 'couple' as 'travel' | 'couple' | 'life',
        imageFile: null as File | null,
        imagePreview: '',
        budget: '' as string, // Stored as string for input, converted to number
        lokasi: '',
        target_date: ''
    });

    // Load wishlist items
    useEffect(() => {
        loadWishlist();

        // Subscribe to realtime updates if Supabase is configured
        if (isSupabaseConfigured()) {
            const subscription = wishlistService.subscribeToChanges((payload) => {
                console.log('Realtime update:', payload);
                if (payload.eventType === 'INSERT') {
                    setWishlist(prev => [payload.new as WishlistItemDB, ...prev]);
                    // Show toast if added by partner
                    if (payload.new.created_by !== currentUser) {
                        const userName = USER_CREDENTIALS[payload.new.created_by as UserType].displayName;
                        showToast(`${userName} menambahkan wish baru! 🎉`, 'info');
                    }
                } else if (payload.eventType === 'UPDATE') {
                    setWishlist(prev => prev.map(item =>
                        item.id === payload.new.id ? payload.new as WishlistItemDB : item
                    ));
                } else if (payload.eventType === 'DELETE') {
                    setWishlist(prev => prev.filter(item => item.id !== payload.old.id));
                }
            });

            return () => {
                subscription.unsubscribe();
            };
        }
    }, [currentUser]);

    const loadWishlist = async () => {
        setIsLoading(true);
        if (isSupabaseConfigured()) {
            const items = await wishlistService.getAll();
            setWishlist(items);
        } else {
            // Fallback to localStorage if Supabase not configured
            const saved = localStorage.getItem('bilvin-wishlist-v2');
            if (saved) {
                setWishlist(JSON.parse(saved));
            }
        }
        setIsLoading(false);
    };

    const showToast = (message: string, type: 'success' | 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                showToast('Ukuran file maksimal 5MB', 'info');
                return;
            }
            setFormData(prev => ({
                ...prev,
                imageFile: file,
                imagePreview: URL.createObjectURL(file)
            }));
        }
    };

    const resetForm = () => {
        setFormData({
            emoji: '✨',
            title: '',
            description: '',
            category: 'couple',
            imageFile: null,
            imagePreview: '',
            budget: '',
            lokasi: '',
            target_date: ''
        });
        setEditingItem(null);
    };

    const handleSubmit = async () => {
        if (!formData.title.trim() || !currentUser) return;

        let imageUrl = editingItem?.image_url || null;

        // Upload image if new one selected
        if (formData.imageFile && isSupabaseConfigured()) {
            const uploadedUrl = await storageService.uploadImage(formData.imageFile, currentUser);
            if (uploadedUrl) {
                imageUrl = uploadedUrl;
            }
        }

        if (editingItem) {
            // Update existing item
            if (isSupabaseConfigured()) {
                await wishlistService.update(editingItem.id, {
                    emoji: formData.emoji,
                    title: formData.title,
                    description: formData.description || null,
                    category: formData.category,
                    image_url: imageUrl,
                    budget: formData.budget ? parseInt(formData.budget.replace(/\D/g, '')) : null,
                    lokasi: formData.lokasi || null,
                    target_date: formData.target_date || null
                }, currentUser);
            } else {
                // localStorage fallback
                setWishlist(prev => prev.map(item =>
                    item.id === editingItem.id
                        ? {
                            ...item,
                            emoji: formData.emoji,
                            title: formData.title,
                            description: formData.description || null,
                            category: formData.category,
                            image_url: imageUrl,
                            budget: formData.budget ? parseInt(formData.budget.replace(/\D/g, '')) : null,
                            lokasi: formData.lokasi || null,
                            target_date: formData.target_date || null,
                            updated_by: currentUser,
                            updated_at: new Date().toISOString()
                        }
                        : item
                ));
                // Save to localStorage
                const updatedWishlist = wishlist.map(item =>
                    item.id === editingItem.id
                        ? {
                            ...item,
                            emoji: formData.emoji,
                            title: formData.title,
                            description: formData.description || null,
                            category: formData.category,
                            image_url: imageUrl,
                            budget: formData.budget ? parseInt(formData.budget.replace(/\D/g, '')) : null,
                            lokasi: formData.lokasi || null,
                            target_date: formData.target_date || null,
                            updated_by: currentUser,
                            updated_at: new Date().toISOString()
                        }
                        : item
                );
                localStorage.setItem('bilvin-wishlist-v2', JSON.stringify(updatedWishlist));
            }
            showToast('Wish berhasil diupdate! ✨', 'success');
        } else {
            // Add new item
            const newItem: Omit<WishlistItemDB, 'id' | 'created_at' | 'updated_at' | 'updated_by'> = {
                emoji: formData.emoji,
                title: formData.title,
                description: formData.description || null,
                category: formData.category,
                image_url: imageUrl,
                budget: formData.budget ? parseInt(formData.budget.replace(/\D/g, '')) : null,
                lokasi: formData.lokasi || null,
                target_date: formData.target_date || null,
                completed: false,
                created_by: currentUser
            };

            if (isSupabaseConfigured()) {
                await wishlistService.add(newItem);
            } else {
                // localStorage fallback
                const offlineItem: WishlistItemDB = {
                    ...newItem,
                    id: `wish-${Date.now()}`,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    updated_by: null
                };
                setWishlist(prev => [offlineItem, ...prev]);
                localStorage.setItem('bilvin-wishlist-v2', JSON.stringify([offlineItem, ...wishlist]));
            }
            showToast('Wish baru ditambahkan! 🎉', 'success');
        }

        setShowAddModal(false);
        resetForm();
    };

    const handleToggleComplete = async (item: WishlistItemDB) => {
        if (!currentUser) return;

        if (isSupabaseConfigured()) {
            await wishlistService.toggleComplete(item.id, !item.completed, currentUser);
        } else {
            setWishlist(prev => prev.map(w =>
                w.id === item.id ? { ...w, completed: !w.completed, updated_by: currentUser } : w
            ));
        }
    };

    const handleDelete = async (item: WishlistItemDB) => {
        // Only creator can delete
        if (item.created_by !== currentUser) {
            showToast('Hanya yang membuat bisa menghapus 😅', 'info');
            return;
        }

        if (isSupabaseConfigured()) {
            await wishlistService.delete(item.id);
            // Delete image if exists
            if (item.image_url) {
                await storageService.deleteImage(item.image_url);
            }
        } else {
            setWishlist(prev => prev.filter(w => w.id !== item.id));
        }
        showToast('Wish dihapus', 'success');
    };

    const handleEdit = (item: WishlistItemDB) => {
        setEditingItem(item);
        setFormData({
            emoji: item.emoji,
            title: item.title,
            description: item.description || '',
            category: item.category,
            imageFile: null,
            imagePreview: item.image_url || '',
            budget: item.budget ? item.budget.toString() : '',
            lokasi: item.lokasi || '',
            target_date: item.target_date || ''
        });
        setShowAddModal(true);
    };

    const filteredWishlist = activeCategory === 'all'
        ? wishlist
        : wishlist.filter(item => item.category === activeCategory);

    const categories: { id: CategoryType; label: string; icon: string }[] = [
        { id: 'all', label: 'Semua', icon: '💫' },
        { id: 'travel', label: 'Travel', icon: '✈️' },
        { id: 'couple', label: 'Couple', icon: '💑' },
        { id: 'life', label: 'Life', icon: '🏠' }
    ];

    const emojiOptions = ['✨', '💕', '🌟', '🎯', '🎁', '🌈', '🎵', '📚', '🎨', '🏆', '💪', '🌺', '✈️', '🏠', '💍', '🐱', '👶', '🎉', '💰', '🌸'];

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <div className="w-full min-h-full pb-32 px-4 pt-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-6"
            >
                <h1 className="font-serif text-3xl text-stone-800 dark:text-rose-100 mb-2">
                    Our Wishlist 💫
                </h1>
                <p className="text-stone-500 dark:text-stone-400 text-sm italic">
                    {currentUser ? `Logged in as ${USER_CREDENTIALS[currentUser].displayName}` : "Dreams we'll chase together"}
                </p>
            </motion.div>

            {/* Supabase Status */}
            {!isSupabaseConfigured() && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-4 p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-800 dark:text-amber-200 text-xs text-center"
                >
                    ⚠️ Mode offline - Data tersimpan lokal saja
                </motion.div>
            )}

            {/* Category Tabs */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex gap-2 mb-4"
                style={{ overflow: 'hidden' }}
            >
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${activeCategory === cat.id
                            ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                            : 'bg-white/60 dark:bg-slate-800/60 text-stone-600 dark:text-stone-300 hover:bg-white dark:hover:bg-slate-700'
                            }`}
                    >
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                    </button>
                ))}
            </motion.div>

            {/* Loading State */}
            {isLoading ? (
                <div className="flex justify-center items-center py-12">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full"
                    />
                </div>
            ) : (
                /* Wishlist Items */
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-3"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredWishlist.map((item, index) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ delay: index * 0.03 }}
                                className={`relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-2xl p-4 border border-white/50 dark:border-white/10 shadow-sm overflow-hidden ${item.completed ? 'opacity-60' : ''
                                    }`}
                            >
                                {/* Completion decoration */}
                                {item.completed && (
                                    <motion.div
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20"
                                    />
                                )}

                                <div className="flex items-start gap-3 relative">
                                    {/* Checkbox */}
                                    <button
                                        onClick={() => handleToggleComplete(item)}
                                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${item.completed
                                            ? 'bg-green-500 border-green-500 text-white'
                                            : 'border-stone-300 dark:border-stone-600 hover:border-rose-400 dark:hover:border-rose-400'
                                            }`}
                                    >
                                        {item.completed && (
                                            <motion.svg
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="w-3.5 h-3.5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </motion.svg>
                                        )}
                                    </button>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-lg">{item.emoji}</span>
                                            <h3 className={`font-medium text-stone-800 dark:text-white ${item.completed ? 'line-through' : ''}`}>
                                                {item.title}
                                            </h3>
                                        </div>

                                        {item.description && (
                                            <p className={`text-sm text-stone-500 dark:text-stone-400 ${item.completed ? 'line-through' : ''}`}>
                                                {item.description}
                                            </p>
                                        )}

                                        {/* Budget, Location, Target Date */}
                                        {(item.budget || item.lokasi || item.target_date) && (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {item.budget && (
                                                    <span className="inline-flex items-center gap-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                                                        💰 Rp {item.budget.toLocaleString('id-ID')}
                                                    </span>
                                                )}
                                                {item.lokasi && (
                                                    <span className="inline-flex items-center gap-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                                                        📍 {item.lokasi}
                                                    </span>
                                                )}
                                                {item.target_date && (
                                                    <span className="inline-flex items-center gap-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full">
                                                        📅 {new Date(item.target_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* Image preview */}
                                        {item.image_url && (
                                            <div className="mt-2 rounded-lg overflow-hidden">
                                                <img
                                                    src={item.image_url}
                                                    alt={item.title}
                                                    className="w-full h-32 object-cover"
                                                />
                                            </div>
                                        )}

                                        {/* Creator/Editor info */}
                                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-stone-400 dark:text-stone-500">
                                            <span className="flex items-center gap-1">
                                                Dibuat oleh {USER_CREDENTIALS[item.created_by].displayName}
                                            </span>
                                            {item.updated_by && item.updated_by !== item.created_by && (
                                                <span className="flex items-center gap-1">
                                                    • ✏️ Diedit oleh {USER_CREDENTIALS[item.updated_by].displayName}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-1">
                                        {/* Category Badge */}
                                        <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 text-center ${item.category === 'travel' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300' :
                                            item.category === 'couple' ? 'bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-300' :
                                                'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-300'
                                            }`}>
                                            {item.category === 'travel' ? '✈️' : item.category === 'couple' ? '💑' : '🏠'}
                                        </span>

                                        {/* Edit button */}
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="p-1.5 text-stone-400 hover:text-rose-500 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </button>

                                        {/* Delete button (only for creator) */}
                                        {item.created_by === currentUser && (
                                            <button
                                                onClick={() => handleDelete(item)}
                                                className="p-1.5 text-stone-400 hover:text-red-500 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredWishlist.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-8 text-stone-500 dark:text-stone-400"
                        >
                            <span className="text-5xl block mb-4">📝</span>
                            <p className="text-lg font-medium text-stone-600 dark:text-stone-300 mb-2">Belum ada wishlist</p>
                            <p className="text-sm mb-6">Yuk tambah wish pertama kita!</p>

                            {/* Big Create Button */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    resetForm();
                                    setShowAddModal(true);
                                }}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium rounded-full shadow-lg shadow-rose-500/30 hover:shadow-xl transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                Tambah Wish Baru
                            </motion.button>
                        </motion.div>
                    )}
                </motion.div>
            )}

            {/* Add Button - Inline (after items exist) */}
            {!isLoading && filteredWishlist.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 mb-8"
                >
                    <button
                        onClick={() => {
                            resetForm();
                            setShowAddModal(true);
                        }}
                        className="w-full py-3 bg-gradient-to-r from-rose-500/10 to-pink-500/10 dark:from-rose-500/20 dark:to-pink-500/20 border-2 border-dashed border-rose-300 dark:border-rose-500/50 rounded-xl text-rose-500 dark:text-rose-400 font-medium flex items-center justify-center gap-2 hover:bg-rose-500/20 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Tambah Wish Baru
                    </button>
                </motion.div>
            )}

            {/* Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className={`fixed bottom-36 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-white text-sm font-medium shadow-lg z-50 ${toast.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                            }`}
                    >
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-end justify-center"
                        onClick={() => {
                            setShowAddModal(false);
                            resetForm();
                        }}
                    >
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl p-6 pb-8 shadow-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="w-12 h-1 bg-stone-300 dark:bg-stone-600 rounded-full mx-auto mb-4" />

                            <h3 className="font-serif text-xl text-center mb-6 text-stone-800 dark:text-white">
                                {editingItem ? 'Edit Wish ✏️' : 'Tambah Wish Baru ✨'}
                            </h3>

                            {/* Emoji Picker */}
                            <div className="mb-4">
                                <label className="text-sm text-stone-600 dark:text-stone-400 mb-2 block">Pilih Emoji</label>
                                <div className="flex flex-wrap gap-2">
                                    {emojiOptions.map((emoji) => (
                                        <button
                                            key={emoji}
                                            onClick={() => setFormData(prev => ({ ...prev, emoji }))}
                                            className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${formData.emoji === emoji
                                                ? 'bg-rose-100 dark:bg-rose-900/50 scale-110 ring-2 ring-rose-400'
                                                : 'bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700'
                                                }`}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Category */}
                            <div className="mb-4">
                                <label className="text-sm text-stone-600 dark:text-stone-400 mb-2 block">Kategori</label>
                                <div className="flex gap-2">
                                    {[
                                        { id: 'travel', label: 'Travel', icon: '✈️' },
                                        { id: 'couple', label: 'Couple', icon: '💑' },
                                        { id: 'life', label: 'Life', icon: '🏠' }
                                    ].map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setFormData(prev => ({ ...prev, category: cat.id as 'travel' | 'couple' | 'life' }))}
                                            className={`flex-1 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-1 transition-all ${formData.category === cat.id
                                                ? 'bg-rose-500 text-white'
                                                : 'bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-stone-300'
                                                }`}
                                        >
                                            <span>{cat.icon}</span>
                                            <span>{cat.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Title Input */}
                            <div className="mb-4">
                                <label className="text-sm text-stone-600 dark:text-stone-400 mb-2 block">Judul *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="Contoh: Liburan ke Korea"
                                    className="w-full px-4 py-3 rounded-xl bg-stone-100 dark:bg-slate-800 text-stone-800 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-rose-400"
                                />
                            </div>

                            {/* Description Input */}
                            <div className="mb-4">
                                <label className="text-sm text-stone-600 dark:text-stone-400 mb-2 block">Deskripsi</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Ceritakan lebih detail..."
                                    rows={2}
                                    className="w-full px-4 py-3 rounded-xl bg-stone-100 dark:bg-slate-800 text-stone-800 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none"
                                />
                            </div>

                            {/* Budget Input */}
                            <div className="mb-4">
                                <label className="text-sm text-stone-600 dark:text-stone-400 mb-2 block">Budget (Rupiah)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 dark:text-stone-400">Rp</span>
                                    <input
                                        type="text"
                                        value={formData.budget}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '');
                                            const formatted = value ? parseInt(value).toLocaleString('id-ID') : '';
                                            setFormData(prev => ({ ...prev, budget: formatted }));
                                        }}
                                        placeholder="1.000.000"
                                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-stone-100 dark:bg-slate-800 text-stone-800 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-rose-400"
                                    />
                                </div>
                            </div>

                            {/* Location Input */}
                            <div className="mb-4">
                                <label className="text-sm text-stone-600 dark:text-stone-400 mb-2 block">Lokasi</label>
                                <input
                                    type="text"
                                    value={formData.lokasi}
                                    onChange={(e) => setFormData(prev => ({ ...prev, lokasi: e.target.value }))}
                                    placeholder="Contoh: Tokyo, Jepang"
                                    className="w-full px-4 py-3 rounded-xl bg-stone-100 dark:bg-slate-800 text-stone-800 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-rose-400"
                                />
                            </div>

                            {/* Target Date Input */}
                            <div className="mb-4">
                                <label className="text-sm text-stone-600 dark:text-stone-400 mb-2 block">Target Tanggal</label>
                                <input
                                    type="date"
                                    value={formData.target_date}
                                    onChange={(e) => setFormData(prev => ({ ...prev, target_date: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl bg-stone-100 dark:bg-slate-800 text-stone-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-400"
                                />
                            </div>

                            {/* Image Upload */}
                            <div className="mb-6">
                                <label className="text-sm text-stone-600 dark:text-stone-400 mb-2 block">Gambar (opsional)</label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />

                                {formData.imagePreview ? (
                                    <div className="relative rounded-xl overflow-hidden">
                                        <img
                                            src={formData.imagePreview}
                                            alt="Preview"
                                            className="w-full h-40 object-cover"
                                        />
                                        <button
                                            onClick={() => setFormData(prev => ({ ...prev, imageFile: null, imagePreview: '' }))}
                                            className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full py-8 border-2 border-dashed border-stone-300 dark:border-stone-600 rounded-xl text-stone-400 dark:text-stone-500 hover:border-rose-400 hover:text-rose-400 transition-colors"
                                    >
                                        <span className="text-2xl block mb-1">📷</span>
                                        <span className="text-sm">Tap untuk upload gambar</span>
                                    </button>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4 pb-20">
                                <button
                                    onClick={() => {
                                        setShowAddModal(false);
                                        resetForm();
                                    }}
                                    className="flex-1 py-3.5 rounded-xl bg-stone-200 dark:bg-slate-700 text-stone-600 dark:text-stone-300 font-medium"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={!formData.title.trim()}
                                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-rose-500/30"
                                >
                                    {editingItem ? 'Simpan ✨' : 'Tambah ✨'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default WishlistPage;
