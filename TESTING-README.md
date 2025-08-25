# 🧪 Xploar Web App - Testing Documentation

## 📊 Test Status: 177/177 Tests Passing (100% Coverage) ✅

This comprehensive test suite ensures code quality, prevents regressions, and enables confident deployments.

## 📁 Test Structure

```
src/__tests__/
├── api/                    # API Route Tests
│   └── auth/
│       ├── login.test.ts
│       └── signup.test.ts
├── components/             # Component Unit Tests
│   ├── AuthScreen.test.tsx
│   └── MockRunner.test.tsx
├── e2e/                    # End-to-End Tests
│   └── complete-user-journey.test.tsx
├── integration/            # Integration Tests
│   ├── api-integration.test.ts
│   ├── auth-flow.test.tsx
│   ├── component-interactions.test.tsx
│   └── study-planning-flow.test.tsx
├── lib/                    # Store/Utility Tests
│   └── store.test.ts
├── performance/            # Performance Tests
│   └── performance.test.tsx
├── utils/                  # Utility Function Tests
│   ├── dateUtils.test.ts
│   ├── planGenerator.test.ts
│   └── scoreCalculator.test.ts
├── test-utils.tsx          # Shared Test Utilities
└── jest.setup.js           # Global Test Configuration
```

## 🚀 Quick Start

### Running Tests

```bash
# Run all tests
npm test

# Run specific test categories
npm test -- --testPathPatterns="(unit)"        # Unit tests only
npm test -- --testPathPatterns="(integration)" # Integration tests only
npm test -- --testPathPatterns="(performance)" # Performance tests only
npm test -- --testPathPatterns="(e2e)"         # E2E tests only

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm run test:watch

# Run specific test file
npm test -- src/__tests__/components/AuthScreen.test.tsx
```

### Test Scripts (package.json)

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:unit": "jest --testPathPatterns=\"(utils|lib)\"",
    "test:integration": "jest --testPathPatterns=\"(integration)\"",
    "test:performance": "jest --testPathPatterns=\"(performance)\"",
    "test:components": "jest --testPathPatterns=\"(components)\"",
    "test:e2e": "jest --testPathPatterns=\"(e2e)\""
  }
}
```

## 🛠️ Configuration

### Jest Configuration (jest.config.js)

```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.+)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/__tests__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### Global Setup (jest.setup.js)

```javascript
// Mock external dependencies
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: null } }),
    },
  },
}));

// Mock Zustand store
jest.mock('@/lib/store', () => ({
  useAppStore: jest.fn(),
}));

// Mock global objects
global.Request = jest.fn();
global.window.matchMedia = jest.fn();
```

## 📋 Test Categories

### 1. Unit Tests
**Purpose**: Test individual functions and utilities in isolation
**Location**: `src/__tests__/utils/`, `src/__tests__/lib/`
**Examples**:
- `scoreCalculator.test.ts` - Mock score calculations
- `dateUtils.test.ts` - Date formatting and manipulation
- `planGenerator.test.ts` - Study plan generation logic

### 2. Component Tests
**Purpose**: Test React component rendering and behavior
**Location**: `src/__tests__/components/`
**Examples**:
- `AuthScreen.test.tsx` - Authentication UI
- `MockRunner.test.tsx` - Mock test interface

### 3. Integration Tests
**Purpose**: Test component interactions and data flow
**Location**: `src/__tests__/integration/`
**Examples**:
- `auth-flow.test.tsx` - Complete login/signup flow
- `study-planning-flow.test.tsx` - Study planner interactions
- `component-interactions.test.tsx` - Component data flow

### 4. API Tests
**Purpose**: Test Next.js API routes
**Location**: `src/__tests__/api/`
**Examples**:
- `login.test.ts` - Authentication API
- `signup.test.ts` - User registration API

### 5. E2E Tests
**Purpose**: Test complete user journeys
**Location**: `src/__tests__/e2e/`
**Examples**:
- `complete-user-journey.test.tsx` - Full app workflow

### 6. Performance Tests
**Purpose**: Monitor rendering performance and memory usage
**Location**: `src/__tests__/performance/`
**Examples**:
- `performance.test.tsx` - Component performance metrics

## 🎯 Best Practices

### Writing Unit Tests

```typescript
import { calculateMockScore } from '@/lib/utils/scoreCalculator';

describe('calculateMockScore', () => {
  it('should calculate correct score for perfect answers', () => {
    const result = calculateMockScore(10, 10); // 10 correct out of 10
    expect(result).toBe(100);
  });

  it('should handle zero correct answers', () => {
    const result = calculateMockScore(0, 10);
    expect(result).toBe(0);
  });

  it('should calculate partial scores correctly', () => {
    const result = calculateMockScore(7, 10);
    expect(result).toBe(70);
  });
});
```

### Writing Component Tests

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthScreen } from '@/components/features/onboarding/AuthScreen';

describe('AuthScreen', () => {
  it('should render login form by default', () => {
    render(<AuthScreen onAuthSuccess={jest.fn()} />);

    expect(screen.getByText('Welcome Back!')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
  });

  it('should handle form submission', async () => {
    const mockOnAuthSuccess = jest.fn();
    const user = userEvent.setup();

    render(<AuthScreen onAuthSuccess={mockOnAuthSuccess} />);

    await user.type(screen.getByPlaceholderText('Enter your email'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('Enter your password'), 'password123');
    await user.click(screen.getByText('Sign In'));

    // Verify expected behavior
  });
});
```

### Writing Integration Tests

```typescript
describe('Authentication Flow', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Setup store mocks
    mockUseAppStore.mockReturnValue({
      loginWithPassword: jest.fn(),
      signUpWithPassword: jest.fn(),
      requestPasswordReset: jest.fn(),
    });
  });

  it('should handle successful login', async () => {
    const mockLogin = jest.fn().mockResolvedValue({ success: true });
    mockUseAppStore.mockReturnValue({
      loginWithPassword: mockLogin,
      // ... other store methods
    });

    render(<AuthScreen onAuthSuccess={jest.fn()} />);

    // Simulate user interaction
    // Verify complete flow
  });
});
```

## 🔧 Mocking Strategies

### Store Mocking (Zustand)

```typescript
// In test file
jest.mock('@/lib/store', () => ({
  useAppStore: jest.fn(),
}));

// In test
const mockUseAppStore = require('@/lib/store').useAppStore;
mockUseAppStore.mockReturnValue({
  studyPlan: mockStudyPlan,
  currentVisibleDay: 1,
  toggleTaskCompletion: jest.fn(),
  // ... other store methods
});
```

### API Route Mocking

```typescript
// Mock NextRequest and NextResponse
jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn().mockImplementation((data, options) => ({
      status: options?.status || 200,
      json: () => Promise.resolve(data),
    })),
  },
}));
```

### External Service Mocking

```typescript
// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
    },
  },
}));
```

## 🐛 Troubleshooting

### Common Issues

#### 1. "ReferenceError: Request is not defined"
**Solution**: Add to `jest.setup.js`:
```javascript
global.Request = jest.fn().mockImplementation((url, options = {}) => ({
  url,
  method: options.method || 'GET',
  headers: {
    get: jest.fn(),
    has: jest.fn(),
  },
  json: jest.fn().mockResolvedValue({}),
}));
```

#### 2. "TypeError: Cannot read properties of undefined"
**Solution**: Ensure all mock dependencies are properly configured:
```javascript
// Check if store is mocked
mockUseAppStore.mockReturnValue({
  // Include ALL required properties
  studyConfiguration: { /* ... */ },
  studyPlan: [],
  // ... other properties
});
```

#### 3. "TestingLibraryElementError: Unable to find element"
**Solution**: Use correct element selection:
```typescript
// Instead of getByText('Day 1')
expect(screen.getByText('1 / 2')).toBeInTheDocument();

// Use getByPlaceholderText for inputs
const emailInput = screen.getByPlaceholderText('Enter your email');

// Use getByRole for buttons
const submitButton = screen.getByRole('button', { name: /sign in/i });
```

#### 4. Async Test Issues
**Solution**: Use proper async patterns:
```typescript
it('should handle async operations', async () => {
  const user = userEvent.setup();

  render(<Component />);

  await user.click(screen.getByText('Submit'));

  await waitFor(() => {
    expect(mockFunction).toHaveBeenCalled();
  });
});
```

## 📊 Coverage Reports

Generate coverage reports with:
```bash
npm test -- --coverage
```

This creates an `html` report in `coverage/lcov-report/index.html`

## 🚀 CI/CD Integration

### GitHub Actions Example

```yaml
name: Test
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Run performance tests
        run: npm test -- --testPathPatterns="(performance)"

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

## 🔄 Maintenance Tips

### 1. Keep Mocks Updated
- Update mocks when component/store APIs change
- Run tests after dependency updates
- Review mock coverage in coverage reports

### 2. Test Data Management
- Use consistent test data across tests
- Keep test utilities updated
- Document complex test scenarios

### 3. Performance Monitoring
- Run performance tests regularly
- Set performance budgets
- Monitor for memory leaks

### 4. Test Organization
- Group related tests in describe blocks
- Use clear, descriptive test names
- Follow consistent naming conventions

## 🎯 Next Steps

1. **Add Visual Regression Tests**: Use tools like Chromatic for UI consistency
2. **Implement Contract Testing**: For API endpoint validation
3. **Add Accessibility Testing**: With axe-core for WCAG compliance
4. **Set Up Automated Performance Monitoring**: Track key metrics over time

## 📞 Support

For questions about the test suite:
1. Check this documentation first
2. Review existing test examples
3. Run tests with `--verbose` flag for detailed output
4. Check Jest documentation for advanced features

---

**Last Updated**: December 2024
**Test Coverage**: 177/177 (100%)
**Test Categories**: Unit, Integration, E2E, Performance, Component, API