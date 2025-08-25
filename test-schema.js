// Test XPLOAR.AI Database Schema
// Run with: node test-schema.js

const { createClient } = require('@supabase/supabase-js');

// Your Supabase credentials
const SUPABASE_URL = 'https://meoyfsrpuocdrkzjzbvk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lb3lmc3JwdW9jZHJremp6YnZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMzM5NjYsImV4cCI6MjA3MTcwOTk2Nn0.Os6sKp9arKMnterPUQhD0Vuhto7U9d3SestIYu8lqEo';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🧪 TESTING XPLOAR.AI DATABASE SCHEMA');
console.log('=====================================');

async function testSchema() {
    console.log('1️⃣ Testing Supabase connection...');
    try {
        // Test basic connection
        const { data, error } = await supabase.auth.getUser();
        if (error && !error.message.includes('Auth session missing')) {
            throw error;
        }
        console.log('✅ Supabase connection successful');
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        return;
    }

    console.log('');
    console.log('2️⃣ Checking database tables...');

    const requiredTables = [
        'users',
        'study_plans',
        'study_tasks',
        'ai_evaluations',
        'ai_insights',
        'performance_analytics',
        'user_recommendations',
        'user_progress'
    ];

    let tablesExist = 0;

    for (const tableName of requiredTables) {
        try {
            const { data, error } = await supabase
                .from(tableName)
                .select('*')
                .limit(1);

            if (error) {
                console.log(`❌ ${tableName}: ${error.message}`);
            } else {
                console.log(`✅ ${tableName}: Found`);
                tablesExist++;
            }
        } catch (error) {
            console.log(`❌ ${tableName}: Error - ${error.message}`);
        }
    }

    console.log('');
    console.log('📊 SCHEMA VERIFICATION RESULTS:');
    console.log('===============================');
    console.log(`✅ Tables found: ${tablesExist}/${requiredTables.length}`);

    if (tablesExist === requiredTables.length) {
        console.log('🎉 ALL TABLES CREATED SUCCESSFULLY!');
        console.log('');
        console.log('🚀 READY FOR PHASE 2: VERCEL DEPLOYMENT');
    } else {
        console.log('⚠️ SOME TABLES MISSING');
        console.log('');
        console.log('💡 Please ensure you applied the complete schema');
        console.log('📋 Re-run the SQL in Supabase SQL Editor');
    }

    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Apply schema in Supabase if tables are missing');
    console.log('2. Run: node deploy-to-vercel.js');
}

testSchema();
