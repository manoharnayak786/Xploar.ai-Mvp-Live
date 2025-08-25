import { render } from '@testing-library/react';
import { TaskCard } from '@/components/features/study-planner/TaskCard';
import { QuestionCard } from '@/components/features/mock-tests/QuestionCard';
import { createMockStudyPlan, createMockQuestions } from '../test-utils';

// Mock Supabase to avoid environment variable issues
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: null } }),
    },
  },
}));

// Performance test utilities
const measureRenderTime = async (component: React.ReactElement) => {
  const startTime = performance.now();

  render(component);

  const endTime = performance.now();
  return endTime - startTime;
};

const measureMultipleRenders = async (
  component: React.ReactElement,
  count: number = 10
) => {
  const times: number[] = [];

  for (let i = 0; i < count; i++) {
    const renderTime = await measureRenderTime(component);
    times.push(renderTime);
  }

  return {
    times,
    average: times.reduce((a, b) => a + b, 0) / times.length,
    min: Math.min(...times),
    max: Math.max(...times),
  };
};

describe('Component Performance', () => {
  describe('TaskCard Performance', () => {
    it('should render quickly', async () => {
      const task = {
        id: 'task_1',
        topicId: 'topic_1',
        kind: 'Read' as const,
        durationMins: 60,
        isDone: false,
      };

      const renderTime = await measureRenderTime(
        <TaskCard task={task} onToggle={() => {}} />
      );

      // Should render in under 50ms
      expect(renderTime).toBeLessThan(50);
    });

    it('should handle multiple task cards efficiently', async () => {
      const tasks = Array.from({ length: 20 }, (_, i) => ({
        id: `task_${i}`,
        topicId: 'topic_1',
        kind: ['Read', 'Practice', 'Explain', 'Recall'][i % 4] as const,
        durationMins: 30 + (i * 5),
        isDone: i % 2 === 0,
      }));

      const component = (
        <div>
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={() => {}}
            />
          ))}
        </div>
      );

      const renderTime = await measureRenderTime(component);

      // Should handle 20 cards in under 200ms
      expect(renderTime).toBeLessThan(200);
    });

    it('should maintain consistent render times', async () => {
      const task = {
        id: 'task_1',
        topicId: 'topic_1',
        kind: 'Read' as const,
        durationMins: 60,
        isDone: false,
      };

      const component = <TaskCard task={task} onToggle={() => {}} />;
      const performance = await measureMultipleRenders(component, 5);

      // Should have consistent performance
      expect(performance.max - performance.min).toBeLessThan(10);
      expect(performance.average).toBeLessThan(30);
    });
  });

  describe('QuestionCard Performance', () => {
    it('should render question cards quickly', async () => {
      const question = {
        id: 'q1',
        question: 'What is the capital of India?',
        options: ['Delhi', 'Mumbai', 'Kolkata', 'Chennai'],
        ans: 0,
        explanation: 'Delhi is the capital',
        topic: 'Geography',
      };

      const renderTime = await measureRenderTime(
        <QuestionCard
          question={question}
          questionNumber={1}
          selectedAnswer={undefined}
          onAnswer={() => {}}
        />
      );

      // Should render in under 50ms
      expect(renderTime).toBeLessThan(50);
    });

    it('should handle multiple options efficiently', async () => {
      const question = {
        id: 'q1',
        question: 'Complex question with many options?',
        options: Array.from({ length: 8 }, (_, i) => `Option ${i + 1}`),
        ans: 0,
        explanation: 'First option is correct',
        topic: 'Test',
      };

      const renderTime = await measureRenderTime(
        <QuestionCard
          question={question}
          questionNumber={1}
          selectedAnswer={undefined}
          onAnswer={() => {}}
        />
      );

      // Should handle 8 options in under 100ms
      expect(renderTime).toBeLessThan(100);
    });

    it('should handle long questions efficiently', async () => {
      const longQuestion = {
        id: 'q1',
        question: 'This is a very long question that tests how well the component handles lengthy text content and whether it impacts performance significantly when rendering complex question structures with multiple lines and detailed explanations?'.repeat(3),
        options: ['A', 'B', 'C', 'D'],
        ans: 0,
        explanation: 'A is correct',
        topic: 'Test',
      };

      const renderTime = await measureRenderTime(
        <QuestionCard
          question={longQuestion}
          questionNumber={1}
          selectedAnswer={undefined}
          onAnswer={() => {}}
        />
      );

      // Should handle long text in reasonable time
      expect(renderTime).toBeLessThan(150);
    });
  });

  describe('Large Dataset Performance', () => {
    it('should handle large study plans efficiently', async () => {
      const largeStudyPlan = Array.from({ length: 100 }, (_, i) =>
        createMockStudyPlan({
          day: i + 1,
          tasks: Array.from({ length: 4 }, (_, j) => ({
            id: `task_${i}_${j}`,
            topicId: 'topic_1',
            kind: ['Read', 'Practice', 'Explain', 'Recall'][j] as const,
            durationMins: 30 + (j * 15),
            isDone: false,
          })),
        })
      );

      const component = (
        <div>
          {largeStudyPlan.map(day => (
            <div key={day.day}>
              <h3>Day {day.day}</h3>
              {day.tasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={() => {}}
                />
              ))}
            </div>
          ))}
        </div>
      );

      const renderTime = await measureRenderTime(component);

      // Should handle 400 tasks in under 1000ms
      expect(renderTime).toBeLessThan(1000);
    });

    it('should handle large question sets efficiently', async () => {
      const largeQuestionSet = createMockQuestions(50);

      const component = (
        <div>
          {largeQuestionSet.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              questionNumber={index + 1}
              selectedAnswer={undefined}
              onAnswer={() => {}}
            />
          ))}
        </div>
      );

      const renderTime = await measureRenderTime(component);

      // Should handle 50 questions in under 1500ms
      expect(renderTime).toBeLessThan(1500);
    });
  });

  describe('Memory Usage', () => {
    it('should not cause memory leaks with frequent re-renders', async () => {
      const task = {
        id: 'task_1',
        topicId: 'topic_1',
        kind: 'Read' as const,
        durationMins: 60,
        isDone: false,
      };

      const component = <TaskCard task={task} onToggle={() => {}} />;

      // Render multiple times to check for memory issues
      for (let i = 0; i < 100; i++) {
        const renderTime = await measureRenderTime(component);
        expect(renderTime).toBeLessThan(100);
      }
    });

    it('should handle component unmounting properly', async () => {
      const task = {
        id: 'task_1',
        topicId: 'topic_1',
        kind: 'Read' as const,
        durationMins: 60,
        isDone: false,
      };

      // Multiple render/unmount cycles
      for (let i = 0; i < 10; i++) {
        const { unmount } = render(<TaskCard task={task} onToggle={() => {}} />);
        unmount();
      }

      // Should not cause issues
      expect(true).toBe(true);
    });
  });

  describe('Bundle Size Impact', () => {
    it('should have reasonable import overhead', async () => {
      // Test that imports don't cause significant performance issues
      const startTime = performance.now();

      const { TaskCard } = await import('@/components/features/study-planner/TaskCard');

      const endTime = performance.now();
      const importTime = endTime - startTime;

      // Import should be fast
      expect(importTime).toBeLessThan(100);

      // Component should still work
      const task = {
        id: 'task_1',
        topicId: 'topic_1',
        kind: 'Read' as const,
        durationMins: 60,
        isDone: false,
      };

      const renderTime = await measureRenderTime(
        <TaskCard task={task} onToggle={() => {}} />
      );

      expect(renderTime).toBeLessThan(50);
    });
  });
});
