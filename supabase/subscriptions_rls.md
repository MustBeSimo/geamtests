-- First, drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can update own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Service role can manage all subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Service role can insert subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Service role can delete subscriptions" ON subscriptions;

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own subscriptions
CREATE POLICY "Users can read own subscriptions"
ON subscriptions
FOR SELECT
USING (auth.uid() = user_id);

-- Policy for users to update their own subscriptions
CREATE POLICY "Users can update own subscriptions"
ON subscriptions
FOR UPDATE
USING (auth.uid() = user_id);

-- Policy for service role to manage all subscriptions
CREATE POLICY "Service role can manage all subscriptions"
ON subscriptions
FOR ALL
USING (auth.role() = 'service_role');

-- Policy for inserting new subscriptions
CREATE POLICY "Service role can insert subscriptions"
ON subscriptions
FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- Policy for deleting subscriptions
CREATE POLICY "Service role can delete subscriptions"
ON subscriptions
FOR DELETE
USING (auth.role() = 'service_role');
