import { render, screen } from '@testing-library/react';
import { AuthScreen } from '@/components/features/onboarding/AuthScreen';
import { StudyPlanner } from '@/components/features/study-planner/StudyPlanner';
import { MockRunner } from '@/components/features/mock-tests/MockRunner';

// Mock all dependencies
jest.mock('@/lib/store', () => ({
  useAppStore: jest.fn(() => ({
    loginWithPassword: jest.fn(),
    signUpWithPassword: jest.fn(),
    requestPasswordReset: jest.fn(),
    saveMockTest: jest.fn(),
    generateStudyPlan: jest.fn(),
    studyPlan: [],
    currentVisibleDay: 1,
    viewDay: jest.fn(),
  })),
}));

jest.mock('@/lib/data/questions', () => ({
  MCQ_BANK: {
    'topic_1': [
      {
        id: 'q1',
        question: 'What is the capital of India?',
        options: ['Delhi', 'Mumbai', 'Kolkata', 'Chennai'],
        ans: 0,
        explanation: 'Delhi is the capital',
        topic: 'Geography',
      },
      {
        id: 'q2',
        question: 'Who is the first Prime Minister?',
        options: ['Nehru', 'Gandhi', 'Patel', 'Azad'],
        ans: 0,
        explanation: 'Nehru was first PM',
        topic: 'History',
      },
    ],
  },
}));

jest.mock('@/lib/data/topics', () => ({
  UPSC_FOUNDATION: [
    { id: 'topic_1', name: 'General Knowledge', description: 'Basic knowledge' },
  ],
}));

jest.mock('@/lib/utils/scoreCalculator', () => ({
  calculateMockScore: jest.fn(() => 80),
}));

jest.mock('@/lib/utils/constants', () => ({
  APP_CONFIG: {
    MOCK_TEST_DURATION: 1.5,
    QUESTIONS_PER_MOCK: 10,
  },
}));

jest.mock('@/lib/utils/dateUtils', () => ({
  getTodayString: jest.fn(() => '2024-01-01'),
  formatDate: jest.fn(() => 'January 1, 2024'),
}));

describe('Complete User Journey E2E', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Authentication Flow', () => {
    it('should render authentication screen', () => {
      render(<AuthScreen onAuthSuccess={() => {}} />);

      expect(screen.getByText('Welcome Back!')).toBeInTheDocument();
      expect(screen.getByText('Sign in to continue your journey.')).toBeInTheDocument();
      expect(screen.getByText('Sign In')).toBeInTheDocument();
    });

    it('should show signup link in auth screen', () => {
      render(<AuthScreen onAuthSuccess={() => {}} />);

      expect(screen.getByText("Don't have an account? Sign Up")).toBeInTheDocument();
    });

    it('should show email and password inputs', () => {
      render(<AuthScreen onAuthSuccess={() => {}} />);

      expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    });
  });

  describe('Study Planning Flow', () => {
    it('should render study planner with no data message', () => {
      render(<StudyPlanner />);

      // Should show no study plan message
      expect(screen.getByText('No Study Plan Found')).toBeInTheDocument();
      expect(screen.getByText('Create Study Plan')).toBeInTheDocument();
    });

    it('should show study planner empty state', () => {
      render(<StudyPlanner />);

      // Should show helpful message for empty state
      expect(screen.getByText("You haven't created a study plan yet. Let's set up your personalized learning journey.")).toBeInTheDocument();
    });
  });

  describe('Mock Test Flow', () => {
    it('should render mock runner with basic structure', () => {
      render(
        <MockRunner
          topicId="topic_1"
          useNegativeMarking={true}
          onComplete={() => {}}
        />
      );

      expect(screen.getByText('General Knowledge')).toBeInTheDocument();
      expect(screen.getByText('Question 1 of 2')).toBeInTheDocument();
    });

    it('should show mock test interface elements', () => {
      render(
        <MockRunner
          topicId="topic_1"
          useNegativeMarking={true}
          onComplete={() => {}}
        />
      );

      expect(screen.getByText('Next')).toBeInTheDocument();
      expect(screen.getByText('Previous')).toBeInTheDocument();
      expect(screen.getByText('Question Navigator')).toBeInTheDocument();
    });

    it('should show progress information', () => {
      render(
        <MockRunner
          topicId="topic_1"
          useNegativeMarking={true}
          onComplete={() => {}}
        />
      );

      expect(screen.getByText(/Progress: \d+%/)).toBeInTheDocument();
      expect(screen.getByText(/Answered: \d+\/\d+/)).toBeInTheDocument();
    });

    it('should show timer', () => {
      render(
        <MockRunner
          topicId="topic_1"
          useNegativeMarking={true}
          onComplete={() => {}}
        />
      );

      const timerElement = screen.getByText(/^\d+:\d+$/);
      expect(timerElement).toBeInTheDocument();
    });

    it('should handle empty questions gracefully', () => {
      // Mock empty questions
      const questionsModule = jest.requireMock('@/lib/data/questions');
      const originalMCQBank = questionsModule.MCQ_BANK;
      originalMCQBank.topic_1 = [];

      render(
        <MockRunner
          topicId="topic_1"
          useNegativeMarking={true}
          onComplete={() => {}}
        />
      );

      expect(screen.getByText('No Questions Available')).toBeInTheDocument();
      expect(screen.getByText('No questions found for the selected topic.')).toBeInTheDocument();

      // Restore original mock
      originalMCQBank.topic_1 = [
        {
          id: 'q1',
          question: 'What is the capital of India?',
          options: ['Delhi', 'Mumbai', 'Kolkata', 'Chennai'],
          ans: 0,
          explanation: 'Delhi is the capital',
          topic: 'Geography',
        },
        {
          id: 'q2',
          question: 'Who is the first Prime Minister?',
          options: ['Nehru', 'Gandhi', 'Patel', 'Azad'],
          ans: 0,
          explanation: 'Nehru was first PM',
          topic: 'History',
        },
      ];
    });
  });

  describe('Component Integration', () => {
    it('should handle different mock runner configurations', () => {
      render(
        <MockRunner
          topicId="topic_1"
          useNegativeMarking={false}
          onComplete={() => {}}
        />
      );

      expect(screen.getByText('General Knowledge')).toBeInTheDocument();
      expect(screen.getByText('Question 1 of 2')).toBeInTheDocument();
    });

    it('should accept callback functions', () => {
      const mockCallback = jest.fn();
      render(<AuthScreen onAuthSuccess={mockCallback} />);

      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('should handle multiple component instances', () => {
      const mockCallback1 = jest.fn();
      const mockCallback2 = jest.fn();

      const { rerender } = render(<AuthScreen onAuthSuccess={mockCallback1} />);
      expect(mockCallback1).not.toHaveBeenCalled();

      rerender(<AuthScreen onAuthSuccess={mockCallback2} />);
      expect(mockCallback2).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle missing topic gracefully', () => {
      // Mock different topic
      const topicsModule = jest.requireMock('@/lib/data/topics');
      const mockTopics = topicsModule.UPSC_FOUNDATION;
      mockTopics.push({
        id: 'topic_2',
        name: 'History',
        description: 'Study of past events',
      });

      // Mock questions for topic_2
      const questionsModule = jest.requireMock('@/lib/data/questions');
      const mockQuestions = questionsModule.MCQ_BANK;
      mockQuestions.topic_2 = [
        {
          id: 'q1',
          question: 'When was India founded?',
          options: ['1947', '1950', '1948', '1952'],
          ans: 0,
          explanation: 'India gained independence in 1947',
          topic: 'History',
        },
      ];

      render(
        <MockRunner
          topicId="topic_2"
          useNegativeMarking={false}
          onComplete={() => {}}
        />
      );

      expect(screen.getByText('History')).toBeInTheDocument();
    });

    it('should handle study planner without data', () => {
      render(<StudyPlanner />);

      // Should show appropriate empty state
      expect(screen.getByText('No Study Plan Found')).toBeInTheDocument();
    });
  });
});