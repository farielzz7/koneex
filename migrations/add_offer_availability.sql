-- Agregar campos de oferta y disponibilidad a packages
ALTER TABLE public.packages 
ADD COLUMN IF NOT EXISTS is_offer BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS offer_discount DECIMAL(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS offer_valid_until DATE,
ADD COLUMN IF NOT EXISTS available_days TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS min_booking_days INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS max_booking_days INTEGER DEFAULT 365;

COMMENT ON COLUMN public.packages.is_offer IS 'Si el paquete está en oferta especial';
COMMENT ON COLUMN public.packages.offer_discount IS 'Porcentaje de descuento si es oferta (0-100)';
COMMENT ON COLUMN public.packages.offer_valid_until IS 'Fecha límite de la oferta';
COMMENT ON COLUMN public.packages.available_days IS 'Días de la semana disponibles (SUN, MON, TUE, WED, THU, FRI, SAT)';
COMMENT ON COLUMN public.packages.min_booking_days IS 'Días mínimos de anticipación para reservar';
COMMENT ON COLUMN public.packages.max_booking_days IS 'Días máximos de anticipación para reservar';
