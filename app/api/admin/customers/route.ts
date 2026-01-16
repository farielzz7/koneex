import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// GET all customers
export async function GET() {
    try {
        const { data: customers, error } = await supabase
            .from('customers')
            .select(`
                *,
                users (
                    name,
                    email
                ),
                orders(count)
            `)
            .order('created_at', { ascending: false })
            // @ts-ignore
            .is('deleted_at', null)

        if (error) throw error

        // Transform to match previous format
        const formattedCustomers = customers?.map(customer => ({
            ...customer,
            user: customer.users,
            _count: { orders: customer.orders?.[0]?.count || 0 }
        }))

        return NextResponse.json(formattedCustomers)
    } catch (error) {
        console.error("Error fetching customers:", error)
        return NextResponse.json(
            { error: "Error al obtener clientes" },
            { status: 500 }
        )
    }
}

// CREATE new customer (without password)
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, phone } = body

        // Check if email already exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single()

        if (existingUser) {
            return NextResponse.json(
                { error: "El email ya está registrado" },
                { status: 400 }
            )
        }

        // Create user first
        const { data: user, error: userError } = await supabase
            .from('users')
            .insert({
                name,
                email,
                role: 'CUSTOMER',
            })
            .select()
            .single()

        if (userError) throw userError

        // Create customer linked to user
        const { data: customer, error: customerError } = await supabase
            .from('customers')
            .insert({
                user_id: user.id,
                phone: phone || null,
            })
            .select()
            .single()

        if (customerError) throw customerError

        return NextResponse.json(customer, { status: 201 })
    } catch (error) {
        console.error("Error creating customer:", error)
        return NextResponse.json(
            { error: "Error al crear cliente" },
            { status: 500 }
        )
    }
}
