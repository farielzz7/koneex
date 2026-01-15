import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
    try {
        const { data: cities, error } = await supabase
            .from('cities')
            .select(`
                *,
                states (
                    name,
                    countries (
                        name
                    )
                )
            `)
            .order('name', { ascending: true })

        if (error) throw error

        // Transform to match previous format with nested relations
        const formattedCities = cities?.map(city => ({
            ...city,
            state: {
                name: city.states?.name,
                country: city.states?.countries
            }
        }))

        return NextResponse.json(formattedCities)
    } catch (error) {
        console.error("Error fetching cities:", error)
        return NextResponse.json(
            { error: "Error al obtener ciudades" },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, stateId } = body

        const { data: city, error } = await supabase
            .from('cities')
            .insert({
                name,
                state_id: stateId,
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(city, { status: 201 })
    } catch (error) {
        console.error("Error creating city:", error)
        return NextResponse.json(
            { error: "Error al crear ciudad" },
            { status: 500 }
        )
    }
}
