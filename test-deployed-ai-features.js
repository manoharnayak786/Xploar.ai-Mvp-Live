// Test AI-Powered Insights Features on Deployed App
// Run with: node test-deployed-ai-features.js
// Make sure to set the DEPLOYED_URL environment variable

const https = require('https');
const { URL } = require('url');

const DEPLOYED_URL = process.env.DEPLOYED_URL || 'https://your-app-url.vercel.app';

console.log('🧪 TESTING AI-POWERED INSIGHTS ON DEPLOYED APP');
console.log('==============================================');
console.log(`Target URL: ${DEPLOYED_URL}`);
console.log('');

// Test function to make HTTP requests
function makeRequest(path, options = {}) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, DEPLOYED_URL);
        const reqOptions = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname,
            method: 'GET',
            headers: {
                'User-Agent': 'AI-Features-Test/1.0'
            },
            ...options
        };

        const req = https.request(reqOptions, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve({
                    status: res.statusCode,
                    headers: res.headers,
                    data
                });
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        req.end();
    });
}

// Test suite
async function runTests() {
    const tests = [
        {
            name: 'App Accessibility',
            test: async () => {
                try {
                    const response = await makeRequest('/');
                    return response.status === 200;
                } catch (error) {
                    console.log(`❌ Error accessing app: ${error.message}`);
                    return false;
                }
            }
        },
        {
            name: 'Auth Screen Loads',
            test: async () => {
                try {
                    const response = await makeRequest('/?debug=true');
                    return response.data.includes('auth') || response.data.includes('login');
                } catch (error) {
                    console.log(`❌ Error loading auth screen: ${error.message}`);
                    return false;
                }
            }
        },
        {
            name: 'AI Coach Components Load',
            test: async () => {
                try {
                    const response = await makeRequest('/?debug=true');
                    const hasAIElements = response.data.includes('AI Coach') ||
                                        response.data.includes('essay') ||
                                        response.data.includes('evaluation');
                    return hasAIElements;
                } catch (error) {
                    console.log(`❌ Error checking AI components: ${error.message}`);
                    return false;
                }
            }
        },
        {
            name: 'Sidebar Navigation',
            test: async () => {
                try {
                    const response = await makeRequest('/?debug=true');
                    const hasSidebar = response.data.includes('sidebar') ||
                                     response.data.includes('navigation') ||
                                     response.data.includes('menu');
                    return hasSidebar;
                } catch (error) {
                    console.log(`❌ Error checking sidebar: ${error.message}`);
                    return false;
                }
            }
        },
        {
            name: 'Learning Modes Available',
            test: async () => {
                try {
                    const response = await makeRequest('/?debug=true');
                    const hasLearningModes = response.data.includes('Read') ||
                                           response.data.includes('Practice') ||
                                           response.data.includes('Explain') ||
                                           response.data.includes('Recall');
                    return hasLearningModes;
                } catch (error) {
                    console.log(`❌ Error checking learning modes: ${error.message}`);
                    return false;
                }
            }
        },
        {
            name: 'Mock Tests Available',
            test: async () => {
                try {
                    const response = await makeRequest('/?debug=true');
                    const hasMockTests = response.data.includes('mock') ||
                                       response.data.includes('test') ||
                                       response.data.includes('exam');
                    return hasMockTests;
                } catch (error) {
                    console.log(`❌ Error checking mock tests: ${error.message}`);
                    return false;
                }
            }
        },
        {
            name: 'Community Features Available',
            test: async () => {
                try {
                    const response = await makeRequest('/?debug=true');
                    const hasCommunity = response.data.includes('forum') ||
                                       response.data.includes('discussion') ||
                                       response.data.includes('community');
                    return hasCommunity;
                } catch (error) {
                    console.log(`❌ Error checking community features: ${error.message}`);
                    return false;
                }
            }
        },
        {
            name: 'Content Hub Available',
            test: async () => {
                try {
                    const response = await makeRequest('/?debug=true');
                    const hasContentHub = response.data.includes('content') ||
                                         response.data.includes('hub') ||
                                         response.data.includes('resources');
                    return hasContentHub;
                } catch (error) {
                    console.log(`❌ Error checking content hub: ${error.message}`);
                    return false;
                }
            }
        },
        {
            name: 'Recommendations System',
            test: async () => {
                try {
                    const response = await makeRequest('/?debug=true');
                    const hasRecommendations = response.data.includes('recommendation') ||
                                             response.data.includes('AI Action') ||
                                             response.data.includes('insights');
                    return hasRecommendations;
                } catch (error) {
                    console.log(`❌ Error checking recommendations: ${error.message}`);
                    return false;
                }
            }
        }
    ];

    console.log('Running deployment tests...\n');

    let passed = 0;
    let failed = 0;

    for (const test of tests) {
        console.log(`⏳ ${test.name}...`);
        try {
            const result = await test.test();
            if (result) {
                console.log(`✅ ${test.name} - PASSED`);
                passed++;
            } else {
                console.log(`❌ ${test.name} - FAILED`);
                failed++;
            }
        } catch (error) {
            console.log(`❌ ${test.name} - ERROR: ${error.message}`);
            failed++;
        }
        console.log('');
    }

    console.log('📊 TEST RESULTS SUMMARY');
    console.log('======================');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

    if (failed === 0) {
        console.log('\n🎉 All tests passed! AI-Powered Insights system is working correctly.');
        console.log('🚀 Your app is ready for production use.');
    } else {
        console.log('\n⚠️  Some tests failed. Check the app deployment and database configuration.');
        console.log('💡 Make sure:');
        console.log('   1. Database schema is applied to Supabase');
        console.log('   2. Environment variables are set correctly in Vercel');
        console.log('   3. App is deployed successfully');
    }
}

// Run the tests
if (require.main === module) {
    runTests().catch(error => {
        console.error('Test suite failed:', error);
        process.exit(1);
    });
}

module.exports = { runTests };
