import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET: Fetch all banners (admin only)
export async function GET() {
    const supabase = await createClient()

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

    const { data: banners, error } = await supabase
        .from("hero_banners")
        .select("*")
        .order("created_at", { ascending: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ banners })
}

// POST: Create new banner
export async function POST(request: NextRequest) {
    const supabase = await createClient()

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
        const formData = await request.formData()
        const title = formData.get("title") as string
        const linkUrl = formData.get("link_url") as string | null
        const position = formData.get("position") as string || "home-hero"
        const displayOrder = parseInt(formData.get("display_order") as string) || 0
        const imageFile = formData.get("image") as File
        const isActive = formData.get("is_active") === "true"

        if (!title || !imageFile) {
            return NextResponse.json({ error: "Title and image are required" }, { status: 400 })
        }

        // Upload image to Supabase Storage
        const fileExt = imageFile.name.split(".").pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage.from("hero-banners").upload(filePath, imageFile, {
            contentType: imageFile.type,
            upsert: false,
        })

        if (uploadError) {
            console.error("Upload error:", uploadError)
            return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
        }

        // Get public URL
        const {
            data: { publicUrl },
        } = supabase.storage.from("hero-banners").getPublicUrl(filePath)

        // Insert banner record
        const { data: banner, error: insertError } = await supabase
            .from("hero_banners")
            .insert({
                title,
                image_url: publicUrl,
                link_url: linkUrl || null,
                position,
                display_order: displayOrder,
                is_active: isActive,
                created_by: user.id,
            })
            .select()
            .single()

        if (insertError) {
            // Clean up uploaded file
            await supabase.storage.from("hero-banners").remove([filePath])
            return NextResponse.json({ error: insertError.message }, { status: 500 })
        }

        return NextResponse.json({ banner }, { status: 201 })
    } catch (error) {
        console.error("Error creating banner:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
