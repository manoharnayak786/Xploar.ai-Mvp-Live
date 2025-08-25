// Apply XPLOAR.AI Database Schema to Supabase
// Run with: node apply-schema.js

const { createClient } = require('@supabase/supabase-js');

// Your Supabase credentials
const SUPABASE_URL = 'https://meoyfsrpuocdrkzjzbvk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lb3lmc3JwdW9jZHJremp6YnZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMzM5NjYsImV4cCI6MjA3MTcwOTk2Nn0.Os6sKp9arKMnterPUQhD0Vuhto7U9d3SestIYu8lqEo';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🚀 APPLYING XPLOAR.AI DATABASE SCHEMA');
console.log('=====================================');
console.log(`Target: ${SUPABASE_URL}`);
console.log('');

async function applySchema() {
    try {
        // Test connection
        console.log('1️⃣ Testing Supabase connection...');
        const { data: testData, error: testError } = await supabase.auth.getUser();

        if (testError && !testError.message.includes('Auth session missing')) {
            throw testError;
        }

        console.log('✅ Supabase connection successful');

        // Note: Since we can't directly execute DDL statements via the client,
        // we'll provide the SQL that needs to be run in the Supabase dashboard
        console.log('');
        console.log('2️⃣ SCHEMA APPLICATION REQUIRED');
        console.log('===============================');
        console.log('');
        console.log('📋 Please copy and run the following SQL in your Supabase SQL Editor:');
        console.log('');
        console.log('📍 Go to: https://supabase.com/dashboard');
        console.log('📍 Select your project: meoyfsrpuocdrkzjzbvk');
        console.log('📍 Open "SQL Editor"');
        console.log('📍 Copy the entire schema and click "Run"');
        console.log('');

        // Read and display the schema
        const fs = require('fs');
        const schema = fs.readFileSync('schema-ready-to-copy.sql', 'utf8');
        console.log('📄 DATABASE SCHEMA:');
        console.log('==================');
        console.log(schema);

        console.log('');
        console.log('✅ After applying the schema, run: node test-schema.js');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('');
        console.log('💡 If you see a connection error, please check:');
        console.log('   - Supabase project is active');
        console.log('   - Credentials are correct');
        console.log('   - Project allows API access');
    }
}

applySchema();
