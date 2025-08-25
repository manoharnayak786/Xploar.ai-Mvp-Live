#!/bin/bash

echo "🚀 Setting up Supabase for Xploar Web App"
echo "=========================================="

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found. Creating template..."
    cat > .env.local << 'EOF'
# Supabase Configuration
# Get these values from your Supabase project dashboard
# https://supabase.com/dashboard/project/YOUR_PROJECT_ID/settings/api

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# For production deployment, update NEXT_PUBLIC_SITE_URL to your deployed domain
# NEXT_PUBLIC_SITE_URL=https://your-app-name.vercel.app
EOF
    echo "✅ Created .env.local template"
fi

echo ""
echo "📋 SETUP INSTRUCTIONS:"
echo "====================="
echo "1. Go to https://supabase.com/dashboard"
echo "2. Create a new project or select existing one"
echo "3. Go to Settings > API"
echo "4. Copy your Project URL and anon public key"
echo "5. Update .env.local with your actual values:"
echo "   - NEXT_PUBLIC_SUPABASE_URL"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo ""
echo "6. Run the SQL schema from supabase-schema.sql:"
echo "   - Go to SQL Editor in your Supabase dashboard"
echo "   - Copy and paste the contents of supabase-schema.sql"
echo "   - Run the query to create tables"
echo ""
echo "7. Enable authentication providers (optional):"
echo "   - Go to Authentication > Providers"
echo "   - Enable Google, GitHub, or other providers you want"
echo ""
echo "8. Test the connection:"
echo "   npm run dev"
echo "   Visit http://localhost:3000"
echo "   Try to sign up/login"
echo ""
echo "🔍 TROUBLESHOOTING:"
echo "=================="
echo "If you see authentication errors:"
echo "- Check your Supabase URL and key in .env.local"
echo "- Make sure the database schema is applied"
echo "- Check browser console for detailed error messages"
echo ""
echo "If you see 'No preview after login':"
echo "- Check that user data is being saved to Supabase"
echo "- Verify the study plan is being generated and persisted"
echo "- Check browser localStorage for user session data"
