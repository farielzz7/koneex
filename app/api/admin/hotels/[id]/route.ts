import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// GET single hotel
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const { data: hotel, error } = await supabase
            .from('hotels')
            .select('*, cities(name)')
            .eq('id', id)
            .single()

        if (error) throw error
        return NextResponse.json(hotel)
    } catch (error) {
        console.error("Error fetching hotel:", error)
        return NextResponse.json({ error: "Error al obtener hotel" }, { status: 500 })
    }
}

// UPDATE hotel
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
        const { name, cityId, stars, isActive } = body

        const { data: hotel, error } = await supabase
            .from('hotels')
            .update({
                name,
                city_id: cityId,
                stars: stars ? parseInt(stars.toString()) : null,
                is_active: isActive,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return NextResponse.json(hotel)
    } catch (error) {
        console.error("Error updating hotel:", error)
        return NextResponse.json({ error: "Error al actualizar hotel" }, { status: 500 })
    }
}

// DELETE hotel
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const { error } = await supabase.from('hotels').delete().eq('id', id)
        if (error) throw error
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting hotel:", error)
        return NextResponse.json({ error: "Error al eliminar hotel" }, { status: 500 })
    }
}

// PATCH - Toggle active status
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
        const { isActive } = body

        const { data: hotel, error } = await supabase
            .from('hotels')
            .update({ is_active: isActive, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return NextResponse.json(hotel)
    } catch (error) {
        console.error("Error toggling hotel status:", error)
        return NextResponse.json({ error: "Error al cambiar estado" }, { status: 500 })
    }
}
