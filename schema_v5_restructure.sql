-- ============================================================
-- V5 RESTRUCTURE: "3 WORLDS" ARCHITECTURE (Catalog, Pricing, Sales)
-- ============================================================
-- This migration implements the strict separation of concerns requested.
-- Run this to reset/update the schema to the new standard.

BEGIN;

-- ============================================================
-- 1. UTILS & ENUMS
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Define statuses to ensure consistency
DO $$ BEGIN
    CREATE TYPE public.package_status AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.media_type AS ENUM ('IMAGE', 'VIDEO', 'FILE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.source_type AS ENUM ('LINK', 'STORAGE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.quote_status AS ENUM ('DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.booking_status AS ENUM ('PENDING', 'ON_HOLD', 'CONFIRMED', 'CANCELLED', 'COMPLETED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.payment_status AS ENUM ('PENDING', 'PARTIAL', 'PAID', 'REFUNDED', 'FAILED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.payment_method AS ENUM ('TRANSFER', 'CARD', 'CASH', 'OTHER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================
-- 2. CATALOG WORLD (Product Definition only)
-- ============================================================

-- 2.1 Geographic Basics
CREATE TABLE IF NOT EXISTS public.currencies (
    code CHAR(3) PRIMARY KEY, -- MXN, USD
    name VARCHAR(50) NOT NULL,
    symbol VARCHAR(5),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.destinations (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    country VARCHAR(100), -- Can be normalized further if needed, but text is fine for now
    state VARCHAR(100),
    city VARCHAR(100),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.2 Packages (The Core Product)
CREATE TABLE IF NOT EXISTS public.packages (
    id BIGSERIAL PRIMARY KEY,
    destination_id BIGINT REFERENCES public.destinations(id),
    
    slug VARCHAR(200) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    short_description VARCHAR(300),
    description TEXT,
    
    duration_days INT NOT NULL DEFAULT 1,
    duration_nights INT NOT NULL DEFAULT 0,
    
    status package_status DEFAULT 'DRAFT',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.3 Itinerary (Normalized Days)
CREATE TABLE IF NOT EXISTS public.package_days (
    id BIGSERIAL PRIMARY KEY,
    package_id BIGINT NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
    day_number INT NOT NULL, -- 1, 2, 3...
    title VARCHAR(200), -- "Arrival in Cancun"
    notes TEXT,
    
    CONSTRAINT uq_package_day UNIQUE (package_id, day_number)
);

CREATE TABLE IF NOT EXISTS public.package_day_items (
    id BIGSERIAL PRIMARY KEY,
    package_day_id BIGINT NOT NULL REFERENCES public.package_days(id) ON DELETE CASCADE,
    
    sort_order INT DEFAULT 0,
    time_label VARCHAR(50), -- "08:00 AM" or "Morning"
    title VARCHAR(200) NOT NULL, -- "Transfer to Hotel"
    description TEXT,
    location VARCHAR(200)
);

-- 2.4 Inclusions / Exclusions (Lists)
CREATE TABLE IF NOT EXISTS public.package_inclusions (
    id BIGSERIAL PRIMARY KEY,
    package_id BIGINT NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
    item_text TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.package_exclusions (
    id BIGSERIAL PRIMARY KEY,
    package_id BIGINT NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
    item_text TEXT NOT NULL
);

-- 2.5 Media (Centralized Assets)
-- First, a table for reusable assets (optional reuse, but good practice)
CREATE TABLE IF NOT EXISTS public.media_assets (
    id BIGSERIAL PRIMARY KEY,
    kind media_type NOT NULL, -- IMAGE, VIDEO, FILE
    source source_type NOT NULL DEFAULT 'LINK',
    
    url TEXT, -- If LINK
    storage_path TEXT, -- If STORAGE
    
    title VARCHAR(200),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Link table specifically for Packages
CREATE TABLE IF NOT EXISTS public.package_media (
    id BIGSERIAL PRIMARY KEY,
    package_id BIGINT NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
    media_id BIGINT NOT NULL REFERENCES public.media_assets(id) ON DELETE CASCADE,
    
    is_cover BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    
    CONSTRAINT uq_package_media UNIQUE (package_id, media_id)
);


-- ============================================================
-- 3. PRICING & AVAILABILITY WORLD (Business Rules)
-- ============================================================

-- 3.1 Seasons
CREATE TABLE IF NOT EXISTS public.seasons (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- "High Season 2026"
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.2 Occupancy Types (Configuration)
CREATE TABLE IF NOT EXISTS public.occupancy_types (
    code VARCHAR(20) PRIMARY KEY, -- SGL, DBL, TPL, QUAD, CHILD, INFANT
    name VARCHAR(50) NOT NULL, -- "Single", "Double", "Child (2-11)"
    description TEXT
);

-- 3.3 Prices (The Matrix)
CREATE TABLE IF NOT EXISTS public.package_prices (
    id BIGSERIAL PRIMARY KEY,
    package_id BIGINT NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
    season_id BIGINT REFERENCES public.seasons(id) ON DELETE CASCADE, -- If NULL, could be default price
    occupancy_code VARCHAR(20) NOT NULL REFERENCES public.occupancy_types(code),
    currency_code CHAR(3) NOT NULL REFERENCES public.currencies(code),
    
    price_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    cost_amount NUMERIC(12,2) DEFAULT 0, -- Optional internal cost
    
    notes VARCHAR(200),
    
    CONSTRAINT uq_package_price UNIQUE (package_id, season_id, occupancy_code, currency_code)
);

-- 3.4 Availability (For "Fixed Date" / Group Departures)
CREATE TABLE IF NOT EXISTS public.package_availability (
    id BIGSERIAL PRIMARY KEY,
    package_id BIGINT NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
    travel_date DATE NOT NULL,
    
    capacity INT DEFAULT 0,
    reserved INT DEFAULT 0, -- Increment this on confirmed booking
    
    status VARCHAR(20) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED', 'SOLD_OUT')),
    
    CONSTRAINT uq_package_date UNIQUE (package_id, travel_date)
);

-- ============================================================
-- 4. SALES WORLD (Transactions)
-- ============================================================

-- 4.1 Customers
CREATE TABLE IF NOT EXISTS public.customers (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(200) NOT NULL,
    email VARCHAR(200),
    phone VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4.2 Quotes (Snapshot Pricing)
CREATE SEQUENCE IF NOT EXISTS quote_number_seq;
CREATE TABLE IF NOT EXISTS public.quotes (
    id BIGSERIAL PRIMARY KEY,
    quote_number VARCHAR(50) UNIQUE DEFAULT ('QT-' || to_char(NOW(), 'YYYY') || '-' || nextval('quote_number_seq')::text),
    
    customer_id BIGINT REFERENCES public.customers(id),
    status quote_status DEFAULT 'DRAFT',
    
    currency_code CHAR(3) NOT NULL REFERENCES public.currencies(code),
    total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    
    valid_until DATE,
    notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.quote_items (
    id BIGSERIAL PRIMARY KEY,
    quote_id BIGINT NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
    
    package_id BIGINT REFERENCES public.packages(id), -- Reference for tracking
    
    -- Snapshot Data (Crucial for history)
    title VARCHAR(200) NOT NULL, 
    travel_date DATE,
    adults INT DEFAULT 0,
    children INT DEFAULT 0,
    
    unit_price NUMERIC(12,2) NOT NULL, -- Computed at moment of quote
    quantity INT DEFAULT 1,
    subtotal NUMERIC(12,2) NOT NULL
);

-- 4.3 Bookings (Orders)
CREATE SEQUENCE IF NOT EXISTS booking_number_seq;
CREATE TABLE IF NOT EXISTS public.bookings (
    id BIGSERIAL PRIMARY KEY,
    booking_code VARCHAR(50) UNIQUE DEFAULT ('BK-' || to_char(NOW(), 'YYYY') || '-' || nextval('booking_number_seq')::text),
    
    customer_id BIGINT NOT NULL REFERENCES public.customers(id),
    quote_id BIGINT REFERENCES public.quotes(id), -- Optional link back
    
    status booking_status DEFAULT 'PENDING',
    
    currency_code CHAR(3) NOT NULL REFERENCES public.currencies(code),
    total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    paid_amount NUMERIC(12,2) DEFAULT 0,
    
    notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.booking_items (
    id BIGSERIAL PRIMARY KEY,
    booking_id BIGINT NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    
    package_id BIGINT REFERENCES public.packages(id),
    
    -- Snapshot Data
    title VARCHAR(200) NOT NULL,
    travel_date DATE,
    adults INT DEFAULT 0,
    children INT DEFAULT 0,
    
    unit_price NUMERIC(12,2) NOT NULL,
    quantity INT DEFAULT 1,
    subtotal NUMERIC(12,2) NOT NULL
);

-- 4.4 Payments
CREATE TABLE IF NOT EXISTS public.payments (
    id BIGSERIAL PRIMARY KEY,
    booking_id BIGINT NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    
    method payment_method NOT NULL DEFAULT 'TRANSFER',
    status payment_status DEFAULT 'PENDING',
    
    amount NUMERIC(12,2) NOT NULL,
    currency_code CHAR(3) REFERENCES public.currencies(code),
    
    provider_reference VARCHAR(100), -- Stripe ID, Folio
    processed_at TIMESTAMPTZ,
    
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- 6. CONTENT WORLD (CMS)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.banners (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    image_url TEXT NOT NULL,
    link_url TEXT,
    position VARCHAR(50) DEFAULT 'HOME_HERO', -- HERO, PROMO, FOOTER
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_banners_modtime BEFORE UPDATE ON public.banners FOR EACH ROW EXECUTE PROCEDURE set_updated_at_column();

CREATE TABLE IF NOT EXISTS public.testimonials (
    id BIGSERIAL PRIMARY KEY,
    author_name VARCHAR(200) NOT NULL,
    author_role VARCHAR(100), -- e.g. "Viajero frecuente"
    content TEXT NOT NULL,
    image_url TEXT,
    rating INT DEFAULT 5,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_testimonials_modtime BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE PROCEDURE set_updated_at_column();


-- ============================================================
-- 5. INITIAL DATA SEEDING
-- ============================================================

-- Currencies
INSERT INTO public.currencies (code, name, symbol) VALUES 
('MXN', 'Peso Mexicano', '$'),
('USD', 'Dólar Estadounidense', '$'),
('EUR', 'Euro', '€')
ON CONFLICT (code) DO NOTHING;

-- Occupancy Types
INSERT INTO public.occupancy_types (code, name, description) VALUES
('SGL', 'Sencilla', '1 Adulto en habitación'),
('DBL', 'Doble', '2 Adultos en habitación'),
('TPL', 'Triple', '3 Adultos en habitación'),
('CPL', 'Cuádruple', '4 Adultos en habitación'),
('CHILD', 'Menor', 'Niño (2-11 años)'),
('INFANT', 'Infante', 'Bebé (0-2 años)')
ON CONFLICT (code) DO NOTHING;

-- Sample Season
INSERT INTO public.seasons (name, start_date, end_date) VALUES
('Temporada Regular 2026', '2026-02-01', '2026-06-30'),
('Verano 2026', '2026-07-01', '2026-08-31')
ON CONFLICT DO NOTHING;

-- Automated Updated_At Triggers
-- Automated Updated_At Triggers
CREATE OR REPLACE FUNCTION set_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_destinations_modtime ON public.destinations;
CREATE TRIGGER update_destinations_modtime BEFORE UPDATE ON public.destinations FOR EACH ROW EXECUTE PROCEDURE set_updated_at_column();

DROP TRIGGER IF EXISTS update_packages_modtime ON public.packages;
CREATE TRIGGER update_packages_modtime BEFORE UPDATE ON public.packages FOR EACH ROW EXECUTE PROCEDURE set_updated_at_column();

DROP TRIGGER IF EXISTS update_customers_modtime ON public.customers;
CREATE TRIGGER update_customers_modtime BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE PROCEDURE set_updated_at_column();

DROP TRIGGER IF EXISTS update_quotes_modtime ON public.quotes;
CREATE TRIGGER update_quotes_modtime BEFORE UPDATE ON public.quotes FOR EACH ROW EXECUTE PROCEDURE set_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_modtime ON public.bookings;
CREATE TRIGGER update_bookings_modtime BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE PROCEDURE set_updated_at_column();

DROP TRIGGER IF EXISTS update_banners_modtime ON public.banners;
CREATE TRIGGER update_banners_modtime BEFORE UPDATE ON public.banners FOR EACH ROW EXECUTE PROCEDURE set_updated_at_column();

DROP TRIGGER IF EXISTS update_testimonials_modtime ON public.testimonials;
CREATE TRIGGER update_testimonials_modtime BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE PROCEDURE set_updated_at_column();

COMMIT;
