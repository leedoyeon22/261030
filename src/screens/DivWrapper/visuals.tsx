import { useId } from 'react';

export function GlobalArt() {
  return <svg className="global-art" viewBox="0 0 400 310" role="img" aria-label="글로벌 시장과 성장을 표현한 투자 일러스트">
    <defs><linearGradient id="globe" x2="1" y2="1"><stop stopColor="#c7e0ff"/><stop offset=".5" stopColor="#669dfb"/><stop offset="1" stopColor="#255acd"/></linearGradient><linearGradient id="glass" x2="1" y2="1"><stop stopColor="#fff"/><stop offset="1" stopColor="#edf3ff"/></linearGradient><filter id="shade"><feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#31569f" floodOpacity=".14"/></filter></defs>
    <ellipse cx="205" cy="277" rx="110" ry="13" fill="#c7d7f2" opacity=".35"/>
    <circle cx="208" cy="154" r="94" fill="url(#globe)"/>
    <g stroke="#e1eeff" fill="none" opacity=".55" strokeWidth="1.2"><ellipse cx="208" cy="154" rx="48" ry="94"/><ellipse cx="208" cy="154" rx="93" ry="36"/><path d="M118 123h180M118 185h180M208 60v188"/></g>
    <ellipse cx="208" cy="154" rx="139" ry="44" transform="rotate(-28 208 154)" fill="none" stroke="#bbcef6" strokeWidth="2"/><circle cx="329" cy="86" r="7" fill="#4484ee"/><circle cx="87" cy="220" r="5" fill="#8cb1f5"/>
    <g filter="url(#shade)" transform="rotate(-8 122 213)"><rect x="39" y="170" width="165" height="91" rx="18" fill="url(#glass)" stroke="#fff"/><rect x="55" y="188" width="33" height="33" rx="11" fill="#e1ecff"/><path d="m64 209 6-8 6 4 6-11" fill="none" stroke="#4988ed" strokeWidth="2.5"/><text x="99" y="200" fontSize="9" fontFamily="Arial" fill="#8c9db6">MY PORTFOLIO</text><text x="99" y="221" fontSize="20" fontWeight="bold" fontFamily="Arial" fill="#3974da">+8.24%</text><path d="M58 240h124" stroke="#e1e9f7" strokeWidth="4" strokeLinecap="round"/></g>
    <g filter="url(#shade)" transform="rotate(10 300 97)"><rect x="260" y="57" width="81" height="81" rx="23" fill="url(#glass)" stroke="#fff"/><path d="m279 111 12-14 10 5 19-26m-15 0h15v15" fill="none" stroke="#4c8bf2" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/></g>
    <path d="m89 65 3 9 9 3-9 3-3 9-3-9-9-3 9-3ZM330 239l3 7 7 3-7 3-3 7-3-7-7-3 7-3Z" fill="#85aaf0"/>
  </svg>;
}

export function Chart({ range = '1일', negative = false, compact = false }: { range?: string; negative?: boolean; compact?: boolean }) {
  const id = useId().replace(/:/g, '');
  const sets: Record<string, number[]> = { '1일': [99, 92, 97, 84, 61, 70, 53, 65, 60, 78, 48, 52, 37, 45, 24, 32, 26, 42, 17, 24, 9, 19, 8], '1주': [111, 104, 110, 92, 99, 86, 63, 77, 65, 52, 61, 43, 50, 34, 39, 21, 32, 15, 24, 12, 20, 9, 16], '1개월': [119, 109, 116, 101, 111, 89, 81, 94, 74, 85, 57, 71, 55, 69, 43, 52, 32, 45, 20, 32, 16, 23, 8], '1년': [124, 115, 120, 109, 97, 104, 89, 100, 77, 85, 65, 73, 79, 58, 68, 49, 56, 33, 46, 25, 38, 17, 7] };
  const values = sets[range] || sets['1일'];
  const points = values.map((v, i) => `${i * 320 / (values.length - 1)},${negative ? 140 - v : v}`).join(' ');
  const color = negative ? '#3982df' : '#ed5d6d';
  return <div className={`graph ${compact ? 'compact-graph' : ''}`}><svg viewBox="0 0 320 140" preserveAspectRatio="none" role="img" aria-label={`${range} 예시 주가 추이`}><defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop stopColor={color} stopOpacity=".15"/><stop offset="1" stopColor={color} stopOpacity="0"/></linearGradient></defs>{!compact && [25, 65, 105].map(y => <line key={y} x1="0" x2="320" y1={y} y2={y} stroke="#edf1f6" strokeDasharray="3 5"/>)}<polygon points={`0,140 ${points} 320,140`} fill={`url(#${id})`}/><polyline points={points} fill="none" stroke={color} strokeWidth={compact ? 2.8 : 2} strokeLinecap="round" strokeLinejoin="round"/></svg>{!compact && <div className="chart-times"><span>{range === '1일' ? '09:30' : '시작'}</span><span>{range}</span><span>{range === '1일' ? '16:00' : '마지막'}</span></div>}</div>;
}
