// Test XPLOAR.AI Deployment
// Run with: node test-deployment.js

const https = require('https');
const { URL } = require('url');

// Set your deployed URL here after Vercel deployment
const DEPLOYED_URL = process.env.DEPLOYED_URL || 'https://your-app-name.vercel.app';

console.log('🧪 PHASE 3: TESTING XPLOAR.AI DEPLOYMENT');
console.log('==========================================');
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
                'User-Agent': 'XPLOAR-Deployment-Test/1.0'
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

// Comprehensive test suite
async function runDeploymentTests() {
    const tests = [
        {
            name: 'App Accessibility',
            test: async () => {
                try {
                    const response = await makeRequest('/');
                    const isAccessible = response.status === 200;
                    const hasContent = response.data.length > 1000;
                    return isAccessible && hasContent;
                } catch (error) {
                    console.log(`❌ Error accessing app: ${error.message}`);
                    return false;
                }
            }
        },
        {
            name: 'Authentication Pages',
            test: async () => {
                try {
                    const response = await makeRequest('/');
                    const hasAuth = response.data.includes('auth') ||
                                  response.data.includes('login') ||
                                  response.data.includes('sign');
                    return hasAuth;
                } catch (error) {
                    return false;
                }
            }
        },
        {
            name: 'AI Features Load',
            test: async () => {
                try {
                    const response = await makeRequest('/');
                    const hasAIFeatures = response.data.includes('AI') ||
                                        response.data.includes('evaluation') ||
                                        response.data.includes('essay') ||
                                        response.data.includes('coach');
                    return hasAIFeatures;
                } catch (error) {
                    return false;
                }
            }
        },
        {
            name: 'Study Features',
            test: async () => {
                try {
                    const response = await makeRequest('/');
                    const hasStudyFeatures = response.data.includes('study') ||
                                           response.data.includes('plan') ||
                                           response.data.includes('mock') ||
                                           response.data.includes('test');
                    return hasStudyFeatures;
                } catch (error) {
                    return false;
                }
            }
        },
        {
            name: 'Community Features',
            test: async () => {
                try {
                    const response = await makeRequest('/');
                    const hasCommunity = response.data.includes('forum') ||
                                       response.data.includes('community') ||
                                       response.data.includes('discussion');
                    return hasCommunity;
                } catch (error) {
                    return false;
                }
            }
        },
        {
            name: 'Mobile Responsiveness',
            test: async () => {
                try {
                    const response = await makeRequest('/', {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
                        }
                    });
                    // Check if mobile CSS or responsive classes are present
                    const isResponsive = response.data.includes('responsive') ||
                                       response.data.includes('mobile') ||
                                       response.data.includes('md:') ||
                                       response.data.includes('lg:');
                    return isResponsive;
                } catch (error) {
                    return false;
                }
            }
        },
        {
            name: 'Performance (Load Time)',
            test: async () => {
                try {
                    const startTime = Date.now();
                    const response = await makeRequest('/');
                    const loadTime = Date.now() - startTime;
                    console.log(`   Load time: ${loadTime}ms`);
                    return loadTime < 5000; // 5 second threshold
                } catch (error) {
                    return false;
                }
            }
        },
        {
            name: 'Security Headers',
            test: async () => {
                try {
                    const response = await makeRequest('/');
                    const hasSecurityHeaders = response.headers['x-frame-options'] ||
                                             response.headers['content-security-policy'];
                    return !!hasSecurityHeaders;
                } catch (error) {
                    return false;
                }
            }
        }
    ];

    console.log('🚀 Running deployment tests...\n');

    let passed = 0;
    let failed = 0;
    const results = [];

    for (const test of tests) {
        console.log(`⏳ ${test.name}...`);
        try {
            const result = await test.test();
            if (result) {
                console.log(`✅ ${test.name} - PASSED`);
                passed++;
                results.push({ name: test.name, status: 'PASSED' });
            } else {
                console.log(`❌ ${test.name} - FAILED`);
                failed++;
                results.push({ name: test.name, status: 'FAILED' });
            }
        } catch (error) {
            console.log(`❌ ${test.name} - ERROR: ${error.message}`);
            failed++;
            results.push({ name: test.name, status: 'ERROR' });
        }
        console.log('');
    }

    console.log('📊 DEPLOYMENT TEST RESULTS');
    console.log('===========================');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

    if (failed === 0) {
        console.log('\n🎉 ALL TESTS PASSED! XPLOAR.AI IS LIVE AND FUNCTIONAL!');
        console.log('\n🚀 READY FOR PHASE 4: LAUNCH & MONITORING');
    } else {
        console.log('\n⚠️ SOME TESTS FAILED - CHECK DEPLOYMENT');
        console.log('\n💡 Common issues:');
        console.log('   - Environment variables not set');
        console.log('   - Database schema not applied');
        console.log('   - Build failed during deployment');
    }

    return { passed, failed, results };
}

// Main execution
if (require.main === module) {
    if (DEPLOYED_URL === 'https://your-app-name.vercel.app') {
        console.log('⚠️ Please set your deployed URL:');
        console.log('export DEPLOYED_URL=https://your-live-app.vercel.app');
        console.log('node test-deployment.js');
        process.exit(1);
    }

    runDeploymentTests().catch(error => {
        console.error('❌ Test suite failed:', error);
        process.exit(1);
    });
}

module.exports = { runDeploymentTests };
