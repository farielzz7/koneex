import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params
        const { data: city, error } = await supabase
            .from('cities')
            .select(`
                *,
                countries (
                    name
                )
            `)
            .eq('id', parseInt(id))
            .single()

        if (error) throw error
        return NextResponse.json(city)
    } catch (error) {
        console.error("Error fetching city:", error)
        return NextResponse.json(
            { error: "Error al obtener ciudad" },
            { status: 500 }
        )
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params
        const body = await request.json()
        const { name, country_id, state, latitude, longitude } = body

        const { data: city, error } = await supabase
            .from('cities')
            .update({
                name,
                country_id,
                state: state || null,
                latitude: latitude || null,
                longitude: longitude || null
            })
            .eq('id', parseInt(id))
            .select()
            .single()

        if (error) throw error
        return NextResponse.json(city)
    } catch (error) {
        console.error("Error updating city:", error)
        return NextResponse.json(
            { error: "Error al actualizar ciudad" },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params
        const { error } = await supabase
            .from('cities')
            .delete()
            .eq('id', parseInt(id))

        if (error) throw error
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting city:", error)
        return NextResponse.json(
            { error: "Error al eliminar ciudad. Asegúrese de que no tenga agencias o destinos asociados." },
            { status: 500 }
        )
    }
}
