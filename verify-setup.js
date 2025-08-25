// Quick verification script after applying database schema
// Run with: node verify-setup.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Verifying Xploar Setup');
console.log('========================');

async function verifySetup() {
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('✅ Checking database tables...');

    // Check if tables exist
    const tables = ['users', 'study_plans', 'study_tasks'];
    let allTablesExist = true;

    for (const table of tables) {
        try {
            const { data, error } = await supabase.from(table).select('count').limit(1);
            if (error) {
                console.log(`❌ Table '${table}' not found`);
                allTablesExist = false;
            } else {
                console.log(`✅ Table '${table}' exists`);
            }
        } catch (err) {
            console.log(`❌ Error checking table '${table}':`, err.message);
            allTablesExist = false;
        }
    }

    if (allTablesExist) {
        console.log('');
        console.log('🎉 DATABASE SETUP COMPLETE!');
        console.log('===========================');
        console.log('✅ All required tables created');
        console.log('✅ Ready for authentication');
        console.log('✅ Ready for data persistence');
        console.log('');
        console.log('🚀 NEXT STEPS:');
        console.log('1. Visit your deployed app:');
        console.log('   https://xploar-web-5puycxu28-manoharnayakbarmavaths-projects.vercel.app');
        console.log('2. Add ?debug=true for debug panel:');
        console.log('   https://xploar-web-5puycxu28-manoharnayakbarmavaths-projects.vercel.app?debug=true');
        console.log('3. Test user registration and login');
        console.log('4. Complete onboarding flow');
        console.log('5. Verify study planner works');
    } else {
        console.log('');
        console.log('❌ SETUP INCOMPLETE');
        console.log('===================');
        console.log('Please apply the SQL schema in Supabase dashboard');
        console.log('Then run this script again');
    }
}

verifySetup().catch(console.error);
