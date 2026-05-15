export type MangaMode = 'trending' | 'new' | 'classic' | 'shoujo';

export type MangaTrendItem = {
  id: number;
  rank: number;
  titleKo: string;
  titleNative: string;
  titleRomaji: string;
  titleEnglish?: string | null;
  titleKoSource: 'manual' | 'english' | 'romaji' | 'native' | 'unknown';
  genres: string[];
  score: number | null;
  popularity: number;
  trending: number;
  chapters?: number | null;
  status: string;
  statusKo: string;
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

export const STATUS_KO: Record<string, string> = {
  FINISHED: '완결', RELEASING: '연재중', NOT_YET_RELEASED: '공개 예정', CANCELLED: '중단', HIATUS: '휴재'
};

// AniList는 한국어 제목을 항상 제공하지 않기 때문에 인기작/신작/명작 위주로 수동 한국어명을 보강합니다.
// 나중에 더 정확도를 올리려면 이 맵만 계속 추가하면 됩니다.
export const KO_TITLE_MAP: Record<string, string> = {
  'ONE PIECE': '원피스', 'One Piece': '원피스', 'NARUTO': '나루토', 'BLEACH': '블리치', 'Dragon Ball': '드래곤볼', 'Dragon Ball Super': '드래곤볼 슈퍼',
  'Jujutsu Kaisen': '주술회전', 'Kimetsu no Yaiba': '귀멸의 칼날', 'Demon Slayer: Kimetsu no Yaiba': '귀멸의 칼날', 'Chainsaw Man': '체인소 맨', 'SPY×FAMILY': '스파이 패밀리', 'SPY x FAMILY': '스파이 패밀리', 'Spy x Family': '스파이 패밀리',
  'Boku no Hero Academia': '나의 히어로 아카데미아', 'My Hero Academia': '나의 히어로 아카데미아', 'Kingdom': '킹덤', 'Blue Lock': '블루 록', 'Oshi no Ko': '최애의 아이', '[Oshi no Ko]': '최애의 아이',
  'Sousou no Frieren': '장송의 프리렌', 'Frieren: Beyond Journey’s End': '장송의 프리렌', 'Frieren: Beyond Journey\'s End': '장송의 프리렌', 'Dungeon Meshi': '던전밥', 'Delicious in Dungeon': '던전밥',
  'Sakamoto Days': '사카모토 데이즈', 'Kaijuu 8-gou': '괴수 8호', 'Kaiju No. 8': '괴수 8호', 'Dandadan': '단다단', 'DAN DA DAN': '단다단', 'Tokyo Revengers': '도쿄 리벤저스',
  'Ao no Hako': '푸른 상자', 'Blue Box': '푸른 상자', 'Kagurabachi': '카구라바치', 'Hunter x Hunter': '헌터×헌터', 'HUNTER×HUNTER': '헌터×헌터', 'Berserk': '베르세르크', 'Vinland Saga': '빈란드 사가',
  'Golden Kamuy': '골든 카무이', 'Yotsuba to!': '요츠바랑!', 'Yotsuba&!': '요츠바랑!', 'Skip to Loafer': '스킵과 로퍼', 'Skip and Loafer': '스킵과 로퍼',
  'The Apothecary Diaries': '약사의 혼잣말', 'Kusuriya no Hitorigoto': '약사의 혼잣말', 'Mairimashita! Iruma-kun': '마계학교 이루마군', 'Welcome to Demon School! Iruma-kun': '마계학교 이루마군',
  'Black Clover': '블랙 클로버', 'World Trigger': '월드 트리거', 'Haikyuu!!': '하이큐!!', 'Haikyu!!': '하이큐!!', 'Attack on Titan': '진격의 거인', 'Shingeki no Kyojin': '진격의 거인',
  'Fullmetal Alchemist': '강철의 연금술사', 'Death Note': '데스노트', 'Monster': '몬스터', '20th Century Boys': '20세기 소년', 'NANA': '나나', 'Slam Dunk': '슬램덩크', 'REAL': '리얼', 'Vagabond': '배가본드',
  'JoJo no Kimyou na Bouken': '죠죠의 기묘한 모험', 'JoJo\'s Bizarre Adventure': '죠죠의 기묘한 모험', 'Hajime no Ippo': '더 파이팅', 'Detective Conan': '명탐정 코난', 'Meitantei Conan': '명탐정 코난',
  'Made in Abyss': '메이드 인 어비스', 'Mushoku Tensei': '무직전생', 'Mushoku Tensei: Jobless Reincarnation': '무직전생', 'Kaguya-sama wa Kokurasetai': '카구야 님은 고백받고 싶어', 'Kaguya-sama: Love is War': '카구야 님은 고백받고 싶어',
  'Horimiya': '호리미야', 'Wotaku ni Koi wa Muzukashii': '오타쿠에게 사랑은 어려워', 'Wotakoi: Love is Hard for Otaku': '오타쿠에게 사랑은 어려워', 'Yofukashi no Uta': '철야의 노래', 'Call of the Night': '철야의 노래',
  'Akatsuki no Yona': '새벽의 연화', 'Yona of the Dawn': '새벽의 연화', 'Natsume Yuujinchou': '나츠메 우인장', 'Natsume\'s Book of Friends': '나츠메 우인장', 'Chi.: Chikyuu no Undou ni Tsuite': '지. -지구의 운동에 대하여-',
  'Fire Punch': '파이어 펀치', 'Look Back': '룩 백', 'Goodbye, Eri': '안녕, 에리', 'Yotsuba to': '요츠바랑!', 'Gokurakugai': '고쿠라쿠가이', 'Nue no Onmyouji': '누에의 음양사',
  'Akane-banashi': '아카네 이야기', 'The Ichinose Family\'s Deadly Sins': '이치노세가의 대죄', 'Witch Watch': '위치 워치', 'Ruri Dragon': '루리 드래곤', 'Centuria': '센튜리아', 'The Bugle Call': '전령의 나팔',
  'Gachiakuta': '가치아쿠타', 'Medalist': '메달리스트', 'Smoking Behind the Supermarket with You': '슈퍼 뒤에서 담배 피우는 두 사람', 'Hirayasumi': '히라야스미', 'Fool Night': '풀 나이트',
  'Kowloon Generic Romance': '구룡 제네릭 로맨스', 'A Witch\'s Life in Mongol': '몽골의 마녀', 'The Summer Hikaru Died': '히카루가 죽은 여름', 'Hikaru ga Shinda Natsu': '히카루가 죽은 여름',
  'A Sign of Affection': '손끝과 연연', 'Yubisaki to Renren': '손끝과 연연', 'Wind Breaker': '윈드 브레이커', 'Blue Period': '블루 피리어드', 'Jigokuraku': '지옥락', 'Hell\'s Paradise: Jigokuraku': '지옥락',
  'The Fragrant Flower Blooms With Dignity': '향기로운 꽃은 늠름하게 핀다', 'Kaoru Hana wa Rin to Saku': '향기로운 꽃은 늠름하게 핀다', 'Orb: On the Movements of the Earth': '지. -지구의 운동에 대하여-',
  'Gintama': '은혼', 'The Promised Neverland': '약속의 네버랜드', 'Yakusoku no Neverland': '약속의 네버랜드', 'Dr. STONE': '닥터 스톤', 'Dr. Stone': '닥터 스톤', 'Mob Psycho 100': '모브 사이코 100',
  'One Punch-Man': '원펀맨', 'One-Punch Man': '원펀맨', 'The Fable': '더 페이블', 'Ajin': '아인', 'Tokyo Ghoul': '도쿄 구울', 'Black Butler': '흑집사', 'Kuroshitsuji': '흑집사',
  'A Silent Voice': '목소리의 형태', 'Koe no Katachi': '목소리의 형태', 'March comes in like a lion': '3월의 라이온', '3-gatsu no Lion': '3월의 라이온', 'Honey and Clover': '허니와 클로버',
  'Girls\' Last Tour': '소녀종말여행', 'Shoujo Shuumatsu Ryokou': '소녀종말여행', 'Land of the Lustrous': '보석의 나라', 'Houseki no Kuni': '보석의 나라', 'Witch Hat Atelier': '위치 햇 아틀리에', 'Tongari Boushi no Atelier': '위치 햇 아틀리에',
  'Kimi ni Todoke': '너에게 닿기를', 'Kimi ni Todoke: From Me to You': '너에게 닿기를', 'Fruits Basket': '후르츠 바스켓', 'Ouran High School Host Club': '오란고교 호스트부', 'Ouran Koukou Host Club': '오란고교 호스트부',
  'Ao Haru Ride': '아오하라이드', 'Blue Spring Ride': '아오하라이드', 'Strobe Edge': '스트롭 에지', 'Orange': '오렌지', 'Lovely★Complex': '러브★콤플렉스', 'Lovely Complex': '러브 콤플렉스',
  'Nodame Cantabile': '노다메 칸타빌레', 'Paradise Kiss': '파라다이스 키스', 'Kaichou wa Maid-sama!': '회장님은 메이드 사마!', 'Maid Sama!': '회장님은 메이드 사마!',
  'Sukitte Ii na yo.': '좋아한다고 말해', 'Say "I Love You."': '좋아한다고 말해', 'Namaikizakari.': '건방진 그녀석', 'Honey Lemon Soda': '허니 레몬 소다',
  'Kamisama Hajimemashita': '오늘부터 신령님', 'Kamisama Kiss': '오늘부터 신령님', 'Tonari no Kaibutsu-kun': '옆자리 괴물군', 'My Little Monster': '옆자리 괴물군',
  'Hirunaka no Ryuusei': '한낮의 유성', 'Daytime Shooting Star': '한낮의 유성', 'Tsubaki-chou Lonely Planet': '츠바키쵸 론리 플래닛', 'Yubisaki to Renren': '손끝과 연연',
  'A Sign of Affection': '손끝과 연연', 'Akatsuki no Yona': '새벽의 연화', 'Yona of the Dawn': '새벽의 연화', 'Skip Beat!': '스킵 비트!', 'Nana': '나나'
};

const QUERY = `
query MangaTrends($page: Int, $perPage: Int, $genre: String, $tag: String, $sort: [MediaSort], $status: MediaStatus, $startDateGreater: FuzzyDateInt, $startDateLesser: FuzzyDateInt) {
  Page(page: $page, perPage: $perPage) {
    pageInfo { currentPage hasNextPage total perPage lastPage }
    media(type: MANGA, countryOfOrigin: "JP", genre: $genre, tag: $tag, sort: $sort, status: $status, startDate_greater: $startDateGreater, startDate_lesser: $startDateLesser, isAdult: false) {
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

function modeToVariables(mode: MangaMode, sort: string) {
  if (mode === 'shoujo') {
    return { sort: [sort || 'TRENDING_DESC'], status: undefined, startDateGreater: undefined, startDateLesser: undefined, tag: 'Shoujo', fallbackGenre: 'Romance' };
  }
  if (mode === 'new') {
    return { sort: [sort || 'START_DATE_DESC'], status: undefined, startDateGreater: 20220101, startDateLesser: undefined, tag: undefined, fallbackGenre: undefined };
  }
  if (mode === 'classic') {
    return { sort: [sort || 'SCORE_DESC'], status: 'FINISHED', startDateGreater: undefined, startDateLesser: 20170101, tag: undefined, fallbackGenre: undefined };
  }
  return { sort: [sort || 'TRENDING_DESC'], status: undefined, startDateGreater: undefined, startDateLesser: undefined, tag: undefined, fallbackGenre: undefined };
}

export type MangaTrendResult = {
  items: MangaTrendItem[];
  pageInfo: { currentPage: number; hasNextPage: boolean; total: number; perPage: number; lastPage: number };
};

export async function fetchMangaTrends(genre?: string, sort = 'TRENDING_DESC', perPage = 35, mode: MangaMode = 'trending', page = 1): Promise<MangaTrendItem[]> {
  const result = await fetchMangaTrendPage(genre, sort, perPage, mode, page);
  return result.items;
}

export async function fetchMangaTrendPage(genre?: string, sort = 'TRENDING_DESC', perPage = 35, mode: MangaMode = 'trending', page = 1): Promise<MangaTrendResult> {
  const modeVars = modeToVariables(mode, sort);
  const res = await fetch(ANILIST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      query: QUERY,
      variables: {
        page,
        perPage,
        genre: genre || modeVars.fallbackGenre || null,
        tag: modeVars.tag || null,
        sort: modeVars.sort,
        status: modeVars.status,
        startDateGreater: modeVars.startDateGreater,
        startDateLesser: modeVars.startDateLesser
      }
    }),
    next: { revalidate: mode === 'trending' ? 60 * 20 : 60 * 60 }
  });
  if (!res.ok) throw new Error(`AniList API error: ${res.status}`);
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0]?.message || 'AniList GraphQL error');
  const pageInfo = json?.data?.Page?.pageInfo ?? { currentPage: page, hasNextPage: false, total: 0, perPage, lastPage: page };
  const media = json?.data?.Page?.media ?? [];
  return {
    pageInfo,
    items: media.map((m: any, idx: number) => normalizeManga(m, idx + (page - 1) * perPage))
  };
}

function normalizeManga(m: any, idx: number): MangaTrendItem {
  const titleRomaji = m.title?.romaji || '';
  const titleEnglish = m.title?.english || '';
  const titleNative = m.title?.native || '';
  const { titleKo, source } = getKoreanTitle(titleEnglish, titleRomaji, titleNative);
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
    titleKoSource: source,
    genres: m.genres || [],
    score: m.averageScore,
    popularity: m.popularity || 0,
    trending: m.trending || 0,
    chapters: m.chapters,
    status: m.status,
    statusKo: STATUS_KO[m.status] || m.status || '상태 미상',
    cover: m.coverImage?.extraLarge || m.coverImage?.large,
    siteUrl: m.siteUrl,
    description: stripHtml(m.description || '').slice(0, 220),
    trendScore,
    authors
  };
}

function getKoreanTitle(english: string, romaji: string, native: string): { titleKo: string; source: MangaTrendItem['titleKoSource'] } {
  const keys = [english, romaji, native].filter(Boolean);
  for (const key of keys) {
    if (KO_TITLE_MAP[key]) return { titleKo: KO_TITLE_MAP[key], source: 'manual' };
  }
  // 완벽한 번역이 없는 작품은 일본어 원제를 우선 노출해서 어색한 자동번역보다 검색 가능성을 높입니다.
  if (native) return { titleKo: native, source: 'native' };
  if (english) return { titleKo: english, source: 'english' };
  if (romaji) return { titleKo: romaji, source: 'romaji' };
  return { titleKo: '제목 확인 필요', source: 'unknown' };
}

function stripHtml(input: string) {
  return input.replace(/<[^>]*>?/gm, '').replace(/\n/g, ' ').trim();
}
