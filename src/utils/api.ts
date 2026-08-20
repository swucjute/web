// Mock API - MSW (Mock Service Worker)로 구현
// 나중에 Spring Boot 백엔드로 교체 예정
// API 호출은 fetch를 사용하고, MSW가 HTTP 요청을 인터셉트합니다.
// (platformsApi만 예외 — 실제 백엔드로 교체 완료, 파일 하단 참고)

import { apiRequest } from './authClient'
import type { Platform, PlatformSaveRequest, PageResponse } from '../types'

// Members API
export const membersApi = {
  getAll: async () => {
    const res = await fetch('/api/members')
    return res.json()
  },
  getList: async () => {
    const res = await fetch('/api/members')
    return res.json()
  },
  getById: async (id: string) => {
    const res = await fetch(`/api/members/${id}`)
    if (res.status === 404) return null
    return res.json()
  },
  add: async (data: unknown) => {
    const res = await fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return res.json()
  },
  create: async (data: unknown) => {
    const res = await fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return res.json()
  },
  update: async (id: string, data: unknown) => {
    const res = await fetch(`/api/members/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return res.json()
  },
  remove: async (id: string) => {
    await fetch(`/api/members/${id}`, { method: 'DELETE' })
    return null
  },
  delete: async (id: string) => {
    await fetch(`/api/members/${id}`, { method: 'DELETE' })
    return null
  },
}

// Events API
export const eventsApi = {
  getAll: async () => {
    const res = await fetch('/api/events')
    return res.json()
  },
  getList: async () => {
    const res = await fetch('/api/events')
    return res.json()
  },
  getById: async (id: string) => {
    const res = await fetch(`/api/events/${id}`)
    if (res.status === 404) return null
    return res.json()
  },
  add: async (data: unknown) => {
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return res.json()
  },
  create: async (data: unknown) => {
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return res.json()
  },
  update: async (id: string, data: unknown) => {
    const res = await fetch(`/api/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return res.json()
  },
  remove: async (id: string) => {
    await fetch(`/api/events/${id}`, { method: 'DELETE' })
    return null
  },
  delete: async (id: string) => {
    await fetch(`/api/events/${id}`, { method: 'DELETE' })
    return null
  },
}

// Platforms API — 실제 Spring Boot 백엔드(/api/v1/platforms)와 통신한다.
// (다른 Api들과 달리 이제 MSW 목업을 거치지 않는다: 절대경로 + 다른 오리진이라 MSW가 가로채지 않음)
interface PlatformListParams {
  approvalStatus?: string
  operatingStatus?: string
  keyword?: string
}

export const platformsApi = {
  getAll: (params: PlatformListParams = {}) => {
    const qs = new URLSearchParams({ page: '0', size: '100' })
    if (params.approvalStatus) qs.set('approvalStatus', params.approvalStatus)
    if (params.operatingStatus) qs.set('operatingStatus', params.operatingStatus)
    if (params.keyword) qs.set('keyword', params.keyword)
    return apiRequest<PageResponse<Platform>>(`/api/v1/platforms?${qs.toString()}`)
  },
  getById: (id: string) => apiRequest<Platform>(`/api/v1/platforms/${id}`),
  add: (data: PlatformSaveRequest) =>
    apiRequest<Platform>('/api/v1/platforms', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: PlatformSaveRequest) =>
    apiRequest<Platform>(`/api/v1/platforms/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: string) => apiRequest<null>(`/api/v1/platforms/${id}`, { method: 'DELETE' }),
  changeApprovalStatus: (id: string, approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED') =>
    apiRequest<Platform>(`/api/v1/platforms/${id}/approval-status`, {
      method: 'PATCH',
      body: JSON.stringify({ approvalStatus }),
    }),
}

// Worships API
export const worshipsApi = {
  getAll: async () => {
    const res = await fetch('/api/worships')
    return res.json()
  },
  getById: async (id: string) => {
    const res = await fetch(`/api/worships/${id}`)
    if (res.status === 404) return null
    return res.json()
  },
  add: async (data: unknown) => {
    const res = await fetch('/api/worships', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return res.json()
  },
  update: async (id: string, data: unknown) => {
    const res = await fetch(`/api/worships/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return res.json()
  },
  remove: async (id: string) => {
    await fetch(`/api/worships/${id}`, { method: 'DELETE' })
    return null
  },
}

// Praises API
export const praisesApi = {
  getAll: async () => {
    const res = await fetch('/api/praises')
    return res.json()
  },
  getById: async (id: string) => {
    const res = await fetch(`/api/praises/${id}`)
    if (res.status === 404) return null
    return res.json()
  },
  add: async (data: unknown) => {
    const res = await fetch('/api/praises', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return res.json()
  },
  update: async (id: string, data: unknown) => {
    const res = await fetch(`/api/praises/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return res.json()
  },
  remove: async (id: string) => {
    await fetch(`/api/praises/${id}`, { method: 'DELETE' })
    return null
  },
}

// Surveys API
export const surveysApi = {
  getAll: async () => {
    const res = await fetch('/api/surveys')
    return res.json()
  },
  getList: async () => {
    const res = await fetch('/api/surveys')
    return res.json()
  },
  getById: async (id: string) => {
    const res = await fetch(`/api/surveys/${id}`)
    if (res.status === 404) return null
    return res.json()
  },
  add: async (data: unknown) => {
    const res = await fetch('/api/surveys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return res.json()
  },
  create: async (data: unknown) => {
    const res = await fetch('/api/surveys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return res.json()
  },
  update: async (id: string, data: unknown) => {
    const res = await fetch(`/api/surveys/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return res.json()
  },
  remove: async (id: string) => {
    await fetch(`/api/surveys/${id}`, { method: 'DELETE' })
    return null
  },
  delete: async (id: string) => {
    await fetch(`/api/surveys/${id}`, { method: 'DELETE' })
    return null
  },
  respond: async (id: string, response: unknown) => {
    const res = await fetch(`/api/surveys/${id}/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(response),
    })
    return res.json()
  },
}
