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
  Action: '액션',
  Adventure: '모험',
  Comedy: '코미디',
  Drama: '드라마',
  Ecchi: '에치',
  Fantasy: '판타지',
  Horror: '호러',
  Mahou: '마법',
  Mecha: '메카',
  Music: '음악',
  Mystery: '미스터리',
  Psychological: '심리',
  Romance: '로맨스',
  'Sci-Fi': 'SF',
  'Slice of Life': '일상',
  Sports: '스포츠',
  Supernatural: '초자연',
  Thriller: '스릴러'
};

// AniList가 한국어 제목 필드를 안정적으로 제공하지 않기 때문에, 주요 작품은 로컬 매핑으로 보강합니다.
// 화면에서는 이 매핑을 가장 먼저 사용하고, 없으면 영문/로마자/일본어 원제를 함께 보여줍니다.
export const KO_TITLE_MAP: Record<string, string> = {
  'ONE PIECE': '원피스',
  'Naruto': '나루토',
  'BLEACH': '블리치',
  'Dragon Ball': '드래곤볼',
  'Dragon Ball Super': '드래곤볼 슈퍼',
  'SLAM DUNK': '슬램덩크',
  'DEATH NOTE': '데스노트',
  'HUNTER×HUNTER': '헌터×헌터',
  'Hunter x Hunter': '헌터×헌터',
  'Fullmetal Alchemist': '강철의 연금술사',
  'Hagane no Renkinjutsushi': '강철의 연금술사',
  'Attack on Titan': '진격의 거인',
  'Shingeki no Kyojin': '진격의 거인',
  'Demon Slayer: Kimetsu no Yaiba': '귀멸의 칼날',
  'Kimetsu no Yaiba': '귀멸의 칼날',
  'Jujutsu Kaisen': '주술회전',
  'Chainsaw Man': '체인소 맨',
  'SPY×FAMILY': '스파이 패밀리',
  'Spy x Family': '스파이 패밀리',
  'Boku no Hero Academia': '나의 히어로 아카데미아',
  'My Hero Academia': '나의 히어로 아카데미아',
  'Kingdom': '킹덤',
  'Blue Lock': '블루 록',
  'Oshi no Ko': '최애의 아이',
  '【OSHI NO KO】': '최애의 아이',
  'Sousou no Frieren': '장송의 프리렌',
  'Frieren: Beyond Journey’s End': '장송의 프리렌',
  'Frieren: Beyond Journey\'s End': '장송의 프리렌',
  'Dungeon Meshi': '던전밥',
  'Delicious in Dungeon': '던전밥',
  'Sakamoto Days': '사카모토 데이즈',
  'Kaijuu 8-gou': '괴수 8호',
  'Kaiju No. 8': '괴수 8호',
  'Dandadan': '단다단',
  'DAN DA DAN': '단다단',
  'Tokyo Revengers': '도쿄 리벤저스',
  'Ao no Hako': '푸른 상자',
  'Blue Box': '푸른 상자',
  'Kagurabachi': '카구라바치',
  'Berserk': '베르세르크',
  'Vinland Saga': '빈란드 사가',
  'Golden Kamuy': '골든 카무이',
  'Yotsuba to!': '요츠바랑!',
  'Yotsuba&!': '요츠바랑!',
  'Skip to Loafer': '스킵과 로퍼',
  'Skip and Loafer': '스킵과 로퍼',
  'The Apothecary Diaries': '약사의 혼잣말',
  'Kusuriya no Hitorigoto': '약사의 혼잣말',
  'Mairimashita! Iruma-kun': '마계학교 이루마군',
  'Welcome to Demon School! Iruma-kun': '마계학교 이루마군',
  'Black Clover': '블랙 클로버',
  'World Trigger': '월드 트리거',
  'Tokyo Ghoul': '도쿄 구울',
  'Haikyu!!': '하이큐!!',
  'Haikyuu!!': '하이큐!!',
  'Kuroko no Basket': '쿠로코의 농구',
  'Kuroko\'s Basketball': '쿠로코의 농구',
  'The Promised Neverland': '약속의 네버랜드',
  'Yakusoku no Neverland': '약속의 네버랜드',
  'JoJo no Kimyou na Bouken': '죠죠의 기묘한 모험',
  'JoJo\'s Bizarre Adventure': '죠죠의 기묘한 모험',
  'Vagabond': '배가본드',
  '20th Century Boys': '20세기 소년',
  'Monster': '몬스터',
  'PLUTO': '플루토',
  'NANA': '나나',
  'Nodame Cantabile': '노다메 칸타빌레',
  'Kimi ni Todoke': '너에게 닿기를',
  'Fruits Basket': '후르츠 바스켓',
  'Ouran High School Host Club': '오란고교 호스트부',
  'Kaguya-sama: Love is War': '카구야 님은 고백받고 싶어',
  'Kaguya-sama wa Kokurasetai': '카구야 님은 고백받고 싶어',
  'Horimiya': '호리미야',
  'Wotakoi: Love is Hard for Otaku': '오타쿠에게 사랑은 어려워',
  'Wotaku ni Koi wa Muzukashii': '오타쿠에게 사랑은 어려워',
  'A Sign of Affection': '손끝과 연연',
  'Yubisaki to Renren': '손끝과 연연',
  'The Fragrant Flower Blooms With Dignity': '향기로운 꽃은 늠름하게 핀다',
  'Kaoru Hana wa Rin to Saku': '향기로운 꽃은 늠름하게 핀다',
  'Medalist': '메달리스트',
  'Akane-banashi': '아카네 이야기',
  'Witch Watch': '위치 워치',
  'Fire Force': '불꽃 소방대',
  'Enen no Shouboutai': '불꽃 소방대',
  'Soul Eater': '소울 이터',
  'Blue Exorcist': '청의 엑소시스트',
  'Ao no Exorcist': '청의 엑소시스트',
  'Dr. STONE': '닥터 스톤',
  'The Elusive Samurai': '도망을 잘 치는 도련님',
  'Nige Jouzu no Wakagimi': '도망을 잘 치는 도련님',
  'Undead Unluck': '언데드 언럭',
  'Mission: Yozakura Family': '요자쿠라 일가의 대작전',
  'Yozakura-san Chi no Daisakusen': '요자쿠라 일가의 대작전',
  'Gachiakuta': '가치아쿠타',
  'Blue Period': '블루 피리어드',
  'March comes in like a lion': '3월의 라이온',
  '3-gatsu no Lion': '3월의 라이온',
  'Made in Abyss': '메이드 인 어비스',
  'Land of the Lustrous': '보석의 나라',
  'Houseki no Kuni': '보석의 나라',
  'To Your Eternity': '불멸의 그대에게',
  'Fumetsu no Anata e': '불멸의 그대에게',
  'The Ancient Magus\' Bride': '마법사의 신부',
  'Mahoutsukai no Yome': '마법사의 신부',
  'Mushoku Tensei: Jobless Reincarnation': '무직전생',
  'Mushoku Tensei: Isekai Ittara Honki Dasu': '무직전생',
  'That Time I Got Reincarnated as a Slime': '전생했더니 슬라임이었던 건에 대하여',
  'Tensei Shitara Slime Datta Ken': '전생했더니 슬라임이었던 건에 대하여',
  'Re:ZERO -Starting Life in Another World-': 'Re:제로부터 시작하는 이세계 생활',
  'Re:Zero kara Hajimeru Isekai Seikatsu': 'Re:제로부터 시작하는 이세계 생활',
  'Overlord': '오버로드',
  'KonoSuba: God\'s Blessing on This Wonderful World!': '이 멋진 세계에 축복을!',
  'Kono Subarashii Sekai ni Shukufuku wo!': '이 멋진 세계에 축복을!',
  'One-Punch Man': '원펀맨',
  'Mob Psycho 100': '모브 사이코 100',
  'Hellsing': '헬싱',
  'Claymore': '클레이모어',
  'Gintama': '은혼',
  'Detective Conan': '명탐정 코난',
  'Meitantei Conan': '명탐정 코난',
  'Case Closed': '명탐정 코난',
  'Doraemon': '도라에몽',
  'Crayon Shin-chan': '짱구는 못말려',
  'Crayon Shin Chan': '짱구는 못말려',
  'Cardcaptor Sakura': '카드캡터 사쿠라',
  'Sailor Moon': '세일러 문',
  'Bishoujo Senshi Sailor Moon': '세일러 문',
  'Inuyasha': '이누야샤',
  'Ranma ½': '란마 1/2',
  'Ranma 1/2': '란마 1/2',
  'Urusei Yatsura': '시끌별 녀석들',
  'Lone Wolf and Cub': '아기와 나그네',
  'Oyasumi Punpun': '잘 자, 푼푼',
  'Goodnight Punpun': '잘 자, 푼푼',
  'Chi.: Chikyuu no Undou ni Tsuite': '지. -지구의 운동에 대하여-',
  'Orb: On the Movements of the Earth': '지. -지구의 운동에 대하여-',
  'Hirayasumi': '히라야스미',
  'Smoking Behind the Supermarket with You': '슈퍼 뒤에서 담배 피우는 두 사람',
  'Super no Ura de Yani Suu Futari': '슈퍼 뒤에서 담배 피우는 두 사람',
  'Girl Meets Rock!': '걸 미츠 록!',
  'Futsuu no Keionbu': '평범한 경음부',
  'Centuria': '센투리아',
  'RuriDragon': '루리드래곤',
  'Boruto: Two Blue Vortex': '보루토: 투 블루 볼텍스',
  'Boruto: Naruto Next Generations': '보루토: 나루토 넥스트 제너레이션즈'
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

export async function fetchMangaTrends(genre?: string, sort: string = 'TRENDING_DESC', perPage = 35): Promise<MangaTrendItem[]> {
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

export function pickKoreanTitle(titleEnglish?: string | null, titleRomaji?: string | null, titleNative?: string | null) {
  const candidates = [titleEnglish, titleRomaji, titleNative].filter(Boolean) as string[];
  for (const title of candidates) {
    const exact = KO_TITLE_MAP[title];
    if (exact) return exact;
    const normalized = title.replace(/[‐‑‒–—]/g, '-').replace(/\s+/g, ' ').trim();
    if (KO_TITLE_MAP[normalized]) return KO_TITLE_MAP[normalized];
  }
  // 매핑이 없는 작품은 일본어 원제가 있으면 원제를 제목처럼 보여주고, 부제에 로마자/영문을 함께 보여줍니다.
  return titleNative || titleEnglish || titleRomaji || '제목 확인 필요';
}

function normalizeManga(m: any, idx: number): MangaTrendItem {
  const titleRomaji = m.title?.romaji || '';
  const titleEnglish = m.title?.english || '';
  const titleNative = m.title?.native || '';
  const titleKo = pickKoreanTitle(titleEnglish, titleRomaji, titleNative);
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
