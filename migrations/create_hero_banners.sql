-- Migration: Create hero_banners table and storage
-- Description: Hero banners for homepage with single active banner constraint

-- Create hero_banners table
CREATE TABLE IF NOT EXISTS public.hero_banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    link_url TEXT,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- Create index on is_active for faster queries
CREATE INDEX idx_hero_banners_active ON public.hero_banners(is_active) WHERE is_active = TRUE;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_hero_banners_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER hero_banners_updated_at
    BEFORE UPDATE ON public.hero_banners
    FOR EACH ROW
    EXECUTE FUNCTION update_hero_banners_updated_at();

-- Create trigger to ensure only one banner is active at a time
CREATE OR REPLACE FUNCTION ensure_single_active_banner()
RETURNS TRIGGER AS $$
BEGIN
    -- If the new/updated banner is being set to active
    IF NEW.is_active = TRUE THEN
        -- Deactivate all other banners
        UPDATE public.hero_banners
        SET is_active = FALSE
        WHERE id != NEW.id AND is_active = TRUE;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER hero_banners_single_active
    BEFORE INSERT OR UPDATE ON public.hero_banners
    FOR EACH ROW
    EXECUTE FUNCTION ensure_single_active_banner();

-- Enable Row Level Security
ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Policy: Anyone can view active banners
CREATE POLICY "Public can view active banners"
    ON public.hero_banners
    FOR SELECT
    USING (is_active = TRUE);

-- Policy: Admins can view all banners
CREATE POLICY "Admins can view all banners"
    ON public.hero_banners
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'ADMIN'
        )
    );

-- Policy: Admins can insert banners
CREATE POLICY "Admins can insert banners"
    ON public.hero_banners
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'ADMIN'
        )
    );

-- Policy: Admins can update banners
CREATE POLICY "Admins can update banners"
    ON public.hero_banners
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'ADMIN'
        )
    );

-- Policy: Admins can delete banners
CREATE POLICY "Admins can delete banners"
    ON public.hero_banners
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'ADMIN'
        )
    );

-- Create storage bucket for hero banners (run this in Supabase Dashboard)
-- Note: This needs to be created via Supabase Dashboard or CLI
-- Bucket name: hero-banners
-- Public: true
-- Allowed mime types: image/jpeg, image/png, image/webp, image/gif

-- Storage policies will be:
-- 1. Public can view files in hero-banners bucket
-- 2. Admins can upload files to hero-banners bucket
-- 3. Admins can delete files from hero-banners bucket
