// Mock API - MSW (Mock Service Worker)로 구현
// 나중에 Spring Boot 백엔드로 교체 예정
// API 호출은 fetch를 사용하고, MSW가 HTTP 요청을 인터셉트합니다.

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
