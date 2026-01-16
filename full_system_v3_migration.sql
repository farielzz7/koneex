-- ============================================================
-- POSTGRESQL: RESET TOTAL + ESQUEMA SINGLE-TENANT (SIN AGENCIAS)
-- Incluye:
--  - Eliminación de tabla 'agencies' (Modelo de Agencia Única)
--  - IDs SECUENCIALES (BIGSERIAL)
--  - FOLIO AUTOGENERADO (orders.order_number)
--  - Estructura optimizada y "legalizada" (datos fiscales en settings)
-- ============================================================

BEGIN;

-- ============================================================
-- 0) BORRADO TOTAL DEL ESQUEMA PUBLIC
-- ============================================================
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
    EXECUTE format('DROP TABLE IF EXISTS public.%I CASCADE;', r.tablename);
  END LOOP;
  FOR r IN (
    SELECT t.typname
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'public' AND t.typtype = 'e'
  ) LOOP
    EXECUTE format('DROP TYPE IF EXISTS public.%I CASCADE;', r.typname);
  END LOOP;
END $$;

-- ============================================================
-- 1) EXTENSIONES
-- ============================================================
CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- 2) ENUM TYPES
-- ============================================================
-- Tipos generales
CREATE TYPE tag_type AS ENUM ('CATEGORY','THEME','AUDIENCE','BADGE','AMENITY','OTHER');
CREATE TYPE pricing_model AS ENUM ('PUBLIC_ONLY','NET_WITH_COMMISSION','MARGIN_MARKUP');
CREATE TYPE user_role AS ENUM ('ADMIN','AGENT','CUSTOMER','SUPPORT'); -- Eliminado AGENCY_ADMIN
CREATE TYPE user_status AS ENUM ('ACTIVE','BLOCKED');

-- Proveedores
CREATE TYPE provider_type AS ENUM ('WHOLESALER','OPERATOR','HOTEL','AIRLINE','OTHER');
CREATE TYPE integration_mode AS ENUM ('MANUAL','CSV','API');
CREATE TYPE provider_status AS ENUM ('ACTIVE','INACTIVE');
CREATE TYPE sync_status AS ENUM ('RUNNING','SUCCESS','FAILED','PARTIAL');

-- Paquetes
CREATE TYPE package_type AS ENUM ('CIRCUIT','HOTEL_PACKAGE','EXPERIENCE','TRANSFER','DYNAMIC');
CREATE TYPE package_status AS ENUM ('DRAFT','PUBLISHED','PAUSED');
CREATE TYPE confirmation_mode AS ENUM ('INSTANT','ON_REQUEST');
CREATE TYPE media_type AS ENUM ('IMAGE','VIDEO');
CREATE TYPE component_type AS ENUM ('HOTEL','FLIGHT','TRANSFER','TOUR','INSURANCE','EXTRA');
CREATE TYPE occupancy_type AS ENUM ('SGL','DBL','TPL','CPL');
CREATE TYPE pax_type AS ENUM ('ADULT','CHILD','INFANT');
CREATE TYPE departure_status AS ENUM ('OPEN','CLOSED','SOLD_OUT');

-- Ordenes y Finanzas
CREATE TYPE discount_type AS ENUM ('PERCENT','AMOUNT');
CREATE TYPE order_status AS ENUM ('DRAFT','PENDING_PAYMENT','CONFIRMED','CANCELLED','COMPLETED','REFUNDED');
CREATE TYPE order_item_type AS ENUM ('PACKAGE','EXTRA','INSURANCE','TRANSFER','TOUR');
CREATE TYPE payment_provider AS ENUM ('STRIPE','MERCADOPAGO','PAYPAL','BANK_TRANSFER','CASH','OTHER');
CREATE TYPE payment_status AS ENUM ('PENDING','PAID','FAILED','REFUNDED');
CREATE TYPE voucher_status AS ENUM ('PENDING','ISSUED','CANCELLED');

-- Personas
CREATE TYPE gender_type AS ENUM ('M','F','X');
CREATE TYPE document_type AS ENUM ('INE','PASSPORT','OTHER');

-- ============================================================
-- 3) FUNCIONES
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.updated_at IS NOT NULL THEN
    NEW.updated_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP SEQUENCE IF EXISTS order_number_seq CASCADE;
CREATE SEQUENCE order_number_seq START 1 INCREMENT 1 MINVALUE 1;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  seq_val BIGINT;
  year_txt TEXT;
BEGIN
  seq_val := nextval('order_number_seq');
  year_txt := to_char(now(), 'YYYY');
  RETURN 'KX-' || year_txt || '-' || lpad(seq_val::text, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 4) TABLAS DE CONFIGURACIÓN Y CATÁLOGOS
-- ============================================================

-- Configuración de la Empresa (Single Tenancy)
CREATE TABLE company_settings (
  id BIGSERIAL PRIMARY KEY,
  company_name VARCHAR(180) NOT NULL,
  legal_name VARCHAR(220),
  rfc VARCHAR(20),
  email CITEXT,
  phone VARCHAR(30),
  website VARCHAR(220),
  address TEXT,
  logo_url TEXT,
  
  -- Configuraciones globales
  default_currency CHAR(3) DEFAULT 'MXN',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE currencies (
  code CHAR(3) PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  symbol VARCHAR(10),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE countries (
  id BIGSERIAL PRIMARY KEY,
  iso2 CHAR(2) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE cities (
  id BIGSERIAL PRIMARY KEY,
  country_id BIGINT NOT NULL REFERENCES countries(id),
  name VARCHAR(120) NOT NULL,
  state VARCHAR(120),
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE tags (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  type tag_type NOT NULL DEFAULT 'OTHER',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 5) USUARIOS (SIN AGENCY_ID)
-- ============================================================

CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  -- Eliminado agency_id
  email CITEXT NOT NULL UNIQUE,
  password VARCHAR(255),
  name VARCHAR(180) NOT NULL,
  phone VARCHAR(30),
  
  role user_role NOT NULL DEFAULT 'CUSTOMER',
  status user_status NOT NULL DEFAULT 'ACTIVE',
  
  registered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  email_verified_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

CREATE TABLE customers (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  -- Perfil extendido del cliente
  first_name VARCHAR(120),
  last_name VARCHAR(120),
  birth_date DATE,
  passport_number VARCHAR(50),
  passport_expiry DATE,
  preferences JSONB,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- ============================================================
-- 6) PROVEEDORES
-- ============================================================

CREATE TABLE providers (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  type provider_type NOT NULL DEFAULT 'WHOLESALER',
  
  contact_email CITEXT,
  contact_phone VARCHAR(30),
  website VARCHAR(220),
  
  integration_mode integration_mode NOT NULL DEFAULT 'MANUAL',
  base_url VARCHAR(255),
  
  status provider_status NOT NULL DEFAULT 'ACTIVE',
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 7) DESTINOS Y PAQUETES
-- ============================================================

CREATE TABLE destinations (
  id BIGSERIAL PRIMARY KEY,
  city_id BIGINT REFERENCES cities(id),
  name VARCHAR(180) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  description TEXT,
  hero_image_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE packages (
  id BIGSERIAL PRIMARY KEY,
  provider_id BIGINT REFERENCES providers(id),
  
  slug VARCHAR(220) NOT NULL UNIQUE,
  title VARCHAR(220) NOT NULL,
  subtitle VARCHAR(220),
  
  product_type package_type NOT NULL DEFAULT 'HOTEL_PACKAGE',
  
  short_description VARCHAR(500),
  description TEXT,
  
  duration_days INT,
  duration_nights INT,
  
  currency_code CHAR(3) NOT NULL REFERENCES currencies(code),
  from_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  
  status package_status NOT NULL DEFAULT 'DRAFT',
  
  provider_product_code VARCHAR(120),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE package_destinations (
  package_id BIGINT NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  destination_id BIGINT NOT NULL REFERENCES destinations(id) ON DELETE RESTRICT,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (package_id, destination_id)
);

CREATE TABLE package_media (
  id BIGSERIAL PRIMARY KEY,
  package_id BIGINT NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  media_type media_type NOT NULL,
  url TEXT NOT NULL,
  is_cover BOOLEAN NOT NULL DEFAULT FALSE,
  position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE package_itinerary_days (
  id BIGSERIAL PRIMARY KEY,
  package_id BIGINT NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  day_number INT NOT NULL,
  title VARCHAR(220),
  description TEXT,
  unique (package_id, day_number)
);

-- ============================================================
-- 8) ORDENES (VENTAS)
-- ============================================================

CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE DEFAULT generate_order_number(),
  
  user_id BIGINT NOT NULL REFERENCES users(id), -- Cliente que compra
  -- Eliminado agency_id
  
  status order_status NOT NULL DEFAULT 'DRAFT',
  
  currency_code CHAR(3) NOT NULL REFERENCES currencies(code),
  total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  
  notes TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  package_id BIGINT REFERENCES packages(id),
  
  title VARCHAR(220) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  
  start_date DATE,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 9) TRIGGERS
-- ============================================================
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN
    SELECT table_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND column_name = 'updated_at'
    GROUP BY table_name
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_%I_updated_at ON public.%I;', t, t);
    EXECUTE format(
      'CREATE TRIGGER trg_%I_updated_at BEFORE UPDATE ON public.%I
       FOR EACH ROW EXECUTE FUNCTION set_updated_at();',
      t, t
    );
  END LOOP;
END $$;

-- ============================================================
-- 10) SEEDS BÁSICOS
-- ============================================================

INSERT INTO currencies (code, name, symbol) VALUES
  ('MXN', 'Peso Mexicano', '$'),
  ('USD', 'Dólar Americano', '$'),
  ('EUR', 'Euro', '€')
ON CONFLICT DO NOTHING;

INSERT INTO company_settings (company_name, email, default_currency) VALUES
  ('Koneex Travel', 'admin@koneex.com', 'MXN');

INSERT INTO users (email, name, role, status, password) VALUES 
  ('admin@koneex.com', 'Administrador Global', 'ADMIN', 'ACTIVE', '$2a$10$X7.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1' /* Hash de prueba o crear desde app */)
ON CONFLICT (email) DO UPDATE SET role = 'ADMIN';

COMMIT;
