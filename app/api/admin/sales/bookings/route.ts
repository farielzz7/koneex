import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: Request) {

    try {
        const body = await request.json()
        const { quote_id, customer_id, items, ...rest } = body

        // Start transaction (conceptually, Supabase doesn't support full SQL transactions via JS client easily yet 
        // without RPC, but we'll do sequential ops with error handling)

        let bookingData: any = {
            customer_id,
            status: 'PENDING',
            created_at: new Date().toISOString(),
            ...rest
        }

        // 1. If from Quote, fetch extra data if needed, or rely on body
        if (quote_id) {
            // Update Quote Status
            const { error: quoteUpdateError } = await supabase
                .from('quotes')
                .update({ status: 'ACCEPTED' })
                .eq('id', quote_id)

            if (quoteUpdateError) console.error("Error updating quote status:", quoteUpdateError)

            bookingData.quote_id = quote_id

            // If items not provided in body, fetch from quote (optional, but body usually carries them)
            // Ideally we trust the body or re-fetch for security. For admin app, body is okay.
            // But let's fetch quote items to be safe if items array is empty
            if (!items || items.length === 0) {
                const { data: quoteItems } = await supabase
                    .from('quote_items')
                    .select('*')
                    .eq('quote_id', quote_id)

                // Map quote items to booking items structure
                // Note: booking_items might have slightly different schema if we normalized it differently, 
                // but in our schema they are very similar.
                // We need to remove 'quote_id' and add 'booking_id' later.
            }
        }

        // 2. Create Booking
        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .insert(bookingData)
            .select()
            .single()

        if (bookingError) throw bookingError

        // 3. Create Booking Items
        // If we have items in the body (which we should, even from convert), insert them
        if (items && items.length > 0) {
            const bookingItems = items.map((item: any) => ({
                booking_id: booking.id,
                package_id: item.package_id,
                title: item.title,
                travel_date: item.travel_date,
                adults: item.adults,
                children: item.children,
                unit_price: item.unit_price,
                quantity: item.quantity,
                subtotal: item.subtotal
            }))

            const { error: itemsError } = await supabase
                .from('booking_items')
                .insert(bookingItems)

            if (itemsError) {
                // In a real app we might delete the booking effectively rolling back
                console.error("Error creating booking items:", itemsError)
                throw itemsError
            }
        }

        return NextResponse.json(booking)

    } catch (error: any) {
        console.error("Error creating booking:", error)
        return NextResponse.json(
            { error: error.message || "Error creating booking" },
            { status: 500 }
        )
    }
}
