// Security utilities for Paws Landing
// Based on the comprehensive security measures from puppers-discord

/**
 * Input validation and sanitization utilities
 */
export class InputValidator {
  // Wallet address validation (0x + 40 hex characters)
  static validateWalletAddress(address) {
    if (!address || typeof address !== 'string') {
      return { isValid: false, error: 'Invalid wallet address format' };
    }
    
    const walletRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!walletRegex.test(address)) {
      return { isValid: false, error: 'Wallet address must be 0x followed by 40 hex characters' };
    }
    
    return { isValid: true, sanitized: address.toLowerCase() };
  }

  // Email validation
  static validateEmail(email) {
    if (!email || typeof email !== 'string') {
      return { isValid: false, error: 'Invalid email format' };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Invalid email format' };
    }
    
    return { isValid: true, sanitized: email.toLowerCase().trim() };
  }

  // Username validation (alphanumeric, underscores, hyphens, 3-20 chars)
  static validateUsername(username) {
    if (!username || typeof username !== 'string') {
      return { isValid: false, error: 'Invalid username format' };
    }
    
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return { isValid: false, error: 'Username must be 3-20 characters, alphanumeric, underscores, or hyphens only' };
    }
    
    return { isValid: true, sanitized: username.trim() };
  }

  // Password validation (8+ chars, at least one letter and one number)
  static validatePassword(password) {
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
  }

  // Text sanitization (removes dangerous characters and XSS patterns)
  static sanitizeText(text, maxLength = 1000) {
    if (!text || typeof text !== 'string') {
      return '';
    }
    
    // Remove dangerous characters and patterns
    let sanitized = text
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .replace(/script/gi, '') // Remove script tags
      .replace(/iframe/gi, '') // Remove iframe tags
      .replace(/object/gi, '') // Remove object tags
      .replace(/embed/gi, '') // Remove embed tags
      .replace(/form/gi, '') // Remove form tags
      .replace(/input/gi, '') // Remove input tags
      .replace(/button/gi, '') // Remove button tags
      .replace(/link/gi, '') // Remove link tags
      .replace(/meta/gi, '') // Remove meta tags
      .replace(/style/gi, '') // Remove style tags
      .replace(/link/gi, '') // Remove link tags
      .replace(/base/gi, '') // Remove base tags
      .replace(/applet/gi, '') // Remove applet tags
      .replace(/frame/gi, '') // Remove frame tags
      .replace(/frameset/gi, '') // Remove frameset tags
      .replace(/noframes/gi, '') // Remove noframes tags
      .replace(/noscript/gi, '') // Remove noscript tags
      .replace(/plaintext/gi, '') // Remove plaintext tags
      .replace(/xmp/gi, '') // Remove xmp tags
      .replace(/listing/gi, '') // Remove listing tags
      .replace(/textarea/gi, '') // Remove textarea tags
      .replace(/select/gi, '') // Remove select tags
      .replace(/option/gi, '') // Remove option tags
      .replace(/optgroup/gi, '') // Remove optgroup tags
      .replace(/fieldset/gi, '') // Remove fieldset tags
      .replace(/legend/gi, '') // Remove legend tags
      .replace(/label/gi, '') // Remove label tags
      .replace(/button/gi, '') // Remove button tags
      .replace(/input/gi, '') // Remove input tags
      .replace(/form/gi, '') // Remove form tags
      .replace(/isindex/gi, '') // Remove isindex tags
      .replace(/keygen/gi, '') // Remove keygen tags
      .replace(/menu/gi, '') // Remove menu tags
      .replace(/menuitem/gi, '') // Remove menuitem tags
      .replace(/command/gi, '') // Remove command tags
      .replace(/details/gi, '') // Remove details tags
      .replace(/summary/gi, '') // Remove summary tags
      .replace(/dialog/gi, '') // Remove dialog tags
      .replace(/menu/gi, '') // Remove menu tags
      .replace(/menuitem/gi, '') // Remove menuitem tags
      .replace(/command/gi, '') // Remove command tags
      .replace(/details/gi, '') // Remove details tags
      .replace(/summary/gi, '') // Remove summary tags
      .replace(/dialog/gi, '') // Remove dialog tags
      .replace(/menu/gi, '') // Remove menu tags
      .replace(/menuitem/gi, '') // Remove menuitem tags
      .replace(/command/gi, '') // Remove command tags
      .replace(/details/gi, '') // Remove details tags
      .replace(/summary/gi, '') // Remove summary tags
      .replace(/dialog/gi, '') // Remove dialog tags
      .trim();
    
    // Limit length
    if (sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength);
    }
    
    return sanitized;
  }

  // URL validation
  static validateUrl(url) {
    if (!url || typeof url !== 'string') {
      return { isValid: false, error: 'Invalid URL format' };
    }
    
    try {
      const urlObj = new URL(url);
      // Only allow http and https protocols
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return { isValid: false, error: 'Only HTTP and HTTPS URLs are allowed' };
      }
      return { isValid: true, sanitized: urlObj.toString() };
    } catch (error) {
      return { isValid: false, error: 'Invalid URL format' };
    }
  }

  // General input validation with length limits
  static validateInput(input, options = {}) {
    const {
      type = 'text',
      required = false,
      minLength = 0,
      maxLength = 1000,
      allowHtml = false
    } = options;
    
    if (required && (!input || input.trim() === '')) {
      return { isValid: false, error: 'This field is required' };
    }
    
    if (!input || input.trim() === '') {
      return { isValid: true, sanitized: '' };
    }
    
    if (input.length < minLength) {
      return { isValid: false, error: `Minimum length is ${minLength} characters` };
    }
    
    if (input.length > maxLength) {
      return { isValid: false, error: `Maximum length is ${maxLength} characters` };
    }
    
    let sanitized = input.trim();
    
    if (!allowHtml) {
      sanitized = this.sanitizeText(sanitized, maxLength);
    }
    
    return { isValid: true, sanitized };
  }
}

/**
 * Rate limiting utilities
 */
export class RateLimiter {
  constructor() {
    this.requests = new Map();
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000); // Cleanup every 5 minutes
  }

  // Check if request is allowed
  isAllowed(identifier, maxRequests = 100, windowMs = 900000) { // 15 minutes default
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

  // Cleanup old entries
  cleanup() {
    const now = Date.now();
    const cutoff = now - (24 * 60 * 60 * 1000); // 24 hours ago
    
    for (const [key, timestamp] of this.requests.entries()) {
      if (timestamp < cutoff) {
        this.requests.delete(key);
      }
    }
  }

  // Destroy the rate limiter
  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.requests.clear();
  }
}

/**
 * Security headers and CSP utilities
 */
export class SecurityHeaders {
  static getSecurityHeaders() {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "font-src 'self' data:",
        "connect-src 'self' https:",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'"
      ].join('; ')
    };
  }
}

/**
 * CSRF protection utilities
 */
export class CSRFProtection {
  static generateToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  static validateToken(token, sessionToken) {
    return token && sessionToken && token === sessionToken;
  }
}

/**
 * Admin authentication utilities
 */
export class AdminAuth {
  static isAdminEmail(email) {
    const adminEmails = process.env.ADMIN_EMAIL?.split(',') || ['admin@example.com'];
    return adminEmails.includes(email.toLowerCase());
  }

  static requireAdmin(req, res, next) {
    // This would be implemented with proper session management
    // For now, we'll just check if admin panel is enabled
    if (process.env.ENABLE_ADMIN_PANEL !== 'true') {
      return res.status(403).json({ error: 'Admin panel is disabled' });
    }
    
    // In a real implementation, you'd check session/token here
    next();
  }
}

// Export rate limiter instance
export const rateLimiter = new RateLimiter();
