import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import bcrypt from "bcryptjs"

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params
        const { data: user, error } = await supabase
            .from('users')
            .select(`
                *,
                agencies (
                    name
                )
            `)
            .eq('id', parseInt(id))
            .single()

        if (error) throw error
        return NextResponse.json(user)
    } catch (error) {
        console.error("Error fetching user:", error)
        return NextResponse.json(
            { error: "Error al obtener usuario" },
            { status: 500 }
        )
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params
        const body = await request.json()
        const { name, email, phone, role, agency_id, status, password } = body

        const updateData: any = {
            name,
            email,
            phone,
            role,
            agency_id: agency_id ? parseInt(agency_id) : null,
            status
        }

        if (password) {
            updateData.password = await bcrypt.hash(password, 10)
        }

        const { data: user, error } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', parseInt(id))
            .select()
            .single()

        if (error) throw error
        return NextResponse.json(user)
    } catch (error) {
        console.error("Error updating user:", error)
        return NextResponse.json(
            { error: "Error al actualizar usuario" },
            { status: 500 }
        )
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params
        const body = await request.json()
        const { status } = body

        const { data: user, error } = await supabase
            .from('users')
            .update({ status })
            .eq('id', parseInt(id))
            .select()
            .single()

        if (error) throw error
        return NextResponse.json(user)
    } catch (error) {
        console.error("Error patching user:", error)
        return NextResponse.json(
            { error: "Error al cambiar estado del usuario" },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', parseInt(id))

        if (error) throw error
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting user:", error)
        return NextResponse.json(
            { error: "Error al eliminar usuario. Puede tener pedidos o revisiones asociadas." },
            { status: 500 }
        )
    }
}
