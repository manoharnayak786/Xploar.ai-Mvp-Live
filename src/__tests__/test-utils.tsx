import React, { ReactElement } from 'react';
import { render, RenderOptions, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock providers and utilities for testing

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Mock data generators
export const createMockUser = (overrides = {}) => ({
  id: 'user_123',
  email: 'test@example.com',
  name: 'Test User',
  ...overrides,
});

export const createMockStudyPlan = (overrides = {}) => ({
  day: 1,
  date: '2024-01-01',
  tasks: [
    {
      id: 'task_1',
      topicId: 'topic_1',
      kind: 'Read' as const,
      durationMins: 60,
      isDone: false,
    },
    {
      id: 'task_2',
      topicId: 'topic_1',
      kind: 'Practice' as const,
      durationMins: 45,
      isDone: false,
    },
  ],
  ...overrides,
});

export const createMockQuestions = (count = 5) => {
  return Array.from({ length: count }, (_, index) => ({
    id: `q${index + 1}`,
    question: `Question ${index + 1}?`,
    options: ['A', 'B', 'C', 'D'],
    ans: 0,
    explanation: `Explanation for question ${index + 1}`,
    topic: 'Test Topic',
  }));
};

export const createMockMockTestResult = (overrides = {}) => ({
  id: 'mock_123',
  date: '2024-01-01',
  topicId: 'topic_1',
  score: 75,
  totalQuestions: 10,
  timeTakenMins: 90,
  usesNegativeMarking: true,
  ...overrides,
});

// Mock API responses
export const mockApiResponse = {
  success: (data: unknown) => ({
    ok: true,
    status: 200,
    json: () => Promise.resolve(data),
  }),
  error: (message: string, status = 400) => ({
    ok: false,
    status,
    json: () => Promise.resolve({ error: message }),
  }),
};

// Test helpers
export const waitForNextTick = () => new Promise(resolve => setTimeout(resolve, 0));

export const createMockEvent = (type: string, data: Record<string, unknown> = {}) => ({
  type,
  ...data,
});

export const mockLocalStorage = () => {
  const store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
  };
};

// Common test patterns
export const fillForm = async (getByLabelText: typeof screen.getByLabelText, user: ReturnType<typeof userEvent.setup>, fields: Record<string, string>) => {
  for (const [label, value] of Object.entries(fields)) {
    const input = getByLabelText(label);
    await user.clear(input);
    await user.type(input, value);
  }
};

export const clickButton = async (getByText: typeof screen.getByText, user: ReturnType<typeof userEvent.setup>, buttonText: string) => {
  const button = getByText(buttonText);
  await user.click(button);
  return button;
};

export const expectElementToBeVisible = (getByText: typeof screen.getByText, text: string) => {
  expect(getByText(text)).toBeInTheDocument();
};

export const expectElementNotToBeVisible = (queryByText: typeof screen.queryByText, text: string) => {
  expect(queryByText(text)).not.toBeInTheDocument();
};

export { customRender as render };
export { screen, waitFor, fireEvent, userEvent } from '@testing-library/react';

// Test utilities tests
describe('Test Utilities', () => {
  it('should create mock user correctly', () => {
    const user = createMockUser({ email: 'test@example.com' });
    expect(user.email).toBe('test@example.com');
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('name');
  });

  it('should create mock study plan correctly', () => {
    const plan = createMockStudyPlan({ day: 1 });
    expect(plan.day).toBe(1);
    expect(plan).toHaveProperty('date');
    expect(plan).toHaveProperty('tasks');
    expect(Array.isArray(plan.tasks)).toBe(true);
  });

  it('should create mock questions correctly', () => {
    const questions = createMockQuestions(3);
    expect(questions).toHaveLength(3);
    expect(questions[0]).toHaveProperty('id');
    expect(questions[0]).toHaveProperty('question');
    expect(questions[0]).toHaveProperty('options');
    expect(questions[0]).toHaveProperty('ans');
  });
});
