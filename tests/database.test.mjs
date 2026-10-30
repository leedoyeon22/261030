import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

test('account isolation, snapshot round trip and atomic save rollback', async () => {
  const db = new PGlite();
  const alice = '00000000-0000-0000-0000-000000000001';
  const bob = '00000000-0000-0000-0000-000000000002';
  try {
    // Supabase supplies these roles, auth.users and auth.uid() in production.
    await db.exec(`
      create role anon nologin;
      create role authenticated nologin;
      create schema auth;
      create table auth.users (id uuid primary key);
      create function auth.uid() returns uuid language sql stable as
        $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
      grant usage on schema auth, public to anon, authenticated;
      grant execute on function auth.uid() to anon, authenticated;
      insert into auth.users values ('${alice}'), ('${bob}');
    `);
    await db.exec(await readFile(new URL('../supabase/migrations/202610300001_investor_data.sql', import.meta.url), 'utf8'));
    let currentUser;
    const login = async id => {
      currentUser = id;
      await db.exec('reset role');
      await db.query("select set_config('request.jwt.claim.sub', $1, false)", [id]);
      await db.exec('set role authenticated');
    };
    const save = (answers, symbols, orders, owner = currentUser) => db.query('select public.save_investor_snapshot($1::uuid, $2::text[], $3::text[], $4::jsonb)', [owner, answers, symbols, JSON.stringify(orders)]);
    const load = async () => (await db.query('select public.load_investor_snapshot() as snapshot')).rows[0].snapshot;
    await login(alice);
    assert.equal(await load(), null);
    const orders = [{ symbol: 'NVDA', qty: 2, price: 189.24 }, { symbol: 'AAPL', qty: 0.03771412, price: 265.15 }];
    await save(['처음이에요', '', 'AI·반도체'], ['NVDA', 'AAPL'], orders);
    const original = await load();
    assert.deepEqual(original.answers, ['처음이에요', '', 'AI·반도체']);
    assert.deepEqual(original.saved, ['AAPL', 'NVDA']);
    assert.deepEqual(original.orders, orders);

    await login(bob);
    assert.equal(await load(), null);
    assert.equal((await db.query('select * from public.paper_orders')).rows.length, 0);
    await assert.rejects(db.query('insert into public.investor_watchlist values ($1, $2)', [alice, 'TSLA']));
    assert.equal((await db.query('delete from public.investor_watchlist where user_id=$1 returning *', [alice])).rows.length, 0);
    await assert.rejects(save([], ['MU'], [], alice), 'stale account saves must be rejected');
    await save([], ['MU'], []);
    assert.deepEqual((await load()).saved, ['MU']);

    await login(alice);
    assert.deepEqual(await load(), original);
    await assert.rejects(save([], ['TSLA'], [{ symbol: 'TSLA', qty: -1, price: 437.60 }]));
    assert.deepEqual(await load(), original, 'a rejected order must roll back the profile and watchlist too');
    await assert.rejects(save([], ['UNKNOWN'], []));
    assert.deepEqual(await load(), original);
    await assert.rejects(save(['1', '2', '3', '4'], [], []));
    assert.deepEqual(await load(), original);
    await save([], [], []);
    assert.deepEqual(await load(), { answers: [], saved: [], orders: [] });

    await db.exec('reset role; set role anon');
    await assert.rejects(db.query('select * from public.paper_orders'));
    await assert.rejects(db.query('select public.load_investor_snapshot()'));
    await assert.rejects(save([], [], []));
  } finally { await db.close(); }
});
