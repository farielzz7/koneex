-- =============================================
-- MIGRACIÓN: Crear tablas en Supabase
-- Ejecutar este script en el SQL Editor de Supabase
-- =============================================

-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- ENUMS
-- =============================================

CREATE TYPE user_role AS ENUM ('ADMIN', 'AGENT', 'CUSTOMER');
CREATE TYPE promotion_type AS ENUM ('PERCENTAGE', 'FIXED', 'BUNDLE');
CREATE TYPE order_status AS ENUM ('PENDING', 'CONFIRMED', 'PAID', 'CANCELLED', 'COMPLETED');

-- =============================================
-- TABLAS BASE (sin dependencias)
-- =============================================

-- Usuarios
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password TEXT,
    role user_role DEFAULT 'CUSTOMER',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Países
CREATE TABLE countries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    iso2 TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Monedas
CREATE TABLE currencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    symbol TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Aerolíneas
CREATE TABLE airlines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    iata_code TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Paquetes
CREATE TABLE packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLAS CON DEPENDENCIAS NIVEL 1
-- =============================================

-- Estados (depende de countries)
CREATE TABLE states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    country_id UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clientes (depende de users)
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Promociones (depende de currencies)
CREATE TABLE promotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT,
    name TEXT NOT NULL,
    type promotion_type NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    currency_id UUID REFERENCES currencies(id),
    starts_at TIMESTAMPTZ,
    ends_at TIMESTAMPTZ,
    max_uses INTEGER,
    current_uses INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Salidas (depende de packages, currencies)
CREATE TABLE departures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    package_id UUID NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    capacity INTEGER,
    currency_id UUID NOT NULL REFERENCES currencies(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLAS CON DEPENDENCIAS NIVEL 2
-- =============================================

-- Ciudades (depende de states)
CREATE TABLE cities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    state_id UUID NOT NULL REFERENCES states(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Órdenes (depende de customers, currencies)
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id),
    currency_id UUID NOT NULL REFERENCES currencies(id),
    status order_status DEFAULT 'PENDING',
    subtotal DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLAS CON DEPENDENCIAS NIVEL 3
-- =============================================

-- Hoteles (depende de cities)
CREATE TABLE hotels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    city_id UUID NOT NULL REFERENCES cities(id),
    stars INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Items de orden (depende de orders, departures)
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    departure_id UUID NOT NULL REFERENCES departures(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hoteles de salida (depende de departures, hotels)
CREATE TABLE departure_hotels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    departure_id UUID NOT NULL REFERENCES departures(id) ON DELETE CASCADE,
    hotel_id UUID NOT NULL REFERENCES hotels(id),
    nights INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Aerolíneas de salida (depende de departures, airlines)
CREATE TABLE departure_airlines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    departure_id UUID NOT NULL REFERENCES departures(id) ON DELETE CASCADE,
    airline_id UUID NOT NULL REFERENCES airlines(id),
    flight_type TEXT, -- 'OUTBOUND' o 'RETURN'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Objetivos de promoción (depende de promotions, packages)
CREATE TABLE promotion_targets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    promotion_id UUID NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
    package_id UUID REFERENCES packages(id),
    departure_id UUID REFERENCES departures(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Promociones aplicadas a órdenes (depende de orders, promotions)
CREATE TABLE order_promotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    promotion_id UUID NOT NULL REFERENCES promotions(id),
    discount_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Log de estados de promoción
CREATE TABLE promotion_status_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    promotion_id UUID NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
    old_status BOOLEAN,
    new_status BOOLEAN NOT NULL,
    changed_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ÍNDICES
-- =============================================

CREATE INDEX idx_customers_user_id ON customers(user_id);
CREATE INDEX idx_states_country_id ON states(country_id);
CREATE INDEX idx_cities_state_id ON cities(state_id);
CREATE INDEX idx_hotels_city_id ON hotels(city_id);
CREATE INDEX idx_departures_package_id ON departures(package_id);
CREATE INDEX idx_departures_currency_id ON departures(currency_id);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_promotions_code ON promotions(code);
CREATE INDEX idx_promotions_is_active ON promotions(is_active);

-- =============================================
-- DATOS INICIALES (Opcional)
-- =============================================

-- Insertar monedas comunes
INSERT INTO currencies (code, name, symbol) VALUES
('MXN', 'Peso Mexicano', '$'),
('USD', 'Dólar Americano', '$'),
('EUR', 'Euro', '€');

-- Insertar usuario admin de ejemplo
INSERT INTO users (email, name, role) VALUES
('admin@koneex.com', 'Administrador', 'ADMIN');

-- =============================================
-- FIN DE MIGRACIÓN
-- =============================================
