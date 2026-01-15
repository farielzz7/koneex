import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// GET all orders
export async function GET() {
    try {
        const { data: orders, error } = await supabase
            .from('orders')
            .select(`
                *,
                users!orders_customer_id_fkey (
                    id,
                    name,
                    email
                ),
                order_items(count)
            `)
            .order('created_at', { ascending: false })

        if (error) throw error

        // Transform to meet UI expectations
        const formattedOrders = orders?.map(order => ({
            ...order,
            customer: order.users,
            _count: { items: order.order_items?.[0]?.count || 0 }
        }))

        return NextResponse.json(formattedOrders)
    } catch (error) {
        console.error("Error fetching orders:", error)
        return NextResponse.json(
            { error: "Error al obtener órdenes" },
            { status: 500 }
        )
    }
}

// CREATE new order
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const {
            customerId,
            currencyCode,
            status,
            items,
            subtotal,
            discountTotal,
            taxTotal,
            total
        } = body

        if (!items || items.length === 0) {
            return NextResponse.json(
                { error: "La orden debe tener al menos un item" },
                { status: 400 }
            )
        }

        // 1. Crear la orden base (order_number se genera en DB)
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                customer_id: customerId,
                currency_code: currencyCode || 'USD',
                status: status || 'DRAFT',
                subtotal: parseFloat((subtotal || 0).toString()),
                discount_total: parseFloat((discountTotal || 0).toString()),
                tax_total: parseFloat((taxTotal || 0).toString()),
                total: parseFloat((total || 0).toString()),
            })
            .select()
            .single()

        if (orderError) throw orderError

        // 2. Crear items de la orden
        const orderItems = items.map((item: any) => ({
            order_id: order.id,
            package_id: item.packageId,
            departure_id: item.departureId,
            title: item.title || 'Servicio de Viaje',
            item_type: item.itemType || 'PACKAGE',
            quantity: item.quantity || 1,
            unit_price: parseFloat((item.unitPrice || 0).toString()),
            total_price: parseFloat(((item.quantity || 1) * (item.unitPrice || 0)).toString()),
            pax_adults: item.paxAdults || 0,
            pax_children: item.paxChildren || 0,
            pax_infants: item.paxInfants || 0,
            details: item.details || {}
        }))

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems as any)

        if (itemsError) throw itemsError

        // 3. Devolver la orden completa
        const { data: completeOrder, error: fetchError } = await supabase
            .from('orders')
            .select(`
                *,
                order_items (*),
                users!orders_customer_id_fkey (*)
            `)
            .eq('id', order.id)
            .single()

        if (fetchError) throw fetchError

        const formattedOrder = {
            ...completeOrder,
            items: completeOrder.order_items,
            customer: completeOrder.users
        }

        return NextResponse.json(formattedOrder, { status: 201 })
    } catch (error) {
        console.error("Error creating order:", error)
        return NextResponse.json(
            { error: `Error al crear orden: ${error instanceof Error ? error.message : 'Error desconocido'}` },
            { status: 500 }
        )
    }
}
