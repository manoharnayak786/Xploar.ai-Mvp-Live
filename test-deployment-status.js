const https = require('https');

console.log('🔍 XPLOAR.AI - DEPLOYMENT PROTECTION STATUS CHECK\\n');

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

async function checkDeploymentProtection() {
    const url = 'https://xploar-web-k5nhmj520-manoharnayakbarmavaths-projects.vercel.app';

    return new Promise((resolve, reject) => {
        const req = https.get(url, (res) => {
            let data = '';

            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const isProtected = data.includes('Authentication Required') ||
                                  data.includes('Vercel Authentication') ||
                                  data.includes('vercel.com/sso-api');

                resolve({
                    statusCode: res.statusCode,
                    isProtected,
                    hasBypassToken: data.includes('x-vercel-protection-bypass'),
                    content: data.substring(0, 500) + '...'
                });
            });
        });

        req.on('error', reject);
        req.setTimeout(10000, () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });
    });
}

async function checkEnvironmentVariables() {
    log('🔧 Checking Environment Variables Status...', 'cyan');

    const testUrls = [
        'https://xploar-web-k5nhmj520-manoharnayakbarmavaths-projects.vercel.app/api/health',
        'https://xploar-web-k5nhmj520-manoharnayakbarmavaths-projects.vercel.app/api/auth/test',
        'https://xploar-web-k5nhmj520-manoharnayakbarmavaths-projects.vercel.app/'
    ];

    for (const url of testUrls) {
        try {
            const response = await checkDeploymentProtection();

            if (response.statusCode === 401) {
                log(`❌ ${url}: 401 Unauthorized (Env vars not set)`, 'red');
            } else if (response.isProtected) {
                log(`🛡️  ${url}: Deployment Protected`, 'yellow');
            } else if (response.statusCode === 200) {
                log(`✅ ${url}: 200 OK (Working)`, 'green');
                return true;
            } else {
                log(`❓ ${url}: Status ${response.statusCode}`, 'yellow');
            }
        } catch (error) {
            log(`❌ ${url}: ${error.message}`, 'red');
        }
    }

    return false;
}

async function provideInstructions() {
    const result = await checkDeploymentProtection();

    console.log('\\n' + '='.repeat(60));
    console.log('📋 CURRENT STATUS & INSTRUCTIONS');
    console.log('='.repeat(60));

    if (result.isProtected) {
        log('🛡️  DEPLOYMENT PROTECTION DETECTED', 'yellow');
        log('Your Vercel deployment has protection enabled.', 'yellow');

        console.log('\\n🔧 SOLUTION OPTIONS:');

        console.log('\\n1️⃣  DISABLE PROTECTION (Recommended for testing):');
        console.log('   • Go to: https://vercel.com/dashboard');
        console.log('   • Find your project: xploar-web');
        console.log('   • Settings → Deployment Protection');
        console.log('   • Set to: Public (No Protection)');

        console.log('\\n2️⃣  GET BYPASS TOKEN:');
        console.log('   • Visit: https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation');
        console.log('   • Get your bypass token from Vercel dashboard');
        console.log('   • Provide token to me for automated testing');

        console.log('\\n3️⃣  ENVIRONMENT VARIABLES CHECK:');
        console.log('   Make sure all 5 variables are set in Vercel:');
        console.log('   ✅ NEXT_PUBLIC_SUPABASE_URL');
        console.log('   ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY');
        console.log('   ✅ NEXT_PUBLIC_SITE_URL');
        console.log('   ✅ GOOGLE_AI_API_KEY');
        console.log('   ✅ NEXT_PUBLIC_GOOGLE_AI_API_KEY');

    } else if (result.statusCode === 401) {
        log('🚫 ENVIRONMENT VARIABLES MISSING', 'red');
        console.log('\\n🔧 SOLUTION: Add these to Vercel Environment Variables:');

        console.log('\\nNEXT_PUBLIC_SUPABASE_URL=https://meoyfsrpuocdrkzjzbvk.supabase.co');
        console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
        console.log('NEXT_PUBLIC_SITE_URL=https://xploar-web-k5nhmj520-manoharnayakbarmavaths-projects.vercel.app');
        console.log('GOOGLE_AI_API_KEY=AIzaSyCrO4GYag-h-CUp4TiV6QkVkc1IZA2NTVY');
        console.log('NEXT_PUBLIC_GOOGLE_AI_API_KEY=AIzaSyCrO4GYag-h-CUp4TiV6QkVkc1IZA2NTVY');

    } else if (result.statusCode === 200) {
        log('✅ DEPLOYMENT WORKING!', 'green');
        console.log('\\n🚀 Ready for comprehensive testing!');
        return true;
    }

    console.log('\\n' + '='.repeat(60));
    console.log('🎯 AFTER FIXING:');
    console.log('   • Run: node test-layout-features.js');
    console.log('   • This will test all 14 features automatically');
    console.log('='.repeat(60));

    return false;
}

async function main() {
    console.log('🔍 Checking XPLOAR.AI deployment status...\\n');

    const isWorking = await checkEnvironmentVariables();
    await provideInstructions();

    if (isWorking) {
        console.log('\\n🎉 Ready to run comprehensive feature tests!');
        console.log('Run: node test-layout-features.js');
    }

    return isWorking;
}

main().catch(error => {
    log(`\\n💥 Error: ${error.message}`, 'red');
    process.exit(1);
});
