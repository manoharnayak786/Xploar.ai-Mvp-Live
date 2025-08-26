#!/usr/bin/env node

/**
 * Fix Supabase Authentication Settings for XPLOAR.AI
 * Run with: node fix-supabase-auth.js
 */

const { createClient } = require('@supabase/supabase-js');

console.log('🔧 FIXING SUPABASE AUTHENTICATION SETTINGS');
console.log('==========================================');

// Configuration
const CONFIG = {
    supabase: {
        url: 'https://meoyfsrpuocdrkzjzbvk.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lb3lmc3JwdW9jZHJremp6YnZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMzM5NjYsImV4cCI6MjA3MTcwOTk2Nn0.Os6sKp9arKMnterPUQhD0Vuhto7U9d3SestIYu8lqEo'
    },
    deployedUrl: 'https://xploar-web-ew7buijdp-manoharnayakbarmavaths-projects.vercel.app'
};

const supabase = createClient(CONFIG.supabase.url, CONFIG.supabase.anonKey);

// Helper functions
function log(message, color = 'white') {
    const colors = {
        red: '\x1b[31m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        white: '\x1b[37m',
        reset: '\x1b[0m'
    };
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function success(message) {
    log(`✅ ${message}`, 'green');
}

function error(message) {
    log(`❌ ${message}`, 'red');
}

function warning(message) {
    log(`⚠️  ${message}`, 'yellow');
}

function info(message) {
    log(`ℹ️  ${message}`, 'blue');
}

async function testAuthSettings() {
    info('Testing current authentication settings...');
    try {
        // Test signup without email confirmation
        const timestamp = Date.now();
        const testEmail = `test${timestamp}@testuser.com`;
        const testPassword = 'TestPass123!';
        const testName = 'Test User';

        info(`Creating test user: ${testEmail}`);

        const { data: signupData, error: signupError } = await supabase.auth.signUp({
            email: testEmail,
            password: testPassword,
            options: {
                data: { name: testName }
            }
        });

        if (signupError) {
            error(`Signup failed: ${signupError.message}`);
            return false;
        }

        success(`User created: ${testEmail}`);

        // Try to login immediately
        info('Attempting immediate login...');

        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email: testEmail,
            password: testPassword
        });

        if (loginError) {
            if (loginError.message.includes('Email not confirmed')) {
                error('❌ EMAIL CONFIRMATION IS REQUIRED');
                log('');
                log('🔧 TO FIX THIS ISSUE:');
                log('====================');
                log('1. Go to: https://supabase.com/dashboard');
                log('2. Select your project: meoyfsrpuocdrkzjzbvk');
                log('3. Go to: Authentication → Settings');
                log('4. Under "User Signups", DISABLE "Enable email confirmations"');
                log('5. Click "Save"');
                log('');
                warning('This will allow users to sign up and login immediately without email verification');
                return false;
            } else {
                error(`Login failed with different error: ${loginError.message}`);
                return false;
            }
        }

        if (loginData.user) {
            success(`✅ AUTHENTICATION WORKING! User logged in: ${loginData.user.email}`);
            success('Email confirmation is already disabled - this is good for user experience');
            return true;
        } else {
            error('Login succeeded but no user data returned');
            return false;
        }

    } catch (err) {
        error(`Auth test failed: ${err.message}`);
        return false;
    }
}

async function provideInstructions() {
    log('');
    log('📋 MANUAL STEPS TO FIX AUTHENTICATION:');
    log('=====================================');
    log('');
    log('Step 1: Disable Email Confirmation');
    log('----------------------------------');
    log('1. Go to: https://supabase.com/dashboard');
    log('2. Select your project: meoyfsrpuocdrkzjzbvk');
    log('3. Navigate to: Authentication → Settings');
    log('4. Under "User Signups" section:');
    log('   - UNCHECK "Enable email confirmations"');
    log('   - This allows users to sign up and login immediately');
    log('5. Click "Save changes"');
    log('');
    log('Step 2: Test the Fix');
    log('-------------------');
    log('1. Run: node fix-supabase-auth.js');
    log('2. Should see: "✅ AUTHENTICATION WORKING!"');
    log('');
    log('Step 3: Update Vercel Environment Variables');
    log('-------------------------------------------');
    log('1. Go to: https://vercel.com/dashboard');
    log('2. Find your XPLOAR.AI project');
    log('3. Go to: Settings → Environment Variables');
    log('4. Add/Update these variables:');
    log('   NEXT_PUBLIC_SUPABASE_URL=https://meoyfsrpuocdrkzjzbvk.supabase.co');
    log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lb3lmc3JwdW9jZHJremp6YnZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMzM5NjYsImV4cCI6MjA3MTcwOTk2Nn0.Os6sKp9arKMnterPUQhD0Vuhto7U9d3SestIYu8lqEo');
    log('5. Redeploy the application');
    log('');
    warning('⚠️  The 401 error on the website is likely due to missing environment variables on Vercel');
}

async function main() {
    log('🔧 XPLOAR.AI AUTHENTICATION DIAGNOSTIC');
    log('=====================================');

    const authWorking = await testAuthSettings();

    if (!authWorking) {
        await provideInstructions();
    } else {
        log('');
        success('🎉 AUTHENTICATION IS WORKING CORRECTLY!');
        log('');
        info('Next steps:');
        info('1. Verify Vercel environment variables are set correctly');
        info('2. Test the deployed application');
        info('3. Complete the user journey testing');
    }
}

main().catch((err) => {
    error(`Script failed: ${err.message}`);
    console.error(err);
    process.exit(1);
});
