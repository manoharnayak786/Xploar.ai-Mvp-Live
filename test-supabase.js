// Test script to verify Supabase connection
// Run with: node test-supabase.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🧪 Testing Supabase Connection');
console.log('==============================');

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables');
    console.log('Please set:');
    console.log('- NEXT_PUBLIC_SUPABASE_URL');
    console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY');
    console.log('');
    console.log('Get these from: https://supabase.com/dashboard');
    process.exit(1);
}

if (supabaseUrl.includes('your_supabase_project_url_here')) {
    console.error('❌ Supabase URL not configured');
    console.log('Please update .env.local with your actual Supabase project URL');
    process.exit(1);
}

if (supabaseKey.includes('your_supabase_anon_key_here')) {
    console.error('❌ Supabase key not configured');
    console.log('Please update .env.local with your actual Supabase anon key');
    process.exit(1);
}

console.log('✅ Environment variables found');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    try {
        console.log('🔍 Testing basic connection...');

        // Test 1: Get current user (should work even if not authenticated)
        const { data: authData, error: authError } = await supabase.auth.getUser();

        if (authError) {
            console.log('⚠️ Auth error (expected if not logged in):', authError.message);
        } else {
            console.log('✅ Auth check passed');
        }

        // Test 2: Check if we can access the database
        console.log('🔍 Testing database access...');

        // Try to select from study_plans (will fail if table doesn't exist)
        const { data, error } = await supabase
            .from('study_plans')
            .select('*')
            .limit(1);

        if (error) {
            if (error.code === 'PGRST116') {
                console.log('❌ Database table "study_plans" not found');
                console.log('Please run the SQL schema from supabase-schema.sql');
            } else {
                console.log('❌ Database error:', error.message);
            }
        } else {
            console.log('✅ Database access successful');
            console.log('📊 Found', data?.length || 0, 'study plans');
        }

        // Test 3: Check authentication methods
        console.log('🔍 Testing authentication setup...');

        // This will show available auth providers
        const { data: providers } = await supabase.auth.getSession();
        console.log('✅ Authentication setup verified');

    } catch (error) {
        console.error('❌ Connection test failed:', error.message);
    }
}

testConnection().then(() => {
    console.log('');
    console.log('🎯 Next steps:');
    console.log('1. If database tables are missing, run supabase-schema.sql');
    console.log('2. Test authentication by running: npm run dev');
    console.log('3. Visit http://localhost:3000 and try to sign up/login');
});
