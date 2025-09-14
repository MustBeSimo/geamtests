import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const body = await request.json();

    const { data: { session } } = await supabase.auth.getSession();

    const payload = {
      user_id: session?.user?.id || null,
      pattern: String(body.pattern || 'box-4-4-4-4'),
      cycles_completed: Number(body.cyclesCompleted || 0),
      duration_ms: Number(body.durationMs || 0),
      started_at: body.startedAt ? new Date(body.startedAt).toISOString() : null,
      ended_at: body.endedAt ? new Date(body.endedAt).toISOString() : new Date().toISOString(),
      user_agent: String(body.userAgent || ''),
      is_guest: !session,
    };

    const { error } = await supabase.from('breathing_logs').insert(payload);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unknown error' }, { status: 500 });
  }
}


