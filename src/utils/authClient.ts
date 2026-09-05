// 실제 Spring Boot 백엔드 인증 API 클라이언트 (카카오 로그인 / JWT)

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'

interface ApiEnvelope<T> {
  status: number
  message: string
  data: T
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
}

export type MemberRole = 'USER' | 'LEADER' | 'MANAGER' | 'ADMIN'
export type MemberStatus = 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'WITHDRAWN' | 'BLOCKED'

export interface MemberProfileInfo {
  name: string
  gender: 'MALE' | 'FEMALE'
  birthDate: string
  phoneNumber: string
  profileImageUrl?: string | null
  department?: string | null
  position?: string | null
  bankName?: string | null
  accountNumber?: string | null
}

export interface MemberMeResponse {
  memberId: number
  email: string | null
  role: MemberRole
  status: MemberStatus
  lastLoginAt: string | null
  profileCompleted: boolean
  profile: MemberProfileInfo | null
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setTokens(tokens: Pick<AuthTokens, 'accessToken' | 'refreshToken'>): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export function startKakaoLogin(): void {
  window.location.href = `${API_BASE_URL}/oauth2/authorization/kakao`
}

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return false

  const res = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  })
  if (!res.ok) return false

  const body = (await res.json()) as ApiEnvelope<AuthTokens>
  setTokens(body.data)
  return true
}

// 401 응답 시 리프레시 토큰으로 1회 재시도하는 fetch 래퍼
export async function fetchWithAuth(path: string, options: RequestInit = {}): Promise<Response> {
  const headers = new Headers(options.headers)
  const accessToken = getAccessToken()
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`)

  let res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers })

  if (res.status === 401 && getRefreshToken()) {
    const refreshed = await refreshAccessToken()
    if (refreshed) {
      headers.set('Authorization', `Bearer ${getAccessToken()}`)
      res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers })
    }
  }

  return res
}

export async function getMyProfile(): Promise<MemberMeResponse> {
  const res = await fetchWithAuth('/api/v1/members/me')
  if (!res.ok) throw new Error('내 정보를 불러오지 못했습니다.')
  const body = (await res.json()) as ApiEnvelope<MemberMeResponse>
  return body.data
}

// 인증 헤더 자동 첨부 + 401 시 토큰 재발급까지 처리하는 fetchWithAuth 위에서,
// {status,message,data} 응답 껍데기를 벗겨서 data만 돌려주는 공용 헬퍼.
export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  const res = await fetchWithAuth(path, { ...options, headers })

  let body: ApiEnvelope<T> | null = null
  try {
    body = await res.json()
  } catch {
    // 본문 없는 응답 (204 등)
  }
  if (!res.ok) {
    throw new Error(body?.message ?? `요청 실패 (${res.status})`)
  }
  return (body as ApiEnvelope<T>).data
}

export async function logoutRequest(): Promise<void> {
  const refreshToken = getRefreshToken()
  try {
    await fetchWithAuth('/api/v1/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(refreshToken ? { refreshToken } : {}),
    })
  } finally {
    clearTokens()
  }
}
