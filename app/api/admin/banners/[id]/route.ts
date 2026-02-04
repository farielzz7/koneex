import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// PUT: Update banner
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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
        const formData = await request.formData()
        const title = formData.get("title") as string
        const linkUrl = formData.get("link_url") as string | null
        const imageFile = formData.get("image") as File | null

        if (!title) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 })
        }

        // Get current banner to potentially delete old image
        const { data: currentBanner } = await supabase.from("hero_banners").select("*").eq("id", id).single()

        if (!currentBanner) {
            return NextResponse.json({ error: "Banner not found" }, { status: 404 })
        }

        let imageUrl = currentBanner.image_url

        // If new image is provided, upload it
        if (imageFile && imageFile.size > 0) {
            // Delete old image
            const oldImagePath = currentBanner.image_url.split("/").pop()
            if (oldImagePath) {
                await supabase.storage.from("hero-banners").remove([oldImagePath])
            }

            // Upload new image
            const fileExt = imageFile.name.split(".").pop()
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

            const { error: uploadError } = await supabase.storage.from("hero-banners").upload(fileName, imageFile, {
                contentType: imageFile.type,
                upsert: false,
            })

            if (uploadError) {
                return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
            }

            const {
                data: { publicUrl },
            } = supabase.storage.from("hero-banners").getPublicUrl(fileName)
            imageUrl = publicUrl
        }

        // Update banner
        const { data: banner, error: updateError } = await supabase
            .from("hero_banners")
            .update({
                title,
                image_url: imageUrl,
                link_url: linkUrl || null,
            })
            .eq("id", id)
            .select()
            .single()

        if (updateError) {
            return NextResponse.json({ error: updateError.message }, { status: 500 })
        }

        return NextResponse.json({ banner })
    } catch (error) {
        console.error("Error updating banner:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

// DELETE: Delete banner
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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
        // Get banner to delete associated image
        const { data: banner } = await supabase.from("hero_banners").select("*").eq("id", id).single()

        if (!banner) {
            return NextResponse.json({ error: "Banner not found" }, { status: 404 })
        }

        // Delete image from storage
        const imagePath = banner.image_url.split("/").pop()
        if (imagePath) {
            await supabase.storage.from("hero-banners").remove([imagePath])
        }

        // Delete banner record
        const { error: deleteError } = await supabase.from("hero_banners").delete().eq("id", id)

        if (deleteError) {
            return NextResponse.json({ error: deleteError.message }, { status: 500 })
        }

        return NextResponse.json({ message: "Banner deleted successfully" })
    } catch (error) {
        console.error("Error deleting banner:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
