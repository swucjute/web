# CLAUDE.md

이 파일은 Claude Code가 프로젝트 컨텍스트를 이해하기 위한 가이드입니다.

## 프로젝트 개요

주뜨 청년부 앱 Spring Boot REST API 서버.

## 기술 스택

- Java 17, Spring Boot 3.4.x, Maven
- Spring Data JPA + QueryDSL, Spring Security + JWT
- MariaDB, Redis, MongoDB
- springdoc-openapi (Swagger)

## 패키지 구조

```
com.swucjute.api
├── domain/          <- 도메인별 패키지 (auth, member, board 등)
│   └── {도메인}/
│       ├── controller/
│       ├── service/
│       ├── repository/
│       ├── entity/
│       └── dto/
└── global/          <- 공통 모듈
    ├── common/      <- ApiResponse, BaseEntity
    ├── config/      <- Security, Swagger, Redis, JPA 설정
    ├── security/    <- JWT 관련
    └── exception/   <- 전역 예외 처리
```

## 빌드 및 실행

```bash
./mvnw clean package                    # 빌드
./mvnw spotless:check                   # 코드 포맷 체크
./mvnw spotless:apply                   # 코드 포맷 자동 적용
```

## 환경 프로필

- local: 개발자 PC. `.env` 파일에서 환경변수 로드.
- dev: dev 서버. Docker Compose 환경변수.
- prod: 프로덕션. Docker Compose 환경변수.

## 코딩 규칙

- Controller는 얇게, Service에서 비즈니스 로직 처리
- `System.out.println` 금지 -> `@Slf4j` 사용
- Entity에 `@Setter` 금지 -> 생성자 또는 빌더 패턴
- `@Transactional`은 Service에서만
- API 응답은 `ApiResponse<T>`로 통일
- API URL: `/api/v1/{리소스 복수형}`

## 커밋 컨벤션

- 한글로 작성
- Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:` 등
- 제목 50자 이내, 마침표 없음

## 브랜치 전략

- main: 프로덕션 (직접 push 금지)
- develop: 개발 통합 (PR만 허용)
- 작업 브랜치: `feat/`, `fix/`, `refactor/`, `docs/`, `chore/`

## 주의사항

- `.env` 파일은 절대 커밋하지 않는다.
- infra 레포는 private. 이 레포에서 infra 레포 URL을 노출하지 않는다.
- 코드 포맷은 Spotless (Google Java Format). PR 전에 `./mvnw spotless:apply` 실행.