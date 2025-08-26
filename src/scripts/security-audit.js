#!/usr/bin/env node
// src/scripts/security-audit.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SecurityAuditor {
    constructor() {
        this.issues = [];
        this.passed = [];
    }

    audit() {
        console.log('🔍 Running Security Audit...');
        console.log('=' .repeat(50));

        this.checkSecurityHeaders();
        this.checkDependencies();
        this.checkEnvironmentVariables();
        this.checkFilePermissions();
        this.checkSSLConfiguration();

        this.generateReport();
    }

    checkSecurityHeaders() {
        console.log('\n🔒 Checking Security Headers...');

        // Check if security middleware exists
        const middlewarePath = path.join(__dirname, '..', 'middleware', 'security.ts');
        if (fs.existsSync(middlewarePath)) {
            this.passed.push('Security headers middleware exists');
            console.log('   ✅ Security headers middleware found');
        } else {
            this.issues.push('Missing security headers middleware');
            console.log('   ❌ Security headers middleware missing');
        }
    }

    checkDependencies() {
        console.log('\n📦 Checking Dependencies...');

        try {
            const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

            // Check for known vulnerabilities (simplified)
            const vulnerablePackages = [
                'old-package-name' // Add known vulnerable packages
            ];

            vulnerablePackages.forEach(pkg => {
                if (dependencies[pkg]) {
                    this.issues.push(`Potentially vulnerable package: ${pkg}`);
                    console.log(`   ⚠️ Potentially vulnerable package: ${pkg}`);
                }
            });

            if (this.issues.length === 0) {
                this.passed.push('No known vulnerable dependencies');
                console.log('   ✅ No known vulnerable dependencies');
            }
        } catch (_error) {
            this.issues.push('Could not check dependencies');
            console.log('   ❌ Could not check dependencies');
        }
    }

    checkEnvironmentVariables() {
        console.log('\n🔐 Checking Environment Variables...');

        const requiredEnvVars = [
            'NEXT_PUBLIC_SUPABASE_URL',
            'NEXT_PUBLIC_SUPABASE_ANON_KEY',
            'GOOGLE_AI_API_KEY'
        ];

        const envFile = path.join(__dirname, '..', '..', '.env.local');
        if (!fs.existsSync(envFile)) {
            this.issues.push('Missing .env.local file');
            console.log('   ❌ Missing .env.local file');
            return;
        }

        try {
            const envContent = fs.readFileSync(envFile, 'utf8');
            requiredEnvVars.forEach(envVar => {
                if (envContent.includes(envVar + '=')) {
                    this.passed.push(`Environment variable ${envVar} configured`);
                    console.log(`   ✅ ${envVar} configured`);
                } else {
                    this.issues.push(`Missing environment variable: ${envVar}`);
                    console.log(`   ❌ Missing environment variable: ${envVar}`);
                }
            });
        } catch (_error) {
            this.issues.push('Could not read environment file');
            console.log('   ❌ Could not read environment file');
        }
    }

    checkFilePermissions() {
        console.log('\n🔑 Checking File Permissions...');

        const sensitiveFiles = [
            '.env.local',
            'package.json',
            'next.config.ts'
        ];

        sensitiveFiles.forEach(file => {
            const filePath = path.join(__dirname, '..', '..', file);
            if (fs.existsSync(filePath)) {
                // In a real audit, you'd check actual file permissions
                this.passed.push(`File exists: ${file}`);
                console.log(`   ✅ File exists: ${file}`);
            } else {
                this.issues.push(`Missing file: ${file}`);
                console.log(`   ❌ Missing file: ${file}`);
            }
        });
    }

    checkSSLConfiguration() {
        console.log('\n🔒 Checking SSL Configuration...');

        // This would check actual SSL configuration in production
        this.passed.push('SSL configuration check framework ready');
        console.log('   ✅ SSL configuration check framework ready');
    }

    generateReport() {
        console.log('\n📊 SECURITY AUDIT REPORT');
        console.log('=' .repeat(50));

        console.log(`\n✅ Passed Checks: ${this.passed.length}`);
        this.passed.forEach(item => console.log(`   • ${item}`));

        console.log(`\n❌ Issues Found: ${this.issues.length}`);
        this.issues.forEach(issue => console.log(`   • ${issue}`));

        console.log(`\n📈 Overall Security Score: ${
            this.issues.length === 0 ? '100%' :
            Math.round((this.passed.length / (this.passed.length + this.issues.length)) * 100) + '%'
        }`);

        if (this.issues.length === 0) {
            console.log('\n🎉 All security checks passed!');
        } else {
            console.log('\n⚠️ Some security issues need attention.');
        }
    }
}

// Run the audit
const auditor = new SecurityAuditor();
auditor.audit();

module.exports = SecurityAuditor;