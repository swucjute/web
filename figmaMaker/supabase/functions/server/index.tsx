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
    lifecycle: 'active',
    activeStates: ['recruiting'],
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
    lifecycle: 'active',
    activeStates: ['recruiting', 'operating'],
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
    lifecycle: 'active',
    activeStates: ['operating'],
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
    lifecycle: 'active',
    activeStates: ['ended'],
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
    lifecycle: 'pending',
    activeStates: [],
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

// ─────────────────────────────────────────────
// Worship & Praise seed data
// ─────────────────────────────────────────────
const defaultWorships = [
  {
    id: 'seed-worship-1',
    date: '2026-04-13',
    title: '주일 청년 예배',
    preacher: '김성민 목사',
    scripture: '요한복음 15:1-11',
    scriptureText: '나는 참포도나무요 내 아버지는 그 농부라...',
    sermonTitle: '포도나무와 가지',
    attendance: 47,
    worshipLeader: '이지은',
    praiseList: [],
    offerings: 320000,
    notes: '부활절 후 첫 주일 예배',
    youtubeUrl: '',
    committee: { repPrayer: '박민준', bibleReading: '최수진', offering: '한도윤' },
    announcements: [],
  },
  {
    id: 'seed-worship-2',
    date: '2026-04-06',
    title: '부활절 청년 예배',
    preacher: '박요한 목사',
    scripture: '마태복음 28:1-10',
    scriptureText: '안식일이 다 지나고 안식 후 첫날이 되려는 새벽에...',
    sermonTitle: '그가 살아나셨다',
    attendance: 68,
    worshipLeader: '최다은',
    praiseList: [],
    offerings: 510000,
    notes: '부활절 특별 예배, 세례식 진행',
    youtubeUrl: '',
    committee: { repPrayer: '이승호', bibleReading: '김하늘', offering: '오지훈' },
    announcements: [],
  },
  {
    id: 'seed-worship-3',
    date: '2026-03-30',
    title: '주일 청년 예배',
    preacher: '이희망 목사',
    scripture: '로마서 8:28-39',
    scriptureText: '우리가 알거니와 하나님을 사랑하는 자 곧 그의 뜻대로 부르심을 입은 자들에게는...',
    sermonTitle: '끊을 수 없는 하나님의 사랑',
    attendance: 61,
    worshipLeader: '정은혜',
    praiseList: [],
    offerings: 410000,
    notes: '',
    youtubeUrl: '',
    committee: { repPrayer: '강태양', bibleReading: '윤서연', offering: '임채원' },
    announcements: [],
  },
];

const defaultPraises = [
  // seed-worship-1 (2026-04-13)
  { id: 'seed-praise-1-1', worshipId: 'seed-worship-1', title: '주 예수보다 더 귀한 것은 없네', artist: '', key: 'G', tempo: '', category: '찬양', youtubeUrl: 'https://www.youtube.com/watch?v=example1' },
  { id: 'seed-praise-1-2', worshipId: 'seed-worship-1', title: '하나님은 너를 지키시는 자', artist: '', key: 'C', tempo: '', category: '찬양', youtubeUrl: 'https://www.youtube.com/watch?v=example2' },
  { id: 'seed-praise-1-3', worshipId: 'seed-worship-1', title: '내 삶의 이유라', artist: '', key: 'D', tempo: '', category: '찬양', youtubeUrl: '' },
  // seed-worship-2 (2026-04-06)
  { id: 'seed-praise-2-1', worshipId: 'seed-worship-2', title: '부활하신 주님', artist: '', key: 'A', tempo: '', category: '찬양', youtubeUrl: 'https://www.youtube.com/watch?v=example3' },
  { id: 'seed-praise-2-2', worshipId: 'seed-worship-2', title: '할렐루야 (주님께 영광)', artist: '', key: 'E', tempo: '', category: '찬양', youtubeUrl: 'https://www.youtube.com/watch?v=example4' },
  { id: 'seed-praise-2-3', worshipId: 'seed-worship-2', title: '살아계신 주', artist: '', key: 'G', tempo: '', category: '찬양', youtubeUrl: '' },
  // seed-worship-3 (2026-03-30)
  { id: 'seed-praise-3-1', worshipId: 'seed-worship-3', title: '주님 손에 나의 손을 포개고', artist: '', key: 'F', tempo: '', category: '찬양', youtubeUrl: '' },
  { id: 'seed-praise-3-2', worshipId: 'seed-worship-3', title: '사랑하는 나의 아버지', artist: '', key: 'C', tempo: '', category: '찬양', youtubeUrl: 'https://www.youtube.com/watch?v=example5' },
  { id: 'seed-praise-3-3', worshipId: 'seed-worship-3', title: '주 이름 찬양', artist: '', key: 'D', tempo: '', category: '찬양', youtubeUrl: 'https://www.youtube.com/watch?v=example6' },
];

// Initialize KV with seed data if empty
let isInitialized = false;
let initPromise: Promise<void> | null = null;

async function initSeedData() {
  if (isInitialized) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      console.log('[seed] Starting initialization...');
      console.log('[seed] Checking environment...');

      // Validate environment variables
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

      if (!supabaseUrl || !supabaseKey) {
        console.error('[seed] Missing environment variables!', {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseKey
        });
        throw new Error('Missing required Supabase environment variables');
      }

      console.log('[seed] Environment OK, proceeding with initialization...');

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

      const worships = await kv.get('church:worships');
      if (!worships) {
        await kv.set('church:worships', defaultWorships);
        console.log('[seed] church:worships initialized');
      }

      const praises = await kv.get('church:praises');
      if (!praises) {
        await kv.set('church:praises', defaultPraises);
        console.log('[seed] church:praises initialized');
      }

      isInitialized = true;
      console.log('[seed] Initialization complete');
    } catch (err) {
      console.log('[seed] Error during seed initialization:', err);
      initPromise = null; // Allow retry on next request
      throw err;
    }
  })();

  return initPromise;
}

// Middleware to ensure initialization before handling requests
app.use('*', async (c, next) => {
  try {
    await initSeedData();
    await next();
  } catch (err) {
    console.log('[middleware] Initialization error:', err);
    return c.json({ error: 'Server is initializing, please retry' }, 503);
  }
});

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
    console.log('[members GET] Fetching members...');
    const data = await kv.get('church:members');
    console.log('[members GET] Retrieved:', data ? `${(data as any[]).length} members` : 'null/empty');
    return c.json(data ?? []);
  } catch (err) {
    console.log('[members GET] error:', err);
    return c.json({ error: `Failed to fetch members: ${err?.message || err}` }, 500);
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
    console.log('[platforms GET] Fetching platforms...');
    const data = await kv.get('church:platforms');
    console.log('[platforms GET] Retrieved:', data ? `${(data as any[]).length} platforms` : 'null/empty');
    return c.json(data ?? []);
  } catch (err) {
    console.log('[platforms GET] error:', err);
    return c.json({ error: `Failed to fetch platforms: ${err?.message || err}` }, 500);
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
    console.log('[events GET] Fetching events...');
    const data = await kv.get('church:events');
    console.log('[events GET] Retrieved:', data ? `${(data as any[]).length} events` : 'null/empty');
    return c.json(data ?? []);
  } catch (err) {
    console.log('[events GET] error:', err);
    return c.json({ error: `Failed to fetch events: ${err?.message || err}` }, 500);
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
    console.log('[surveys GET] Fetching surveys...');
    const data = await kv.get('church:surveys');
    console.log('[surveys GET] Retrieved:', data ? `${(data as any[]).length} surveys` : 'null/empty');
    return c.json(data ?? []);
  } catch (err) {
    console.log('[surveys GET] error:', err);
    return c.json({ error: `Failed to fetch surveys: ${err?.message || err}` }, 500);
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

// ─────────────────────────────────────────────
// WORSHIPS (예배)
// ─────────────────────────────────────────────
app.get("/make-server-61a58ed0/worships", async (c) => {
  try {
    console.log('[worships GET] Fetching worships...');
    const data = await kv.get('church:worships');
    console.log('[worships GET] Retrieved:', data ? `${(data as any[]).length} worships` : 'null/empty');
    return c.json(data ?? []);
  } catch (err) {
    console.log('[worships GET] error:', err);
    return c.json({ error: `Failed to fetch worships: ${err?.message || err}` }, 500);
  }
});

app.post("/make-server-61a58ed0/worships", async (c) => {
  try {
    const newWorship = await c.req.json();
    const data: any[] = (await kv.get('church:worships') as any) ?? [];
    data.unshift(newWorship);
    await kv.set('church:worships', data);
    return c.json(newWorship, 201);
  } catch (err) {
    console.log('[worships POST] error:', err);
    return c.json({ error: `Failed to add worship: ${err}` }, 500);
  }
});

app.put("/make-server-61a58ed0/worships/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    const data: any[] = (await kv.get('church:worships') as any) ?? [];
    const idx = data.findIndex((w: any) => w.id === id);
    if (idx === -1) return c.json({ error: 'Worship not found' }, 404);
    data[idx] = { ...data[idx], ...updates };
    await kv.set('church:worships', data);
    return c.json(data[idx]);
  } catch (err) {
    console.log('[worships PUT] error:', err);
    return c.json({ error: `Failed to update worship: ${err}` }, 500);
  }
});

app.delete("/make-server-61a58ed0/worships/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const data: any[] = (await kv.get('church:worships') as any) ?? [];
    const filtered = data.filter((w: any) => w.id !== id);
    await kv.set('church:worships', filtered);
    return c.json({ ok: true });
  } catch (err) {
    console.log('[worships DELETE] error:', err);
    return c.json({ error: `Failed to delete worship: ${err}` }, 500);
  }
});

// ─────────────────────────────────────────────
// PRAISES (찬양)
// ─────────────────────────────────────────────
app.get("/make-server-61a58ed0/praises", async (c) => {
  try {
    console.log('[praises GET] Fetching praises...');
    const data = await kv.get('church:praises');
    console.log('[praises GET] Retrieved:', data ? `${(data as any[]).length} praises` : 'null/empty');
    return c.json(data ?? []);
  } catch (err) {
    console.log('[praises GET] error:', err);
    return c.json({ error: `Failed to fetch praises: ${err?.message || err}` }, 500);
  }
});

app.post("/make-server-61a58ed0/praises", async (c) => {
  try {
    const newPraise = await c.req.json();
    const data: any[] = (await kv.get('church:praises') as any) ?? [];
    data.push(newPraise);
    await kv.set('church:praises', data);
    return c.json(newPraise, 201);
  } catch (err) {
    console.log('[praises POST] error:', err);
    return c.json({ error: `Failed to add praise: ${err}` }, 500);
  }
});

app.put("/make-server-61a58ed0/praises/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    const data: any[] = (await kv.get('church:praises') as any) ?? [];
    const idx = data.findIndex((p: any) => p.id === id);
    if (idx === -1) return c.json({ error: 'Praise not found' }, 404);
    data[idx] = { ...data[idx], ...updates };
    await kv.set('church:praises', data);
    return c.json(data[idx]);
  } catch (err) {
    console.log('[praises PUT] error:', err);
    return c.json({ error: `Failed to update praise: ${err}` }, 500);
  }
});

app.delete("/make-server-61a58ed0/praises/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const data: any[] = (await kv.get('church:praises') as any) ?? [];
    const filtered = data.filter((p: any) => p.id !== id);
    await kv.set('church:praises', filtered);
    return c.json({ ok: true });
  } catch (err) {
    console.log('[praises DELETE] error:', err);
    return c.json({ error: `Failed to delete praise: ${err}` }, 500);
  }
});

Deno.serve(app.fetch);