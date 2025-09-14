import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/';

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });

    try {
      await supabase.auth.exchangeCodeForSession(code);
    } catch (error) {
      console.error('Error exchanging code for session:', error);
      // Redirect to home with error message
      return NextResponse.redirect(
        new URL('/?error=auth_error', requestUrl.origin)
      );
    }
  }

  // Redirect to the home page or wherever the user was trying to go
  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
