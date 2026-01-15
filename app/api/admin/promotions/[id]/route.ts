import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// GET single promotion
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const { data: promotion, error } = await supabase
            .from('promotions')
            .select('*, currencies(code)')
            .eq('id', id)
            .single()

        if (error) throw error
        return NextResponse.json(promotion)
    } catch (error) {
        console.error("Error fetching promotion:", error)
        return NextResponse.json({ error: "Error al obtener promoción" }, { status: 500 })
    }
}

// UPDATE promotion
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
        const { code, name, type, value, currencyId, startsAt, endsAt, maxUses, isActive } = body

        const { data: promotion, error } = await supabase
            .from('promotions')
            .update({
                code: code || null,
                name,
                type,
                value: parseFloat(value.toString()),
                currency_id: currencyId || null,
                starts_at: startsAt ? new Date(startsAt).toISOString() : null,
                ends_at: endsAt ? new Date(endsAt).toISOString() : null,
                max_uses: maxUses ? parseInt(maxUses.toString()) : null,
                is_active: isActive,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return NextResponse.json(promotion)
    } catch (error) {
        console.error("Error updating promotion:", error)
        return NextResponse.json({ error: "Error al actualizar promoción" }, { status: 500 })
    }
}

// DELETE promotion
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const { error } = await supabase.from('promotions').delete().eq('id', id)
        if (error) throw error
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting promotion:", error)
        return NextResponse.json({ error: "Error al eliminar promoción" }, { status: 500 })
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

        const { data: promotion, error } = await supabase
            .from('promotions')
            .update({ is_active: isActive, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return NextResponse.json(promotion)
    } catch (error) {
        console.error("Error toggling promotion status:", error)
        return NextResponse.json({ error: "Error al cambiar estado" }, { status: 500 })
    }
}
