-- Supabase Schema for Xploar.ai MVP
-- Run these SQL statements in your Supabase SQL Editor

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
  start_date DATE NOT NULL,
  hours_per_day INTEGER NOT NULL DEFAULT 4,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one plan per user
  UNIQUE(user_id)
);

-- =====================================================
-- 3. STUDY TASKS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.study_tasks (
  id TEXT PRIMARY KEY, -- Using the task ID from the frontend
  plan_id UUID NOT NULL REFERENCES public.study_plans(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('Read', 'Practice', 'Explain', 'Recall')),
  duration_mins INTEGER NOT NULL,
  is_done BOOLEAN DEFAULT FALSE,
  day_num INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_study_plans_user_id ON public.study_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_study_tasks_plan_id ON public.study_tasks(plan_id);
CREATE INDEX IF NOT EXISTS idx_study_tasks_day_num ON public.study_tasks(plan_id, day_num);

-- =====================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_tasks ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Study plans policies
CREATE POLICY "Users can view own study plans" ON public.study_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own study plans" ON public.study_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own study plans" ON public.study_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own study plans" ON public.study_plans
  FOR DELETE USING (auth.uid() = user_id);

-- Study tasks policies
CREATE POLICY "Users can view own study tasks" ON public.study_tasks
  FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM public.study_plans WHERE id = plan_id)
  );

CREATE POLICY "Users can insert own study tasks" ON public.study_tasks
  FOR INSERT WITH CHECK (
    auth.uid() = (SELECT user_id FROM public.study_plans WHERE id = plan_id)
  );

CREATE POLICY "Users can update own study tasks" ON public.study_tasks
  FOR UPDATE USING (
    auth.uid() = (SELECT user_id FROM public.study_plans WHERE id = plan_id)
  );

CREATE POLICY "Users can delete own study tasks" ON public.study_tasks
  FOR DELETE USING (
    auth.uid() = (SELECT user_id FROM public.study_plans WHERE id = plan_id)
  );

-- =====================================================
-- 6. FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_study_plans_updated_at BEFORE UPDATE ON public.study_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_study_tasks_updated_at BEFORE UPDATE ON public.study_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 7. INITIAL DATA SETUP (Optional)
-- =====================================================

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile automatically
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Test if tables are created correctly
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Test RLS policies
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
-- FROM pg_policies WHERE schemaname = 'public';
