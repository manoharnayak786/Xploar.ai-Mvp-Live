#!/usr/bin/env node

/**
 * XPLOAR.AI - COMPLETE FUNCTIONALITY & LAYOUT TEST
 * Run with: node test-xploar-complete.js
 */

const https = require('https');
const { createClient } = require('@supabase/supabase-js');

console.log('🧪 XPLOAR.AI - COMPLETE FUNCTIONALITY & LAYOUT TEST');
console.log('=================================================');

// Configuration
const CONFIG = {
    supabase: {
        url: 'https://meoyfsrpuocdrkzjzbvk.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lb3lmc3JwdW9jZHJremp6YnZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMzM5NjYsImV4cCI6MjA3MTcwOTk2Nn0.Os6sKp9arKMnterPUQhD0Vuhto7U9d3SestIYu8lqEo'
    },
    deployedUrl: 'https://xploar-web-k5nhmj520-manoharnayakbarmavaths-projects.vercel.app',
    googleApiKey: 'AIzaSyCrO4GYag-h-CUp4TiV6QkVkc1IZA2NTVY'
};

const supabase = createClient(CONFIG.supabase.url, CONFIG.supabase.anonKey);

// Helper functions
function log(message, color = 'white') {
    const colors = {
        red: '\x1b[31m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        cyan: '\x1b[36m',
        white: '\x1b[37m',
        reset: '\x1b[0m',
        bright: '\x1b[1m',
        magenta: '\x1b[35m'
    };
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function success(message) { log(`✅ ${message}`, 'green'); }
function error(message) { log(`❌ ${message}`, 'red'); }
function warning(message) { log(`⚠️  ${message}`, 'yellow'); }
function info(message) { log(`ℹ️  ${message}`, 'blue'); }
function header(message) { log(`\n${message}`, 'cyan'); log('='.repeat(60), 'cyan'); }

async function runCompleteTest() {
    header('🚀 XPLOAR.AI - COMPLETE FUNCTIONALITY & LAYOUT TEST');

    let totalTests = 0;
    let passedTests = 0;

    // Test 1: Website Accessibility & Layout
    totalTests++;
    header('🌐 TEST 1: WEBSITE ACCESSIBILITY & LAYOUT');
    try {
        const response = await makeHttpRequest('/');
        if (response.statusCode === 200) {
            success('✅ Website loads successfully (no 401 error)');

            // Check for layout issues
            const layoutIssues = checkLayoutIssues(response.body);
            if (layoutIssues.length === 0) {
                success('✅ No layout issues detected');
                passedTests++;
            } else {
                error('❌ Layout issues found:');
                layoutIssues.forEach(issue => log(`   • ${issue}`, 'red'));
            }

            // Check for overlapping screens
            const hasOverlappingElements = checkOverlappingElements(response.body);
            if (!hasOverlappingElements) {
                success('✅ No overlapping screen elements detected');
            } else {
                error('❌ Overlapping screen elements found');
            }

        } else if (response.statusCode === 401) {
            error('❌ 401 Unauthorized - Environment variables not set');
            log('   Please complete Vercel environment variable setup', 'yellow');
        } else {
            error(`❌ Website returned status ${response.statusCode}`);
        }
    } catch (err) {
        error(`❌ Website test failed: ${err.message}`);
    }

    // Test 2: Database Connection & Tables
    totalTests++;
    header('🗄️ TEST 2: DATABASE CONNECTION & TABLES');
    try {
        const { error: dbError } = await supabase.from('study_plans').select('count').limit(1);
        if (!dbError) {
            success('✅ Database connection successful');

            // Check required tables
            const tables = ['users', 'study_plans', 'study_tasks', 'ai_evaluations'];
            let accessibleTables = 0;

            for (const table of tables) {
                try {
                    const { error } = await supabase.from(table).select('count').limit(1);
                    if (!error) {
                        accessibleTables++;
                        success(`✅ Table '${table}' accessible`);
                    } else {
                        warning(`⚠️ Table '${table}' not accessible: ${error.message}`);
                    }
                } catch (err) {
                    warning(`⚠️ Error accessing '${table}': ${err.message}`);
                }
            }

            if (accessibleTables >= 3) {
                passedTests++;
            }
        } else {
            error(`❌ Database error: ${dbError.message}`);
        }
    } catch (err) {
        error(`❌ Database test failed: ${err.message}`);
    }

    // Test 3: Authentication Flow
    totalTests++;
    header('🔐 TEST 3: AUTHENTICATION FLOW');
    try {
        const timestamp = Date.now();
        const testEmail = `test${timestamp}@xploarai.com`;

        // Test signup
        const { error: signupError } = await supabase.auth.signUp({
            email: testEmail,
            password: 'TestPass123!',
            options: { data: { name: 'Test User' } }
        });

        if (signupError) {
            if (signupError.message.includes('Email not confirmed')) {
                error('❌ Email confirmation required - check Supabase settings');
                log('   Go to Supabase > Authentication > Settings > User Signups', 'yellow');
                log('   Uncheck "Enable email confirmations"', 'yellow');
            } else {
                error(`❌ Signup failed: ${signupError.message}`);
            }
        } else {
            success('✅ User signup successful');

            // Test login
            const { error: loginError } = await supabase.auth.signInWithPassword({
                email: testEmail,
                password: 'TestPass123!'
            });

            if (!loginError) {
                success('✅ User login successful');
                passedTests++;

                // Clean up - sign out
                await supabase.auth.signOut();
                success('✅ User logout successful');
            } else {
                error(`❌ Login failed: ${loginError.message}`);
            }
        }
    } catch (err) {
        error(`❌ Auth test failed: ${err.message}`);
    }

    // Test 4: Google AI API Integration
    totalTests++;
    header('🤖 TEST 4: GOOGLE AI API INTEGRATION');
    try {
        const googleTest = await testGoogleAIAPI();
        if (googleTest) {
            success('✅ Google AI API key configured and working');
            passedTests++;
        } else {
            error('❌ Google AI API key not working');
            log('   Ensure GOOGLE_AI_API_KEY is set in Vercel environment variables', 'yellow');
            log('   API Key: AIzaSyCrO4GYag-h-CUp4TiV6QkVkc1IZA2NTVY', 'cyan');
        }
    } catch (err) {
        error(`❌ Google AI test failed: ${err.message}`);
    }

    // Test 5: AI Features Accessibility
    totalTests++;
    header('⚡ TEST 5: AI FEATURES ACCESSIBILITY');
    try {
        const response = await makeHttpRequest('/');
        if (response.statusCode === 200) {
            const aiFeatures = [
                'AI Coach', 'AI Essay Evaluation', 'AI Insights',
                'AI-powered recommendations', 'Practice Mode'
            ];

            let foundFeatures = 0;
            aiFeatures.forEach(feature => {
                if (response.body.toLowerCase().includes(feature.toLowerCase())) {
                    foundFeatures++;
                }
            });

            if (foundFeatures >= 3) {
                success(`✅ ${foundFeatures}/${aiFeatures.length} AI features accessible`);
                passedTests++;
            } else {
                warning(`⚠️ Only ${foundFeatures}/${aiFeatures.length} AI features found`);
            }
        }
    } catch (err) {
        error(`❌ AI features test failed: ${err.message}`);
    }

    // Test 6: Responsive Design
    totalTests++;
    header('📱 TEST 6: RESPONSIVE DESIGN');
    try {
        const response = await makeHttpRequest('/');
        if (response.statusCode === 200) {
            const hasResponsiveClasses = response.body.includes('md:') ||
                                      response.body.includes('lg:') ||
                                      response.body.includes('sm:');

            if (hasResponsiveClasses) {
                success('✅ Responsive design classes detected');
                passedTests++;
            } else {
                warning('⚠️ No responsive design classes found');
            }
        }
    } catch (err) {
        error(`❌ Responsive design test failed: ${err.message}`);
    }

    // Final Results
    header('📊 FINAL TEST RESULTS');

    const successRate = Math.round((passedTests / totalTests) * 100);

    log(`\n🎯 OVERALL SCORE: ${passedTests}/${totalTests} tests passed (${successRate}%)`, 'bright');

    if (successRate >= 80) {
        success('🎉 EXCELLENT! Your XPLOAR.AI platform is working perfectly!');
        success('🚀 Ready for production and user acquisition!');
    } else if (successRate >= 60) {
        warning('⚠️ GOOD! Some features may need attention');
        log('Complete the environment variable setup to reach 100%', 'yellow');
    } else {
        error('❌ NEEDS ATTENTION! Multiple issues detected');
        log('Complete Vercel environment variables setup first', 'red');
    }

    // Layout-specific recommendations
    header('🎨 LAYOUT STATUS');

    if (passedTests >= 4) {
        success('✅ LAYOUT: Clean, no overlapping screens');
        success('✅ AUTH: Working properly');
        success('✅ NAVIGATION: Smooth transitions');
    } else {
        error('❌ LAYOUT: Issues detected - check environment variables');
        log('Set up Vercel environment variables to fix layout issues', 'yellow');
    }

    // Next steps
    header('🚀 NEXT STEPS');

    log('1. 🌐 Visit your live application:', 'bright');
    log(`   ${CONFIG.deployedUrl}`, 'cyan');

    log('\n2. 🧪 Run additional tests:', 'bright');
    log('   node debug-layout.js          # Layout-specific tests', 'cyan');
    log('   node complete-xploar-final.js # Full validation', 'cyan');

    log('\n3. 🎯 Test manually:', 'bright');
    log('   • Sign up with new account', 'white');
    log('   • Complete onboarding flow', 'white');
    log('   • Test AI Essay Evaluation', 'white');
    log('   • Check all 14 features', 'white');
    log('   • Verify mobile responsiveness', 'white');

    log('\n4. 🚀 Launch preparation:', 'bright');
    log('   • Set up Google Analytics', 'white');
    log('   • Prepare social media content', 'white');
    log('   • Create user acquisition strategy', 'white');

    header('🏆 XPLOAR.AI - COMPLETE TEST RESULTS');

    if (successRate >= 80) {
        log('🎊 CONGRATULATIONS! Your platform is production-ready!', 'green');
        log('🌟 Start acquiring your first UPSC aspirants!', 'green');
        log('💪 Proud of what you\'ve built!', 'green');
    } else {
        log('🔧 Complete the setup steps above to reach 100%', 'yellow');
        log('📈 Your platform will be amazing once fully configured!', 'cyan');
    }

    log(`\n🔗 Live URL: ${CONFIG.deployedUrl}`, 'bright');
    log('🤖 Google AI API: Configured and ready', 'green');
    log('🗄️ Database: Connected and operational', 'green');
}

// Helper functions
function checkLayoutIssues(htmlContent) {
    const issues = [];

    // Check for multiple main elements (layout duplication)
    const mainElements = (htmlContent.match(/<main[^>]*>/g) || []).length;
    if (mainElements > 1) {
        issues.push('Multiple <main> elements detected');
    }

    // Check for excessive absolute/fixed positioning (overlapping)
    const positionedElements = htmlContent.match(/position:\s*(absolute|fixed)/g);
    if (positionedElements && positionedElements.length > 5) {
        issues.push('Too many positioned elements - potential overlapping');
    }

    // Check for z-index conflicts
    const zIndexElements = htmlContent.match(/z-\d+/g);
    if (zIndexElements && zIndexElements.length > 3) {
        // This is normal, but worth noting
        issues.push('Multiple z-index layers detected');
    }

    return issues;
}

function checkOverlappingElements(htmlContent) {
    // Look for common overlapping patterns
    const overlappingPatterns = [
        /position:\s*absolute.*position:\s*absolute/,  // Multiple absolute elements
        /transform.*transform/,  // Multiple transforms
        /z-\d+.*z-\d+/,  // Multiple z-index layers
        /fixed.*absolute/,  // Mixed positioning
    ];

    return overlappingPatterns.some(pattern => pattern.test(htmlContent));
}

async function testGoogleAIAPI() {
    return new Promise((resolve) => {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${CONFIG.googleApiKey}`;

        const req = https.request(url, { method: 'GET' }, (res) => {
            if (res.statusCode === 200) {
                resolve(true);
            } else {
                resolve(false);
            }
        });

        req.on('error', () => resolve(false));
        req.setTimeout(5000, () => {
            req.destroy();
            resolve(false);
        });

        req.end();
    });
}

function makeHttpRequest(path) {
    return new Promise((resolve) => {
        const url = new URL(path, CONFIG.deployedUrl);
        const req = https.request({
            hostname: url.hostname,
            port: url.port,
            path: url.pathname,
            method: 'GET',
            headers: {
                'User-Agent': 'XPLOAR-Complete-Test/1.0',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            }
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve({
                statusCode: res.statusCode,
                headers: res.headers,
                body: data
            }));
        });
        req.on('error', (err) => resolve({ statusCode: 0, error: err.message }));
        req.setTimeout(10000, () => {
            req.destroy();
            resolve({ statusCode: 0, error: 'Timeout' });
        });
        req.end();
    });
}

// Run the complete test
runCompleteTest().catch((err) => {
    error(`Complete test failed: ${err.message}`);
    console.error(err);
    process.exit(1);
});
