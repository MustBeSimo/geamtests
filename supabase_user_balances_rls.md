# Supabase RLS Policies for user_balances Table

Add these after enabling Row Level Security (RLS) on your `user_balances` table:

```sql
-- Policy: allow users to select their own balance
create policy "Users can select their own balance"
  on public.user_balances
  for select
  using (auth.uid() = user_id);

-- Policy: allow users to update their own balance
create policy "Users can update their own balance"
  on public.user_balances
  for update
  using (auth.uid() = user_id);
```

**Instructions:**

- Run each statement separately in the Supabase SQL editor.
- This ensures users can only see and update their own balance.
- You can add similar policies for `insert` or `delete` if needed.
