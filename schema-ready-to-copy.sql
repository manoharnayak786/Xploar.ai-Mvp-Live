-- XPLOAR.AI DATABASE SCHEMA (ENHANCED WITH AI FEATURES)
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
-- 4. AI EVALUATIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.ai_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  genre TEXT NOT NULL CHECK (genre IN ('Polity', 'Economy', 'History', 'Ethics')),
  question TEXT NOT NULL,
  essay_text TEXT NOT NULL,
  word_count INTEGER NOT NULL,
  accuracy_score INTEGER NOT NULL CHECK (accuracy_score >= 0 AND accuracy_score <= 100),
  coverage_score INTEGER NOT NULL CHECK (coverage_score >= 0 AND coverage_score <= 100),
  time_efficiency INTEGER NOT NULL CHECK (time_efficiency >= 0 AND time_efficiency <= 100),
  recommendations TEXT[] NOT NULL DEFAULT '{}',
  ai_feedback TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  evaluation_time_ms INTEGER
);

-- =====================================================
-- 5. AI INSIGHTS AND RECOMMENDATIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL CHECK (insight_type IN ('performance_analysis', 'weakness_identification', 'improvement_suggestion', 'progress_tracking')),
  topic_id TEXT,
  current_score DECIMAL(5,2),
  target_score DECIMAL(5,2),
  recommendations JSONB DEFAULT '{}',
  insights_data JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days')
);

-- =====================================================
-- 6. PERFORMANCE ANALYTICS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.performance_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('mock_test', 'essay_evaluation', 'topic_practice', 'study_session')),
  topic_id TEXT,
  genre TEXT CHECK (genre IN ('Polity', 'Economy', 'History', 'Ethics')),
  score DECIMAL(5,2),
  time_spent_minutes INTEGER,
  difficulty_level TEXT DEFAULT 'medium' CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
  performance_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 7. AI RECOMMENDATIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.user_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  recommendation_type TEXT NOT NULL CHECK (recommendation_type IN ('revise_topic', 'attempt_mock', 'read_article', 'watch_video', 'practice_essay')),
  related_topic_id TEXT,
  related_resource_id TEXT,
  reasoning TEXT NOT NULL,
  priority_score DECIMAL(3,2) DEFAULT 1.0,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days')
);

-- =====================================================
-- 8. USER PROGRESS TRACKING TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL,
  mastery_level DECIMAL(3,2) DEFAULT 0.0 CHECK (mastery_level >= 0.0 AND mastery_level <= 1.0),
  total_questions_attempted INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  total_study_time_minutes INTEGER DEFAULT 0,
  last_practiced_at TIMESTAMPTZ DEFAULT NOW(),
  strengths TEXT[] DEFAULT '{}',
  weaknesses TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, topic_id)
);

-- =====================================================
-- 9. ROW LEVEL SECURITY POLICIES FOR AI TABLES
-- =====================================================

-- AI Evaluations RLS
ALTER TABLE public.ai_evaluations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own evaluations" ON public.ai_evaluations
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own evaluations" ON public.ai_evaluations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- AI Insights RLS
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own insights" ON public.ai_insights
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own insights" ON public.ai_insights
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own insights" ON public.ai_insights
  FOR UPDATE USING (auth.uid() = user_id);

-- Performance Analytics RLS
ALTER TABLE public.performance_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own analytics" ON public.performance_analytics
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own analytics" ON public.performance_analytics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Recommendations RLS
ALTER TABLE public.user_recommendations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own recommendations" ON public.user_recommendations
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own recommendations" ON public.user_recommendations
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert recommendations" ON public.user_recommendations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Progress RLS
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own progress" ON public.user_progress
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON public.user_progress
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert progress" ON public.user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 10. AI FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to calculate user progress after performance data
CREATE OR REPLACE FUNCTION public.calculate_user_progress()
RETURNS TRIGGER AS $$
DECLARE
  total_attempts INTEGER;
  correct_count INTEGER;
  mastery_calc DECIMAL(3,2);
BEGIN
  -- Calculate mastery level based on performance
  SELECT
    COALESCE(SUM(pa.total_questions_attempted), 0),
    COALESCE(SUM(pa.correct_answers), 0)
  INTO total_attempts, correct_count
  FROM performance_analytics pa
  WHERE pa.user_id = NEW.user_id AND pa.topic_id = NEW.topic_id;

  -- Calculate mastery as accuracy rate with diminishing returns
  IF total_attempts > 0 THEN
    mastery_calc := LEAST(1.0, (correct_count::DECIMAL / total_attempts) * (1 + LN(total_attempts + 1) / 10));
  ELSE
    mastery_calc := 0.0;
  END IF;

  -- Insert or update progress
  INSERT INTO user_progress (user_id, topic_id, mastery_level, total_questions_attempted, correct_answers, updated_at)
  VALUES (NEW.user_id, NEW.topic_id, mastery_calc, total_attempts, correct_count, NOW())
  ON CONFLICT (user_id, topic_id)
  DO UPDATE SET
    mastery_level = EXCLUDED.mastery_level,
    total_questions_attempted = EXCLUDED.total_questions_attempted,
    correct_answers = EXCLUDED.correct_answers,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate AI recommendations based on performance
CREATE OR REPLACE FUNCTION public.generate_ai_recommendations(user_uuid UUID)
RETURNS VOID AS $$
DECLARE
  weak_topic RECORD;
  rec_id UUID;
BEGIN
  -- Clear old recommendations
  UPDATE user_recommendations
  SET is_active = FALSE
  WHERE user_id = user_uuid AND created_at < NOW() - INTERVAL '7 days';

  -- Generate recommendations for weak topics
  FOR weak_topic IN
    SELECT topic_id, mastery_level
    FROM user_progress
    WHERE user_id = user_uuid AND mastery_level < 0.6
    ORDER BY mastery_level ASC
    LIMIT 3
  LOOP
    rec_id := gen_random_uuid();
    INSERT INTO user_recommendations (id, user_id, recommendation_type, related_topic_id, reasoning, priority_score)
    VALUES (
      rec_id,
      user_uuid,
      'revise_topic',
      weak_topic.topic_id,
      format('Your mastery level in %s is %.1f%%. Focus on strengthening this weak area.', weak_topic.topic_id, weak_topic.mastery_level * 100),
      1.0 - weak_topic.mastery_level
    );
  END LOOP;

  -- Generate essay practice recommendations
  IF NOT EXISTS (
    SELECT 1 FROM ai_evaluations
    WHERE user_id = user_uuid AND submitted_at >= NOW() - INTERVAL '7 days'
  ) THEN
    INSERT INTO user_recommendations (id, user_id, recommendation_type, reasoning, priority_score)
    VALUES (
      gen_random_uuid(),
      user_uuid,
      'practice_essay',
      'You haven''t practiced essay writing this week. Regular practice improves your answer writing skills.',
      0.8
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update user progress after performance data
CREATE OR REPLACE TRIGGER on_performance_insert
  AFTER INSERT ON performance_analytics
  FOR EACH ROW EXECUTE FUNCTION public.calculate_user_progress();

-- Trigger to generate recommendations after evaluations
CREATE OR REPLACE TRIGGER on_evaluation_complete
  AFTER INSERT ON ai_evaluations
  FOR EACH ROW EXECUTE FUNCTION public.generate_ai_recommendations(NEW.user_id);

-- =====================================================
-- SCHEMA APPLICATION COMPLETE!
-- =====================================================

-- Verification queries (run these separately to test):
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
-- SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public';
