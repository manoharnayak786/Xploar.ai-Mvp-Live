const https = require('https');
const { createClient } = require('@supabase/supabase-js');

console.log('🔍 XPLOAR.AI - SPECIFIC ISSUE CHECKER\n');
console.log('='.repeat(50));

const CONFIG = {
    supabase: {
        url: 'https://meoyfsrpuocdrkzjzbvk.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lb3lmc3JwdW9jZHJremp6YnZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMzM5NjYsImV4cCI6MjA3MTcwOTk2Nn0.Os6sKp9arKMnterPUQhD0Vuhto7U9d3SestYJu8lqEo'
    },
    deployedUrl: 'https://xploar-web-k5nhmj520-manoharnayakbarmavaths-projects.vercel.app'
};

function log(message, color = 'white') {
    const colors = {
        green: '\x1b[32m',
        red: '\x1b[31m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        cyan: '\x1b[36m',
        magenta: '\x1b[35m',
        reset: '\x1b[0m'
    };
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function checkSupabaseConnection() {
    log('\n1️⃣ CHECKING SUPABASE CONNECTION', 'cyan');
    log('-'.repeat(35), 'cyan');

    try {
        const supabase = createClient(CONFIG.supabase.url, CONFIG.supabase.anonKey);
        const { data, error } = await supabase.from('study_plans').select('count').limit(1);

        if (error) {
            log('❌ Supabase connection failed', 'red');

            if (error.message.includes('Invalid API key')) {
                log('📋 SOLUTION:', 'yellow');
                log('   • Go to Vercel Dashboard → Your Project → Settings → Environment Variables', 'white');
                log('   • Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY', 'white');
                log('   • Redeploy the application', 'white');
                return false;
            } else if (error.message.includes('relation') && error.message.includes('does not exist')) {
                log('📋 SOLUTION:', 'yellow');
                log('   • The database schema needs to be applied', 'white');
                log('   • Go to Supabase SQL Editor and run the schema file', 'white');
                return false;
            } else {
                log(`   Error: ${error.message}`, 'red');
                return false;
            }
        }

        log('✅ Supabase connection successful', 'green');
        return true;

    } catch (err) {
        log(`❌ Connection error: ${err.message}`, 'red');
        return false;
    }
}

async function checkAuthentication() {
    log('\n2️⃣ CHECKING AUTHENTICATION FLOW', 'cyan');
    log('-'.repeat(35), 'cyan');

    try {
        const testEmail = `test_${Date.now()}@example.com`;
        const signupResponse = await fetch(`${CONFIG.deployedUrl}/api/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testEmail,
                password: 'TestPassword123!'
            })
        });

        if (signupResponse.ok) {
            log('✅ Authentication working correctly', 'green');
            return true;
        }

        const errorText = await signupResponse.text();

        if (errorText.includes('Email address') && errorText.includes('invalid')) {
            log('❌ Email confirmation is still enabled in Supabase', 'red');
            log('📋 SOLUTION:', 'yellow');
            log('   • Go to Supabase Dashboard → Authentication → Settings', 'white');
            log('   • Find "User Signups" section', 'white');
            log('   • Uncheck "Enable email confirmations"', 'white');
            log('   • Save changes', 'white');
            return false;
        } else {
            log(`⚠️  Different auth error: ${errorText}`, 'yellow');
            return false;
        }

    } catch (err) {
        log(`❌ Auth test failed: ${err.message}`, 'red');
        return false;
    }
}

async function checkAIAPI() {
    log('\n3️⃣ CHECKING AI API CONFIGURATION', 'cyan');
    log('-'.repeat(35), 'cyan');

    const apiKey = 'AIzaSyCrO4GYag-h-CUp4TiV6QkVkc1IZA2NTVY';

    try {
        log('Testing Google AI API...');

        // Try the current API endpoint
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: 'Hello from XPLOAR.AI test!' }]
                }]
            })
        });

        if (response.ok) {
            log('✅ AI API working correctly', 'green');
            return true;
        }

        const errorData = await response.json();
        log(`❌ AI API failed: ${response.status}`, 'red');

        if (errorData.error?.message) {
            log(`   Error: ${errorData.error.message}`, 'red');
        }

        log('📋 SOLUTION:', 'yellow');
        log('   • Ensure GOOGLE_AI_API_KEY is set in Vercel environment variables', 'white');
        log('   • The API key might need to be updated or refreshed', 'white');
        log('   • Check if the API key has proper permissions', 'white');

        return false;

    } catch (err) {
        log(`❌ AI API test failed: ${err.message}`, 'red');
        return false;
    }
}

async function checkDeploymentStatus() {
    log('\n4️⃣ CHECKING DEPLOYMENT STATUS', 'cyan');
    log('-'.repeat(30), 'cyan');

    try {
        const response = await fetch(CONFIG.deployedUrl);
        if (response.ok) {
            log('✅ Website is accessible', 'green');

            const html = await response.text();
            if (html.includes('xploar.ai')) {
                log('✅ Branding is correct', 'green');
            } else {
                log('⚠️  Branding not found', 'yellow');
            }

            return true;
        } else {
            log(`❌ Website not accessible: ${response.status}`, 'red');
            return false;
        }
    } catch (err) {
        log(`❌ Connection failed: ${err.message}`, 'red');
        return false;
    }
}

async function main() {
    log('🔧 XPLOAR.AI ISSUE DIAGNOSIS', 'magenta');
    log('='.repeat(35), 'magenta');

    const results = {
        deployment: false,
        supabase: false,
        auth: false,
        ai: false
    };

    // Check each issue
    results.deployment = await checkDeploymentStatus();
    results.supabase = await checkSupabaseConnection();
    results.auth = await checkAuthentication();
    results.ai = await checkAIAPI();

    // Summary
    log('\n📊 ISSUE STATUS SUMMARY', 'magenta');
    log('='.repeat(25), 'magenta');

    const summary = [
        { name: 'Deployment', status: results.deployment },
        { name: 'Supabase Connection', status: results.supabase },
        { name: 'Authentication', status: results.auth },
        { name: 'AI Features', status: results.ai }
    ];

    let workingCount = 0;
    summary.forEach(item => {
        const status = item.status ? '✅ WORKING' : '❌ NEEDS FIX';
        const color = item.status ? 'green' : 'red';
        log(`${status} ${item.name}`, color);
        if (item.status) workingCount++;
    });

    log(`\n📈 PROGRESS: ${workingCount}/${summary.length} systems working`, 'cyan');

    if (workingCount === summary.length) {
        log('\n🎉 ALL ISSUES RESOLVED! XPLOAR.AI IS FULLY FUNCTIONAL! 🚀', 'green');
    } else {
        log('\n⚠️  Some issues still need attention. Follow the solutions above.', 'yellow');
        log('\n💡 After fixing issues, run this script again to verify.', 'yellow');
    }

    log('\n🔄 To re-run this check:', 'green');
    log('   node check-specific-issues.js', 'green');
}

main().catch(console.error);
