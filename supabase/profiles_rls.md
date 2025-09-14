-- First, drop existing policies if they exist
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Service role can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON profiles;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy for users to read any profile (public profiles)
CREATE POLICY "Profiles are viewable by everyone"
ON profiles
FOR SELECT
USING (true);

-- Policy for users to update their own profile
CREATE POLICY "Users can update own profile"
ON profiles
FOR UPDATE
USING (auth.uid() = id);

-- Policy for service role to manage all profiles
CREATE POLICY "Service role can manage all profiles"
ON profiles
FOR ALL
USING (auth.role() = 'service_role');

-- Policy for inserting new profiles (needed for initialization)
CREATE POLICY "Users can insert own profile"
ON profiles
FOR INSERT
WITH CHECK (auth.uid() = id OR auth.role() = 'service_role');

-- Policy for deleting profiles
CREATE POLICY "Users can delete own profile"
ON profiles
FOR DELETE
USING (auth.uid() = id OR auth.role() = 'service_role');
