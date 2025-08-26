const https = require('https');

console.log('🔍 XPLOAR.AI - ENVIRONMENT VARIABLES CHECKER\n');
console.log('='.repeat(55));

const REQUIRED_VARS = {
    'NEXT_PUBLIC_SUPABASE_URL': 'https://meoyfsrpuocdrkzjzbvk.supabase.co',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lb3lmc3JwdW9jZHJremp6YnZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMzM5NjYsImV4cCI6MjA3MTcwOTk2Nn0.Os6sKp9arKMnterPUQhD0Vuhto7U9d3SestYJu8lqEo',
    'GOOGLE_AI_API_KEY': 'AIzaSyCrO4GYag-h-CUp4TiV6QkVkc1IZA2NTVY',
    'NEXT_PUBLIC_GOOGLE_AI_API_KEY': 'AIzaSyCrO4GYag-h-CUp4TiV6QkVkc1IZA2NTVY',
    'NEXT_PUBLIC_SITE_URL': 'https://xploar-web-k5nhmj520-manoharnayakbarmavaths-projects.vercel.app'
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

async function checkVercelEnvVars() {
    log('🔧 CHECKING VERCEL ENVIRONMENT VARIABLES', 'cyan');
    log('-'.repeat(45), 'cyan');

    const deployedUrl = REQUIRED_VARS.NEXT_PUBLIC_SITE_URL;

    log('\n📋 Required Environment Variables:', 'blue');
    Object.entries(REQUIRED_VARS).forEach(([key, value]) => {
        log(`   ${key}`, 'white');
        log(`   Value: ${value.substring(0, 50)}${value.length > 50 ? '...' : ''}`, 'yellow');
        log('');
    });

    log('📋 MANUAL SETUP INSTRUCTIONS:', 'magenta');
    log('-'.repeat(35), 'magenta');

    console.log(`
🌐 Go to Vercel Dashboard:
   https://vercel.com/dashboard

📂 Find your project:
   xploar-web

⚙️  Navigate to Settings:
   Settings → Environment Variables

➕ Add these 5 variables:

1. NEXT_PUBLIC_SUPABASE_URL
   Name: NEXT_PUBLIC_SUPABASE_URL
   Value: https://meoyfsrpuocdrkzjzbvk.supabase.co
   Environment: Production

2. NEXT_PUBLIC_SUPABASE_ANON_KEY
   Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lb3lmc3JwdW9jZHJremp6YnZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMzM5NjYsImV4cCI6MjA3MTcwOTk2Nn0.Os6sKp9arKMnterPUQhD0Vuhto7U9d3SestYJu8lqEo
   Environment: Production

3. GOOGLE_AI_API_KEY
   Name: GOOGLE_AI_API_KEY
   Value: AIzaSyCrO4GYag-h-CUp4TiV6QkVkc1IZA2NTVY
   Environment: Production

4. NEXT_PUBLIC_GOOGLE_AI_API_KEY
   Name: NEXT_PUBLIC_GOOGLE_AI_API_KEY
   Value: AIzaSyCrO4GYag-h-CUp4TiV6QkVkc1IZA2NTVY
   Environment: Production

5. NEXT_PUBLIC_SITE_URL
   Name: NEXT_PUBLIC_SITE_URL
   Value: https://xploar-web-k5nhmj520-manoharnayakbarmavaths-projects.vercel.app
   Environment: Production

🚀 After adding variables:
   • Click "Save" for each variable
   • Go to "Deployments" tab
   • Click "Redeploy" on the latest deployment
   • Wait 2-3 minutes for redeployment

✅ VERIFICATION:
   After redeployment, run:
   node check-specific-issues.js
`);

    log('\n🔄 TESTING CURRENT STATUS...', 'yellow');

    // Test if website is accessible
    try {
        const response = await fetch(deployedUrl);
        if (response.ok) {
            log('✅ Website is accessible', 'green');
        } else {
            log(`❌ Website not accessible: ${response.status}`, 'red');
        }
    } catch (err) {
        log(`❌ Connection failed: ${err.message}`, 'red');
    }

    // Test Supabase connection (this will likely fail until env vars are set)
    try {
        const { createClient } = require('@supabase/supabase-js');
        const supabase = createClient(REQUIRED_VARS.NEXT_PUBLIC_SUPABASE_URL, REQUIRED_VARS.NEXT_PUBLIC_SUPABASE_ANON_KEY);
        const { error } = await supabase.from('study_plans').select('count').limit(1);

        if (error) {
            log('⚠️  Supabase connection failed (expected until env vars are set)', 'yellow');
        } else {
            log('✅ Supabase connection working', 'green');
        }
    } catch (err) {
        log('⚠️  Supabase test failed (expected until env vars are set)', 'yellow');
    }

    log('\n🎯 NEXT STEPS:', 'cyan');
    log('1. Set the 5 environment variables in Vercel dashboard', 'white');
    log('2. Redeploy the application', 'white');
    log('3. Run: node check-specific-issues.js', 'white');
    log('4. If all tests pass, XPLOAR.AI is ready!', 'green');

    log('\n📞 SUPPORT:', 'yellow');
    log('Message me when you\'ve completed the setup!', 'yellow');
}

checkVercelEnvVars().catch(console.error);
