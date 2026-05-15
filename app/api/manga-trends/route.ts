import { NextRequest, NextResponse } from 'next/server';
import { fetchMangaTrendPage, MangaMode } from '../../lib/anilist';

const ALLOWED_MODES = ['trending', 'new', 'classic', 'shoujo'];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const genre = searchParams.get('genre') || undefined;
  const sort = searchParams.get('sort') || 'TRENDING_DESC';
  const modeParam = searchParams.get('mode') || 'trending';
  const mode = (ALLOWED_MODES.includes(modeParam) ? modeParam : 'trending') as MangaMode;
  const perPage = Math.min(Math.max(Number(searchParams.get('perPage') || 35), 1), 50);
  const page = Math.min(Math.max(Number(searchParams.get('page') || 1), 1), 20);

  try {
    const result = await fetchMangaTrendPage(genre, sort, perPage, mode, page);
    return NextResponse.json({ updatedAt: new Date().toISOString(), mode, count: result.items.length, pageInfo: result.pageInfo, items: result.items });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to load manga trends' }, { status: 500 });
  }
}
