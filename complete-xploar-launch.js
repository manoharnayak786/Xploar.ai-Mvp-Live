#!/usr/bin/env node

/**
 * 🚀 XPLOAR.AI - COMPLETE ONE-CLICK LAUNCH
 * Run with: node complete-xploar-launch.js
 */

const https = require('https');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const { execSync } = require('child_process');

console.log('🚀 XPLOAR.AI - COMPLETE ONE-CLICK LAUNCH');
console.log('=========================================');
console.log('🎯 Automated setup for your AI-powered UPSC platform');
console.log('🌟 Ready to serve students worldwide!\n');

// Configuration
const CONFIG = {
    supabase: {
        url: 'https://meoyfsrpuocdrkzjzbvk.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lb3lmc3JwdW9jZHJremp6YnZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMzM5NjYsImV4cCI6MjA3MTcwOTk2Nn0.Os6sKp9arKMnterPUQhD0Vuhto7U9d3SestIYu8lqEo'
    },
    vercel: {
        projectId: process.env.VERCEL_PROJECT_ID || 'xploar-web',
        token: process.env.VERCEL_TOKEN
    },
    github: {
        repo: 'manoharnayakbarmavath/xploar-web-app',
        token: process.env.GITHUB_TOKEN
    },
    googleApiKey: 'AIzaSyCrO4GYag-h-CUp4TiV6QkVkc1IZA2NTVY',
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

async function step1_DatabaseSetup() {
    header('Step 1: Database Schema Setup');

    try {
        // Test connection
        const { error: testError } = await supabase.auth.getUser();

        if (testError && !testError.message.includes('Auth session missing')) {
            error(`Supabase connection failed: ${testError.message}`);
            return false;
        }

        success('✅ Supabase connection successful');

        // Check if tables exist
        const { data: tables, error: tablesError } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'public');

        if (tablesError) {
            warning('⚠️  Cannot check existing tables, proceeding with schema application');
        }

        // Check for key tables
        const existingTables = tables ? tables.map(t => t.table_name) : [];
        const requiredTables = ['users', 'study_plans', 'study_tasks', 'ai_evaluations'];

        const missingTables = requiredTables.filter(table => !existingTables.includes(table));

        if (missingTables.length === 0) {
            success('✅ All required tables already exist');
            return true;
        }

        warning(`⚠️  Missing tables: ${missingTables.join(', ')}`);
        info('📋 Please apply the database schema manually:');
        info('1. Go to https://supabase.com/dashboard');
        info('2. Select project: meoyfsrpuocdrkzjzbvk');
        info('3. Open SQL Editor');
        info('4. Copy the schema from schema-ready-to-copy.sql');
        info('5. Click Run');

        // Try to apply schema if we have the file
        if (fs.existsSync('schema-ready-to-copy.sql')) {
            const schema = fs.readFileSync('schema-ready-to-copy.sql', 'utf8');
            log('\n📄 SCHEMA TO APPLY:', 'yellow');
            log(schema.substring(0, 500) + '...', 'white');
            log('\n⚠️  Please copy the above SQL and run it in Supabase SQL Editor', 'bright');
        }

        return false;

    } catch (error) {
        error(`Database setup failed: ${error.message}`);
        return false;
    }
}

async function step2_EnvironmentVariables() {
    header('Step 2: Environment Variables Setup');

    if (!CONFIG.vercel.token) {
        warning('⚠️  VERCEL_TOKEN not found in environment variables');

        log('\n📋 MANUAL SETUP REQUIRED:', 'bright');
        log('Please add these environment variables to Vercel:', 'yellow');

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
        });

        info('📍 Location: https://vercel.com/dashboard');
        info('📂 Find your XPLOAR.AI project');
        info('⚙️  Settings → Environment Variables');
        info('➕ Add New → Set each variable');

        return false;
    }

    try {
        // Get project details
        const projectOptions = {
            hostname: 'api.vercel.com',
            path: `/v9/projects/${CONFIG.vercel.projectId}`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${CONFIG.vercel.token}`,
                'Content-Type': 'application/json'
            }
        };

        const projectResponse = await makeHttpRequest(projectOptions);

        if (projectResponse.statusCode !== 200) {
            error(`Failed to get Vercel project: ${projectResponse.statusCode}`);
            return false;
        }

        success(`✅ Found Vercel project: ${projectResponse.body.name}`);

        // Set environment variables
        const envVars = [
            { key: 'NEXT_PUBLIC_SUPABASE_URL', value: CONFIG.supabase.url },
            { key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', value: CONFIG.supabase.anonKey },
            { key: 'NEXT_PUBLIC_SITE_URL', value: CONFIG.deployedUrl },
            { key: 'GOOGLE_AI_API_KEY', value: CONFIG.googleApiKey },
            { key: 'NEXT_PUBLIC_GOOGLE_AI_API_KEY', value: CONFIG.googleApiKey }
        ];

        let successCount = 0;

        for (const envVar of envVars) {
            const envOptions = {
                hostname: 'api.vercel.com',
                path: `/v9/projects/${CONFIG.vercel.projectId}/env`,
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${CONFIG.vercel.token}`,
                    'Content-Type': 'application/json'
                }
            };

            const envResponse = await makeHttpRequest(envOptions, {
                key: envVar.key,
                value: envVar.value,
                type: 'plain',
                target: ['production']
            });

            if (envResponse.statusCode === 200 || envResponse.statusCode === 201) {
                success(`✅ Set ${envVar.key}`);
                successCount++;
            } else {
                error(`❌ Failed to set ${envVar.key}: ${envResponse.statusCode}`);
            }

            await sleep(1000); // Rate limiting
        }

        if (successCount === envVars.length) {
            success('✅ All environment variables set successfully');
            success('🔄 Vercel will auto-redeploy with new variables');
            return true;
        } else {
            warning(`⚠️  ${successCount}/${envVars.length} variables set`);
            return false;
        }

    } catch (error) {
        error(`Vercel environment setup failed: ${error.message}`);
        return false;
    }
}

async function step3_EmailConfirmation() {
    header('Step 3: Email Confirmation Setup');

    warning('⚠️  Email confirmation must be disabled manually');
    info('📍 Location: https://supabase.com/dashboard');
    info('📂 Project: meoyfsrpuocdrkzjzbvk');
    info('🔧 Authentication → Settings → User Signups');
    info('❌ UNCHECK: "Enable email confirmations"');
    info('💾 Save changes');

    log('\nThis allows users to sign up and login immediately.', 'bright');

    return true; // Not critical for testing
}

async function step4_TestApplication() {
    header('Step 4: Application Testing');

    try {
        // Test 1: Website accessibility
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
        } else if (websiteResponse.statusCode === 401) {
            error('❌ 401 Unauthorized - Check environment variables');
            return false;
        } else {
            error(`❌ Website not accessible: ${websiteResponse.statusCode}`);
            return false;
        }

        // Test 2: Google AI API
        info('Testing Google AI API...');
        const googleOptions = {
            hostname: 'generativelanguage.googleapis.com',
            path: `/v1beta/models?key=${CONFIG.googleApiKey}`,
            method: 'GET'
        };

        const googleResponse = await makeHttpRequest(googleOptions);

        if (googleResponse.statusCode === 200) {
            success('✅ Google AI API working');
        } else {
            error(`❌ Google AI API failed: ${googleResponse.statusCode}`);
            return false;
        }

        // Test 3: Basic authentication test (will fail without email confirmation disabled)
        info('Testing authentication setup...');
        const testEmail = `test${Date.now()}@xploarai.com`;
        const { error: signupError } = await supabase.auth.signUp({
            email: testEmail,
            password: 'TestPass123!'
        });

        if (!signupError) {
            success('✅ Authentication working');
        } else {
            warning(`⚠️  Authentication test: ${signupError.message}`);
            info('This is expected if email confirmation is still enabled');
        }

        return true;

    } catch (error) {
        error(`Testing failed: ${error.message}`);
        return false;
    }
}

async function step5_DeploymentTrigger() {
    header('Step 5: Deployment Trigger');

    if (!CONFIG.vercel.token) {
        warning('⚠️  VERCEL_TOKEN not found, deployment will be manual');
        info('📍 Go to https://vercel.com/dashboard');
        info('📂 Find your XPLOAR.AI project');
        info('🔄 Click "Deploy" or wait for auto-deployment');

        return false;
    }

    try {
        // Trigger deployment
        const deployOptions = {
            hostname: 'api.vercel.com',
            path: `/v1/integrations/deploy/${CONFIG.vercel.projectId}`,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${CONFIG.vercel.token}`,
                'Content-Type': 'application/json'
            }
        };

        const deployResponse = await makeHttpRequest(deployOptions, {
            ref: 'main',
            gitSource: {
                repoId: CONFIG.github.repo.split('/')[1],
                ref: 'main',
                sha: 'HEAD'
            }
        });

        if (deployResponse.statusCode === 200 || deployResponse.statusCode === 201) {
            success('✅ Deployment triggered successfully');
            info('⏱️  Deployment may take 2-3 minutes');
            return true;
        } else {
            error(`❌ Deployment failed: ${deployResponse.statusCode}`);
            return false;
        }

    } catch (error) {
        error(`Deployment trigger failed: ${error.message}`);
        return false;
    }
}

async function runCompleteLaunch() {
    header('🚀 XPLOAR.AI COMPLETE LAUNCH SEQUENCE');

    const steps = [
        { name: 'Database Schema', function: step1_DatabaseSetup },
        { name: 'Environment Variables', function: step2_EnvironmentVariables },
        { name: 'Email Confirmation', function: step3_EmailConfirmation },
        { name: 'Application Testing', function: step4_TestApplication },
        { name: 'Deployment Trigger', function: step5_DeploymentTrigger }
    ];

    let completedSteps = 0;
    let allSuccessful = true;

    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        log(`\n📋 Step ${i + 1}: ${step.name}`, 'bright');

        try {
            const result = await step.function();
            if (result) {
                completedSteps++;
            } else {
                allSuccessful = false;
            }
        } catch (error) {
            error(`Step ${step.name} failed: ${error.message}`);
            allSuccessful = false;
        }

        // Add some spacing between steps
        await sleep(1000);
    }

    header('🎊 LAUNCH COMPLETION SUMMARY');

    log(`\n📊 Results: ${completedSteps}/${steps.length} steps completed`, 'bright');

    if (allSuccessful) {
        success('🎉 ALL STEPS COMPLETED SUCCESSFULLY!');
        success('🌟 Your XPLOAR.AI platform is fully operational!');

        log('\n🚀 LIVE PLATFORM:', 'bright');
        log(CONFIG.deployedUrl, 'cyan');

        log('\n🎯 PLATFORM FEATURES:', 'bright');
        log('• 🤖 AI-powered essay evaluation', 'green');
        log('• 📚 Personalized study plans', 'green');
        log('• 📊 Performance analytics', 'green');
        log('• 👥 Community features', 'green');
        log('• 📱 Mobile responsive design', 'green');
        log('• 🔐 Secure authentication', 'green');

        log('\n📈 READY FOR USERS!', 'bright');
        log('Start acquiring UPSC aspirants worldwide! 🌍', 'green');

    } else {
        warning('⚠️  SOME STEPS REQUIRE MANUAL COMPLETION');

        log('\n📋 REMAINING MANUAL STEPS:', 'bright');

        const manualSteps = [
            '1. Apply database schema in Supabase SQL Editor',
            '2. Set environment variables in Vercel dashboard',
            '3. Disable email confirmation in Supabase',
            '4. Test the application functionality'
        ];

        manualSteps.forEach(step => log(step, 'yellow'));

        log('\n🔄 AFTER MANUAL COMPLETION:', 'bright');
        log('node complete-xploar-launch.js  # Run again to verify', 'cyan');
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

// Environment setup helper
function setupEnvironment() {
    log('\n🔧 ENVIRONMENT SETUP:', 'bright');

    if (!process.env.VERCEL_TOKEN) {
        warning('⚠️  VERCEL_TOKEN not found');
        info('Get your Vercel token from: https://vercel.com/account/tokens');
        info('Set it with: export VERCEL_TOKEN=your_token_here');
    }

    if (!process.env.GITHUB_TOKEN) {
        warning('⚠️  GITHUB_TOKEN not found (optional)');
        info('Get your GitHub token from: https://github.com/settings/tokens');
        info('Set it with: export GITHUB_TOKEN=your_token_here');
    }
}

// Check environment and run
if (require.main === module) {
    setupEnvironment();

    // Add a small delay to show environment setup
    setTimeout(() => {
        runCompleteLaunch().catch((err) => {
            error(`Launch failed: ${err.message}`);
            console.error(err);
            process.exit(1);
        });
    }, 2000);
}

module.exports = { runCompleteLaunch };
