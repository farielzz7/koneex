import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params

        // Fetch Booking with Customer and Items
        // Note: in schema_v5, relations might be named differently, check keys. 
        // Assuming standard naming: customers(id), booking_items(booking_id), payments(booking_id).

        // Using simple query structure
        const { data: booking, error } = await supabase
            .from('bookings')
            .select(`
            *,
            customer:customers(*),
            items:booking_items(*),
            payments(*)
        `)
            .eq('id', id)
            .single()

        if (error) throw error

        return NextResponse.json(booking)

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
