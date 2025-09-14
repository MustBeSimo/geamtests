import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

type StripeEvent = {
  type: string;
  data: {
    object: {
      id: string;
      customer: string;
      customer_email: string;
      customer_details?: {
        email?: string;
      };
      payment_status?: string;
      status?: string;
      mode?: string;
      client_reference_id?: string;
      metadata?: {
        user_id?: string;
      };
      subscription?: string;
      billing_reason?: string;
      lines?: {
        data: Array<{
          subscription?: string;
        }>;
      };
    };
  };
};

export async function POST(req: Request) {
  // Add comprehensive debugging
  console.log('=== STRIPE WEBHOOK RECEIVED ===');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Headers:', Object.fromEntries(req.headers.entries()));

  // Get the raw body as buffer to preserve exact bytes for signature verification
  const rawBody = await req.arrayBuffer();
  const body = Buffer.from(rawBody);
  console.log('Body length:', body.length);
  console.log('Body preview:', body.toString().substring(0, 500) + '...');

  const signature = req.headers.get('stripe-signature');
  console.log('Signature:', signature);
  console.log('Webhook secret configured:', !!webhookSecret);
  console.log(
    'Webhook secret preview:',
    webhookSecret?.substring(0, 15) + '...'
  );

  if (!signature) {
    console.error('❌ No stripe-signature header found');
    return NextResponse.json(
      { error: 'No stripe-signature header found' },
      { status: 400 }
    );
  }

  let event: StripeEvent;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    ) as StripeEvent;
    console.log('✅ Webhook signature verified successfully');
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err);
    console.error('❌ Error details:', err);
    console.error('❌ Webhook secret configured:', !!webhookSecret);
    console.error('❌ Webhook secret length:', webhookSecret?.length);
    console.error(
      '❌ Webhook secret starts with:',
      webhookSecret?.substring(0, 10) + '...'
    );
    console.error('❌ Signature received:', signature);
    console.error('❌ Body length:', body.length);
    console.error(
      '❌ Body first 100 chars:',
      body.toString().substring(0, 100)
    );
    return NextResponse.json(
      {
        error: 'Webhook signature verification failed',
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 400 }
    );
  }

  console.log('=== WEBHOOK EVENT DETAILS ===');
  console.log('Event type:', event.type);
  console.log('Event ID:', event.data?.object?.id);
  console.log('Event data keys:', Object.keys(event.data?.object || {}));
  console.log('Full event data:', JSON.stringify(event.data, null, 2));

  // Use service key for webhook authentication (no cookies available)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Test database connection
  console.log('=== DATABASE CONNECTION TEST ===');
  try {
    const { data: testData, error: testError } = await supabase
      .from('user_balances')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('❌ Database connection test failed:', testError);
    } else {
      console.log('✅ Database connection test successful');
    }
  } catch (dbTestError) {
    console.error('❌ Database connection test error:', dbTestError);
  }

  try {
    switch (event.type) {
      case 'payment_link.updated': {
        console.log('Payment link updated event received, ignoring...');
        return NextResponse.json({ received: true });
      }

      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('Processing checkout.session.completed:', {
          id: session.id,
          payment_status: session.payment_status,
          mode: session.mode,
          customer_email: session.customer_email,
          customer_details: session.customer_details,
          client_reference_id: session.client_reference_id,
          metadata: session.metadata,
        });

        // Verify payment status
        if (session.payment_status !== 'paid') {
          console.error(
            'Payment not completed, status:',
            session.payment_status
          );
          throw new Error('Payment not completed');
        }

        // Get email from the correct location
        const customerEmail =
          session.customer_email || session.customer_details?.email;
        console.log('Customer email:', customerEmail);

        // Get user from client_reference_id, metadata, or email
        let userId = session.client_reference_id || session.metadata?.user_id;
        console.log('User ID from session:', userId);

        if (!userId) {
          console.log(
            'No user ID found, trying to find by email:',
            customerEmail
          );

          if (!customerEmail) {
            console.error('No customer email found in session');
            throw new Error('No customer email found in session');
          }

          // Try to find user by email
          console.log('=== FINDING USER BY EMAIL ===');
          const { data: userData, error: userError } =
            await supabase.auth.admin.listUsers();

          if (userError) {
            console.error('Failed to fetch users:', userError);
            throw new Error('Failed to fetch users: ' + userError.message);
          }

          const user = userData.users.find(
            (u: any) => u.email === customerEmail
          );
          if (!user) {
            console.error('No user found for email:', customerEmail);
            throw new Error('No user found for email: ' + customerEmail);
          }

          userId = user.id;
          console.log('Found user ID by email:', userId);
        }

        // Check if this is a one-time payment (mode: 'payment') or subscription
        if (session.mode === 'payment') {
          console.log('=== PROCESSING ONE-TIME PAYMENT ===');
          console.log('Processing one-time payment for user:', userId);

          // One-time payment: Add 200 messages + 60 mood check-ins
          console.log('Fetching current balance...');
          const { data: currentBalance, error: fetchError } = await supabase
            .from('user_balances')
            .select('balance, mood_checkins_remaining')
            .eq('user_id', userId)
            .single();

          if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Failed to fetch current balance:', fetchError);
            console.error(
              'Error details:',
              JSON.stringify(fetchError, null, 2)
            );
            throw new Error(
              'Failed to fetch current balance: ' + fetchError.message
            );
          }

          console.log('Current balance:', currentBalance);

          if (currentBalance) {
            console.log('Updating existing balance...');
            // Update existing balance
            const updateResult = await supabase
              .from('user_balances')
              .update({
                balance: currentBalance.balance + 200,
                mood_checkins_remaining:
                  currentBalance.mood_checkins_remaining + 60,
                updated_at: new Date().toISOString(),
              })
              .eq('user_id', userId);

            console.log('Balance update result:', updateResult);

            if (updateResult.error) {
              console.error('Error updating balance:', updateResult.error);
              console.error(
                'Error details:',
                JSON.stringify(updateResult.error, null, 2)
              );
              throw new Error(
                'Failed to update balance: ' + updateResult.error.message
              );
            }

            console.log('✅ Successfully updated balance');
          } else {
            console.log('Creating new balance record...');
            // Create new balance record
            const insertResult = await supabase.from('user_balances').insert([
              {
                user_id: userId,
                balance: 220, // 20 initial + 200 purchased
                mood_checkins_remaining: 70, // 10 initial + 60 purchased
                updated_at: new Date().toISOString(),
              },
            ]);

            console.log('Balance insert result:', insertResult);

            if (insertResult.error) {
              console.error('Error inserting balance:', insertResult.error);
              console.error(
                'Error details:',
                JSON.stringify(insertResult.error, null, 2)
              );
              throw new Error(
                'Failed to insert balance: ' + insertResult.error.message
              );
            }

            console.log('✅ Successfully created new balance');
          }

          console.log('✅ Successfully processed payment for user:', userId);
        } else {
          console.log('Processing subscription payment for user:', userId);
          // Subscription payment: handle subscription logic
          const currentPeriodEnd = new Date();
          currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);

          await supabase
            .from('user_subscriptions')
            .update({
              status: 'subscribed',
              stripe_customer_id: session.customer,
              current_period_end: currentPeriodEnd.toISOString(),
              subscribed_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId);
        }
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object;

        // Only handle subscription-related invoices
        if (invoice.billing_reason !== 'subscription_cycle') {
          return NextResponse.json({ received: true });
        }

        // Get the subscription ID from the invoice
        const subscriptionId =
          invoice.subscription || invoice.lines?.data[0]?.subscription;
        if (!subscriptionId) {
          throw new Error('No subscription found in invoice');
        }

        // Get subscription details
        const subscription =
          await stripe.subscriptions.retrieve(subscriptionId);

        // Get user from customer ID
        const { data: userData, error: userError } = await supabase
          .from('user_subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', invoice.customer)
          .single();

        if (userError || !userData) {
          throw new Error('No user found for customer: ' + invoice.customer);
        }

        // Calculate new period end
        const currentPeriodEnd = new Date(
          subscription.current_period_end * 1000
        );

        // Update subscription status
        await supabase
          .from('user_subscriptions')
          .update({
            status: 'subscribed',
            current_period_end: currentPeriodEnd.toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userData.user_id);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;

        // Get user from customer ID
        const { data: userData, error: userError } = await supabase
          .from('user_subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', invoice.customer)
          .single();

        if (userError || !userData) {
          throw new Error('No user found for customer: ' + invoice.customer);
        }

        // Update subscription status to expired
        await supabase
          .from('user_subscriptions')
          .update({
            status: 'expired',
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userData.user_id);
        break;
      }
    }

    console.log('✅ Webhook processed successfully');
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    console.error(
      '❌ Error stack:',
      error instanceof Error ? error.stack : 'No stack trace'
    );
    console.error('❌ Error details:', JSON.stringify(error, null, 2));

    // Return detailed error information for debugging
    return NextResponse.json(
      {
        error: 'Webhook handler failed',
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Stripe webhook endpoint is active',
    timestamp: new Date().toISOString(),
    url: 'https://www.gigi.w230.net/api/webhooks/stripe',
    status: 'ready',
    webhookSecretConfigured: !!webhookSecret,
    environment: process.env.NODE_ENV,
  });
}
