-- Add is_active column to hotels for UI filtering
ALTER TABLE IF EXISTS hotels ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Update existing sample hotels to be active (if they exist)
UPDATE hotels SET is_active = TRUE WHERE is_active IS NULL;

-- Optional: Insert sample hotels with is_active flag (if not already present)
INSERT INTO hotels (name, stars, is_active) VALUES
  ('Hotel Xcaret Arte', 5, TRUE),
  ('Riu Palace Peninsula', 4, TRUE),
  ('Hard Rock Hotel Riviera Maya', 5, TRUE),
  ('Grand Velas Los Cabos', 5, TRUE)
ON CONFLICT DO NOTHING;
