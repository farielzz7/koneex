import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// GET all packages
export async function GET() {
    try {
        const { data: packages, error } = await supabase
            .from('packages')
            .select(`
                *,
                destination:destinations(
                    id,
                    name,
                    country,
                    city
                )
            `)
            .order('created_at', { ascending: false })

        if (error) {
            console.error("Supabase error:", error)
            throw error
        }

        return NextResponse.json(packages || [])
    } catch (error) {
        console.error("Error fetching packages:", error)
        return NextResponse.json(
            { error: "Error al obtener paquetes", details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}

// CREATE new package
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const {
            title,
            slug,
            subtitle,
            product_type,
            description,
            short_description,
            duration_days,
            duration_nights,
            currency_code,
            from_price,
            status,
            confirmation_mode,
            highlights,
            includes,
            excludes,
            media // Array of { url, media_type, is_cover }
        } = body

        // 1. Crear el paquete base
        const { data: newPackage, error: pkgError } = await supabase
            .from('packages')
            .insert({
                title,
                slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
                subtitle,
                product_type: product_type || 'HOTEL_PACKAGE',
                description,
                short_description,
                duration_days,
                duration_nights,
                currency_code: currency_code || 'USD',
                from_price: from_price || 0,
                status: status || 'DRAFT',
                confirmation_mode: confirmation_mode || 'ON_REQUEST',
                highlights: highlights || [],
                includes: includes || [],
                excludes: excludes || []
            })
            .select()
            .single()

        if (pkgError) throw pkgError

        // 2. Insertar media si existe
        if (media && Array.isArray(media) && media.length > 0) {
            const mediaToInsert = media.map((m, index) => ({
                package_id: newPackage.id as number,
                url: m.url,
                media_type: m.media_type || 'IMAGE',
                is_cover: m.is_cover || index === 0,
                position: index
            }))

            const { error: mediaError } = await supabase
                .from('package_media')
                .insert(mediaToInsert as any)

            if (mediaError) {
                console.error("Error inserting media, but package was created:", mediaError)
            }
        }

        return NextResponse.json(newPackage, { status: 201 })
    } catch (error) {
        console.error("Error creating package:", error)
        return NextResponse.json(
            { error: `Error al crear paquete: ${error instanceof Error ? error.message : 'Error desconocido'}` },
            { status: 500 }
        )
    }
}
