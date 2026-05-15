import { NextResponse } from 'next/server';
import { fetchMangaTrends } from '../../lib/anilist';

export async function GET() {
  try {
    const items = await fetchMangaTrends(undefined, 'TRENDING_DESC', 40);
    const candidates = items.flatMap(item => item.authors.map(author => ({ ...author, work: item.titleKo, nativeTitle: item.titleNative, mangaUrl: item.siteUrl, trendScore: item.trendScore })));
    const strong = candidates.filter(a => a.name && a.trendScore > 100);
    const pool = strong.length ? strong : candidates;
    const picked = pool[Math.floor(Math.random() * pool.length)];
    return NextResponse.json({ updatedAt: new Date().toISOString(), author: picked || null });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to load hot author' }, { status: 500 });
  }
}
