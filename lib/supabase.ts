import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Singleton para evitar múltiples instancias en desarrollo
const globalForSupabase = globalThis as unknown as {
    supabase: ReturnType<typeof createClient<Database>> | undefined
}

export const supabase = globalForSupabase.supabase ?? createClient<Database>(
    supabaseUrl,
    supabaseAnonKey
)

if (process.env.NODE_ENV !== 'production') globalForSupabase.supabase = supabase
