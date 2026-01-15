-- ============================================================
-- POSTGRESQL: RESET TOTAL + ESQUEMA COMPLETO CORREGIDO
-- Incluye:
--  - IDs SECUENCIALES (BIGSERIAL) en todas las tablas
--  - FOLIO/CLAVE DE COMPRA AUTOGENERADA (orders.order_number)
--  - Estructura completa MegaTravel-friendly
--  - Índices clave
--  - Trigger para updated_at en todas las tablas con esa columna
-- ============================================================

BEGIN;

-- ============================================================
-- 0) BORRADO TOTAL DEL ESQUEMA PUBLIC (TODO)
-- ============================================================
DO $$
DECLARE
  r RECORD;
BEGIN
  -- Drop all tables
  FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
    EXECUTE format('DROP TABLE IF EXISTS public.%I CASCADE;', r.tablename);
  END LOOP;

  -- Drop all enum types created in public
  FOR r IN (
    SELECT t.typname
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'public' AND t.typtype = 'e'
  ) LOOP
    EXECUTE format('DROP TYPE IF EXISTS public.%I CASCADE;', r.typname);
  END LOOP;

  -- Drop sequences (optional, usually dropped by CASCADE, but kept safe)
  FOR r IN (
    SELECT sequence_name
    FROM information_schema.sequences
    WHERE sequence_schema = 'public'
  ) LOOP
    EXECUTE format('DROP SEQUENCE IF EXISTS public.%I CASCADE;', r.sequence_name);
  END LOOP;
END $$;

-- ============================================================
-- 1) EXTENSIONES (si tu entorno lo permite)
-- ============================================================
CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- 2) ENUM TYPES
-- ============================================================
DO $$ BEGIN CREATE TYPE tag_type AS ENUM ('CATEGORY','THEME','AUDIENCE','BADGE','AMENITY','OTHER'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE agency_status AS ENUM ('ACTIVE','SUSPENDED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE pricing_model AS ENUM ('PUBLIC_ONLY','NET_WITH_COMMISSION','MARGIN_MARKUP'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE user_role AS ENUM ('ADMIN','AGENCY_ADMIN','AGENT','CUSTOMER','SUPPORT'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE user_status AS ENUM ('ACTIVE','BLOCKED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE provider_type AS ENUM ('WHOLESALER','OPERATOR','HOTEL','AIRLINE','OTHER'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE integration_mode AS ENUM ('MANUAL','CSV','API'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE provider_status AS ENUM ('ACTIVE','INACTIVE'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE sync_status AS ENUM ('RUNNING','SUCCESS','FAILED','PARTIAL'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE package_type AS ENUM ('CIRCUIT','HOTEL_PACKAGE','EXPERIENCE','TRANSFER','DYNAMIC'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE package_status AS ENUM ('DRAFT','PUBLISHED','PAUSED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE confirmation_mode AS ENUM ('INSTANT','ON_REQUEST'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE media_type AS ENUM ('IMAGE','VIDEO'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE component_type AS ENUM ('HOTEL','FLIGHT','TRANSFER','TOUR','INSURANCE','EXTRA'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE occupancy_type AS ENUM ('SGL','DBL','TPL','CPL'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE pax_type AS ENUM ('ADULT','CHILD','INFANT'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE departure_status AS ENUM ('OPEN','CLOSED','SOLD_OUT'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE discount_type AS ENUM ('PERCENT','AMOUNT'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE order_status AS ENUM ('DRAFT','PENDING_PAYMENT','CONFIRMED','CANCELLED','COMPLETED','REFUNDED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE order_item_type AS ENUM ('PACKAGE','EXTRA','INSURANCE','TRANSFER','TOUR'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE gender_type AS ENUM ('M','F','X'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE document_type AS ENUM ('INE','PASSPORT','OTHER'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE payment_provider AS ENUM ('STRIPE','MERCADOPAGO','PAYPAL','BANK_TRANSFER','CASH','OTHER'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE payment_status AS ENUM ('PENDING','PAID','FAILED','REFUNDED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE voucher_status AS ENUM ('PENDING','ISSUED','CANCELLED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- 3) FUNCIONES: updated_at + order_number
-- ============================================================

-- Trigger function to auto-update updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.updated_at IS NOT NULL THEN
    NEW.updated_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Sequence for order_number folio
CREATE SEQUENCE order_number_seq START 1 INCREMENT 1 MINVALUE 1;

-- Generates folio like: KX-2026-000001
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
-- 4) TABLAS CORE / CATALOGOS
-- ============================================================

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

CREATE INDEX idx_cities_country ON cities(country_id);

CREATE TABLE tags (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  type tag_type NOT NULL DEFAULT 'OTHER',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_tags_type ON tags(type);

-- ============================================================
-- 5) AGENCIAS + USERS
-- ============================================================

CREATE TABLE agencies (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  legal_name VARCHAR(220),
  rfc VARCHAR(20),
  email CITEXT,
  phone VARCHAR(30),
  website VARCHAR(220),

  address_line1 VARCHAR(220),
  address_line2 VARCHAR(220),
  city_id BIGINT REFERENCES cities(id),
  postal_code VARCHAR(15),

  pricing_model pricing_model NOT NULL DEFAULT 'PUBLIC_ONLY',
  default_commission_pct NUMERIC(5,2) NOT NULL DEFAULT 0,
  default_markup_amount NUMERIC(12,2) NOT NULL DEFAULT 0,

  status agency_status NOT NULL DEFAULT 'ACTIVE',

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_agencies_status ON agencies(status);
CREATE INDEX idx_agencies_city ON agencies(city_id);

CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  agency_id BIGINT REFERENCES agencies(id),

  email CITEXT NOT NULL UNIQUE,
  password VARCHAR(255),
  name VARCHAR(180) NOT NULL,
  phone VARCHAR(30),

  role user_role NOT NULL DEFAULT 'CUSTOMER',

  registered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  email_verified_at TIMESTAMPTZ,

  status user_status NOT NULL DEFAULT 'ACTIVE',

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_agency ON users(agency_id);
CREATE INDEX idx_users_status ON users(status);

-- ============================================================
-- 6) PROVEEDORES + SYNC
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
  api_key_hint VARCHAR(120),

  status provider_status NOT NULL DEFAULT 'ACTIVE',

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_providers_type ON providers(type);
CREATE INDEX idx_providers_status ON providers(status);

CREATE TABLE provider_sync_logs (
  id BIGSERIAL PRIMARY KEY,
  provider_id BIGINT NOT NULL REFERENCES providers(id),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  status sync_status NOT NULL DEFAULT 'RUNNING',
  items_processed INT NOT NULL DEFAULT 0,
  items_created INT NOT NULL DEFAULT 0,
  items_updated INT NOT NULL DEFAULT 0,
  items_failed INT NOT NULL DEFAULT 0,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_sync_provider ON provider_sync_logs(provider_id);
CREATE INDEX idx_sync_status ON provider_sync_logs(status);

-- ============================================================
-- 7) DESTINOS + PAQUETES
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

CREATE INDEX idx_destinations_featured ON destinations(is_featured);
CREATE INDEX idx_destinations_city ON destinations(city_id);

CREATE TABLE packages (
  id BIGSERIAL PRIMARY KEY,
  provider_id BIGINT REFERENCES providers(id),

  slug VARCHAR(220) NOT NULL UNIQUE,
  title VARCHAR(220) NOT NULL,
  subtitle VARCHAR(220),

  product_type package_type NOT NULL DEFAULT 'HOTEL_PACKAGE',

  short_description VARCHAR(500),
  description TEXT,

  highlights JSONB,
  includes JSONB,
  excludes JSONB,

  duration_days INT,
  duration_nights INT,

  currency_code CHAR(3) NOT NULL REFERENCES currencies(code),
  from_price NUMERIC(12,2) NOT NULL DEFAULT 0,

  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,

  status package_status NOT NULL DEFAULT 'DRAFT',
  confirmation_mode confirmation_mode NOT NULL DEFAULT 'ON_REQUEST',
  max_people INT,
  min_age INT,

  provider_product_code VARCHAR(120),
  provider_last_seen_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_packages_status ON packages(status);
CREATE INDEX idx_packages_type ON packages(product_type);
CREATE INDEX idx_packages_provider ON packages(provider_id);
CREATE INDEX idx_packages_currency ON packages(currency_code);
CREATE INDEX idx_packages_dates ON packages(starts_at, ends_at);
CREATE INDEX idx_packages_provider_code ON packages(provider_product_code);

CREATE TABLE package_destinations (
  package_id BIGINT NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  destination_id BIGINT NOT NULL REFERENCES destinations(id) ON DELETE RESTRICT,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (package_id, destination_id)
);

CREATE INDEX idx_pkg_dest_primary ON package_destinations(package_id, is_primary);

CREATE TABLE package_tags (
  package_id BIGINT NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE RESTRICT,
  PRIMARY KEY (package_id, tag_id)
);

CREATE INDEX idx_package_tags_tag ON package_tags(tag_id);

-- ============================================================
-- 8) MULTIMEDIA (N IMAGENES + N VIDEOS)
-- ============================================================

CREATE TABLE package_media (
  id BIGSERIAL PRIMARY KEY,
  package_id BIGINT NOT NULL REFERENCES packages(id) ON DELETE CASCADE,

  media_type media_type NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,

  caption VARCHAR(220),
  alt_text VARCHAR(220),

  mime_type VARCHAR(100),
  size_bytes BIGINT,
  width INT,
  height INT,
  duration_seconds INT,

  is_cover BOOLEAN NOT NULL DEFAULT FALSE,
  position INT NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_media_pkg ON package_media(package_id);
CREATE INDEX idx_media_type ON package_media(media_type);
CREATE INDEX idx_media_cover ON package_media(package_id, is_cover);
CREATE INDEX idx_media_position ON package_media(package_id, position);

-- ============================================================
-- 9) ITINERARIO
-- ============================================================

CREATE TABLE package_itinerary_days (
  id BIGSERIAL PRIMARY KEY,
  package_id BIGINT NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  day_number INT NOT NULL,
  title VARCHAR(220),
  description TEXT,

  meals_included JSONB,
  accommodation_text VARCHAR(220),

  included_activities JSONB,
  optional_activities JSONB,

  notes TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (package_id, day_number)
);

CREATE INDEX idx_itinerary_pkg ON package_itinerary_days(package_id);

-- ============================================================
-- 10) COMPONENTES
-- ============================================================

CREATE TABLE package_components (
  id BIGSERIAL PRIMARY KEY,
  package_id BIGINT NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  component_type component_type NOT NULL,

  title VARCHAR(220) NOT NULL,
  description TEXT,
  details JSONB,

  is_included BOOLEAN NOT NULL DEFAULT TRUE,
  position INT NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_components_pkg ON package_components(package_id);
CREATE INDEX idx_components_type ON package_components(component_type);
CREATE INDEX idx_components_pos ON package_components(package_id, position);

-- ============================================================
-- 11) TARIFAS
-- ============================================================

CREATE TABLE package_rate_plans (
  id BIGSERIAL PRIMARY KEY,
  package_id BIGINT NOT NULL REFERENCES packages(id) ON DELETE CASCADE,

  name VARCHAR(180) NOT NULL,
  currency_code CHAR(3) NOT NULL REFERENCES currencies(code),

  date_from DATE,
  date_to DATE,

  min_nights INT,
  max_nights INT,

  taxes_included BOOLEAN NOT NULL DEFAULT TRUE,
  notes TEXT,

  is_active BOOLEAN NOT NULL DEFAULT TRUE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_rate_plan_pkg ON package_rate_plans(package_id);
CREATE INDEX idx_rate_plan_active ON package_rate_plans(is_active);
CREATE INDEX idx_rate_plan_dates ON package_rate_plans(date_from, date_to);

CREATE TABLE package_rate_items (
  id BIGSERIAL PRIMARY KEY,
  rate_plan_id BIGINT NOT NULL REFERENCES package_rate_plans(id) ON DELETE CASCADE,

  occupancy occupancy_type,
  pax_type pax_type,

  min_age INT,
  max_age INT,

  price NUMERIC(12,2) NOT NULL DEFAULT 0,
  cost NUMERIC(12,2),
  tax_amount NUMERIC(12,2),

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_rate_items_plan ON package_rate_items(rate_plan_id);
CREATE INDEX idx_rate_items_occ ON package_rate_items(occupancy);
CREATE INDEX idx_rate_items_pax ON package_rate_items(pax_type);

-- ============================================================
-- 12) SALIDAS
-- ============================================================

CREATE TABLE package_departures (
  id BIGSERIAL PRIMARY KEY,
  package_id BIGINT NOT NULL REFERENCES packages(id) ON DELETE CASCADE,

  departure_date DATE NOT NULL,
  return_date DATE,

  capacity INT,
  available_seats INT,

  status departure_status NOT NULL DEFAULT 'OPEN',
  notes VARCHAR(255),

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (package_id, departure_date)
);

CREATE INDEX idx_departure_pkg ON package_departures(package_id);
CREATE INDEX idx_departure_status ON package_departures(status);
CREATE INDEX idx_departure_date ON package_departures(departure_date);

-- ============================================================
-- 13) PROMOCIONES
-- ============================================================

CREATE TABLE promotions (
  id BIGSERIAL PRIMARY KEY,

  code VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255),

  discount_type discount_type NOT NULL DEFAULT 'PERCENT',
  discount_value NUMERIC(12,2) NOT NULL DEFAULT 0,

  currency_code CHAR(3) REFERENCES currencies(code),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,

  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,

  max_uses INT,
  uses_count INT NOT NULL DEFAULT 0,

  min_order_amount NUMERIC(12,2),
  restrict_to_agency BOOLEAN NOT NULL DEFAULT FALSE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_promotions_active ON promotions(is_active);
CREATE INDEX idx_promotions_dates ON promotions(starts_at, ends_at);
CREATE INDEX idx_promotions_code_active ON promotions(code, is_active);

CREATE TABLE promotion_packages (
  promotion_id BIGINT NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
  package_id BIGINT NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  PRIMARY KEY (promotion_id, package_id)
);

CREATE TABLE promotion_agencies (
  promotion_id BIGINT NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
  agency_id BIGINT NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  PRIMARY KEY (promotion_id, agency_id)
);

-- ============================================================
-- 14) ORDENES / ITEMS / VIAJEROS / PAGOS / VOUCHERS
-- ============================================================

CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,

  -- CLAVE / FOLIO COMERCIAL
  order_number TEXT NOT NULL UNIQUE DEFAULT generate_order_number(),

  customer_id BIGINT NOT NULL REFERENCES users(id),
  agency_id BIGINT REFERENCES agencies(id),

  status order_status NOT NULL DEFAULT 'DRAFT',

  currency_code CHAR(3) NOT NULL REFERENCES currencies(code),
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount_total NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax_total NUMERIC(12,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,

  promotion_code VARCHAR(50),

  commission_pct NUMERIC(5,2),
  commission_amount NUMERIC(12,2),
  net_total NUMERIC(12,2),

  paid_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,

  notes TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_agency ON orders(agency_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_customer_status ON orders(customer_id, status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

CREATE TABLE order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  package_id BIGINT REFERENCES packages(id),

  title VARCHAR(220) NOT NULL,
  item_type order_item_type NOT NULL DEFAULT 'PACKAGE',

  departure_id BIGINT REFERENCES package_departures(id),

  start_date DATE,
  end_date DATE,
  nights INT,

  pax_adults INT NOT NULL DEFAULT 1,
  pax_children INT NOT NULL DEFAULT 0,
  pax_infants INT NOT NULL DEFAULT 0,

  unit_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  quantity INT NOT NULL DEFAULT 1,
  total_price NUMERIC(12,2) NOT NULL DEFAULT 0,

  details JSONB,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_package ON order_items(package_id);
CREATE INDEX idx_order_items_departure ON order_items(departure_id);

CREATE TABLE order_travelers (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  order_item_id BIGINT REFERENCES order_items(id) ON DELETE SET NULL,

  first_name VARCHAR(120) NOT NULL,
  last_name VARCHAR(120) NOT NULL,
  birth_date DATE,
  gender gender_type,
  nationality VARCHAR(80),

  document_type document_type,
  document_number VARCHAR(80),

  email CITEXT,
  phone VARCHAR(30),

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_travelers_order ON order_travelers(order_id);
CREATE INDEX idx_travelers_item ON order_travelers(order_item_id);

CREATE TABLE payments (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,

  provider payment_provider NOT NULL DEFAULT 'OTHER',
  status payment_status NOT NULL DEFAULT 'PENDING',

  amount NUMERIC(12,2) NOT NULL,
  currency_code CHAR(3) NOT NULL REFERENCES currencies(code),

  transaction_id VARCHAR(120),
  paid_at TIMESTAMPTZ,

  payload JSONB,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(status);

CREATE TABLE vouchers (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  order_item_id BIGINT REFERENCES order_items(id) ON DELETE SET NULL,

  voucher_number VARCHAR(60),
  provider_reference VARCHAR(120),

  status voucher_status NOT NULL DEFAULT 'PENDING',

  file_url TEXT,
  issued_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_vouchers_order ON vouchers(order_id);
CREATE INDEX idx_vouchers_status ON vouchers(status);

-- ============================================================
-- 15) FAQ + REVIEWS
-- ============================================================

CREATE TABLE package_faqs (
  id BIGSERIAL PRIMARY KEY,
  package_id BIGINT NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  question VARCHAR(255) NOT NULL,
  answer TEXT NOT NULL,
  position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_faq_pkg ON package_faqs(package_id);
CREATE INDEX idx_faq_pos ON package_faqs(package_id, position);

CREATE TABLE package_reviews (
  id BIGSERIAL PRIMARY KEY,
  package_id BIGINT NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title VARCHAR(120),
  comment TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reviews_pkg ON package_reviews(package_id);
CREATE INDEX idx_reviews_rating ON package_reviews(rating);

-- ============================================================
-- 16) TRIGGERS updated_at (aplicar a todas las tablas que lo tengan)
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
-- 17) SEEDS
-- ============================================================

INSERT INTO currencies (code, name, symbol)
VALUES
  ('MXN', 'Peso Mexicano', '$'),
  ('USD', 'Dólar Americano', '$'),
  ('EUR', 'Euro', '€')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  symbol = EXCLUDED.symbol,
  updated_at = now();

INSERT INTO users (email, name, role, registered_at, status)
VALUES ('admin@koneex.com', 'Administrador', 'ADMIN', now(), 'ACTIVE')
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  status = EXCLUDED.status,
  updated_at = now();

COMMIT;
