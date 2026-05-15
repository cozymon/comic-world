export type MangaTrendItem = {
  id: number;
  rank: number;
  titleKo: string;
  titleNative: string;
  titleRomaji: string;
  titleEnglish?: string | null;
  genres: string[];
  score: number | null;
  popularity: number;
  trending: number;
  chapters?: number | null;
  status: string;
  cover: string;
  siteUrl: string;
  description: string;
  trendScore: number;
  authors: { name: string; image?: string | null; role?: string | null; siteUrl?: string | null }[];
};

const ANILIST_URL = 'https://graphql.anilist.co';

export const GENRE_KO: Record<string, string> = {
  Action: '액션', Adventure: '모험', Comedy: '코미디', Drama: '드라마', Ecchi: '에치', Fantasy: '판타지', Horror: '호러', Mahou: '마법', Mecha: '메카', Music: '음악', Mystery: '미스터리', Psychological: '심리', Romance: '로맨스', 'Sci-Fi': 'SF', 'Slice of Life': '일상', Sports: '스포츠', Supernatural: '초자연', Thriller: '스릴러'
};

// 한국어 제목은 공식 API에 항상 존재하지 않아서, 유명작/랭킹권 작품은 우선 매핑하고 나머지는 원제+영문으로 표시합니다.
export const KO_TITLE_MAP: Record<string, string> = {
  'ONE PIECE': '원피스', 'Jujutsu Kaisen': '주술회전', 'Kimetsu no Yaiba': '귀멸의 칼날', 'Chainsaw Man': '체인소 맨', 'SPY×FAMILY': '스파이 패밀리', 'Spy x Family': '스파이 패밀리', 'Boku no Hero Academia': '나의 히어로 아카데미아', 'My Hero Academia': '나의 히어로 아카데미아', 'Kingdom': '킹덤', 'Blue Lock': '블루 록', 'Oshi no Ko': '최애의 아이', 'Sousou no Frieren': '장송의 프리렌', 'Frieren: Beyond Journey’s End': '장송의 프리렌', 'Dungeon Meshi': '던전밥', 'Sakamoto Days': '사카모토 데이즈', 'Kaijuu 8-gou': '괴수 8호', 'Kaiju No. 8': '괴수 8호', 'Dandadan': '단다단', 'Tokyo Revengers': '도쿄 리벤저스', 'Ao no Hako': '푸른 상자', 'Blue Box': '푸른 상자', 'Kagurabachi': '카구라바치', 'Hunter x Hunter': '헌터×헌터', 'Dragon Ball Super': '드래곤볼 슈퍼', 'Berserk': '베르세르크', 'Vinland Saga': '빈란드 사가', 'Golden Kamuy': '골든 카무이', 'Yotsuba to!': '요츠바랑!', 'Skip to Loafer': '스킵과 로퍼', 'The Apothecary Diaries': '약사의 혼잣말', 'Kusuriya no Hitorigoto': '약사의 혼잣말', 'Mairimashita! Iruma-kun': '마계학교 이루마군', 'Black Clover': '블랙 클로버', 'World Trigger': '월드 트리거'
};

const QUERY = `
query MangaTrends($page: Int, $perPage: Int, $genre: String, $sort: [MediaSort]) {
  Page(page: $page, perPage: $perPage) {
    media(type: MANGA, countryOfOrigin: "JP", genre: $genre, sort: $sort, isAdult: false) {
      id
      title { romaji english native }
      genres
      averageScore
      popularity
      trending
      chapters
      status
      siteUrl
      description(asHtml: false)
      coverImage { large extraLarge color }
      staff(sort: RELEVANCE, perPage: 4) {
        nodes { name { full native } image { medium } siteUrl }
        edges { role }
      }
    }
  }
}`;

export async function fetchMangaTrends(genre?: string, sort: string = 'TRENDING_DESC', perPage = 24): Promise<MangaTrendItem[]> {
  const res = await fetch(ANILIST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ query: QUERY, variables: { page: 1, perPage, genre: genre || null, sort: [sort] } }),
    next: { revalidate: 60 * 30 }
  });
  if (!res.ok) throw new Error(`AniList API error: ${res.status}`);
  const json = await res.json();
  const media = json?.data?.Page?.media ?? [];
  return media.map((m: any, idx: number) => normalizeManga(m, idx));
}

function normalizeManga(m: any, idx: number): MangaTrendItem {
  const titleRomaji = m.title?.romaji || '';
  const titleEnglish = m.title?.english || '';
  const titleNative = m.title?.native || '';
  const titleKo = KO_TITLE_MAP[titleEnglish] || KO_TITLE_MAP[titleRomaji] || KO_TITLE_MAP[titleNative] || titleEnglish || titleRomaji || titleNative || '제목 확인 필요';
  const trendScore = Math.round(((m.trending || 0) * 1.4 + (m.popularity || 0) / 150 + (m.averageScore || 0) * 8));
  const authors = (m.staff?.nodes || []).map((n: any, i: number) => ({
    name: n.name?.full || n.name?.native,
    image: n.image?.medium,
    role: m.staff?.edges?.[i]?.role || '작가/스태프',
    siteUrl: n.siteUrl
  })).filter((a: any) => a.name);

  return {
    id: m.id,
    rank: idx + 1,
    titleKo,
    titleNative,
    titleRomaji,
    titleEnglish,
    genres: m.genres || [],
    score: m.averageScore,
    popularity: m.popularity || 0,
    trending: m.trending || 0,
    chapters: m.chapters,
    status: m.status,
    cover: m.coverImage?.extraLarge || m.coverImage?.large,
    siteUrl: m.siteUrl,
    description: stripHtml(m.description || '').slice(0, 220),
    trendScore,
    authors
  };
}

function stripHtml(input: string) {
  return input.replace(/<[^>]*>?/gm, '').replace(/\n/g, ' ').trim();
}
