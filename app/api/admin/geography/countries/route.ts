import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
    try {
        const { data: countries, error } = await supabase
            .from('countries')
            .select('*')
            .order('name', { ascending: true })

        if (error) throw error

        return NextResponse.json(countries)
    } catch (error) {
        console.error("Error fetching countries:", error)
        return NextResponse.json(
            { error: "Error al obtener países" },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, iso2 } = body

        const { data: country, error } = await supabase
            .from('countries')
            .insert({
                name,
                iso2: iso2 || null,
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(country, { status: 201 })
    } catch (error) {
        console.error("Error creating country:", error)
        return NextResponse.json(
            { error: "Error al crear país" },
            { status: 500 }
        )
    }
}
