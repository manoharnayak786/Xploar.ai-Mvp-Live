# Xploar.ai - UPSC Preparation Platform

## 📊 Project Status

- ✅ **Tests**: 177/177 passing (100% coverage)
- ✅ **Features**: Authentication, Study Planning, Mock Tests, AI Coach
- ✅ **Performance**: Optimized rendering and memory usage
- 🚀 **Ready for Production**

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

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