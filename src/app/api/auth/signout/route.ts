import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  // Server-side sign out to clear all cookies and sessions
  await supabase.auth.signOut();

  return NextResponse.json({
    success: true,
    message: 'Signed out successfully',
  });
}

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  // Server-side sign out to clear all cookies and sessions
  await supabase.auth.signOut();

  // Redirect to home page
  return NextResponse.redirect(new URL('/', request.url));
}
