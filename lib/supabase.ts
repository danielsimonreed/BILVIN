import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Supabase credentials not found. Shared features will work in offline mode.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
    return Boolean(supabaseUrl && supabaseAnonKey);
};

// Types for Supabase tables
export interface WishlistItemDB {
    id: string;
    emoji: string;
    title: string;
    description: string | null;
    category: 'travel' | 'couple' | 'life';
    image_url: string | null;
    budget: number | null; // Rupiah currency
    lokasi: string | null; // Location
    target_date: string | null; // Target date
    completed: boolean;
    created_by: 'bilqis' | 'kevin';
    created_at: string;
    updated_by: 'bilqis' | 'kevin' | null;
    updated_at: string;
    sort_order: number | null; // For manual sorting/drag-drop
}

export type JournalMood = 'happy' | 'grateful' | 'miss_you' | 'soft' | 'excited';

export interface JournalEntryDB {
    id: string;
    author: 'bilqis' | 'kevin';
    mood: JournalMood;
    title: string | null;
    body: string;
    image_url: string | null;
    created_at: string;
    updated_at: string;
}

// CRUD Operations for Wishlist
export const wishlistService = {
    // Get all wishlist items
    async getAll(): Promise<WishlistItemDB[]> {
        const { data, error } = await supabase
            .from('wishlist_items')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching wishlist:', error);
            return [];
        }

        // Sort client-side: items with sort_order first (ascending), then by created_at
        const items = data || [];
        return items.sort((a, b) => {
            // Items with sort_order come first
            if (a.sort_order !== null && b.sort_order !== null) {
                return a.sort_order - b.sort_order;
            }
            if (a.sort_order !== null) return -1;
            if (b.sort_order !== null) return 1;
            // Fall back to created_at (newest first)
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
    },

    // Add new wishlist item
    async add(item: Omit<WishlistItemDB, 'id' | 'created_at' | 'updated_at' | 'updated_by'>): Promise<WishlistItemDB | null> {
        const { data, error } = await supabase
            .from('wishlist_items')
            .insert([item])
            .select()
            .single();

        if (error) {
            console.error('Error adding wishlist item:', error);
            return null;
        }
        return data;
    },

    // Update wishlist item
    async update(id: string, updates: Partial<WishlistItemDB>, updatedBy: 'bilqis' | 'kevin'): Promise<WishlistItemDB | null> {
        const { data, error } = await supabase
            .from('wishlist_items')
            .update({ ...updates, updated_by: updatedBy, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating wishlist item:', error);
            return null;
        }
        return data;
    },

    // Delete wishlist item
    async delete(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('wishlist_items')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting wishlist item:', error);
            return false;
        }
        return true;
    },

    // Toggle completion status
    async toggleComplete(id: string, completed: boolean, updatedBy: 'bilqis' | 'kevin'): Promise<boolean> {
        const { error } = await supabase
            .from('wishlist_items')
            .update({ completed, updated_by: updatedBy, updated_at: new Date().toISOString() })
            .eq('id', id);

        if (error) {
            console.error('Error toggling completion:', error);
            return false;
        }
        return true;
    },

    // Subscribe to realtime changes
    subscribeToChanges(callback: (payload: any) => void) {
        return supabase
            .channel('wishlist_changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'wishlist_items' },
                callback
            )
            .subscribe();
    },

    // Update sort order for multiple items (batch update)
    async updateOrder(items: { id: string; sort_order: number }[]): Promise<boolean> {
        try {
            // Update each item's sort_order
            const updates = items.map(item =>
                supabase
                    .from('wishlist_items')
                    .update({ sort_order: item.sort_order })
                    .eq('id', item.id)
            );

            await Promise.all(updates);
            return true;
        } catch (error) {
            console.error('Error updating order:', error);
            return false;
        }
    }
};

export const journalService = {
    async getAll(): Promise<JournalEntryDB[]> {
        const { data, error } = await supabase
            .from('journal_entries')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching journal entries:', error);
            return [];
        }

        return data || [];
    },

    async create(entry: Omit<JournalEntryDB, 'id' | 'created_at' | 'updated_at'>): Promise<JournalEntryDB | null> {
        const { data, error } = await supabase
            .from('journal_entries')
            .insert([entry])
            .select()
            .single();

        if (error) {
            console.error('Error creating journal entry:', error);
            return null;
        }

        return data;
    },

    async update(id: string, updates: Partial<Pick<JournalEntryDB, 'mood' | 'title' | 'body' | 'image_url'>>): Promise<JournalEntryDB | null> {
        const { data, error } = await supabase
            .from('journal_entries')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating journal entry:', error);
            return null;
        }

        return data;
    },

    async delete(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('journal_entries')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting journal entry:', error);
            return false;
        }

        return true;
    },

    subscribeToChanges(callback: (payload: any) => void) {
        return supabase
            .channel('journal_changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'journal_entries' },
                callback
            )
            .subscribe();
    }
};

// Image upload to Supabase Storage
export const storageService = {
    async uploadImage(file: File, userId: string): Promise<{ data: string | null; error: any }> {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        const filePath = `wishlist-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('wishlist')
            .upload(filePath, file);

        if (uploadError) {
            console.error('Error uploading image:', uploadError);
            return { data: null, error: uploadError };
        }

        const { data } = supabase.storage
            .from('wishlist')
            .getPublicUrl(filePath);

        return { data: data.publicUrl, error: null };
    },

    async uploadJournalImage(file: File, userId: string): Promise<{ data: string | null; error: any }> {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        const filePath = `journal-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('wishlist')
            .upload(filePath, file);

        if (uploadError) {
            console.error('Error uploading journal image:', uploadError);
            return { data: null, error: uploadError };
        }

        const { data } = supabase.storage
            .from('wishlist')
            .getPublicUrl(filePath);

        return { data: data.publicUrl, error: null };
    },

    async deleteImage(imageUrl: string): Promise<boolean> {
        // Extract file path from URL
        const urlParts = imageUrl.split('/wishlist/');
        if (urlParts.length < 2) return false;

        const filePath = urlParts[1];
        const { error } = await supabase.storage
            .from('wishlist')
            .remove([filePath]);

        if (error) {
            console.error('Error deleting image:', error);
            return false;
        }
        return true;
    },

    async deleteJournalImage(imageUrl: string): Promise<boolean> {
        return this.deleteImage(imageUrl);
    }
};
