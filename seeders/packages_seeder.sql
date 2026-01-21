-- ============================================================
-- SEEDER: Paquetes de Viajes de Ejemplo
-- ============================================================
-- Este script carga datos de ejemplo para la tabla de paquetes

-- Primero, insertar destinos si no existen (usando NOT EXISTS para evitar duplicados)
INSERT INTO public.destinations (name, country, state, city, description, is_active)
SELECT * FROM (VALUES
    ('Cancún y Riviera Maya', 'México', 'Quintana Roo', 'Cancún', 'Playas paradisíacas del Caribe mexicano con aguas turquesa y arena blanca.', true),
    ('Ciudad de México', 'México', 'Ciudad de México', 'CDMX', 'Capital cultural e histórica de México, con museos, arquitectura colonial y gastronomía excepcional.', true),
    ('Oaxaca', 'México', 'Oaxaca', 'Oaxaca de Juárez', 'Cuna de tradiciones ancestrales, artesanías coloridas y la mejor gastronomía mexicana.', true),
    ('Guadalajara', 'México', 'Jalisco', 'Guadalajara', 'Cuna del mariachi y tequila, con rica cultura y tradiciones mexicanas.', true),
    ('Mérida', 'México', 'Yucatán', 'Mérida', 'Ciudad colonial con arquitectura histórica, cercana a zonas arqueológicas mayas.', true),
    ('Los Cabos', 'México', 'Baja California Sur', 'Los Cabos', 'Destino de lujo con playas espectaculares, golf y pesca deportiva.', true)
) AS new_dest(name, country, state, city, description, is_active)
WHERE NOT EXISTS (
    SELECT 1 FROM public.destinations WHERE destinations.name = new_dest.name
);

-- Insertar paquetes usando los IDs de destinos existentes (evitar duplicados por slug)
INSERT INTO public.packages (
    destination_id,
    slug,
    title,
    short_description,
    description,
    duration_days,
    duration_nights,
    status
) 
SELECT 
    d.id,
    vals.slug,
    vals.title,
    vals.short_description,
    vals.description,
    vals.duration_days,
    vals.duration_nights,
    vals.status::package_status
FROM (VALUES
    -- Paquete 1: Cancún Todo Incluido
    ('Cancún y Riviera Maya', 'cancun-todo-incluido-5-dias', 'Cancún Todo Incluido - 5 Días / 4 Noches', 
     'Disfruta del paraíso caribeño con todo incluido en hoteles de lujo', 
     'Experiencia completa en Cancún con hospedaje todo incluido en hotel 5 estrellas, acceso a playas privadas, actividades acuáticas y excursiones opcionales a Chichén Itzá y Tulum.

INCLUYE:
• Hospedaje 4 noches en hotel todo incluido 5 estrellas
• Alimentos y bebidas ilimitadas
• Actividades recreativas diurnas y nocturnas
• Acceso a gimnasio, spa y piscinas
• Wifi en áreas comunes
• Traslados aeropuerto-hotel-aeropuerto

Excursiones opcionales (no incluidas):
- Tour a Chichén Itzá
- Visita a Tulum y nado en cenotes
- Isla Mujeres en catamarán
- Xcaret o Xel-Há',
     5, 4, 'ACTIVE'),

    -- Paquete 2: CDMX Cultural
    ('Ciudad de México', 'cdmx-cultural-4-dias', 'Ciudad de México Cultural - 4 Días / 3 Noches',
     'Explora la riqueza histórica y cultural de la capital de México',
     'Tour cultural por los mejores sitios históricos de la Ciudad de México.

INCLUYE:
• 3 noches en hotel céntrico boutique 4 estrellas
• Desayunos incluidos
• City tour por Centro Histórico y Zócalo
• Visita a Museo Nacional de Antropología
• Tour por Xochimilco con trajinera
• Visita a Pirámides de Teotihuacán
• Coyoacán y Casa Azul de Frida Kahlo
• Guía certificado en español
• Transporte durante los tours',
     4, 3, 'ACTIVE'),

    -- Paquete 3: Oaxaca Gastronómico
    ('Oaxaca', 'oaxaca-gastronomico-4-dias', 'Oaxaca Gastronómico - 4 Días / 3 Noches',
     'Descubre los sabores auténticos de la cocina oaxaqueña',
     'Experiencia gastronómica completa en Oaxaca.

INCLUYE:
• 3 noches en hotel colonial en el centro histórico
• Tour gastronómico por mercados locales
• Clase de cocina oaxaqueña tradicional
• Visita a mezcalerías artesanales con degustación
• Tour por Monte Albán (zona arqueológica zapoteca)
• Visita a Hierve el Agua
• Recorrido por talleres de alebrijes y textiles
• Degustación de mole, tlayudas, mezcal y chocolate',
     4, 3, 'ACTIVE'),

    -- Paquete 4: Guadalajara y Tequila
    ('Guadalajara', 'guadalajara-tequila-3-dias', 'Guadalajara y Ruta del Tequila - 3 Días / 2 Noches',
     'Descubre el mariachi, tequila y tradiciones de Jalisco',
     'Experiencia tradicional jalisciense.

INCLUYE:
• 2 noches en hotel en Guadalajara
• City tour por Guadalajara (Catedral, Teatro Degollado, Hospicio Cabañas)
• Visita a Tlaquepaque y Tonalá (artesanías)
• Tour a Tequila con visita a destilería
• Degustación de tequilas premium
• Show de mariachi
• Comida típica tapatía',
     3, 2, 'ACTIVE'),

    -- Paquete 5: Mérida y Ruta Maya
    ('Mérida', 'merida-ruta-maya-5-dias', 'Mérida y Ruta Maya - 5 Días / 4 Noches',
     'Explora la cultura maya y la belleza colonial de Yucatán',
     'Tour completo por la península de Yucatán.

INCLUYE:
• 4 noches en hotel boutique en Mérida
• Tour por Chichén Itzá (Maravilla del Mundo)
• Visita a Uxmal y Ruta Puuc
• Nado en cenotes sagrados
• Paseo por Izamal (Pueblo Mágico amarillo)
• Visita a Celestún (reserva de flamencos rosados)
• City tour por Mérida colonial
• Cena con espectáculo de jarana yucateca
• Degustación de cochuita pibil, salbutes y marquesitas',
     5, 4, 'ACTIVE'),

    -- Paquete 6: Los Cabos Luxury
    ('Los Cabos', 'los-cabos-luxury-6-dias', 'Los Cabos Luxury - 6 Días / 5 Noches',
     'Experiencia de lujo en el paraíso del mar de Cortés',
     'Paquete premium all-inclusive en Los Cabos.

INCLUYE:
• 5 noches en resort 5 estrellas Grand Luxury
• Plan todo incluido premium (comidas gourmet, bebidas premium)
• Acceso al Arco de Cabo San Lucas en yate privado
• Snorkel en Bahía Santa María
• Masaje de pareja en spa de lujo (60 min)
• Cena romántica en la playa
• Clase de cocina con chef ejecutivo
• Acceso a campos de golf de campeonato
• Servicio de mayordomo 24/7
• Traslados en vehículo de lujo',
     6, 5, 'ACTIVE'),

    -- Paquete 7: Cancún Express
    ('Cancún y Riviera Maya', 'cancun-express-3-dias', 'Cancún Express - 3 Días / 2 Noches',
     'Escapada rápida al Caribe mexicano',
     'Paquete express perfecto para fines de semana largos.

INCLUYE:
• 2 noches en hotel 4 estrellas con desayuno
• Acceso a playa y alberca
• Day pass a Playa Delfines
• Tour opcional a Isla Mujeres
• Traslados aeropuerto-hotel-aeropuerto',
     3, 2, 'ACTIVE'),

    -- Paquete 8: Playa del Carmen (DRAFT)
    ('Cancún y Riviera Maya', 'playa-del-carmen-wellness', 'Playa del Carmen Wellness Retreat',
     'Retiro de bienestar con yoga, meditación y spa',
     'Próximamente: Retiro completo de wellness en Playa del Carmen con clases de yoga diarias, meditación guiada, tratamientos de spa, alimentación saludable y actividades de conexión con la naturaleza.',
     7, 6, 'DRAFT')
) AS vals(dest_name, slug, title, short_description, description, duration_days, duration_nights, status)
JOIN public.destinations d ON d.name = vals.dest_name
WHERE NOT EXISTS (
    SELECT 1 FROM public.packages WHERE packages.slug = vals.slug
);

-- Mensaje de confirmación
SELECT 
    'Seeder completado! Se insertaron:' as resultado,
    (SELECT COUNT(*) FROM public.destinations) as total_destinos,
    (SELECT COUNT(*) FROM public.packages) as total_paquetes;

