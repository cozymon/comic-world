import { NextRequest, NextResponse } from 'next/server';
import { fetchMangaTrends } from '../../lib/anilist';

const MODE_SORT: Record<string, string> = {
  trending: 'TRENDING_DESC',
  new: 'START_DATE_DESC',
  classic: 'SCORE_DESC'
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const genre = searchParams.get('genre') || undefined;
  const mode = searchParams.get('mode') || 'trending';
  const sort = searchParams.get('sort') || MODE_SORT[mode] || 'TRENDING_DESC';
  const perPage = Number(searchParams.get('perPage') || 35);

  try {
    const items = await fetchMangaTrends(genre, sort, Math.min(Math.max(perPage, 1), 50));
    return NextResponse.json({ updatedAt: new Date().toISOString(), mode, items });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to load manga trends' }, { status: 500 });
  }
}
