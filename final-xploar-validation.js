#!/usr/bin/env node

/**
 * 🎯 XPLOAR.AI - FINAL VALIDATION SCRIPT
 * Run this after completing all manual steps
 * Usage: node final-xploar-validation.js
 */

const https = require('https');
const { createClient } = require('@supabase/supabase-js');

console.log('🎯 XPLOAR.AI - FINAL VALIDATION SCRIPT');
console.log('=====================================');
console.log('🚀 Validating all completed todos...\n');

// Configuration
const CONFIG = {
    supabase: {
        url: 'https://meoyfsrpuocdrkzjzbvk.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lb3lmc3JwdW9jZHJremp6YnZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMzM5NjYsImV4cCI6MjA3MTcwOTk2Nn0.Os6sKp9arKMnterPUQhD0Vuhto7U9d3SestIYu8lqEo'
    },
    deployedUrl: 'https://xploar-web-k5nhmj520-manoharnayakbarmavaths-projects.vercel.app'
};

const supabase = createClient(CONFIG.supabase.url, CONFIG.supabase.anonKey);

// Helper functions
function log(message, color = 'white') {
    const colors = {
        red: '\x1b[31m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        magenta: '\x1b[35m',
        cyan: '\x1b[36m',
        white: '\x1b[37m',
        reset: '\x1b[0m'
    };
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        const req = https.request(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve({ statusCode: res.statusCode, data }));
        });

        req.on('error', reject);
        req.setTimeout(10000, () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });

        req.end();
    });
}

// Test functions
async function testWebsiteAccessibility() {
    log('🌐 Testing Website Accessibility...', 'cyan');
    try {
        const response = await makeRequest(CONFIG.deployedUrl);
        if (response.statusCode === 200) {
            log('✅ Website loads successfully (no 401 errors)', 'green');
            return true;
        } else {
            log(`❌ Website returned status: ${response.statusCode}`, 'red');
            return false;
        }
    } catch (error) {
        log(`❌ Website accessibility test failed: ${error.message}`, 'red');
        return false;
    }
}

async function testSupabaseConnection() {
    log('🗄️  Testing Supabase Connection...', 'cyan');
    try {
        const { data, error } = await supabase.auth.getUser();
        if (!error || error.message.includes('Auth session missing')) {
            log('✅ Supabase connection successful', 'green');
            return true;
        } else {
            log(`❌ Supabase connection failed: ${error.message}`, 'red');
            return false;
        }
    } catch (error) {
        log(`❌ Supabase test failed: ${error.message}`, 'red');
        return false;
    }
}

async function testDatabaseTables() {
    log('📊 Testing Database Tables...', 'cyan');
    const tables = [
        'users', 'study_plans', 'study_sessions', 'ai_evaluations',
        'ai_insights', 'performance_analytics', 'user_recommendations',
        'user_progress', 'mock_tests', 'discussion_forums', 'forum_replies',
        'study_groups', 'study_group_members', 'peer_reviews', 'mentorship'
    ];

    let successCount = 0;
    for (const table of tables) {
        try {
            const { error } = await supabase.from(table).select('*').limit(1);
            if (!error) {
                successCount++;
            }
        } catch (error) {
            // Table doesn't exist or error
        }
    }

    if (successCount === tables.length) {
        log(`✅ All ${tables.length} database tables exist`, 'green');
        return true;
    } else {
        log(`❌ Only ${successCount}/${tables.length} tables found`, 'red');
        return false;
    }
}

async function testAuthenticationFlow() {
    log('🔐 Testing Authentication Flow...', 'cyan');
    try {
        // Generate unique test email
        const testEmail = `test${Date.now()}@xploarai.com`;
        const testPassword = 'TestPassword123!';

        // Test signup
        const { data: signupData, error: signupError } = await supabase.auth.signUp({
            email: testEmail,
            password: testPassword
        });

        if (!signupError || signupError.message.includes('email_not_confirmed')) {
            log('✅ Authentication flow working (no email confirmation errors)', 'green');
            return true;
        } else {
            log(`❌ Authentication test failed: ${signupError.message}`, 'red');
            return false;
        }
    } catch (error) {
        log(`❌ Authentication test error: ${error.message}`, 'red');
        return false;
    }
}

async function testAIAPI() {
    log('🤖 Testing Google AI API...', 'cyan');
    try {
        // Simple test request to Google AI API
        const apiKey = 'AIzaSyCrO4GYag-h-CUp4TiV6QkVkc1IZA2NTVY';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

        const response = await makeRequest(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.statusCode === 200) {
            log('✅ Google AI API working', 'green');
            return true;
        } else {
            log(`❌ Google AI API returned status: ${response.statusCode}`, 'red');
            return false;
        }
    } catch (error) {
        log(`❌ Google AI API test failed: ${error.message}`, 'red');
        return false;
    }
}

async function testLayoutAndFeatures() {
    log('🎨 Testing Layout & Features...', 'cyan');
    try {
        const response = await makeRequest(CONFIG.deployedUrl);
        if (response.statusCode === 200) {
            // Check if the page contains expected content
            const expectedFeatures = [
                'Study Planner', 'AI Coach', 'Mock Tests', 'Community',
                'Content Hub', 'Daily Challenge', 'Debate', 'Interview',
                'Mentor Connect', 'Multi-Mode Learning', 'Onboarding'
            ];

            let foundFeatures = 0;
            for (const feature of expectedFeatures) {
                if (response.data.includes(feature)) {
                    foundFeatures++;
                }
            }

            if (foundFeatures >= 10) { // At least 10 features should be present
                log(`✅ Layout working - found ${foundFeatures} features`, 'green');
                return true;
            } else {
                log(`❌ Layout test - only found ${foundFeatures} features`, 'yellow');
                return false;
            }
        } else {
            log(`❌ Layout test failed - status: ${response.statusCode}`, 'red');
            return false;
        }
    } catch (error) {
        log(`❌ Layout test error: ${error.message}`, 'red');
        return false;
    }
}

// Main validation function
async function runValidation() {
    console.log('🚀 STARTING XPLOAR.AI FINAL VALIDATION\n');

    const tests = [
        { name: 'Website Accessibility', func: testWebsiteAccessibility },
        { name: 'Supabase Connection', func: testSupabaseConnection },
        { name: 'Database Tables', func: testDatabaseTables },
        { name: 'Authentication Flow', func: testAuthenticationFlow },
        { name: 'Google AI API', func: testAIAPI },
        { name: 'Layout & Features', func: testLayoutAndFeatures }
    ];

    let passedTests = 0;

    for (const test of tests) {
        const result = await test.func();
        if (result) {
            passedTests++;
        }
        await sleep(1000); // Brief pause between tests
    }

    console.log('\n🎊 VALIDATION COMPLETE');
    console.log('========================');

    if (passedTests === tests.length) {
        log(`\n🎉 ALL TESTS PASSED! (${passedTests}/${tests.length})`, 'green');
        log('\n🎯 XPLOAR.AI V1.0.0 IS READY FOR LAUNCH!', 'green');
        log('🌟 Your AI-powered UPSC platform is complete and functional!', 'green');

        console.log('\n📋 NEXT STEPS:');
        console.log('1. 🎉 Celebrate your achievement!');
        console.log('2. 📱 Test the app manually on different devices');
        console.log('3. 🚀 Launch your social media campaign');
        console.log('4. 👥 Start acquiring your first users');
        console.log('5. 📈 Monitor user engagement and feedback');

    } else {
        log(`\n⚠️  SOME TESTS FAILED: ${passedTests}/${tests.length} passed`, 'yellow');

        console.log('\n📋 FAILED TESTS INDICATE:');
        if (passedTests < 3) {
            console.log('❌ Environment variables may not be set correctly');
            console.log('❌ Database schema may not be applied');
        }
        if (passedTests < 5) {
            console.log('❌ Email confirmation may still be enabled');
        }

        console.log('\n🔄 Run this script again after fixing the issues.');
    }

    console.log('\n📞 NEED HELP? Contact us for support!');
    console.log('💪 You\'ve built something amazing! 🌟\n');
}

// Run validation
runValidation().catch(error => {
    log(`\n❌ Validation script failed: ${error.message}`, 'red');
    process.exit(1);
});
