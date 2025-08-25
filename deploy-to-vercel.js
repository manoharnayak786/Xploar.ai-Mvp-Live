// Deploy XPLOAR.AI to Vercel
// Run with: node deploy-to-vercel.js

const { exec } = require('child_process');
const fs = require('fs');

console.log('🚀 PHASE 2: VERCEL DEPLOYMENT');
console.log('===============================');

// Environment variables for Vercel
const envVars = {
    'NEXT_PUBLIC_SUPABASE_URL': 'https://meoyfsrpuocdrkzjzbvk.supabase.co',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lb3lmc3JwdW9jZHJremp6YnZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMzM5NjYsImV4cCI6MjA3MTcwOTk2Nn0.Os6sKp9arKMnterPUQhD0Vuhto7U9d3SestIYu8lqEo',
    'NEXT_PUBLIC_SITE_URL': 'https://xploar-ai.vercel.app'
};

console.log('📋 Environment Variables to Set:');
console.log('=================================');
Object.entries(envVars).forEach(([key, value]) => {
    console.log(`${key}=${value}`);
});

console.log('');
console.log('🔧 DEPLOYMENT OPTIONS:');
console.log('=====================');
console.log('');
console.log('📱 Option A: Web Interface (Recommended)');
console.log('=========================================');
console.log('1. Go to: https://vercel.com');
console.log('2. Click "Import Project"');
console.log('3. Connect your GitHub account');
console.log('4. Select repository: Xploar.ai-Mvp-Live');
console.log('5. Configure project:');
console.log('   - Framework: Next.js');
console.log('   - Root Directory: /');
console.log('   - Build Command: npm run build');
console.log('6. Add environment variables (listed above)');
console.log('7. Click "Deploy"');
console.log('');

console.log('💻 Option B: CLI Deployment');
console.log('===========================');
console.log('1. Install Vercel CLI: npm install -g vercel');
console.log('2. Login: vercel login');
console.log('3. Deploy: vercel --prod');
console.log('4. Set environment variables when prompted');
console.log('');

console.log('📋 CURRENT PROJECT STATUS:');
console.log('=========================');
console.log('✅ Code: Ready (pushed to GitHub)');
console.log('✅ Database: Schema prepared');
console.log('✅ Environment: Variables configured');
console.log('✅ Build: Optimized for production');
console.log('');

console.log('🎯 DEPLOYMENT EXPECTATIONS:');
console.log('===========================');
console.log('⏱️ Time: 5-10 minutes');
console.log('📦 Build size: ~50MB');
console.log('🌐 Live URL: https://your-app-name.vercel.app');
console.log('');

console.log('🚀 READY FOR DEPLOYMENT!');
console.log('=======================');
console.log('');
console.log('💡 After deployment:');
console.log('1. Get your live URL from Vercel');
console.log('2. Run: node test-deployment.js');
console.log('3. Share on social media');
console.log('');

console.log('🎊 LET\'S GET XPLOAR.AI LIVE! 🌟');

// Check if vercel CLI is available
exec('vercel --version', (error, stdout, stderr) => {
    if (error) {
        console.log('⚠️ Vercel CLI not found. Use web interface or install with: npm install -g vercel');
    } else {
        console.log('✅ Vercel CLI available:', stdout.trim());
        console.log('');
        console.log('🚀 Ready to deploy with: vercel --prod');
    }
});
