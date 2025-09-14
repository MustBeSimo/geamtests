import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Constants moved outside function for better performance
const PUBLIC_ROUTES = new Set([
  '/',
  '/login',
  '/privacy',
  '/terms',
  '/subscribe'
]);

const PUBLIC_API_PREFIXES = [
  '/api/public/',
  '/api/horoscope',
  '/api/generate-pdf',
  '/api/chat' // Allow chat API to handle its own auth (supports both demo and authenticated requests)
];

// Helper function to check if route is public
function isPublicRoute(pathname: string): boolean {
  // Check exact matches first (fastest)
  if (PUBLIC_ROUTES.has(pathname)) {
    return true;
  }
  
  // Check API prefixes
  return PUBLIC_API_PREFIXES.some(prefix => pathname.startsWith(prefix));
}

// Helper function to check if route requires authentication
function requiresAuth(pathname: string): boolean {
  // Auth routes handle their own authentication
  if (pathname.startsWith('/api/auth/')) {
    return false;
  }
  
  // Webhook routes don't have user sessions
  if (pathname.startsWith('/api/webhooks/')) {
    return false;
  }
  
  return pathname.startsWith('/api/') && !isPublicRoute(pathname);
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  
  // Early return for public routes - no auth check needed
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  try {
    // Only refresh session for routes that might need authentication
    const { data: { session }, error } = await supabase.auth.getSession();

    // Handle session errors
    if (error) {
      console.error('Session error:', error);
      
      // For API routes, return JSON error
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Session expired. Please sign in again.' },
          { status: 401 }
        );
      }
      
      // For protected pages, redirect to login
      const redirectUrl = new URL('/login', req.url);
      redirectUrl.searchParams.set('error', 'Session expired. Please sign in again.');
      return NextResponse.redirect(redirectUrl);
    }

    // Check authentication requirement for API routes
    if (requiresAuth(pathname) && !session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    
    // For critical API routes, return error instead of allowing through
    if (requiresAuth(pathname)) {
      return NextResponse.json(
        { error: 'Authentication service unavailable' },
        { status: 503 }
      );
    }
    
    // For other routes, allow request to proceed
    return res;
  }
}

// Optimized matcher - exclude more static assets and reduce processing
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)  
     * - favicon.ico, sw.js (PWA files)
     * - public folder assets
     * - API routes that don't need auth checking
     */
    '/((?!_next/static|_next/image|favicon.ico|sw.js|workbox-.*\\.js|manifest.json|icons/|images/).*)',
  ],
}; 