begin;
create table if not exists public.solape_app_state (
  id smallint primary key check (id = 1),
  data jsonb not null,
  revision bigint not null default 0
);
alter table public.solape_app_state add column if not exists revision bigint not null default 0;
alter table public.solape_app_state enable row level security;
revoke all on public.solape_app_state from public, anon, authenticated;
grant select, update on public.solape_app_state to authenticated;
drop policy if exists solape_team_insert on public.solape_app_state;
drop policy if exists solape_team_read on public.solape_app_state;
drop policy if exists solape_team_update on public.solape_app_state;
create policy solape_team_read on public.solape_app_state for select to authenticated
using (auth.uid() = '00000000-0000-0000-0000-000000000000'::uuid);
create policy solape_team_update on public.solape_app_state for update to authenticated
using (auth.uid() = '00000000-0000-0000-0000-000000000000'::uuid)
with check (auth.uid() = '00000000-0000-0000-0000-000000000000'::uuid);
insert into public.solape_app_state (id, data) values (1, '{}') on conflict (id) do nothing;
commit;
