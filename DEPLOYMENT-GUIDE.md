# 🚀 XPLOAR.AI DEPLOYMENT GUIDE

## Overview
This guide provides step-by-step instructions to deploy the AI-Powered UPSC preparation platform with complete functionality.

## ✅ Prerequisites
- GitHub repository with latest code
- Supabase account and project
- Vercel account

---

## 📋 DEPLOYMENT CHECKLIST

### ✅ COMPLETED TASKS
- [x] Code pushed to GitHub
- [x] Database schema ready (`schema-ready-to-copy.sql`)
- [x] Environment variables documented
- [x] Deployment tests created

### 🔄 REMAINING STEPS

---

## 🗄️ STEP 1: APPLY DATABASE SCHEMA

### Instructions:
1. **Go to your Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar

3. **Copy and Apply Schema**
   - Open `schema-ready-to-copy.sql` in your project
   - Copy the entire SQL content (400+ lines)
   - Paste into Supabase SQL Editor
   - Click "Run" button

4. **Verify Schema Application**
   - Run this query in SQL Editor:
   ```sql
   SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
   ```
   - You should see these tables:
     - `users`
     - `study_plans`
     - `study_tasks`
     - `ai_evaluations`
     - `ai_insights`
     - `performance_analytics`
     - `user_recommendations`
     - `user_progress`

5. **Verify Row Level Security**
   ```sql
   SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public';
   ```
   - Should show 20+ policies for data security

---

## ⚙️ STEP 2: CONFIGURE ENVIRONMENT VARIABLES

### In Vercel Dashboard:
1. **Go to Project Settings**
   - Project → Settings → Environment Variables

2. **Add These Variables:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Get Values From Supabase:**
   - **URL**: Dashboard → Settings → API → Project URL
   - **Anon Key**: Dashboard → Settings → API → Project API keys → anon public

4. **Redeploy Application**
   - After adding variables, trigger a new deployment

---

## 🌐 STEP 3: DEPLOY TO VERCEL

### Method 1: Automatic (Recommended)
1. **Connect GitHub to Vercel**
   - Go to: https://vercel.com
   - Click "Import Project"
   - Connect your GitHub account
   - Select your repository

2. **Configure Project**
   - **Framework**: Next.js
   - **Root Directory**: `/` (leave default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next` (automatic)

3. **Environment Variables**
   - Add the Supabase variables from Step 2

4. **Deploy**
   - Click "Deploy"
   - Wait for build completion (~2-3 minutes)

### Method 2: Manual CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

---

## 🧪 STEP 4: TEST DEPLOYMENT

### Run Automated Tests:
```bash
# Set your deployed URL
export DEPLOYED_URL=https://your-app-url.vercel.app

# Run deployment tests
node test-deployed-ai-features.js
```

### Manual Testing Checklist:

#### 🔐 Authentication
- [ ] App loads without errors
- [ ] Authentication screen appears
- [ ] Sign up works
- [ ] Login works
- [ ] User profile created in database

#### 🎯 AI-Powered Features
- [ ] AI Essay Evaluation loads
- [ ] Essay submission works
- [ ] AI feedback appears
- [ ] Evaluation saved to database

#### 📊 Analytics & Insights
- [ ] Performance Analytics loads
- [ ] Recommendations appear
- [ ] Progress tracking works

#### 📚 Learning Features
- [ ] Read Mode displays content
- [ ] Practice Mode works
- [ ] Mock Tests load
- [ ] Content Hub accessible

#### 👥 Community Features
- [ ] Discussion Forums load
- [ ] Study Groups accessible
- [ ] Leaderboard works

#### 🧭 Navigation
- [ ] Sidebar navigation works
- [ ] All features accessible
- [ ] Study planner loads

---

## 🔍 TROUBLESHOOTING

### Common Issues:

#### ❌ "Database connection failed"
- Check environment variables in Vercel
- Verify Supabase project is active
- Confirm RLS policies are applied

#### ❌ "Table doesn't exist"
- Re-run the database schema
- Check Supabase SQL Editor for errors
- Verify all tables were created

#### ❌ "Build failed"
- Check Vercel build logs
- Ensure all dependencies are installed
- Verify TypeScript compilation

#### ❌ "Features not loading"
- Check browser console for errors
- Verify environment variables
- Test database connectivity

---

## 📊 MONITORING & ANALYTICS

### Vercel Analytics
- Enable in Vercel dashboard
- Monitor performance metrics
- Track user engagement

### Database Monitoring
```sql
-- Check user activity
SELECT COUNT(*) FROM users;

-- Check AI evaluations
SELECT COUNT(*) FROM ai_evaluations;

-- Check performance data
SELECT COUNT(*) FROM performance_analytics;
```

---

## 🚀 POST-DEPLOYMENT

### Performance Optimization:
1. **Enable Vercel Edge Functions** (if needed)
2. **Set up CDN** for static assets
3. **Configure caching headers**

### Security:
1. **Review RLS policies**
2. **Set up monitoring alerts**
3. **Regular security updates**

### Scaling:
1. **Monitor database performance**
2. **Set up database indexes**
3. **Configure auto-scaling**

---

## 📞 SUPPORT

### If you encounter issues:
1. Check Vercel deployment logs
2. Verify Supabase connectivity
3. Run the test script: `node test-deployed-ai-features.js`
4. Check browser developer console
5. Review database logs in Supabase

---

## 🎉 SUCCESS CRITERIA

Your deployment is successful when:
- ✅ App loads without errors
- ✅ Authentication works
- ✅ AI features are functional
- ✅ Database operations work
- ✅ All navigation works
- ✅ Content loads properly

---

**🎊 Congratulations! Your AI-Powered UPSC preparation platform is now live!**

*Need help? Check the troubleshooting section or contact support.*
