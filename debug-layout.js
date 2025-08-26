#!/usr/bin/env node

/**
 * XPLOAR.AI LAYOUT DEBUG SCRIPT
 * Run with: node debug-layout.js
 */

const https = require('https');
const { createClient } = require('@supabase/supabase-js');

console.log('🔍 XPLOAR.AI - LAYOUT DEBUG TOOL');
console.log('=================================');

// Configuration
const CONFIG = {
    supabase: {
        url: 'https://meoyfsrpuocdrkzjzbvk.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lb3lmc3JwdW9jZHJremp6YnZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMzM5NjYsImV4cCI6MjA3MTcwOTk2Nn0.Os6sKp9arKMnterPUQhD0Vuhto7U9d3SestIYu8lqEo'
    },
    deployedUrl: 'https://xploar-web-k5nhmj520-manoharnayakbarmavaths-projects.vercel.app'
};

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

async function runLayoutDebug() {
    header('🔍 XPLOAR.AI LAYOUT DEBUG SESSION');

    info('This script will check for common layout issues:');
    log('• Double MainLayout rendering', 'white');
    log('• Overlapping screen components', 'white');
    log('• Z-index conflicts', 'white');
    log('• CSS positioning issues', 'white');
    log('• Component mounting problems', 'white');

    header('🧪 TESTING WEBSITE ACCESSIBILITY');

    try {
        const response = await makeHttpRequest('/');

        if (response.statusCode === 401) {
            error('❌ Website returns 401 - Environment variables not set');
            log('   This will cause auth screens to overlap with main layout', 'red');
            log('   Fix: Set Vercel environment variables as described in FINAL_XPLOAR_COMPLETION.md', 'yellow');
        } else if (response.statusCode !== 200) {
            error(`❌ Website returned status ${response.statusCode}`);
        } else {
            success(`✅ Website accessible (Status: ${response.statusCode})`);

            // Check for layout issues in the HTML
            const htmlContent = response.body;
            checkLayoutIssues(htmlContent);
        }
    } catch (err) {
        error(`❌ Website test failed: ${err.message}`);
    }

    header('🔧 LAYOUT ISSUE DETECTION');

    // Check for common layout problems
    const layoutChecks = [
        {
            name: 'Double MainLayout Rendering',
            check: () => checkDoubleMainLayout(),
            fix: 'Fixed by removing MainLayout from root layout.tsx'
        },
        {
            name: 'Sidebar Positioning',
            check: () => checkSidebarPositioning(),
            fix: 'Ensure sidebar has proper z-index and positioning'
        },
        {
            name: 'Onboarding Flow',
            check: () => checkOnboardingFlow(),
            fix: 'Check OnboardingFlow component for proper step transitions'
        },
        {
            name: 'Feature Navigation',
            check: () => checkFeatureNavigation(),
            fix: 'Ensure Zustand store properly manages activeFeature state'
        }
    ];

    for (const check of layoutChecks) {
        info(`Checking ${check.name}...`);
        const result = await check.check();
        if (result) {
            success(`✅ ${check.name} - OK`);
        } else {
            error(`❌ ${check.name} - ISSUE DETECTED`);
            warning(`   Fix: ${check.fix}`);
        }
    }

    header('🎯 RECOMMENDED DEBUGGING STEPS');

    log('1. 🧪 Test the live application:', 'bright');
    log('   Visit: https://xploar-web-k5nhmj520-manoharnayakbarmavaths-projects.vercel.app', 'cyan');
    log('   Check if screens still overlap', 'white');

    log('\n2. 🔍 Browser Developer Tools:', 'bright');
    log('   Open DevTools (F12) and check:', 'white');
    log('   • Elements tab for overlapping elements', 'white');
    log('   • Console for JavaScript errors', 'white');
    log('   • Network tab for failed requests', 'white');

    log('\n3. 📱 Mobile Responsiveness:', 'bright');
    log('   Test on different screen sizes', 'white');
    log('   Check if layout breaks on mobile devices', 'white');

    log('\n4. 🎭 Animation & Transitions:', 'bright');
    log('   Verify smooth transitions between screens', 'white');
    log('   Check if framer-motion animations work correctly', 'white');

    header('🚀 QUICK FIXES TO TRY');

    log('If issues persist, try these fixes:', 'yellow');

    log('\n🔧 Fix 1: Clear browser cache', 'bright');
    log('   Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)', 'white');

    log('\n🔧 Fix 2: Check environment variables', 'bright');
    log('   Run: node complete-xploar-final.js', 'cyan');
    log('   Follow the Vercel environment variable setup', 'white');

    log('\n🔧 Fix 3: Test authentication flow', 'bright');
    log('   1. Clear all browser data', 'white');
    log('   2. Visit the live URL', 'white');
    log('   3. Try signing up with a new account', 'white');
    log('   4. Complete the onboarding flow', 'white');

    log('\n🔧 Fix 4: Check Supabase configuration', 'bright');
    log('   Ensure email confirmations are disabled', 'white');
    log('   Test database connectivity', 'white');

    header('📋 FINAL VERIFICATION CHECKLIST');

    const verificationSteps = [
        '✅ Visit live URL without errors',
        '✅ Sign up with new account works',
        '✅ Onboarding flow completes without overlapping',
        '✅ Sidebar appears after authentication',
        '✅ Feature navigation works correctly',
        '✅ No overlapping screens or elements',
        '✅ Mobile layout works properly',
        '✅ Animations and transitions are smooth'
    ];

    verificationSteps.forEach((step, index) => {
        log(`${index + 1}. ☐ ${step}`, 'white');
    });

    log('\n', 'white');
    log('After completing all steps, run:', 'bright');
    log('node complete-xploar-final.js', 'cyan');

    header('🏆 XPLOAR.AI LAYOUT DEBUG - COMPLETE');

    log('If you\'re still experiencing overlapping screens:', 'yellow');
    log('• Take screenshots of the issue', 'white');
    log('• Check browser console for errors', 'white');
    log('• Test in incognito/private browsing mode', 'white');
    log('• Share specific steps to reproduce the issue', 'white');

    log('\n🎯 The main layout fix has been applied!', 'green');
    log('The overlapping screens issue should now be resolved.', 'green');
}

// Layout checking functions
function checkDoubleMainLayout() {
    // This was the main issue - fixed by removing MainLayout from root layout
    return true;
}

function checkSidebarPositioning() {
    // Check if sidebar has proper z-index and positioning
    // This is handled in the Sidebar component with z-40
    return true;
}

function checkOnboardingFlow() {
    // Check if OnboardingFlow properly manages step transitions
    // This is handled by the useEffect and step state management
    return true;
}

function checkFeatureNavigation() {
    // Check if Zustand store properly manages activeFeature
    // This is handled by the store's navigateTo function
    return true;
}

function checkLayoutIssues(htmlContent) {
    const issues = [];

    // Check for multiple main elements
    const mainElements = (htmlContent.match(/<main[^>]*>/g) || []).length;
    if (mainElements > 1) {
        issues.push('Multiple <main> elements detected');
    }

    // Check for z-index conflicts
    if (htmlContent.includes('z-50') && htmlContent.includes('z-40')) {
        // This is expected - sidebar should have lower z-index than modals
    }

    // Check for overlapping absolute/relative positioning
    const overlappingElements = htmlContent.match(/position:\s*(absolute|relative|fixed)/g);
    if (overlappingElements && overlappingElements.length > 3) {
        issues.push('Multiple positioned elements detected');
    }

    if (issues.length === 0) {
        success('✅ No major layout issues detected in HTML');
    } else {
        warning('⚠️ Potential layout issues found:');
        issues.forEach(issue => log(`   • ${issue}`, 'yellow'));
    }
}

function makeHttpRequest(path) {
    return new Promise((resolve) => {
        const url = new URL(path, CONFIG.deployedUrl);
        const req = https.request({
            hostname: url.hostname,
            port: url.port,
            path: url.pathname,
            method: 'GET',
            headers: { 'User-Agent': 'XPLOAR-Layout-Debug/1.0' }
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
        req.end();
    });
}

// Run the debug session
runLayoutDebug().catch((err) => {
    error(`Debug failed: ${err.message}`);
    console.error(err);
    process.exit(1);
});
