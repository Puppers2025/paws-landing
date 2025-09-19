// Secure API route handler for Paws Landing
// Provides security middleware for API routes

import { NextResponse } from 'next/server';
import { InputValidator, rateLimiter, SecurityHeaders, CSRFProtection } from './security.js';
import { getEnv, isDebugMode } from './env.js';

/**
 * Secure API route handler with built-in security measures
 */
export class SecureApiHandler {
  constructor(options = {}) {
    this.options = {
      requireAuth: false,
      requireAdmin: false,
      rateLimit: true,
      maxRequests: getEnv('RATE_LIMIT_MAX_REQUESTS') || 100,
      windowMs: getEnv('RATE_LIMIT_WINDOW_MS') || 900000,
      validateInput: true,
      ...options
    };
  }

  /**
   * Main handler function
   */
  async handle(request, handler) {
    try {
      // Apply security middleware
      const securityResult = await this.applySecurityMiddleware(request);
      if (!securityResult.success) {
        return this.errorResponse(securityResult.error, securityResult.status);
      }

      // Execute the actual handler
      const result = await handler(request, securityResult.data);
      
      // Return success response with security headers
      return this.successResponse(result);
    } catch (error) {
      console.error('API Error:', error);
      return this.errorResponse(
        isDebugMode() ? error.message : 'Internal server error',
        500
      );
    }
  }

  /**
   * Apply security middleware
   */
  async applySecurityMiddleware(request) {
    // Rate limiting
    if (this.options.rateLimit) {
      const clientId = this.getClientId(request);
      const rateLimitResult = rateLimiter.isAllowed(
        clientId,
        this.options.maxRequests,
        this.options.windowMs
      );
      
      if (!rateLimitResult.allowed) {
        return {
          success: false,
          error: 'Rate limit exceeded',
          status: 429
        };
      }
    }

    // Input validation
    if (this.options.validateInput) {
      const validationResult = await this.validateRequest(request);
      if (!validationResult.success) {
        return validationResult;
      }
    }

    // Authentication check
    if (this.options.requireAuth) {
      const authResult = await this.checkAuthentication(request);
      if (!authResult.success) {
        return authResult;
      }
    }

    // Admin check
    if (this.options.requireAdmin) {
      const adminResult = await this.checkAdminAccess(request);
      if (!adminResult.success) {
        return adminResult;
      }
    }

    return { success: true, data: {} };
  }

  /**
   * Validate request input
   */
  async validateRequest(request) {
    try {
      const body = await request.json();
      
      // Validate each field based on its type
      for (const [key, value] of Object.entries(body)) {
        let validationResult;
        
        switch (key) {
          case 'email':
            validationResult = InputValidator.validateEmail(value);
            break;
          case 'username':
            validationResult = InputValidator.validateUsername(value);
            break;
          case 'password':
            validationResult = InputValidator.validatePassword(value);
            break;
          case 'walletAddress':
            validationResult = InputValidator.validateWalletAddress(value);
            break;
          case 'url':
            validationResult = InputValidator.validateUrl(value);
            break;
          default:
            validationResult = InputValidator.validateInput(value, {
              maxLength: 1000,
              allowHtml: false
            });
        }
        
        if (!validationResult.isValid) {
          return {
            success: false,
            error: `${key}: ${validationResult.error}`,
            status: 400
          };
        }
      }
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: 'Invalid request format',
        status: 400
      };
    }
  }

  /**
   * Check authentication
   */
  async checkAuthentication(request) {
    // This would be implemented with proper session management
    // For now, we'll just return success
    return { success: true };
  }

  /**
   * Check admin access
   */
  async checkAdminAccess(request) {
    if (getEnv('ENABLE_ADMIN_PANEL') !== true) {
      return {
        success: false,
        error: 'Admin panel is disabled',
        status: 403
      };
    }
    
    // This would be implemented with proper admin authentication
    // For now, we'll just return success
    return { success: true };
  }

  /**
   * Get client identifier for rate limiting
   */
  getClientId(request) {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
    return ip;
  }

  /**
   * Create success response
   */
  successResponse(data, status = 200) {
    return NextResponse.json(
      { success: true, data },
      {
        status,
        headers: SecurityHeaders.getSecurityHeaders()
      }
    );
  }

  /**
   * Create error response
   */
  errorResponse(message, status = 400) {
    return NextResponse.json(
      { success: false, error: message },
      {
        status,
        headers: SecurityHeaders.getSecurityHeaders()
      }
    );
  }
}

/**
 * Create a secure API handler
 */
export function createSecureHandler(options = {}) {
  const handler = new SecureApiHandler(options);
  return handler.handle.bind(handler);
}

/**
 * Common API handlers
 */
export const handlers = {
  // Public API handler (no auth required)
  public: createSecureHandler({
    requireAuth: false,
    requireAdmin: false,
    rateLimit: true,
    validateInput: true
  }),

  // Authenticated API handler
  authenticated: createSecureHandler({
    requireAuth: true,
    requireAdmin: false,
    rateLimit: true,
    validateInput: true
  }),

  // Admin API handler
  admin: createSecureHandler({
    requireAuth: true,
    requireAdmin: true,
    rateLimit: true,
    validateInput: true
  }),

  // No rate limiting (for internal use)
  internal: createSecureHandler({
    requireAuth: false,
    requireAdmin: false,
    rateLimit: false,
    validateInput: true
  })
};
