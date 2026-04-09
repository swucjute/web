import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

app.use('*', logger(console.log));
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// ─────────────────────────────────────────────
// Seed data
// ─────────────────────────────────────────────

const defaultMembers = [
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
    position: '총무',
    isActive: true,
  },
  {
    id: '2',
    name: '김리더',
    email: 'leader@church.com',
    password: 'leader123',
    role: 'leader',
    phone: '010-2345-6789',
    birthDate: '1992-05-15',
    joinDate: '2021-03-10',
    department: '청년부',
    position: '소그룹 리더',
    isActive: true,
  },
  {
    id: '3',
    name: '이회원',
    email: 'member@church.com',
    password: 'member123',
    role: 'member',
    phone: '010-3456-7890',
    birthDate: '1995-08-20',
    joinDate: '2022-06-15',
    department: '청년부',
    isActive: true,
  },
];

const defaultPlatforms = [
  {
    id: 'p1',
    title: '독서 클럽',
    scheduledDate: '매주 토요일 오전 10:00',
    content: '매주 선정된 책을 함께 읽고 나누는 독서 모임입니다. 신앙과 삶을 깊이 있게 탐구합니다.',
    purpose: '신앙적 깊이와 지식의 성장을 도모하고 함께 성장하는 공동체를 만들기 위함입니다.',
    other: '첫 모임은 무료로 참여 가능합니다. 이후 책 구매비 실비 지원.',
    posterUrl: '',
    status: 'recruiting',
    proposedBy: '2',
    proposedByName: '김리더',
    participants: ['2'],
    createdAt: '2026-03-01T09:00:00.000Z',
    approvedAt: '2026-03-03T10:00:00.000Z',
  },
  {
    id: 'p2',
    title: '새벽기도 챌린지',
    scheduledDate: '매주 월~금 오전 5:30',
    content: '한 달간 함께 새벽기도를 드리며 영적 성장을 도모합니다. 온/오프라인 동시 진행.',
    purpose: '규칙적인 기도 습관 형성과 영적 각성을 위함입니다.',
    other: '4주 완주 시 기념 굿즈 증정 이벤트 있습니다.',
    posterUrl: '',
    status: 'recruiting',
    proposedBy: '3',
    proposedByName: '이회원',
    participants: ['3', '2'],
    createdAt: '2026-03-10T08:00:00.000Z',
    approvedAt: '2026-03-12T09:00:00.000Z',
  },
  {
    id: 'p3',
    title: '찬양팀 워십밴드',
    scheduledDate: '매주 금요일 오후 7:00',
    content: '악기 연주자와 싱어들이 모여 예배 찬양을 준비하는 팀입니다.',
    purpose: '예배의 질을 높이고 은사를 사용하여 하나님을 영화롭게 하기 위함입니다.',
    other: '악기 기초 레슨도 함께 진행됩니다. 악기 불문 지원 가능.',
    posterUrl: '',
    status: 'operating',
    proposedBy: '2',
    proposedByName: '김리더',
    participants: ['2', '3', '1'],
    createdAt: '2026-01-15T10:00:00.000Z',
    approvedAt: '2026-01-17T10:00:00.000Z',
  },
  {
    id: 'p4',
    title: '봉사 플랫폼 — 지역사회 섬김',
    scheduledDate: '격주 일요일 오후 2:00',
    content: '지역 어르신과 소외된 이웃을 위한 봉사 활동입니다. 식사 제공, 말벗, 청소 등.',
    purpose: '그리스도의 사랑을 지역사회에 전하고 청년들의 섬기는 삶을 훈련하기 위함입니다.',
    other: '봉사 시간 인증서 발급 가능.',
    posterUrl: '',
    status: 'ended',
    proposedBy: '1',
    proposedByName: '관리자',
    participants: ['1', '2', '3'],
    createdAt: '2025-09-01T10:00:00.000Z',
    approvedAt: '2025-09-02T10:00:00.000Z',
  },
  {
    id: 'p5',
    title: '영화 & 토론 클럽',
    scheduledDate: '매월 첫째 주 토요일 오후 3:00',
    content: '신앙적 주제를 담은 영화를 함께 보고 의미를 나누는 모임입니다.',
    purpose: '미디어를 통한 신앙 성찰과 청년들 간의 친밀감 형성.',
    other: '간식 제공. 상영 영화는 사전 투표로 선정됩니다.',
    posterUrl: '',
    status: 'pending',
    proposedBy: '3',
    proposedByName: '이회원',
    participants: [],
    createdAt: '2026-03-28T11:00:00.000Z',
  },
];

const defaultEvents = [
  {
    id: 'e1',
    title: '4월 정기 예배',
    description: '4월 정기 주일 예배입니다. 모든 청년부 회원이 함께합니다.',
    date: '2026-04-05',
    time: '11:00',
    location: '본당 2층',
    type: 'worship',
    createdBy: '1',
  },
  {
    id: 'e2',
    title: '청년부 리더 모임',
    description: '월간 리더 모임 및 사역 점검',
    date: '2026-04-08',
    time: '19:00',
    location: '소그룹실 A',
    type: 'meeting',
    createdBy: '1',
  },
  {
    id: 'e3',
    title: '봄 수련회',
    description: '2박 3일 청년부 봄 수련회. 참가 신청 마감 전 등록하세요.',
    date: '2026-04-18',
    time: '08:00',
    location: '강원도 양양 수련원',
    type: 'event',
    createdBy: '2',
  },
  {
    id: 'e4',
    title: '새벽기도 챌린지 킥오프',
    description: '새벽기도 챌린지 시작 모임. 참여자 전원 필참.',
    date: '2026-04-14',
    time: '05:30',
    location: '기도실',
    type: 'other',
    createdBy: '2',
  },
  {
    id: 'e5',
    title: '5월 정기 예배',
    description: '5월 정기 주일 예배',
    date: '2026-05-03',
    time: '11:00',
    location: '본당 2층',
    type: 'worship',
    createdBy: '1',
  },
];

// Initialize KV with seed data if empty
async function initSeedData() {
  try {
    const members = await kv.get('church:members');
    if (!members) {
      await kv.set('church:members', defaultMembers);
      console.log('[seed] church:members initialized');
    }

    const platforms = await kv.get('church:platforms');
    if (!platforms) {
      await kv.set('church:platforms', defaultPlatforms);
      console.log('[seed] church:platforms initialized');
    }

    const events = await kv.get('church:events');
    if (!events) {
      await kv.set('church:events', defaultEvents);
      console.log('[seed] church:events initialized');
    }
  } catch (err) {
    console.log('[seed] Error during seed initialization:', err);
  }
}

initSeedData();

// ─────────────────────────────────────────────
// Health check
// ─────────────────────────────────────────────
app.get("/make-server-61a58ed0/health", (c) => {
  return c.json({ status: "ok" });
});

// ─────────────────────────────────────────────
// MEMBERS
// ─────────────────────────────────────────────
app.get("/make-server-61a58ed0/members", async (c) => {
  try {
    const data = await kv.get('church:members');
    return c.json(data ?? []);
  } catch (err) {
    console.log('[members GET] error:', err);
    return c.json({ error: `Failed to fetch members: ${err}` }, 500);
  }
});

app.post("/make-server-61a58ed0/members", async (c) => {
  try {
    const newMember = await c.req.json();
    const data: any[] = (await kv.get('church:members') as any) ?? [];
    data.push(newMember);
    await kv.set('church:members', data);
    return c.json(newMember, 201);
  } catch (err) {
    console.log('[members POST] error:', err);
    return c.json({ error: `Failed to add member: ${err}` }, 500);
  }
});

app.put("/make-server-61a58ed0/members/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    const data: any[] = (await kv.get('church:members') as any) ?? [];
    const idx = data.findIndex((m: any) => m.id === id);
    if (idx === -1) return c.json({ error: 'Member not found' }, 404);
    data[idx] = { ...data[idx], ...updates };
    await kv.set('church:members', data);
    return c.json(data[idx]);
  } catch (err) {
    console.log('[members PUT] error:', err);
    return c.json({ error: `Failed to update member: ${err}` }, 500);
  }
});

app.delete("/make-server-61a58ed0/members/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const data: any[] = (await kv.get('church:members') as any) ?? [];
    const idx = data.findIndex((m: any) => m.id === id);
    if (idx === -1) return c.json({ error: 'Member not found' }, 404);
    data[idx] = { ...data[idx], isActive: false };
    await kv.set('church:members', data);
    return c.json({ ok: true });
  } catch (err) {
    console.log('[members DELETE] error:', err);
    return c.json({ error: `Failed to delete member: ${err}` }, 500);
  }
});

// ─────────────────────────────────────────────
// PLATFORMS
// ─────────────────────────────────────────────
app.get("/make-server-61a58ed0/platforms", async (c) => {
  try {
    const data = await kv.get('church:platforms');
    return c.json(data ?? []);
  } catch (err) {
    console.log('[platforms GET] error:', err);
    return c.json({ error: `Failed to fetch platforms: ${err}` }, 500);
  }
});

app.post("/make-server-61a58ed0/platforms", async (c) => {
  try {
    const newPlatform = await c.req.json();
    const data: any[] = (await kv.get('church:platforms') as any) ?? [];
    data.unshift(newPlatform);
    await kv.set('church:platforms', data);
    return c.json(newPlatform, 201);
  } catch (err) {
    console.log('[platforms POST] error:', err);
    return c.json({ error: `Failed to add platform: ${err}` }, 500);
  }
});

app.put("/make-server-61a58ed0/platforms/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    const data: any[] = (await kv.get('church:platforms') as any) ?? [];
    const idx = data.findIndex((p: any) => p.id === id);
    if (idx === -1) return c.json({ error: 'Platform not found' }, 404);
    data[idx] = { ...data[idx], ...updates };
    await kv.set('church:platforms', data);
    return c.json(data[idx]);
  } catch (err) {
    console.log('[platforms PUT] error:', err);
    return c.json({ error: `Failed to update platform: ${err}` }, 500);
  }
});

app.delete("/make-server-61a58ed0/platforms/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const data: any[] = (await kv.get('church:platforms') as any) ?? [];
    const filtered = data.filter((p: any) => p.id !== id);
    await kv.set('church:platforms', filtered);
    return c.json({ ok: true });
  } catch (err) {
    console.log('[platforms DELETE] error:', err);
    return c.json({ error: `Failed to delete platform: ${err}` }, 500);
  }
});

// ─────────────────────────────────────────────
// EVENTS (일정)
// ─────────────────────────────────────────────
app.get("/make-server-61a58ed0/events", async (c) => {
  try {
    const data = await kv.get('church:events');
    return c.json(data ?? []);
  } catch (err) {
    console.log('[events GET] error:', err);
    return c.json({ error: `Failed to fetch events: ${err}` }, 500);
  }
});

app.post("/make-server-61a58ed0/events", async (c) => {
  try {
    const newEvent = await c.req.json();
    const data: any[] = (await kv.get('church:events') as any) ?? [];
    data.push(newEvent);
    await kv.set('church:events', data);
    return c.json(newEvent, 201);
  } catch (err) {
    console.log('[events POST] error:', err);
    return c.json({ error: `Failed to add event: ${err}` }, 500);
  }
});

app.put("/make-server-61a58ed0/events/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    const data: any[] = (await kv.get('church:events') as any) ?? [];
    const idx = data.findIndex((e: any) => e.id === id);
    if (idx === -1) return c.json({ error: 'Event not found' }, 404);
    data[idx] = { ...data[idx], ...updates };
    await kv.set('church:events', data);
    return c.json(data[idx]);
  } catch (err) {
    console.log('[events PUT] error:', err);
    return c.json({ error: `Failed to update event: ${err}` }, 500);
  }
});

app.delete("/make-server-61a58ed0/events/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const data: any[] = (await kv.get('church:events') as any) ?? [];
    const filtered = data.filter((e: any) => e.id !== id);
    await kv.set('church:events', filtered);
    return c.json({ ok: true });
  } catch (err) {
    console.log('[events DELETE] error:', err);
    return c.json({ error: `Failed to delete event: ${err}` }, 500);
  }
});

// ─────────────────────────────────────────────
// SURVEYS (설문)
// ─────────────────────────────────────────────
app.get("/make-server-61a58ed0/surveys", async (c) => {
  try {
    const data = await kv.get('church:surveys');
    return c.json(data ?? []);
  } catch (err) {
    console.log('[surveys GET] error:', err);
    return c.json({ error: `Failed to fetch surveys: ${err}` }, 500);
  }
});

app.post("/make-server-61a58ed0/surveys", async (c) => {
  try {
    const newSurvey = await c.req.json();
    const data: any[] = (await kv.get('church:surveys') as any) ?? [];
    data.unshift(newSurvey);
    await kv.set('church:surveys', data);
    return c.json(newSurvey, 201);
  } catch (err) {
    console.log('[surveys POST] error:', err);
    return c.json({ error: `Failed to add survey: ${err}` }, 500);
  }
});

// Update survey metadata (title, description, deadline, isActive only)
app.put("/make-server-61a58ed0/surveys/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    const data: any[] = (await kv.get('church:surveys') as any) ?? [];
    const idx = data.findIndex((s: any) => s.id === id);
    if (idx === -1) return c.json({ error: 'Survey not found' }, 404);
    // Only allow updating safe fields (questions are immutable after creation)
    const allowed = ['title', 'description', 'deadline', 'isActive'];
    const safeUpdates: any = {};
    for (const key of allowed) {
      if (key in updates) safeUpdates[key] = updates[key];
    }
    data[idx] = { ...data[idx], ...safeUpdates };
    await kv.set('church:surveys', data);
    return c.json(data[idx]);
  } catch (err) {
    console.log('[surveys PUT] error:', err);
    return c.json({ error: `Failed to update survey: ${err}` }, 500);
  }
});

app.delete("/make-server-61a58ed0/surveys/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const data: any[] = (await kv.get('church:surveys') as any) ?? [];
    const filtered = data.filter((s: any) => s.id !== id);
    await kv.set('church:surveys', filtered);
    return c.json({ ok: true });
  } catch (err) {
    console.log('[surveys DELETE] error:', err);
    return c.json({ error: `Failed to delete survey: ${err}` }, 500);
  }
});

// Submit / update a response for a survey
app.post("/make-server-61a58ed0/surveys/:id/respond", async (c) => {
  try {
    const id = c.req.param('id');
    const { userId, userName, answers } = await c.req.json();
    if (!userId || !answers) return c.json({ error: 'userId and answers are required' }, 400);

    const data: any[] = (await kv.get('church:surveys') as any) ?? [];
    const idx = data.findIndex((s: any) => s.id === id);
    if (idx === -1) return c.json({ error: 'Survey not found' }, 404);

    const survey = data[idx];
    const newResponse = {
      id: Date.now().toString(),
      userId,
      userName,
      answers,
      submittedAt: new Date().toISOString(),
    };

    const existingIdx = (survey.responses ?? []).findIndex((r: any) => r.userId === userId);
    const responses = [...(survey.responses ?? [])];
    if (existingIdx >= 0) {
      responses[existingIdx] = newResponse;
    } else {
      responses.push(newResponse);
    }

    data[idx] = { ...survey, responses };
    await kv.set('church:surveys', data);
    return c.json(data[idx]);
  } catch (err) {
    console.log('[surveys respond POST] error:', err);
    return c.json({ error: `Failed to submit survey response: ${err}` }, 500);
  }
});

Deno.serve(app.fetch);