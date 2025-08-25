// Automated Database Schema Application for Xploar.ai
// Run with: node auto-apply-schema.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🚀 AUTOMATED XPLOAR.AI DATABASE SCHEMA APPLICATION');
console.log('==================================================');
console.log(`📍 Target: ${supabaseUrl}`);
console.log('');

async function applySchema() {
    if (!supabaseUrl || !supabaseKey) {
        console.log('❌ Missing Supabase credentials in .env.local');
        console.log('');
        console.log('Required:');
        console.log('NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
        console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key');
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('1️⃣  Testing Connection...');
    try {
        const { data, error } = await supabase.from('_supabase_tables').select('count').limit(1);
        if (error && error.message.includes('relation') && error.message.includes('does not exist')) {
            console.log('✅ Supabase connection successful');
        } else if (error) {
            console.log('⚠️  Connection test inconclusive, proceeding...');
        } else {
            console.log('✅ Supabase connection successful');
        }
    } catch (err) {
        console.log('❌ Connection failed:', err.message);
        return;
    }

    console.log('');
    console.log('2️⃣  Reading Schema File...');
    const schemaPath = 'schema-ready-to-copy.sql';
    if (!fs.existsSync(schemaPath)) {
        console.log('❌ Schema file not found:', schemaPath);
        return;
    }

    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    console.log('✅ Schema file loaded');

    console.log('');
    console.log('3️⃣  Applying Database Schema...');
    console.log('This may take a few moments...');

    try {
        // Split the schema into individual statements
        const statements = schemaSQL
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

        let successCount = 0;
        let errorCount = 0;

        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i].trim();
            if (!statement) continue;

            try {
                const { data, error } = await supabase.rpc('exec_sql', {
                    sql: statement + ';'
                });

                if (error) {
                    // Try direct approach for statements that can't use rpc
                    if (statement.toUpperCase().includes('CREATE TABLE') ||
                        statement.toUpperCase().includes('CREATE POLICY') ||
                        statement.toUpperCase().includes('ALTER TABLE') ||
                        statement.toUpperCase().includes('CREATE INDEX') ||
                        statement.toUpperCase().includes('CREATE TRIGGER') ||
                        statement.toUpperCase().includes('CREATE FUNCTION')) {

                        // For DDL statements, we'll need to execute them differently
                        console.log(`⚠️  DDL statement ${i + 1}: Manual execution required`);
                        console.log(`   ${statement.substring(0, 50)}...`);
                        errorCount++;
                    } else {
                        console.log(`❌ Statement ${i + 1} failed:`, error.message);
                        errorCount++;
                    }
                } else {
                    successCount++;
                    if (i % 10 === 0 || i === statements.length - 1) {
                        console.log(`✅ Progress: ${i + 1}/${statements.length} statements processed`);
                    }
                }
            } catch (err) {
                console.log(`⚠️  Statement ${i + 1} error:`, err.message.substring(0, 100));
                errorCount++;
            }
        }

        console.log('');
        console.log('4️⃣  Schema Application Summary:');
        console.log(`   ✅ Successful: ${successCount}`);
        console.log(`   ⚠️  Manual Required: ${errorCount}`);

        if (errorCount > 0) {
            console.log('');
            console.log('📋 MANUAL EXECUTION REQUIRED:');
            console.log('============================');
            console.log('Some DDL statements need manual execution in Supabase dashboard:');
            console.log('');
            console.log('1. Go to: https://supabase.com/dashboard');
            console.log('2. Select your project');
            console.log('3. Go to SQL Editor → New Query');
            console.log('4. Copy and paste the remaining SQL statements');
            console.log('5. Click Run');
            console.log('');
            console.log('The remaining statements are typically:');
            console.log('• CREATE TABLE statements');
            console.log('• CREATE POLICY statements');
            console.log('• CREATE TRIGGER statements');
        }

    } catch (err) {
        console.log('❌ Schema application failed:', err.message);
        console.log('');
        console.log('💡 FALLBACK: Manual Application Required');
        console.log('========================================');
        console.log('Please apply the schema manually:');
        console.log('1. Copy the contents of schema-ready-to-copy.sql');
        console.log('2. Go to Supabase SQL Editor');
        console.log('3. Paste and run the SQL');
    }

    console.log('');
    console.log('5️⃣  Verification Steps:');
    console.log('=====================');
    console.log('After schema application, run:');
    console.log('node verify-setup.js');
    console.log('');
    console.log('Then test with:');
    console.log('node test-full-functionality.js');
    console.log('');
    console.log('Finally test in browser:');
    console.log('https://xploar-web-5puycxu28-manoharnayakbarmavaths-projects.vercel.app');
}

applySchema().catch(console.error);
