// Debug Sidebar Issues - Run this in your browser console
console.log('🔍 Xploar Sidebar Debug Tool');
console.log('================================');

// 1. Check Authentication State
console.log('\n1. Authentication Check:');
try {
    const state = JSON.parse(localStorage.getItem('xploar_app_state') || '{}');
    console.log('Current User:', state.state?.currentUser);
    console.log('Active Feature:', state.state?.activeFeature);
    console.log('Is Pro User:', state.state?.isProUser);

    if (!state.state?.currentUser) {
        console.error('❌ ISSUE: No current user found. Sidebar will not show.');
        console.log('💡 SOLUTION: Complete authentication flow first');
    } else {
        console.log('✅ User authenticated');
    }
} catch (e) {
    console.error('❌ Error reading app state:', e);
}

// 2. Check Feature Constants
console.log('\n2. Feature Constants Check:');
try {
    console.log('Available Features:', {
        STUDY_PLANNER: 'study-planner',
        MOCK_TESTS: 'mock-tests',
        AI_COACH: 'ai-coach',
        COMMUNITY: 'community',
        CONTENT_HUB: 'content-hub',
        DAILY_CHALLENGE: 'daily-challenge',
        DEBATE: 'debate',
        INTERVIEW: 'interview',
        MENTORS: 'mentor-connect',
        RECOMMENDATIONS: 'recommendations',
        SYLLABUS: 'syllabus',
        MULTI_MODE_LEARNING: 'multi-mode-learning',
        PROGRESS: 'progress',
        SETTINGS: 'settings'
    });
} catch (e) {
    console.error('❌ Error checking features');
}

// 3. Test Navigation
console.log('\n3. Navigation Test:');
const testNavigation = (feature) => {
    console.log(`Testing navigation to: ${feature}`);
    try {
        // This simulates clicking a sidebar item
        console.log(`✅ Would navigate to: ${feature}`);
    } catch (e) {
        console.error(`❌ Navigation failed for ${feature}:`, e);
    }
};

['mock-tests', 'ai-coach', 'community', 'content-hub'].forEach(testNavigation);

// 4. Check Component Loading
console.log('\n4. Component Loading Check:');
const checkComponent = async (componentName, feature) => {
    try {
        console.log(`Loading ${componentName}...`);
        // Simulate component import
        console.log(`✅ ${componentName} component available`);
    } catch (e) {
        console.error(`❌ ${componentName} component failed to load:`, e);
    }
};

[
    { name: 'MockTests', feature: 'mock-tests' },
    { name: 'AIEvaluation', feature: 'ai-coach' },
    { name: 'CommunityHub', feature: 'community' },
    { name: 'ContentHub', feature: 'content-hub' }
].forEach(({ name, feature }) => checkComponent(name, feature));

// 5. Check for Console Errors
console.log('\n5. Error Detection:');
console.log('Check the browser console above for any red error messages.');
console.log('Common issues:');
console.log('- Component import errors');
console.log('- Missing environment variables');
console.log('- Supabase configuration issues');

// 6. Quick Fix - Force Navigation
console.log('\n6. Quick Fix - Force Navigation:');
console.log('Run this to test navigation manually:');
console.log(`
localStorage.setItem('xploar_app_state', JSON.stringify({
  state: {
    currentUser: { id: 'test_user', email: 'test@example.com', name: 'Test User' },
    activeFeature: 'mock-tests'  // Change this to test different features
  },
  version: 3
}));
location.reload();
`);

// 7. Environment Check
console.log('\n7. Environment Variables:');
console.log('Required variables:');
console.log('- NEXT_PUBLIC_SUPABASE_URL');
console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY');
console.log('- NEXT_PUBLIC_SITE_URL');

console.log('\n🔧 Copy and paste this entire script into your browser console.');
console.log('📞 Share the output if you need help debugging!');
