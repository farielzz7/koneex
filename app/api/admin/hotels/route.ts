import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// GET all hotels
export async function GET() {
    try {
        const { data: hotels, error } = await supabase
            .from('hotels')
            .select(`
                *,
                cities (
                    name
                )
            `)
            .order('name', { ascending: true })

        if (error) throw error

        // Transform to match previous format
        const formattedHotels = hotels?.map(hotel => ({
            ...hotel,
            city: hotel.cities
        }))

        return NextResponse.json(formattedHotels)
    } catch (error) {
        console.error("Error fetching hotels:", error)
        return NextResponse.json(
            { error: "Error al obtener hoteles" },
            { status: 500 }
        )
    }
}

// CREATE new hotel
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, cityId, stars, isActive } = body

        const { data: hotel, error } = await supabase
            .from('hotels')
            .insert({
                name,
                city_id: cityId,
                stars: stars ? parseInt(stars.toString()) : null,
                is_active: isActive ?? true,
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(hotel, { status: 201 })
    } catch (error) {
        console.error("Error creating hotel:", error)
        return NextResponse.json(
            { error: "Error al crear hotel" },
            { status: 500 }
        )
    }
}
