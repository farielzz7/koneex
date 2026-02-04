-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabla Airlines
CREATE TABLE IF NOT EXISTS airlines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    iata_code TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar algunas aerolíneas de ejemplo
INSERT INTO airlines (name, iata_code) VALUES
('Aeroméxico', 'AM'),
('Volaris', 'Y4'),
('Viva Aerobus', 'VB'),
('American Airlines', 'AA'),
('Iberia', 'IB')
ON CONFLICT DO NOTHING;

-- 2. Tablas Geográficas (Necesarias para Hoteles)
CREATE TABLE IF NOT EXISTS countries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    iso2 TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    country_id UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    state_id UUID NOT NULL REFERENCES states(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabla Hoteles
CREATE TABLE IF NOT EXISTS hotels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    city_id UUID REFERENCES cities(id), -- Hacemos opcional city_id por flexibilidad inicial
    stars INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar algunos hoteles de ejemplo
INSERT INTO hotels (name, stars) VALUES
('Hotel Xcaret Arte', 5),
('Riu Palace Peninsula', 4),
('Hard Rock Hotel Riviera Maya', 5),
('Grand Velas Los Cabos', 5)
ON CONFLICT DO NOTHING;

-- 4. Tabla Proveedores (si no existe)
CREATE TABLE IF NOT EXISTS providers (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'WHOLESALER', -- 'WHOLESALER', 'TOUR_OPERATOR', etc.
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insertar proveedores de ejemplo
INSERT INTO providers (name, type, status) VALUES
('Hotelbeds', 'WHOLESALER', 'ACTIVE'),
('Expedia Partner Solutions', 'WHOLESALER', 'ACTIVE'),
('Best Day', 'TOUR_OPERATOR', 'ACTIVE')
ON CONFLICT DO NOTHING;
