# Japan Manga Trend Lab v5

Vercel/GitHub 배포용 Next.js 프로젝트입니다.

## v5 업데이트

- 각 탭에서 기본 35개 표시
- `35개 더 보기` 버튼 추가
- 버튼 클릭 시 AniList 다음 페이지를 이어서 불러오는 페이지네이션 구조
- 탭/장르/정렬 변경 시 1페이지부터 다시 로드
- 실시간 인기 / 신작만화 / 초레전드 명작 / 순정만화 탭 유지
- 한국어 제목 매핑 DB 유지 및 보강 가능

## 실행

```bash
npm install
npm run dev
```

## Vercel 배포

```bash
npm run build
git add .
git commit -m "Add manga pagination"
git push
```

Vercel에 GitHub repo가 연결되어 있으면 자동으로 재배포됩니다.

## 한국어 제목 보강

`app/lib/anilist.ts`의 `KO_TITLE_MAP`에 작품명을 계속 추가하면 됩니다.
