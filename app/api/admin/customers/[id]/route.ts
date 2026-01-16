import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id

        // 1. Get the customer first to find the user_id
        // @ts-ignore
        const { data: customer, error: fetchError } = await supabase
            .from('customers')
            .select('user_id')
            .eq('id', id)
            .single()

        if (fetchError) {
            return NextResponse.json(
                { error: "Cliente no encontrado" },
                { status: 404 }
            )
        }

        // @ts-ignore
        if (customer && customer.user_id) {
            // 2. Soft delete the user (this will prevent login)
            const { error: userError } = await supabase
                .from('users')
                .update({
                    deleted_at: new Date().toISOString(),
                    status: 'BLOCKED' // Also block access just in case
                })
                // @ts-ignore
                .eq('id', customer.user_id)

            if (userError) {
                console.error("Error deleting user:", userError)
            }
        }

        // 3. Soft delete the customer record
        // @ts-ignore
        const { error: deleteError } = await supabase
            .from('customers')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', id)

        if (deleteError) {
            // Fallback to hard delete if update fails (e.g. column doesn't exist)
            // or specific error handling
            throw deleteError
        }

        return NextResponse.json({ message: "Cliente eliminado correctamente" })
    } catch (error) {
        console.error("Error deleting customer:", error)
        return NextResponse.json(
            { error: "Error al eliminar cliente" },
            { status: 500 }
        )
    }
}
