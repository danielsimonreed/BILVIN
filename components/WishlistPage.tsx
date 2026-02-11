import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion';
import { UserType, USER_CREDENTIALS } from '../constants';
import { wishlistService, storageService, isSupabaseConfigured, WishlistItemDB } from '../lib/supabase';

interface WishlistPageProps {
    currentUser: UserType | null;
}

type CategoryType = 'all' | 'travel' | 'couple' | 'life';

const formatBudget = (amount: number) => {
    // Handle potential string numbers just in case
    const num = Number(amount);
    if (isNaN(num)) return `Rp. ${amount}`;

    if (num >= 999999999) {
        // >= 1 Milyar (approx, to catch 1000jt cases)
        const val = parseFloat((num / 1000000000).toFixed(1));
        return `Rp. ${val} m`;
    }
    if (num >= 1000000) {
        // >= 1 Juta
        const val = parseFloat((num / 1000000).toFixed(1));
        return `Rp. ${val} jt`;
    }
    if (num >= 1000) {
        // >= 1 Ribu
        const val = parseFloat((num / 1000).toFixed(1));
        return `Rp. ${val} rb`;
    }
    return `Rp. ${num}`;
};

const WishlistPage: React.FC<WishlistPageProps> = ({ currentUser }) => {
    const [wishlist, setWishlist] = useState<WishlistItemDB[]>([]);
    const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingItem, setEditingItem] = useState<WishlistItemDB | null>(null);
    const [selectedItem, setSelectedItem] = useState<WishlistItemDB | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
    const [showCelebration, setShowCelebration] = useState(false);
    const [isDragMode, setIsDragMode] = useState(false);
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
        if (formData.imageFile) {
            if (isSupabaseConfigured()) {
                const { data: uploadedUrl, error } = await storageService.uploadImage(formData.imageFile, currentUser);

                if (error) {
                    showToast(`Gagal upload: ${error.message || 'Unknown error'}`, 'info');
                    return; // Stop saving if image upload fails
                }

                if (uploadedUrl) {
                    imageUrl = uploadedUrl;
                }
            } else {
                showToast('Fitur upload gambar hanya tersedia saat online (Supabase)', 'info');
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
                created_by: currentUser,
                sort_order: 0 // New items go to top
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

        const isMarkingComplete = !item.completed;

        if (isSupabaseConfigured()) {
            await wishlistService.toggleComplete(item.id, !item.completed, currentUser);
        } else {
            setWishlist(prev => prev.map(w =>
                w.id === item.id ? { ...w, completed: !w.completed, updated_by: currentUser } : w
            ));
        }

        // Show celebration when marking as complete
        if (isMarkingComplete) {
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 3500);
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

    // Handle reordering of wishlist items
    const handleReorder = async (reorderedItems: WishlistItemDB[]) => {
        // Update local state immediately for smooth UX
        if (activeCategory === 'all') {
            setWishlist(reorderedItems);
        } else {
            // When filtering by category, we need to merge back
            const otherItems = wishlist.filter(item => item.category !== activeCategory);
            const newOrder = [...reorderedItems, ...otherItems];
            setWishlist(newOrder);
        }

        // Persist to database
        if (isSupabaseConfigured()) {
            const orderUpdates = reorderedItems.map((item, index) => ({
                id: item.id,
                sort_order: index
            }));
            await wishlistService.updateOrder(orderUpdates);
        } else {
            // localStorage fallback
            const updatedWishlist = activeCategory === 'all'
                ? reorderedItems
                : [...reorderedItems, ...wishlist.filter(item => item.category !== activeCategory)];
            localStorage.setItem('bilvin-wishlist-v2', JSON.stringify(updatedWishlist));
        }
    };

    // Save order when exiting drag mode
    const handleSaveOrder = () => {
        setIsDragMode(false);
        showToast('Urutan berhasil disimpan! ✨', 'success');
    };

    const filteredWishlist = activeCategory === 'all'
        ? wishlist
        : wishlist.filter(item => item.category === activeCategory);

    const categories: { id: CategoryType; label: string; icon: string }[] = [
        { id: 'all', label: 'Semua', icon: '' },
        { id: 'travel', label: 'Travel', icon: '' },
        { id: 'couple', label: 'Couple', icon: '' },
        { id: 'life', label: 'Life', icon: '' }
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
                className="flex gap-2 mb-4 justify-center"
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

            {/* Drag Mode Toggle & Instructions */}
            {!isLoading && filteredWishlist.length > 1 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-4 flex justify-center w-full"
                >
                    {isDragMode ? (
                        <div className="flex flex-col gap-2 w-full">
                            <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/30 rounded-xl border border-amber-200 dark:border-amber-800">
                                <span className="text-xl">✋</span>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Mode Atur Urutan</p>
                                    <p className="text-xs text-amber-600 dark:text-amber-400">Geser item ke atas atau bawah untuk mengatur urutan</p>
                                </div>
                            </div>
                            <button
                                onClick={handleSaveOrder}
                                className="w-full py-2.5 bg-green-500 text-white font-medium rounded-xl shadow-lg shadow-green-500/30 hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Simpan
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsDragMode(true)}
                            className="flex items-center gap-2 px-3 py-2 bg-white/60 dark:bg-slate-800/60 rounded-xl text-xs font-medium text-stone-600 dark:text-stone-300 hover:bg-white dark:hover:bg-slate-700 transition-all border border-stone-200 dark:border-stone-700"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                            Atur Urutan
                        </button>
                    )}
                </motion.div>
            )}

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
                    {isDragMode ? (
                        /* Drag Mode - Reorderable List */
                        <Reorder.Group
                            axis="y"
                            values={filteredWishlist}
                            onReorder={handleReorder}
                            className="space-y-3"
                        >
                            {filteredWishlist.map((item) => (
                                <Reorder.Item
                                    key={item.id}
                                    value={item}
                                    className={`relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-xl p-3 border-2 border-dashed border-rose-300 dark:border-rose-600 shadow-sm overflow-hidden cursor-grab active:cursor-grabbing touch-none ${item.completed ? 'opacity-60' : ''}`}
                                    whileDrag={{
                                        scale: 1.02,
                                        boxShadow: "0 10px 30px rgba(244, 63, 94, 0.3)",
                                        zIndex: 50
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Drag Handle */}
                                        <div className="flex flex-col gap-0.5 text-rose-400 flex-shrink-0">
                                            <div className="flex gap-0.5">
                                                <span className="w-1 h-1 bg-current rounded-full"></span>
                                                <span className="w-1 h-1 bg-current rounded-full"></span>
                                            </div>
                                            <div className="flex gap-0.5">
                                                <span className="w-1 h-1 bg-current rounded-full"></span>
                                                <span className="w-1 h-1 bg-current rounded-full"></span>
                                            </div>
                                            <div className="flex gap-0.5">
                                                <span className="w-1 h-1 bg-current rounded-full"></span>
                                                <span className="w-1 h-1 bg-current rounded-full"></span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-sm">{item.emoji}</span>
                                                <h3 className={`font-medium text-sm text-stone-800 dark:text-white truncate ${item.completed ? 'line-through' : ''}`}>
                                                    {item.title}
                                                </h3>
                                            </div>
                                            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${item.category === 'travel' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300' :
                                                    item.category === 'couple' ? 'bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-300' :
                                                        'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-300'
                                                    }`}>
                                                    {item.category === 'travel' ? '✈️' : item.category === 'couple' ? '💑' : '🏠'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Image thumbnail */}
                                        {item.image_url && (
                                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                                <img
                                                    src={item.image_url}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover pointer-events-none"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>
                    ) : (
                        /* Normal Mode - Regular List */
                        <AnimatePresence mode="popLayout">
                            {filteredWishlist.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: index * 0.03 }}
                                    onClick={() => setSelectedItem(item)}
                                    className={`relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-xl p-3 border border-white/50 dark:border-white/10 shadow-sm overflow-hidden cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all ${item.completed ? 'opacity-60' : ''
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

                                    <div className="flex items-center gap-2 relative">
                                        {/* Checkbox */}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleToggleComplete(item); }}
                                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${item.completed
                                                ? 'bg-green-500 border-green-500 text-white'
                                                : 'border-stone-300 dark:border-stone-600 hover:border-rose-400 dark:hover:border-rose-400'
                                                }`}
                                        >
                                            {item.completed && (
                                                <motion.svg
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="w-3 h-3"
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
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-sm">{item.emoji}</span>
                                                <h3 className={`font-medium text-sm text-stone-800 dark:text-white truncate ${item.completed ? 'line-through' : ''}`}>
                                                    {item.title}
                                                </h3>
                                            </div>

                                            {/* Compact metadata row */}
                                            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                                                {/* Category Badge Removed as requested */}

                                                {item.budget && (
                                                    <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                                                        💰 {formatBudget(item.budget)}
                                                    </span>
                                                )}
                                                {item.lokasi && (
                                                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                                                        📍 {item.lokasi}
                                                    </span>
                                                )}
                                                {item.target_date && (
                                                    <span className="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                                                        📅 {new Date(item.target_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Image thumbnail */}
                                        {item.image_url && (
                                            <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                                                <img
                                                    src={item.image_url}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}

                                        {/* Quick action - Edit */}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleEdit(item); }}
                                            className="p-1.5 text-stone-400 hover:text-rose-500 transition-colors flex-shrink-0"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}

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
                        className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium rounded-xl shadow-lg shadow-rose-500/30 hover:shadow-xl transition-all flex items-center justify-center gap-2"
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

            {/* Celebration Overlay with Confetti */}
            <AnimatePresence>
                {showCelebration && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] pointer-events-none flex items-center justify-center"
                    >
                        {/* Confetti particles */}
                        {[...Array(50)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{
                                    opacity: 1,
                                    x: 0,
                                    y: 0,
                                    scale: 0
                                }}
                                animate={{
                                    opacity: [1, 1, 0],
                                    x: (Math.random() - 0.5) * 400,
                                    y: [0, -200 - Math.random() * 200, 400],
                                    scale: [0, 1, 0.5],
                                    rotate: Math.random() * 720 - 360
                                }}
                                transition={{
                                    duration: 2.5 + Math.random() * 1,
                                    ease: "easeOut",
                                    delay: Math.random() * 0.3
                                }}
                                className="absolute"
                                style={{
                                    left: '50%',
                                    top: '40%',
                                    width: 10 + Math.random() * 10,
                                    height: 10 + Math.random() * 10,
                                    borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                                    backgroundColor: ['#f43f5e', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#fbbf24'][Math.floor(Math.random() * 7)]
                                }}
                            />
                        ))}

                        {/* Emoji explosions */}
                        {['🎉', '🎊', '✨', '💖', '🌟', '🥳', '💫', '❤️'].map((emoji, i) => (
                            <motion.span
                                key={emoji + i}
                                initial={{
                                    opacity: 0,
                                    x: 0,
                                    y: 0,
                                    scale: 0
                                }}
                                animate={{
                                    opacity: [0, 1, 1, 0],
                                    x: (Math.random() - 0.5) * 300,
                                    y: [-100 - Math.random() * 150],
                                    scale: [0, 1.5, 1.2, 0]
                                }}
                                transition={{
                                    duration: 2,
                                    ease: "easeOut",
                                    delay: 0.1 + i * 0.1
                                }}
                                className="absolute text-3xl sm:text-4xl"
                                style={{
                                    left: '50%',
                                    top: '40%'
                                }}
                            >
                                {emoji}
                            </motion.span>
                        ))}

                        {/* Celebration text card */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                                delay: 0.2
                            }}
                            className="pointer-events-auto bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 text-white px-8 py-6 rounded-3xl shadow-2xl text-center max-w-xs mx-4"
                        >
                            <motion.div
                                animate={{
                                    scale: [1, 1.1, 1],
                                    rotate: [0, -5, 5, 0]
                                }}
                                transition={{
                                    duration: 0.5,
                                    repeat: 2,
                                    repeatType: "reverse"
                                }}
                                className="text-5xl mb-3"
                            >
                                🎉
                            </motion.div>
                            <motion.h3
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-xl font-bold mb-2"
                            >
                                Yeayyyy!
                            </motion.h3>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="text-white/90 text-sm leading-relaxed"
                            >
                                Selamat yaa atas pencapaiannya! 💕
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                                className="mt-3 flex justify-center gap-1"
                            >
                                {['✨', '💖', '✨'].map((e, i) => (
                                    <motion.span
                                        key={i}
                                        animate={{
                                            y: [0, -5, 0],
                                            scale: [1, 1.2, 1]
                                        }}
                                        transition={{
                                            duration: 0.6,
                                            repeat: Infinity,
                                            delay: i * 0.15
                                        }}
                                    >
                                        {e}
                                    </motion.span>
                                ))}
                            </motion.div>
                        </motion.div>
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
                                {editingItem ? 'Edit Wish' : 'Tambah Wish Baru ✨'}
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

            {/* Detail View Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                        onClick={() => setSelectedItem(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            {/* Image Header */}
                            {selectedItem.image_url && (
                                <div className="relative w-full h-48 sm:h-56">
                                    <img
                                        src={selectedItem.image_url}
                                        alt={selectedItem.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                    {/* Status badge on image */}
                                    {selectedItem.completed && (
                                        <div className="absolute top-4 left-4 px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Tercapai
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6">
                                {/* Header without image */}
                                {!selectedItem.image_url && selectedItem.completed && (
                                    <div className="mb-4">
                                        <span className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full inline-flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Tercapai
                                        </span>
                                    </div>
                                )}

                                {/* Title & Emoji */}
                                <div className="flex items-start gap-3 mb-4">
                                    <span className="text-4xl">{selectedItem.emoji}</span>
                                    <div className="flex-1">
                                        <h2 className={`text-xl font-bold text-stone-800 dark:text-white ${selectedItem.completed ? 'line-through opacity-60' : ''}`}>
                                            {selectedItem.title}
                                        </h2>
                                        {/* Category Badge */}
                                        <span className={`inline-block mt-2 text-xs px-3 py-1 rounded-full ${selectedItem.category === 'travel' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300' :
                                            selectedItem.category === 'couple' ? 'bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-300' :
                                                'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-300'
                                            }`}>
                                            {selectedItem.category === 'travel' ? '✈️ Travel' : selectedItem.category === 'couple' ? '💑 Couple' : '🏠 Life'}
                                        </span>
                                    </div>
                                </div>

                                {/* Description */}
                                {selectedItem.description && (
                                    <div className="mb-6">
                                        <p className={`text-stone-600 dark:text-stone-300 leading-relaxed ${selectedItem.completed ? 'line-through opacity-60' : ''}`}>
                                            {selectedItem.description}
                                        </p>
                                    </div>
                                )}

                                {/* Details Grid */}
                                {(selectedItem.budget || selectedItem.lokasi || selectedItem.target_date) && (
                                    <div className="grid grid-cols-1 gap-3 mb-6">
                                        {selectedItem.budget && (
                                            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                                                <span className="text-2xl">💰</span>
                                                <div>
                                                    <p className="text-xs text-green-600 dark:text-green-400 font-medium">Budget</p>
                                                    <p className="text-lg font-semibold text-green-700 dark:text-green-300">
                                                        Rp {selectedItem.budget.toLocaleString('id-ID')}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        {selectedItem.lokasi && (
                                            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                                <span className="text-2xl">📍</span>
                                                <div>
                                                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Lokasi</p>
                                                    <p className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                                                        {selectedItem.lokasi}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        {selectedItem.target_date && (
                                            <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                                                <span className="text-2xl">📅</span>
                                                <div>
                                                    <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Target Tanggal</p>
                                                    <p className="text-lg font-semibold text-purple-700 dark:text-purple-300">
                                                        {new Date(selectedItem.target_date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Creator/Editor info */}
                                <div className="text-xs text-stone-400 dark:text-stone-500 border-t border-stone-200 dark:border-stone-700 pt-4">
                                    <p className="flex items-center gap-1 mb-1">
                                        <span>✨</span> Dibuat oleh <span className="font-medium text-stone-600 dark:text-stone-300">{USER_CREDENTIALS[selectedItem.created_by].displayName}</span>
                                    </p>
                                    {selectedItem.created_at && (
                                        <p className="ml-5 text-stone-400 dark:text-stone-500">
                                            {new Date(selectedItem.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                    )}
                                    {selectedItem.updated_by && selectedItem.updated_by !== selectedItem.created_by && (
                                        <p className="flex items-center gap-1 mt-2">
                                            <span>✏️</span> Diedit oleh <span className="font-medium text-stone-600 dark:text-stone-300">{USER_CREDENTIALS[selectedItem.updated_by].displayName}</span>
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Action Footer */}
                            <div className="p-4 pb-8 border-t border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-slate-800/50">
                                <div className="flex gap-3">
                                    {/* Toggle Complete Button */}
                                    <button
                                        onClick={() => {
                                            handleToggleComplete(selectedItem);
                                            setSelectedItem(null);
                                        }}
                                        className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${selectedItem.completed
                                            ? 'bg-stone-200 dark:bg-slate-700 text-stone-600 dark:text-stone-300'
                                            : 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                                            }`}
                                    >
                                        {selectedItem.completed ? (
                                            <>
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                                Belum Tercapai
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Tandai Tercapai
                                            </>
                                        )}
                                    </button>

                                    {/* Edit Button */}
                                    <button
                                        onClick={() => {
                                            handleEdit(selectedItem);
                                            setSelectedItem(null);
                                        }}
                                        className="py-3 px-4 rounded-xl bg-rose-500 text-white font-medium shadow-lg shadow-rose-500/30 hover:bg-rose-600 transition-all"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </button>

                                    {/* Delete Button (only for creator) */}
                                    {selectedItem.created_by === currentUser && (
                                        <button
                                            onClick={() => {
                                                handleDelete(selectedItem);
                                                setSelectedItem(null);
                                            }}
                                            className="py-3 px-4 rounded-xl bg-red-500 text-white font-medium shadow-lg shadow-red-500/30 hover:bg-red-600 transition-all"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    )}
                                </div>

                                {/* Close Button */}
                                <button
                                    onClick={() => setSelectedItem(null)}
                                    className="w-full mt-3 py-2.5 rounded-xl bg-stone-200 dark:bg-slate-700 text-stone-600 dark:text-stone-300 font-medium hover:bg-stone-300 dark:hover:bg-slate-600 transition-all"
                                >
                                    Tutup
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
