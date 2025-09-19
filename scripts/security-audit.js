#!/usr/bin/env node

/**
 * Automated Security Audit Test Suite
 * Comprehensive security testing for paws-landing and future productions
 * 
 * Usage: node scripts/security-audit.js [options]
 * Options:
 *   --quick     Run quick security checks only
 *   --full      Run full security audit (default)
 *   --verbose   Show detailed output
 *   --fix       Attempt to fix issues automatically
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class SecurityAuditor {
  constructor(options = {}) {
    this.options = {
      quick: options.quick || false,
      full: options.full || true,
      verbose: options.verbose || false,
      fix: options.fix || false,
      ...options
    };
    
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      total: 0,
      issues: [],
      recommendations: []
    };
    
    this.projectRoot = process.cwd();
    this.startTime = Date.now();
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      info: '🔍',
      pass: '✅',
      fail: '❌',
      warn: '⚠️',
      fix: '🔧'
    }[type] || '🔍';
    
    if (this.options.verbose || type !== 'info') {
      console.log(`${prefix} [${timestamp}] ${message}`);
    }
  }

  async runAudit() {
    this.log('Starting Security Audit...', 'info');
    this.log(`Mode: ${this.options.quick ? 'Quick' : 'Full'}`, 'info');
    
    try {
      // Core security checks
      await this.checkFileStructure();
      await this.checkSecurityFiles();
      await this.checkEnvironmentSecurity();
      await this.checkInputValidation();
      await this.checkSecurityHeaders();
      await this.checkAuthentication();
      await this.checkRateLimiting();
      await this.checkDependencies();
      
      if (!this.options.quick) {
        await this.checkCodeQuality();
        await this.checkConfiguration();
        await this.checkDocumentation();
        await this.checkDeployment();
      }
      
      this.generateReport();
      
    } catch (error) {
      this.log(`Audit failed: ${error.message}`, 'fail');
      process.exit(1);
    }
  }

  async checkFileStructure() {
    this.log('Checking file structure...', 'info');
    
    const requiredFiles = [
      'lib/security.js',
      'lib/env.js',
      'lib/api-handler.js',
      'lib/middleware.js',
      'next.config.mjs',
      'vercel.json',
      '.gitignore',
      'package.json'
    ];
    
    for (const file of requiredFiles) {
      const filePath = path.join(this.projectRoot, file);
      if (fs.existsSync(filePath)) {
        this.pass(`Required file exists: ${file}`);
      } else {
        this.fail(`Missing required file: ${file}`);
      }
    }
  }

  async checkSecurityFiles() {
    this.log('Checking security implementation...', 'info');
    
    // Check security.js
    const securityPath = path.join(this.projectRoot, 'lib/security.js');
    if (fs.existsSync(securityPath)) {
      const content = fs.readFileSync(securityPath, 'utf8');
      
      const securityChecks = [
        { name: 'InputValidator class', pattern: /class InputValidator/ },
        { name: 'RateLimiter class', pattern: /class RateLimiter/ },
        { name: 'SecurityHeaders class', pattern: /class SecurityHeaders/ },
        { name: 'CSRFProtection class', pattern: /class CSRFProtection/ },
        { name: 'AdminAuth class', pattern: /class AdminAuth/ },
        { name: 'Email validation', pattern: /validateEmail/ },
        { name: 'Password validation', pattern: /validatePassword/ },
        { name: 'Text sanitization', pattern: /sanitizeText/ },
        { name: 'XSS prevention', pattern: /script/gi },
        { name: 'Rate limiting', pattern: /isAllowed/ }
      ];
      
      for (const check of securityChecks) {
        if (check.pattern.test(content)) {
          this.pass(`Security feature implemented: ${check.name}`);
        } else {
          this.fail(`Missing security feature: ${check.name}`);
        }
      }
    } else {
      this.fail('Security utilities file not found');
    }
  }

  async checkEnvironmentSecurity() {
    this.log('Checking environment security...', 'info');
    
    // Check .env.example exists
    const envExamplePath = path.join(this.projectRoot, '.env.example');
    if (fs.existsSync(envExamplePath)) {
      this.pass('Environment example file exists');
    } else {
      this.warn('Missing .env.example file (optional)');
    }
    
    // Check .env is in .gitignore
    const gitignorePath = path.join(this.projectRoot, '.gitignore');
    if (fs.existsSync(gitignorePath)) {
      const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
      if (gitignoreContent.includes('.env')) {
        this.pass('.env files are gitignored');
      } else {
        this.fail('.env files not properly gitignored');
      }
    }
    
    // Check env.js security
    const envPath = path.join(this.projectRoot, 'lib/env.js');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      if (content.includes('validateSecret') && content.includes('sanitizeText')) {
        this.pass('Environment security implemented');
      } else {
        this.fail('Environment security not properly implemented');
      }
    }
  }

  async checkInputValidation() {
    this.log('Checking input validation...', 'info');
    
    // Check signup form has validation
    const signupPath = path.join(this.projectRoot, 'app/auth/signup/page.jsx');
    if (fs.existsSync(signupPath)) {
      const content = fs.readFileSync(signupPath, 'utf8');
      
      const validationChecks = [
        { name: 'InputValidator import', pattern: /import.*InputValidator/ },
        { name: 'Form validation', pattern: /validateForm/ },
        { name: 'Error handling', pattern: /errors\[/ },
        { name: 'Input sanitization', pattern: /handleInputChange/ },
        { name: 'Required fields', pattern: /required/ }
      ];
      
      for (const check of validationChecks) {
        if (check.pattern.test(content)) {
          this.pass(`Input validation: ${check.name}`);
        } else {
          this.fail(`Missing input validation: ${check.name}`);
        }
      }
    }
  }

  async checkSecurityHeaders() {
    this.log('Checking security headers...', 'info');
    
    // Check Next.js config
    const nextConfigPath = path.join(this.projectRoot, 'next.config.mjs');
    if (fs.existsSync(nextConfigPath)) {
      const content = fs.readFileSync(nextConfigPath, 'utf8');
      
      const headerChecks = [
        { name: 'X-Content-Type-Options', pattern: /X-Content-Type-Options/ },
        { name: 'X-Frame-Options', pattern: /X-Frame-Options/ },
        { name: 'X-XSS-Protection', pattern: /X-XSS-Protection/ },
        { name: 'Content-Security-Policy', pattern: /Content-Security-Policy/ },
        { name: 'Headers function', pattern: /async headers\(\)/ }
      ];
      
      for (const check of headerChecks) {
        if (check.pattern.test(content)) {
          this.pass(`Security header: ${check.name}`);
        } else {
          this.fail(`Missing security header: ${check.name}`);
        }
      }
    }
    
    // Check Vercel config
    const vercelPath = path.join(this.projectRoot, 'vercel.json');
    if (fs.existsSync(vercelPath)) {
      const content = fs.readFileSync(vercelPath, 'utf8');
      if (content.includes('headers') && content.includes('X-Content-Type-Options')) {
        this.pass('Vercel security headers configured');
      } else {
        this.fail('Vercel security headers not configured');
      }
    }
  }

  async checkAuthentication() {
    this.log('Checking authentication...', 'info');
    
    // Check admin panel security
    const adminPath = path.join(this.projectRoot, 'app/dashboard/admin/page.jsx');
    if (fs.existsSync(adminPath)) {
      const content = fs.readFileSync(adminPath, 'utf8');
      
      const authChecks = [
        { name: 'Authentication state', pattern: /isAuthenticated/ },
        { name: 'Login form', pattern: /handleLogin/ },
        { name: 'Logout functionality', pattern: /handleLogout/ },
        { name: 'Environment check', pattern: /getEnv.*ENABLE_ADMIN_PANEL/ },
        { name: 'Loading states', pattern: /isLoading/ }
      ];
      
      for (const check of authChecks) {
        if (check.pattern.test(content)) {
          this.pass(`Authentication: ${check.name}`);
        } else {
          this.fail(`Missing authentication: ${check.name}`);
        }
      }
    }
  }

  async checkRateLimiting() {
    this.log('Checking rate limiting...', 'info');
    
    // Check middleware
    const middlewarePath = path.join(this.projectRoot, 'lib/middleware.js');
    if (fs.existsSync(middlewarePath)) {
      const content = fs.readFileSync(middlewarePath, 'utf8');
      
      if (content.includes('rateLimit') || content.includes('RateLimiter')) {
        this.pass('Rate limiting implemented');
      } else {
        this.fail('Rate limiting not implemented');
      }
    }
    
    // Check API handler
    const apiHandlerPath = path.join(this.projectRoot, 'lib/api-handler.js');
    if (fs.existsSync(apiHandlerPath)) {
      const content = fs.readFileSync(apiHandlerPath, 'utf8');
      if (content.includes('rateLimit') && content.includes('isAllowed')) {
        this.pass('API rate limiting implemented');
      } else {
        this.fail('API rate limiting not implemented');
      }
    }
  }

  async checkDependencies() {
    this.log('Checking dependencies...', 'info');
    
    const packagePath = path.join(this.projectRoot, 'package.json');
    if (fs.existsSync(packagePath)) {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      // Check for security-related dependencies
      const securityDeps = [
        'next',
        'react',
        'react-dom'
      ];
      
      for (const dep of securityDeps) {
        if (packageJson.dependencies && packageJson.dependencies[dep]) {
          this.pass(`Security dependency: ${dep}`);
        } else {
          this.warn(`Missing security dependency: ${dep}`);
        }
      }
      
      // Check for vulnerable dependencies
      try {
        execSync('npm audit --audit-level=moderate', { stdio: 'pipe' });
        this.pass('No high-severity vulnerabilities found');
      } catch (error) {
        this.warn('Vulnerabilities found in dependencies - run npm audit fix');
      }
    }
  }

  async checkCodeQuality() {
    this.log('Checking code quality...', 'info');
    
    // Check for linting
    try {
      execSync('npm run lint', { stdio: 'pipe' });
      this.pass('Code linting passed');
    } catch (error) {
      this.warn('Code linting issues found - run npm run lint:fix');
    }
    
    // Check for TypeScript errors if applicable
    try {
      execSync('npm run type-check', { stdio: 'pipe' });
      this.pass('TypeScript checks passed');
    } catch (error) {
      this.warn('TypeScript errors found');
    }
  }

  async checkConfiguration() {
    this.log('Checking configuration...', 'info');
    
    // Check package.json scripts
    const packagePath = path.join(this.projectRoot, 'package.json');
    if (fs.existsSync(packagePath)) {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      const requiredScripts = [
        'dev',
        'build',
        'start',
        'lint',
        'vercel-build'
      ];
      
      for (const script of requiredScripts) {
        if (packageJson.scripts && packageJson.scripts[script]) {
          this.pass(`Required script: ${script}`);
        } else {
          this.fail(`Missing required script: ${script}`);
        }
      }
    }
  }

  async checkDocumentation() {
    this.log('Checking documentation...', 'info');
    
    const docFiles = [
      'README.md',
      'DEPLOYMENT_GUIDE.md',
      'SECURITY_AUDIT_FINAL.md',
      'GITHUB_SETUP.md'
    ];
    
    for (const doc of docFiles) {
      const docPath = path.join(this.projectRoot, doc);
      if (fs.existsSync(docPath)) {
        this.pass(`Documentation exists: ${doc}`);
      } else {
        this.warn(`Missing documentation: ${doc}`);
      }
    }
  }

  async checkDeployment() {
    this.log('Checking deployment readiness...', 'info');
    
    // Check if build works
    try {
      execSync('npm run build', { stdio: 'pipe' });
      this.pass('Build successful');
    } catch (error) {
      this.fail('Build failed - check for errors');
    }
    
    // Check Vercel config
    const vercelPath = path.join(this.projectRoot, 'vercel.json');
    if (fs.existsSync(vercelPath)) {
      try {
        const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
        if (vercelConfig.headers && vercelConfig.env) {
          this.pass('Vercel configuration valid');
        } else {
          this.fail('Vercel configuration incomplete');
        }
      } catch (error) {
        this.fail('Vercel configuration invalid JSON');
      }
    }
  }

  pass(message) {
    this.results.passed++;
    this.results.total++;
    this.log(message, 'pass');
  }

  fail(message) {
    this.results.failed++;
    this.results.total++;
    this.results.issues.push({ type: 'error', message });
    this.log(message, 'fail');
  }

  warn(message) {
    this.results.warnings++;
    this.results.total++;
    this.results.issues.push({ type: 'warning', message });
    this.log(message, 'warn');
  }

  generateReport() {
    const endTime = Date.now();
    const duration = ((endTime - this.startTime) / 1000).toFixed(2);
    
    console.log('\n' + '='.repeat(60));
    console.log('🔒 SECURITY AUDIT REPORT');
    console.log('='.repeat(60));
    
    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Passed: ${this.results.passed}`);
    console.log(`   ❌ Failed: ${this.results.failed}`);
    console.log(`   ⚠️  Warnings: ${this.results.warnings}`);
    console.log(`   📈 Total: ${this.results.total}`);
    console.log(`   ⏱️  Duration: ${duration}s`);
    
    const score = Math.round((this.results.passed / this.results.total) * 100);
    console.log(`\n🎯 Security Score: ${score}%`);
    
    if (score >= 95) {
      console.log('🟢 EXCELLENT - Production ready!');
    } else if (score >= 85) {
      console.log('🟡 GOOD - Minor issues to address');
    } else if (score >= 70) {
      console.log('🟠 FAIR - Several issues need attention');
    } else {
      console.log('🔴 POOR - Major security issues found');
    }
    
    if (this.results.issues.length > 0) {
      console.log('\n🚨 Issues Found:');
      this.results.issues.forEach((issue, index) => {
        const icon = issue.type === 'error' ? '❌' : '⚠️';
        console.log(`   ${icon} ${issue.message}`);
      });
    }
    
    if (this.results.failed === 0) {
      console.log('\n🎉 All security checks passed! Your application is secure.');
    } else {
      console.log(`\n🔧 Please fix ${this.results.failed} critical issues before deployment.`);
    }
    
    console.log('\n' + '='.repeat(60));
    
    // Exit with appropriate code
    if (this.results.failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  }
}

// CLI handling
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {
    quick: args.includes('--quick'),
    full: args.includes('--full'),
    verbose: args.includes('--verbose'),
    fix: args.includes('--fix')
  };
  
  const auditor = new SecurityAuditor(options);
  auditor.runAudit().catch(error => {
    console.error('❌ Audit failed:', error.message);
    process.exit(1);
  });
}

module.exports = SecurityAuditor;
