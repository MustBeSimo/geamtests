-- First, drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own balance" ON user_balances;
DROP POLICY IF EXISTS "Users can update own balance" ON user_balances;
DROP POLICY IF EXISTS "Service role can manage all balances" ON user_balances;
DROP POLICY IF EXISTS "Allow insert with matching user_id" ON user_balances;

-- Enable RLS
ALTER TABLE user_balances ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own balance
CREATE POLICY "Users can read own balance"
ON user_balances
FOR SELECT
USING (auth.uid() = user_id);

-- Policy for users to update their own balance
CREATE POLICY "Users can update own balance"
ON user_balances
FOR UPDATE
USING (auth.uid() = user_id);

-- Policy for service role to manage all balances
CREATE POLICY "Service role can manage all balances"
ON user_balances
FOR ALL
USING (auth.role() = 'service_role');

-- Policy for inserting new balances (needed for initialization)
CREATE POLICY "Allow insert with matching user_id"
ON user_balances
FOR INSERT
WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');
