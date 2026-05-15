import { NextRequest, NextResponse } from 'next/server';
import { fetchMangaTrends } from '../../lib/anilist';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const genre = searchParams.get('genre') || undefined;
  const sort = searchParams.get('sort') || 'TRENDING_DESC';
  try {
    const items = await fetchMangaTrends(genre, sort, 24);
    return NextResponse.json({ updatedAt: new Date().toISOString(), items });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to load manga trends' }, { status: 500 });
  }
}
