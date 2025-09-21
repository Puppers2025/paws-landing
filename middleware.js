import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth/signup',
  '/auth/wallet',
  '/404',
  '/api/auth/wallet',
  '/api/discord/test-notifications'
]

// Admin bypass for development
const ADMIN_BYPASS_KEY = process.env.ADMIN_BYPASS_KEY || 'dev-admin-2024'

export function middleware(request) {
  const { pathname } = request.nextUrl
  
  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Check for admin bypass
  const adminKey = request.headers.get('x-admin-key')
  if (adminKey === ADMIN_BYPASS_KEY) {
    console.log('🔓 Admin bypass activated for:', pathname)
    return NextResponse.next()
  }

  // Check for authentication token
  const token = request.cookies.get('auth-token')?.value
  
  if (!token) {
    console.log('🚫 No auth token found, redirecting to signup')
    return NextResponse.redirect(new URL('/auth/signup', request.url))
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Check if token is expired
    if (decoded.exp < Date.now() / 1000) {
      console.log('⏰ Token expired, redirecting to signup')
      return NextResponse.redirect(new URL('/auth/signup', request.url))
    }

    // Add user info to headers for use in components
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', decoded.userId)
    requestHeaders.set('x-user-wallet', decoded.walletAddress || '')
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    console.log('❌ Invalid token, redirecting to signup:', error.message)
    return NextResponse.redirect(new URL('/auth/signup', request.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
