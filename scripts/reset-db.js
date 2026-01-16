
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function resetDatabase() {
    const connectionString = process.env.DATABASE_URL; // Use Connection Pooling URL usually, or DIRECT_URL for migrations if needed
    // For dropping tables (DDL), DIRECT_URL is safer/better in Supabase Transaction Mode. 
    // Let's check for DIRECT_URL first.
    const dbUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

    if (!dbUrl) {
        console.error('Error: DATABASE_URL or DIRECT_URL not found in .env.local');
        process.exit(1);
    }

    console.log('Connecting to database...');
    const client = new Client({
        connectionString: dbUrl,
        ssl: { rejectUnauthorized: false } // Required for Supabase usually
    });

    try {
        await client.connect();

        const sqlPath = path.resolve(process.cwd(), 'full_system_v3_migration.sql');
        console.log(`Reading SQL file from: ${sqlPath}`);

        if (!fs.existsSync(sqlPath)) {
            throw new Error(`Migration file not found at ${sqlPath}`);
        }

        const sqlConfig = fs.readFileSync(sqlPath, 'utf8');

        console.log('Executing database reset and migration...');
        // Execute the SQL
        await client.query(sqlConfig);

        console.log('✅ Database reset successfully! Tables dropped, schema recreated, and default data seeded.');

    } catch (err) {
        console.error('❌ Error resetting database:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

resetDatabase();
