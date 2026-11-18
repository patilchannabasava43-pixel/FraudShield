-- FraudShield AI Phase 2 — run once in a NEW dedicated Supabase project.
-- All transaction data in this prototype is synthetic and scoped to its owner.

create table if not exists public.fraudshield_transactions (
  user_id uuid not null references auth.users(id) on delete cascade,
  id text not null,
  merchant text not null,
  category text not null,
  amount numeric(14,2) not null check (amount >= 0),
  location text not null,
  international boolean not null default false,
  new_device boolean not null default false,
  velocity integer not null default 1 check (velocity >= 0),
  suspicious_merchant boolean not null default false,
  unusual_hours boolean not null default false,
  occurred_at timestamptz not null,
  account_label text not null,
  channel text not null,
  reviewed text check (reviewed in ('genuine','fraud') or reviewed is null),
  simulated boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (user_id, id)
);

create index if not exists fraudshield_tx_user_time_idx
  on public.fraudshield_transactions (user_id, occurred_at desc);

create table if not exists public.fraudshield_rules (
  user_id uuid primary key references auth.users(id) on delete cascade,
  settings jsonb not null default '{}'::jsonb check (jsonb_typeof(settings) = 'object'),
  updated_at timestamptz not null default now()
);

alter table public.fraudshield_transactions enable row level security;
alter table public.fraudshield_rules enable row level security;

-- Data API permissions are separate from RLS: authenticated users may access
-- the tables but only the rows that match the owner policies below.
revoke all on public.fraudshield_transactions from anon;
revoke all on public.fraudshield_rules from anon;
grant select, insert, update, delete on public.fraudshield_transactions to authenticated;
grant select, insert, update, delete on public.fraudshield_rules to authenticated;

create policy "fraudshield tx select owner" on public.fraudshield_transactions
  for select to authenticated using (user_id = (select auth.uid()));
create policy "fraudshield tx insert owner" on public.fraudshield_transactions
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "fraudshield tx update owner" on public.fraudshield_transactions
  for update to authenticated using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
create policy "fraudshield tx delete owner" on public.fraudshield_transactions
  for delete to authenticated using (user_id = (select auth.uid()));

create policy "fraudshield rules select owner" on public.fraudshield_rules
  for select to authenticated using (user_id = (select auth.uid()));
create policy "fraudshield rules insert owner" on public.fraudshield_rules
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "fraudshield rules update owner" on public.fraudshield_rules
  for update to authenticated using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
create policy "fraudshield rules delete owner" on public.fraudshield_rules
  for delete to authenticated using (user_id = (select auth.uid()));