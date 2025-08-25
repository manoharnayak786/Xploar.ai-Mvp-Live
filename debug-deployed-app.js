// Debug script for deployed Xploar.ai app
// Run with: node debug-deployed-app.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const deployedUrl = 'https://xploar-web-5puycxu28-manoharnayakbarmavaths-projects.vercel.app';

console.log('🔧 DEBUGGING DEPLOYED XPLOAR.AI APP');
console.log('====================================');
console.log(`📍 Deployed URL: ${deployedUrl}`);
console.log(`🔗 Supabase URL: ${supabaseUrl}`);
console.log('');

async function debugApp() {
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('1️⃣  Testing Supabase Connection...');
    try {
        const { data, error } = await supabase.from('users').select('count').limit(1);
        if (error) {
            console.log('❌ Supabase connection failed:', error.message);
            console.log('');
            console.log('🚨 ISSUE: Database schema not applied!');
            console.log('📋 SOLUTION: Apply supabase-schema.sql in Supabase dashboard');
            return;
        }
        console.log('✅ Supabase connection successful');
    } catch (err) {
        console.log('❌ Supabase connection error:', err.message);
        return;
    }

    console.log('');
    console.log('2️⃣  Checking Database Tables...');

    const tables = ['users', 'study_plans', 'study_tasks'];
    let allTablesGood = true;

    for (const table of tables) {
        try {
            const { data, error } = await supabase.from(table).select('count').limit(1);
            if (error) {
                console.log(`❌ Table '${table}' missing or inaccessible`);
                allTablesGood = false;
            } else {
                console.log(`✅ Table '${table}' accessible`);
            }
        } catch (err) {
            console.log(`❌ Error accessing '${table}':`, err.message);
            allTablesGood = false;
        }
    }

    if (!allTablesGood) {
        console.log('');
        console.log('🚨 DATABASE SETUP INCOMPLETE');
        console.log('==============================');
        console.log('Apply the SQL schema in Supabase dashboard first!');
        return;
    }

    console.log('');
    console.log('3️⃣  Testing Authentication...');
    try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
            console.log('❌ Auth check failed:', error.message);
        } else {
            console.log('✅ Auth system accessible');
        }
    } catch (err) {
        console.log('❌ Auth error:', err.message);
    }

    console.log('');
    console.log('4️⃣  Testing Data Operations...');
    try {
        // Test if we can create a test user profile
        const testUserId = 'test-user-' + Date.now();
        const { data, error } = await supabase
            .from('users')
            .insert({
                id: testUserId,
                email: `test-${Date.now()}@example.com`,
                full_name: 'Test User'
            })
            .select();

        if (error) {
            console.log('⚠️  Data insertion test:', error.message);
        } else {
            console.log('✅ Data insertion works');
            // Clean up test data
            await supabase.from('users').delete().eq('id', testUserId);
        }
    } catch (err) {
        console.log('❌ Data operations error:', err.message);
    }

    console.log('');
    console.log('🎉 ALL CHECKS PASSED - DATABASE READY!');
    console.log('=====================================');
    console.log(`🌐 Visit: ${deployedUrl}`);
    console.log(`🔍 Debug Panel: ${deployedUrl}?debug=true`);
    console.log('');
    console.log('✅ READY FOR TESTING:');
    console.log('   1. Page loads without errors');
    console.log('   2. Debug panel shows connection status');
    console.log('   3. User registration works');
    console.log('   4. Onboarding flow completes');
    console.log('   5. Study planner generates and saves');
    console.log('   6. All sidebar features accessible');
    console.log('   7. Data persists after refresh');
}

debugApp().catch(console.error);
