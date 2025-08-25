import { calculateMockScore, calculateAccuracy, getPerformanceLevel } from '@/lib/utils/scoreCalculator';
import { Question } from '@/lib/types';

// Mock questions for testing
const mockQuestions: Question[] = [
  {
    id: '1',
    question: 'What is the capital of India?',
    options: ['Delhi', 'Mumbai', 'Kolkata', 'Chennai'],
    ans: 0,
    explanation: 'Delhi is the capital of India',
    topic: 'Geography',
  },
  {
    id: '2',
    question: 'Who is the first Prime Minister of India?',
    options: ['Jawaharlal Nehru', 'Mahatma Gandhi', 'Sardar Patel', 'Dr. Rajendra Prasad'],
    ans: 0,
    explanation: 'Jawaharlal Nehru was the first Prime Minister of India',
    topic: 'History',
  },
  {
    id: '3',
    question: 'What is 2 + 2?',
    options: ['3', '4', '5', '6'],
    ans: 1,
    explanation: '2 + 2 equals 4',
    topic: 'Mathematics',
  },
];

describe('Score Calculator Utils', () => {
  describe('calculateMockScore', () => {
    it('should calculate correct score for all correct answers without negative marking', () => {
      const userAnswers = { '0': 0, '1': 0, '2': 1 };
      const score = calculateMockScore(mockQuestions, userAnswers, false);
      expect(score).toBe(3);
    });

    it('should calculate correct score for all correct answers with negative marking', () => {
      const userAnswers = { '0': 0, '1': 0, '2': 1 };
      const score = calculateMockScore(mockQuestions, userAnswers, true);
      expect(score).toBe(3);
    });

    it('should apply negative marking for wrong answers', () => {
      const userAnswers = { '0': 0, '1': 1, '2': 2 }; // 1 correct, 2 wrong
      const score = calculateMockScore(mockQuestions, userAnswers, true);
      expect(score).toBe(0.34); // 1 - 0.33 - 0.33 = 0.34
    });

    it('should not deduct points for unattempted questions', () => {
      const userAnswers = { '0': 0 }; // Only first question attempted and correct
      const score = calculateMockScore(mockQuestions, userAnswers, true);
      expect(score).toBe(1);
    });

    it('should handle empty answers object', () => {
      const userAnswers = {};
      const score = calculateMockScore(mockQuestions, userAnswers, true);
      expect(score).toBe(0);
    });

    it('should handle partial correct answers with negative marking', () => {
      const userAnswers = { '0': 0, '1': 1, '2': 1 }; // 2 correct, 1 wrong
      const score = calculateMockScore(mockQuestions, userAnswers, true);
      expect(score).toBe(1.67); // 1 + 1 - 0.33 = 1.67
    });

    it('should round score to 2 decimal places', () => {
      const userAnswers = { '0': 0, '1': 0, '2': 1 };
      const score = calculateMockScore(mockQuestions, userAnswers, true);
      expect(score).toBe(3);
    });
  });

  describe('calculateAccuracy', () => {
    it('should calculate accuracy correctly', () => {
      expect(calculateAccuracy(8, 10)).toBe(80);
      expect(calculateAccuracy(5, 10)).toBe(50);
      expect(calculateAccuracy(3, 10)).toBe(30);
    });

    it('should return 0 when total is 0', () => {
      expect(calculateAccuracy(5, 0)).toBe(0);
    });

    it('should round to nearest integer', () => {
      expect(calculateAccuracy(7, 10)).toBe(70);
      expect(calculateAccuracy(1, 3)).toBe(33);
    });
  });

  describe('getPerformanceLevel', () => {
    it('should return "Excellent" for accuracy >= 80', () => {
      expect(getPerformanceLevel(80)).toBe('Excellent');
      expect(getPerformanceLevel(95)).toBe('Excellent');
      expect(getPerformanceLevel(100)).toBe('Excellent');
    });

    it('should return "Good" for accuracy >= 65 and < 80', () => {
      expect(getPerformanceLevel(65)).toBe('Good');
      expect(getPerformanceLevel(75)).toBe('Good');
      expect(getPerformanceLevel(79)).toBe('Good');
    });

    it('should return "Average" for accuracy >= 50 and < 65', () => {
      expect(getPerformanceLevel(50)).toBe('Average');
      expect(getPerformanceLevel(60)).toBe('Average');
      expect(getPerformanceLevel(64)).toBe('Average');
    });

    it('should return "Needs Improvement" for accuracy < 50', () => {
      expect(getPerformanceLevel(49)).toBe('Needs Improvement');
      expect(getPerformanceLevel(30)).toBe('Needs Improvement');
      expect(getPerformanceLevel(0)).toBe('Needs Improvement');
    });
  });
});
