import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// GET all departures
export async function GET() {
    try {
        const { data: departures, error } = await supabase
            .from('departures')
            .select(`
                *,
                packages (
                    title
                ),
                currencies (
                    code
                )
            `)
            .order('start_date', { ascending: false })

        if (error) throw error

        // Transform to match previous format
        const formattedDepartures = departures?.map(dep => ({
            ...dep,
            package: dep.packages,
            currency: dep.currencies
        }))

        return NextResponse.json(formattedDepartures)
    } catch (error) {
        console.error("Error fetching departures:", error)
        return NextResponse.json(
            { error: "Error al obtener salidas" },
            { status: 500 }
        )
    }
}

// CREATE new departure
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { packageId, startDate, endDate, basePrice, capacity, currencyId, isActive } = body

        const { data: departure, error } = await supabase
            .from('departures')
            .insert({
                package_id: packageId,
                start_date: new Date(startDate).toISOString(),
                end_date: new Date(endDate).toISOString(),
                base_price: parseFloat(basePrice.toString()),
                capacity: capacity ? parseInt(capacity.toString()) : null,
                currency_id: currencyId,
                is_active: isActive ?? true,
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(departure, { status: 201 })
    } catch (error) {
        console.error("Error creating departure:", error)
        return NextResponse.json(
            { error: "Error al crear salida" },
            { status: 500 }
        )
    }
}
