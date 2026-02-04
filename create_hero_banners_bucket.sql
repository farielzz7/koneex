-- Create hero-banners storage bucket
-- Run this in Supabase SQL Editor

-- Insert bucket into storage.buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('hero-banners', 'hero-banners', true)
ON CONFLICT (id) DO NOTHING;

-- Create basic storage policies for hero-banners bucket

-- Policy: Public can view files
CREATE POLICY "Public can view hero-banners files"
ON storage.objects FOR SELECT
USING (bucket_id = 'hero-banners');

-- Policy: Authenticated users can upload files
CREATE POLICY "Authenticated can upload hero-banners files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'hero-banners');

-- Policy: Authenticated users can update their files
CREATE POLICY "Authenticated can update hero-banners files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'hero-banners');

-- Policy: Authenticated users can delete their files
CREATE POLICY "Authenticated can delete hero-banners files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'hero-banners');
