/* eslint-disable @typescript-eslint/no-explicit-any */
import { http, HttpResponse } from 'msw'
import { mockUsers, mockEvents, mockPlatforms, mockSurveys, mockWorships, mockPraises } from './data'
import type { User, Event, Platform, Survey, Worship, Praise } from '../types'

// 메모리에 데이터 유지 (메모리에만 저장되고 새로고침하면 초기화)
const users: User[] = [...mockUsers]
const events: Event[] = [...mockEvents]
const platforms: Platform[] = [...mockPlatforms]
const surveys: Survey[] = [...mockSurveys]
const worships: Worship[] = [...mockWorships]
const praises: Praise[] = [...mockPraises]

export const handlers = [
  // ============ Members API ============
  http.get('/api/members', () => {
    return HttpResponse.json(users)
  }),

  http.get('/api/members/:id', ({ params }) => {
    const user = users.find((u) => u.id === params.id)
    return user ? HttpResponse.json(user) : HttpResponse.json(null, { status: 404 })
  }),

  http.post('/api/members', async ({ request }) => {
    const body = (await request.json()) as any
    const newUser: User = {
      ...body,
      id: String(users.length + 1),
      joinDate: new Date().toISOString().split('T')[0],
    }
    users.push(newUser)
    return HttpResponse.json(newUser, { status: 201 })
  }),

  http.put('/api/members/:id', async ({ params, request }) => {
    const body = (await request.json()) as any
    const index = users.findIndex((u) => u.id === params.id)
    if (index === -1) {
      return HttpResponse.json(null, { status: 404 })
    }
    users[index] = { ...users[index], ...body }
    return HttpResponse.json(users[index])
  }),

  http.delete('/api/members/:id', ({ params }) => {
    const index = users.findIndex((u) => u.id === params.id)
    if (index === -1) {
      return HttpResponse.json(null, { status: 404 })
    }
    users.splice(index, 1)
    return HttpResponse.json(null, { status: 204 })
  }),

  // ============ Events API ============
  http.get('/api/events', () => {
    return HttpResponse.json(events)
  }),

  http.get('/api/events/:id', ({ params }) => {
    const event = events.find((e) => e.id === params.id)
    return event ? HttpResponse.json(event) : HttpResponse.json(null, { status: 404 })
  }),

  http.post('/api/events', async ({ request }) => {
    const body = (await request.json()) as any
    const newEvent: Event = {
      ...body,
      id: String(events.length + 1),
    }
    events.push(newEvent)
    return HttpResponse.json(newEvent, { status: 201 })
  }),

  http.put('/api/events/:id', async ({ params, request }) => {
    const body = (await request.json()) as any
    const index = events.findIndex((e) => e.id === params.id)
    if (index === -1) {
      return HttpResponse.json(null, { status: 404 })
    }
    events[index] = { ...events[index], ...body }
    return HttpResponse.json(events[index])
  }),

  http.delete('/api/events/:id', ({ params }) => {
    const index = events.findIndex((e) => e.id === params.id)
    if (index === -1) {
      return HttpResponse.json(null, { status: 404 })
    }
    events.splice(index, 1)
    return HttpResponse.json(null, { status: 204 })
  }),

  // ============ Platforms API ============
  http.get('/api/platforms', () => {
    return HttpResponse.json(platforms)
  }),

  http.get('/api/platforms/:id', ({ params }) => {
    const platform = platforms.find((p) => p.id === params.id)
    return platform ? HttpResponse.json(platform) : HttpResponse.json(null, { status: 404 })
  }),

  http.post('/api/platforms', async ({ request }) => {
    const body = (await request.json()) as any
    const newPlatform: Platform = {
      ...body,
      id: String(platforms.length + 1),
      createdAt: new Date().toISOString(),
    }
    platforms.push(newPlatform)
    return HttpResponse.json(newPlatform, { status: 201 })
  }),

  http.put('/api/platforms/:id', async ({ params, request }) => {
    const body = (await request.json()) as any
    const index = platforms.findIndex((p) => p.id === params.id)
    if (index === -1) {
      return HttpResponse.json(null, { status: 404 })
    }
    platforms[index] = { ...platforms[index], ...body }
    return HttpResponse.json(platforms[index])
  }),

  http.delete('/api/platforms/:id', ({ params }) => {
    const index = platforms.findIndex((p) => p.id === params.id)
    if (index === -1) {
      return HttpResponse.json(null, { status: 404 })
    }
    platforms.splice(index, 1)
    return HttpResponse.json(null, { status: 204 })
  }),

  // ============ Worships API ============
  http.get('/api/worships', () => {
    return HttpResponse.json(worships)
  }),

  http.get('/api/worships/:id', ({ params }) => {
    const worship = worships.find((w) => w.id === params.id)
    return worship ? HttpResponse.json(worship) : HttpResponse.json(null, { status: 404 })
  }),

  http.post('/api/worships', async ({ request }) => {
    const body = (await request.json()) as any
    const newWorship: Worship = {
      ...body,
      id: String(worships.length + 1),
    }
    worships.push(newWorship)
    return HttpResponse.json(newWorship, { status: 201 })
  }),

  http.put('/api/worships/:id', async ({ params, request }) => {
    const body = (await request.json()) as any
    const index = worships.findIndex((w) => w.id === params.id)
    if (index === -1) {
      return HttpResponse.json(null, { status: 404 })
    }
    worships[index] = { ...worships[index], ...body }
    return HttpResponse.json(worships[index])
  }),

  http.delete('/api/worships/:id', ({ params }) => {
    const index = worships.findIndex((w) => w.id === params.id)
    if (index === -1) {
      return HttpResponse.json(null, { status: 404 })
    }
    worships.splice(index, 1)
    return HttpResponse.json(null, { status: 204 })
  }),

  // ============ Praises API ============
  http.get('/api/praises', () => {
    return HttpResponse.json(praises)
  }),

  http.get('/api/praises/:id', ({ params }) => {
    const praise = praises.find((p) => p.id === params.id)
    return praise ? HttpResponse.json(praise) : HttpResponse.json(null, { status: 404 })
  }),

  http.post('/api/praises', async ({ request }) => {
    const body = (await request.json()) as any
    const newPraise: Praise = {
      ...body,
      id: String(praises.length + 1),
    }
    praises.push(newPraise)
    return HttpResponse.json(newPraise, { status: 201 })
  }),

  http.put('/api/praises/:id', async ({ params, request }) => {
    const body = (await request.json()) as any
    const index = praises.findIndex((p) => p.id === params.id)
    if (index === -1) {
      return HttpResponse.json(null, { status: 404 })
    }
    praises[index] = { ...praises[index], ...body }
    return HttpResponse.json(praises[index])
  }),

  http.delete('/api/praises/:id', ({ params }) => {
    const index = praises.findIndex((p) => p.id === params.id)
    if (index === -1) {
      return HttpResponse.json(null, { status: 404 })
    }
    praises.splice(index, 1)
    return HttpResponse.json(null, { status: 204 })
  }),

  // ============ Surveys API ============
  http.get('/api/surveys', () => {
    return HttpResponse.json(surveys)
  }),

  http.get('/api/surveys/:id', ({ params }) => {
    const survey = surveys.find((s) => s.id === params.id)
    return survey ? HttpResponse.json(survey) : HttpResponse.json(null, { status: 404 })
  }),

  http.post('/api/surveys', async ({ request }) => {
    const body = (await request.json()) as any
    const newSurvey: Survey = {
      ...body,
      id: String(surveys.length + 1),
      createdAt: new Date().toISOString(),
    }
    surveys.push(newSurvey)
    return HttpResponse.json(newSurvey, { status: 201 })
  }),

  http.put('/api/surveys/:id', async ({ params, request }) => {
    const body = (await request.json()) as any
    const index = surveys.findIndex((s) => s.id === params.id)
    if (index === -1) {
      return HttpResponse.json(null, { status: 404 })
    }
    surveys[index] = { ...surveys[index], ...body }
    return HttpResponse.json(surveys[index])
  }),

  http.delete('/api/surveys/:id', ({ params }) => {
    const index = surveys.findIndex((s) => s.id === params.id)
    if (index === -1) {
      return HttpResponse.json(null, { status: 404 })
    }
    surveys.splice(index, 1)
    return HttpResponse.json(null, { status: 204 })
  }),

  http.post('/api/surveys/:id/respond', async ({ params, request }) => {
    const body = (await request.json()) as any
    const surveyIndex = surveys.findIndex((s) => s.id === params.id)
    if (surveyIndex === -1) {
      return HttpResponse.json(null, { status: 404 })
    }
    surveys[surveyIndex].responses = [...(surveys[surveyIndex].responses || []), body]
    return HttpResponse.json(surveys[surveyIndex])
  }),
]
