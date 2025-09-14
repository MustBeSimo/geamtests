# Stripe Integration Test Plan - $4.99 Plus Plan

## Test Overview

Testing the complete Stripe checkout flow for the $4.99 Plus Plan and verification of database updates.

## Pre-Test Setup

1. **User Authentication**: Ensure you're logged in to the app
2. **Stripe Dashboard**: Access your Stripe test dashboard to monitor events
3. **Supabase**: Have access to your Supabase dashboard to verify database changes

## Test Steps

### 1. Navigate to Pricing Section

- Go to the homepage
- Scroll down to the "Choose Your Plan" section
- Locate the green "Plus" plan card ($4.99)

### 2. Initiate Purchase

- Click the "Get Plus - $4.99" button
- The button should show "Processing..." state
- Should redirect to Stripe Checkout page

### 3. Stripe Checkout Flow

- **Test Card**: Use `4242 4242 4242 4242`
- **Expiry**: Any future date (e.g., 12/25)
- **CVC**: Any 3 digits (e.g., 123)
- **Email**: Should be pre-filled with your account email
- Complete the checkout process

### 4. Expected Results

#### 4.1 User Experience

- ✅ Successful payment confirmation
- ✅ Redirect back to the app with success message
- ✅ URL should include `?success=true` parameter

#### 4.2 Database Changes (Check in Supabase)

Navigate to your Supabase dashboard and check the `user_balances` table:

**Before Purchase:**

```sql
SELECT * FROM user_balances WHERE user_id = 'your_user_id';
```

**After Purchase (Expected Changes):**

- `balance`: Should increase by +200 messages
- `mood_checkins_remaining`: Should increase by +60 check-ins
- `updated_at`: Should be updated to current timestamp

**Example:**

```
Before: balance = 20, mood_checkins_remaining = 5
After:  balance = 220, mood_checkins_remaining = 65
```

#### 4.3 Stripe Dashboard Verification

In your Stripe test dashboard:

- ✅ New payment should appear in "Payments" section
- ✅ Status should be "Succeeded"
- ✅ Amount should be $4.99 USD
- ✅ Customer email should match your account
- ✅ Webhook event `checkout.session.completed` should be triggered

### 5. Webhook Verification

Check the webhook events in Stripe:

- ✅ Event type: `checkout.session.completed`
- ✅ Event status: Succeeded
- ✅ Response from your webhook: `{"received": true}`

### 6. User Balance Verification in App

- Navigate to your user profile/balance section
- Verify the balance displays correctly:
  - Text Chat Credits: Should show increased message count
  - Mood Check-ins: Should show increased check-in count

## Test Scenarios

### Scenario A: New User (No Previous Balance)

- **Expected**: Creates new balance record with 220 messages (20 initial + 200 purchased) and 70 mood check-ins (10 initial + 60 purchased)

### Scenario B: Existing User with Balance

- **Expected**: Adds +200 messages and +60 mood check-ins to existing balance

### Scenario C: Payment Failure

- **Expected**: User remains on Stripe checkout, no database changes

## Troubleshooting

### Common Issues

1. **Webhook not firing**: Check webhook endpoint configuration in Stripe
2. **Database not updating**: Verify webhook signature and user authentication
3. **Redirect issues**: Check success/cancel URLs in checkout configuration

### Debug Steps

1. Check browser console for any JavaScript errors
2. Verify webhook events in Stripe dashboard
3. Check Supabase logs for any database errors
4. Confirm webhook endpoint is accessible

## Expected Webhook Payload

```json
{
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_xxxxx",
      "customer": "cus_xxxxx",
      "customer_email": "user@example.com",
      "payment_status": "paid",
      "status": "complete",
      "mode": "payment",
      "metadata": {
        "user_id": "user_uuid_here"
      }
    }
  }
}
```

## Success Criteria

- ✅ Button click initiates Stripe checkout
- ✅ Payment processes successfully
- ✅ User is redirected back to app
- ✅ Database is updated with correct balance increases
- ✅ Webhook events are processed correctly
- ✅ User can see updated balance in the app

## Test Completion

Once all scenarios pass, the $4.99 Plus Plan integration is working correctly and ready for production use.
