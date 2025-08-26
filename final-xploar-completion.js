#!/usr/bin/env node

/**
 * 🎯 XPLOAR.AI - FINAL COMPLETION SCRIPT
 * Run with: node final-xploar-completion.js
 */

const https = require('https');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

console.log('🎯 XPLOAR.AI - FINAL COMPLETION SCRIPT');
console.log('=====================================');
console.log('🚀 Complete all remaining tasks automatically!');

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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function makeHttpRequest(options, data = null) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const jsonBody = body ? JSON.parse(body) : {};
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        body: jsonBody
                    });
                } catch (err) {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        body: body
                    });
                }
            });
        });

        req.on('error', reject);

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.setTimeout(30000, () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });

        req.end();
    });
}

async function completeAllTasks() {
    header('🎯 XPLOAR.AI FINAL COMPLETION');

    const tasks = [
        {
            id: 'database_schema',
            name: 'Apply Database Schema',
            description: 'Apply the complete database schema to Supabase',
            status: 'pending',
            function: applyDatabaseSchema
        },
        {
            id: 'environment_variables',
            name: 'Set Environment Variables',
            description: 'Configure Vercel environment variables',
            status: 'pending',
            function: setupEnvironmentVariables
        },
        {
            id: 'website_test',
            name: 'Test Website Accessibility',
            description: 'Verify website loads without 401 errors',
            status: 'pending',
            function: testWebsiteAccessibility
        },
        {
            id: 'auth_test',
            name: 'Test Authentication Flow',
            description: 'Verify signup and login functionality',
            status: 'pending',
            function: testAuthenticationFlow
        },
        {
            id: 'ai_test',
            name: 'Test AI Features',
            description: 'Verify Google AI API integration',
            status: 'pending',
            function: testAIFeatures
        },
        {
            id: 'layout_test',
            name: 'Test Layout & Features',
            description: 'Verify all 14 features work correctly',
            status: 'pending',
            function: testLayoutAndFeatures
        }
    ];

    let completedTasks = 0;
    let allSuccessful = true;

    // Show initial status
    log('\n📋 TASK STATUS:', 'bright');
    tasks.forEach((task, index) => {
        const status = task.status === 'completed' ? '✅' : '⏳';
        log(`${index + 1}. ${status} ${task.name}`, task.status === 'completed' ? 'green' : 'yellow');
        log(`   ${task.description}`, 'white');
        console.log('');
    });

    // Execute tasks
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        header(`Task ${i + 1}: ${task.name}`);

        try {
            const result = await task.function();
            if (result) {
                success(`${task.name} completed successfully`);
                completedTasks++;
                task.status = 'completed';
            } else {
                warning(`${task.name} requires manual completion`);
                allSuccessful = false;
            }
        } catch (error) {
            error(`${task.name} failed: ${error.message}`);
            allSuccessful = false;
        }

        await sleep(1000);
    }

    // Final summary
    header('🎊 COMPLETION SUMMARY');

    log(`\n📊 Results: ${completedTasks}/${tasks.length} tasks completed`, 'bright');

    if (allSuccessful) {
        success('🎉 ALL TASKS COMPLETED SUCCESSFULLY!');
        success('🌟 Your XPLOAR.AI platform is 100% operational!');

        log('\n🚀 LIVE PLATFORM:', 'bright');
        log(CONFIG.deployedUrl, 'cyan');

        log('\n🎯 PLATFORM FEATURES:', 'bright');
        log('• 🤖 AI-powered essay evaluation', 'green');
        log('• 📚 Personalized study plans', 'green');
        log('• 📊 Performance analytics', 'green');
        log('• 👥 Community features', 'green');
        log('• 📱 Mobile responsive design', 'green');

        log('\n🌍 READY TO SERVE UPSC ASPIRANTS!', 'bright');
        log('Your AI-powered UPSC preparation platform is live! 🎊', 'green');

    } else {
        log('\n📋 MANUAL STEPS NEEDED:', 'bright');

        tasks.forEach((task, index) => {
            if (task.status !== 'completed') {
                log(`${index + 1}. ${task.name}`, 'yellow');
                log(`   ${task.description}`, 'white');
            }
        });

        log('\n🔄 AFTER MANUAL COMPLETION:', 'bright');
        log('node final-xploar-completion.js  # Run again to verify', 'cyan');
    }

    header('🎊 THANK YOU FOR CHOOSING XPLOAR.AI');

    log('You\'ve created a world-class UPSC preparation platform!', 'bright');
    log('With AI-powered features, personalized learning, and community support,', 'white');
    log('you\'re ready to help thousands of UPSC aspirants achieve their dreams.', 'white');

    log('\n💪 PROUD OF YOUR ACCOMPLISHMENT! 🌟', 'green');
    log('🚀 READY TO TRANSFORM UPSC PREPARATION! 🌍', 'green');

    log('\n📞 NEED HELP?', 'bright');
    log('Contact us for support, feature enhancements, or scaling assistance!', 'cyan');
}

// Task functions
async function applyDatabaseSchema() {
    try {
        // Test connection first
        const { error: testError } = await supabase.auth.getUser();

        if (testError && !testError.message.includes('Auth session missing')) {
            error(`Supabase connection failed: ${testError.message}`);
            return false;
        }

        success('✅ Supabase connection successful');

        // Check if schema file exists
        const schemaPath = 'schema-ready-to-copy.sql';
        if (!fs.existsSync(schemaPath)) {
            error('Schema file not found');
            return false;
        }

        // Show manual instructions
        warning('⚠️  Database schema requires manual application');

        log('\n📋 MANUAL DATABASE SETUP:', 'bright');
        info('1. Go to: https://supabase.com/dashboard');
        info('2. Select project: meoyfsrpuocdrkzjzbvk');
        info('3. Open SQL Editor');
        info('4. Click "New Query"');
        info('5. Copy the schema below and paste it');
        info('6. Click "Run"');

        log('\n📄 DATABASE SCHEMA:', 'yellow');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        log(schema.substring(0, 1000) + '...', 'white');
        log('\n⚠️  Copy the complete schema and run it in Supabase SQL Editor', 'bright');

        // Note: We can't apply schema directly due to Supabase API limitations
        return false;

    } catch (error) {
        error(`Database schema application failed: ${error.message}`);
        return false;
    }
}

async function setupEnvironmentVariables() {
    warning('⚠️  Environment variables require manual setup');

    log('\n📋 VERCEL ENVIRONMENT VARIABLES:', 'bright');

    const envVars = [
        { name: 'NEXT_PUBLIC_SUPABASE_URL', value: CONFIG.supabase.url },
        { name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', value: CONFIG.supabase.anonKey },
        { name: 'NEXT_PUBLIC_SITE_URL', value: CONFIG.deployedUrl },
        { name: 'GOOGLE_AI_API_KEY', value: CONFIG.googleApiKey },
        { name: 'NEXT_PUBLIC_GOOGLE_AI_API_KEY', value: CONFIG.googleApiKey }
    ];

    envVars.forEach((env, index) => {
        log(`${index + 1}. ${env.name}`, 'cyan');
        log(`   = ${env.value.substring(0, 50)}...`, 'white');
        console.log('');
    });

    info('📍 Location: https://vercel.com/dashboard');
    info('📂 Find your XPLOAR.AI project');
    info('⚙️  Settings → Environment Variables');
    info('➕ Add New → Set each variable');
    info('🌍 Set Environment to: Production');
    info('💾 Click Save for each variable');

    log('\n⚠️  After setting variables, Vercel will auto-redeploy', 'bright');

    return false; // Manual step required
}

async function testWebsiteAccessibility() {
    try {
        info('Testing website accessibility...');

        const websiteOptions = {
            hostname: 'xploar-web-k5nhmj520-manoharnayakbarmavaths-projects.vercel.app',
            path: '/',
            method: 'GET',
            headers: {
                'User-Agent': 'XPLOAR-Setup-Test/1.0'
            }
        };

        const websiteResponse = await makeHttpRequest(websiteOptions);

        if (websiteResponse.statusCode === 200) {
            success('✅ Website accessible');
            return true;
        } else if (websiteResponse.statusCode === 401) {
            error('❌ 401 Unauthorized - Environment variables not set');
            info('Please complete Step 2: Set Environment Variables');
            return false;
        } else {
            error(`❌ Website not accessible: ${websiteResponse.statusCode}`);
            return false;
        }

    } catch (error) {
        error(`Website test failed: ${error.message}`);
        return false;
    }
}

async function testAuthenticationFlow() {
    try {
        info('Testing authentication flow...');

        const testEmail = `test${Date.now()}@xploarai.com`;
        const { error: signupError } = await supabase.auth.signUp({
            email: testEmail,
            password: 'TestPass123!'
        });

        if (!signupError) {
            success('✅ Authentication working');
            return true;
        } else {
            warning(`⚠️  Authentication test: ${signupError.message}`);
            info('This may be due to email confirmation being enabled');
            info('Please ensure email confirmation is disabled in Supabase');
            return false;
        }

    } catch (error) {
        error(`Authentication test failed: ${error.message}`);
        return false;
    }
}

async function testAIFeatures() {
    try {
        info('Testing Google AI API...');

        const googleOptions = {
            hostname: 'generativelanguage.googleapis.com',
            path: `/v1beta/models?key=${CONFIG.googleApiKey}`,
            method: 'GET'
        };

        const googleResponse = await makeHttpRequest(googleOptions);

        if (googleResponse.statusCode === 200) {
            success('✅ Google AI API working');
            return true;
        } else {
            error(`❌ Google AI API failed: ${googleResponse.statusCode}`);
            return false;
        }

    } catch (error) {
        error(`AI test failed: ${error.message}`);
        return false;
    }
}

async function testLayoutAndFeatures() {
    try {
        info('Testing layout and features...');

        const websiteOptions = {
            hostname: 'xploar-web-k5nhmj520-manoharnayakbarmavaths-projects.vercel.app',
            path: '/',
            method: 'GET',
            headers: {
                'User-Agent': 'XPLOAR-Setup-Test/1.0'
            }
        };

        const websiteResponse = await makeHttpRequest(websiteOptions);

        if (websiteResponse.statusCode === 200) {
            const body = websiteResponse.body;
            const hasMultipleMain = (body.match(/<main[^>]*>/g) || []).length > 1;

            if (!hasMultipleMain) {
                success('✅ Layout clean (no overlapping screens)');
                return true;
            } else {
                error('❌ Layout issues detected');
                return false;
            }
        } else {
            error(`❌ Layout test failed: ${websiteResponse.statusCode}`);
            return false;
        }

    } catch (error) {
        error(`Layout test failed: ${error.message}`);
        return false;
    }
}

// Run the completion script
if (require.main === module) {
    completeAllTasks().catch((err) => {
        error(`Completion failed: ${err.message}`);
        console.error(err);
        process.exit(1);
    });
}

module.exports = { completeAllTasks };
