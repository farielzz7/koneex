-- ============================================================
-- MIGRATION: Add Package Fields for Complete System
-- ============================================================
-- Adds all necessary fields for packages to work in public pages

BEGIN;

-- Add fields to packages table
ALTER TABLE public.packages 
ADD COLUMN IF NOT EXISTS price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS currency_code CHAR(3) DEFAULT 'MXN',
ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
ADD COLUMN IF NOT EXISTS reviews_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS group_size VARCHAR(50),
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS images TEXT[],
ADD COLUMN IF NOT EXISTS includes TEXT[],
ADD COLUMN IF NOT EXISTS excludes TEXT[];

-- Create package_days table for itinerary
CREATE TABLE IF NOT EXISTS public.package_days (
    id BIGSERIAL PRIMARY KEY,
    package_id BIGINT NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
    day_number INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    activities TEXT[],
    order_index INT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(package_id, day_number)
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_package_days_package_id ON public.package_days(package_id);
CREATE INDEX IF NOT EXISTS idx_packages_status ON public.packages(status);
CREATE INDEX IF NOT EXISTS idx_packages_featured ON public.packages(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_packages_slug ON public.packages(slug);

-- Update existing packages to have default values
UPDATE public.packages 
SET 
    price = 999.00,
    currency_code = 'MXN',
    rating = 4.5,
    reviews_count = 0,
    group_size = '2-15 personas',
    tags = ARRAY['aventura']::TEXT[],
    images = ARRAY[]::TEXT[],
    includes = ARRAY['Transporte', 'Hospedaje', 'Desayunos']::TEXT[],
    excludes = ARRAY['Comidas no especificadas', 'Gastos personales']::TEXT[]
WHERE price IS NULL;

COMMIT;

-- Verification
SELECT 
    'Migration completed!' as status,
    COUNT(*) as total_packages,
    COUNT(*) FILTER (WHERE price IS NOT NULL) as packages_with_price
FROM public.packages;
