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
            destination_id,
            title,
            slug,
            description,
            short_description,
            duration_days,
            duration_nights,
            price,
            currency_code,
            rating,
            group_size,
            featured,
            tags,
            images,
            includes,
            excludes,
            status,
            itinerary // Array of days
        } = body

        // Generate slug if not provided
        const packageSlug = slug || title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')

        // Create the package
        const { data: newPackage, error: pkgError } = await supabase
            .from('packages')
            .insert({
                destination_id,
                title,
                slug: packageSlug,
                description,
                short_description,
                duration_days: duration_days || 1,
                duration_nights: duration_nights || 0,
                price: price || 0,
                currency_code: currency_code || 'MXN',
                rating: rating || 0,
                reviews_count: 0,
                group_size: group_size || 'Flexible',
                featured: featured || false,
                tags: tags || [],
                images: images || [],
                includes: includes || [],
                excludes: excludes || [],
                status: status || 'DRAFT'
            })
            .select()
            .single()

        if (pkgError) {
            console.error('Error creating package:', pkgError)
            throw pkgError
        }

        // Insert itinerary days if provided
        if (itinerary && Array.isArray(itinerary) && itinerary.length > 0) {
            const daysToInsert = itinerary.map((day: any, index: number) => ({
                package_id: newPackage.id,
                day_number: day.day_number || index + 1,
                title: day.title,
                description: day.description,
                activities: day.activities || [],
                order_index: index
            }))

            const { error: daysError } = await supabase
                .from('package_days')
                .insert(daysToInsert)

            if (daysError) {
                console.error('Error inserting days:', daysError)
                // Continue even if days fail
            }
        }

        return NextResponse.json(newPackage, { status: 201 })
    } catch (error) {
        console.error('Error creating package:', error)
        return NextResponse.json(
            { error: `Error al crear paquete: ${error instanceof Error ? error.message : 'Error desconocido'}` },
            { status: 500 }
        )
    }
}
