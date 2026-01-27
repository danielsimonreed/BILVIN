import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Supabase credentials not found. Wishlist will work in offline mode.');
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
        return data || [];
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
    }
};

// Image upload to Supabase Storage
export const storageService = {
    async uploadImage(file: File, userId: string): Promise<string | null> {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        const filePath = `wishlist-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('wishlist')
            .upload(filePath, file);

        if (uploadError) {
            console.error('Error uploading image:', uploadError);
            return null;
        }

        const { data } = supabase.storage
            .from('wishlist')
            .getPublicUrl(filePath);

        return data.publicUrl;
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
    }
};
