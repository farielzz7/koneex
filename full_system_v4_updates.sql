-- ============================================================
-- V4 UPDATES: SERVICES, SEASONS, PRICING, & QUOTES
-- Implementa el modelo "normalizado" solicitado.
-- ============================================================

BEGIN;

-- 1. SERVICES (Componentes sueltos: Hotel, Tour, Transporte)
CREATE TABLE IF NOT EXISTS public.services (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('HOTEL', 'TOUR', 'TRANSPORT', 'INSURANCE', 'OTHER')),
    provider_id BIGINT REFERENCES public.providers(id),
    description TEXT,
    
    -- Costo base referencial (neto)
    cost_amount NUMERIC(12,2) DEFAULT 0,
    currency_code CHAR(3) REFERENCES public.currencies(code) DEFAULT 'USD',
    
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SEASONS (Temporadas para precios)
CREATE TABLE IF NOT EXISTS public.seasons (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- Ej: 'Verano 2026', 'Baja Septiembre'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PACKAGE PRICES (Precios por Temporada y Ocupación)
-- Relaciona: Paquete + Temporada + Moneda + Clave Ocupación
CREATE TABLE IF NOT EXISTS public.package_prices (
    id BIGSERIAL PRIMARY KEY,
    package_id BIGINT NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
    season_id BIGINT REFERENCES public.seasons(id) ON DELETE SET NULL, -- Si es NULL, es precio base/general
    
    occupancy_type VARCHAR(10) NOT NULL CHECK (occupancy_type IN ('SGL', 'DBL', 'TPL', 'CPL', 'CHILD', 'INFANT')),
    currency_code CHAR(3) NOT NULL REFERENCES public.currencies(code),
    
    cost_amount NUMERIC(12,2) DEFAULT 0, -- Costo Neto
    price_amount NUMERIC(12,2) NOT NULL DEFAULT 0, -- Precio Venta (Publico)
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(package_id, season_id, occupancy_type)
);

-- 4. QUOTES (Cotizaciones)
CREATE SEQUENCE IF NOT EXISTS quote_number_seq START 1;

CREATE OR REPLACE FUNCTION generate_quote_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'QT-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('quote_number_seq')::text, 6, '0');
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS public.quotes (
    id BIGSERIAL PRIMARY KEY,
    quote_number TEXT UNIQUE DEFAULT generate_quote_number(),
    
    -- Puede ser un usuario registrado o un prospecto (lead)
    user_id BIGINT REFERENCES public.users(id),
    lead_name VARCHAR(200),
    lead_email VARCHAR(200),
    lead_phone VARCHAR(50),
    
    status VARCHAR(20) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED')),
    
    total_amount NUMERIC(12,2) DEFAULT 0,
    currency_code CHAR(3) REFERENCES public.currencies(code) DEFAULT 'USD',
    
    valid_until DATE,
    notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. QUOTE ITEMS (Detalle de la cotización)
-- Puede incluir Packages completos O Services sueltos
CREATE TABLE IF NOT EXISTS public.quote_items (
    id BIGSERIAL PRIMARY KEY,
    quote_id BIGINT NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
    
    type VARCHAR(20) NOT NULL CHECK (type IN ('PACKAGE', 'SERVICE')),
    
    -- Referencias opcionales (uno de los dos debe estar lleno idealmente)
    package_id BIGINT REFERENCES public.packages(id),
    service_id BIGINT REFERENCES public.services(id),
    
    title VARCHAR(255) NOT NULL, -- Nombre del item en el momento
    description TEXT,
    
    quantity INT DEFAULT 1,
    unit_price NUMERIC(12,2) DEFAULT 0,
    total_price NUMERIC(12,2) DEFAULT 0,
    
    travel_date DATE,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- TRIGGERS FOR UPDATED_AT
CREATE TRIGGER trg_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_package_prices_updated_at BEFORE UPDATE ON public.package_prices FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_quotes_updated_at BEFORE UPDATE ON public.quotes FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- SEED BÁSICO DE TEMPORADAS
INSERT INTO public.seasons (name, start_date, end_date) VALUES 
('Temporada Baja 2026', '2026-01-10', '2026-03-20'),
('Semana Santa 2026', '2026-03-21', '2026-04-05'),
('Verano 2026', '2026-07-01', '2026-08-31')
ON CONFLICT DO NOTHING;

COMMIT;
