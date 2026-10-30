import { useEffect, useRef, useState } from 'react';
import './cloud-account.css';
import type { User } from '@supabase/supabase-js';
import { Cloud, Mail, LogOut, Upload, Download, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { cloudError, loadInvestorData, saveInvestorData, type InvestorSnapshot } from '../lib/investorData';

export function CloudAccount({ snapshot, onRestore }: { snapshot: InvestorSnapshot; onRestore: (data: InvestorSnapshot) => void }) {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [initializing, setInitializing] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [failed, setFailed] = useState(false);
  const [confirm, setConfirm] = useState<'save' | 'load' | null>(null);
  const alive = useRef(true);
  const revision = useRef(0);

  useEffect(() => {
    alive.current = true;
    if (!supabase) { setInitializing(false); return; }
    const db = supabase;
    const { data } = db.auth.onAuthStateChange((_event, session) => {
      revision.current++;
      setUser(session?.user || null);
      setConfirm(null);
      setMessage('');
      setInitializing(false);
    });
    const current = revision.current;
    void db.auth.getSession().then(({ data: auth, error }) => {
      if (!alive.current || revision.current !== current) return;
      if (error) { setFailed(true); setMessage('로그인 상태를 확인하지 못했어요. 다시 시도해주세요.'); }
      setUser(auth.session?.user || null);
      setInitializing(false);
    });
    return () => { alive.current = false; data.subscription.unsubscribe(); };
  }, []);

  async function action(fn: () => Promise<void>) {
    if (busy) return;
    setBusy(true); setMessage(''); setFailed(false); setConfirm(null);
    try { await fn(); }
    catch (error) { if (alive.current) { setFailed(true); setMessage(cloudError(error)); } }
    finally { if (alive.current) setBusy(false); }
  }

  if (!supabase) return <section className="card cloud-account"><Cloud size={23}/><h3>어디서든 이어지는 나의 투자</h3><p>서버 저장 기능을 준비 중이에요. 지금은 이 브라우저에서 체험할 수 있어요.</p></section>;

  return <section className="card cloud-account" aria-label="계정과 서버 저장">
    <span className="cloud-heading"><Cloud size={22}/><b>나의 투자, 어디서든 이어서</b></span>
    {initializing ? <p role="status">로그인 상태를 확인하고 있어요…</p> : user ? <>
      <p className="cloud-email"><CheckCircle2 size={14}/>{user.email}</p>
      <p>현재 관심 종목, 투자 성향, 모의 구매 내역을 계정에 저장할 수 있어요. 저장 버튼을 누른 내용만 서버에 반영돼요.</p>
      <div className="cloud-actions"><button disabled={busy} onClick={() => setConfirm('save')}><Upload size={16}/>계정에 저장</button><button disabled={busy} onClick={() => setConfirm('load')}><Download size={16}/>저장 내역 불러오기</button></div>
      {confirm && <div className="cloud-confirm"><p>{confirm === 'save' ? '이 계정에 저장된 내용을 현재 화면의 내역으로 바꿀까요?' : '현재 브라우저의 내역을 이 계정에 저장된 내용으로 바꿀까요?'}</p><div><button onClick={() => setConfirm(null)}>취소</button><button disabled={busy} onClick={() => void action(async () => {
        const rev = revision.current;
        if (confirm === 'save') {
          const { data, error } = await supabase!.auth.getUser();
          if (error) throw error;
          if (data.user?.id !== user.id) throw new Error('Session changed');
          await saveInvestorData(snapshot, user.id);
          if (alive.current && revision.current === rev) setMessage('계정에 저장했어요. 다른 기기에서도 불러올 수 있어요.');
        } else {
          const data = await loadInvestorData();
          if (!alive.current || revision.current !== rev) return;
          if (!data) { setMessage('아직 계정에 저장한 내역이 없어요. 먼저 현재 내역을 저장해주세요.'); return; }
          onRestore(data); setMessage('저장된 내역을 불러왔어요.');
        }
      })}>{confirm === 'save' ? '저장하기' : '불러오기'}</button></div></div>}
      <button className="cloud-signout" disabled={busy} onClick={() => void action(async () => { const { error } = await supabase!.auth.signOut(); if (error) throw error; setMessage('로그아웃했어요. 현재 브라우저의 체험 내역은 유지돼요.'); })}><LogOut size={14}/>로그아웃</button>
    </> : <form onSubmit={e => { e.preventDefault(); void action(async () => {
      const redirect = new URL(window.location.href); redirect.hash = ''; redirect.search = '';
      const { error } = await supabase!.auth.signInWithOtp({ email: email.trim(), options: { emailRedirectTo: redirect.href } });
      if (error) throw error;
      if (alive.current) setMessage('입력한 이메일의 로그인 링크를 열어주세요. 새 이메일은 계정이 생성돼요.');
    }); }}>
      <p>이메일로 로그인하면 다른 기기에서도 내 투자 내역을 이어볼 수 있어요. 처음 사용하는 이메일은 계정이 만들어져요.</p>
      <label htmlFor="cloud-email">이메일</label><div className="cloud-input"><Mail size={17}/><input id="cloud-email" type="email" autoComplete="email" required maxLength={254} value={email} disabled={busy} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"/></div>
      <button className="action" type="submit" disabled={busy || !email.trim()}>로그인 링크 받기</button>
    </form>}
    {busy && <p role="status">처리하고 있어요…</p>}
    {message && <p className={`cloud-message ${failed ? 'error' : ''}`} role={failed ? 'alert' : 'status'}>{message}</p>}
    <small className="cloud-disclosure">모의 투자 데이터만 저장해요. 실제 증권 계좌와는 연결되지 않아요.</small>
  </section>;
}
