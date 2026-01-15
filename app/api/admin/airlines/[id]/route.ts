import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// GET single airline
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const { data: airline, error } = await supabase
            .from('airlines')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return NextResponse.json(airline)
    } catch (error) {
        console.error("Error fetching airline:", error)
        return NextResponse.json({ error: "Error al obtener aerolínea" }, { status: 500 })
    }
}

// UPDATE airline
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
        const { name, iataCode, isActive } = body

        const { data: airline, error } = await supabase
            .from('airlines')
            .update({
                name,
                iata_code: iataCode,
                is_active: isActive,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return NextResponse.json(airline)
    } catch (error) {
        console.error("Error updating airline:", error)
        return NextResponse.json({ error: "Error al actualizar aerolínea" }, { status: 500 })
    }
}

// DELETE airline
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const { error } = await supabase.from('airlines').delete().eq('id', id)
        if (error) throw error
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting airline:", error)
        return NextResponse.json({ error: "Error al eliminar aerolínea" }, { status: 500 })
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

        const { data: airline, error } = await supabase
            .from('airlines')
            .update({ is_active: isActive, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return NextResponse.json(airline)
    } catch (error) {
        console.error("Error toggling airline status:", error)
        return NextResponse.json({ error: "Error al cambiar estado" }, { status: 500 })
    }
}
