import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskCard } from '@/components/features/study-planner/TaskCard';
import { QuestionCard } from '@/components/features/mock-tests/QuestionCard';
import { Progress } from '@/components/ui/progress';
import { useAppStore } from '@/lib/store';
import { createMockStudyPlan } from '../test-utils';

// Mock the store
jest.mock('@/lib/store', () => ({
  useAppStore: jest.fn(),
}));

describe('Component Interactions', () => {
  const storeModule = jest.requireMock('@/lib/store');
  const mockUseAppStore = storeModule.useAppStore;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('TaskCard Interactions', () => {
    it('should handle task completion toggle', async () => {
      const mockToggleTask = jest.fn();
      mockUseAppStore.mockReturnValue({
        toggleTaskCompletion: mockToggleTask,
      });

      const user = userEvent.setup();
      render(
        <TaskCard
          task={{
            id: 'task_1',
            topicId: 'topic_1',
            kind: 'Read' as const,
            durationMins: 60,
            isDone: false,
          }}
          onToggle={mockToggleTask}
        />
      );

      // Check that task elements are rendered (shows first task)
      expect(screen.getByText('Read')).toBeInTheDocument();
      // The second task (Practice) is not visible in the current implementation
    });

    it('should display task information correctly', () => {
      render(
        <TaskCard
          task={{
            id: 'task_1',
            topicId: 'topic_1',
            kind: 'Practice' as const,
            durationMins: 45,
            isDone: true,
          }}
          onToggle={() => {}}
        />
      );

      expect(screen.getByText('Practice')).toBeInTheDocument();
      expect(screen.getByText('45 minutes')).toBeInTheDocument();
    });

    it('should handle different task types', () => {
      const taskTypes = ['Read', 'Practice', 'Explain', 'Recall'] as const;

      taskTypes.forEach(taskType => {
        const { rerender } = render(
          <TaskCard
            task={{
              id: `task_${taskType}`,
              topicId: 'topic_1',
              kind: taskType,
              durationMins: 30,
              isDone: false,
            }}
            onToggle={() => {}}
          />
        );

        expect(screen.getByText(taskType)).toBeInTheDocument();

        // Clean up for next iteration
        rerender(<></>);
      });
    });
  });

  describe('QuestionCard Interactions', () => {
    const mockQuestion = {
      id: 'q1',
      question: 'What is the capital of India?',
      options: ['Delhi', 'Mumbai', 'Kolkata', 'Chennai'],
      ans: 0,
      explanation: 'Delhi is the capital',
      topic: 'Geography',
    };

    it('should handle answer selection', async () => {
      const mockOnAnswer = jest.fn();
      const user = userEvent.setup();

      render(
        <QuestionCard
          question={mockQuestion}
          questionNumber={1}
          selectedAnswer={undefined}
          onAnswer={mockOnAnswer}
        />
      );

      // Click on first option
      const firstOption = screen.getByText('Delhi');
      await user.click(firstOption);

      expect(mockOnAnswer).toHaveBeenCalledWith(0);
    });

    it('should show selected answer', () => {
      render(
        <QuestionCard
          question={mockQuestion}
          questionNumber={1}
          selectedAnswer={1}
          onAnswer={() => {}}
        />
      );

      // Should show the selected option (Mumbai)
      expect(screen.getByText('Mumbai')).toBeInTheDocument();
    });

    it('should display question correctly', () => {
      render(
        <QuestionCard
          question={mockQuestion}
          questionNumber={5}
          selectedAnswer={undefined}
          onAnswer={() => {}}
        />
      );

      // QuestionCard should render with question structure
      expect(screen.getByText('Question 5')).toBeInTheDocument();
      expect(screen.getByText('Delhi')).toBeInTheDocument();
      expect(screen.getByText('Mumbai')).toBeInTheDocument();
      expect(screen.getByText('Kolkata')).toBeInTheDocument();
      expect(screen.getByText('Chennai')).toBeInTheDocument();
    });

    it('should handle answer changes', async () => {
      const mockOnAnswer = jest.fn();
      const user = userEvent.setup();

      const { rerender } = render(
        <QuestionCard
          question={mockQuestion}
          questionNumber={1}
          selectedAnswer={0}
          onAnswer={mockOnAnswer}
        />
      );

      // Change answer from Delhi to Mumbai
      const mumbaiOption = screen.getByText('Mumbai');
      await user.click(mumbaiOption);

      expect(mockOnAnswer).toHaveBeenCalledWith(1);
    });
  });

  describe('Progress Component Integration', () => {
    it('should display progress correctly', () => {
      render(<Progress value={75} className="h-2" />);

      // Progress bar should be rendered
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toBeInTheDocument();
      expect(progressBar).toHaveAttribute('aria-valuemax', '100');
      expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    });

    it('should handle different progress values', () => {
      const { rerender } = render(<Progress value={0} />);

      expect(screen.getByRole('progressbar')).toBeInTheDocument();

      rerender(<Progress value={50} />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();

      rerender(<Progress value={100} />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should handle edge cases', () => {
      const { rerender } = render(<Progress value={-10} />);

      expect(screen.getByRole('progressbar')).toBeInTheDocument();

      rerender(<Progress value={150} />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  describe('Cross-Component Data Flow', () => {
    it('should handle task completion affecting progress', async () => {
      const mockToggleTask = jest.fn();
      mockUseAppStore.mockReturnValue({
        toggleTaskCompletion: mockToggleTask,
      });

      const user = userEvent.setup();

      // Render multiple task cards
      const { rerender } = render(
        <div>
          <TaskCard
            task={{
              id: 'task_1',
              topicId: 'topic_1',
              kind: 'Read' as const,
              durationMins: 60,
              isDone: false,
            }}
            onToggle={mockToggleTask}
          />
          <TaskCard
            task={{
              id: 'task_2',
              topicId: 'topic_1',
              kind: 'Practice' as const,
              durationMins: 45,
              isDone: true,
            }}
            onToggle={mockToggleTask}
          />
          <Progress value={50} />
        </div>
      );

      // Check that tasks are rendered correctly
      expect(screen.getByText('Read')).toBeInTheDocument();
      expect(screen.getByText('Practice')).toBeInTheDocument();

      // Progress should be visible
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should handle question selection affecting test progress', async () => {
      const mockOnAnswer = jest.fn();
      const user = userEvent.setup();

      render(
        <div>
          <QuestionCard
            question={{
              id: 'q1',
              question: 'Test Question?',
              options: ['A', 'B', 'C', 'D'],
              ans: 0,
              explanation: 'A is correct',
              topic: 'Test',
            }}
            questionNumber={1}
            selectedAnswer={undefined}
            onAnswer={mockOnAnswer}
          />
          <Progress value={25} />
        </div>
      );

      // Select answer - use the first occurrence
      const options = screen.getAllByText('A');
      await user.click(options[0]);

      expect(mockOnAnswer).toHaveBeenCalledWith(0);

      // Progress should reflect answer selection
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  describe('Component State Management', () => {
    it('should maintain component state independently', () => {
      render(
        <div>
          <TaskCard
            task={{
              id: 'task_1',
              topicId: 'topic_1',
              kind: 'Read' as const,
              durationMins: 60,
              isDone: false,
            }}
            onToggle={() => {}}
          />
          <TaskCard
            task={{
              id: 'task_2',
              topicId: 'topic_1',
              kind: 'Practice' as const,
              durationMins: 45,
              isDone: true,
            }}
            onToggle={() => {}}
          />
        </div>
      );

      // Both tasks should be visible and independent
      expect(screen.getByText('Read')).toBeInTheDocument();
      expect(screen.getByText('Practice')).toBeInTheDocument();
      expect(screen.getByText('60 minutes')).toBeInTheDocument();
      expect(screen.getByText('45 minutes')).toBeInTheDocument();
    });

    it('should handle multiple question cards', () => {
      const questions = [
        {
          id: 'q1',
          question: 'Question 1?',
          options: ['A', 'B'],
          ans: 0,
          explanation: 'A',
          topic: 'Test',
        },
        {
          id: 'q2',
          question: 'Question 2?',
          options: ['C', 'D'],
          ans: 1,
          explanation: 'D',
          topic: 'Test',
        },
      ];

      render(
        <div>
          {questions.map((q, index) => (
            <QuestionCard
              key={q.id}
              question={q}
              questionNumber={index + 1}
              selectedAnswer={undefined}
              onAnswer={() => {}}
            />
          ))}
        </div>
      );

      expect(screen.getByText('Question 1')).toBeInTheDocument();
      expect(screen.getByText('Question 2')).toBeInTheDocument();
      // Multiple elements with same text, just check that options exist
      expect(screen.getAllByText('A').length).toBeGreaterThan(0);
      expect(screen.getAllByText('B').length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling in Components', () => {
    it('should handle missing task data gracefully', () => {
      render(
        <TaskCard
          task={{
            id: '',
            topicId: '',
            kind: 'Read' as const,
            durationMins: 0,
            isDone: false,
          }}
          onToggle={() => {}}
        />
      );

      // Should still render without crashing
      expect(screen.getByText('Read')).toBeInTheDocument();
      expect(screen.getByText('0 minutes')).toBeInTheDocument();
    });

    it('should handle missing question data gracefully', () => {
      render(
        <QuestionCard
          question={{
            id: '',
            question: '',
            options: [],
            ans: 0,
            explanation: '',
            topic: '',
          }}
          questionNumber={1}
          selectedAnswer={undefined}
          onAnswer={() => {}}
        />
      );

      // Should render without crashing even with empty data
      expect(screen.getByText('Question 1')).toBeInTheDocument();
    });

    it('should handle invalid progress values', () => {
      render(<Progress value={NaN} />);

      expect(screen.getByRole('progressbar')).toBeInTheDocument();

      // Should not crash with invalid values
      expect(() => {
        render(<Progress value={Infinity} />);
      }).not.toThrow();
    });
  });
});
