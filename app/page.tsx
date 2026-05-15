'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Flame, RefreshCcw, Search, Sparkles, TrendingUp, UserRound } from 'lucide-react';
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
  { key: 'Slice of Life', ko: '일상' }
];

const sortOptions = [
  { key: 'TRENDING_DESC', ko: '지금 뜨는 순' },
  { key: 'POPULARITY_DESC', ko: '누적 인기 순' },
  { key: 'SCORE_DESC', ko: '평점 순' }
];

type Manga = {
  id: number; rank: number; titleKo: string; titleNative: string; titleRomaji: string; titleEnglish?: string;
  genres: string[]; score: number | null; popularity: number; trending: number; status: string; cover: string; siteUrl: string; description: string; trendScore: number;
  authors: { name: string; image?: string; role?: string; siteUrl?: string }[];
};

type HotAuthor = { name: string; image?: string; role?: string; work: string; nativeTitle: string; mangaUrl: string; trendScore: number } | null;

export default function Home() {
  const [items, setItems] = useState<Manga[]>([]);
  const [genre, setGenre] = useState('');
  const [sort, setSort] = useState('TRENDING_DESC');
  const [query, setQuery] = useState('');
  const [hotAuthor, setHotAuthor] = useState<HotAuthor>(null);
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState('');

  async function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (genre) params.set('genre', genre);
    params.set('sort', sort);
    const [trendsRes, authorRes] = await Promise.all([
      fetch(`/api/manga-trends?${params.toString()}`),
      fetch('/api/hot-author')
    ]);
    const trends = await trendsRes.json();
    const author = await authorRes.json();
    setItems(trends.items || []);
    setUpdatedAt(trends.updatedAt || new Date().toISOString());
    setHotAuthor(author.author || null);
    setLoading(false);
  }

  useEffect(() => { load(); }, [genre, sort]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(item => [item.titleKo, item.titleNative, item.titleRomaji, item.titleEnglish, ...item.genres].filter(Boolean).join(' ').toLowerCase().includes(q));
  }, [items, query]);

  const chartData = filtered.slice(0, 10).map(item => ({ name: item.titleKo.length > 8 ? item.titleKo.slice(0, 8) + '…' : item.titleKo, 점수: item.trendScore }));

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
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-300/10 px-3 py-1 text-sm text-orange-100"><Flame className="h-4 w-4" /> 실시간 트렌딩 DB 기반</div>
            <h2 className="text-4xl font-black tracking-tight md:text-6xl">지금 일본 만화판에서<br />무슨 작품이 뜨는지 본다</h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300">AniList 공개 GraphQL 데이터를 기반으로 트렌딩·인기도·평점을 가져오고, 화면에서는 한국어 제목 우선으로 정리합니다. 공식 한국어명이 애매한 작품은 원제와 로마자명을 함께 표시합니다.</p>
            <div className="mt-6 flex flex-wrap gap-2 text-sm text-zinc-300">
              <span className="rounded-full bg-white/10 px-3 py-1">장르별 필터</span><span className="rounded-full bg-white/10 px-3 py-1">한국어 제목</span><span className="rounded-full bg-white/10 px-3 py-1">핫 작가 랜덤 소개</span><span className="rounded-full bg-white/10 px-3 py-1">Vercel 배포용</span>
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

        <section className="mt-6 grid gap-4 rounded-[2rem] border border-white/10 bg-white/[0.05] p-4 backdrop-blur lg:grid-cols-[1fr_220px_220px]">
          <div className="flex items-center gap-3 rounded-2xl bg-black/20 px-4 py-3"><Search className="h-5 w-5 text-zinc-400" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="한국어/일본어/영문 제목 검색" className="w-full bg-transparent outline-none placeholder:text-zinc-500" /></div>
          <select value={genre} onChange={e => setGenre(e.target.value)} className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none">{genres.map(g => <option key={g.key} value={g.key}>{g.ko}</option>)}</select>
          <select value={sort} onChange={e => setSort(e.target.value)} className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none">{sortOptions.map(s => <option key={s.key} value={s.key}>{s.ko}</option>)}</select>
        </section>

        <section className="mt-6 rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 backdrop-blur">
          <div className="mb-4 flex items-center justify-between"><h3 className="flex items-center gap-2 text-xl font-bold"><TrendingUp className="h-5 w-5 text-orange-200" /> 상위 10개 트렌드 흐름</h3><p className="text-xs text-zinc-500">업데이트: {updatedAt ? new Date(updatedAt).toLocaleString('ko-KR') : '-'}</p></div>
          <div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData}><XAxis dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 12 }} /><YAxis tick={{ fill: '#a1a1aa', fontSize: 12 }} /><Tooltip contentStyle={{ background: '#18181b', border: '1px solid rgba(255,255,255,.12)', borderRadius: 16 }} /><Bar dataKey="점수" radius={[12, 12, 0, 0]} /></BarChart></ResponsiveContainer></div>
        </section>

        {loading ? <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.05] p-10 text-center text-zinc-400">트렌드 데이터를 불러오는 중...</div> : <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map(item => <motion.article key={item.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] backdrop-blur transition hover:-translate-y-1 hover:bg-white/[0.09]">
            <div className="relative h-64 overflow-hidden"><img src={item.cover} alt={item.titleKo} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><div className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-sm font-bold">#{item.rank}</div><div className="absolute bottom-3 right-3 rounded-full bg-orange-300 px-3 py-1 text-sm font-black text-black">{item.trendScore}</div></div>
            <div className="p-5">
              <h4 className="text-xl font-black leading-tight">{item.titleKo}</h4>
              <p className="mt-1 text-sm text-zinc-400">{item.titleNative || item.titleRomaji}</p>
              <div className="mt-3 flex flex-wrap gap-2">{item.genres.slice(0, 3).map(g => <span key={g} className="rounded-full bg-white/10 px-2 py-1 text-xs text-zinc-300">{genreKo(g)}</span>)}</div>
              <p className="mt-4 line-clamp-3 text-sm leading-6 text-zinc-300">{item.description || '작품 설명이 아직 충분하지 않습니다.'}</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-zinc-400"><Stat label="평점" value={item.score || '-'} /><Stat label="인기" value={compact(item.popularity)} /><Stat label="상승" value={compact(item.trending)} /></div>
              <a href={item.siteUrl} target="_blank" className="mt-4 block rounded-2xl bg-white/10 px-4 py-3 text-center text-sm font-semibold hover:bg-white/15">상세 보기</a>
            </div>
          </motion.article>)}
        </section>}
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) { return <div className="rounded-2xl bg-black/20 px-2 py-2"><p className="font-bold text-zinc-100">{value}</p><p>{label}</p></div>; }
function compact(n: number) { return Intl.NumberFormat('ko-KR', { notation: 'compact' }).format(n || 0); }
function genreKo(g: string) { const map: Record<string,string> = { Action:'액션', Adventure:'모험', Comedy:'코미디', Drama:'드라마', Ecchi:'에치', Fantasy:'판타지', Horror:'호러', Mahou:'마법', Mecha:'메카', Music:'음악', Mystery:'미스터리', Psychological:'심리', Romance:'로맨스', 'Sci-Fi':'SF', 'Slice of Life':'일상', Sports:'스포츠', Supernatural:'초자연', Thriller:'스릴러' }; return map[g] || g; }
