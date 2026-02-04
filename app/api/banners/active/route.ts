import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET: Fetch the active banner (public endpoint)
export async function GET() {
    const supabase = await createClient()

    const { data: banner, error } = await supabase
        .from("banners")
        .select("*")
        .eq("is_active", true)
        .eq("position", "HOME_HERO")
        .single()

    if (error) {
        // If no active banner, return null instead of error
        if (error.code === "PGRST116") {
            return NextResponse.json({ banner: null })
        }
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ banner })
}
