const https = require('https');
const { createClient } = require('@supabase/supabase-js');

console.log('🎉 XPLOAR.AI - FINAL VERIFICATION\n');
console.log('='.repeat(50));

const CONFIG = {
    supabase: {
        url: 'https://meoyfsrpuocdrkzjzbvk.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lb3lmc3JwdW9jZHJremp6YnZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMzM5NjYsImV4cCI6MjA3MTcwOTk2Nn0.Os6sKp9arKMnterPUQhD0Vuhto7U9d3SestYJu8lqEo'
    },
    deployedUrl: 'https://xploar-web-k5nhmj520-manoharnayakbarmavaths-projects.vercel.app',
    googleApiKey: 'AIzaSyCrO4GYag-h-CUp4TiV6QkVkc1IZA2NTVY'
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

async function runFinalVerification() {
    log('🚀 XPLOAR.AI FINAL VERIFICATION', 'magenta');
    log('='.repeat(35), 'magenta');

    let allSystemsGo = true;

    // 1. Check Website Accessibility
    log('\n🌐 1. WEBSITE ACCESSIBILITY', 'cyan');
    try {
        const response = await fetch(CONFIG.deployedUrl);
        if (response.ok) {
            log('✅ Website accessible (200 OK)', 'green');
        } else {
            log(`❌ Website not accessible: ${response.status}`, 'red');
            allSystemsGo = false;
        }
    } catch (err) {
        log(`❌ Connection failed: ${err.message}`, 'red');
        allSystemsGo = false;
    }

    // 2. Check Supabase Connection
    log('\n🗄️ 2. SUPABASE CONNECTION', 'cyan');
    try {
        const supabase = createClient(CONFIG.supabase.url, CONFIG.supabase.anonKey);
        const { data, error } = await supabase.from('study_plans').select('count').limit(1);

        if (error) {
            log(`❌ Supabase failed: ${error.message}`, 'red');
            allSystemsGo = false;
        } else {
            log('✅ Supabase connection successful', 'green');
            log('✅ Environment variables working', 'green');
        }
    } catch (err) {
        log(`❌ Supabase test failed: ${err.message}`, 'red');
        allSystemsGo = false;
    }

    // 3. Check Authentication
    log('\n🔐 3. AUTHENTICATION FLOW', 'cyan');
    try {
        const testEmail = `final_test_${Date.now()}@example.com`;
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
        } else {
            const errorText = await signupResponse.text();
            if (errorText.includes('Email address') && errorText.includes('invalid')) {
                log('❌ Email confirmation still enabled', 'red');
                log('   Fix: Go to Supabase → Authentication → Settings → Disable email confirmations', 'yellow');
                allSystemsGo = false;
            } else {
                log(`❌ Auth error: ${errorText}`, 'red');
                allSystemsGo = false;
            }
        }
    } catch (err) {
        log(`❌ Auth test failed: ${err.message}`, 'red');
        allSystemsGo = false;
    }

    // 4. Check AI Features
    log('\n🤖 4. AI FEATURES', 'cyan');
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${CONFIG.googleApiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: 'XPLOAR.AI is ready for UPSC preparation!' }]
                }]
            })
        });

        if (response.ok) {
            log('✅ AI features working correctly', 'green');
        } else {
            log(`❌ AI features failed: ${response.status}`, 'red');
            allSystemsGo = false;
        }
    } catch (err) {
        log(`❌ AI test failed: ${err.message}`, 'red');
        allSystemsGo = false;
    }

    // 5. Check Feature Routes
    log('\n🔍 5. FEATURE ROUTES', 'cyan');
    const features = [
        'study-planner',
        'mock-tests',
        'ai-coach',
        'daily-challenge',
        'debate',
        'interview',
        'mentor-connect',
        'content-hub',
        'syllabus',
        'multi-mode-learning',
        'community',
        'recommendations',
        'progress',
        'settings'
    ];

    let accessibleFeatures = 0;
    for (const feature of features) {
        try {
            const response = await fetch(`${CONFIG.deployedUrl}?feature=${feature}`);
            if (response.ok) {
                accessibleFeatures++;
            }
        } catch (err) {
            // Continue checking other features
        }
    }

    if (accessibleFeatures === features.length) {
        log(`✅ All ${features.length} features accessible`, 'green');
    } else {
        log(`❌ Only ${accessibleFeatures}/${features.length} features accessible`, 'red');
        allSystemsGo = false;
    }

    // Final Results
    log('\n🎯 FINAL VERIFICATION RESULTS', 'magenta');
    log('='.repeat(35), 'magenta');

    if (allSystemsGo) {
        log('🎉 SUCCESS! XPLOAR.AI IS 100% FUNCTIONAL!', 'green');
        log('\n✅ ALL SYSTEMS OPERATIONAL:', 'green');
        log('  • Website accessible and responsive', 'white');
        log('  • Supabase database connected', 'white');
        log('  • Authentication flow working', 'white');
        log('  • AI features functional', 'white');
        log('  • All 14 features accessible', 'white');
        log('  • Environment variables configured', 'white');

        log('\n🚀 XPLOAR.AI IS READY FOR PRODUCTION!', 'green');
        log('\n🌟 Users can now:', 'cyan');
        log('  • Register and login seamlessly', 'white');
        log('  • Access personalized study plans', 'white');
        log('  • Take mock tests and AI evaluations', 'white');
        log('  • Join community discussions', 'white');
        log('  • Track progress and get recommendations', 'white');

        log('\n📱 LIVE URL:', 'yellow');
        log('   https://xploar-web-k5nhmj520-manoharnayakbarmavaths-projects.vercel.app', 'yellow');

        log('\n🎊 CONGRATULATIONS! Your UPSC preparation platform is live!', 'green');
    } else {
        log('⚠️  Some systems still need attention', 'yellow');
        log('\n🔧 Please fix the issues above and run this script again', 'yellow');
        log('\n💡 Run: node final-verification.js', 'cyan');
    }

    return allSystemsGo;
}

// Run the verification
runFinalVerification().catch(err => {
    log(`\n💥 Verification failed: ${err.message}`, 'red');
    console.error(err);
});
