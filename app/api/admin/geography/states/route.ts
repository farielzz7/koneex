import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
    try {
        const { data: states, error } = await supabase
            .from('states')
            .select(`
                *,
                countries (
                    name
                )
            `)
            .order('name', { ascending: true })

        if (error) throw error

        // Transform to match previous format
        const formattedStates = states?.map(state => ({
            ...state,
            country: state.countries
        }))

        return NextResponse.json(formattedStates)
    } catch (error) {
        console.error("Error fetching states:", error)
        return NextResponse.json(
            { error: "Error al obtener estados" },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, countryId } = body

        const { data: state, error } = await supabase
            .from('states')
            .insert({
                name,
                country_id: countryId,
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(state, { status: 201 })
    } catch (error) {
        console.error("Error creating state:", error)
        return NextResponse.json(
            { error: "Error al crear estado" },
            { status: 500 }
        )
    }
}
