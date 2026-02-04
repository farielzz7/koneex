-- -------------------------------------------------
--  seed_geography_and_destinations.sql
-- -------------------------------------------------
-- 1️⃣  Países
INSERT INTO countries (iso2, name)
VALUES ('MX', 'México')
ON CONFLICT (iso2) DO NOTHING;

-- 2️⃣  Estados (asumiendo que el id del país insertado es 1)
INSERT INTO states (name, country_id)
SELECT 'Quintana Roo', id FROM countries WHERE iso2 = 'MX'
ON CONFLICT DO NOTHING;

-- 3️⃣  Ciudades (asumiendo que el id del estado insertado es 1)
INSERT INTO cities (country_id, name, state, latitude, longitude)
SELECT
  (SELECT id FROM countries WHERE iso2 = 'MX') AS country_id,
  'Cancún' AS name,
  'Quintana Roo' AS state,
  21.1619 AS latitude,
  -86.8515 AS longitude
ON CONFLICT DO NOTHING;

-- 4️⃣  Destinos (usa la ciudad recién creada)
INSERT INTO destinations (city_id, name, slug, description, hero_image_url, is_featured)
SELECT
  c.id,
  'Cancún',
  'cancun',
  'Destino paradisíaco con playas de arena blanca y aguas turquesas.',
  'https://example.com/cancun-hero.jpg',
  TRUE
FROM cities c
WHERE c.name = 'Cancún'
ON CONFLICT (slug) DO NOTHING;
