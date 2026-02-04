import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params

        const { data: order, error } = await supabase
            .from('orders')
            .select(`
                *,
                users!orders_customer_id_fkey (
                    id,
                    name,
                    email
                ),
                order_items (
                    *,
                    packages (
                        id,
                        title,
                        images
                    )
                )
            `)
            .eq('id', parseInt(id))
            .single()

        if (error) throw error

        const formattedOrder = {
            ...order,
            customer: order.users,
            items: order.order_items.map((item: any) => ({
                ...item,
                package: item.packages
            }))
        }

        return NextResponse.json(formattedOrder)
    } catch (error) {
        console.error("Error fetching order detail:", error)
        return NextResponse.json(
            { error: "Error al obtener detalles de la orden" },
            { status: 500 }
        )
    }
}
