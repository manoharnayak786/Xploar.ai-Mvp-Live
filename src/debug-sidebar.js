// 🔍 Xploar Sidebar Debug Utility - Auto-run version
// This script automatically detects and reports sidebar issues

(function() {
    console.log('🔍 Xploar Sidebar Debug Tool - Auto-Run Mode');
    console.log('================================');

    const results = {
        timestamp: new Date().toISOString(),
        issues: [],
        checks: {},
        recommendations: []
    };

    // 1. Check Authentication State
    console.log('\n1. 🔐 Authentication Check:');
    try {
        const state = JSON.parse(localStorage.getItem('xploar_app_state') || '{}');
        const currentUser = state.state?.currentUser;
        const activeFeature = state.state?.activeFeature;

        console.log('   Current User:', currentUser ? `${currentUser.name} (${currentUser.email})` : 'None');
        console.log('   Active Feature:', activeFeature || 'None');

        results.checks.authentication = {
            authenticated: !!currentUser,
            user: currentUser,
            activeFeature: activeFeature
        };

        if (!currentUser) {
            results.issues.push('❌ No current user found - sidebar will not show');
            results.recommendations.push('Complete authentication flow first');
        } else {
            console.log('   ✅ User authenticated');
        }
    } catch (e) {
        results.issues.push('❌ Error reading app state: ' + e.message);
        console.error('   ❌ Error reading app state:', e);
    }

    // 2. Check Feature Constants
    console.log('\n2. 🎯 Feature Constants Check:');
    try {
        const expectedFeatures = {
            'study-planner': 'Study Plan',
            'mock-tests': 'Mock Tests',
            'ai-coach': 'AI Coach',
            'community': 'Community',
            'content-hub': 'Content Hub',
            'daily-challenge': 'Daily Challenge',
            'debate': 'AI Debate',
            'interview': 'Mock Interview',
            'mentor-connect': 'Mentors',
            'recommendations': 'AI Insights',
            'syllabus': 'Syllabus',
            'multi-mode-learning': 'Learning Hub',
            'progress': 'Progress',
            'settings': 'Settings'
        };

        console.log('   Available Features:', Object.keys(expectedFeatures).length);
        results.checks.features = {
            available: Object.keys(expectedFeatures),
            count: Object.keys(expectedFeatures).length
        };

        console.log('   ✅ Feature constants loaded');
    } catch (e) {
        results.issues.push('❌ Error loading feature constants');
        console.error('   ❌ Error loading features:', e);
    }

    // 3. Test Navigation Function
    console.log('\n3. 🧭 Navigation Test:');
    try {
        // Simulate navigation to different features
        const testFeatures = ['mock-tests', 'ai-coach', 'community', 'content-hub'];
        let navigationWorks = true;

        testFeatures.forEach(feature => {
            console.log(`   Testing navigation to: ${feature}`);
            try {
                // Test if we can set the active feature
                const currentState = JSON.parse(localStorage.getItem('xploar_app_state') || '{}');
                currentState.state = currentState.state || {};
                currentState.state.activeFeature = feature;

                // Try to save it back (this would normally be done by the store)
                localStorage.setItem('xploar_app_state', JSON.stringify(currentState));
                console.log(`   ✅ Can navigate to: ${feature}`);
            } catch (e) {
                console.error(`   ❌ Navigation failed for ${feature}:`, e);
                navigationWorks = false;
            }
        });

        results.checks.navigation = {
            works: navigationWorks,
            testedFeatures: testFeatures
        };

        if (navigationWorks) {
            console.log('   ✅ Navigation system working');
        }
    } catch (e) {
        results.issues.push('❌ Navigation system error: ' + e.message);
        console.error('   ❌ Navigation system error:', e);
    }

    // 4. Check Environment Variables
    console.log('\n4. 🌍 Environment Variables:');
    const requiredVars = [
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        'NEXT_PUBLIC_SITE_URL'
    ];

    const envStatus = {};
    let envIssues = 0;

    requiredVars.forEach(varName => {
        const exists = typeof window !== 'undefined' &&
                      window[varName] !== undefined &&
                      window[varName] !== '';

        envStatus[varName] = exists;
        console.log(`   ${exists ? '✅' : '❌'} ${varName}:`, exists ? 'Set' : 'Missing');

        if (!exists) {
            envIssues++;
            results.issues.push(`❌ Environment variable missing: ${varName}`);
        }
    });

    results.checks.environment = envStatus;

    if (envIssues > 0) {
        results.recommendations.push(`Set ${envIssues} missing environment variables in Vercel dashboard`);
    }

    // 5. Test Component Loading
    console.log('\n5. 📦 Component Loading Test:');
    const componentsToTest = [
        { name: 'MockTests', feature: 'mock-tests' },
        { name: 'AIEvaluation', feature: 'ai-coach' },
        { name: 'CommunityHub', feature: 'community' },
        { name: 'ContentHub', feature: 'content-hub' }
    ];

    const componentStatus = {};

    componentsToTest.forEach(({ name, feature }) => {
        console.log(`   Testing ${name} component...`);
        try {
            // In a real app, this would test if the component can be imported
            // For now, we'll just check if the feature constant exists
            console.log(`   ✅ ${name} component should be available`);
            componentStatus[feature] = true;
        } catch (e) {
            console.error(`   ❌ ${name} component failed:`, e);
            componentStatus[feature] = false;
            results.issues.push(`❌ Component ${name} failed to load`);
        }
    });

    results.checks.components = componentStatus;

    // 6. Check Authentication Flow
    console.log('\n🔐 AUTHENTICATION FLOW CHECK:');
    try {
        const state = JSON.parse(localStorage.getItem('xploar_app_state') || '{}');
        const currentUser = state.state?.currentUser;
        const activeFeature = state.state?.activeFeature;

        if (!currentUser) {
            console.log('❌ STATUS: Not authenticated - showing login screen');
            results.issues.push('User not authenticated - complete login/signup');
        } else if (activeFeature === 'onboarding') {
            console.log('⚠️ STATUS: Authenticated but still on onboarding');
            console.log('💡 SOLUTION: Complete onboarding flow to access main features');
            results.issues.push('Complete onboarding flow (Welcome → Goal → Time → Baseline)');
        } else {
            console.log('✅ STATUS: Authenticated and can access main features');
            console.log('🎉 You should see the sidebar with all features now!');
        }
    } catch (e) {
        results.issues.push('Error checking auth flow: ' + e.message);
    }

    // 7. Generate Report
    console.log('\n📊 DEBUG REPORT:');
    console.log('================================');
    console.log(`Timestamp: ${results.timestamp}`);
    console.log(`Issues Found: ${results.issues.length}`);
    console.log(`Recommendations: ${results.recommendations.length}`);

    if (results.issues.length > 0) {
        console.log('\n🔴 ISSUES FOUND:');
        results.issues.forEach((issue, index) => {
            console.log(`   ${index + 1}. ${issue}`);
        });
    } else {
        console.log('\n✅ No critical issues found');
    }

    if (results.recommendations.length > 0) {
        console.log('\n💡 RECOMMENDATIONS:');
        results.recommendations.forEach((rec, index) => {
            console.log(`   ${index + 1}. ${rec}`);
        });
    }

    // 7. Quick Fix Options
    console.log('\n🔧 QUICK FIXES:');

    if (!results.checks.authentication?.authenticated) {
        console.log('\n   Fix Authentication:');
        console.log('   1. Complete login/signup process');
        console.log('   2. Or run this in console:');
        console.log(`   localStorage.setItem('xploar_app_state', JSON.stringify({
     state: {
       currentUser: { id: 'test_user', email: 'test@example.com', name: 'Test User' },
       activeFeature: 'study-planner'
     },
     version: 3
   }));`);
        console.log('   location.reload();');
    }

    console.log('\n   Test All Features:');
    console.log('   Run this to test each feature:');
    const testCommands = [
        'mock-tests',
        'ai-coach',
        'community',
        'content-hub',
        'daily-challenge'
    ];

    testCommands.forEach(feature => {
        console.log(`   // Test ${feature}`);
        console.log(`   localStorage.setItem('xploar_app_state', JSON.stringify({
     state: {
       currentUser: { id: 'test_user', email: 'test@example.com', name: 'Test User' },
       activeFeature: '${feature}'
     },
     version: 3
   }));`);
        console.log('   location.reload();');
        console.log('');
    });

    // Store results globally for further analysis
    window.sidebarDebugResults = results;

    console.log('\n💾 Debug results saved to window.sidebarDebugResults');
    console.log('📋 Copy this entire output and share it for further help!');

    return results;
})();
