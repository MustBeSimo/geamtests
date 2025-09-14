create table if not exists public.breathing_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null references auth.users(id) on delete set null,
  pattern text not null default 'box-4-4-4-4',
  cycles_completed integer not null default 0 check (cycles_completed >= 0),
  duration_ms integer not null default 0 check (duration_ms >= 0),
  started_at timestamptz null,
  ended_at timestamptz not null default now(),
  user_agent text null,
  is_guest boolean not null default false,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.breathing_logs enable row level security;

-- Policy: users can insert their own row (or anonymous logs marked guest)
drop policy if exists "insert_own_or_guest" on public.breathing_logs;
create policy "insert_own_or_guest" on public.breathing_logs
  for insert
  with check (
    auth.uid() is null and is_guest = true
    or auth.uid() is not null and (user_id = auth.uid() or user_id is null)
  );

-- Policy: users can read their own logs only
drop policy if exists "read_own" on public.breathing_logs;
create policy "read_own" on public.breathing_logs
  for select
  using (user_id = auth.uid());

-- Optional: users can delete their own logs
drop policy if exists "delete_own" on public.breathing_logs;
create policy "delete_own" on public.breathing_logs
  for delete
  using (user_id = auth.uid());


