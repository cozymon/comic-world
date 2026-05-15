'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Flame, RefreshCcw, Search, Sparkles, TrendingUp, UserRound, Crown, Star, Rocket, Heart, ChevronDown } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const genres = [
  { key: '', ko: '전체' },
  { key: 'Action', ko: '액션' },
  { key: 'Fantasy', ko: '판타지' },
  { key: 'Romance', ko: '로맨스' },
  { key: 'Comedy', ko: '코미디' },
  { key: 'Drama', ko: '드라마' },
  { key: 'Mystery', ko: '미스터리' },
  { key: 'Sports', ko: '스포츠' },
  { key: 'Slice of Life', ko: '일상' },
  { key: 'Psychological', ko: '심리' },
  { key: 'Supernatural', ko: '초자연' },
  { key: 'Thriller', ko: '스릴러' }
];

const tabs = [
  { key: 'trending', ko: '실시간 인기', icon: Flame, desc: '지금 상승 중인 작품' },
  { key: 'new', ko: '신작만화', icon: Rocket, desc: '최근 시작된 작품' },
  { key: 'classic', ko: '초레전드 명작', icon: Crown, desc: '완결/고평점 명작' },
  { key: 'shoujo', ko: '순정만화', icon: Heart, desc: '로맨스·쇼죠 중심 작품' }
] as const;

type Mode = typeof tabs[number]['key'];

const sortByMode: Record<Mode, { key: string; ko: string }[]> = {
  trending: [
    { key: 'TRENDING_DESC', ko: '지금 뜨는 순' },
    { key: 'POPULARITY_DESC', ko: '누적 인기 순' },
    { key: 'SCORE_DESC', ko: '평점 순' }
  ],
  new: [
    { key: 'START_DATE_DESC', ko: '최신 시작 순' },
    { key: 'TRENDING_DESC', ko: '신작 중 상승 순' },
    { key: 'POPULARITY_DESC', ko: '신작 중 인기 순' }
  ],
  classic: [
    { key: 'SCORE_DESC', ko: '평점 명작 순' },
    { key: 'POPULARITY_DESC', ko: '누적 인기 명작 순' },
    { key: 'FAVOURITES_DESC', ko: '팬덤 명작 순' }
  ],
  shoujo: [
    { key: 'TRENDING_DESC', ko: '요즘 뜨는 순정 순' },
    { key: 'POPULARITY_DESC', ko: '인기 순정 순' },
    { key: 'SCORE_DESC', ko: '평점 순정 순' },
    { key: 'FAVOURITES_DESC', ko: '팬덤 순정 순' }
  ]
};

type Manga = {
  id: number; rank: number; titleKo: string; titleNative: string; titleRomaji: string; titleEnglish?: string;
  titleKoSource?: 'manual' | 'english' | 'romaji' | 'native' | 'unknown'; genres: string[]; score: number | null; popularity: number; trending: number; status: string; statusKo?: string; cover: string; siteUrl: string; description: string; trendScore: number;
  authors: { name: string; image?: string; role?: string; siteUrl?: string }[];
};

type HotAuthor = { name: string; image?: string; role?: string; work: string; nativeTitle: string; mangaUrl: string; trendScore: number } | null;

export default function Home() {
  const [items, setItems] = useState<Manga[]>([]);
  const [genre, setGenre] = useState('');
  const [mode, setMode] = useState<Mode>('trending');
  const [sort, setSort] = useState('TRENDING_DESC');
  const [query, setQuery] = useState('');
  const [hotAuthor, setHotAuthor] = useState<HotAuthor>(null);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [updatedAt, setUpdatedAt] = useState('');
  const [error, setError] = useState('');

  function changeMode(nextMode: Mode) {
    setMode(nextMode);
    setSort(sortByMode[nextMode][0].key);
    setQuery('');
  }

  async function fetchPage(targetPage = 1, append = false) {
    if (append) setLoadingMore(true);
    else setLoading(true);
    setError('');
    const params = new URLSearchParams();
    if (genre) params.set('genre', genre);
    params.set('sort', sort);
    params.set('mode', mode);
    params.set('perPage', '35');
    params.set('page', String(targetPage));

    try {
      const requests: Promise<Response>[] = [fetch(`/api/manga-trends?${params.toString()}`)];
      if (!append) requests.push(fetch('/api/hot-author'));
      const [trendsRes, authorRes] = await Promise.all(requests);
      const trends = await trendsRes.json();
      const author = authorRes ? await authorRes.json() : null;
      if (!trendsRes.ok) throw new Error(trends.error || '데이터를 불러오지 못했습니다.');

      setItems(prev => append ? [...prev, ...(trends.items || [])] : (trends.items || []));
      setPage(targetPage);
      setHasNextPage(Boolean(trends.pageInfo?.hasNextPage));
      setUpdatedAt(trends.updatedAt || new Date().toISOString());
      if (author) setHotAuthor(author.author || null);
    } catch (err: any) {
      setError(err.message || '알 수 없는 오류가 발생했습니다.');
      if (!append) setItems([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  function load() { fetchPage(1, false); }
  function loadMore() { if (!loadingMore && hasNextPage) fetchPage(page + 1, true); }

  useEffect(() => { fetchPage(1, false); }, [genre, sort, mode]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(item => [item.titleKo, item.titleNative, item.titleRomaji, item.titleEnglish, ...item.genres].filter(Boolean).join(' ').toLowerCase().includes(q));
  }, [items, query]);

  const chartData = filtered.slice(0, 10).map(item => ({ name: item.titleKo.length > 8 ? item.titleKo.slice(0, 8) + '…' : item.titleKo, 점수: item.trendScore }));
  const currentTab = tabs.find(tab => tab.key === mode)!;
  const CurrentTabIcon = currentTab.icon;

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#3b1b0d_0,#0a0a0f_38%,#08080c_100%)] px-5 py-6 text-zinc-50 md:px-10">
      <section className="mx-auto max-w-7xl">
        <nav className="mb-8 flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-orange-400/20 p-2"><BookOpen className="h-5 w-5 text-orange-200" /></div>
            <div>
              <p className="text-sm text-zinc-400">Japan Manga Trend Lab</p>
              <h1 className="text-lg font-semibold">일본 인기만화 트렌드</h1>
            </div>
          </div>
          <button onClick={load} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"><RefreshCcw className="h-4 w-4" /> 새로고침</button>
        </nav>

        <header className="grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="card-glow rounded-[2rem] border border-white/10 bg-white/[0.06] p-7 backdrop-blur">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-300/10 px-3 py-1 text-sm text-orange-100"><CurrentTabIcon className="h-4 w-4" /> {currentTab.ko} · {filtered.length}개 표시 · {page}페이지</div>
            <h2 className="text-4xl font-black tracking-tight md:text-6xl">일본 만화 흐름을<br />한국어로 빠르게 본다</h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300">실시간 인기, 신작만화, 초레전드 명작, 순정만화를 탭으로 나눠 확인합니다. 한국어 제목은 수동 매핑 DB를 보강했고, 매핑이 없는 작품은 일본어 원제를 먼저 보여줘서 어색한 자동번역보다 검색하기 쉽게 만들었습니다. 더 보고 싶은 사람은 아래의 ‘35개 더 보기’ 버튼으로 같은 탭의 다음 페이지를 계속 탐색할 수 있습니다.</p>
            <div className="mt-6 flex flex-wrap gap-2 text-sm text-zinc-300">
              <span className="rounded-full bg-white/10 px-3 py-1">35개씩 더보기</span><span className="rounded-full bg-white/10 px-3 py-1">장르별 필터</span><span className="rounded-full bg-white/10 px-3 py-1">신작/명작/순정 탭</span><span className="rounded-full bg-white/10 px-3 py-1">한국어 제목 보강</span>
            </div>
          </motion.div>

          <motion.aside initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 }} className="rounded-[2rem] border border-orange-200/20 bg-orange-300/10 p-6 backdrop-blur">
            <div className="mb-4 flex items-center gap-2 text-orange-100"><Sparkles className="h-5 w-5" /><h3 className="text-xl font-bold">최근 핫한 작가</h3></div>
            {hotAuthor ? <div className="flex gap-4">
              {hotAuthor.image ? <img src={hotAuthor.image} alt={hotAuthor.name} className="h-20 w-20 rounded-3xl object-cover" /> : <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10"><UserRound /></div>}
              <div>
                <p className="text-2xl font-black">{hotAuthor.name}</p>
                <p className="mt-1 text-sm text-zinc-300">대표 상승작: <a className="text-orange-100 underline" href={hotAuthor.mangaUrl} target="_blank">{hotAuthor.work}</a></p>
                <p className="mt-2 text-xs text-zinc-400">역할: {hotAuthor.role || '작가/스태프'} · 트렌드 점수 {hotAuthor.trendScore}</p>
              </div>
            </div> : <p className="text-zinc-300">작가 데이터를 불러오는 중입니다.</p>}
          </motion.aside>
        </header>

        <section className="mt-6 grid gap-3 rounded-[2rem] border border-white/10 bg-white/[0.05] p-3 backdrop-blur md:grid-cols-4">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const active = mode === tab.key;
            return <button key={tab.key} onClick={() => changeMode(tab.key)} className={`rounded-3xl border px-5 py-4 text-left transition ${active ? 'border-orange-200/40 bg-orange-300/20' : 'border-white/10 bg-black/20 hover:bg-white/10'}`}>
              <div className="flex items-center gap-3"><Icon className="h-5 w-5 text-orange-100" /><p className="font-black">{tab.ko}</p></div>
              <p className="mt-1 text-sm text-zinc-400">{tab.desc}</p>
            </button>;
          })}
        </section>

        <section className="mt-6 grid gap-4 rounded-[2rem] border border-white/10 bg-white/[0.05] p-4 backdrop-blur lg:grid-cols-[1fr_220px_220px]">
          <div className="flex items-center gap-3 rounded-2xl bg-black/20 px-4 py-3"><Search className="h-5 w-5 text-zinc-400" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="한국어/일본어/영문 제목 검색" className="w-full bg-transparent outline-none placeholder:text-zinc-500" /></div>
          <select value={genre} onChange={e => setGenre(e.target.value)} className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none">{genres.map(g => <option key={g.key} value={g.key}>{g.ko}</option>)}</select>
          <select value={sort} onChange={e => setSort(e.target.value)} className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none">{sortByMode[mode].map(s => <option key={s.key} value={s.key}>{s.ko}</option>)}</select>
        </section>

        <section className="mt-6 rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 backdrop-blur">
          <div className="mb-4 flex items-center justify-between"><h3 className="flex items-center gap-2 text-xl font-bold"><TrendingUp className="h-5 w-5 text-orange-200" /> 상위 10개 흐름</h3><p className="text-xs text-zinc-500">업데이트: {updatedAt ? new Date(updatedAt).toLocaleString('ko-KR') : '-'}</p></div>
          <div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData}><XAxis dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 12 }} /><YAxis tick={{ fill: '#a1a1aa', fontSize: 12 }} /><Tooltip contentStyle={{ background: '#18181b', border: '1px solid rgba(255,255,255,.12)', borderRadius: 16 }} /><Bar dataKey="점수" radius={[12, 12, 0, 0]} /></BarChart></ResponsiveContainer></div>
        </section>

        {error ? <div className="mt-8 rounded-[2rem] border border-red-400/20 bg-red-500/10 p-8 text-center text-red-100">{error}</div> : null}
        {loading ? <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.05] p-10 text-center text-zinc-400">트렌드 데이터를 불러오는 중...</div> : <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {filtered.map(item => <motion.article key={item.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] backdrop-blur transition hover:-translate-y-1 hover:bg-white/[0.09]">
            <div className="relative h-64 overflow-hidden"><img src={item.cover} alt={item.titleKo} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><div className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-sm font-bold">#{item.rank}</div><div className="absolute bottom-3 right-3 rounded-full bg-orange-300 px-3 py-1 text-sm font-black text-black">{item.trendScore}</div></div>
            <div className="p-5">
              <div className="mb-2 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/10 px-2 py-1 text-[11px] text-zinc-300">{item.statusKo || item.status}</span>
                {item.titleKoSource === 'manual' ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-300/15 px-2 py-1 text-[11px] text-emerald-100"><Star className="h-3 w-3" /> 한국어명</span> : <span className="rounded-full bg-zinc-400/10 px-2 py-1 text-[11px] text-zinc-400">원제 표시</span>}
              </div>
              <h4 className="text-xl font-black leading-tight">{item.titleKo}</h4>
              <p className="mt-1 text-sm text-zinc-400">{item.titleNative || item.titleRomaji}</p>
              {item.titleEnglish && item.titleEnglish !== item.titleKo ? <p className="mt-1 text-xs text-zinc-500">{item.titleEnglish}</p> : null}
              <div className="mt-3 flex flex-wrap gap-2">{item.genres.slice(0, 3).map(g => <span key={g} className="rounded-full bg-white/10 px-2 py-1 text-xs text-zinc-300">{genreKo(g)}</span>)}</div>
              <p className="mt-4 line-clamp-3 text-sm leading-6 text-zinc-300">{item.description || '작품 설명이 아직 충분하지 않습니다.'}</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-zinc-400"><Stat label="평점" value={item.score || '-'} /><Stat label="인기" value={compact(item.popularity)} /><Stat label="상승" value={compact(item.trending)} /></div>
              <a href={item.siteUrl} target="_blank" className="mt-4 block rounded-2xl bg-white/10 px-4 py-3 text-center text-sm font-semibold hover:bg-white/15">상세 보기</a>
            </div>
          </motion.article>)}
        </section>}

        {!loading && !error ? <div className="mt-8 flex flex-col items-center gap-3">
          {hasNextPage ? <button onClick={loadMore} disabled={loadingMore} className="inline-flex items-center gap-2 rounded-full border border-orange-200/30 bg-orange-300/20 px-7 py-4 text-sm font-black text-orange-50 transition hover:bg-orange-300/30 disabled:cursor-not-allowed disabled:opacity-60">
            <ChevronDown className="h-5 w-5" /> {loadingMore ? '다음 35개 불러오는 중...' : '35개 더 보기'}
          </button> : <p className="rounded-full bg-white/10 px-5 py-3 text-sm text-zinc-400">현재 조건에서 더 불러올 작품이 없습니다.</p>}
          <p className="text-xs text-zinc-500">탭/장르/정렬을 바꾸면 1페이지부터 다시 불러옵니다.</p>
        </div> : null}
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) { return <div className="rounded-2xl bg-black/20 px-2 py-2"><p className="font-bold text-zinc-100">{value}</p><p>{label}</p></div>; }
function compact(n: number) { return Intl.NumberFormat('ko-KR', { notation: 'compact' }).format(n || 0); }
function genreKo(g: string) { const map: Record<string,string> = { Action:'액션', Adventure:'모험', Comedy:'코미디', Drama:'드라마', Ecchi:'에치', Fantasy:'판타지', Horror:'호러', Mahou:'마법', Mecha:'메카', Music:'음악', Mystery:'미스터리', Psychological:'심리', Romance:'로맨스', 'Sci-Fi':'SF', 'Slice of Life':'일상', Sports:'스포츠', Supernatural:'초자연', Thriller:'스릴러' }; return map[g] || g; }
