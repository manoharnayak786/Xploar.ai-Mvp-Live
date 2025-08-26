const https = require('https');

console.log('🔍 XPLOAR.AI - ENVIRONMENT VARIABLES STATUS CHECK\n');

// Check if the deployed app is accessible
const url = 'https://xploar-web-k5nhmj520-manoharnayakbarmavaths-projects.vercel.app';

console.log(`🌐 Checking: ${url}\n`);

const req = https.get(url, (res) => {
    console.log(`📊 HTTP Status Code: ${res.statusCode}`);
    console.log(`📝 Response Headers:`);

    // Check for key headers that indicate proper configuration
    const hasSupabaseUrl = res.headers['x-vercel-env-next_public_supabase_url'] ||
                          res.headers['x-nextjs-env-next_public_supabase_url'];
    const hasSupabaseKey = res.headers['x-vercel-env-next_public_supabase_anon_key'] ||
                          res.headers['x-nextjs-env-next_public_supabase_anon_key'];
    const hasSiteUrl = res.headers['x-vercel-env-next_public_site_url'] ||
                      res.headers['x-nextjs-env-next_public_site_url'];

    console.log(`✅ Supabase URL: ${hasSupabaseUrl ? 'SET' : 'NOT FOUND'}`);
    console.log(`✅ Supabase Key: ${hasSupabaseKey ? 'SET' : 'NOT FOUND'}`);
    console.log(`✅ Site URL: ${hasSiteUrl ? 'SET' : 'NOT FOUND'}`);

    if (res.statusCode === 200) {
        console.log('\n🎉 SUCCESS: Environment variables appear to be working!');
        console.log('🌐 Website should be accessible');
    } else if (res.statusCode === 401) {
        console.log('\n❌ ISSUE: Environment variables not configured properly');
        console.log('📋 You need to set the 5 Vercel environment variables');
    } else {
        console.log(`\n⚠️  Unexpected status: ${res.statusCode}`);
    }

    console.log('\n📞 Next Steps:');
    if (res.statusCode !== 200) {
        console.log('1. Go to https://vercel.com/dashboard');
        console.log('2. Find your xploar-web project');
        console.log('3. Settings → Environment Variables');
        console.log('4. Add the 5 variables from FINAL-TODO-COMPLETION.md');
        console.log('5. Wait for redeploy (2-3 minutes)');
        console.log('6. Run this script again');
    }

    res.on('data', (chunk) => {
        // Consume response data to avoid hanging
    });

    res.on('end', () => {
        console.log('\n🔄 Run: node final-xploar-validation.js');
        console.log('    to check complete functionality\n');
    });
});

req.on('error', (err) => {
    console.error('❌ Error checking website:', err.message);
    console.log('\n📞 Troubleshooting:');
    console.log('1. Check if Vercel deployment is complete');
    console.log('2. Verify environment variables are set correctly');
    console.log('3. Try redeploying the project');
});

req.setTimeout(10000, () => {
    console.log('⏰ Request timed out');
    req.destroy();
});
