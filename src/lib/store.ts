import { create } from 'zustand';
import { supabase } from './supabase';

interface User {
  id: string;
  email: string;
  full_name: string;
  study_level: string;
  target_exam: string;
  isProUser?: boolean;
}

interface AppState {
  currentUser: User | null;
  activeFeature: string;
  isLoading: boolean;
  error: string | null;
  
  // Auth functions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  
  // Navigation
  navigateTo: (feature: string) => void;
  setActiveFeature: (feature: string) => void;
  
  // Generic function for all other features
  executeAction: (action: string, data?: unknown) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentUser: null,
  activeFeature: 'onboarding',
  isLoading: false,
  error: null,
  
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) {
        const { data: profile } = await supabase.from('users').select('*').eq('id', data.user.id).single();
        set({ currentUser: profile, isLoading: false });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      set({ error: errorMessage, isLoading: false });
    }
  },
  
  logout: async () => {
    await supabase.auth.signOut();
    set({ currentUser: null, activeFeature: 'onboarding' });
  },
  
  navigateTo: (feature: string) => set({ activeFeature: feature }),
  setActiveFeature: (feature: string) => set({ activeFeature: feature }),
  
  executeAction: (action: string, data?: unknown) => {
    console.log(`Execute action: ${action}`, data);
  },
}));
