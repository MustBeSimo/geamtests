import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    console.log('Checkout API: Starting checkout session creation');

    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    console.log('Checkout API: Session check:', {
      hasSession: !!session,
      sessionError: sessionError?.message,
      userId: session?.user?.id,
    });

    if (sessionError || !session) {
      console.log('Checkout API: Unauthorized - no session');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check environment variables
    const missingEnvVars = [];
    if (!process.env.STRIPE_SECRET_KEY)
      missingEnvVars.push('STRIPE_SECRET_KEY');
    if (!process.env.STRIPE_PRICE_ID) missingEnvVars.push('STRIPE_PRICE_ID');
    if (!process.env.NEXT_PUBLIC_SITE_URL)
      missingEnvVars.push('NEXT_PUBLIC_SITE_URL');

    if (missingEnvVars.length > 0) {
      console.error(
        'Checkout API: Missing environment variables:',
        missingEnvVars
      );
      return NextResponse.json(
        {
          error: `Missing environment variables: ${missingEnvVars.join(', ')}`,
        },
        { status: 500 }
      );
    }

    console.log('Checkout API: Environment variables check passed');
    console.log('Checkout API: Creating Stripe instance');

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15',
    });

    console.log('Checkout API: Creating checkout session with:', {
      priceId: process.env.STRIPE_PRICE_ID,
      customerEmail: session.user.email,
      userId: session.user.id,
      successUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/?success=true`,
      cancelUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/?canceled=true`,
    });

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: session.user.email || undefined,
      metadata: {
        user_id: session.user.id,
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/?canceled=true`,
    });

    console.log(
      'Checkout API: Checkout session created successfully:',
      checkoutSession.id
    );
    return NextResponse.json({ sessionId: checkoutSession.id });
  } catch (error) {
    console.error('Checkout API: Error creating checkout session:', error);

    // Return more specific error information
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: 'Failed to create checkout session',
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
