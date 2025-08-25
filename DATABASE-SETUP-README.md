# 🚀 XPLOAR.AI DATABASE SETUP GUIDE

## 🎯 QUICK START

Your app is **deployed and ready**, but needs database setup to unlock all features.

**Live Demo:** https://xploar-web-5puycxu28-manoharnayakbarmavaths-projects.vercel.app

---

## 📋 WHAT'S WORKING NOW

✅ **App Deployed** - Available at live URL
✅ **Basic Pages** - Load without errors
✅ **UI Components** - All components render
❌ **User Features** - Need database to work

---

## 🔧 ONE-TIME DATABASE SETUP (5 minutes)

### Step 1: Apply Database Schema

1. **Go to Supabase Dashboard:**
   ```
   https://supabase.com/dashboard
   ```

2. **Select Your Project:**
   ```
   meoyfsrpuocdrkzjzbvk
   ```

3. **Open SQL Editor:**
   - Click **"SQL Editor"** in left sidebar
   - Click **"New Query"**

4. **Copy & Paste Schema:**
   - Open `schema-ready-to-copy.sql`
   - Copy entire contents
   - Paste into SQL Editor
   - Click **"Run"**

### Step 2: Verify Setup

```bash
# Run verification script
node verify-setup.js
```

**Expected Output:**
```
✅ Table 'users' exists
✅ Table 'study_plans' exists
✅ Table 'study_tasks' exists
🎉 DATABASE SETUP COMPLETE!
```

### Step 3: Set Environment Variables

1. **Go to Vercel Dashboard:**
   ```
   https://vercel.com/dashboard
   ```

2. **Select Your Project:**
   ```
   xploar-web-app
   ```

3. **Add Environment Variables:**
   - Go to **Settings** → **Environment Variables**
   - Add these variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://meoyfsrpuocdrkzjzbvk.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
     NEXT_PUBLIC_SITE_URL=https://xploar-web-5puycxu28-manoharnayakbarmavaths-projects.vercel.app
     ```

---

## 🧪 TEST YOUR APP

### Automated Testing

```bash
# Test all functionality
node test-full-functionality.js
```

### Manual Testing

1. **Visit Live App:**
   ```
   https://xploar-web-5puycxu28-manoharnayakbarmavaths-projects.vercel.app
   ```

2. **Debug Panel:**
   ```
   https://xploar-web-5puycxu28-manoharnayakbarmavaths-projects.vercel.app?debug=true
   ```

3. **Test Complete Flow:**
   - ✅ **Register** new account
   - ✅ **Complete onboarding** (Welcome → Goal → Time → Plan)
   - ✅ **View study planner** with personalized schedule
   - ✅ **Explore sidebar** - all 14 features accessible
   - ✅ **Refresh page** - data persists

---

## 🎯 FEATURES THAT WILL WORK

After database setup, your app will have:

### ✅ **Core Functionality**
- **User Registration** - Automatic profile creation
- **Complete Onboarding** - Welcome → Goal → Time → Plan
- **Personalized Study Planner** - Daily schedules
- **Data Persistence** - Saves across sessions

### ✅ **All 14 Features**
- **📅 Study Planner** - Daily task management
- **🎯 Mock Tests** - AI-powered practice tests
- **🤖 AI Coach** - Real-time evaluation
- **💬 Debate Room** - Interactive discussions
- **👨‍🏫 Mentors** - Expert guidance
- **📚 Content Hub** - Curated study materials
- **📊 Progress Dashboard** - Analytics & tracking
- **⚙️ Settings** - Customizable preferences
- **And 6 more features...**

---

## 🔧 DEBUGGING TOOLS

### Available Scripts

```bash
# Quick setup guide
./setup-complete.sh

# Verify database setup
node verify-setup.js

# Test deployed app
node debug-deployed-app.js

# Comprehensive functionality test
node test-full-functionality.js
```

### Debug Panel

Add `?debug=true` to any URL to see:
- ✅ Database connection status
- ✅ Authentication state
- ✅ User profile data
- ✅ Study plan information

---

## 🚨 COMMON ISSUES

### Issue: "Table doesn't exist"
**Solution:** Apply the SQL schema in Supabase dashboard

### Issue: "Permission denied"
**Solution:** Check Row Level Security policies in schema

### Issue: "Environment variables not set"
**Solution:** Add them in Vercel dashboard

### Issue: "Features not working"
**Solution:** Check debug panel and browser console

---

## 📞 GET HELP

If you encounter issues:

1. **Check Debug Panel:** Add `?debug=true` to URL
2. **Browser Console:** Press F12 → Console tab
3. **Run Test Scripts:** Use the verification scripts above
4. **Check Supabase:** Look for errors in dashboard

---

## 🎉 SUCCESS CRITERIA

Your app is fully functional when:

- ✅ **User registration** works without errors
- ✅ **Onboarding flow** completes successfully
- ✅ **Study planner** shows personalized schedule
- ✅ **All sidebar features** are accessible
- ✅ **Data persists** after page refresh
- ✅ **Debug panel** shows "Database: Connection OK"

---

**🚀 Your Xploar.ai UPSC preparation platform will be fully functional in just 5 minutes!**

**Apply the SQL schema and start testing!** 🎯
