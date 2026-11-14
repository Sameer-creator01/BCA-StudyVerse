-- StudyVerse private per-user cloud backup schema.
-- Requires Supabase Auth. Never use a service-role key in the browser.
create table if not exists public.studyverse_user_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  updated_at timestamptz not null default now(),
  payload jsonb not null default '{}'::jsonb
);

alter table public.studyverse_user_state enable row level security;
alter table public.studyverse_user_state force row level security;

drop policy if exists "Users can read and upsert own StudyVerse state" on public.studyverse_user_state;
drop policy if exists "read own StudyVerse state" on public.studyverse_user_state;
drop policy if exists "insert own StudyVerse state" on public.studyverse_user_state;
drop policy if exists "update own StudyVerse state" on public.studyverse_user_state;

create policy "read own StudyVerse state"
  on public.studyverse_user_state for select to authenticated
  using (auth.uid() = user_id);
create policy "insert own StudyVerse state"
  on public.studyverse_user_state for insert to authenticated
  with check (auth.uid() = user_id);
create policy "update own StudyVerse state"
  on public.studyverse_user_state for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

revoke all on public.studyverse_user_state from anon;
grant select, insert, update on public.studyverse_user_state to authenticated;
