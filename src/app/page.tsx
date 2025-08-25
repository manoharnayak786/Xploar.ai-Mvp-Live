'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { FEATURES } from '@/lib/utils/constants';

// This component serves as the main entry point
// The actual rendering is handled by MainLayout based on activeFeature
export default function HomePage() {
  const { currentUser, activeFeature, navigateTo } = useAppStore();

  useEffect(() => {
    // If user is not authenticated, redirect to onboarding
    if (!currentUser) {
      navigateTo(FEATURES.ONBOARDING);
    } else if (activeFeature === FEATURES.ONBOARDING) {
      // If user is authenticated but still on onboarding, redirect to study planner
      navigateTo(FEATURES.STUDY_PLANNER);
    }
  }, [currentUser, activeFeature, navigateTo]);

  // Return null since MainLayout handles all the rendering
  // based on the activeFeature in the store
  return null;
}