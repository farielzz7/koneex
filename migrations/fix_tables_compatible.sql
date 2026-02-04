-- Habilitar extensión UUID por si acaso (para airlines/hotels nuevos)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabla Airlines (Usamos UUID para nuevas tablas para evitar conflictos de secuencia)
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

-- 2. Tabla Hoteles
-- NOTA: Asumimos que la tabla 'cities' ya existe y tiene IDs tipo BIGINT (basado en el error previo).
-- Si cities no existe, este bloque fallará, pero el error previo indica que countries existe como BIGINT.
DO $$
BEGIN
    -- Verificar si existe la tabla hotels, si no, crearla verificando el tipo de cities.id
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'hotels') THEN
        
        -- Intentar crear con referencia a cities, detectando tipo automáticamente si es posible,
        -- pero SQL estático no permite eso fácilmente. Asumimos BIGINT por el error anterior.
        CREATE TABLE hotels (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            city_id BIGINT REFERENCES cities(id), -- Asumimos BIGINT por compatibilidad con esquema existente
            stars INTEGER,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        
    END IF;
END $$;

-- Insertar algunos hoteles de ejemplo
INSERT INTO hotels (name, stars) VALUES
('Hotel Xcaret Arte', 5),
('Riu Palace Peninsula', 4),
('Hard Rock Hotel Riviera Maya', 5),
('Grand Velas Los Cabos', 5)
ON CONFLICT DO NOTHING;

-- 3. Tabla Proveedores (si no existe)
CREATE TABLE IF NOT EXISTS providers (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'WHOLESALER',
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
