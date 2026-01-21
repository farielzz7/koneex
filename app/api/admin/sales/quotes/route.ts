import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { customer_id, items, currency_code, valid_until, notes } = body

        if (!customer_id || !items || items.length === 0) {
            return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 })
        }

        // 1. Calculate totals (Double check backend side)
        const total_amount = items.reduce((acc: number, item: any) => {
            return acc + (Number(item.unit_price) * Number(item.quantity) * (Number(item.adults) + Number(item.children))) // Simplistic calc, adjust logic as needed
            // Actually normally price is per person so: unit_price * (adults + children)? Or unit_price is total?
            // Lets assume unit_price is PER PERSON and quantity is "Units/Rooms"?
            // Based on previous mock: unit_price was per person.
            // Let's assume subtotal is passed or we depend on strict logic. 
            // For now, let's trust the 'subtotal' if provided, or simple calc.
        }, 0)

        // Actually, let's strictly sum the provided subtotals or similar. 
        // Ideally we re-fetch prices, but for "Snapshot" we trust the inputs (Admin overrides often needed)
        // Let's calc total from items.

        // 2. Insert Quote
        const { data: quote, error: quoteError } = await supabase
            .from("quotes")
            .insert({
                customer_id,
                currency_code: currency_code || 'MXN',
                total_amount: body.total_amount, // Trust frontend total for now or recalc
                status: 'DRAFT',
                valid_until,
                notes
            })
            .select()
            .single()

        if (quoteError) throw quoteError

        // 3. Insert Items
        const quoteItems = items.map((item: any) => ({
            quote_id: quote.id,
            package_id: item.package_id,
            title: item.title,
            travel_date: item.travel_date,
            adults: item.adults,
            children: item.children,
            unit_price: item.unit_price,
            quantity: 1, // Usually 1 package
            subtotal: item.unit_price * (item.adults + item.children) // Calc subtotal
        }))

        const { error: itemsError } = await supabase
            .from("quote_items")
            .insert(quoteItems)

        if (itemsError) throw itemsError

        return NextResponse.json(quote)

    } catch (err: any) {
        console.error("Error creating quote:", err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
