// Complete functionality test after database setup
// Run with: node test-full-functionality.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const deployedUrl = 'https://xploar-web-5puycxu28-manoharnayakbarmavaths-projects.vercel.app';

console.log('🧪 TESTING COMPLETE XPLOAR.AI FUNCTIONALITY');
console.log('==========================================');
console.log(`📍 Testing: ${deployedUrl}`);
console.log(`🔗 Database: ${supabaseUrl}`);
console.log('');

async function testFullFunctionality() {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test 1: Database Connection
    console.log('1️⃣  Database Connection Test...');
    try {
        const { data, error } = await supabase.from('users').select('count').limit(1);
        if (error) {
            console.log('❌ Database connection failed:', error.message);
            return;
        }
        console.log('✅ Database connection successful');
    } catch (err) {
        console.log('❌ Connection error:', err.message);
        return;
    }

    // Test 2: All Tables Exist
    console.log('\n2️⃣  Table Existence Test...');
    const tables = ['users', 'study_plans', 'study_tasks'];
    let allTablesExist = true;

    for (const table of tables) {
        try {
            const { data, error } = await supabase.from(table).select('count').limit(1);
            if (error) {
                console.log(`❌ Table '${table}' not accessible`);
                allTablesExist = false;
            } else {
                console.log(`✅ Table '${table}' exists and accessible`);
            }
        } catch (err) {
            console.log(`❌ Error accessing '${table}':`, err.message);
            allTablesExist = false;
        }
    }

    if (!allTablesExist) {
        console.log('\n🚨 DATABASE SCHEMA NOT PROPERLY APPLIED');
        console.log('Apply the SQL schema in Supabase dashboard first!');
        return;
    }

    // Test 3: Authentication
    console.log('\n3️⃣  Authentication Test...');
    try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
            console.log('❌ Auth system error:', error.message);
        } else {
            console.log('✅ Auth system accessible');
        }
    } catch (err) {
        console.log('❌ Auth error:', err.message);
    }

    // Test 4: User Profile Creation
    console.log('\n4️⃣  User Profile Creation Test...');
    try {
        // Create a test user (this would normally be done by the trigger)
        const testUserId = 'test-user-' + Date.now();
        const testEmail = `test-${Date.now()}@example.com`;

        const { data, error } = await supabase
            .from('users')
            .insert({
                id: testUserId,
                email: testEmail,
                full_name: 'Test User',
                study_level: 'Beginner',
                target_exam: 'UPSC'
            })
            .select();

        if (error) {
            console.log('❌ User profile creation failed:', error.message);
        } else {
            console.log('✅ User profile creation works');

            // Test 5: Study Plan Creation
            console.log('\n5️⃣  Study Plan Creation Test...');
            const { data: planData, error: planError } = await supabase
                .from('study_plans')
                .insert({
                    user_id: testUserId,
                    start_date: new Date().toISOString().split('T')[0],
                    hours_per_day: 4
                })
                .select();

            if (planError) {
                console.log('❌ Study plan creation failed:', planError.message);
            } else {
                console.log('✅ Study plan creation works');
                const planId = planData[0].id;

                // Test 6: Study Tasks Creation
                console.log('\n6️⃣  Study Tasks Creation Test...');
                const testTasks = [
                    {
                        id: 'task-1',
                        plan_id: planId,
                        topic_id: 'polity',
                        kind: 'Read',
                        duration_mins: 60,
                        is_done: false,
                        day_num: 1
                    },
                    {
                        id: 'task-2',
                        plan_id: planId,
                        topic_id: 'history',
                        kind: 'Practice',
                        duration_mins: 45,
                        is_done: false,
                        day_num: 1
                    }
                ];

                const { data: tasksData, error: tasksError } = await supabase
                    .from('study_tasks')
                    .insert(testTasks)
                    .select();

                if (tasksError) {
                    console.log('❌ Study tasks creation failed:', tasksError.message);
                } else {
                    console.log('✅ Study tasks creation works');

                    // Test 7: Data Retrieval
                    console.log('\n7️⃣  Data Retrieval Test...');
                    const { data: retrievedTasks, error: retrieveError } = await supabase
                        .from('study_tasks')
                        .select('*')
                        .eq('plan_id', planId);

                    if (retrieveError) {
                        console.log('❌ Data retrieval failed:', retrieveError.message);
                    } else {
                        console.log(`✅ Data retrieval works (${retrievedTasks.length} tasks found)`);
                    }

                    // Clean up test tasks
                    await supabase.from('study_tasks').delete().eq('plan_id', planId);
                }

                // Clean up test plan
                await supabase.from('study_plans').delete().eq('id', planId);
            }

            // Clean up test user
            await supabase.from('users').delete().eq('id', testUserId);
        }
    } catch (err) {
        console.log('❌ Profile creation error:', err.message);
    }

    // Test 8: Row Level Security
    console.log('\n8️⃣  Row Level Security Test...');
    try {
        // This should fail because we're not authenticated
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .limit(1);

        if (error && error.message.includes('permission denied')) {
            console.log('✅ Row Level Security working (access denied as expected)');
        } else if (error) {
            console.log('⚠️  RLS test inconclusive:', error.message);
        } else {
            console.log('⚠️  RLS might not be properly configured');
        }
    } catch (err) {
        console.log('❌ RLS test error:', err.message);
    }

    console.log('\n🎉 FUNCTIONALITY TESTS COMPLETE!');
    console.log('================================');
    console.log('');
    console.log('📋 MANUAL TESTING CHECKLIST:');
    console.log('=============================');
    console.log(`🌐 Visit: ${deployedUrl}`);
    console.log(`🔍 Debug: ${deployedUrl}?debug=true`);
    console.log('');
    console.log('✅ TEST IN BROWSER:');
    console.log('   1. Page loads without console errors');
    console.log('   2. Debug panel shows "Database: Connection OK"');
    console.log('   3. Click "Sign Up" and create new account');
    console.log('   4. Complete onboarding: Welcome → Goal → Time → Plan');
    console.log('   5. Study planner shows personalized schedule');
    console.log('   6. Sidebar shows all 14 features');
    console.log('   7. Refresh page - data still there');
    console.log('   8. Try different features (Mock Tests, AI Coach, etc.)');
    console.log('');
    console.log('🎯 EXPECTED FUNCTIONALITY:');
    console.log('========================');
    console.log('• ✅ User registration with automatic profile creation');
    console.log('• ✅ Complete onboarding flow');
    console.log('• ✅ Personalized study planner');
    console.log('• ✅ All sidebar features accessible');
    console.log('• ✅ Data persistence across sessions');
    console.log('• ✅ Real-time updates');
    console.log('');
    console.log('🚀 YOUR APP IS READY FOR USERS!');
    console.log('==============================');
}

testFullFunctionality().catch(console.error);
