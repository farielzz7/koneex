import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
    try {
        const { data: currencies, error } = await supabase
            .from('currencies')
            .select('*')
            .order('code')

        if (error) throw error

        return NextResponse.json(currencies || [])
    } catch (error) {
        console.error("Error fetching currencies:", error)
        return NextResponse.json(
            { error: "Error al obtener monedas" },
            { status: 500 }
        )
    }
}
