# 일본 인기만화 트렌드 대시보드

Vercel 배포용 Next.js 프로젝트입니다.

## 기능
- AniList GraphQL 기반 일본 만화 트렌딩/인기/평점 데이터
- 한국어 제목 우선 표시
- 장르별 필터
- 검색
- 상위 10개 트렌드 차트
- 최근 핫한 작가 랜덤 코너

## 로컬 실행
```bash
npm install
npm run dev
```

## Vercel 배포
1. 이 폴더를 GitHub 저장소에 업로드
2. Vercel에서 New Project
3. 해당 GitHub 저장소 선택
4. Framework Preset: Next.js
5. Deploy

## 주의
AniList는 한국어 제목을 공식 필드로 항상 제공하지 않습니다. `app/lib/anilist.ts`의 `KO_TITLE_MAP`에 유명작 한국어 제목을 계속 추가하면 정확도가 좋아집니다.
