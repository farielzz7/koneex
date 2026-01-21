-- Script de verificación para revisar si se cargaron los datos

-- Ver destinos
SELECT 'DESTINOS:' as tabla, COUNT(*) as total FROM public.destinations;
SELECT * FROM public.destinations ORDER BY id;

-- Ver paquetes
SELECT 'PAQUETES:' as tabla, COUNT(*) as total FROM public.packages;
SELECT id, slug, title, status, destination_id FROM public.packages ORDER BY id;

-- Ver si hay problemas de relación
SELECT 
    p.id,
    p.slug,
    p.title,
    p.destination_id,
    d.name as destination_name
FROM public.packages p
LEFT JOIN public.destinations d ON p.destination_id = d.id
ORDER BY p.id;
