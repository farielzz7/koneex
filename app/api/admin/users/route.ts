import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import bcrypt from "bcryptjs"

// GET all users
export async function GET() {
    try {
        const { data: users, error } = await supabase
            .from('users')
            .select(`
                *
            `)
            .order('registered_at', { ascending: false })

        if (error) throw error

        return NextResponse.json(users)
    } catch (error) {
        console.error("Error fetching users:", error)
        return NextResponse.json(
            { error: "Error al obtener usuarios" },
            { status: 500 }
        )
    }
}

// CREATE new user
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, name, password, role } = body

        if (!email || !name || !password) {
            return NextResponse.json(
                { error: "Faltan campos obligatorios" },
                { status: 400 }
            )
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10)

        const { data: newUser, error } = await supabase
            .from('users')
            .insert({
                email,
                name,
                password: hashedPassword,
                role: (role as any) || 'CUSTOMER',
                status: 'ACTIVE'
            })
            .select()
            .single()

        if (error) {
            if (error.code === '23505') {
                return NextResponse.json(
                    { error: "El email ya está registrado" },
                    { status: 400 }
                )
            }
            throw error
        }

        return NextResponse.json(newUser, { status: 201 })
    } catch (error) {
        console.error("Error creating user:", error)
        return NextResponse.json(
            { error: "Error al crear usuario" },
            { status: 500 }
        )
    }
}
