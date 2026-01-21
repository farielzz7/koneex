require('dotenv').config({ path: '.env.local' });
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // TRY ANON KEY

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing env vars:", { supabaseUrl, hasKey: !!supabaseKey });
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPackages() {
    const { data, error } = await supabase.from('packages').select('*');
    if (error) {
        console.error("Error:", error);
    } else {
        console.log("Packages found:", data.length);
        console.log("Statuses:", data.map(p => ({ title: p.title, status: p.status })));
    }
}

checkPackages();
