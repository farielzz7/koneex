# Configuración de Supabase Storage para Banners

## Pasos para configurar el almacenamiento de imágenes:

### 1. Crear Bucket en Supabase

1. Ve a tu proyecto en Supabase Dashboard
2. Click en **Storage** en el menú lateral
3. Click en **"New bucket"**
4. Configuración del bucket:
   - **Name:** `media`
   - **Public bucket:** ✅ Activar (para que las imágenes sean accesibles públicamente)
   - Click en **"Create bucket"**

### 2. Configurar Políticas de Seguridad (RLS)

El bucket `media` necesita políticas para permitir:
- ✅ Lectura pública (cualquiera puede ver las imágenes)
- ✅ Escritura/eliminación solo para usuarios autenticados

**SQL para políticas:**

```sql
-- Permitir lectura pública
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

-- Permitir subida a usuarios autenticados
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'media' AND
  auth.role() = 'authenticated'
);

-- Permitir actualización a usuarios autenticados
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'media' AND
  auth.role() = 'authenticated'
);

-- Permitir eliminación a usuarios autenticados
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'media' AND
  auth.role() = 'authenticated'
);
```

### 3. Estructura de carpetas en el bucket

```
media/
├── banners/           ← Imágenes de banners
├── packages/          ← Imágenes de paquetes (futuro)
├── testimonials/      ← Fotos de testimonios (futuro)
└── general/           ← Multimedia general
```

### 4. Verificar configuración

1. Ve a Storage > media
2. Intenta subir un archivo de prueba
3. Verifica que la URL pública funcione

---

## Uso en la aplicación

El componente de Banners ya está configurado para:
- ✅ Subir imágenes a `media/banners/`
- ✅ Obtener URLs públicas automáticamente
- ✅ Mostrar preview antes de subir
- ✅ Validar tamaño (máx 5MB) y tipo de archivo

## Siguientes pasos

1. Ejecuta el seeder de paquetes: `seeders/packages_seeder.sql`
2. Configura el bucket `media` en Supabase
3. Crea tu primer banner desde el admin panel
