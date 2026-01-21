-- PASO 1: Crear la función para actualizar updated_at (si no existe)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- PASO 2: Crear tabla de recordatorios
CREATE TABLE IF NOT EXISTS reminders (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    reminder_date DATE NOT NULL,
    reminder_time TIME,
    type VARCHAR(50) DEFAULT 'GENERAL',
    priority VARCHAR(20) DEFAULT 'MEDIUM',
    booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PASO 3: Crear índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_reminders_date ON reminders(reminder_date);
CREATE INDEX IF NOT EXISTS idx_reminders_booking ON reminders(booking_id);

-- PASO 4: Crear trigger para actualizar updated_at automáticamente
DROP TRIGGER IF EXISTS update_reminders_updated_at ON reminders;
CREATE TRIGGER update_reminders_updated_at
    BEFORE UPDATE ON reminders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Verificación
SELECT 'Tabla reminders creada exitosamente! ✅' as mensaje;
