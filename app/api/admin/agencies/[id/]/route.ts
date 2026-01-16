import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params
        const { data: agency, error } = await supabase
            .from('agencies')
            .select(`
                *,
                cities (
                    name,
                    countries (
                        name
                    )
                )
            `)
            .eq('id', parseInt(id))
            .single()

        if (error) throw error
        return NextResponse.json(agency)
    } catch (error) {
        console.error("Error fetching agency:", error)
        return NextResponse.json(
            { error: "Error al obtener agencia" },
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
        const {
            name,
            legal_name,
            rfc,
            email,
            phone,
            website,
            address_line1,
            address_line2,
            city_id,
            postal_code,
            pricing_model,
            default_commission_pct,
            default_markup_amount,
            status
        } = body

        const { data: agency, error } = await supabase
            .from('agencies')
            .update({
                name,
                legal_name,
                rfc,
                email,
                phone,
                website,
                address_line1,
                address_line2,
                city_id: city_id ? parseInt(city_id) : null,
                postal_code,
                pricing_model,
                default_commission_pct,
                default_markup_amount,
                status
            })
            .eq('id', parseInt(id))
            .select()
            .single()

        if (error) throw error
        return NextResponse.json(agency)
    } catch (error) {
        console.error("Error updating agency:", error)
        return NextResponse.json(
            { error: "Error al actualizar agencia" },
            { status: 500 }
        )
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params
        const body = await request.json()
        const { status } = body

        const { data: agency, error } = await supabase
            .from('agencies')
            .update({ status })
            .eq('id', parseInt(id))
            .select()
            .single()

        if (error) throw error
        return NextResponse.json(agency)
    } catch (error) {
        console.error("Error patching agency:", error)
        return NextResponse.json(
            { error: "Error al cambiar estado de la agencia" },
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
            .from('agencies')
            .delete()
            .eq('id', parseInt(id))

        if (error) throw error
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting agency:", error)
        return NextResponse.json(
            { error: "Error al eliminar agencia. Asegúrese de que no tenga usuarios o pedidos asociados." },
            { status: 500 }
        )
    }
}
