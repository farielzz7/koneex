import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const url = searchParams.get('url')

        if (!url) {
            return NextResponse.json(
                { error: 'URL is required' },
                { status: 400 }
            )
        }

        let platform: 'instagram' | 'facebook'
        let oEmbedUrl: string

        if (url.includes('instagram.com')) {
            platform = 'instagram'
            const token = process.env.INSTAGRAM_ACCESS_TOKEN

            if (!token) {
                return NextResponse.json(
                    { error: 'Instagram token not configured', message: 'Configura INSTAGRAM_ACCESS_TOKEN en .env.local' },
                    { status: 500 }
                )
            }

            oEmbedUrl = `https://graph.facebook.com/v18.0/instagram_oembed?url=${encodeURIComponent(url)}&access_token=${token}`
        } else if (url.includes('facebook.com')) {
            platform = 'facebook'
            const token = process.env.FACEBOOK_ACCESS_TOKEN

            if (!token) {
                return NextResponse.json(
                    { error: 'Facebook token not configured', message: 'Configura FACEBOOK_ACCESS_TOKEN en .env.local' },
                    { status: 500 }
                )
            }

            oEmbedUrl = `https://graph.facebook.com/v18.0/oembed_post?url=${encodeURIComponent(url)}&access_token=${token}`
        } else {
            return NextResponse.json(
                { error: 'Invalid platform', message: 'La URL debe ser de Instagram o Facebook' },
                { status: 400 }
            )
        }

        console.log(`[oEmbed] Fetching ${platform} post...`)

        const response = await fetch(oEmbedUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            console.error('[oEmbed] Error:', errorData)

            return NextResponse.json(
                {
                    error: 'Failed to fetch post',
                    message: 'No se pudo cargar el post. Verifica que sea público y la URL sea correcta.',
                    details: errorData
                },
                { status: response.status }
            )
        }

        const data = await response.json()

        return NextResponse.json({
            platform,
            original_url: url,
            html: data.html || '',
            author_name: data.author_name || 'Unknown',
            author_url: data.author_url,
            thumbnail_url: data.thumbnail_url,
            width: data.width,
            height: data.height,
        })

    } catch (error) {
        console.error('[oEmbed] Error:', error)
        return NextResponse.json(
            {
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Error desconocido'
            },
            { status: 500 }
        )
    }
}
