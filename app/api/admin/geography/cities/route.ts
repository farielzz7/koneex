import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
    try {
        const { data: cities, error } = await supabase
            .from('cities')
            .select(`
                *,
                countries (
                    name
                )
            `)
            .order('name', { ascending: true })

        if (error) throw error

        // Transform for UI - countries join will be nested
        const formattedCities = cities?.map(city => ({
            ...city,
            country_name: city.countries?.name
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
        const { name, country_id, state, latitude, longitude } = body

        if (!name || !country_id) {
            return NextResponse.json({ error: "Nombre y ID de país son requeridos" }, { status: 400 })
        }

        const { data: city, error } = await supabase
            .from('cities')
            .insert({
                name,
                country_id,
                state: state || null,
                latitude: latitude || null,
                longitude: longitude || null
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(city, { status: 201 })
    } catch (error) {
        console.error("Error creating city:", error)
        return NextResponse.json(
            { error: `Error al crear ciudad: ${error instanceof Error ? error.message : 'Error desconocido'}` },
            { status: 500 }
        )
    }
}
