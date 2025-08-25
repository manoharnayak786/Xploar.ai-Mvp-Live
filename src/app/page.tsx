'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { FEATURES } from '@/lib/utils/constants';

// This component serves as the main entry point
// The actual rendering is handled by MainLayout based on activeFeature
export default function HomePage() {
  const { currentUser, navigateTo } = useAppStore();

  useEffect(() => {
    // If user is not authenticated, redirect to onboarding
    if (!currentUser) {
      navigateTo(FEATURES.ONBOARDING);
    }
    // If user is authenticated and not on onboarding, let MainLayout handle the feature routing
    // Don't interfere with the onboarding flow - let it complete naturally
  }, [currentUser, navigateTo]);

  // Return null since MainLayout handles all the rendering
  // based on the activeFeature in the store
  return null;
}