-- Add new columns to hero_banners table
-- Run this in Supabase SQL Editor

-- Add position column (where the banner appears)
ALTER TABLE public.hero_banners 
ADD COLUMN IF NOT EXISTS position VARCHAR(50) DEFAULT 'home-hero';

-- Add display_order column (order of display)
ALTER TABLE public.hero_banners 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_hero_banners_order 
ON public.hero_banners(display_order);

-- Update existing records to have default values
UPDATE public.hero_banners 
SET position = 'home-hero', display_order = 0 
WHERE position IS NULL OR display_order IS NULL;
