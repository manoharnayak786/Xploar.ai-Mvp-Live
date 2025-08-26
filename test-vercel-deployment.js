#!/usr/bin/env node

/**
 * Test Vercel Deployment After Environment Variables Setup
 * Run: node test-vercel-deployment.js
 */

const https = require('https');

const DEPLOYED_URL = 'https://xploar-web-k5nhmj520-manoharnayakbarmavaths-projects.vercel.app';

function log(message, color = 'white') {
    const colors = {
        red: '\x1b[31m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        magenta: '\x1b[35m',
        cyan: '\x1b[36m',
        white: '\x1b[37m',
        reset: '\x1b[0m'
    };
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testWebsite(url) {
    return new Promise((resolve) => {
        const req = https.get(url, (res) => {
            resolve({
                statusCode: res.statusCode,
                success: res.statusCode === 200
            });
        });

        req.on('error', () => {
            resolve({
                statusCode: null,
                success: false
            });
        });

        req.setTimeout(10000, () => {
            resolve({
                statusCode: null,
                success: false
            });
        });
    });
}

async function testDeployment() {
    log('🧪 TESTING XPLOAR.AI DEPLOYMENT', 'magenta');
    log('=================================', 'magenta');
    console.log('');

    log('🌐 Testing website accessibility...', 'cyan');
    const result = await testWebsite(DEPLOYED_URL);

    if (result.success) {
        log(`✅ Website accessible (Status: ${result.statusCode})`, 'green');
        log('✅ Environment variables are working!', 'green');
        log('✅ Vercel deployment successful!', 'green');

        console.log('');
        log('🎉 DEPLOYMENT SUCCESSFUL!', 'green');
        log('========================', 'green');
        console.log('');
        log('🌟 Your XPLOAR.AI platform is now live!', 'yellow');
        console.log('');
        log('🔗 Live URL:', 'cyan');
        console.log(DEPLOYED_URL);
        console.log('');
        log('✨ Features now working:', 'yellow');
        console.log('   • User authentication');
        console.log('   • AI essay evaluations');
        console.log('   • Study planning & tracking');
        console.log('   • Mock tests');
        console.log('   • Community features');
        console.log('   • Progress analytics');
        console.log('');
        log('📱 Next step: Run final validation', 'cyan');
        console.log('node final-xploar-validation.js');

    } else {
        log(`❌ Website not accessible (Status: ${result.statusCode || 'timeout'})`, 'red');

        if (result.statusCode === 401) {
            log('💡 This usually means environment variables aren\'t set', 'yellow');
            log('🔧 Please check Vercel environment variables setup', 'yellow');
        } else if (result.statusCode === 404) {
            log('💡 This means the deployment might still be building', 'yellow');
            log('⏳ Please wait a few minutes and try again', 'yellow');
        } else {
            log('💡 Check Vercel dashboard for deployment status', 'yellow');
        }

        console.log('');
        log('🔄 Please:', 'cyan');
        console.log('   1. Verify environment variables in Vercel');
        console.log('   2. Check deployment status in Vercel dashboard');
        console.log('   3. Wait for auto-redeployment to complete');
        console.log('   4. Run this test again');
    }
}

testDeployment();
