import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params
        const { data: country, error } = await supabase
            .from('countries')
            .select('*')
            .eq('id', parseInt(id))
            .single()

        if (error) throw error
        return NextResponse.json(country)
    } catch (error) {
        console.error("Error fetching country:", error)
        return NextResponse.json(
            { error: "Error al obtener país" },
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
        const { name, iso2 } = body

        const { data: country, error } = await supabase
            .from('countries')
            .update({ name, iso2 })
            .eq('id', parseInt(id))
            .select()
            .single()

        if (error) throw error
        return NextResponse.json(country)
    } catch (error) {
        console.error("Error updating country:", error)
        return NextResponse.json(
            { error: "Error al actualizar país" },
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
            .from('countries')
            .delete()
            .eq('id', parseInt(id))

        if (error) throw error
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting country:", error)
        return NextResponse.json(
            { error: "Error al eliminar país. Asegúrese de que no tenga ciudades asociadas." },
            { status: 500 }
        )
    }
}
