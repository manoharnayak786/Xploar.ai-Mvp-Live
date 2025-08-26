'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { FEATURES } from '@/lib/utils/constants';
import { MainLayout } from '@/components/layout/MainLayout';

export default function HomePage() {
  const { currentUser, activeFeature, navigateTo } = useAppStore();

  useEffect(() => {
    // Handle initial routing logic
    if (!currentUser) {
      // User not authenticated - go to onboarding
      navigateTo(FEATURES.ONBOARDING);
    } else {
      // User is authenticated - check if they have completed onboarding
      const hasStudyPlan = useAppStore.getState().studyPlan.length > 0;
      if (!hasStudyPlan && activeFeature === FEATURES.ONBOARDING) {
        // User is in onboarding but hasn't completed it yet - stay in onboarding
        return;
      } else if (!hasStudyPlan) {
        // User needs to complete onboarding
        navigateTo(FEATURES.ONBOARDING);
      } else if (activeFeature === FEATURES.ONBOARDING) {
        // User has completed onboarding - redirect to study planner
        navigateTo(FEATURES.STUDY_PLANNER);
      }
      // If user has a study plan and is not in onboarding, let MainLayout handle the feature routing
    }
  }, [currentUser, activeFeature, navigateTo]);

  // Return MainLayout to handle all rendering based on activeFeature
  return <MainLayout />;
}