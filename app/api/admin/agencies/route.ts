import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// GET all agencies
export async function GET() {
    try {
        const { data: agencies, error } = await supabase
            .from('agencies')
            .select(`
                *,
                cities (
                    name,
                    countries (
                        name
                    )
                ),
                users (count)
            `)
            .order('name', { ascending: true })

        if (error) throw error

        // Transform count if needed
        const formattedAgencies = agencies?.map(agency => ({
            ...agency,
            user_count: agency.users?.[0]?.count || 0,
            city_name: agency.cities?.name,
            country_name: agency.cities?.countries?.name
        }))

        return NextResponse.json(formattedAgencies)
    } catch (error) {
        console.error("Error fetching agencies:", error)
        return NextResponse.json(
            { error: "Error al obtener agencias" },
            { status: 500 }
        )
    }
}

// CREATE new agency
export async function POST(request: Request) {
    try {
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
            default_markup_amount
        } = body

        if (!name) {
            return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 })
        }

        const { data: newAgency, error } = await supabase
            .from('agencies')
            .insert({
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
                pricing_model: pricing_model || 'PUBLIC_ONLY',
                default_commission_pct: default_commission_pct || 0,
                default_markup_amount: default_markup_amount || 0,
                status: 'ACTIVE'
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(newAgency, { status: 201 })
    } catch (error) {
        console.error("Error creating agency:", error)
        return NextResponse.json(
            { error: `Error al crear agencia: ${error instanceof Error ? error.message : 'Error desconocido'}` },
            { status: 500 }
        )
    }
}
