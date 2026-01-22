-- Add pricing tier fields to packages table
ALTER TABLE public.packages 
ADD COLUMN IF NOT EXISTS price_single DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS price_double DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS price_triple DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS price_child DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS children_allowed BOOLEAN DEFAULT true;

-- Update existing packages to use price as default for all tiers
UPDATE public.packages 
SET 
    price_single = COALESCE(price_single, price),
    price_double = COALESCE(price_double, price),
    price_triple = COALESCE(price_triple, price)
WHERE price_single IS NULL OR price_double IS NULL OR price_triple IS NULL;

COMMENT ON COLUMN public.packages.price_single IS 'Precio por persona en ocupación sencilla';
COMMENT ON COLUMN public.packages.price_double IS 'Precio por persona en ocupación doble';
COMMENT ON COLUMN public.packages.price_triple IS 'Precio por persona en ocupación triple';
COMMENT ON COLUMN public.packages.price_child IS 'Precio por menor (si aplica)';
COMMENT ON COLUMN public.packages.children_allowed IS 'Si el paquete acepta menores';
