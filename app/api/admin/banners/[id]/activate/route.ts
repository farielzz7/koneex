import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// PATCH: Activate/deactivate banner
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    const supabase = await createClient()
    const { id } = params

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const { data: userData } = await supabase.from("users").select("role").eq("id", user.id).single()

    if (userData?.role !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    try {
        const body = await request.json()
        const { is_active } = body

        if (typeof is_active !== "boolean") {
            return NextResponse.json({ error: "is_active must be a boolean" }, { status: 400 })
        }

        // Update banner active status (trigger will handle deactivating others)
        const { data: banner, error: updateError } = await supabase
            .from("hero_banners")
            .update({ is_active })
            .eq("id", id)
            .select()
            .single()

        if (updateError) {
            return NextResponse.json({ error: updateError.message }, { status: 500 })
        }

        return NextResponse.json({ banner })
    } catch (error) {
        console.error("Error activating banner:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
