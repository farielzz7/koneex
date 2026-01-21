import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// GET all customers
export async function GET() {
    try {
        const { data: customers, error } = await supabase
            .from('users')
            .select(`
                *,
                orders(count)
            `)
            .eq('role', 'CUSTOMER')
            .is('deleted_at', null)
            .order('created_at', { ascending: false })

        if (error) throw error

        // Transform to match UI expectation
        const formattedCustomers = customers?.map(user => ({
            id: user.id.toString(), // UI expects string
            phone: user.phone,
            createdAt: user.created_at,
            user: {
                name: user.name,
                email: user.email
            },
            _count: { orders: user.orders?.[0]?.count || 0 }
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

// CREATE new customer (as a User with role CUSTOMER)
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

        // Generate a random temporary password or handled by invite flow (here simple hash)
        // In a real app, you might trigger an email invite.
        // For now, we set a default password that they should reset.
        const defaultPassword = "password123"
        // Note: In a real scenario, use bcrypt to hash this if not using Supabase Auth built-in
        // But since we are using custom auth with bcrypt in this project:
        const bcrypt = require('bcryptjs')
        const hashedPassword = await bcrypt.hash(defaultPassword, 10)

        // Create user
        const { data: user, error: userError } = await supabase
            .from('users')
            .insert({
                name,
                email,
                password: hashedPassword,
                role: 'CUSTOMER',
                phone: phone || null,
                status: 'ACTIVE'
            })
            .select()
            .single()

        if (userError) throw userError

        // Return user formatted as customer
        return NextResponse.json({
            id: user.id.toString(),
            phone: user.phone,
            createdAt: user.created_at,
            user: {
                name: user.name,
                email: user.email
            },
            _count: { orders: 0 }
        }, { status: 201 })

    } catch (error: any) {
        console.error("Error creating customer:", error)
        return NextResponse.json(
            { error: error?.message || "Error al crear cliente" },
            { status: 500 }
        )
    }
}
