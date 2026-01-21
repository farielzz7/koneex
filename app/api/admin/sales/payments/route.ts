import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { booking_id, amount, method, provider_reference, notes } = body

        if (!booking_id || !amount) {
            return NextResponse.json({ error: "Faltan datos (booking_id, amount)" }, { status: 400 })
        }

        // 1. Get current booking info
        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .select('total_amount, paid_amount, status')
            .eq('id', booking_id)
            .single()

        if (bookingError || !booking) {
            return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 })
        }

        // 2. Insert Payment
        const { data: payment, error: payError } = await supabase
            .from('payments')
            .insert({
                booking_id,
                amount,
                method,
                status: 'PAID', // Assuming direct admin registration is confirmed
                provider_reference,
                notes,
                processed_at: new Date().toISOString()
            })
            .select()
            .single()

        if (payError) throw payError

        // 3. Update Booking PaId Amount & Status
        const newPaidAmount = Number(booking.paid_amount) + Number(amount)
        let newStatus = booking.status

        // Auto-status update rule
        if (newPaidAmount >= Number(booking.total_amount)) {
            newStatus = 'COMPLETED' // Or fully paid? Adjust enum as needed. Usually 'CONFIRMED' or 'PAID'
            // In our enum we have 'COMPLETED' or 'CONFIRMED'. Let's say CONFIRMED is active, COMPLETED is trip done.
            // Maybe we just keep CONFIRMED if it was pending?
            if (booking.status === 'PENDING') newStatus = 'CONFIRMED'
        } else if (booking.status === 'PENDING' && newPaidAmount > 0) {
            newStatus = 'ON_HOLD' // Partial payment?
        }

        const { error: updateError } = await supabase
            .from('bookings')
            .update({
                paid_amount: newPaidAmount,
                status: newStatus
            })
            .eq('id', booking_id)

        if (updateError) throw updateError

        return NextResponse.json({ success: true, payment, new_status: newStatus, new_paid: newPaidAmount })

    } catch (err: any) {
        console.error("Error creating payment:", err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
