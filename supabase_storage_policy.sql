-- Enable the execution of this script in the Supabase SQL Editor

-- 1. Create the storage bucket 'wishlist' if it doesn't exist
insert into storage.buckets (id, name, public)
values ('wishlist', 'wishlist', true)
on conflict (id) do nothing;

-- 2. Enable Row Level Security (RLS) - data is private by default
-- (Storage objects table usually has RLS enabled by default)

-- 3. Create Policy to allow public read access (SELECT)
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'wishlist' );

-- 4. Create Policy to allow public upload access (INSERT)
create policy "Public Upload"
on storage.objects for insert
with check ( bucket_id = 'wishlist' );

-- 5. Create Policy to allow public update access (UPDATE)
create policy "Public Update"
on storage.objects for update
using ( bucket_id = 'wishlist' );

-- 6. Create Policy to allow public delete access (DELETE)
create policy "Public Delete"
on storage.objects for delete
using ( bucket_id = 'wishlist' );
