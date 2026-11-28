-- JOGA community chat setup
-- Apply this script only to the JOGA test/development Supabase project.
-- The app uses authenticated global-room access; no anonymous reads or writes.
create table if not exists public.community_messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  sender_username text not null check (sender_username ~ '^[a-z0-9_]{3,20}$'),
  body text not null check (char_length(trim(body)) between 1 and 500),
  created_at timestamptz not null default now()
);
create index if not exists community_messages_created_at_idx on public.community_messages (created_at desc);
alter table public.community_messages enable row level security;
grant select, insert on table public.community_messages to authenticated;
drop policy if exists "community_messages_read_authenticated" on public.community_messages;
create policy "community_messages_read_authenticated" on public.community_messages for select to authenticated using (true);
drop policy if exists "community_messages_insert_own" on public.community_messages;
create policy "community_messages_insert_own" on public.community_messages for insert to authenticated with check (
  sender_id = (select auth.uid())
  and sender_username = (select p.username from public.profiles as p where p.id = (select auth.uid()))
);
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='community_messages') then
    alter publication supabase_realtime add table public.community_messages;
  end if;
end
$$;
notify pgrst, 'reload schema';
