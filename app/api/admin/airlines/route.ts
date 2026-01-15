import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// GET all airlines
export async function GET() {
    try {
        const { data: airlines, error } = await supabase
            .from('airlines')
            .select('*')
            .order('name', { ascending: true })

        if (error) throw error

        return NextResponse.json(airlines)
    } catch (error) {
        console.error("Error fetching airlines:", error)
        return NextResponse.json(
            { error: "Error al obtener aerolíneas" },
            { status: 500 }
        )
    }
}

// CREATE new airline
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, iataCode, isActive } = body

        const { data: airline, error } = await supabase
            .from('airlines')
            .insert({
                name,
                iata_code: iataCode || null,
                is_active: isActive ?? true,
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(airline, { status: 201 })
    } catch (error) {
        console.error("Error creating airline:", error)
        return NextResponse.json(
            { error: "Error al crear aerolínea" },
            { status: 500 }
        )
    }
}
