// Mock API - 나중에 Spring Boot 백엔드로 교체 예정
import type { User, Event, Platform, Survey, Praise } from '../types'

// Mock 데이터
const mockUsers: User[] = [
  {
    id: '1',
    name: '관리자',
    email: 'admin@church.com',
    password: 'admin123',
    role: 'admin',
    phone: '010-1234-5678',
    birthDate: '1990-01-01',
    joinDate: '2020-01-01',
    department: '청년부',
    position: '부장',
    isActive: true,
  },
  {
    id: '2',
    name: '리더',
    email: 'leader@church.com',
    password: 'leader123',
    role: 'leader',
    phone: '010-2345-6789',
    birthDate: '1995-05-20',
    joinDate: '2021-06-15',
    department: '청년부',
    isActive: true,
  },
  {
    id: '3',
    name: '회원',
    email: 'member@church.com',
    password: 'member123',
    role: 'member',
    phone: '010-3456-7890',
    birthDate: '2000-01-01',
    joinDate: '2022-01-01',
    department: '청년부',
    isActive: true,
  },
]

const mockEvents: Event[] = [
  {
    id: '1',
    title: '주일 예배',
    description: '주일 오전 예배',
    date: '2024-04-14',
    time: '10:00',
    location: '교회',
    type: 'worship',
    createdBy: '1',
  },
]

const mockPlatforms: Platform[] = [
  {
    id: '1',
    title: '청년 수련회',
    scheduledDate: '2024-05-15',
    content: '여름 청년 수련회',
    purpose: '영적 성장',
    other: '없음',
    status: 'recruiting',
    proposedBy: '1',
    proposedByName: '김준호',
    participants: ['1', '2'],
    createdAt: '2024-04-01',
  },
]

const mockSurveys: Survey[] = [
  {
    id: '1',
    title: '청년부 만족도 조사',
    description: '청년부 프로그램에 대한 만족도',
    questions: [
      {
        id: 'q1',
        question: '주일 예배가 은혜로웠나요?',
        type: 'choice',
        options: ['매우 만족', '만족', '보통', '불만족'],
      },
    ],
    createdBy: '1',
    createdAt: '2024-04-01',
    deadline: '2024-04-30',
    isActive: true,
    responses: [],
  },
]

// Members API
export const membersApi = {
  getAll: async () => mockUsers,
  getList: async () => mockUsers,
  getById: async (id: string) => mockUsers.find((u) => u.id === id) || null,
  add: async (data: any) => ({
    ...data,
    id: String(mockUsers.length + 1),
    joinDate: new Date().toISOString().split('T')[0],
  }),
  create: async (data: any) => ({
    ...data,
    id: String(mockUsers.length + 1),
  }),
  update: async (_id: string, data: any) => data,
  remove: async (_id: string) => null,
  delete: async (_id: string) => null,
}

// Events API
export const eventsApi = {
  getAll: async () => mockEvents,
  getList: async () => mockEvents,
  getById: async (id: string) => mockEvents.find((e) => e.id === id) || null,
  add: async (data: any) => ({
    ...data,
    id: String(mockEvents.length + 1),
  }),
  create: async (data: any) => ({
    ...data,
    id: String(mockEvents.length + 1),
  }),
  update: async (_id: string, data: any) => data,
  remove: async (_id: string) => null,
  delete: async (_id: string) => null,
}

// Platforms API
export const platformsApi = {
  getAll: async () => mockPlatforms,
  getList: async () => mockPlatforms,
  getById: async (id: string) => mockPlatforms.find((p) => p.id === id) || null,
  add: async (data: any) => ({
    ...data,
    id: String(mockPlatforms.length + 1),
    createdAt: new Date().toISOString(),
  }),
  create: async (data: any) => ({
    ...data,
    id: String(mockPlatforms.length + 1),
  }),
  update: async (_id: string, data: any) => data,
  remove: async (_id: string) => null,
  delete: async (_id: string) => null,
}

// Surveys API
export const surveysApi = {
  getAll: async () => mockSurveys,
  getList: async () => mockSurveys,
  getById: async (id: string) => mockSurveys.find((s) => s.id === id) || null,
  add: async (data: any) => ({
    ...data,
    id: String(mockSurveys.length + 1),
    createdAt: new Date().toISOString(),
  }),
  create: async (data: any) => ({
    ...data,
    id: String(mockSurveys.length + 1),
  }),
  update: async (_id: string, data: any) => data,
  remove: async (_id: string) => null,
  delete: async (_id: string) => null,
  respond: async (_id: string, _response: any) => null,
}
