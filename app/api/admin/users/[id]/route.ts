import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import bcrypt from "bcryptjs"

interface Params {
    params: {
        id: string
    }
}

// UPDATE user
export async function PUT(request: Request, props: { params: Promise<Params['params']> }) {
    try {
        const params = await props.params
        const body = await request.json()
        const { email, name, password, role, phone, status } = body
        const userId = parseInt(params.id)

        if (isNaN(userId)) {
            return NextResponse.json(
                { error: "ID de usuario inválido" },
                { status: 400 }
            )
        }

        const updateData: any = {
            email,
            name,
            role,
            phone,
            status,
            updated_at: new Date().toISOString()
        }

        // Si se proporciona una nueva contraseña, encriptarla
        if (password && password.trim() !== "") {
            updateData.password = await bcrypt.hash(password, 10)
        }

        const { data: updatedUser, error } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', userId)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(updatedUser)
    } catch (error) {
        console.error("Error updating user:", error)
        return NextResponse.json(
            { error: "Error al actualizar usuario" },
            { status: 500 }
        )
    }
}

// DELETE user
export async function DELETE(request: Request, props: { params: Promise<Params['params']> }) {
    try {
        const params = await props.params
        const userId = parseInt(params.id)

        if (isNaN(userId)) {
            return NextResponse.json(
                { error: "ID de usuario inválido" },
                { status: 400 }
            )
        }

        // Soft delete para mantener integridad referencial
        const { error } = await supabase
            .from('users')
            .update({
                deleted_at: new Date().toISOString(),
                status: 'BLOCKED'
            })
            .eq('id', userId)

        if (error) {
            // Si el error es por violacion de FK y estamos intentando borrar fisicamente
            // la solucion es soft delete. Si falla el update es otro problema.
            throw error
        }

        return NextResponse.json({ message: "Usuario eliminado correctamente" })
    } catch (error) {
        console.error("Error deleting user:", error)
        return NextResponse.json(
            { error: "Error al eliminar usuario" },
            { status: 500 }
        )
    }
}
