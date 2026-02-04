// Script para verificar conexión a Supabase y datos
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Verificando configuración de Supabase...')
console.log('URL:', supabaseUrl ? ' Configurada' : ' No configurada')
console.log('Key:', supabaseKey ? ' Configurada' : ' No configurada')

if (!supabaseUrl || !supabaseKey) {
    console.error(' Faltan credenciales de Supabase en .env.local')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkDatabase() {
    console.log('\n Verificando tablas...\n')

    // Check destinations
    console.log('1️⃣ Verificando DESTINATIONS...')
    const { data: destinations, error: destError } = await supabase
        .from('destinations')
        .select('id, name, country')
        .limit(5)

    if (destError) {
        console.error('❌ Error:', destError.message)
    } else {
        console.log(`✅ ${destinations?.length || 0} destinos encontrados`)
        if (destinations && destinations.length > 0) {
            console.log('   Ejemplo:', destinations[0])
        }
    }

    // Check airlines
    console.log('\n2️⃣ Verificando AIRLINES...')
    const { data: airlines, error: airError } = await supabase
        .from('airlines')
        .select('id, name, iata_code')
        .limit(5)

    if (airError) {
        console.error('❌ Error:', airError.message)
    } else {
        console.log(`✅ ${airlines?.length || 0} aerolíneas encontradas`)
        if (airlines && airlines.length > 0) {
            console.log('   Ejemplo:', airlines[0])
        }
    }

    // Check hotels
    console.log('\n3️⃣ Verificando HOTELS...')
    const { data: hotels, error: hotelError } = await supabase
        .from('hotels')
        .select('id, name, stars')
        .limit(5)

    if (hotelError) {
        console.error('❌ Error:', hotelError.message)
    } else {
        console.log(`✅ ${hotels?.length || 0} hoteles encontrados`)
        if (hotels && hotels.length > 0) {
            console.log('   Ejemplo:', hotels[0])
        }
    }

    // Check providers
    console.log('\n4️⃣ Verificando PROVIDERS...')
    const { data: providers, error: provError } = await supabase
        .from('providers')
        .select('id, name, type')
        .limit(5)

    if (provError) {
        console.error('❌ Error:', provError.message)
    } else {
        console.log(` ${providers?.length || 0} proveedores encontrados`)
        if (providers && providers.length > 0) {
            console.log('   Ejemplo:', providers[0])
        }
    }

    console.log('\n✨ Verificación completa')
}

checkDatabase().catch(console.error)
