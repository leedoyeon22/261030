import { supabase } from './supabase';

export type PaperOrder = { symbol: string; qty: number; price: number };
export type InvestorSnapshot = { answers: string[]; saved: string[]; orders: PaperOrder[] };

function client() {
  if (!supabase) throw new Error('데이터 저장 연결이 아직 설정되지 않았어요.');
  return supabase;
}

export function cloudError(error: unknown): string {
  const e = error as { code?: string; message?: string };
  if (e?.code === 'PGRST205' || e?.code === 'PGRST202' || e?.code === '42P01') {
    return '데이터 저장 공간을 준비 중이에요. 잠시 후 다시 시도해주세요.';
  }
  if (e?.code === '42501' || e?.code === 'PGRST301') return '로그인 상태와 데이터 접근 권한을 확인해주세요.';
  return '요청을 완료하지 못했어요. 네트워크를 확인하고 다시 시도해주세요.';
}

export async function saveInvestorData(snapshot: InvestorSnapshot, expectedUser: string) {
  // One transaction avoids partially saved portfolios if any write fails.
  const { error } = await client().rpc('save_investor_snapshot', {
    p_expected_user: expectedUser,
    p_answers: snapshot.answers,
    p_symbols: snapshot.saved,
    p_orders: snapshot.orders,
  });
  if (error) throw error;
}

export async function loadInvestorData(): Promise<InvestorSnapshot | null> {
  // A single SQL statement sees a consistent snapshot across all three tables.
  const { data, error } = await client().rpc('load_investor_snapshot');
  if (error) throw error;
  if (data === null) return null;
  const symbols = ['NVDA', 'AAPL', 'TSLA', 'MU'];
  if (!data || !Array.isArray(data.answers) || data.answers.length > 3 ||
      !data.answers.every((a: unknown) => typeof a === 'string') ||
      !Array.isArray(data.saved) || !data.saved.every((s: string) => symbols.includes(s)) ||
      !Array.isArray(data.orders) || !data.orders.every((o: PaperOrder) => o && symbols.includes(o.symbol) &&
        Number.isFinite(o.qty) && o.qty > 0 && o.qty <= 1000 && Number.isFinite(o.price) && o.price > 0)) {
    throw new Error('Invalid saved data');
  }
  return data as InvestorSnapshot;
}
