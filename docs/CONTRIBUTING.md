# 기여 가이드

## 1. 작업 흐름

```
GitHub Issue 등록 (할 일)
  -> 브랜치 생성 (feat/xxx, fix/xxx)
  -> 작업 + 커밋
  -> develop 브랜치로 PR
  -> 리더 리뷰 + 승인
  -> develop 머지 (dev 서버 자동 배포)
  -> 추후 main 머지 (프로덕션 배포)
```

- main 브랜치에 직접 push 금지
- 모든 작업은 Issue 등록 후 브랜치를 따서 진행

---

## 2. 브랜치 전략

```
main ────────────────────── 프로덕션 (직접 push 금지)
  │
  └── develop ───────────── 개발 통합 (PR만 허용, dev 서버 자동 배포)
        │
        ├── feat/게시판-CRUD
        ├── feat/로그인-카카오
        ├── fix/주보-업로드-오류
        └── hotfix/로그인-500에러
```

### 브랜치 네이밍

| 접두사 | 용도 | 예시 |
|--------|------|------|
| `feat/` | 새 기능 | `feat/게시판-CRUD` |
| `fix/` | 버그 수정 | `fix/로그인-토큰-만료` |
| `refactor/` | 리팩토링 | `refactor/회원-서비스-분리` |
| `docs/` | 문서 작업 | `docs/API-명세-업데이트` |
| `chore/` | 빌드, 설정 변경 | `chore/Redis-설정-추가` |
| `hotfix/` | 긴급 수정 | `hotfix/로그인-500에러` |

---

## 3. 커밋 컨벤션

Conventional Commits 방식을 사용한다.

### 형식

```
<type>: <subject>

[body (선택)]
```

### 타입

| 타입 | 설명 | 예시 |
|------|------|------|
| `feat` | 새로운 기능 | feat: 게시판 글 작성 API 추가 |
| `fix` | 버그 수정 | fix: 로그인 시 토큰 만료 체크 누락 수정 |
| `docs` | 문서 변경 | docs: API 명세서 업데이트 |
| `style` | 코드 포맷팅 (기능 변경 없음) | style: 들여쓰기 수정 |
| `refactor` | 리팩토링 (기능 변경 없음) | refactor: MemberService 메서드 분리 |
| `test` | 테스트 추가/수정 | test: 게시판 CRUD 단위 테스트 추가 |
| `chore` | 빌드, 설정 변경 | chore: Redis 설정 추가 |

### 규칙

- 한글로 작성
- 제목 50자 이내
- 제목 끝에 마침표 없음
- 본문은 "왜" 변경했는지 위주로 작성

---

## 4. PR 규칙

1. develop 브랜치로만 PR 생성 (main은 리더만)
2. PR 제목은 커밋 컨벤션과 동일한 형식
3. 리더 승인 필수 (최소 1명)
4. CI 통과 필수
5. 셀프 머지 금지 (리뷰 후 리더가 머지)
6. PR 단위는 작게 유지 (변경 파일 10개 이내 권장)
7. PR 올리기 전에 로컬에서 빌드/테스트 통과 확인

### PR 템플릿

`.github/PULL_REQUEST_TEMPLATE.md`에 배치되어 있다. PR 생성 시 자동으로 적용된다.

---

## 5. Issue 관리

- 기능 개발, 버그 수정 등 모든 작업은 GitHub Issue로 등록
- Issue 템플릿: `.github/ISSUE_TEMPLATE/` 참고
- PR에서 Issue 연결: `closes #이슈번호`

---

## 6. 코딩 규칙

### 코드 포맷

Spotless (Google Java Format)를 사용한다. PR 전에 반드시 포맷을 적용한다.

```bash
# 포맷 체크
./mvnw spotless:check

# 자동 포맷 적용
./mvnw spotless:apply
```

### 코딩 컨벤션

- Controller는 얇게, Service에서 비즈니스 로직 처리
- 하드코딩 금지 -> `application.yml`로 관리
- `System.out.println` 금지 -> SLF4J 로거(`@Slf4j`) 사용
- `@Transactional`은 Service 레이어에서만 사용
- Entity에 `@Setter` 사용 금지 -> 생성자 또는 빌더 패턴 사용
- `Optional` 반환은 Repository에서만, Service에서는 예외 처리

### 네이밍 규칙

| 대상 | 규칙 | 예시 |
|------|------|------|
| 클래스 | PascalCase | `MemberService` |
| 메서드/변수 | camelCase | `findMemberById` |
| 상수 | UPPER_SNAKE_CASE | `MAX_PAGE_SIZE` |
| DTO | ~Request, ~Response | `BoardRequest`, `BoardResponse` |
| Entity | 테이블명과 일치 | `Member`, `Board` |
| Controller | ~Controller | `BoardController` |
| Service | ~Service | `BoardService` |
| Repository | ~Repository | `BoardRepository` |