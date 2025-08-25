# Xploar.ai - UPSC Preparation Platform

## 📊 Project Status

- ✅ **Tests**: 177/177 passing (100% coverage)
- ✅ **Features**: Authentication, Study Planning, Mock Tests, AI Coach
- ✅ **Performance**: Optimized rendering and memory usage
- 🚀 **Ready for Production**

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup Supabase (database & authentication)
./setup-supabase.sh

# 3. Configure environment variables
# Edit .env.local with your Supabase credentials
# Get them from: https://supabase.com/dashboard

# 4. Test Supabase connection
node test-supabase.js

# 5. Run development server
npm run dev

# 6. Run tests
npm test

# 7. Build for production
npm run build
```

## 🗄️ Database Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for setup to complete

### 2. Configure Environment
1. Run `./setup-supabase.sh` to create `.env.local`
2. Go to your Supabase project dashboard
3. Navigate to Settings > API
4. Copy your Project URL and anon public key
5. Update `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Setup Database Schema
1. Go to SQL Editor in your Supabase dashboard
2. Copy contents of `supabase-schema.sql`
3. Run the SQL to create required tables

### 4. Test Connection
```bash
node test-supabase.js
```

### 5. Enable Authentication Providers (Optional)
- Go to Authentication > Providers
- Enable Google, GitHub, or other providers

## 🔍 Troubleshooting

### Authentication Issues
- Check `.env.local` has correct Supabase credentials
- Run `node test-supabase.js` to verify connection
- Check browser console for detailed error messages

### No Preview After Login
- Verify database schema is applied
- Check user data is being saved to Supabase
- Check browser localStorage for session data
- Use debug tools at `/debug.html`

## 🧪 Testing

This project has comprehensive test coverage across all categories:

### Test Categories
- **Unit Tests**: Utility functions and core logic
- **Component Tests**: React component behavior
- **Integration Tests**: Component interactions and data flow
- **E2E Tests**: Complete user journey testing
- **Performance Tests**: Rendering efficiency and memory usage
- **API Tests**: Backend endpoint validation

### Quick Test Commands

```bash
# All tests
npm test

# Specific categories
npm test -- --testPathPatterns="(integration)"
npm test -- --testPathPatterns="(performance)"

# With coverage
npm test -- --coverage
```

📖 **[Complete Testing Guide](TESTING-README.md)** - Detailed documentation for setup, best practices, and troubleshooting.

## 🏗️ Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Backend**: Supabase
- **Animations**: Framer Motion
- **Testing**: Jest + React Testing Library

## 📁 Project Structure

```
xploar-web-app/
├── src/
│   ├── app/                 # Next.js app router
│   ├── components/          # React components
│   │   ├── features/        # Feature components
│   │   ├── layout/          # Layout components
│   │   └── ui/              # Reusable UI components
│   ├── lib/                 # Utilities and configurations
│   └── __tests__/           # Comprehensive test suite
├── public/                  # Static assets
└── docs/                    # Documentation
```

## 🎯 Key Features

- **AI-Powered Learning**: Personalized study recommendations
- **Mock Test Platform**: Comprehensive UPSC preparation
- **Study Planning**: Intelligent scheduling and progress tracking
- **Community Features**: Discussion forums and peer reviews
- **Progress Analytics**: Detailed performance insights

## 📈 Development Workflow

1. **Local Development**
   ```bash
   npm install
   npm run dev
   ```

2. **Testing**
   ```bash
   npm test                    # Run all tests
   npm test -- --coverage     # With coverage report
   ```

3. **Code Quality**
   - All tests must pass before merging
   - Maintain 100% test coverage
   - Follow established coding patterns

## 🚀 Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

This project is proprietary to Xploar.ai

---

**Built with ❤️ for UPSC aspirants**