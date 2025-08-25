import { generateStudyPlan } from '@/lib/utils/planGenerator';
import { StudyConfig, PlanDay, Task } from '@/lib/types';
import { UPSC_FOUNDATION } from '@/lib/data/topics';

// Mock the topics data to ensure consistent test results
jest.mock('@/lib/data/topics', () => ({
  UPSC_FOUNDATION: [
    { id: 'topic_1', name: 'History', description: 'Study of past events' },
    { id: 'topic_2', name: 'Geography', description: 'Study of places' },
    { id: 'topic_3', name: 'Polity', description: 'Study of government' },
  ],
}));

describe('Plan Generator', () => {
  const mockConfig: StudyConfig = {
    goal: 'UPSC Preparation',
    startDate: '2024-01-01',
    durationDays: 7,
    hoursPerDay: 3,
  };

  describe('generateStudyPlan', () => {
    it('should generate correct number of days', () => {
      const plan = generateStudyPlan(mockConfig);
      expect(plan).toHaveLength(7);
    });

    it('should generate plan with correct structure', () => {
      const plan = generateStudyPlan(mockConfig);

      plan.forEach((day, index) => {
        expect(day).toHaveProperty('day');
        expect(day).toHaveProperty('date');
        expect(day).toHaveProperty('tasks');
        expect(day.day).toBe(index + 1);
        expect(day.tasks).toHaveLength(4); // Read, Practice, Explain, Recall
      });
    });

    it('should generate sequential dates starting from startDate', () => {
      const plan = generateStudyPlan(mockConfig);

      expect(plan[0].date).toBe('2024-01-01');
      expect(plan[1].date).toBe('2024-01-02');
      expect(plan[2].date).toBe('2024-01-03');
      expect(plan[6].date).toBe('2024-01-07');
    });

    it('should cycle through topics correctly', () => {
      const plan = generateStudyPlan(mockConfig);

      // With 3 topics and 7 days, topics should repeat
      expect(plan[0].tasks[0].topicId).toBe('topic_1'); // History
      expect(plan[1].tasks[0].topicId).toBe('topic_2'); // Geography
      expect(plan[2].tasks[0].topicId).toBe('topic_3'); // Polity
      expect(plan[3].tasks[0].topicId).toBe('topic_1'); // History (cycle)
      expect(plan[4].tasks[0].topicId).toBe('topic_2'); // Geography (cycle)
    });

    it('should create tasks with correct properties', () => {
      const plan = generateStudyPlan(mockConfig);
      const firstDayTasks = plan[0].tasks;

      expect(firstDayTasks).toHaveLength(4);

      // Check Read task
      expect(firstDayTasks[0]).toMatchObject({
        topicId: 'topic_1',
        kind: 'Read',
        durationMins: 95, // 3 hours - 60 - 15 - 10 = 95 minutes
        isDone: false,
      });

      // Check Practice task
      expect(firstDayTasks[1]).toMatchObject({
        topicId: 'topic_1',
        kind: 'Practice',
        durationMins: 60,
        isDone: false,
      });

      // Check Explain task
      expect(firstDayTasks[2]).toMatchObject({
        topicId: 'topic_1',
        kind: 'Explain',
        durationMins: 15,
        isDone: false,
      });

      // Check Recall task
      expect(firstDayTasks[3]).toMatchObject({
        topicId: 'topic_1',
        kind: 'Recall',
        durationMins: 10,
        isDone: false,
      });
    });

    it('should generate unique task IDs', () => {
      const plan = generateStudyPlan(mockConfig);
      const allTaskIds = plan.flatMap(day => day.tasks.map(task => task.id));
      const uniqueTaskIds = new Set(allTaskIds);

      expect(uniqueTaskIds.size).toBe(allTaskIds.length);
    });

    it('should handle different duration configurations', () => {
      const shortConfig: StudyConfig = {
        ...mockConfig,
        durationDays: 3,
        hoursPerDay: 2,
      };

      const plan = generateStudyPlan(shortConfig);
      expect(plan).toHaveLength(3);

      // Check that read time is calculated correctly for 2 hours
      const readTask = plan[0].tasks.find(task => task.kind === 'Read');
      expect(readTask?.durationMins).toBe(35); // 2 hours - 60 - 15 - 10 = 35 minutes
    });

    it('should ensure minimum read time of 30 minutes', () => {
      const intensiveConfig: StudyConfig = {
        ...mockConfig,
        hoursPerDay: 1.5, // 90 minutes total
      };

      const plan = generateStudyPlan(intensiveConfig);
      const readTask = plan[0].tasks.find(task => task.kind === 'Read');

      // Should be at least 30 minutes even if calculation gives less
      expect(readTask?.durationMins).toBeGreaterThanOrEqual(30);
    });

    it('should handle single day plans', () => {
      const singleDayConfig: StudyConfig = {
        ...mockConfig,
        durationDays: 1,
      };

      const plan = generateStudyPlan(singleDayConfig);
      expect(plan).toHaveLength(1);
      expect(plan[0].day).toBe(1);
      expect(plan[0].tasks).toHaveLength(4);
    });

    it('should handle edge case with zero duration', () => {
      const zeroDayConfig: StudyConfig = {
        ...mockConfig,
        durationDays: 0,
      };

      const plan = generateStudyPlan(zeroDayConfig);
      expect(plan).toHaveLength(0);
    });
  });
});
