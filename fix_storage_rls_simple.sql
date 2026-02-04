-- TEMPORARY FIX: Disable RLS on storage.objects for hero-banners bucket
-- This is a quick solution to get banners working
-- Run this in Supabase SQL Editor

-- Option 1: Make the bucket completely public (simplest)
-- Remove all existing policies for hero-banners
DROP POLICY IF EXISTS "Public can view hero-banners files" ON storage.objects;
DROP POLICY IF EXISTS "Public can view hero-banners" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload hero-banners files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload to hero-banners" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update hero-banners files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update hero-banners" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete hero-banners files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete from hero-banners" ON storage.objects;

-- Create a single permissive policy that allows everything for hero-banners
CREATE POLICY "Allow all operations on hero-banners"
ON storage.objects
FOR ALL
USING (bucket_id = 'hero-banners')
WITH CHECK (bucket_id = 'hero-banners');
