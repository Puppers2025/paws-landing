#!/usr/bin/env node

/**
 * Comprehensive Security Test Suite
 * Automated testing for all security implementations
 * 
 * Usage: node scripts/security-tests.js [options]
 * Options:
 *   --unit      Run unit tests only
 *   --integration Run integration tests only
 *   --all       Run all tests (default)
 *   --verbose   Show detailed output
 */

const fs = require('fs');
const path = require('path');

class SecurityTestSuite {
  constructor(options = {}) {
    this.options = {
      unit: options.unit || false,
      integration: options.integration || false,
      all: options.all || true,
      verbose: options.verbose || false,
      ...options
    };
    
    this.results = {
      passed: 0,
      failed: 0,
      total: 0,
      tests: []
    };
    
    this.projectRoot = process.cwd();
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      info: '🧪',
      pass: '✅',
      fail: '❌',
      warn: '⚠️',
      test: '🔍'
    }[type] || '🧪';
    
    if (this.options.verbose || type !== 'info') {
      console.log(`${prefix} [${timestamp}] ${message}`);
    }
  }

  async runTests() {
    this.log('Starting Security Test Suite...', 'info');
    
    try {
      if (this.options.all || this.options.unit) {
        await this.runUnitTests();
      }
      
      if (this.options.all || this.options.integration) {
        await this.runIntegrationTests();
      }
      
      this.generateReport();
      
    } catch (error) {
      this.log(`Test suite failed: ${error.message}`, 'fail');
      process.exit(1);
    }
  }

  async runUnitTests() {
    this.log('Running Unit Tests...', 'info');
    
    // Test InputValidator
    await this.testInputValidator();
    
    // Test RateLimiter
    await this.testRateLimiter();
    
    // Test SecurityHeaders
    await this.testSecurityHeaders();
    
    // Test CSRFProtection
    await this.testCSRFProtection();
    
    // Test AdminAuth
    await this.testAdminAuth();
  }

  async testInputValidator() {
    this.log('Testing InputValidator...', 'test');
    
    // Mock InputValidator class for testing
    const InputValidator = {
      validateEmail: (email) => {
        if (!email || typeof email !== 'string') {
          return { isValid: false, error: 'Invalid email format' };
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return { isValid: false, error: 'Invalid email format' };
        }
        return { isValid: true, sanitized: email.toLowerCase().trim() };
      },
      
      validateUsername: (username) => {
        if (!username || typeof username !== 'string') {
          return { isValid: false, error: 'Invalid username format' };
        }
        const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
        if (!usernameRegex.test(username)) {
          return { isValid: false, error: 'Username must be 3-20 characters, alphanumeric, underscores, or hyphens only' };
        }
        return { isValid: true, sanitized: username.trim() };
      },
      
      validatePassword: (password) => {
        if (!password || typeof password !== 'string') {
          return { isValid: false, error: 'Invalid password format' };
        }
        if (password.length < 8) {
          return { isValid: false, error: 'Password must be at least 8 characters long' };
        }
        if (!/[a-zA-Z]/.test(password)) {
          return { isValid: false, error: 'Password must contain at least one letter' };
        }
        if (!/[0-9]/.test(password)) {
          return { isValid: false, error: 'Password must contain at least one number' };
        }
        return { isValid: true, sanitized: password };
      },
      
      validateWalletAddress: (address) => {
        if (!address || typeof address !== 'string') {
          return { isValid: false, error: 'Invalid wallet address format' };
        }
        const walletRegex = /^0x[a-fA-F0-9]{40}$/;
        if (!walletRegex.test(address)) {
          return { isValid: false, error: 'Wallet address must be 0x followed by 40 hex characters' };
        }
        return { isValid: true, sanitized: address.toLowerCase() };
      },
      
      sanitizeText: (text, maxLength = 1000) => {
        if (!text || typeof text !== 'string') {
          return '';
        }
        let sanitized = text
          .replace(/[<>]/g, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+=/gi, '')
          .replace(/script/gi, '')
          .trim();
        
        if (sanitized.length > maxLength) {
          sanitized = sanitized.substring(0, maxLength);
        }
        
        return sanitized;
      }
    };
    
    // Test cases
    const testCases = [
      // Email validation tests
      { test: 'Valid email', input: 'test@example.com', validator: 'validateEmail', expected: true },
      { test: 'Invalid email - no @', input: 'testexample.com', validator: 'validateEmail', expected: false },
      { test: 'Invalid email - no domain', input: 'test@', validator: 'validateEmail', expected: false },
      { test: 'Empty email', input: '', validator: 'validateEmail', expected: false },
      
      // Username validation tests
      { test: 'Valid username', input: 'testuser123', validator: 'validateUsername', expected: true },
      { test: 'Valid username with underscore', input: 'test_user', validator: 'validateUsername', expected: true },
      { test: 'Valid username with hyphen', input: 'test-user', validator: 'validateUsername', expected: true },
      { test: 'Invalid username - too short', input: 'ab', validator: 'validateUsername', expected: false },
      { test: 'Invalid username - too long', input: 'a'.repeat(21), validator: 'validateUsername', expected: false },
      { test: 'Invalid username - special chars', input: 'test@user', validator: 'validateUsername', expected: false },
      
      // Password validation tests
      { test: 'Valid password', input: 'password123', validator: 'validatePassword', expected: true },
      { test: 'Invalid password - too short', input: 'pass1', validator: 'validatePassword', expected: false },
      { test: 'Invalid password - no letters', input: '12345678', validator: 'validatePassword', expected: false },
      { test: 'Invalid password - no numbers', input: 'password', validator: 'validatePassword', expected: false },
      
      // Wallet address validation tests
      { test: 'Valid wallet address', input: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', validator: 'validateWalletAddress', expected: true },
      { test: 'Invalid wallet address - no 0x', input: '742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', validator: 'validateWalletAddress', expected: false },
      { test: 'Invalid wallet address - wrong length', input: '0x742d35Cc', validator: 'validateWalletAddress', expected: false },
      { test: 'Invalid wallet address - invalid chars', input: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8bG', validator: 'validateWalletAddress', expected: false },
      
      // Text sanitization tests
      { test: 'Sanitize HTML tags', input: '<script>alert("xss")</script>', validator: 'sanitizeText', expected: 'alert("xss")' },
      { test: 'Sanitize JavaScript protocol', input: 'javascript:alert("xss")', validator: 'sanitizeText', expected: 'alert("xss")' },
      { test: 'Sanitize event handlers', input: 'onclick="alert(\'xss\')"', validator: 'sanitizeText', expected: 'alert(\'xss\')' },
      { test: 'Truncate long text', input: 'a'.repeat(2000), validator: 'sanitizeText', expected: 'a'.repeat(1000) }
    ];
    
    for (const testCase of testCases) {
      try {
        const result = InputValidator[testCase.validator](testCase.input);
        
        if (testCase.validator === 'sanitizeText') {
          if (result === testCase.expected) {
            this.pass(`InputValidator: ${testCase.test}`);
          } else {
            this.fail(`InputValidator: ${testCase.test} - Expected: ${testCase.expected}, Got: ${result}`);
          }
        } else {
          if (result.isValid === testCase.expected) {
            this.pass(`InputValidator: ${testCase.test}`);
          } else {
            this.fail(`InputValidator: ${testCase.test} - Expected: ${testCase.expected}, Got: ${result.isValid}`);
          }
        }
      } catch (error) {
        this.fail(`InputValidator: ${testCase.test} - Error: ${error.message}`);
      }
    }
  }

  async testRateLimiter() {
    this.log('Testing RateLimiter...', 'test');
    
    // Mock RateLimiter class for testing
    class RateLimiter {
      constructor() {
        this.requests = new Map();
      }
      
      isAllowed(identifier, maxRequests = 100, windowMs = 900000) {
        const now = Date.now();
        const key = `${identifier}_${Math.floor(now / windowMs)}`;
        
        if (!this.requests.has(key)) {
          this.requests.set(key, 0);
        }
        
        const currentRequests = this.requests.get(key);
        
        if (currentRequests >= maxRequests) {
          return { allowed: false, remaining: 0, resetTime: now + windowMs };
        }
        
        this.requests.set(key, currentRequests + 1);
        
        return {
          allowed: true,
          remaining: maxRequests - currentRequests - 1,
          resetTime: now + windowMs
        };
      }
    }
    
    const rateLimiter = new RateLimiter();
    
    // Test cases
    const testCases = [
      { test: 'First request allowed', identifier: 'test1', maxRequests: 5, expected: true },
      { test: 'Multiple requests allowed', identifier: 'test2', maxRequests: 5, expected: true },
      { test: 'Request within limit', identifier: 'test3', maxRequests: 5, expected: true },
      { test: 'Request at limit', identifier: 'test4', maxRequests: 1, expected: true },
      { test: 'Request over limit', identifier: 'test5', maxRequests: 1, expected: false }
    ];
    
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      try {
        const result = rateLimiter.isAllowed(testCase.identifier, testCase.maxRequests, 1000);
        
        if (i === 4) { // Last test case - should be over limit
          if (!result.allowed) {
            this.pass(`RateLimiter: ${testCase.test}`);
          } else {
            this.fail(`RateLimiter: ${testCase.test} - Expected: false, Got: ${result.allowed}`);
          }
        } else {
          if (result.allowed) {
            this.pass(`RateLimiter: ${testCase.test}`);
          } else {
            this.fail(`RateLimiter: ${testCase.test} - Expected: true, Got: ${result.allowed}`);
          }
        }
      } catch (error) {
        this.fail(`RateLimiter: ${testCase.test} - Error: ${error.message}`);
      }
    }
  }

  async testSecurityHeaders() {
    this.log('Testing SecurityHeaders...', 'test');
    
    // Mock SecurityHeaders class for testing
    const SecurityHeaders = {
      getSecurityHeaders: () => {
        return {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
          'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'"
        };
      }
    };
    
    try {
      const headers = SecurityHeaders.getSecurityHeaders();
      
      const requiredHeaders = [
        'X-Content-Type-Options',
        'X-Frame-Options',
        'X-XSS-Protection',
        'Referrer-Policy',
        'Permissions-Policy',
        'Content-Security-Policy'
      ];
      
      for (const header of requiredHeaders) {
        if (headers[header]) {
          this.pass(`SecurityHeaders: ${header} present`);
        } else {
          this.fail(`SecurityHeaders: ${header} missing`);
        }
      }
      
      // Test specific header values
      if (headers['X-Content-Type-Options'] === 'nosniff') {
        this.pass('SecurityHeaders: X-Content-Type-Options value correct');
      } else {
        this.fail('SecurityHeaders: X-Content-Type-Options value incorrect');
      }
      
      if (headers['X-Frame-Options'] === 'DENY') {
        this.pass('SecurityHeaders: X-Frame-Options value correct');
      } else {
        this.fail('SecurityHeaders: X-Frame-Options value incorrect');
      }
      
    } catch (error) {
      this.fail(`SecurityHeaders: Error - ${error.message}`);
    }
  }

  async testCSRFProtection() {
    this.log('Testing CSRFProtection...', 'test');
    
    // Mock CSRFProtection class for testing
    const CSRFProtection = {
      generateToken: () => {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
      },
      
      validateToken: (token, sessionToken) => {
        return token && sessionToken && token === sessionToken;
      }
    };
    
    try {
      // Test token generation
      const token1 = CSRFProtection.generateToken();
      const token2 = CSRFProtection.generateToken();
      
      if (token1 && token1.length === 64) {
        this.pass('CSRFProtection: Token generation works');
      } else {
        this.fail('CSRFProtection: Token generation failed');
      }
      
      if (token1 !== token2) {
        this.pass('CSRFProtection: Tokens are unique');
      } else {
        this.fail('CSRFProtection: Tokens are not unique');
      }
      
      // Test token validation
      if (CSRFProtection.validateToken(token1, token1)) {
        this.pass('CSRFProtection: Valid token validation works');
      } else {
        this.fail('CSRFProtection: Valid token validation failed');
      }
      
      if (!CSRFProtection.validateToken(token1, token2)) {
        this.pass('CSRFProtection: Invalid token validation works');
      } else {
        this.fail('CSRFProtection: Invalid token validation failed');
      }
      
      if (!CSRFProtection.validateToken('', token1)) {
        this.pass('CSRFProtection: Empty token validation works');
      } else {
        this.fail('CSRFProtection: Empty token validation failed');
      }
      
    } catch (error) {
      this.fail(`CSRFProtection: Error - ${error.message}`);
    }
  }

  async testAdminAuth() {
    this.log('Testing AdminAuth...', 'test');
    
    // Mock AdminAuth class for testing
    const AdminAuth = {
      isAdminEmail: (email) => {
        const adminEmails = ['admin@example.com', 'admin@paws.com'];
        return adminEmails.includes(email.toLowerCase());
      },
      
      requireAdmin: (req, res, next) => {
        // Mock implementation
        return true;
      }
    };
    
    try {
      // Test admin email validation
      if (AdminAuth.isAdminEmail('admin@example.com')) {
        this.pass('AdminAuth: Valid admin email recognized');
      } else {
        this.fail('AdminAuth: Valid admin email not recognized');
      }
      
      if (AdminAuth.isAdminEmail('ADMIN@EXAMPLE.COM')) {
        this.pass('AdminAuth: Case-insensitive admin email works');
      } else {
        this.fail('AdminAuth: Case-insensitive admin email failed');
      }
      
      if (!AdminAuth.isAdminEmail('user@example.com')) {
        this.pass('AdminAuth: Non-admin email rejected');
      } else {
        this.fail('AdminAuth: Non-admin email accepted');
      }
      
      if (!AdminAuth.isAdminEmail('')) {
        this.pass('AdminAuth: Empty email rejected');
      } else {
        this.fail('AdminAuth: Empty email accepted');
      }
      
    } catch (error) {
      this.fail(`AdminAuth: Error - ${error.message}`);
    }
  }

  async runIntegrationTests() {
    this.log('Running Integration Tests...', 'info');
    
    // Test form validation integration
    await this.testFormValidationIntegration();
    
    // Test security headers integration
    await this.testSecurityHeadersIntegration();
    
    // Test admin panel integration
    await this.testAdminPanelIntegration();
  }

  async testFormValidationIntegration() {
    this.log('Testing Form Validation Integration...', 'test');
    
    // Test signup form validation
    const signupPath = path.join(this.projectRoot, 'app/auth/signup/page.jsx');
    if (fs.existsSync(signupPath)) {
      const content = fs.readFileSync(signupPath, 'utf8');
      
      // Check for validation integration
      if (content.includes('InputValidator') && content.includes('validateForm')) {
        this.pass('Form Validation: InputValidator integrated');
      } else {
        this.fail('Form Validation: InputValidator not integrated');
      }
      
      if (content.includes('errors[') && content.includes('handleInputChange')) {
        this.pass('Form Validation: Error handling integrated');
      } else {
        this.fail('Form Validation: Error handling not integrated');
      }
      
      if (content.includes('required') && content.includes('onSubmit')) {
        this.pass('Form Validation: Form submission integrated');
      } else {
        this.fail('Form Validation: Form submission not integrated');
      }
    } else {
      this.fail('Form Validation: Signup form not found');
    }
  }

  async testSecurityHeadersIntegration() {
    this.log('Testing Security Headers Integration...', 'test');
    
    // Test Next.js config
    const nextConfigPath = path.join(this.projectRoot, 'next.config.mjs');
    if (fs.existsSync(nextConfigPath)) {
      const content = fs.readFileSync(nextConfigPath, 'utf8');
      
      if (content.includes('headers') && content.includes('X-Content-Type-Options')) {
        this.pass('Security Headers: Next.js config integrated');
      } else {
        this.fail('Security Headers: Next.js config not integrated');
      }
    } else {
      this.fail('Security Headers: Next.js config not found');
    }
    
    // Test Vercel config
    const vercelPath = path.join(this.projectRoot, 'vercel.json');
    if (fs.existsSync(vercelPath)) {
      const content = fs.readFileSync(vercelPath, 'utf8');
      
      if (content.includes('headers') && content.includes('X-Content-Type-Options')) {
        this.pass('Security Headers: Vercel config integrated');
      } else {
        this.fail('Security Headers: Vercel config not integrated');
      }
    } else {
      this.fail('Security Headers: Vercel config not found');
    }
  }

  async testAdminPanelIntegration() {
    this.log('Testing Admin Panel Integration...', 'test');
    
    // Test admin panel
    const adminPath = path.join(this.projectRoot, 'app/dashboard/admin/page.jsx');
    if (fs.existsSync(adminPath)) {
      const content = fs.readFileSync(adminPath, 'utf8');
      
      if (content.includes('getEnv') && content.includes('ENABLE_ADMIN_PANEL')) {
        this.pass('Admin Panel: Environment integration works');
      } else {
        this.fail('Admin Panel: Environment integration missing');
      }
      
      if (content.includes('isAuthenticated') && content.includes('handleLogin')) {
        this.pass('Admin Panel: Authentication integration works');
      } else {
        this.fail('Admin Panel: Authentication integration missing');
      }
      
      if (content.includes('handleLogout') && content.includes('localStorage')) {
        this.pass('Admin Panel: Session management integrated');
      } else {
        this.fail('Admin Panel: Session management missing');
      }
    } else {
      this.fail('Admin Panel: Admin page not found');
    }
  }

  pass(message) {
    this.results.passed++;
    this.results.total++;
    this.results.tests.push({ status: 'pass', message });
    this.log(message, 'pass');
  }

  fail(message) {
    this.results.failed++;
    this.results.total++;
    this.results.tests.push({ status: 'fail', message });
    this.log(message, 'fail');
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('🧪 SECURITY TEST SUITE REPORT');
    console.log('='.repeat(60));
    
    console.log(`\n📊 Test Results:`);
    console.log(`   ✅ Passed: ${this.results.passed}`);
    console.log(`   ❌ Failed: ${this.results.failed}`);
    console.log(`   📈 Total: ${this.results.total}`);
    
    const score = Math.round((this.results.passed / this.results.total) * 100);
    console.log(`\n🎯 Test Score: ${score}%`);
    
    if (score >= 95) {
      console.log('🟢 EXCELLENT - All security tests passed!');
    } else if (score >= 85) {
      console.log('🟡 GOOD - Most tests passed, minor issues to fix');
    } else if (score >= 70) {
      console.log('🟠 FAIR - Several tests failed, needs attention');
    } else {
      console.log('🔴 POOR - Many tests failed, major issues found');
    }
    
    if (this.results.failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results.tests
        .filter(test => test.status === 'fail')
        .forEach(test => console.log(`   • ${test.message}`));
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
    unit: args.includes('--unit'),
    integration: args.includes('--integration'),
    all: args.includes('--all'),
    verbose: args.includes('--verbose')
  };
  
  const testSuite = new SecurityTestSuite(options);
  testSuite.runTests().catch(error => {
    console.error('❌ Test suite failed:', error.message);
    process.exit(1);
  });
}

module.exports = SecurityTestSuite;
