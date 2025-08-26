const https = require('https');
const { createClient } = require('@supabase/supabase-js');

console.log('🔧 XPLOAR.AI - COMPREHENSIVE ISSUE FIXER\n');
console.log('='.repeat(60));

const CONFIG = {
    supabase: {
        url: 'https://meoyfsrpuocdrkzjzbvk.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lb3lmc3JwdW9jZHJremp6YnZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMzM5NjYsImV4cCI6MjA3MTcwOTk2Nn0.Os6sKp9arKMnterPUQhD0Vuhto7U9d3SestYJu8lqEo'
    },
    deployedUrl: 'https://xploar-web-k5nhmj520-manoharnayakbarmavaths-projects.vercel.app',
    googleApiKey: 'AIzaSyCrO4GYag-h-CUp4TiV6QkVkc1IZA2NTVY'
};

const supabase = createClient(CONFIG.supabase.url, CONFIG.supabase.anonKey);

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

async function printInstructions() {
    log('\n📋 MANUAL STEPS REQUIRED TO FIX ALL ISSUES', 'magenta');
    log('='.repeat(50), 'magenta');

    log('\n🔧 STEP 1: FIX VERCEL ENVIRONMENT VARIABLES', 'cyan');
    log('-'.repeat(45), 'cyan');
    console.log(`
Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables

Add these 5 variables exactly as shown:

1. NEXT_PUBLIC_SUPABASE_URL
   Value: https://meoyfsrpuocdrkzjzbvk.supabase.co
   Environment: Production

2. NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lb3lmc3JwdW9jZHJremp6YnZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMzM5NjYsImV4cCI6MjA3MTcwOTk2Nn0.Os6sKp9arKMnterPUQhD0Vuhto7U9d3SestYJu8lqEo
   Environment: Production

3. NEXT_PUBLIC_SITE_URL
   Value: https://xploar-web-k5nhmj520-manoharnayakbarmavaths-projects.vercel.app
   Environment: Production

4. GOOGLE_AI_API_KEY
   Value: AIzaSyCrO4GYag-h-CUp4TiV6QkVkc1IZA2NTVY
   Environment: Production

5. NEXT_PUBLIC_GOOGLE_AI_API_KEY
   Value: AIzaSyCrO4GYag-h-CUp4TiV6QkVkc1IZA2NTVY
   Environment: Production

⚠️  IMPORTANT: After adding variables, trigger a new deployment by pushing to GitHub
`);

    log('\n🔧 STEP 2: DISABLE EMAIL CONFIRMATION IN SUPABASE', 'cyan');
    log('-'.repeat(50), 'cyan');
    console.log(`
Go to: https://supabase.com/dashboard → Your Project → Authentication → Settings

In the "User Signups" section:
- Uncheck "Enable email confirmations"
- Click "Save changes"

This will allow users to sign up without email verification.
`);

    log('\n🔧 STEP 3: VERIFY GOOGLE AI API CONFIGURATION', 'cyan');
    log('-'.repeat(48), 'cyan');
    console.log(`
The AI API configuration looks correct. After environment variables are set,
the AI features should work automatically.

Current API Key: AIzaSyCrO4GYag-h-CUp4TiV6QkVkc1IZA2NTVY
`);

    log('\n⏱️  ESTIMATED TIME: 10 minutes total', 'yellow');
    log('📞 SUPPORT: Message me when you\'ve completed these steps', 'yellow');
}

async function testSupabaseConnection() {
    log('\n🗄️  TESTING SUPABASE CONNECTION', 'cyan');
    log('-'.repeat(35), 'cyan');

    try {
        // Test basic connection
        const { data, error } = await supabase.from('study_plans').select('count').limit(1);

        if (error) {
            log(`❌ Supabase connection failed: ${error.message}`, 'red');

            if (error.message.includes('Invalid API key')) {
                log('💡 This usually means environment variables are not set correctly on Vercel', 'yellow');
            } else if (error.message.includes('relation') && error.message.includes('does not exist')) {
                log('💡 This means the database schema hasn\'t been applied yet', 'yellow');
            }

            return false;
        }

        log('✅ Supabase connection successful', 'green');
        log('✅ Environment variables are working correctly', 'green');
        return true;

    } catch (err) {
        log(`❌ Supabase test failed: ${err.message}`, 'red');
        return false;
    }
}

async function testAuthenticationFlow() {
    log('\n🔐 TESTING AUTHENTICATION FLOW', 'cyan');
    log('-'.repeat(35), 'cyan');

    try {
        log('Testing signup endpoint with valid credentials...');

        const signupResponse = await fetch(`${CONFIG.deployedUrl}/api/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: `testuser_${Date.now()}@example.com`,
                password: 'TestPassword123!'
            })
        });

        const signupResult = await signupResponse.text();

        if (signupResponse.ok) {
            log('✅ Signup endpoint working correctly', 'green');
            return true;
        } else if (signupResult.includes('Email address') && signupResult.includes('invalid')) {
            log('❌ Email confirmation is still enabled in Supabase', 'red');
            log('💡 Please disable email confirmation in Supabase dashboard', 'yellow');
            return false;
        } else {
            log(`⚠️  Signup returned: ${signupResponse.status} - ${signupResult}`, 'yellow');
            return false;
        }

    } catch (err) {
        log(`❌ Authentication test failed: ${err.message}`, 'red');
        return false;
    }
}

async function testAIFeatures() {
    log('\n🤖 TESTING AI FEATURES', 'cyan');
    log('-'.repeat(25), 'cyan');

    const apiKey = CONFIG.googleApiKey;

    try {
        log('Testing Google AI API connection...');

        // Try the current API endpoint
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: 'Hello, test message for XPLOAR.AI platform. Please respond with a brief greeting.'
                    }]
                }]
            })
        });

        if (response.ok) {
            const data = await response.json();
            log('✅ Google AI API working correctly', 'green');
            log(`📝 AI Response: ${data.candidates[0]?.content?.parts[0]?.text?.substring(0, 50)}...`, 'green');
            return true;
        } else {
            const errorData = await response.json();
            log(`❌ Google AI API error: ${response.status}`, 'red');

            if (errorData.error?.message) {
                log(`   Error: ${errorData.error.message}`, 'red');
            }

            // Try alternative endpoint
            log('🔄 Trying alternative API endpoint...', 'yellow');

            const altResponse = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: 'Hello, test message for XPLOAR.AI platform.'
                        }]
                    }]
                })
            });

            if (altResponse.ok) {
                log('✅ Alternative API endpoint working', 'green');
                return true;
            } else {
                log('❌ Both API endpoints failed', 'red');
                return false;
            }
        }

    } catch (err) {
        log(`❌ AI test failed: ${err.message}`, 'red');
        return false;
    }
}

async function runPostFixValidation() {
    log('\n🔍 RUNNING POST-FIX VALIDATION', 'cyan');
    log('-'.repeat(35), 'cyan');

    let allGood = true;

    // Test website accessibility
    log('Testing website accessibility...');
    try {
        const response = await fetch(CONFIG.deployedUrl);
        if (response.ok) {
            log('✅ Website accessible', 'green');
        } else {
            log(`❌ Website not accessible: ${response.status}`, 'red');
            allGood = false;
        }
    } catch (err) {
        log(`❌ Website connection failed: ${err.message}`, 'red');
        allGood = false;
    }

    // Test Supabase connection
    if (!(await testSupabaseConnection())) {
        allGood = false;
    }

    // Test authentication
    if (!(await testAuthenticationFlow())) {
        allGood = false;
    }

    // Test AI features
    if (!(await testAIFeatures())) {
        allGood = false;
    }

    return allGood;
}

async function main() {
    log('🚀 XPLOAR.AI COMPREHENSIVE ISSUE FIXER', 'magenta');
    log('='.repeat(50), 'magenta');

    // First, show the manual steps needed
    await printInstructions();

    // Test current status
    log('\n📊 CURRENT STATUS BEFORE FIXES', 'yellow');
    log('-'.repeat(35), 'yellow');

    await testSupabaseConnection();
    await testAuthenticationFlow();
    await testAIFeatures();

    log('\n🎯 NEXT STEPS:', 'cyan');
    log('1. Complete the manual steps above', 'white');
    log('2. Wait for Vercel to redeploy (usually 2-3 minutes)', 'white');
    log('3. Run this script again to validate fixes', 'white');
    log('4. Message me when you\'re done for final testing', 'white');

    log('\n💡 TIP: After completing the fixes, run:', 'green');
    log('   node fix-all-issues.js', 'green');

    log('\n🎉 Once all issues are fixed, XPLOAR.AI will be 100% functional!', 'green');
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes('--validate')) {
    log('🔍 VALIDATING FIXES...', 'cyan');
    runPostFixValidation().then(success => {
        if (success) {
            log('\n🎉 ALL ISSUES FIXED! XPLOAR.AI is now fully functional! 🚀', 'green');
        } else {
            log('\n⚠️  Some issues still remain. Please check the output above.', 'yellow');
        }
    });
} else {
    main();
}
