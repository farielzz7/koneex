import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// GET all promotions
export async function GET() {
    try {
        const { data: promotions, error } = await supabase
            .from('promotions')
            .select(`
                *,
                currencies (
                    code
                )
            `)
            .order('created_at', { ascending: false })

        if (error) throw error

        // Transform to match previous format
        const formattedPromotions = promotions?.map(promo => ({
            ...promo,
            currency: promo.currencies
        }))

        return NextResponse.json(formattedPromotions)
    } catch (error) {
        console.error("Error fetching promotions:", error)
        return NextResponse.json(
            { error: "Error al obtener promociones" },
            { status: 500 }
        )
    }
}

// CREATE new promotion
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const {
            code,
            name,
            type,
            value,
            currencyId,
            startsAt,
            endsAt,
            maxUses,
            isActive
        } = body

        const { data: promotion, error } = await supabase
            .from('promotions')
            .insert({
                code: code || null,
                name,
                type,
                value: parseFloat(value.toString()),
                currency_id: currencyId || null,
                starts_at: startsAt ? new Date(startsAt).toISOString() : null,
                ends_at: endsAt ? new Date(endsAt).toISOString() : null,
                max_uses: maxUses ? parseInt(maxUses.toString()) : null,
                is_active: isActive ?? false,
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(promotion, { status: 201 })
    } catch (error) {
        console.error("Error creating promotion:", error)
        return NextResponse.json(
            { error: "Error al crear promoción" },
            { status: 500 }
        )
    }
}
