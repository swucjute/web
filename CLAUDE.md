# CLAUDE.md

이 파일은 Claude Code가 프로젝트 컨텍스트를 이해하기 위한 가이드입니다.

## 프로젝트 개요

주뜨 청년부 앱 React 프론트엔드 웹 애플리케이션.

## 기술 스택

- React 19, TypeScript, Vite
- Tailwind CSS 4, shadcn/ui (Radix UI)
- React Router 7, Zustand, TanStack React Query
- React Hook Form, date-fns, Recharts
- MSW (Mock Service Worker) - API 모킹
- PWA (Progressive Web App) 지원

## 디렉토리 구조

```
src/
├── components/       <- 재사용 가능한 UI 컴포넌트
├── pages/           <- 각 페이지 컴포넌트
├── contexts/        <- React Context (인증, 데이터, 플랫폼)
├── mocks/           <- MSW API 모킹
├── utils/           <- 유틸리티 함수
├── types/           <- TypeScript 타입 정의
└── styles/          <- 글로벌 스타일

public/
├── manifest.json    <- PWA 설정
├── sw.js           <- Service Worker
└── mockServiceWorker.js  <- MSW 워커
```

## 빌드 및 실행

```bash
npm install              # 의존성 설치
npm run dev              # 개발 서버 시작
npm run build            # 프로덕션 빌드
npm run lint             # 코드 검사
npm run preview          # 빌드된 앱 미리보기
```

## 코딩 규칙

- 함수 컴포넌트 사용, 클래스 컴포넌트 사용 금지
- `console.log` 대신 필요시에만 사용, 프로덕션 빌드 전 제거
- 상태 관리: 전역 상태는 Zustand, 서버 상태는 React Query 사용
- Props는 TypeScript 인터페이스로 정의
- 페이지 네비게이션은 React Router 사용
- API 호출은 `src/utils/api.ts`에 정의된 함수 사용
- 개발 중에는 MSW로 API를 모킹하여 진행 (`src/mocks/handlers.ts` 수정)

## 커밋 컨벤션

- 한글로 작성
- Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:` 등
- 제목 50자 이내, 마침표 없음
- 예: `feat: 멤버 프로필 페이지 구현`

## 브랜치 전략

- main: 프로덕션 (직접 push 금지)
- develop: 개발 통합 (PR만 허용, dev 서버 자동 배포)
- 작업 브랜치: `feat/`, `fix/`, `refactor/`, `docs/`, `chore/`

## 주의사항

- 환경 변수는 `.env` 파일에 저장하고 `.gitignore`에 추가
- 백엔드 API URL은 환경 변수로 관리
- 민감한 정보(API 키, 토큰 등)는 절대 커밋하지 않음
- 빌드 전에 `npm run lint` 실행하여 코드 검사
- 큰 번들 크기 증가 주의 (필요한 라이브러리만 추가)