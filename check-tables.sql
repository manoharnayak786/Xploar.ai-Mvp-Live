-- Check if all required tables exist
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check if RLS policies are created
SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public';

-- Check if trigger exists
SELECT trigger_name FROM information_schema.triggers WHERE event_object_schema = 'auth';
