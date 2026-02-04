-- Add city_id column to destinations (if missing) and foreign key
ALTER TABLE IF EXISTS destinations ADD COLUMN IF NOT EXISTS city_id BIGINT;

-- Add foreign key constraint (ignore if already exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_destinations_city'
          AND table_name = 'destinations'
    ) THEN
        ALTER TABLE destinations
            ADD CONSTRAINT fk_destinations_city FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE SET NULL;
    END IF;
END $$;
