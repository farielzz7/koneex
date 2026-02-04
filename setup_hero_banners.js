// Script simplificado para configurar hero banners
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🚀 Configurando Hero Banners...\n')

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: No se encontraron las credenciales de Supabase')
    console.error('   Verifica que .env.local tenga NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function setup() {
    // Verificar si la tabla existe
    console.log('1️⃣ Verificando tabla hero_banners...')
    const { data, error } = await supabase
        .from('hero_banners')
        .select('id')
        .limit(1)

    if (error) {
        console.log('❌ La tabla hero_banners no existe todavía')
        console.log('\n📋 INSTRUCCIONES:')
        console.log('   1. Ve a Supabase Dashboard > SQL Editor')
        console.log('   2. Abre el archivo: migrations/create_hero_banners.sql')
        console.log('   3. Copia y pega todo el contenido en el SQL Editor')
        console.log('   4. Presiona RUN para ejecutar la migración')
    } else {
        console.log('✅ Tabla hero_banners existe!\n')
    }

    // Verificar bucket
    console.log('2️⃣ Verificando Storage bucket...')
    const { data: buckets } = await supabase.storage.listBuckets()
    const hasBucket = buckets?.find(b => b.name === 'hero-banners')

    if (!hasBucket) {
        console.log('📦 Intentando crear bucket hero-banners...')
        const { error: bucketError } = await supabase.storage.createBucket('hero-banners', {
            public: true,
            fileSizeLimit: 5242880
        })

        if (bucketError) {
            console.log('❌ No se pudo crear el bucket automáticamente')
            console.log('\n📋 CREAR BUCKET MANUALMENTE:')
            console.log('   1. Ve a Supabase Dashboard > Storage')
            console.log('   2. Click en "New Bucket"')
            console.log('   3. Nombre: hero-banners')
            console.log('   4. Public: ✓ (activado)')
            console.log('   5. Click en "Create Bucket"')
        } else {
            console.log('✅ Bucket hero-banners creado!\n')
        }
    } else {
        console.log('✅ Bucket hero-banners existe!\n')
    }

    console.log('✨ Todo listo!')
    console.log('\n🎯 Ahora puedes:')
    console.log('   • Ir a http://localhost:3000/admin/banners')
    console.log('   • Crear y subir tus banners')
    console.log('   • Activar un banner para verlo en la página principal')
}

setup().catch(error => {
    console.error('❌ Error:', error.message)
})
