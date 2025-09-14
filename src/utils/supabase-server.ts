import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Standardized error response helper
export function createErrorResponse(
  message: string,
  status: number,
  code?: string,
  details?: Record<string, unknown>
) {
  return NextResponse.json(
    {
      error: message,
      code: code || `HTTP_${status}`,
      timestamp: new Date().toISOString(),
      ...(details && { details }),
    },
    { status }
  );
}

// Common error responses
export const ErrorResponses = {
  unauthorized: () =>
    createErrorResponse('Unauthorized access', 401, 'UNAUTHORIZED'),
  forbidden: () => createErrorResponse('Access forbidden', 403, 'FORBIDDEN'),
  notFound: (resource?: string) =>
    createErrorResponse(
      resource ? `${resource} not found` : 'Resource not found',
      404,
      'NOT_FOUND'
    ),
  badRequest: (message: string = 'Invalid request') =>
    createErrorResponse(message, 400, 'BAD_REQUEST'),
  paymentRequired: (message: string = 'Payment required') =>
    createErrorResponse(message, 402, 'PAYMENT_REQUIRED'),
  rateLimit: () =>
    createErrorResponse('Too many requests', 429, 'RATE_LIMITED'),
  serverError: (message: string = 'Internal server error') =>
    createErrorResponse(message, 500, 'SERVER_ERROR'),
  serviceUnavailable: (service?: string) =>
    createErrorResponse(
      service
        ? `${service} is temporarily unavailable`
        : 'Service temporarily unavailable',
      503,
      'SERVICE_UNAVAILABLE'
    ),
  timeout: (operation?: string) =>
    createErrorResponse(
      operation ? `${operation} timed out` : 'Request timed out',
      504,
      'TIMEOUT'
    ),
};

// Helper function for API route authentication
export async function authenticateApiRoute() {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('Session error:', sessionError);
      throw sessionError;
    }

    if (!session) {
      return {
        response: ErrorResponses.unauthorized(),
        session: null,
        supabase: null,
      };
    }

    return {
      response: null,
      session,
      supabase,
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      response: ErrorResponses.serverError('Authentication failed'),
      session: null,
      supabase: null,
    };
  }
}
