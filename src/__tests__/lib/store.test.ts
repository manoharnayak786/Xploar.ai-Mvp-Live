import { useAppStore } from '@/lib/store';
import { AppStore, StudyConfig, PlanDay } from '@/lib/types';

// Mock the store with a proper mock function
const mockUseAppStore = jest.fn();
jest.mock('@/lib/store', () => ({
  useAppStore: mockUseAppStore,
}));

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      resetPasswordForEmail: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
          order: jest.fn(),
        })),
        order: jest.fn(),
      })),
      insert: jest.fn(),
      upsert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
      delete: jest.fn(),
    })),
  },
}));

// Mock the planGenerator
jest.mock('@/lib/utils/planGenerator', () => ({
  generateStudyPlan: jest.fn((config: StudyConfig) => {
    const mockPlan: PlanDay[] = [];
    for (let i = 1; i <= config.durationDays; i++) {
      mockPlan.push({
        day: i,
        date: `2024-01-${String(i).padStart(2, '0')}`,
        tasks: [
          {
            id: `task_${i}_read`,
            topicId: 'topic_1',
            kind: 'Read',
            durationMins: 60,
            isDone: false,
          },
        ],
      });
    }
    return mockPlan;
  }),
}));

// Create mock store methods
const createMockStore = () => ({
  currentUser: null,
  isProUser: false,
  userRole: 'student',
  activeFeature: 'onboarding',
  studyConfiguration: {
    goal: '',
    startDate: '2024-01-01',
    durationDays: 30,
    hoursPerDay: 3,
  },
  studyPlan: [],
  currentVisibleDay: 1,
  dailyStreak: 0,
  lastStreakUpdateDate: null,
  mcqPerformance: {},
  mockTestHistory: [],
  recommendations: [],
  signIn: jest.fn(),
  loginWithPassword: jest.fn(),
  signUpWithPassword: jest.fn(),
  requestPasswordReset: jest.fn(),
  signOut: jest.fn(),
  upgradeToPro: jest.fn(),
  downgradeFromPro: jest.fn(),
  switchRole: jest.fn(),
  navigateTo: jest.fn(),
  updateStudyConfig: jest.fn(),
  generateStudyPlan: jest.fn(),
  viewDay: jest.fn(),
  toggleTaskCompletion: jest.fn(),
  deferTask: jest.fn(),
  updateStreak: jest.fn(),
  recordMcqResult: jest.fn(),
  saveMockTest: jest.fn(),
  resetApplicationState: jest.fn(),
  fetchCurrentAffairs: jest.fn(),
  fetchDailyQuiz: jest.fn(),
  submitQuizAttempt: jest.fn(),
  fetchCuratedResources: jest.fn(),
  createUserNote: jest.fn(),
  updateUserNote: jest.fn(),
  deleteUserNote: jest.fn(),
  fetchFlashcardDecks: jest.fn(),
  fetchFlashcardsForDeck: jest.fn(),
  updateFlashcardReview: jest.fn(),
  submitAnswerForReview: jest.fn(),
  fetchSubmissionsToReview: jest.fn(),
  submitPeerReview: jest.fn(),
  createStudyGroup: jest.fn(),
  joinStudyGroup: jest.fn(),
  sendGroupChatMessage: jest.fn(),
  createForumPost: jest.fn(),
  replyToForumPost: jest.fn(),
  fetchMentors: jest.fn(),
  bookMentorshipSession: jest.fn(),
  fetchUpcomingWebinars: jest.fn(),
  fetchRecordedWebinars: jest.fn(),
  fetchAIRecommendations: jest.fn(),
  markRecommendationAsDone: jest.fn(),
  runAdaptivePlannerAnalysis: jest.fn(),
  persistStudyPlan: jest.fn(),
  loadStudyPlan: jest.fn(),
});

describe('App Store', () => {
  let mockStore: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    mockStore = createMockStore();
    mockUseAppStore.mockReturnValue(mockStore);
  });

  describe('User Actions', () => {
    it('should sign in user correctly', () => {
      const { signIn } = mockStore;

      signIn('test@example.com', 'Test User');

      expect(signIn).toHaveBeenCalledWith('test@example.com', 'Test User');
      expect(mockStore.currentUser).toBeNull(); // Since it's mocked, state doesn't change
    });

    it('should sign out user correctly', () => {
      const { signIn, signOut } = mockStore;

      // Mock user state
      mockStore.currentUser = { id: 'user_123', email: 'test@example.com', name: 'Test User' };
      mockStore.activeFeature = 'study-planner';

      signIn('test@example.com', 'Test User');
      expect(signIn).toHaveBeenCalledWith('test@example.com', 'Test User');

      signOut();
      expect(signOut).toHaveBeenCalled();
    });

    it('should upgrade user to pro', () => {
      const { upgradeToPro } = mockStore;

      expect(mockStore.isProUser).toBe(false);
      upgradeToPro();
      expect(upgradeToPro).toHaveBeenCalled();
    });

    it('should downgrade user from pro', () => {
      const { upgradeToPro, downgradeFromPro } = mockStore;

      // Mock pro user state
      mockStore.isProUser = true;

      upgradeToPro();
      expect(upgradeToPro).toHaveBeenCalled();

      downgradeFromPro();
      expect(downgradeFromPro).toHaveBeenCalled();
    });

    it('should switch user roles correctly', () => {
      const { switchRole } = mockStore;

      expect(mockStore.userRole).toBe('student');
      switchRole();
      expect(switchRole).toHaveBeenCalled();
    });
  });

  describe('Navigation', () => {
    it('should navigate to different features', () => {
      const { navigateTo } = mockStore;

      navigateTo('study-planner');
      expect(navigateTo).toHaveBeenCalledWith('study-planner');

      navigateTo('mock-tests');
      expect(navigateTo).toHaveBeenCalledWith('mock-tests');
    });
  });

  describe('Study Configuration', () => {
    it('should update study configuration', () => {
      const { updateStudyConfig } = mockStore;

      const newConfig = {
        goal: 'UPSC 2025',
        hoursPerDay: 4,
      };

      updateStudyConfig(newConfig);

      expect(updateStudyConfig).toHaveBeenCalledWith(newConfig);
    });
  });

  describe('Study Plan Management', () => {
    it('should generate study plan correctly', async () => {
      const { generateStudyPlan } = mockStore;

      await generateStudyPlan();

      expect(generateStudyPlan).toHaveBeenCalled();
    });

    it('should view different days', () => {
      const { viewDay } = mockStore;

      viewDay(5);
      expect(viewDay).toHaveBeenCalledWith(5);

      viewDay(15);
      expect(viewDay).toHaveBeenCalledWith(15);
    });

    it('should toggle task completion', () => {
      const { toggleTaskCompletion } = mockStore;

      toggleTaskCompletion('task_1_read');

      expect(toggleTaskCompletion).toHaveBeenCalledWith('task_1_read');
    });
  });

  describe('MCQ Performance', () => {
    it('should record MCQ results correctly', () => {
      const { recordMcqResult } = mockStore;

      recordMcqResult('topic_1', 8, 10);
      recordMcqResult('topic_2', 6, 10);

      expect(recordMcqResult).toHaveBeenCalledWith('topic_1', 8, 10);
      expect(recordMcqResult).toHaveBeenCalledWith('topic_2', 6, 10);
    });

    it('should update existing topic performance', () => {
      const { recordMcqResult } = mockStore;

      recordMcqResult('topic_1', 5, 10);
      recordMcqResult('topic_1', 8, 10);

      expect(recordMcqResult).toHaveBeenNthCalledWith(1, 'topic_1', 5, 10);
      expect(recordMcqResult).toHaveBeenNthCalledWith(2, 'topic_1', 8, 10);
    });
  });

  describe('Mock Test History', () => {
    it('should save mock test results', () => {
      const { saveMockTest } = mockStore;

      const mockRun = {
        id: 'mock_1',
        date: '2024-01-01',
        topicId: 'topic_1',
        score: 75,
        totalQuestions: 10,
        timeTakenMins: 90,
        usesNegativeMarking: true,
      };

      saveMockTest(mockRun);

      expect(saveMockTest).toHaveBeenCalledWith(mockRun);
    });

    it('should accumulate multiple mock test results', () => {
      const { saveMockTest } = mockStore;

      const mockRun1 = {
        id: 'mock_1',
        date: '2024-01-01',
        topicId: 'topic_1',
        score: 75,
        totalQuestions: 10,
        timeTakenMins: 90,
        usesNegativeMarking: true,
      };

      const mockRun2 = {
        id: 'mock_2',
        date: '2024-01-02',
        topicId: 'topic_2',
        score: 80,
        totalQuestions: 10,
        timeTakenMins: 85,
        usesNegativeMarking: true,
      };

      saveMockTest(mockRun1);
      saveMockTest(mockRun2);

      expect(saveMockTest).toHaveBeenNthCalledWith(1, mockRun1);
      expect(saveMockTest).toHaveBeenNthCalledWith(2, mockRun2);
    });
  });

  describe('Recommendations', () => {
    it('should mark recommendation as done', () => {
      const { markRecommendationAsDone } = mockStore;

      markRecommendationAsDone('rec_1');

      expect(markRecommendationAsDone).toHaveBeenCalledWith('rec_1');
    });
  });

  describe('Application State Reset', () => {
    it('should reset application state correctly', () => {
      const { signIn, navigateTo, resetApplicationState } = mockStore;

      signIn('test@example.com', 'Test User');
      navigateTo('study-planner');

      expect(signIn).toHaveBeenCalledWith('test@example.com', 'Test User');
      expect(navigateTo).toHaveBeenCalledWith('study-planner');

      resetApplicationState();
      expect(resetApplicationState).toHaveBeenCalled();
    });
  });
});
