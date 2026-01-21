import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// Fallback to Anon key if Service Role is missing (works for public read usually)
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get("q")

    let query = supabase
        .from("packages")
        .select("id, title, slug, status")
        // .eq('status', 'ACTIVE') // Allow Drafts for Quoting
        .limit(20)

    if (q) {
        query = query.ilike('title', `%${q}%`)
    }

    const { data, error } = await query

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
}
