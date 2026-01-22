import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// GET single package with all relations
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const pkgId = parseInt(id)

        if (isNaN(pkgId)) {
            return NextResponse.json({ error: "ID inválido" }, { status: 400 })
        }

        const { data: pkg, error } = await supabase
            .from('packages')
            .select('*')
            .eq('id', pkgId)
            .single()

        if (error) throw error
        if (!pkg) {
            return NextResponse.json(
                { error: "Paquete no encontrado" },
                { status: 404 }
            )
        }

        return NextResponse.json(pkg)
    } catch (error) {
        console.error("Error fetching package:", error)
        return NextResponse.json(
            { error: "Error al obtener paquete" },
            { status: 500 }
        )
    }
}

// UPDATE package
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const pkgId = parseInt(id)
        if (isNaN(pkgId)) return NextResponse.json({ error: "ID inválido" }, { status: 400 })

        const body = await request.json()

        // Prepare update object - only include defined fields
        const updateData: any = {
            updated_at: new Date().toISOString()
        }

        // Map all possible fields
        const allowedFields = [
            'destination_id', 'title', 'slug', 'description', 'short_description',
            'duration_days', 'duration_nights', 'price', 'currency_code',
            'rating', 'group_size', 'featured', 'tags', 'images',
            'includes', 'excludes', 'status'
        ]

        allowedFields.forEach(field => {
            if (body[field] !== undefined) {
                updateData[field] = body[field]
            }
        })

        const { data: pkg, error } = await supabase
            .from('packages')
            .update(updateData)
            .eq('id', pkgId)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(pkg)
    } catch (error) {
        console.error("Error updating package:", error)
        return NextResponse.json(
            { error: `Error al actualizar paquete: ${error instanceof Error ? error.message : 'Error desconocido'}` },
            { status: 500 }
        )
    }
}

// DELETE package
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const pkgId = parseInt(id)
        if (isNaN(pkgId)) return NextResponse.json({ error: "ID inválido" }, { status: 400 })

        const { error } = await supabase
            .from('packages')
            .delete()
            .eq('id', pkgId)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting package:", error)
        return NextResponse.json(
            { error: "Error al eliminar paquete" },
            { status: 500 }
        )
    }
}

// PATCH - Toggle status
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const pkgId = parseInt(id)
        if (isNaN(pkgId)) return NextResponse.json({ error: "ID inválido" }, { status: 400 })

        const body = await request.json()
        const { status } = body

        const { data: pkg, error } = await supabase
            .from('packages')
            .update({
                status: status || 'DRAFT',
                updated_at: new Date().toISOString(),
            })
            .eq('id', pkgId)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(pkg)
    } catch (error) {
        console.error("Error toggling package status:", error)
        return NextResponse.json(
            { error: "Error al cambiar estado del paquete" },
            { status: 500 }
        )
    }
}
