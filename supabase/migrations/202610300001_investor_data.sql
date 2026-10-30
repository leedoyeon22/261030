-- Run once in the Supabase SQL Editor. No existing data is dropped.
begin;

create table public.investor_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  answers text[] not null default '{}',
  updated_at timestamptz not null default now(),
  constraint answers_length check (cardinality(answers) <= 3 and array_position(answers, null) is null)
);

create table public.investor_watchlist (
  user_id uuid not null references auth.users(id) on delete cascade,
  symbol text not null check (symbol in ('NVDA', 'AAPL', 'TSLA', 'MU')),
  primary key (user_id, symbol)
);

create table public.paper_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  symbol text not null check (symbol in ('NVDA', 'AAPL', 'TSLA', 'MU')),
  quantity numeric(20,8) not null check (quantity > 0 and quantity <= 1000),
  price numeric(20,8) not null check (price > 0 and price < 1000000),
  position integer not null check (position >= 0),
  created_at timestamptz not null default now(),
  unique (user_id, position)
);

alter table public.investor_profiles enable row level security;
alter table public.investor_watchlist enable row level security;
alter table public.paper_orders enable row level security;

revoke all on public.investor_profiles, public.investor_watchlist, public.paper_orders from anon, authenticated;
grant select, insert, update on public.investor_profiles to authenticated;
grant select, insert, delete on public.investor_watchlist, public.paper_orders to authenticated;

create policy profile_read_own on public.investor_profiles for select to authenticated using ((select auth.uid()) = user_id);
create policy profile_insert_own on public.investor_profiles for insert to authenticated with check ((select auth.uid()) = user_id);
create policy profile_update_own on public.investor_profiles for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy watchlist_read_own on public.investor_watchlist for select to authenticated using ((select auth.uid()) = user_id);
create policy watchlist_insert_own on public.investor_watchlist for insert to authenticated with check ((select auth.uid()) = user_id);
create policy watchlist_delete_own on public.investor_watchlist for delete to authenticated using ((select auth.uid()) = user_id);
create policy orders_read_own on public.paper_orders for select to authenticated using ((select auth.uid()) = user_id);
create policy orders_insert_own on public.paper_orders for insert to authenticated with check ((select auth.uid()) = user_id);
create policy orders_delete_own on public.paper_orders for delete to authenticated using ((select auth.uid()) = user_id);

-- Invoker rights enforce every table's RLS, including inside this transaction.
create function public.save_investor_snapshot(p_expected_user uuid, p_answers text[], p_symbols text[], p_orders jsonb)
returns void language plpgsql security invoker set search_path = '' as $$
declare
  owner_id uuid := auth.uid();
begin
  if owner_id is null or owner_id is distinct from p_expected_user then raise exception 'Authentication required' using errcode = '42501'; end if;
  if p_answers is null or p_symbols is null or p_orders is null or jsonb_typeof(p_orders) <> 'array' then
    raise exception 'Invalid snapshot';
  end if;
  if cardinality(p_answers) > 3 or cardinality(p_symbols) > 4 or jsonb_array_length(p_orders) > 10000 then
    raise exception 'Snapshot exceeds limits';
  end if;
  -- Serialize simultaneous saves for this account. A failed write rolls back all changes.
  perform pg_advisory_xact_lock(hashtextextended(owner_id::text, 0));
  insert into public.investor_profiles (user_id, answers) values (owner_id, p_answers)
    on conflict (user_id) do update set answers = excluded.answers, updated_at = now();
  delete from public.investor_watchlist where user_id = owner_id;
  insert into public.investor_watchlist (user_id, symbol) select owner_id, symbol from unnest(p_symbols) symbol;
  delete from public.paper_orders where user_id = owner_id;
  insert into public.paper_orders (user_id, symbol, quantity, price, position)
    select owner_id, value->>'symbol', (value->>'qty')::numeric, (value->>'price')::numeric, (ordinality - 1)::integer
    from jsonb_array_elements(p_orders) with ordinality;
end;
$$;

revoke all on function public.save_investor_snapshot(uuid, text[], text[], jsonb) from public, anon;
grant execute on function public.save_investor_snapshot(uuid, text[], text[], jsonb) to authenticated;

create function public.load_investor_snapshot()
returns jsonb language sql stable security invoker set search_path = '' as $$
  select jsonb_build_object(
    'answers', p.answers,
    'saved', coalesce((select jsonb_agg(w.symbol order by w.symbol) from public.investor_watchlist w where w.user_id = auth.uid()), '[]'::jsonb),
    'orders', coalesce((select jsonb_agg(jsonb_build_object('symbol', o.symbol, 'qty', o.quantity, 'price', o.price) order by o.position) from public.paper_orders o where o.user_id = auth.uid()), '[]'::jsonb)
  ) from public.investor_profiles p where p.user_id = auth.uid();
$$;
revoke all on function public.load_investor_snapshot() from public, anon;
grant execute on function public.load_investor_snapshot() to authenticated;

commit;
