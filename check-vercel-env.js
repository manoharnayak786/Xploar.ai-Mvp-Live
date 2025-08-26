const https = require('https');

// Test if environment variables are working on Vercel
async function checkVercelEnvironment() {
    console.log('🔍 Checking Vercel Environment Variables...\n');

    const testUrls = [
        {
            name: 'Supabase URL',
            url: 'https://xploar-web-k5nhmj520-manoharnayakbarmavaths-projects.vercel.app/api/env-check/supabase-url',
            expected: 'https://meoyfsrpuocdrkzjzbvk.supabase.co'
        },
        {
            name: 'Supabase Anon Key',
            url: 'https://xploar-web-k5nhmj520-manoharnayakbarmavaths-projects.vercel.app/api/env-check/supabase-anon',
            expected: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lb3lmc3JwdW9jZHJremp6YnZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMzM5NjYsImV4cCI6MjA3MTcwOTk2Nn0'
        },
        {
            name: 'Google AI API Key',
            url: 'https://xploar-web-k5nhmj520-manoharnayakbarmavaths-projects.vercel.app/api/env-check/google-ai',
            expected: 'AIzaSyCrO4GYag-h-CUp4TiV6QkVkc1IZA2NTVY'
        }
    ];

    for (const test of testUrls) {
        try {
            console.log(`Testing ${test.name}...`);

            const response = await fetch(test.url);
            if (response.ok) {
                const data = await response.json();
                if (data.value && data.value.includes(test.expected.substring(0, 20))) {
                    console.log(`✅ ${test.name}: Set correctly`);
                } else {
                    console.log(`❌ ${test.name}: Not set or incorrect`);
                }
            } else {
                console.log(`❌ ${test.name}: API returned ${response.status}`);
            }
        } catch (err) {
            console.log(`❌ ${test.name}: Connection failed - ${err.message}`);
        }
    }
}

checkVercelEnvironment().catch(console.error);
