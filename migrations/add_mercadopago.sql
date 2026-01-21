-- Update payment_method enum to include MERCADOPAGO if not exists
DO $$ 
BEGIN
    -- Check if MERCADOPAGO value exists in payment_method type
    IF NOT EXISTS (
        SELECT 1 FROM pg_type t
        JOIN pg_enum e ON t.oid = e.enumtypid
        WHERE t.typname = 'payment_method' 
        AND e.enumlabel = 'MERCADOPAGO'
    ) THEN
        -- Add MERCADOPAGO to the enum
        ALTER TYPE payment_method ADD VALUE 'MERCADOPAGO';
    END IF;
END $$;
