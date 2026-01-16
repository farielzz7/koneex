import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params
        const { data: provider, error } = await supabase
            .from('providers')
            .select('*')
            .eq('id', parseInt(id))
            .single()

        if (error) throw error
        return NextResponse.json(provider)
    } catch (error) {
        console.error("Error fetching provider:", error)
        return NextResponse.json(
            { error: "Error al obtener proveedor" },
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
            type,
            contact_email,
            contact_phone,
            website,
            integration_mode,
            base_url,
            api_key_hint,
            status
        } = body

        const { data: provider, error } = await supabase
            .from('providers')
            .update({
                name,
                type,
                contact_email,
                contact_phone,
                website,
                integration_mode,
                base_url,
                api_key_hint,
                status
            })
            .eq('id', parseInt(id))
            .select()
            .single()

        if (error) throw error
        return NextResponse.json(provider)
    } catch (error) {
        console.error("Error updating provider:", error)
        return NextResponse.json(
            { error: "Error al actualizar proveedor" },
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

        const { data: provider, error } = await supabase
            .from('providers')
            .update({ status })
            .eq('id', parseInt(id))
            .select()
            .single()

        if (error) throw error
        return NextResponse.json(provider)
    } catch (error) {
        console.error("Error patching provider:", error)
        return NextResponse.json(
            { error: "Error al cambiar estado del proveedor" },
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
            .from('providers')
            .delete()
            .eq('id', parseInt(id))

        if (error) throw error
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting provider:", error)
        return NextResponse.json(
            { error: "Error al eliminar proveedor. Asegúrese de que no tenga paquetes asociados." },
            { status: 500 }
        )
    }
}
