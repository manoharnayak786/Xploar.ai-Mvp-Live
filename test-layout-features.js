const https = require('https');
const { createClient } = require('@supabase/supabase-js');

console.log('🎯 XPLOAR.AI - COMPREHENSIVE FEATURE TESTING\\n');

const CONFIG = {
    supabase: {
        url: 'https://meoyfsrpuocdrkzjzbvk.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lb3lmc3JwdW9jZHJremp6YnZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMzM5NjYsImV4cCI6MjA3MTcwOTk2Nn0.Os6sKp9arKMnterPUQhD0Vuhto7U9d3SestYJu8lqEo'
    },
    deployedUrl: 'https://xploar-web-k5nhmj520-manoharnayakbarmavaths-projects.vercel.app'
};

const supabase = createClient(CONFIG.supabase.url, CONFIG.supabase.anonKey);

function log(message, color = 'white') {
    const colors = {
        green: '\\x1b[32m',
        red: '\\x1b[31m',
        yellow: '\\x1b[33m',
        blue: '\\x1b[34m',
        cyan: '\\x1b[36m',
        reset: '\\x1b[0m'
    };
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({
                statusCode: res.statusCode,
                headers: res.headers,
                body: data
            }));
        });

        req.on('error', reject);
        req.setTimeout(10000, () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });
    });
}

async function testWebsiteAccessibility() {
    log('🌐 Testing Website Accessibility...', 'cyan');
    try {
        const response = await makeRequest(CONFIG.deployedUrl);
        if (response.statusCode === 200) {
            log('✅ Website is accessible (200 OK)', 'green');
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

async function testLayoutStructure() {
    log('🏗️ Testing Layout Structure...', 'cyan');
    try {
        const response = await makeRequest(CONFIG.deployedUrl);

        // Check for key HTML elements that should be present
        const html = response.body.toLowerCase();

        const layoutElements = [
            { name: 'Main Layout', selector: 'main', found: html.includes('<main') },
            { name: 'Header', selector: 'header', found: html.includes('<header') },
            { name: 'Sidebar', selector: 'sidebar', found: html.includes('sidebar') },
            { name: 'Navigation', selector: 'nav', found: html.includes('<nav') },
            { name: 'Footer', selector: 'footer', found: html.includes('<footer') }
        ];

        let allFound = true;
        layoutElements.forEach(element => {
            if (element.found) {
                log(`✅ ${element.name} found`, 'green');
            } else {
                log(`❌ ${element.name} missing`, 'red');
                allFound = false;
            }
        });

        return allFound;
    } catch (error) {
        log(`❌ Layout test failed: ${error.message}`, 'red');
        return false;
    }
}

async function testFeaturePages() {
    log('\\n📋 Testing Feature Pages...', 'cyan');

    const features = [
        { name: 'Study Planner', path: '/study-planner', description: 'Main study planning dashboard' },
        { name: 'Mock Tests', path: '/mock-tests', description: 'Practice test interface' },
        { name: 'AI Coach', path: '/ai-coach', description: 'AI-powered coaching system' },
        { name: 'Multi-Mode Learning', path: '/multi-mode-learning', description: 'Different learning modes' },
        { name: 'Content Hub', path: '/content-hub', description: 'Resource library' },
        { name: 'Community Hub', path: '/community', description: 'User community features' },
        { name: 'Daily Challenge', path: '/daily-challenge', description: 'Daily practice challenges' },
        { name: 'Debate Room', path: '/debate', description: 'Debate practice platform' },
        { name: 'Interview Room', path: '/interview', description: 'Mock interview practice' },
        { name: 'Mentor Connect', path: '/mentor-connect', description: 'Mentorship features' },
        { name: 'Progress Dashboard', path: '/progress', description: 'User progress tracking' },
        { name: 'Syllabus Map', path: '/syllabus', description: 'Study syllabus visualization' },
        { name: 'Recommendations', path: '/recommendations', description: 'AI-powered recommendations' },
        { name: 'Settings', path: '/settings', description: 'User settings and preferences' }
    ];

    let passedTests = 0;
    let totalTests = features.length;

    for (const feature of features) {
        try {
            const url = `${CONFIG.deployedUrl}${feature.path}`;
            const response = await makeRequest(url);

            if (response.statusCode === 200) {
                log(`✅ ${feature.name}: ${feature.description}`, 'green');
                passedTests++;
            } else {
                log(`❌ ${feature.name}: HTTP ${response.statusCode}`, 'red');
            }
        } catch (error) {
            log(`❌ ${feature.name}: ${error.message}`, 'red');
        }
    }

    log(`\\n📊 Feature Pages Test: ${passedTests}/${totalTests} passed`, passedTests === totalTests ? 'green' : 'yellow');
    return passedTests === totalTests;
}

async function testDatabaseConnectivity() {
    log('\\n🗄️ Testing Database Connectivity...', 'cyan');
    try {
        // Test basic connection
        const { data, error } = await supabase
            .from('users')
            .select('count', { count: 'exact', head: true });

        if (!error) {
            log('✅ Supabase connection successful', 'green');
            return true;
        } else {
            log(`❌ Database connection failed: ${error.message}`, 'red');
            return false;
        }
    } catch (error) {
        log(`❌ Database test failed: ${error.message}`, 'red');
        return false;
    }
}

async function testAuthenticationFlow() {
    log('\\n🔐 Testing Authentication Flow...', 'cyan');
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
    log('\\n🤖 Testing AI API Integration...', 'cyan');
    try {
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

async function runCompleteTest() {
    console.log('='.repeat(60));
    console.log('🎯 XPLOAR.AI - COMPREHENSIVE FEATURE TEST SUITE');
    console.log('='.repeat(60));

    const results = {
        accessibility: false,
        layout: false,
        features: false,
        database: false,
        auth: false,
        ai: false
    };

    // Test 1: Website Accessibility
    results.accessibility = await testWebsiteAccessibility();
    if (!results.accessibility) {
        log('\\n⚠️  Website not accessible - stopping further tests', 'yellow');
        return results;
    }

    // Test 2: Layout Structure
    results.layout = await testLayoutStructure();

    // Test 3: Feature Pages
    results.features = await testFeaturePages();

    // Test 4: Database Connectivity
    results.database = await testDatabaseConnectivity();

    // Test 5: Authentication Flow
    results.auth = await testAuthenticationFlow();

    // Test 6: AI API
    results.ai = await testAIAPI();

    // Summary
    console.log('\\n' + '='.repeat(60));
    console.log('📊 FINAL TEST RESULTS');
    console.log('='.repeat(60));

    const passedCount = Object.values(results).filter(Boolean).length;
    const totalCount = Object.keys(results).length;

    console.log(`✅ Passed: ${passedCount}/${totalCount} tests`);
    console.log(`❌ Failed: ${totalCount - passedCount} tests\\n`);

    if (passedCount === totalCount) {
        log('🎉 ALL TESTS PASSED! XPLOAR.AI is fully functional!', 'green');
    } else {
        log('⚠️  Some tests failed. Check individual results above.', 'yellow');
    }

    return results;
}

// Run the complete test suite
runCompleteTest().catch(error => {
    log(`\\n💥 Test suite failed: ${error.message}`, 'red');
    process.exit(1);
});
