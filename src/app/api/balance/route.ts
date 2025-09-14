import { NextResponse } from 'next/server';
import { authenticateApiRoute, ErrorResponses } from '@/utils/supabase-server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { response, session, supabase } = await authenticateApiRoute();
  if (response) return response;

  try {
    // Get user balance including mood check-ins
    const { data: balanceData, error: balanceError } = await supabase
      .from('user_balances')
      .select('balance, mood_checkins_remaining')
      .eq('user_id', session.user.id)
      .single();

    // Check if there's an error that's not "no rows found"
    if (balanceError && (balanceError as any).code !== 'PGRST116') {
      return ErrorResponses.serverError('Failed to fetch balance');
    }

    // If no balance record exists, create one with initial balance
    if (!balanceData) {
      const { data: newBalance, error: insertError } = await supabase
        .from('user_balances')
        .insert([
          {
            user_id: session.user.id,
            balance: 20,
            mood_checkins_remaining: 10,
            updated_at: new Date().toISOString(),
          },
        ])
        .select('balance, mood_checkins_remaining')
        .single();

      if (insertError) {
        return ErrorResponses.serverError('Failed to create balance');
      }

      return NextResponse.json({
        balance: newBalance?.balance ?? 20,
        moodCheckins: newBalance?.mood_checkins_remaining ?? 10,
      });
    }

    return NextResponse.json({
      balance: balanceData.balance,
      moodCheckins: balanceData.mood_checkins_remaining,
    });
  } catch (error) {
    return ErrorResponses.serverError();
  }
}

export async function POST(request: Request) {
  const { response, session, supabase } = await authenticateApiRoute();
  if (response) return response;

  try {
    const { action } = await request.json();

    if (action !== 'deduct_mood_checkin') {
      return ErrorResponses.badRequest(
        'Invalid action. Expected "deduct_mood_checkin"',
      );
    }

    // Get current balance
    const { data: currentBalance, error: fetchError } = await supabase
      .from('user_balances')
      .select('mood_checkins_remaining')
      .eq('user_id', session.user.id)
      .single();

    if (fetchError) {
      return ErrorResponses.serverError('Failed to fetch balance');
    }

    if (!currentBalance || currentBalance.mood_checkins_remaining <= 0) {
      return ErrorResponses.paymentRequired('Insufficient mood check-ins');
    }

    // Deduct one mood check-in
    const { data: updatedBalance, error: updateError } = await supabase
      .from('user_balances')
      .update({
        mood_checkins_remaining: currentBalance.mood_checkins_remaining - 1,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', session.user.id)
      .select('balance, mood_checkins_remaining')
      .single();

    if (updateError) {
      return ErrorResponses.serverError('Failed to update balance');
    }

    return NextResponse.json({
      balance: updatedBalance.balance,
      moodCheckins: updatedBalance.mood_checkins_remaining,
      success: true,
    });
  } catch (error) {
    return ErrorResponses.serverError();
  }
}
