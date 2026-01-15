import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// GET single departure
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const { data: departure, error } = await supabase
            .from('departures')
            .select('*, packages(title), currencies(code)')
            .eq('id', id)
            .single()

        if (error) throw error
        return NextResponse.json(departure)
    } catch (error) {
        console.error("Error fetching departure:", error)
        return NextResponse.json({ error: "Error al obtener salida" }, { status: 500 })
    }
}

// UPDATE departure
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
        const { packageId, startDate, endDate, basePrice, capacity, currencyId, isActive } = body

        const { data: departure, error } = await supabase
            .from('departures')
            .update({
                package_id: packageId,
                start_date: new Date(startDate).toISOString(),
                end_date: new Date(endDate).toISOString(),
                base_price: parseFloat(basePrice.toString()),
                capacity: capacity ? parseInt(capacity.toString()) : null,
                currency_id: currencyId,
                is_active: isActive,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return NextResponse.json(departure)
    } catch (error) {
        console.error("Error updating departure:", error)
        return NextResponse.json({ error: "Error al actualizar salida" }, { status: 500 })
    }
}

// DELETE departure
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const { error } = await supabase.from('departures').delete().eq('id', id)
        if (error) throw error
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting departure:", error)
        return NextResponse.json({ error: "Error al eliminar salida" }, { status: 500 })
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

        const { data: departure, error } = await supabase
            .from('departures')
            .update({ is_active: isActive, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return NextResponse.json(departure)
    } catch (error) {
        console.error("Error toggling departure status:", error)
        return NextResponse.json({ error: "Error al cambiar estado" }, { status: 500 })
    }
}
