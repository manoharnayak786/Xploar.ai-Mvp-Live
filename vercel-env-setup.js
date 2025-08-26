#!/usr/bin/env node

/**
 * XPLOAR.AI Vercel Environment Variables Setup Guide
 * Run: node vercel-env-setup.js
 */

console.log('🚀 XPLOAR.AI VERCEL ENVIRONMENT VARIABLES SETUP');
console.log('===============================================');
console.log('');
console.log('📋 COPY THESE VALUES TO VERCEL DASHBOARD:');
console.log('');

// Environment Variables Data
const envVars = [
    {
        name: 'NEXT_PUBLIC_SUPABASE_URL',
        value: 'https://meoyfsrpuocdrkzjzbvk.supabase.co',
        description: 'Supabase project URL'
    },
    {
        name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lb3lmc3JwdW9jZHJremp6YnZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMzM5NjYsImV4cCI6MjA3MTcwOTk2Nn0.Os6sKp9arKMnterPUQhD0Vuhto7U9d3SestIYu8lqEo',
        description: 'Supabase anonymous key'
    },
    {
        name: 'NEXT_PUBLIC_SITE_URL',
        value: 'https://xploar-web-k5nhmj520-manoharnayakbarmavaths-projects.vercel.app',
        description: 'Vercel deployment URL'
    },
    {
        name: 'GOOGLE_AI_API_KEY',
        value: 'AIzaSyCrO4GYag-h-CUp4TiV6QkVkc1IZA2NTVY',
        description: 'Google AI API key for backend'
    },
    {
        name: 'NEXT_PUBLIC_GOOGLE_AI_API_KEY',
        value: 'AIzaSyCrO4GYag-h-CUp4TiV6QkVkc1IZA2NTVY',
        description: 'Google AI API key for frontend'
    }
];

// Display environment variables
envVars.forEach((env, index) => {
    console.log(`${index + 1}. ${env.name}`);
    console.log(`   📝 Value: ${env.value}`);
    console.log(`   📖 Description: ${env.description}`);
    console.log('');
});

console.log('🔗 SETUP INSTRUCTIONS:');
console.log('=====================');
console.log('');
console.log('1. 📱 Go to: https://vercel.com/dashboard');
console.log('2. 🔍 Find your project: xploar-web');
console.log('3. ⚙️ Click: Settings → Environment Variables');
console.log('4. ➕ Click: Add New... (5 times)');
console.log('');
console.log('📝 For each variable:');
console.log('   • Paste NAME in "Name" field');
console.log('   • Paste VALUE in "Value" field');
console.log('   • Select "Production" environment');
console.log('   • Click "Save"');
console.log('');

console.log('✅ AFTER SETUP:');
console.log('===============');
console.log('');
console.log('• Vercel will auto-redeploy your app');
console.log('• All features will be fully functional');
console.log('• AI evaluations will work with real data');
console.log('• Supabase backend will be connected');
console.log('');

console.log('🧪 TEST AFTER DEPLOYMENT:');
console.log('========================');
console.log('');
console.log('node final-xploar-validation.js');
console.log('');

console.log('🎉 YOUR XPLOAR.AI PLATFORM WILL BE LIVE!');
console.log('=========================================');
console.log('');
console.log('🌟 Features that will work:');
console.log('   ✅ User authentication & profiles');
console.log('   ✅ AI-powered essay evaluations');
console.log('   ✅ Personalized study recommendations');
console.log('   ✅ Mock tests & performance analytics');
console.log('   ✅ Community forums & study groups');
console.log('   ✅ Progress tracking & insights');
console.log('   ✅ Mentor connections');
console.log('   ✅ Daily challenges');
console.log('');

console.log('🚀 READY TO DEPLOY YOUR VISION!');
console.log('🎯 Your AI-powered UPSC platform awaits!');
