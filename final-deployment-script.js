#!/usr/bin/env node

/**
 * 🎯 XPLOAR.AI - FINAL DEPLOYMENT SCRIPT
 * Run with: node final-deployment-script.js
 */

const https = require('https');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

console.log('🎯 XPLOAR.AI - FINAL DEPLOYMENT SCRIPT');
console.log('=====================================');
console.log('🚀 Ready to complete your UPSC platform!\n');

const CONFIG = {
    supabase: {
        url: 'https://meoyfsrpuocdrkzjzbvk.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lb3lmc3JwdW9jZHJremp6YnZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMzM5NjYsImV4cCI6MjA3MTcwOTk2Nn0.Os6sKp9arKMnterPUQhD0Vuhto7U9d3SestIYu8lqEo'
    },
    deployedUrl: 'https://xploar-web-k5nhmj520-manoharnayakbarmavaths-projects.vercel.app',
    googleApiKey: 'AIzaSyCrO4GYag-h-CUp4TiV6QkVkc1IZA2NTVY'
};

const supabase = createClient(CONFIG.supabase.url, CONFIG.supabase.anonKey);

// Helper functions
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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Generate complete SQL schema
function generateDatabaseSchema() {
    return `-- XPLOAR.AI DATABASE SCHEMA (ENHANCED WITH AI FEATURES)
-- Copy and paste this entire SQL into your Supabase SQL Editor
-- Then click "Run" to apply the schema

-- =====================================================
-- 1. USERS TABLE (Extended from auth.users)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  study_level TEXT DEFAULT 'Beginner' CHECK (study_level IN ('Beginner', 'Intermediate', 'Advanced')),
  target_exam TEXT DEFAULT 'UPSC',
  is_pro_user BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. STUDY PLANS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.study_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  duration_days INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. STUDY_SESSIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  study_plan_id UUID REFERENCES public.study_plans(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  session_type TEXT CHECK (session_type IN ('read', 'practice', 'explain', 'recall', 'watch')),
  completed BOOLEAN DEFAULT FALSE,
  session_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. AI_EVALUATIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.ai_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  essay_title TEXT NOT NULL,
  essay_content TEXT NOT NULL,
  word_count INTEGER NOT NULL,
  evaluation_score DECIMAL(3,1) CHECK (evaluation_score >= 0 AND evaluation_score <= 10),
  feedback TEXT NOT NULL,
  strengths TEXT[],
  improvements TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 5. AI_INSIGHTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  insight_type TEXT CHECK (insight_type IN ('performance', 'recommendation', 'progress', 'motivation')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority_level TEXT DEFAULT 'medium' CHECK (priority_level IN ('low', 'medium', 'high')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 6. PERFORMANCE_ANALYTICS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.performance_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  score DECIMAL(5,2) CHECK (score >= 0 AND score <= 100),
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  time_taken_minutes INTEGER NOT NULL,
  difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 7. USER_RECOMMENDATIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.user_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  recommendation_type TEXT CHECK (recommendation_type IN ('study_plan', 'practice', 'revision', 'resource')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority_level TEXT DEFAULT 'medium' CHECK (priority_level IN ('low', 'medium', 'high')),
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- =====================================================
-- 8. USER_PROGRESS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  progress_percentage DECIMAL(5,2) CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  last_studied_at TIMESTAMPTZ,
  study_streak_days INTEGER DEFAULT 0,
  total_study_time_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, subject, topic)
);

-- =====================================================
-- 9. MOCK_TESTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.mock_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  test_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  score DECIMAL(5,2) CHECK (score >= 0 AND score <= 100),
  time_taken_minutes INTEGER NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 10. DISCUSSION_FORUMS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.discussion_forums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT CHECK (category IN ('General', 'Study Tips', 'Exam Strategy', 'Resources', 'Motivation')),
  is_anonymous BOOLEAN DEFAULT FALSE,
  likes_count INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 11. FORUM_REPLIES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.forum_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  forum_post_id UUID NOT NULL REFERENCES public.discussion_forums(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 12. STUDY_GROUPS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.study_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  group_name TEXT NOT NULL,
  description TEXT,
  subject TEXT NOT NULL,
  max_members INTEGER DEFAULT 50,
  current_members INTEGER DEFAULT 1,
  is_private BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 13. STUDY_GROUP_MEMBERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.study_group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.study_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- =====================================================
-- 14. PEER_REVIEWS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.peer_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  review_type TEXT CHECK (review_type IN ('essay', 'mock_test', 'study_plan')),
  item_id UUID NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 15. MENTORSHIP TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.mentorship (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  mentee_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(mentor_id, mentee_id, subject)
);

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_forums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.peer_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- Study plans policies
CREATE POLICY "Users can view own study plans" ON public.study_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own study plans" ON public.study_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own study plans" ON public.study_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own study plans" ON public.study_plans FOR DELETE USING (auth.uid() = user_id);

-- Study sessions policies
CREATE POLICY "Users can view own study sessions" ON public.study_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own study sessions" ON public.study_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own study sessions" ON public.study_sessions FOR UPDATE USING (auth.uid() = user_id);

-- AI evaluations policies
CREATE POLICY "Users can view own evaluations" ON public.ai_evaluations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own evaluations" ON public.ai_evaluations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- AI insights policies
CREATE POLICY "Users can view own insights" ON public.ai_insights FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own insights" ON public.ai_insights FOR UPDATE USING (auth.uid() = user_id);

-- Performance analytics policies
CREATE POLICY "Users can view own analytics" ON public.performance_analytics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own analytics" ON public.performance_analytics FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User recommendations policies
CREATE POLICY "Users can view own recommendations" ON public.user_recommendations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own recommendations" ON public.user_recommendations FOR UPDATE USING (auth.uid() = user_id);

-- User progress policies
CREATE POLICY "Users can view own progress" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own progress" ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON public.user_progress FOR UPDATE USING (auth.uid() = user_id);

-- Mock tests policies
CREATE POLICY "Users can view own mock tests" ON public.mock_tests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own mock tests" ON public.mock_tests FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Discussion forums policies (public read, authenticated create)
CREATE POLICY "Anyone can view forum posts" ON public.discussion_forums FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON public.discussion_forums FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON public.discussion_forums FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON public.discussion_forums FOR DELETE USING (auth.uid() = user_id);

-- Forum replies policies
CREATE POLICY "Anyone can view replies" ON public.forum_replies FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create replies" ON public.forum_replies FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);
CREATE POLICY "Users can update own replies" ON public.forum_replies FOR UPDATE USING (auth.uid() = user_id);

-- Study groups policies
CREATE POLICY "Anyone can view public groups" ON public.study_groups FOR SELECT USING (NOT is_private);
CREATE POLICY "Authenticated users can create groups" ON public.study_groups FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = creator_id);
CREATE POLICY "Group creators can update own groups" ON public.study_groups FOR UPDATE USING (auth.uid() = creator_id);

-- Study group members policies
CREATE POLICY "Group members can view membership" ON public.study_group_members FOR SELECT USING (auth.uid() = user_id OR auth.uid() IN (SELECT creator_id FROM public.study_groups WHERE id = group_id));
CREATE POLICY "Users can join groups" ON public.study_group_members FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Peer reviews policies
CREATE POLICY "Users can view reviews about themselves" ON public.peer_reviews FOR SELECT USING (auth.uid() = reviewee_id);
CREATE POLICY "Users can create reviews" ON public.peer_reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = reviewer_id);

-- Mentorship policies
CREATE POLICY "Mentors and mentees can view their relationships" ON public.mentorship FOR SELECT USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);
CREATE POLICY "Users can create mentorship requests" ON public.mentorship FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = mentee_id);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_study_plans_updated_at BEFORE UPDATE ON public.study_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON public.user_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_discussion_forums_updated_at BEFORE UPDATE ON public.discussion_forums FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_study_groups_updated_at BEFORE UPDATE ON public.study_groups FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_mentorship_updated_at BEFORE UPDATE ON public.mentorship FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
`;
}

// Save schema to file for easy copying
function saveSchemaToFile() {
    const schema = generateDatabaseSchema();
    fs.writeFileSync('XPLOAR_DATABASE_SCHEMA.sql', schema);
    log('✅ Database schema saved to: XPLOAR_DATABASE_SCHEMA.sql', 'green');
}

// Print clickable links and instructions
function printActionableInstructions() {
    console.log('\n🚀 ACTIONABLE INSTRUCTIONS:');
    console.log('==========================\n');

    log('📋 STEP 1: Apply Database Schema', 'yellow');
    console.log('🔗 Click here: https://supabase.com/dashboard');
    console.log('📂 Select project: meoyfsrpuocdrkzjzbvk');
    console.log('🔧 Go to: SQL Editor');
    console.log('📝 Copy from: XPLOAR_DATABASE_SCHEMA.sql');
    console.log('✅ Click: Run');
    console.log('');

    log('📋 STEP 2: Set Environment Variables', 'yellow');
    console.log('🔗 Click here: https://vercel.com/dashboard');
    console.log('📂 Find project: xploar-web');
    console.log('⚙️ Go to: Settings → Environment Variables');
    console.log('➕ Click: Add New');

    const envVars = [
        ['NEXT_PUBLIC_SUPABASE_URL', 'https://meoyfsrpuocdrkzjzbvk.supabase.co'],
        ['NEXT_PUBLIC_SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lb3lmc3JwdW9jZHJremp6YnZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMzM5NjYsImV4cCI6MjA3MTcwOTk2Nn0.Os6sKp9arKMnterPUQhD0Vuhto7U9d3SestIYu8lqEo'],
        ['NEXT_PUBLIC_SITE_URL', 'https://xploar-web-k5nhmj520-manoharnayakbarmavaths-projects.vercel.app'],
        ['GOOGLE_AI_API_KEY', 'AIzaSyCrO4GYag-h-CUp4TiV6QkVkc1IZA2NTVY'],
        ['NEXT_PUBLIC_GOOGLE_AI_API_KEY', 'AIzaSyCrO4GYag-h-CUp4TiV6QkVkc1IZA2NTVY']
    ];

    envVars.forEach(([key, value]) => {
        console.log(`   ${key}=${value}`);
    });

    console.log('🌍 Set Environment: Production');
    console.log('💾 Click: Save (for each variable)');
    console.log('🔄 Vercel will auto-redeploy');
    console.log('');

    log('📋 STEP 3: Disable Email Confirmation', 'yellow');
    console.log('🔗 Click here: https://supabase.com/dashboard');
    console.log('📂 Select project: meoyfsrpuocdrkzjzbvk');
    console.log('🔧 Go to: Authentication → Settings');
    console.log('📝 Find: User Signups section');
    console.log('☐ Uncheck: Enable email confirmations');
    console.log('💾 Click: Save changes');
    console.log('');

    log('📋 STEP 4: Final Validation', 'green');
    console.log('💻 Run command: node final-xploar-validation.js');
    console.log('✅ Expected: All 6 tests pass');
    console.log('');
}

// Test current status
async function testCurrentStatus() {
    log('\n🔍 TESTING CURRENT STATUS...', 'magenta');
    console.log('');

    const tests = [
        { name: 'Supabase Connection', test: async () => {
            try {
                const { error } = await supabase.from('users').select('*').limit(1);
                return !error;
            } catch (e) {
                return false;
            }
        }},
        { name: 'Database Tables', test: async () => {
            const tables = ['users', 'study_plans', 'study_sessions', 'ai_evaluations', 'ai_insights', 'performance_analytics', 'user_recommendations', 'user_progress', 'mock_tests', 'discussion_forums', 'forum_replies', 'study_groups', 'study_group_members', 'peer_reviews', 'mentorship'];
            let count = 0;
            for (const table of tables) {
                try {
                    const { error } = await supabase.from(table).select('*').limit(1);
                    if (!error) count++;
                } catch (e) {
                    // ignore
                }
            }
            return count >= 10; // At least 10 tables should exist
        }},
        { name: 'Website Accessibility', test: async () => {
            try {
                const response = await new Promise((resolve, reject) => {
                    https.get(CONFIG.deployedUrl, (res) => {
                        resolve({ statusCode: res.statusCode });
                    }).on('error', reject);
                });
                return response.statusCode === 200;
            } catch (e) {
                return false;
            }
        }},
        { name: 'Authentication Flow', test: async () => {
            try {
                const testEmail = `test${Date.now()}@xploarai.com`;
                const { error } = await supabase.auth.signUp({
                    email: testEmail,
                    password: 'TestPass123!'
                });
                return !error || error.message.includes('email_not_confirmed');
            } catch (e) {
                return false;
            }
        }},
        { name: 'Google AI API', test: async () => {
            try {
                const response = await new Promise((resolve, reject) => {
                    const req = https.request({
                        hostname: 'generativelanguage.googleapis.com',
                        path: `/v1beta/models/gemini-pro:generateContent?key=${CONFIG.googleApiKey}`,
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' }
                    }, (res) => {
                        resolve({ statusCode: res.statusCode });
                    });
                    req.write(JSON.stringify({
                        contents: [{
                            parts: [{ text: 'Hello' }]
                        }]
                    }));
                    req.on('error', reject);
                    req.end();
                });
                return response.statusCode === 200;
            } catch (e) {
                return false;
            }
        }}
    ];

    let passed = 0;
    for (const { name, test } of tests) {
        log(`🧪 Testing ${name}...`, 'cyan');
        const result = await test();
        if (result) {
            log(`✅ ${name} working`, 'green');
            passed++;
        } else {
            log(`❌ ${name} needs setup`, 'red');
        }
        await sleep(1000);
    }

    console.log('\n🎊 STATUS SUMMARY:');
    console.log(`✅ ${passed}/5 tests passed`);

    if (passed >= 4) {
        log('\n🎉 ALMOST READY! Just a few manual steps left!', 'green');
    } else {
        log('\n⚠️ MANUAL STEPS REQUIRED', 'yellow');
    }

    return passed;
}

// Main function
async function main() {
    console.log('🎯 XPLOAR.AI FINAL DEPLOYMENT');
    console.log('============================\n');

    // Save schema for easy copying
    saveSchemaToFile();

    // Print instructions
    printActionableInstructions();

    // Test current status
    const passedTests = await testCurrentStatus();

    // Final guidance
    console.log('\n🎯 FINAL STEPS:');
    console.log('==============');

    if (passedTests >= 4) {
        log('✅ Most systems are ready!', 'green');
        console.log('📋 Complete the remaining manual steps above');
    } else {
        log('⚠️ Manual setup required', 'yellow');
        console.log('📋 Follow the 4 steps above in order');
    }

    console.log('\n🚀 AFTER COMPLETION:');
    console.log('node final-xploar-validation.js  # Run final validation');

    console.log('\n🏆 CELEBRATION AWAITS!');
    console.log('Your AI-powered UPSC platform will be 100% ready! 🎉');

    console.log('\n📞 Need help? Run: node complete-all-todos.js');
    console.log('💪 You\'ve built something amazing! 🌟\n');
}

// Run the script
main().catch(error => {
    log(`\n❌ Script failed: ${error.message}`, 'red');
    process.exit(1);
});
