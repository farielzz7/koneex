-- Add slug column to destinations (if missing) and unique constraint
ALTER TABLE IF EXISTS destinations ADD COLUMN IF NOT EXISTS slug VARCHAR(200);

-- Ensure slug is NOT NULL (set empty string for existing rows)
UPDATE destinations SET slug = '' WHERE slug IS NULL;

-- Add unique index on slug (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND tablename = 'destinations' AND indexname = 'destinations_slug_key'
    ) THEN
        CREATE UNIQUE INDEX destinations_slug_key ON destinations(slug);
    END IF;
END $$;
