# Swucjute Web

커뮤니티 관리 및 협업 플랫폼 웹 애플리케이션

## 주요 기능

- **대시보드**: 주요 정보 및 활동 현황 한눈에 보기
- **멤버 관리**: 커뮤니티 멤버 조회 및 프로필 관리
- **일정 관리**: 캘린더 기반의 이벤트 및 일정 관리
- **커뮤니티**: 커뮤니티 소식 및 공지사항
- **재정**: 재정 현황 및 통계
- **플랫폼**: 다양한 플랫폼 정보 및 제안
- **기도 요청**: 기도 요청 공유 및 관리
- **설문조사**: 설문 참여 및 결과 확인
- **예배**: 예배 정보 및 칭찬

## 기술 스택

### 핵심 기술
- **React 19 + TypeScript**: 타입 안정성이 있는 최신 React로 UI 구축
- **Vite**: 번개같이 빠른 개발 서버 및 빌드 도구

### UI & 스타일
- **Tailwind CSS 4**: Utility-first CSS로 빠르게 디자인 구현
- **shadcn/ui**: 복사-붙여넣기 방식의 고급 UI 컴포넌트 라이브러리
  - Radix UI 기반으로 접근성이 뛰어남
  - Button, Dialog, Select, Input 등 다양한 컴포넌트 제공

### 라우팅 및 상태 관리
- **React Router 7**: 페이지 간 이동 및 URL 관리
- **Zustand**: 가볍고 간단한 전역 상태 관리
- **TanStack React Query**: 서버 데이터 상태 관리 (캐싱, 자동 동기화 등)

### 폼 및 데이터
- **React Hook Form**: 폼 상태와 검증을 효율적으로 처리
- **date-fns**: 날짜 및 시간 조작

### 시각화
- **Recharts**: 통계 차트 및 그래프 렌더링 (Finance 페이지에서 사용)
- **Lucide React**: 일관성 있는 아이콘 세트

### 개발 도구
- **MSW (Mock Service Worker)**: 실제 API 없이도 요청을 모킹하여 개발 가능
- **ESLint**: 코드 품질 및 스타일 검사

### 기타
- **PWA (Progressive Web App)**: 설치 가능한 웹 앱으로 오프라인 지원

## 시작하기

### 사전 요구사항

Node.js 16.x 이상이 필요합니다. 설치 상태를 확인하세요:

```bash
node --version
npm --version
```

### 1단계: 의존성 설치

프로젝트에 필요한 패키지를 설치합니다.

```bash
npm install
```

### 2단계: 개발 서버 시작

개발 환경에서 애플리케이션을 실행합니다.

```bash
npm run dev
```

터미널에 출력된 주소(기본값: `http://localhost:5173`)를 브라우저에서 엽니다. 파일 저장 시 자동으로 브라우저가 새로고침됩니다 (Hot Module Replacement).

### 3단계: 프로덕션 빌드

배포를 위한 최적화된 빌드를 생성합니다.

```bash
npm run build
```

빌드 결과는 `dist/` 디렉토리에 생성되며, 이를 웹 서버에 배포합니다. 빌드 전에는 다음 명령어로 코드를 검사합니다:

```bash
npm run lint
```

### 4단계: 프로덕션 빌드 로컬 테스트

배포 환경을 로컬에서 검증합니다.

```bash
npm run build
npm run preview
```

`http://localhost:4173`에서 프로덕션 빌드를 테스트합니다.

### 스크립트 목록

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 시작 |
| `npm run build` | 프로덕션 빌드 생성 |
| `npm run lint` | 코드 검사 및 포맷 확인 |
| `npm run preview` | 빌드된 앱을 로컬에서 실행 |

## 프로젝트 구조

### 소스 코드 (`src/`)

```
src/
├── components/           # 재사용 가능한 공통 UI 컴포넌트
│                         # Layout, Input, Button 등
│
├── pages/                # 각 페이지 컴포넌트
│   ├── home/             # 대시보드
│   ├── members/          # 멤버 관리
│   ├── calendar/         # 일정 관리
│   ├── community/        # 커뮤니티
│   ├── finance/          # 재정
│   ├── platform/         # 플랫폼
│   ├── prayer/           # 기도 요청
│   ├── survey/           # 설문조사
│   └── worship/          # 예배
│
├── contexts/             # 전역 상태 (React Context)
│   ├── AuthContext.tsx   # 사용자 인증 정보
│   ├── DataContext.tsx   # 커뮤니티 데이터
│   └── PlatformContext.tsx
│
├── mocks/                # API 모킹 (MSW)
│   ├── browser.ts        # 브라우저 모킹 설정
│   ├── handlers.ts       # API 요청 핸들러
│   └── data.ts           # 목 데이터
│
├── utils/                # 유틸리티 함수
│   └── api.ts            # API 호출 함수
│
├── types/                # TypeScript 타입 정의
│   └── index.ts          # 모든 타입 모음
│
└── styles/               # 글로벌 스타일
    ├── index.css         # 전역 CSS
    └── theme.css         # 테마 설정
```

### 공개 파일 (`public/`)

```
public/
├── manifest.json         # PWA 매니페스트 (앱 이름, 아이콘, 테마 색상)
├── sw.js                 # Service Worker (오프라인 지원)
├── mockServiceWorker.js  # MSW 워커 (API 모킹)
├── icons/                # 앱 아이콘
└── favicon.svg           # 탭 아이콘
```

### 핵심 파일

| 파일 | 목적 |
|------|------|
| `src/App.tsx` | 애플리케이션 메인 컴포넌트 (라우팅 설정) |
| `src/main.tsx` | React 앱 진입점 |
| `vite.config.ts` | Vite 빌드 설정 |
| `tailwind.config.ts` | Tailwind CSS 커스터마이징 |
| `tsconfig.json` | TypeScript 설정 |

## 개발 환경 설정

### 시스템 요구사항

- **Node.js**: 16.x 이상 (20.x 권장)
- **npm**: 9.x 이상

### API 모킹 (MSW)

개발 중에는 실제 백엔드 API 없이 MSW(Mock Service Worker)를 통해 API를 모킹할 수 있습니다.

```bash
npm run dev
```

**모킹된 API 확인:**
- 브라우저 개발자도구(F12) → Network 탭에서 모킹된 요청 확인
- `src/mocks/handlers.ts`에서 API 응답 수정
- 실제 백엔드 준비 시 `src/utils/api.ts`의 API URL 변경

### PWA 설정

이 프로젝트는 PWA(Progressive Web App)를 지원하며 설치 가능한 웹 애플리케이션으로 작동합니다.

**개발 환경에서 PWA 기능 확인:**

```bash
npm run dev
```

localhost에서는 Service Worker가 작동합니다. 개발자도구에서 다음을 확인할 수 있습니다:

- 개발자도구(F12) → Application 탭 → Manifest에서 PWA 설정 확인
- Service Workers 섹션에서 워커 등록 상태 확인

**프로덕션 배포:**

PWA는 HTTPS 환경에서만 설치 가능합니다. 개발 환경에서 프로덕션 빌드를 테스트하려면:

```bash
npm run build
npm run preview
```

`http://localhost:4173`에서 테스트할 수 있습니다.

**주의:** 실제 배포 시에는 반드시 HTTPS 서버를 사용해야 하며, HTTP 환경에서는 PWA 설치가 불가능합니다. 설정 파일은 `public/manifest.json`과 `public/sw.js`를 참고합니다.

## 기여 가이드

프로젝트 기여를 위한 커밋 컨벤션, 브랜치 전략, PR 규칙, 코딩 규칙은 **[CONTRIBUTING.md](docs/CONTRIBUTING.md)** 를 참고하세요.

### 기본 절차

1. **Issue 등록**: GitHub Issue에서 작업 내용을 등록합니다.
2. **브랜치 생성**: 이슈에 맞는 브랜치를 생성합니다.
   - 기능: `feat/기능명`
   - 버그 수정: `fix/버그명`
3. **코드 작성**: 로컬에서 코드를 작성합니다.
4. **코드 검사**: 커밋 전에 린트를 실행합니다.
   ```bash
   npm run lint
   ```
5. **커밋**: Conventional Commits 형식을 따릅니다.
   ```bash
   git commit -m "feat: 기능에 대한 설명"
   git commit -m "fix: 버그 수정에 대한 설명"
   ```
6. **Push & PR**: `develop` 브랜치로 Pull Request를 생성합니다.
7. **리뷰 및 승인**: 팀원의 리뷰를 받고 승인 후 머지합니다.

### 주의사항

- main 브랜치에 직접 push하면 안 됩니다.
- 항상 개별 브랜치에서 작업하고 PR을 통해 merge합니다.
- PR 전에 `npm run lint`로 코드를 검사합니다.
- 커밋 메시지에 이슈 번호를 포함합니다 (`closes #123`).
- PR 설명을 상세하게 작성합니다.