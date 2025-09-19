// Security middleware for Paws Landing
// Provides authentication and authorization checks

import { NextResponse } from 'next/server';
import { getEnv } from './env.js';

/**
 * Authentication middleware
 */
export function requireAuth(request) {
  // In a real application, you would check for a valid JWT token or session
  // For now, we'll implement a basic check
  
  const authHeader = request.headers.get('authorization');
  const sessionCookie = request.cookies.get('admin_session');
  
  // Check if user is authenticated
  if (!authHeader && !sessionCookie) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }
  
  return null; // No error, continue
}

/**
 * Admin authorization middleware
 */
export function requireAdmin(request) {
  // Check if admin panel is enabled
  if (getEnv('ENABLE_ADMIN_PANEL') !== true) {
    return NextResponse.json(
      { error: 'Admin panel is disabled' },
      { status: 403 }
    );
  }
  
  // In a real application, you would check for admin role
  // For now, we'll just check if user is authenticated
  const authError = requireAuth(request);
  if (authError) {
    return authError;
  }
  
  return null; // No error, continue
}

/**
 * Rate limiting middleware
 */
export function rateLimit(request, maxRequests = 100, windowMs = 900000) {
  // This would be implemented with a proper rate limiting service
  // For now, we'll just return null (no rate limiting)
  return null;
}

/**
 * CSRF protection middleware
 */
export function csrfProtection(request) {
  // Check for CSRF token in headers
  const csrfToken = request.headers.get('x-csrf-token');
  const sessionToken = request.cookies.get('csrf-token');
  
  if (!csrfToken || !sessionToken || csrfToken !== sessionToken.value) {
    return NextResponse.json(
      { error: 'CSRF token mismatch' },
      { status: 403 }
    );
  }
  
  return null; // No error, continue
}

/**
 * Input validation middleware
 */
export function validateInput(request, schema) {
  // This would validate the request body against a schema
  // For now, we'll just return null (no validation)
  return null;
}

/**
 * Security headers middleware
 */
export function securityHeaders() {
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

/**
 * Combine multiple middleware functions
 */
export function combineMiddleware(...middlewares) {
  return async (request) => {
    for (const middleware of middlewares) {
      const result = await middleware(request);
      if (result) {
        return result; // Return error response
      }
    }
    return null; // No errors, continue
  };
}

/**
 * Common middleware combinations
 */
export const middleware = {
  // Public routes (no auth required)
  public: combineMiddleware(
    rateLimit,
    (request) => NextResponse.next({ headers: securityHeaders() })
  ),
  
  // Authenticated routes
  authenticated: combineMiddleware(
    requireAuth,
    rateLimit,
    (request) => NextResponse.next({ headers: securityHeaders() })
  ),
  
  // Admin routes
  admin: combineMiddleware(
    requireAdmin,
    rateLimit,
    csrfProtection,
    (request) => NextResponse.next({ headers: securityHeaders() })
  ),
  
  // API routes
  api: combineMiddleware(
    rateLimit,
    validateInput,
    (request) => NextResponse.next({ headers: securityHeaders() })
  )
};
