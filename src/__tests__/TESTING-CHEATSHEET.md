# 🧪 Testing Cheat Sheet

## Quick Reference for Common Testing Scenarios

### 🎯 Most Common Commands

```bash
# Run all tests
npm test

# Run specific test file
npm test -- src/__tests__/components/AuthScreen.test.tsx

# Run by category
npm test -- --testPathPatterns="(integration)"
npm test -- --testPathPatterns="(performance)"
npm test -- --testPathPatterns="(utils)"

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm run test:watch
```

### 🔧 Component Testing Patterns

#### Basic Component Test
```typescript
import { render, screen } from '@testing-library/react';
import { AuthScreen } from '@/components/features/onboarding/AuthScreen';

describe('AuthScreen', () => {
  it('should render login form', () => {
    render(<AuthScreen onAuthSuccess={jest.fn()} />);

    expect(screen.getByText('Welcome Back!')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
  });
});
```

#### Component with User Interaction
```typescript
import userEvent from '@testing-library/user-event';

it('should handle form submission', async () => {
  const mockOnAuthSuccess = jest.fn();
  const user = userEvent.setup();

  render(<AuthScreen onAuthSuccess={mockOnAuthSuccess} />);

  // Fill form
  await user.type(screen.getByPlaceholderText('Enter your email'), 'test@example.com');
  await user.type(screen.getByPlaceholderText('Enter your password'), 'password123');

  // Submit form
  await user.click(screen.getByText('Sign In'));

  // Verify behavior
  expect(mockOnAuthSuccess).toHaveBeenCalled();
});
```

### 🔄 Store/State Testing

#### Mock Zustand Store
```typescript
// In test file
jest.mock('@/lib/store', () => ({
  useAppStore: jest.fn(),
}));

// In test
const mockUseAppStore = require('@/lib/store').useAppStore;

mockUseAppStore.mockReturnValue({
  studyPlan: [],
  currentVisibleDay: 1,
  toggleTaskCompletion: jest.fn(),
  studyConfiguration: {
    goal: 'UPSC Preparation',
    startDate: '2024-01-01',
    durationDays: 30,
    hoursPerDay: 3,
  },
});
```

### 🛠️ Mocking External Dependencies

#### Mock Supabase
```typescript
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn().mockResolvedValue({
        data: { user: { id: '123', email: 'test@example.com' } },
        error: null,
      }),
    },
  },
}));
```

#### Mock Next.js Router
```typescript
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));
```

### 📊 Element Selection Best Practices

#### DOs ✅
```typescript
// Use semantic queries
screen.getByRole('button', { name: /sign in/i })
screen.getByPlaceholderText('Enter your email')
screen.getByText('Welcome Back!')

// Use getAllBy* for multiple elements
screen.getAllByText('Task')[0]

// Use findBy* for async elements
await screen.findByText('Loading...')
```

#### DON'Ts ❌
```typescript
// Avoid fragile queries
screen.getByTestId('submit-button') // Only if no better alternative

// Avoid implementation details
container.querySelector('.btn-primary')
```

### ⏱️ Async Testing Patterns

#### Wait for Element
```typescript
import { waitFor } from '@testing-library/react';

await waitFor(() => {
  expect(screen.getByText('Success!')).toBeInTheDocument();
});
```

#### Wait for Function Call
```typescript
await waitFor(() => {
  expect(mockFunction).toHaveBeenCalledWith(expectedArgs);
});
```

### 🔍 Debugging Tests

#### Debug Element Queries
```typescript
// See all available elements
screen.debug();

// See specific element
const element = screen.getByText('Button');
screen.debug(element);
```

#### Log Test Execution
```typescript
it('should do something', () => {
  console.log('Test started');

  // Your test code

  console.log('Test completed');
});
```

### 📈 Performance Testing

#### Measure Render Time
```typescript
const measureRenderTime = async (component: React.ReactElement) => {
  const startTime = performance.now();

  render(component);

  const endTime = performance.now();
  return endTime - startTime;
};

it('should render quickly', async () => {
  const renderTime = await measureRenderTime(<MyComponent />);

  expect(renderTime).toBeLessThan(50); // Under 50ms
});
```

### 🐛 Common Issues & Fixes

#### Issue: "ReferenceError: Request is not defined"
```javascript
// Add to jest.setup.js
global.Request = jest.fn().mockImplementation((url, options = {}) => ({
  url,
  method: options.method || 'GET',
  headers: { get: jest.fn(), has: jest.fn() },
  json: jest.fn().mockResolvedValue({}),
}));
```

#### Issue: "Cannot read properties of undefined"
```typescript
// Ensure complete mock setup
mockUseAppStore.mockReturnValue({
  // Include ALL required properties
  studyConfiguration: { goal: 'Test', startDate: '2024-01-01' },
  studyPlan: [],
  currentVisibleDay: 1,
  // ... all other properties
});
```

#### Issue: Async test timeout
```typescript
it('should handle async operation', async () => {
  // Increase timeout if needed
  jest.setTimeout(10000);

  // Use proper async patterns
  await user.click(button);
  await waitFor(() => expect(result).toBeInTheDocument());
});
```

### 📋 Test Organization

#### File Naming Convention
```
componentName.test.tsx     # Component tests
utilityName.test.ts        # Utility tests
feature-flow.test.tsx      # Integration tests
complete-flow.test.tsx     # E2E tests
performance.test.tsx       # Performance tests
```

#### Test Structure
```typescript
describe('ComponentName', () => {
  describe('Basic Rendering', () => {
    it('should render correctly', () => { /* ... */ });
  });

  describe('User Interactions', () => {
    it('should handle clicks', () => { /* ... */ });
  });

  describe('Error States', () => {
    it('should handle errors gracefully', () => { /* ... */ });
  });
});
```

### 🚀 CI/CD Integration

#### GitHub Actions
```yaml
- name: Run tests
  run: npm test

- name: Run performance tests
  run: npm test -- --testPathPatterns="(performance)"

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage/lcov.info
```

### 📊 Coverage Goals

- **Unit Tests**: 90%+ coverage
- **Integration Tests**: 80%+ coverage
- **Component Tests**: 85%+ coverage
- **Overall**: 80%+ coverage

### 🎯 Next Steps

1. **For New Features**: Write tests first (TDD)
2. **For Bug Fixes**: Write test that reproduces the bug
3. **For Refactoring**: Ensure all tests still pass
4. **For Performance**: Add performance tests for critical paths

---

**Need Help?** Check the [Complete Testing Guide](TESTING-README.md) for detailed documentation.
