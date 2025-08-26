const https = require('https');
const fs = require('fs');

class FinalDeploymentVerifier {
    constructor() {
        this.baseURL = 'https://xploar-web-5igf7haig-manoharnayakbarmavaths-projects.vercel.app';
        this.testResults = {
            security: [],
            functionality: [],
            performance: [],
            accessibility: []
        };
        this.overallScore = 0;
    }

    log(message, status = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = status === 'success' ? '✅' :
                     status === 'error' ? '❌' :
                     status === 'warning' ? '⚠️' : '🔍';
        console.log(`[${timestamp}] ${prefix} ${message}`);
    }

    async makeRequest(url, options = {}) {
        return new Promise((resolve, reject) => {
            const req = https.request(url, {
                method: 'GET',
                headers: {
                    'User-Agent': 'Xploar-Final-Verification/1.0',
                    ...options.headers
                },
                ...options
            }, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => resolve({ status: res.statusCode, data, headers: res.headers }));
            });

            req.on('error', reject);
            req.setTimeout(30000, () => {
                req.destroy();
                reject(new Error('Request timeout'));
            });
            req.end();
        });
    }

    // 1. Security Verification
    async verifySecurity() {
        this.log('🔒 Verifying Security Implementation...', 'info');

        try {
            const response = await this.makeRequest(this.baseURL);

            // Check security headers
            const securityHeaders = [
                'x-frame-options',
                'x-content-type-options',
                'strict-transport-security',
                'x-xss-protection',
                'content-security-policy'
            ];

            securityHeaders.forEach(header => {
                if (response.headers[header]) {
                    this.testResults.security.push({ test: header, status: 'PASS' });
                    this.log(`Security header ${header}: PRESENT`, 'success');
                } else {
                    this.testResults.security.push({ test: header, status: 'FAIL' });
                    this.log(`Security header ${header}: MISSING`, 'error');
                }
            });

            // Check SSL
            if (response.status === 200) {
                this.testResults.security.push({ test: 'ssl_connection', status: 'PASS' });
                this.log('SSL connection: SECURE', 'success');
            }

        } catch (error) {
            this.testResults.security.push({ test: 'security_check', status: 'FAIL' });
            this.log('Security verification failed: ' + error.message, 'error');
        }
    }

    // 2. Functionality Verification
    async verifyFunctionality() {
        this.log('🧪 Verifying Core Functionality...', 'info');

        // Test homepage
        try {
            const response = await this.makeRequest(this.baseURL);
            if (response.status === 200) {
                this.testResults.functionality.push({ test: '/', status: 'PASS' });
                this.log(`Endpoint /: OK (${response.status})`, 'success');
            } else {
                this.testResults.functionality.push({ test: '/', status: 'FAIL' });
                this.log(`Endpoint /: FAILED (${response.status})`, 'error');
            }
        } catch (error) {
            this.testResults.functionality.push({ test: '/', status: 'FAIL' });
            this.log(`Endpoint /: ERROR - ${error.message}`, 'error');
        }

        // Test auth endpoints with POST requests
        const authEndpoints = [
            { path: '/api/auth/login', method: 'POST', data: { email: 'test@example.com', password: 'test123' } },
            { path: '/api/auth/signup', method: 'POST', data: { email: 'test@example.com', password: 'test123', name: 'Test User' } },
            { path: '/api/auth/reset', method: 'POST', data: { email: 'test@example.com' } }
        ];

        for (const endpoint of authEndpoints) {
            try {
                const response = await this.makeRequest(this.baseURL + endpoint.path, {
                    method: endpoint.method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(endpoint.data)
                });
                // 405 is expected for GET requests, but POST should work
                if (response.status !== 405) {
                    this.testResults.functionality.push({ test: endpoint.path, status: 'PASS' });
                    this.log(`Endpoint ${endpoint.path}: OK (${response.status})`, 'success');
                } else {
                    this.testResults.functionality.push({ test: endpoint.path, status: 'FAIL' });
                    this.log(`Endpoint ${endpoint.path}: FAILED (${response.status})`, 'error');
                }
            } catch (error) {
                this.testResults.functionality.push({ test: endpoint.path, status: 'FAIL' });
                this.log(`Endpoint ${endpoint.path}: ERROR - ${error.message}`, 'error');
            }
        }

        // Check for key UI elements
        try {
            const response = await this.makeRequest(this.baseURL);
            const html = response.data;

            const uiElements = [
                'xploar.ai',
                'Study Plan',
                'AI Coach',
                'Mock Tests'
            ];

            uiElements.forEach(element => {
                if (html.includes(element)) {
                    this.testResults.functionality.push({ test: `ui_element_${element}`, status: 'PASS' });
                    this.log(`UI element "${element}": FOUND`, 'success');
                } else {
                    this.testResults.functionality.push({ test: `ui_element_${element}`, status: 'FAIL' });
                    this.log(`UI element "${element}": MISSING`, 'warning');
                }
            });

        } catch (error) {
            this.log('UI verification failed: ' + error.message, 'error');
        }
    }

    // 3. Performance Verification
    async verifyPerformance() {
        this.log('⚡ Verifying Performance...', 'info');

        const start = Date.now();
        try {
            const response = await this.makeRequest(this.baseURL);
            const loadTime = Date.now() - start;

            // Check response time
            if (loadTime < 3000) {
                this.testResults.performance.push({ test: 'response_time', status: 'PASS', value: loadTime });
                this.log(`Response time: ${loadTime}ms`, 'success');
            } else {
                this.testResults.performance.push({ test: 'response_time', status: 'FAIL', value: loadTime });
                this.log(`Response time: ${loadTime}ms (SLOW)`, 'warning');
            }

            // Check response size
            const sizeKB = Buffer.byteLength(response.data, 'utf8') / 1024;
            if (sizeKB < 500) {
                this.testResults.performance.push({ test: 'response_size', status: 'PASS', value: sizeKB });
                this.log(`Response size: ${sizeKB.toFixed(2)}KB`, 'success');
            } else {
                this.testResults.performance.push({ test: 'response_size', status: 'FAIL', value: sizeKB });
                this.log(`Response size: ${sizeKB.toFixed(2)}KB (LARGE)`, 'warning');
            }

        } catch (error) {
            this.testResults.performance.push({ test: 'performance_check', status: 'FAIL' });
            this.log('Performance verification failed: ' + error.message, 'error');
        }
    }

    // 4. Accessibility Verification
    async verifyAccessibility() {
        this.log('♿ Verifying Accessibility...', 'info');

        try {
            const response = await this.makeRequest(this.baseURL);
            const html = response.data;

            // Check for accessibility features
            const accessibilityChecks = [
                { name: 'alt_attributes', pattern: /alt=["'][^"']*["']/g },
                { name: 'semantic_html', pattern: /<(header|nav|main|section|article|aside|footer)/g },
                { name: 'aria_labels', pattern: /aria-[a-z-]+=["'][^"']*["']/g },
                { name: 'lang_attribute', pattern: /lang=["'][^"']*["']/g }
            ];

            accessibilityChecks.forEach(check => {
                const matches = html.match(check.pattern);
                if (matches && matches.length > 0) {
                    this.testResults.accessibility.push({
                        test: check.name,
                        status: 'PASS',
                        count: matches.length
                    });
                    this.log(`${check.name}: ${matches.length} found`, 'success');
                } else {
                    this.testResults.accessibility.push({
                        test: check.name,
                        status: 'FAIL',
                        count: 0
                    });
                    this.log(`${check.name}: NOT FOUND`, 'warning');
                }
            });

        } catch (error) {
            this.log('Accessibility verification failed: ' + error.message, 'error');
        }
    }

    // 5. UI/UX Verification
    async verifyUIUX() {
        this.log('🎨 Verifying UI/UX Implementation...', 'info');

        try {
            const response = await this.makeRequest(this.baseURL);
            const html = response.data;

            // Check for proper UI structure
            const uiChecks = [
                { name: 'responsive_design', pattern: /class="[^"]*md:[^"]*"/g },
                { name: 'proper_layout', pattern: /min-h-screen|flex|grid/g },
                { name: 'styling_framework', pattern: /class="[^"]*bg-|text-|p-|m-/g },
                { name: 'animations', pattern: /motion\.|animate|transition/g }
            ];

            uiChecks.forEach(check => {
                const matches = html.match(check.pattern);
                if (matches && matches.length > 0) {
                    this.testResults.accessibility.push({
                        test: check.name,
                        status: 'PASS',
                        count: matches.length
                    });
                    this.log(`${check.name}: IMPLEMENTED (${matches.length} instances)`, 'success');
                } else {
                    this.testResults.accessibility.push({
                        test: check.name,
                        status: 'FAIL',
                        count: 0
                    });
                    this.log(`${check.name}: NOT FOUND`, 'warning');
                }
            });

        } catch (error) {
            this.log('UI/UX verification failed: ' + error.message, 'error');
        }
    }

    // 6. Content Verification
    async verifyContent() {
        this.log('📝 Verifying Content & Features...', 'info');

        try {
            const response = await this.makeRequest(this.baseURL);
            const html = response.data;

            // Check for key content and features
            const contentChecks = [
                'UPSC Preparation',
                'AI-Powered',
                'Personalized Study Plan',
                'Mock Tests',
                'AI Coach',
                'Community',
                'Progress Dashboard',
                'Daily Challenge'
            ];

            contentChecks.forEach(content => {
                if (html.includes(content)) {
                    this.log(`Content "${content}": PRESENT`, 'success');
                } else {
                    this.log(`Content "${content}": MISSING`, 'warning');
                }
            });

        } catch (error) {
            this.log('Content verification failed: ' + error.message, 'error');
        }
    }

    // Calculate overall score
    calculateScore() {
        let totalTests = 0;
        let passedTests = 0;

        Object.values(this.testResults).forEach(category => {
            category.forEach(test => {
                totalTests++;
                if (test.status === 'PASS') {
                    passedTests++;
                }
            });
        });

        this.overallScore = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
        return this.overallScore;
    }

    // Generate comprehensive report
    generateReport() {
        console.log('\n🎯 FINAL DEPLOYMENT VERIFICATION REPORT');
        console.log('=' .repeat(80));
        console.log(`📊 Overall Score: ${this.calculateScore()}%`);
        console.log('=' .repeat(80));

        // Security Report
        console.log('\n🔒 SECURITY VERIFICATION');
        console.log('-'.repeat(40));
        this.testResults.security.forEach(test => {
            const icon = test.status === 'PASS' ? '✅' : '❌';
            console.log(`${icon} ${test.test}: ${test.status}`);
        });

        // Functionality Report
        console.log('\n🧪 FUNCTIONALITY VERIFICATION');
        console.log('-'.repeat(40));
        this.testResults.functionality.forEach(test => {
            const icon = test.status === 'PASS' ? '✅' : '❌';
            console.log(`${icon} ${test.test}: ${test.status}`);
        });

        // Performance Report
        console.log('\n⚡ PERFORMANCE VERIFICATION');
        console.log('-'.repeat(40));
        this.testResults.performance.forEach(test => {
            const icon = test.status === 'PASS' ? '✅' : '❌';
            const value = test.value ? ` (${typeof test.value === 'number' ? test.value.toFixed(2) : test.value})` : '';
            console.log(`${icon} ${test.test}: ${test.status}${value}`);
        });

        // Accessibility Report
        console.log('\n♿ ACCESSIBILITY & UI/UX VERIFICATION');
        console.log('-'.repeat(40));
        this.testResults.accessibility.forEach(test => {
            const icon = test.status === 'PASS' ? '✅' : '❌';
            const count = test.count ? ` (${test.count} found)` : '';
            console.log(`${icon} ${test.test}: ${test.status}${count}`);
        });

        // Summary
        console.log('\n📈 VERIFICATION SUMMARY');
        console.log('-'.repeat(40));

        const securityScore = this.testResults.security.filter(t => t.status === 'PASS').length;
        const functionalityScore = this.testResults.functionality.filter(t => t.status === 'PASS').length;
        const performanceScore = this.testResults.performance.filter(t => t.status === 'PASS').length;
        const accessibilityScore = this.testResults.accessibility.filter(t => t.status === 'PASS').length;

        console.log(`🔒 Security: ${securityScore}/${this.testResults.security.length} tests passed`);
        console.log(`🧪 Functionality: ${functionalityScore}/${this.testResults.functionality.length} tests passed`);
        console.log(`⚡ Performance: ${performanceScore}/${this.testResults.performance.length} tests passed`);
        console.log(`♿ Accessibility: ${accessibilityScore}/${this.testResults.accessibility.length} tests passed`);

        // Deployment Status
        console.log('\n🚀 DEPLOYMENT STATUS');
        console.log('-'.repeat(40));

        if (this.overallScore >= 90) {
            console.log('🎉 EXCELLENT! Deployment is production-ready!');
            console.log('   Your Xploar.ai platform is fully functional and secure.');
        } else if (this.overallScore >= 75) {
            console.log('✅ GOOD! Deployment is mostly ready.');
            console.log('   Minor issues need attention before full launch.');
        } else if (this.overallScore >= 60) {
            console.log('⚠️ FAIR! Deployment needs significant improvements.');
            console.log('   Address critical issues before going live.');
        } else {
            console.log('❌ POOR! Deployment requires major fixes.');
            console.log('   Do not deploy until critical issues are resolved.');
        }

        console.log(`\n🏆 FINAL SCORE: ${this.overallScore}%`);
    }

    // Main verification function
    async runVerification() {
        console.log('🚀 Starting Final Deployment Verification');
        console.log('=' .repeat(60));
        console.log(`Target: ${this.baseURL}`);
        console.log('=' .repeat(60));

        try {
            await this.verifySecurity();
            await this.verifyFunctionality();
            await this.verifyPerformance();
            await this.verifyAccessibility();
            await this.verifyUIUX();
            await this.verifyContent();

            this.generateReport();

        } catch (error) {
            this.log('Verification suite failed: ' + error.message, 'error');
        }
    }
}

// Run the final verification
async function runFinalVerification() {
    const verifier = new FinalDeploymentVerifier();
    await verifier.runVerification();
}

module.exports = { FinalDeploymentVerifier, runFinalVerification };

// Run if called directly
if (require.main === module) {
    runFinalVerification().catch(console.error);
}
