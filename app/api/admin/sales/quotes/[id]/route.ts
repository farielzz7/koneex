import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {

    try {
        const { data: quote, error } = await supabase
            .from("quotes")
            .select(`
                *,
                customer:customers(*),
                items:quote_items(*, package:packages(title))
            `)
            .eq("id", params.id)
            .single()

        if (error) throw error

        return NextResponse.json(quote)
    } catch (error) {
        console.error("Error fetching quote:", error)
        return NextResponse.json(
            { error: "Error fetching quote details" },
            { status: 500 }
        )
    }
}
