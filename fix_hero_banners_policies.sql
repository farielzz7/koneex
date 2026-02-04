-- Fix storage policies for hero-banners bucket
-- Run this in Supabase SQL Editor to replace existing policies

-- First, drop the existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public can view hero-banners files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload hero-banners files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update hero-banners files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete hero-banners files" ON storage.objects;

-- Create new permissive policies

-- Anyone can view files in the bucket (it's public)
CREATE POLICY "Public can view hero-banners"
ON storage.objects FOR SELECT
USING (bucket_id = 'hero-banners');

-- Any authenticated user can upload to the bucket
CREATE POLICY "Authenticated can upload to hero-banners"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'hero-banners');

-- Any authenticated user can update files in the bucket
CREATE POLICY "Authenticated can update hero-banners"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'hero-banners')
WITH CHECK (bucket_id = 'hero-banners');

-- Any authenticated user can delete files from the bucket
CREATE POLICY "Authenticated can delete from hero-banners"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'hero-banners');
