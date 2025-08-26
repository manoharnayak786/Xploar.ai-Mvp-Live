#!/usr/bin/env node

/**
 * Verify Database Schema Application
 * Run after applying schema to Supabase
 */

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    'https://meoyfsrpuocdrkzjzbvk.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lb3lmc3JwdW9jZHJremp6YnZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMzM5NjYsImV4cCI6MjA3MTcwOTk2Nn0.Os6sKp9arKMnterPUQhD0Vuhto7U9d3SestIYu8lqEo'
);

async function verifySchema() {
    console.log('🔍 VERIFYING XPLOAR.AI DATABASE SCHEMA');
    console.log('=====================================');

    const tables = [
        'users', 'study_plans', 'study_sessions', 'ai_evaluations',
        'ai_insights', 'performance_analytics', 'user_recommendations',
        'user_progress', 'mock_tests', 'discussion_forums', 'forum_replies',
        'study_groups', 'study_group_members', 'peer_reviews', 'mentorship'
    ];

    let found = 0;
    for (const table of tables) {
        try {
            const { error } = await supabase.from(table).select('*').limit(1);
            if (!error) {
                console.log(`✅ ${table}`);
                found++;
            } else {
                console.log(`❌ ${table}`);
            }
        } catch (e) {
            console.log(`❌ ${table} - Error`);
        }
    }

    console.log(`\n📊 Found: ${found}/15 tables`);
    return found === 15;
}

verifySchema().then(success => {
    if (success) {
        console.log('\n🎉 SCHEMA SUCCESS! Ready for environment variables.');
    } else {
        console.log('\n❌ Please apply schema to Supabase first.');
    }
});
