import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { persist } from 'zustand/middleware';
import {
    AppStore,
    AppState,
    TopicID,
    User,
    DateString,
    UserQuizAttempt,
    DeckID,
    Task
} from '@/lib/types';
import { generateStudyPlan } from '@/lib/utils/planGenerator';
import { getTodayString } from '@/lib/utils/dateUtils';
import { FEATURES, APP_CONFIG } from '@/lib/utils/constants';
import {
    SAMPLE_CURRENT_AFFAIRS,
    SAMPLE_DAILY_QUIZ,
    SAMPLE_CURATED_RESOURCES,
    SAMPLE_FLASHCARD_DECKS,
    SAMPLE_FLASHCARDS,
    SAMPLE_MENTORS,
    SAMPLE_WEBINARS
} from '@/lib/data/extended-data';


const initialState: AppState = {
    currentUser: null,
    isProUser: false,
    userRole: 'student',
    activeFeature: FEATURES.ONBOARDING,
    studyConfiguration: {
        goal: '',
        startDate: getTodayString(),
        durationDays: APP_CONFIG.DEFAULT_STUDY_DURATION,
        hoursPerDay: APP_CONFIG.DEFAULT_HOURS_PER_DAY,
    },
    studyPlan: [],
    currentVisibleDay: 1,
    dailyStreak: 0,
    lastStreakUpdateDate: null,
    mcqPerformance: {},
    mockTestHistory: [],
    recommendations: [], // New state property
};

export const useAppStore = create<AppStore>()(
    persist(
        (set, get) => ({
            ...initialState,

            // --- USER ACTIONS ---

            signIn: (email: string, name: string) => {
                const user: User = { id: `user_${Date.now()}`, email, name };
                set({ currentUser: user });
            },
            loginWithPassword: async (email: string, _password: string) => {
                try {
                    const res = await fetch('/api/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password: _password })
                    });
                    if (!res.ok) throw new Error('Login failed');
                    const { user } = await res.json();
                    set({ currentUser: { id: user.id, email: user.email, name: user.email.split('@')[0] } as unknown as User });
                    
                    // Load user's study plan after successful login
                    const { loadStudyPlan } = get();
                    await loadStudyPlan();
                } catch (e) {
                    console.error(e);
                }
            },
            signUpWithPassword: async (email: string, password: string, name?: string) => {
                try {
                    const res = await fetch('/api/auth/signup', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password, name })
                    });
                    if (!res.ok) throw new Error('Signup failed');
                    const { user } = await res.json();
                    set({ currentUser: { id: user.id, email: user.email, name: name || user.email.split('@')[0] } as unknown as User });
                } catch (e) {
                    console.error(e);
                }
            },
            requestPasswordReset: async (email: string) => {
                try {
                    const res = await fetch('/api/auth/reset', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email })
                    });
                    if (!res.ok) throw new Error('Reset request failed');
                } catch (e) {
                    console.error(e);
                }
            },
            signOut: () => set({ currentUser: null, activeFeature: FEATURES.ONBOARDING }),
            upgradeToPro: () => set({ isProUser: true }),
            downgradeFromPro: () => set({ isProUser: false }), // New Action
            switchRole: () => {
                const roles = ['student', 'mentor', 'admin'] as const;
                const nextRole = roles[(roles.indexOf(get().userRole) + 1) % roles.length];
                set({ userRole: nextRole });
            },
            navigateTo: (feature: string) => set({ activeFeature: feature }),
            updateStudyConfig: (config) => set((state) => ({
                studyConfiguration: { ...state.studyConfiguration, ...config },
            })),
            generateStudyPlan: async () => {
                const plan = generateStudyPlan(get().studyConfiguration);
                set({ studyPlan: plan, currentVisibleDay: 1, activeFeature: FEATURES.STUDY_PLANNER });
                
                // Persist the new study plan to Supabase
                const { persistStudyPlan } = get();
                await persistStudyPlan();
            },
            viewDay: (dayNumber) => set({ currentVisibleDay: dayNumber }),
            toggleTaskCompletion: async (taskId) => {
                set((state) => {
                    const newPlan = state.studyPlan.map(day => ({
                        ...day,
                        tasks: day.tasks.map(t => t.id === taskId ? { ...t, isDone: !t.isDone } : t),
                    }));
                    return { studyPlan: newPlan };
                });
                
                // Persist task completion changes to Supabase
                const { persistStudyPlan } = get();
                await persistStudyPlan();
            },
            deferTask: (_taskId) => { /* ... implementation ... */ },
            updateStreak: () => { /* ... implementation ... */ },
            recordMcqResult: (topicId, correct, total) => {
                set((state) => ({
                    mcqPerformance: { ...state.mcqPerformance, [topicId]: { correct, total } },
                }));
            },
            saveMockTest: (runData) => set((state) => ({
                mockTestHistory: [...state.mockTestHistory, runData],
            })),
            resetApplicationState: () => set(initialState),


            // --- DATA FETCHING & MUTATION ACTIONS ---

            fetchCurrentAffairs: async (_date: DateString) => {
                return SAMPLE_CURRENT_AFFAIRS;
            },
            fetchDailyQuiz: async (_date: DateString) => {
                return SAMPLE_DAILY_QUIZ;
            },
            submitQuizAttempt: (attempt: UserQuizAttempt) => {
                console.log('Submitting quiz attempt:', attempt);
            },
            fetchCuratedResources: async (topicId?: TopicID) => {
                if (topicId) {
                    return SAMPLE_CURATED_RESOURCES.filter(r => r.topicIds.includes(topicId));
                }
                return SAMPLE_CURATED_RESOURCES;
            },
            createUserNote: (noteData) => { console.log('Creating note:', noteData); },
            updateUserNote: (noteId, updates) => { console.log(`Updating note ${noteId}:`, updates); },
            deleteUserNote: (noteId) => { console.log(`Deleting note ${noteId}`); },
            fetchFlashcardDecks: async (topicId?: TopicID) => {
                if (topicId) {
                    return SAMPLE_FLASHCARD_DECKS.filter(d => d.topicId === topicId);
                }
                return SAMPLE_FLASHCARD_DECKS;
            },
            fetchFlashcardsForDeck: async (deckId: DeckID) => {
                return SAMPLE_FLASHCARDS.filter(c => c.deckId === deckId);
            },
            updateFlashcardReview: (reviewData) => { console.log('Updating flashcard review:', reviewData); },
            submitAnswerForReview: (submission) => { console.log('Submitting answer for review:', submission); },
            fetchSubmissionsToReview: async () => {
                return [];
            },
            submitPeerReview: (review) => { console.log('Submitting peer review:', review); },
            createStudyGroup: (groupData) => { console.log('Creating study group:', groupData); },
            joinStudyGroup: (groupId) => { console.log(`Joining group ${groupId}`); },
            sendGroupChatMessage: (message) => { console.log('Sending group message:', message); },
            createForumPost: (post) => { console.log('Creating forum post:', post); },
            replyToForumPost: (postId: string, content: string) => { console.log('Replying to forum post:', { postId, content }); },
            fetchMentors: async (topicId?: TopicID) => {
                if (topicId) {
                    return SAMPLE_MENTORS.filter(m => m.expertise.includes(topicId));
                }
                return SAMPLE_MENTORS;
            },
            bookMentorshipSession: async (sessionData) => {
                console.log('Booking mentorship session:', sessionData);
                return { success: true, sessionId: `sess_${Date.now()}` };
            },
            fetchUpcomingWebinars: async () => {
                return SAMPLE_WEBINARS.filter(w => new Date(w.scheduledTime) > new Date());
            },
            fetchRecordedWebinars: async () => {
                return SAMPLE_WEBINARS.filter(w => w.recordingUrl);
            },
            fetchAIRecommendations: async () => {
                return get().recommendations;
            },
            markRecommendationAsDone: (recommendationId) => {
                set((state) => ({
                    recommendations: state.recommendations.map(r =>
                        r.id === recommendationId ? { ...r, isCompleted: true } : r
                    ),
                }));
            },
            runAdaptivePlannerAnalysis: () => {
                // ... implementation
            },

            // --- PERSISTENCE: STUDY PLAN (Supabase) ---
            persistStudyPlan: async () => {
                const state = get();
                const { data: auth } = await supabase.auth.getUser();
                const userId = auth.user?.id;
                if (!userId) {
                    console.warn('persistStudyPlan: no user logged in');
                    return;
                }

                // Upsert study plan for the user
                const planPayload = {
                    user_id: userId,
                    start_date: state.studyConfiguration.startDate,
                    hours_per_day: state.studyConfiguration.hoursPerDay,
                } as const;

                const { data: planRow, error: planErr } = await supabase
                    .from('study_plans')
                    .upsert(planPayload, { onConflict: 'user_id' })
                    .select()
                    .single();

                if (planErr || !planRow) {
                    console.error('persistStudyPlan: plan upsert failed', planErr);
                    return;
                }

                // Replace tasks for this plan
                await supabase.from('study_tasks').delete().eq('plan_id', planRow.id);

                const taskRows = state.studyPlan.flatMap(day =>
                    day.tasks.map(t => ({
                        id: t.id,
                        plan_id: planRow.id,
                        topic_id: t.topicId,
                        kind: t.kind,
                        duration_mins: t.durationMins,
                        is_done: t.isDone,
                        day_num: day.day,
                    }))
                );

                if (taskRows.length > 0) {
                    const { error: tasksErr } = await supabase.from('study_tasks').insert(taskRows);
                    if (tasksErr) {
                        console.error('persistStudyPlan: tasks insert failed', tasksErr);
                    }
                }
            },

            loadStudyPlan: async () => {
                const { data: auth } = await supabase.auth.getUser();
                const userId = auth.user?.id;
                if (!userId) {
                    console.warn('loadStudyPlan: no user logged in');
                    return;
                }

                const { data: planRow, error: planErr } = await supabase
                    .from('study_plans')
                    .select('*')
                    .eq('user_id', userId)
                    .single();

                if (planErr || !planRow) {
                    // No plan yet
                    return;
                }

                const { data: tasks, error: tasksErr } = await supabase
                    .from('study_tasks')
                    .select('*')
                    .eq('plan_id', planRow.id)
                    .order('day_num', { ascending: true });

                if (tasksErr) {
                    console.error('loadStudyPlan: tasks fetch failed', tasksErr);
                    return;
                }

                type TaskRow = {
                    id: string;
                    plan_id: string;
                    topic_id: TopicID;
                    kind: Task['kind'];
                    duration_mins: number;
                    is_done: boolean;
                    day_num: number;
                };

                const byDay = new Map<number, { day: number; tasks: Task[] }>();
                for (const row of (tasks as TaskRow[] | null) ?? []) {
                    if (!byDay.has(row.day_num)) {
                        byDay.set(row.day_num, { day: row.day_num, tasks: [] as Task[] });
                    }
                    byDay.get(row.day_num)!.tasks.push({
                        id: row.id,
                        topicId: row.topic_id,
                        kind: row.kind,
                        durationMins: row.duration_mins,
                        isDone: row.is_done,
                    });
                }

                const restoredPlan = Array.from(byDay.values())
                    .sort((a, b) => a.day - b.day)
                    .map(d => ({ day: d.day, date: getTodayString(), tasks: d.tasks }));

                set(state => ({
                    studyConfiguration: {
                        ...state.studyConfiguration,
                        startDate: planRow.start_date,
                        hoursPerDay: planRow.hours_per_day,
                    },
                    studyPlan: restoredPlan,
                    currentVisibleDay: restoredPlan[0]?.day ?? 1,
                }));
            },
        }),
        {
            name: APP_CONFIG.STORAGE_KEY,
            version: 3, // Increment version due to state changes
        }
    )
);
