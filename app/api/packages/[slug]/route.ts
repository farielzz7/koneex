import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

/**
 * GET /api/packages/[slug]
 * Public endpoint - Returns complete package details by slug
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        const { slug } = params

        // Get package with all details
        const { data: packageData, error: packageError } = await supabase
            .from('packages')
            .select(`
                *,
                destination:destinations(
                    id,
                    name,
                    country,
                    state,
                    city,
                    description
                )
            `)
            .eq('slug', slug)
            .eq('status', 'ACTIVE')
            .single()

        if (packageError) {
            console.error('Error fetching package:', packageError)
            throw packageError
        }

        if (!packageData) {
            return NextResponse.json(
                { error: 'Paquete no encontrado' },
                { status: 404 }
            )
        }

        // Get itinerary days
        const { data: days, error: daysError } = await supabase
            .from('package_days')
            .select('*')
            .eq('package_id', packageData.id)
            .order('day_number', { ascending: true })

        if (daysError) {
            console.error('Error fetching days:', daysError)
        }

        // Transform to expected format
        const transformedPackage = {
            id: packageData.slug,
            slug: packageData.slug,
            title: packageData.title,
            description: packageData.description,
            shortDescription: packageData.short_description,
            destination: packageData.destination?.name || 'Destino desconocido',
            destinationData: packageData.destination,
            duration: `${packageData.duration_days} días / ${packageData.duration_nights} noches`,
            durationDays: packageData.duration_days,
            durationNights: packageData.duration_nights,
            price: packageData.price || 0,
            currency: packageData.currency_code || 'MXN',
            rating: packageData.rating || 0,
            reviews: packageData.reviews_count || 0,
            groupSize: packageData.group_size || 'Flexible',
            image: packageData.images?.[0] || '/placeholder.svg',
            images: packageData.images || [],
            featured: packageData.featured || false,
            tags: packageData.tags || [],
            includes: packageData.includes || [],
            excludes: packageData.excludes || [],
            itinerary: days?.map(day => ({
                dia: day.day_number,
                titulo: day.title,
                desc: day.description,
                activities: day.activities || []
            })) || []
        }

        return NextResponse.json(transformedPackage)
    } catch (error) {
        console.error('Error in package detail API:', error)
        return NextResponse.json(
            { error: 'Error al obtener el paquete' },
            { status: 500 }
        )
    }
}
