import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

/**
 * GET /api/packages
 * Public endpoint - Returns all ACTIVE packages for the public website
 */
export async function GET() {
    try {
        const { data: packages, error } = await supabase
            .from('packages')
            .select(`
                id,
                slug,
                title,
                short_description,
                description,
                duration_days,
                duration_nights,
                price,
                currency_code,
                rating,
                reviews_count,
                group_size,
                featured,
                tags,
                images,
                destination:destinations(
                    id,
                    name,
                    country,
                    state,
                    city
                )
            `)
            .eq('status', 'ACTIVE')
            .order('featured', { ascending: false })
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching packages:', error)
            throw error
        }

        // Transform data to match expected format
        const transformedPackages = packages?.map(pkg => ({
            id: pkg.slug, // Use slug as ID for URLs
            slug: pkg.slug,
            title: pkg.title,
            description: pkg.short_description || pkg.description?.substring(0, 150),
            destination: pkg.destination?.name || 'Destino desconocido',
            duration: `${pkg.duration_days} días / ${pkg.duration_nights} noches`,
            price: pkg.price || 0,
            currency: pkg.currency_code || 'MXN',
            rating: pkg.rating || 0,
            reviews: pkg.reviews_count || 0,
            groupSize: pkg.group_size || 'Flexible',
            image: pkg.images?.[0] || '/placeholder.svg',
            images: pkg.images || [],
            featured: pkg.featured || false,
            tags: pkg.tags || [],
            destinationData: pkg.destination
        })) || []

        return NextResponse.json(transformedPackages)
    } catch (error) {
        console.error('Error in packages API:', error)
        return NextResponse.json(
            { error: 'Error al obtener paquetes' },
            { status: 500 }
        )
    }
}
