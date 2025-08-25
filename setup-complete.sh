#!/bin/bash

# Complete Xploar.ai Setup Script
# This script guides you through setting up the database schema

echo "🚀 XPLOAR.AI COMPLETE SETUP"
echo "============================"
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found!"
    echo "Please create .env.local with your Supabase credentials:"
    echo ""
    echo "NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co"
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key"
    echo ""
    exit 1
fi

echo "✅ Environment file found"
echo ""

# Test current setup
echo "🔍 Testing current setup..."
node verify-setup.js

echo ""
echo "📋 NEXT STEPS:"
echo "=============="
echo ""
echo "1. 📊 APPLY DATABASE SCHEMA:"
echo "   ├─ Go to: https://supabase.com/dashboard"
echo "   ├─ Select your project"
echo "   ├─ Go to 'SQL Editor'"
echo "   ├─ Click 'New Query'"
echo "   ├─ Copy and paste the contents of: supabase-schema.sql"
echo "   └─ Click 'Run'"
echo ""

echo "2. 🔧 SET VERCEL ENVIRONMENT VARIABLES:"
echo "   ├─ Go to: https://vercel.com/dashboard"
echo "   ├─ Select your project"
echo "   ├─ Go to 'Settings' → 'Environment Variables'"
echo "   └─ Add these variables:"
echo "       • NEXT_PUBLIC_SUPABASE_URL"
echo "       • NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "       • NEXT_PUBLIC_SITE_URL (your deployed URL)"
echo ""

echo "3. 🧪 VERIFY SETUP:"
echo "   └─ Run: node verify-setup.js"
echo ""

echo "4. 🌐 TEST YOUR APP:"
echo "   ├─ Visit: https://xploar-web-5puycxu28-manoharnayakbarmavaths-projects.vercel.app"
echo "   ├─ Debug: https://xploar-web-5puycxu28-manoharnayakbarmavaths-projects.vercel.app?debug=true"
echo "   └─ Test: Registration → Onboarding → Study Planner"
echo ""

echo "🎯 WHAT TO EXPECT AFTER SETUP:"
echo "==============================="
echo "✅ User registration with automatic profile creation"
echo "✅ Complete onboarding flow (Welcome → Goal → Time → Plan)"
echo "✅ Personalized study planner with daily schedules"
echo "✅ All 14 features accessible in sidebar"
echo "✅ Data persistence across browser sessions"
echo "✅ Real-time updates and progress tracking"
echo ""

echo "🔧 DEBUGGING TOOLS:"
echo "=================="
echo "• node debug-deployed-app.js - Test deployed app"
echo "• node verify-setup.js - Check database setup"
echo "• Add ?debug=true to URL - See debug panel"
echo ""

echo "📞 NEED HELP?"
echo "============="
echo "If you encounter issues:"
echo "1. Check browser console (F12)"
echo "2. Use the debug panel (?debug=true)"
echo "3. Run the verification scripts"
echo "4. Check Supabase dashboard for errors"
echo ""

echo "🎉 READY TO GET STARTED?"
echo "========================"
echo "Apply the SQL schema in Supabase dashboard, then test your app!"
echo ""
