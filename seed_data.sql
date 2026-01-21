-- SEED DATA FOR KONEEX TRAVEL AGENCY
-- Execute this script in your database SQL editor
-- Password for all users: "password123"

BEGIN;

-- 1. CLEANUP (Optional - be careful)
-- TRUNCATE public.users, public.countries, public.packages CASCADE;

-- 2. USERS
-- Password hash for 'password123': $2b$10$izwt/cdCKql/ge9aY0.9NLcQy1KvCEEa
INSERT INTO public.users (name, email, password, role, status) VALUES
('Administrador Koneex', 'admin@koneex.com', '$2b$10$izwt/cdCKql/ge9aY0.9NLcQy1KvCEEa', 'ADMIN', 'ACTIVE'),
('Agente de Ventas', 'agente@koneex.com', '$2b$10$izwt/cdCKql/ge9aY0.9NLcQy1KvCEEa', 'AGENT', 'ACTIVE'),
('Juan Pérez', 'cliente@gmail.com', '$2b$10$izwt/cdCKql/ge9aY0.9NLcQy1KvCEEa', 'CUSTOMER', 'ACTIVE'),
('Soporte Técnico', 'support@koneex.com', '$2b$10$izwt/cdCKql/ge9aY0.9NLcQy1KvCEEa', 'SUPPORT', 'ACTIVE')
ON CONFLICT (email) DO NOTHING;

-- 3. GEOGRAPHY
INSERT INTO public.countries (iso2, name) VALUES
('MX', 'México'),
('FR', 'Francia'),
('JP', 'Japón'),
('PE', 'Perú')
ON CONFLICT (iso2) DO NOTHING;

INSERT INTO public.cities (country_id, name, state) VALUES
((SELECT id FROM public.countries WHERE iso2='MX'), 'Cancún', 'Quintana Roo'),
((SELECT id FROM public.countries WHERE iso2='MX'), 'Mérida', 'Yucatán'),
((SELECT id FROM public.countries WHERE iso2='FR'), 'París', 'Île-de-France'),
((SELECT id FROM public.countries WHERE iso2='JP'), 'Tokio', 'Tokyo'),
((SELECT id FROM public.countries WHERE iso2='PE'), 'Cusco', 'Cusco')
ON CONFLICT DO NOTHING;

-- 4. PROVIDERS
INSERT INTO public.providers (name, type, contact_email, status) VALUES
('Hotel Xcaret', 'HOTEL', 'reservas@xcaret.com', 'ACTIVE'),
('Aeroméxico', 'AIRLINE', 'ventas@aeromexico.com', 'ACTIVE'),
('EuroPaquetes Mayorista', 'WHOLESALER', 'contacto@europaquetes.com', 'ACTIVE'),
('Tours Yucatán', 'OPERATOR', 'info@toursyucatan.com', 'ACTIVE')
ON CONFLICT DO NOTHING;

-- 5. DESTINATIONS
INSERT INTO public.destinations (name, slug, description, city_id, is_featured) VALUES
('Riviera Maya, México', 'riviera-maya', 'Playas paradisíacas y ruinas mayas.', (SELECT id FROM public.cities WHERE name='Cancún'), TRUE),
('París Romántico', 'paris', 'La ciudad del amor y las luces.', (SELECT id FROM public.cities WHERE name='París'), TRUE),
('Tokio Moderno', 'tokio', 'Tecnología y tradición en Japón.', (SELECT id FROM public.cities WHERE name='Tokio'), FALSE),
('Cusco y Machu Picchu', 'cusco', 'La capital del imperio Inca.', (SELECT id FROM public.cities WHERE name='Cusco'), TRUE)
ON CONFLICT (slug) DO NOTHING;

-- 6. PACKAGES
INSERT INTO public.packages (
    slug, title, subtitle, product_type, 
    short_description, description, 
    duration_days, duration_nights, 
    currency_code, from_price, status, 
    provider_id
) VALUES
(
    'escapada-xcaret-2026', 
    'Escapada Xcaret All-Inclusive', 
    'Diversión y naturaleza sin límites', 
    'HOTEL_PACKAGE',
    '3 días y 2 noches en el mejor parque de México con todo incluido.',
    'Disfruta de acceso ilimitado a todos los parques de Xcaret (Xplor, Xel-Há, Xenses) hospedándote en el Hotel Xcaret México con el concepto All-Fun Inclusive.',
    3, 2, 'MXN', 18500.00, 'PUBLISHED',
    (SELECT id FROM public.providers WHERE name='Hotel Xcaret')
),
(
    'tour-europa-express', 
    'Europa Express: París y Londres', 
    'Descubre dos capitales en una semana', 
    'CIRCUIT',
    'Un recorrido rápido pero completo por los íconos de Europa.',
    'Visita la Torre Eiffel, el Museo del Louvre, el Big Ben y mucho más en este circuito diseñado para aprovechar al máximo tu tiempo.',
    7, 6, 'USD', 1200.00, 'PUBLISHED',
    (SELECT id FROM public.providers WHERE name='EuroPaquetes Mayorista')
),
(
    'machu-picchu-aventura', 
    'Aventura en los Andes', 
    'Caminata y cultura en Perú', 
    'EXPERIENCE',
    'Conoce la maravilla del mundo moderno: Machu Picchu.',
    'Incluye traslados, tren panorámico y guía experto en la ciudadela sagrada.',
    4, 3, 'USD', 850.00, 'PUBLISHED',
    (SELECT id FROM public.providers WHERE name='EuroPaquetes Mayorista')
);

-- Link Packages to Destinations
INSERT INTO public.package_destinations (package_id, destination_id, is_primary) VALUES
(
    (SELECT id FROM public.packages WHERE slug='escapada-xcaret-2026'),
    (SELECT id FROM public.destinations WHERE slug='riviera-maya'),
    TRUE
),
(
    (SELECT id FROM public.packages WHERE slug='tour-europa-express'),
    (SELECT id FROM public.destinations WHERE slug='paris'),
    TRUE
),
(
    (SELECT id FROM public.packages WHERE slug='machu-picchu-aventura'),
    (SELECT id FROM public.destinations WHERE slug='cusco'),
    TRUE
)
ON CONFLICT DO NOTHING;

-- 7. ORDERS (Drafts)
INSERT INTO public.orders (order_number, user_id, status, currency_code, total_amount) VALUES
(
    'KX-2026-000001', 
    (SELECT id FROM public.users WHERE email='cliente@gmail.com'),
    'PENDING_PAYMENT',
    'MXN',
    37000.00
);

-- Order Items
INSERT INTO public.order_items (order_id, title, quantity, unit_price, total_price, package_id) VALUES
(
    (SELECT id FROM public.orders WHERE order_number='KX-2026-000001'),
    'Escapada Xcaret All-Inclusive (2 Adultos)',
    2,
    18500.00,
    37000.00,
    (SELECT id FROM public.packages WHERE slug='escapada-xcaret-2026')
);

COMMIT;
