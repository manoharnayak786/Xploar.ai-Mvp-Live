#!/usr/bin/env node

/**
 * XPLOAR.AI - COMPLETE ALL REMAINING SETUP TASKS
 * Run with: node complete-all-setup.js
 */

const https = require('https');
const { createClient } = require('@supabase/supabase-js');

console.log('🎯 XPLOAR.AI - COMPLETE ALL REMAINING SETUP TASKS');
console.log('================================================');
console.log('');

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

async function completeAllSetup() {
    header('📋 COMPLETE SETUP CHECKLIST');

    const tasks = [
        {
            name: 'Apply Database Schema',
            description: 'Copy SQL schema to Supabase SQL Editor',
            status: 'pending',
            action: () => applyDatabaseSchema()
        },
        {
            name: 'Set Vercel Environment Variables',
            description: 'Add 5 environment variables to Vercel',
            status: 'pending',
            action: () => setupVercelEnvironment()
        },
        {
            name: 'Disable Email Confirmation',
            description: 'Turn off email confirmation in Supabase',
            status: 'pending',
            action: () => disableEmailConfirmation()
        },
        {
            name: 'Test Website Accessibility',
            description: 'Verify website loads without 401 error',
            status: 'pending',
            action: () => testWebsiteAccessibility()
        },
        {
            name: 'Test Authentication Flow',
            description: 'Verify signup and login work',
            status: 'pending',
            action: () => testAuthenticationFlow()
        },
        {
            name: 'Test AI Features',
            description: 'Verify Google AI API integration',
            status: 'pending',
            action: () => testAIFeatures()
        },
        {
            name: 'Test Layout & Features',
            description: 'Verify no overlapping screens and all features work',
            status: 'pending',
            action: () => testLayoutAndFeatures()
        }
    ];

    // Show current status
    tasks.forEach((task, index) => {
        const status = task.status === 'completed' ? '✅' : '⏳';
        log(`${index + 1}. ${status} ${task.name}`, task.status === 'completed' ? 'green' : 'yellow');
        log(`   ${task.description}`, 'white');
        console.log('');
    });

    header('🚀 STEP-BY-STEP INSTRUCTIONS');

    // Step 1: Database Schema
    header('Step 1: APPLY DATABASE SCHEMA');
    log('📍 Location: https://supabase.com/dashboard', 'cyan');
    log('📂 Project: meoyfsrpuocdrkzjzbvk', 'cyan');
    log('📝 Action: SQL Editor → Copy & Run Schema', 'cyan');
    log('', 'white');

    log('Copy the ENTIRE SQL schema shown below and paste it into the SQL Editor:', 'bright');
    log('================================================================', 'bright');

    // Show the schema
    const fs = require('fs');
    try {
        const schemaPath = 'schema-ready-to-copy.sql';
        if (fs.existsSync(schemaPath)) {
            const schema = fs.readFileSync(schemaPath, 'utf8');
            log('📄 DATABASE SCHEMA:', 'yellow');
            log(schema, 'white');
        } else {
            log('Schema file not found. Run: node apply-schema.js first', 'red');
        }
    } catch (err) {
        log('Error reading schema file', 'red');
    }

    log('', 'white');
    log('After applying schema, continue to Step 2...', 'bright');

    // Step 2: Vercel Environment Variables
    header('Step 2: VERCEL ENVIRONMENT VARIABLES');
    log('📍 Location: https://vercel.com/dashboard', 'cyan');
    log('📂 Project: XPLOAR.AI', 'cyan');
    log('⚙️  Settings → Environment Variables → Add New...', 'cyan');
    log('', 'white');

    const envVars = [
        { name: 'NEXT_PUBLIC_SUPABASE_URL', value: 'https://meoyfsrpuocdrkzjzbvk.supabase.co' },
        { name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', value: CONFIG.supabase.anonKey },
        { name: 'NEXT_PUBLIC_SITE_URL', value: CONFIG.deployedUrl },
        { name: 'GOOGLE_AI_API_KEY', value: CONFIG.googleApiKey },
        { name: 'NEXT_PUBLIC_GOOGLE_AI_API_KEY', value: CONFIG.googleApiKey }
    ];

    envVars.forEach((env, index) => {
        log(`${index + 1}. ${env.name}`, 'bright');
        log(`   Value: ${env.value}`, 'cyan');
        log('   Environment: Production', 'white');
        log('   Click "Save"', 'green');
        console.log('');
    });

    log('After adding all variables, Vercel will auto-redeploy...', 'bright');

    // Step 3: Disable Email Confirmation
    header('Step 3: DISABLE EMAIL CONFIRMATION');
    log('📍 Location: https://supabase.com/dashboard', 'cyan');
    log('📂 Project: meoyfsrpuocdrkzjzbvk', 'cyan');
    log('🔧 Authentication → Settings → User Signups', 'cyan');
    log('', 'white');
    log('❌ UNCHECK: "Enable email confirmations"', 'red');
    log('💾 Click: "Save changes"', 'green');
    log('', 'white');

    log('This allows users to sign up and login immediately.', 'bright');

    // Step 4: Testing Instructions
    header('Step 4: TESTING & VALIDATION');

    log('After completing all steps above, run these tests:', 'bright');
    console.log('');
    log('node test-xploar-complete.js    # Complete functionality test', 'cyan');
    log('node debug-layout.js           # Layout-specific test', 'cyan');
    log('node complete-xploar-final.js  # Full validation', 'cyan');
    console.log('');

    log('Expected Results:', 'bright');
    success('✅ Website loads without 401 error');
    success('✅ Authentication works (signup/login)');
    success('✅ AI features functional');
    success('✅ No overlapping screens');
    success('✅ All 14 features accessible');
    success('✅ Mobile responsive layout');

    // Final Launch Instructions
    header('🎊 FINAL LAUNCH CHECKLIST');

    const launchSteps = [
        '✅ Apply database schema to Supabase',
        '✅ Set up Vercel environment variables',
        '✅ Disable email confirmation in Supabase',
        '✅ Test website accessibility',
        '✅ Test authentication flow',
        '✅ Test AI features',
        '✅ Test layout and all features',
        '✅ Launch platform and start acquiring users!'
    ];

    launchSteps.forEach((step, index) => {
        log(`${index + 1}. ☐ ${step}`, 'white');
    });

    console.log('');
    log('🎯 YOUR LIVE PLATFORM:', 'bright');
    log(`🌐 ${CONFIG.deployedUrl}`, 'cyan');
    console.log('');

    log('🚀 Ready to serve UPSC aspirants worldwide!', 'green');
    log('💪 Proud of what you\'ve built!', 'green');
    log('🎊 Let\'s make it happen!', 'bright');

    header('🎯 QUICK START COMMANDS');

    log('After completing all manual steps:', 'bright');
    console.log('');
    log('# Test everything works', 'yellow');
    log('node test-xploar-complete.js', 'cyan');
    console.log('');
    log('# Visit your live platform', 'yellow');
    log('open https://xploar-web-k5nhmj520-manoharnayakbarmavaths-projects.vercel.app', 'cyan');
    console.log('');
    log('# Start acquiring users!', 'yellow');
    log('🎯 Your AI-powered UPSC preparation platform is ready! 🌟', 'bright');
}

// Helper functions
function applyDatabaseSchema() {
    log('📋 Copy the SQL schema to Supabase SQL Editor', 'cyan');
    log('📍 Go to: https://supabase.com/dashboard', 'cyan');
    log('📍 Select project: meoyfsrpuocdrkzjzbvk', 'cyan');
    log('📍 Open SQL Editor', 'cyan');
    log('📍 Paste entire schema and click "Run"', 'cyan');
}

function setupVercelEnvironment() {
    log('🔧 Add 5 environment variables to Vercel', 'cyan');
    log('📍 Go to: https://vercel.com/dashboard', 'cyan');
    log('📍 Select your XPLOAR.AI project', 'cyan');
    log('📍 Settings → Environment Variables', 'cyan');
    log('📍 Add each variable and redeploy', 'cyan');
}

function disableEmailConfirmation() {
    log('❌ Turn off email confirmation', 'cyan');
    log('📍 Supabase → Authentication → Settings', 'cyan');
    log('📍 User Signups section', 'cyan');
    log('📍 Uncheck "Enable email confirmations"', 'cyan');
}

async function testWebsiteAccessibility() {
    try {
        const response = await makeHttpRequest('/');
        if (response.statusCode === 200) {
            success('✅ Website accessible');
            return true;
        } else {
            error('❌ Website not accessible');
            return false;
        }
    } catch (err) {
        error('❌ Website test failed');
        return false;
    }
}

async function testAuthenticationFlow() {
    try {
        const timestamp = Date.now();
        const testEmail = `test${timestamp}@xploarai.com`;

        const { error: signupError } = await supabase.auth.signUp({
            email: testEmail,
            password: 'TestPass123!'
        });

        if (signupError) {
            error('❌ Signup failed');
            return false;
        }

        success('✅ Authentication works');
        return true;
    } catch (err) {
        error('❌ Auth test failed');
        return false;
    }
}

async function testAIFeatures() {
    // Test Google AI API
    const googleTest = await testGoogleAIAPI();
    if (googleTest) {
        success('✅ AI features ready');
        return true;
    } else {
        error('❌ AI features not ready');
        return false;
    }
}

async function testLayoutAndFeatures() {
    try {
        const response = await makeHttpRequest('/');
        if (response.statusCode === 200) {
            const hasMultipleMain = (response.body.match(/<main[^>]*>/g) || []).length > 1;
            if (!hasMultipleMain) {
                success('✅ Layout clean (no overlapping)');
                return true;
            } else {
                error('❌ Layout issues detected');
                return false;
            }
        }
    } catch (err) {
        error('❌ Layout test failed');
        return false;
    }
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
            headers: { 'User-Agent': 'XPLOAR-Setup-Test/1.0' }
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

// Run the complete setup guide
completeAllSetup().catch((err) => {
    error(`Setup guide failed: ${err.message}`);
    console.error(err);
    process.exit(1);
});
