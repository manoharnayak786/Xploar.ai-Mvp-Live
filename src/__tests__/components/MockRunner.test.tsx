import { render, screen } from '@testing-library/react';
import { MockRunner } from '@/components/features/mock-tests/MockRunner';

// Mock the store
jest.mock('@/lib/store', () => ({
  useAppStore: jest.fn(() => ({
    saveMockTest: jest.fn(),
  })),
}));

// Mock the data imports
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
}));

describe('MockRunner Component', () => {
  const mockOnComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render mock test interface correctly', () => {
      render(
        <MockRunner
          topicId="topic_1"
          useNegativeMarking={true}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.getByText('General Knowledge')).toBeInTheDocument();
      expect(screen.getByText('Question 1 of 2')).toBeInTheDocument();
    });

    it('should show timer', () => {
      render(
        <MockRunner
          topicId="topic_1"
          useNegativeMarking={true}
          onComplete={mockOnComplete}
        />
      );

      // Timer should be displayed (exact format may vary)
      const timerElement = screen.getByText(/^\d+:\d+$/);
      expect(timerElement).toBeInTheDocument();
    });

    it('should show submit test button', () => {
      render(
        <MockRunner
          topicId="topic_1"
          useNegativeMarking={true}
          onComplete={mockOnComplete}
        />
      );

      const submitButtons = screen.getAllByText('Submit Test');
      expect(submitButtons.length).toBeGreaterThan(0);
    });

    it('should show navigation buttons', () => {
      render(
        <MockRunner
          topicId="topic_1"
          useNegativeMarking={true}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.getByText('Next')).toBeInTheDocument();
      expect(screen.getByText('Previous')).toBeInTheDocument();
    });

    it('should show progress information', () => {
      render(
        <MockRunner
          topicId="topic_1"
          useNegativeMarking={true}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.getByText(/Progress: \d+%/)).toBeInTheDocument();
      expect(screen.getByText(/Answered: \d+\/\d+/)).toBeInTheDocument();
    });

    it('should show question navigator', () => {
      render(
        <MockRunner
          topicId="topic_1"
          useNegativeMarking={true}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.getByText('Question Navigator')).toBeInTheDocument();
      expect(screen.getByText('Click on any question to jump to it')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('should show question content', () => {
      render(
        <MockRunner
          topicId="topic_1"
          useNegativeMarking={true}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.getByText('Question 1')).toBeInTheDocument();
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
          onComplete={mockOnComplete}
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

    it('should handle different topic IDs', () => {
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
          onComplete={mockOnComplete}
        />
      );

      expect(screen.getByText('History')).toBeInTheDocument();
    });
  });

  describe('Configuration', () => {
    it('should handle negative marking enabled', () => {
      render(
        <MockRunner
          topicId="topic_1"
          useNegativeMarking={true}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.getByText('General Knowledge')).toBeInTheDocument();
    });

    it('should handle negative marking disabled', () => {
      render(
        <MockRunner
          topicId="topic_1"
          useNegativeMarking={false}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.getByText('General Knowledge')).toBeInTheDocument();
    });
  });
});