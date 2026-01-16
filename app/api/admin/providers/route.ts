import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// GET providers with optional type filter
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const type = searchParams.get('type')

        let query = supabase
            .from('providers')
            .select('*')
            .order('name', { ascending: true })

        if (type) {
            query = query.eq('type', type as "AIRLINE" | "HOTEL" | "WHOLESALER" | "OPERATOR" | "OTHER")
        }

        const { data: providers, error } = await query

        if (error) throw error

        return NextResponse.json(providers)
    } catch (error) {
        console.error("Error fetching providers:", error)
        return NextResponse.json(
            { error: "Error al obtener proveedores" },
            { status: 500 }
        )
    }
}

// CREATE new provider
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const {
            name,
            type,
            contact_email,
            contact_phone,
            website,
            integration_mode,
            base_url,
            api_key_hint
        } = body

        if (!name || !type) {
            return NextResponse.json({ error: "Nombre y tipo son requeridos" }, { status: 400 })
        }

        const { data: provider, error } = await supabase
            .from('providers')
            .insert({
                name,
                type,
                contact_email,
                contact_phone,
                website,
                integration_mode: integration_mode || 'MANUAL',
                base_url,
                api_key_hint,
                status: 'ACTIVE'
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(provider, { status: 201 })
    } catch (error) {
        console.error("Error creating provider:", error)
        return NextResponse.json(
            { error: "Error al crear proveedor" },
            { status: 500 }
        )
    }
}
