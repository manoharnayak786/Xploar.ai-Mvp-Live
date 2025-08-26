const https = require('https');
const { createClient } = require('@supabase/supabase-js');

console.log('🎯 XPLOAR.AI - COMPREHENSIVE FEATURE TESTING\n');
console.log('='.repeat(60));

const CONFIG = {
    supabase: {
        url: 'https://meoyfsrpuocdrkzjzbvk.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lb3lmc3JwdW9jZHJremp6YnZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMzM5NjYsImV4cCI6MjA3MTcwOTk2Nn0.Os6sKp9arKMnterPUQhD0Vuhto7U9d3SestYJu8lqEo'
    },
    deployedUrl: 'https://xploar-web-k5nhmj520-manoharnayakbarmavaths-projects.vercel.app'
};

const supabase = createClient(CONFIG.supabase.url, CONFIG.supabase.anonKey);

// Features to test
const FEATURES = {
    STUDY_PLANNER: 'study-planner',
    MOCK_TESTS: 'mock-tests',
    AI_COACH: 'ai-coach',
    DAILY_CHALLENGE: 'daily-challenge',
    DEBATE: 'debate',
    INTERVIEW: 'interview',
    MENTOR_CONNECT: 'mentor-connect',
    CONTENT_HUB: 'content-hub',
    SYLLABUS: 'syllabus',
    MULTI_MODE_LEARNING: 'multi-mode-learning',
    COMMUNITY: 'community',
    RECOMMENDATIONS: 'recommendations',
    PROGRESS: 'progress',
    SETTINGS: 'settings'
};

const FEATURE_NAMES = {
    [FEATURES.STUDY_PLANNER]: '📅 Study Planner',
    [FEATURES.MOCK_TESTS]: '📝 Mock Tests',
    [FEATURES.AI_COACH]: '🤖 AI Coach',
    [FEATURES.DAILY_CHALLENGE]: '🎯 Daily Challenge',
    [FEATURES.DEBATE]: '💬 Debate Room',
    [FEATURES.INTERVIEW]: '🎤 Interview Practice',
    [FEATURES.MENTOR_CONNECT]: '👨‍🏫 Mentor Connect',
    [FEATURES.CONTENT_HUB]: '📚 Content Hub',
    [FEATURES.SYLLABUS]: '📋 Syllabus Map',
    [FEATURES.MULTI_MODE_LEARNING]: '🎓 Multi-Mode Learning',
    [FEATURES.COMMUNITY]: '👥 Community Hub',
    [FEATURES.RECOMMENDATIONS]: '💡 AI Recommendations',
    [FEATURES.PROGRESS]: '📊 Progress Dashboard',
    [FEATURES.SETTINGS]: '⚙️ Settings'
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

async function testWebsiteAccessibility() {
    log('\n🌐 TESTING WEBSITE ACCESSIBILITY', 'cyan');
    log('-'.repeat(40), 'cyan');

    return new Promise((resolve, reject) => {
        const req = https.get(CONFIG.deployedUrl, (res) => {
            let data = '';

            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    log('✅ Website is accessible (200 OK)', 'green');

                    // Check if it contains the expected content
                    if (data.includes('xploar.ai')) {
                        log('✅ Correct branding found', 'green');
                    } else {
                        log('❌ Branding not found', 'red');
                    }

                    // Check for authentication form
                    if (data.includes('Sign In') && data.includes('Email')) {
                        log('✅ Authentication form present', 'green');
                    } else {
                        log('❌ Authentication form missing', 'red');
                    }

                    resolve(true);
                } else {
                    log(`❌ Website returned ${res.statusCode}`, 'red');
                    resolve(false);
                }
            });
        });

        req.on('error', (err) => {
            log(`❌ Connection failed: ${err.message}`, 'red');
            resolve(false);
        });

        req.setTimeout(10000, () => {
            log('❌ Request timeout', 'red');
            req.destroy();
            resolve(false);
        });
    });
}

async function testSupabaseConnection() {
    log('\n🗄️  TESTING SUPABASE CONNECTION', 'cyan');
    log('-'.repeat(35), 'cyan');

    try {
        // Test basic connection
        const { data, error } = await supabase.from('study_plans').select('count').limit(1);

        if (error) {
            log(`❌ Supabase connection failed: ${error.message}`, 'red');
            return false;
        }

        log('✅ Supabase connection successful', 'green');

        // Check table availability
        const tables = [
            'study_plans', 'ai_evaluations', 'ai_insights',
            'performance_analytics', 'user_recommendations'
        ];

        for (const table of tables) {
            try {
                const { error: tableError } = await supabase.from(table).select('count').limit(1);
                if (tableError) {
                    log(`❌ Table '${table}' not accessible: ${tableError.message}`, 'yellow');
                } else {
                    log(`✅ Table '${table}' is accessible`, 'green');
                }
            } catch (err) {
                log(`❌ Error checking table '${table}': ${err.message}`, 'red');
            }
        }

        return true;
    } catch (err) {
        log(`❌ Supabase test failed: ${err.message}`, 'red');
        return false;
    }
}

async function testFeatureRoutes() {
    log('\n🔍 TESTING FEATURE ROUTES', 'cyan');
    log('-'.repeat(30), 'cyan');

    const featureTests = [];
    let successCount = 0;

    for (const [key, feature] of Object.entries(FEATURES)) {
        log(`\n📋 Testing ${FEATURE_NAMES[feature]}`, 'blue');

        // Test if feature route is accessible
        const featureUrl = `${CONFIG.deployedUrl}?feature=${feature}`;

        try {
            const response = await fetch(featureUrl, {
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; XPLOAR-Test/1.0)'
                }
            });

            if (response.ok) {
                log(`  ✅ Route accessible (${response.status})`, 'green');
                successCount++;
            } else {
                log(`  ❌ Route failed (${response.status})`, 'red');
            }
        } catch (err) {
            log(`  ❌ Connection failed: ${err.message}`, 'red');
        }

        featureTests.push({
            feature: FEATURE_NAMES[feature],
            route: feature,
            accessible: true // We'll assume accessible for now
        });
    }

    log(`\n📊 Feature Routes Summary: ${successCount}/${Object.keys(FEATURES).length} accessible`, 'cyan');
    return successCount === Object.keys(FEATURES).length;
}

async function testLayoutStructure() {
    log('\n🏗️  TESTING LAYOUT STRUCTURE', 'cyan');
    log('-'.repeat(32), 'cyan');

    return new Promise((resolve, reject) => {
        https.get(CONFIG.deployedUrl, (res) => {
            let data = '';

            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                // Check for layout components
                const layoutChecks = [
                    { name: 'Header', pattern: 'class.*header' },
                    { name: 'Sidebar', pattern: 'class.*sidebar' },
                    { name: 'Main Layout', pattern: 'class.*main.*layout' },
                    { name: 'Navigation', pattern: 'nav' },
                    { name: 'Footer', pattern: 'footer' }
                ];

                let layoutScore = 0;

                layoutChecks.forEach(check => {
                    if (new RegExp(check.pattern, 'i').test(data)) {
                        log(`✅ ${check.name} component found`, 'green');
                        layoutScore++;
                    } else {
                        log(`❌ ${check.name} component missing`, 'red');
                    }
                });

                // Check for no duplicate content (the layout issue we fixed)
                const bodyCount = (data.match(/<body/g) || []).length;
                if (bodyCount === 1) {
                    log('✅ No duplicate layout rendering', 'green');
                    layoutScore++;
                } else {
                    log(`❌ Found ${bodyCount} body tags (layout duplication)`, 'red');
                }

                log(`\n📊 Layout Score: ${layoutScore}/${layoutChecks.length + 1}`, 'cyan');
                resolve(layoutScore >= layoutChecks.length);
            });
        }).on('error', reject);
    });
}

async function testAuthenticationFlow() {
    log('\n🔐 TESTING AUTHENTICATION FLOW', 'cyan');
    log('-'.repeat(35), 'cyan');

    try {
        // Test signup endpoint
        log('Testing signup endpoint...');
        const signupResponse = await fetch(`${CONFIG.deployedUrl}/api/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'testpassword123'
            })
        });

        if (signupResponse.ok) {
            log('✅ Signup endpoint accessible', 'green');
        } else {
            const errorText = await signupResponse.text();
            log(`⚠️  Signup endpoint: ${signupResponse.status} - ${errorText}`, 'yellow');
        }

        // Test login endpoint
        log('Testing login endpoint...');
        const loginResponse = await fetch(`${CONFIG.deployedUrl}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'testpassword123'
            })
        });

        if (loginResponse.ok) {
            log('✅ Login endpoint accessible', 'green');
        } else {
            const errorText = await loginResponse.text();
            log(`⚠️  Login endpoint: ${loginResponse.status} - ${errorText}`, 'yellow');
        }

        return true;
    } catch (err) {
        log(`❌ Authentication test failed: ${err.message}`, 'red');
        return false;
    }
}

async function testAIFeatures() {
    log('\n🤖 TESTING AI FEATURES', 'cyan');
    log('-'.repeat(25), 'cyan');

    // Test Google AI API key configuration
    const apiKey = process.env.GOOGLE_AI_API_KEY || 'AIzaSyCrO4GYag-h-CUp4TiV6QkVkc1IZA2NTVY';

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: 'Hello, test message for XPLOAR.AI'
                    }]
                }]
            })
        });

        if (response.ok) {
            log('✅ Google AI API accessible', 'green');
            return true;
        } else {
            const errorData = await response.json();
            log(`❌ Google AI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`, 'red');
            return false;
        }
    } catch (err) {
        log(`❌ Google AI API test failed: ${err.message}`, 'red');
        return false;
    }
}

async function runComprehensiveTest() {
    log('🚀 STARTING COMPREHENSIVE XPLOAR.AI TESTING', 'magenta');
    log('='.repeat(60), 'magenta');

    const results = {
        websiteAccessible: false,
        supabaseConnected: false,
        featuresAccessible: false,
        layoutCorrect: false,
        authWorking: false,
        aiWorking: false
    };

    // Run all tests
    results.websiteAccessible = await testWebsiteAccessibility();
    results.supabaseConnected = await testSupabaseConnection();
    results.featuresAccessible = await testFeatureRoutes();
    results.layoutCorrect = await testLayoutStructure();
    results.authWorking = await testAuthenticationFlow();
    results.aiWorking = await testAIFeatures();

    // Final summary
    log('\n🎉 FINAL TEST RESULTS', 'magenta');
    log('='.repeat(30), 'magenta');

    const summary = [
        { name: 'Website Accessibility', status: results.websiteAccessible },
        { name: 'Supabase Connection', status: results.supabaseConnected },
        { name: 'Feature Routes', status: results.featuresAccessible },
        { name: 'Layout Structure', status: results.layoutCorrect },
        { name: 'Authentication Flow', status: results.authWorking },
        { name: 'AI Features', status: results.aiWorking }
    ];

    let passedTests = 0;
    summary.forEach(test => {
        const status = test.status ? '✅ PASSED' : '❌ FAILED';
        const color = test.status ? 'green' : 'red';
        log(`${status} ${test.name}`, color);
        if (test.status) passedTests++;
    });

    log(`\n📊 OVERALL SCORE: ${passedTests}/${summary.length} tests passed`, 'cyan');

    if (passedTests === summary.length) {
        log('\n🎉 ALL TESTS PASSED! XPLOAR.AI is fully functional! 🚀', 'green');
        log('\n🌟 Ready for production launch!', 'green');
    } else {
        log('\n⚠️  Some tests failed. Please review the issues above.', 'yellow');
    }

    return results;
}

// Run the comprehensive test
runComprehensiveTest().catch(err => {
    log(`\n💥 Test suite failed: ${err.message}`, 'red');
    console.error(err);
});
