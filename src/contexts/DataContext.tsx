import React, { createContext, useContext, useState, useEffect } from 'react';
import type { FinanceRecord, CommunityPost, Event, Worship, Praise, Survey, Prayer } from '../types';
import { eventsApi, surveysApi, worshipsApi, praisesApi } from '../utils/api';
import { useCrudQuery } from '../hooks/useCrudQuery';

const SEED_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    type: 'notice',
    category: '예배',
    title: '이번 주 예배 안내',
    content: '이번 주 주일 예배는 오전 11시에 시작합니다. 찬양팀은 30분 전까지 도착해주세요. 예배 후 광고 시간에 6월 수련회 일정 안내가 있을 예정입니다.',
    author: 'admin',
    authorName: '김목사',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    date: '2026-06-01',
    location: '본당 3층',
    chatLink: '',
    maxParticipants: '',
    comments: [
      { id: 'c-1', content: '네 알겠습니다!', author: 'user1', authorName: '이지수', createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString() },
    ],
    likes: ['user1', 'user2'],
  },
  {
    id: 'post-2',
    type: 'recruit',
    category: '전도',
    title: '여름 전도 캠프 팀원 모집',
    content: '7월 둘째 주에 진행되는 여름 전도 캠프에 함께할 팀원을 모집합니다. 관심 있으신 분은 아래 채팅방으로 참여해주세요. 봉사 마음만 있으면 누구든 환영합니다!',
    author: 'user2',
    authorName: '박전도사',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    date: '2026-07-13',
    location: '교회 앞 광장',
    chatLink: 'https://open.kakao.com/example',
    maxParticipants: '20',
    comments: [],
    likes: ['user3'],
  },
  {
    id: 'post-3',
    type: 'notice',
    category: '공지',
    title: '6월 청년부 모임 일정 변경 안내',
    content: '6월 15일(일) 청년부 모임은 장소 사정으로 인해 교육관 2층 세미나실로 변경됩니다. 시간은 동일하게 오후 2시입니다. 착오 없으시기 바랍니다.',
    author: 'admin',
    authorName: '김목사',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    date: '2026-06-15',
    location: '교육관 2층 세미나실',
    chatLink: '',
    maxParticipants: '',
    comments: [
      { id: 'c-2', content: '감사합니다, 확인했습니다!', author: 'user3', authorName: '최민준', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'c-3', content: '공유 감사해요 :)', author: 'user1', authorName: '이지수', createdAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString() },
    ],
    likes: ['user1', 'user2', 'user3'],
  },
  {
    id: 'post-4',
    type: 'recruit',
    category: '행사',
    title: '청년부 체육대회 참가자 모집',
    content: '올 상반기 마지막 행사인 청년부 체육대회를 개최합니다! 축구, 피구, 줄다리기 등 다양한 종목이 준비되어 있으니 많은 참여 부탁드립니다. 점심 도시락 제공됩니다.',
    author: 'user3',
    authorName: '최민준',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    date: '2026-06-28',
    location: '교회 야외 운동장',
    chatLink: 'https://open.kakao.com/example2',
    maxParticipants: '40',
    comments: [
      { id: 'c-4', content: '저 참가할게요!', author: 'user2', authorName: '박전도사', createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
    ],
    likes: ['user1', 'user2', 'admin'],
  },
  {
    id: 'post-5',
    type: 'notice',
    category: '공지',
    title: '헌금 및 재정 보고 (5월)',
    content: '5월 한 달간 청년부 헌금 총액은 850,000원이며, 이 중 전도 사역 350,000원, 친교 비용 200,000원, 선교 후원 300,000원으로 사용되었습니다. 자세한 내용은 재정 담당자에게 문의해주세요.',
    author: 'admin',
    authorName: '김목사',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    date: '',
    location: '',
    chatLink: '',
    maxParticipants: '',
    comments: [],
    likes: ['user1'],
  },
];

interface DataContextType {
  // Finance
  finances: FinanceRecord[];
  addFinance: (finance: Omit<FinanceRecord, 'id'>) => void;
  updateFinance: (id: string, finance: Partial<FinanceRecord>) => void;
  deleteFinance: (id: string) => void;

  // Community
  posts: CommunityPost[];
  addPost: (post: Omit<CommunityPost, 'id' | 'createdAt' | 'comments' | 'likes'>) => void;
  addComment: (postId: string, content: string, author: string, authorName: string) => void;
  toggleLike: (postId: string, userId: string) => void;

  // Events (mock API 연동)
  events: Event[];
  eventsLoading: boolean;
  addEvent: (event: Omit<Event, 'id'>) => Promise<void>;
  updateEvent: (id: string, event: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;

  // Worship
  worships: Worship[];
  worshipsLoading: boolean;
  addWorship: (worship: Omit<Worship, 'id'>) => Promise<void>;
  updateWorship: (id: string, worship: Partial<Worship>) => Promise<void>;
  deleteWorship: (id: string) => Promise<void>;

  // Praise
  praises: Praise[];
  praisesLoading: boolean;
  addPraise: (praise: Omit<Praise, 'id'>) => Promise<void>;
  updatePraise: (id: string, praise: Partial<Praise>) => Promise<void>;
  deletePraise: (id: string) => Promise<void>;

  // Survey (mock API 연동)
  surveys: Survey[];
  surveysLoading: boolean;
  addSurvey: (survey: Omit<Survey, 'id' | 'createdAt' | 'responses'>) => Promise<void>;
  updateSurvey: (id: string, data: { title?: string; description?: string; deadline?: string; isActive?: boolean }) => Promise<void>;
  deleteSurvey: (id: string) => Promise<void>;
  submitSurveyResponse: (surveyId: string, userId: string, userName: string, answers: Record<string, string | string[]>) => Promise<void>;

  // Prayer
  prayers: Prayer[];
  addPrayer: (prayer: Omit<Prayer, 'id' | 'createdAt' | 'reactions'>) => void;
  updatePrayer: (id: string, prayer: Partial<Prayer>) => void;
  deletePrayer: (id: string) => void;
  togglePrayerReaction: (id: string, userId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

function readLocal<T>(key: string, fallback?: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (raw !== null) {
      const parsed = JSON.parse(raw) as T[];
      // 빈 배열이고 fallback이 있으면 seed 데이터 사용
      if (parsed.length > 0 || !fallback) return parsed;
    }
  } catch {
    return fallback ?? [];
  }
  return fallback ?? [];
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  // 서버 없는 로컬 전용 데이터 (finances/posts/prayers)
  // 지연 초기화로 읽어와 localStorage 복구 시 race condition 방지
  const [finances, setFinances] = useState<FinanceRecord[]>(() => readLocal('finances'));
  const [posts, setPosts] = useState<CommunityPost[]>(() => readLocal('posts', SEED_POSTS));
  const [prayers, setPrayers] = useState<Prayer[]>(() => readLocal('prayers'));

  useEffect(() => { localStorage.setItem('finances', JSON.stringify(finances)); }, [finances]);
  useEffect(() => { localStorage.setItem('posts', JSON.stringify(posts)); }, [posts]);
  useEffect(() => { localStorage.setItem('prayers', JSON.stringify(prayers)); }, [prayers]);

  // ── Events (mock API) ──────────────────────────────────
  const {
    data: events,
    isLoading: eventsLoading,
    optimisticMutate: mutateEvents,
  } = useCrudQuery<Event>('events', async () => (await eventsApi.getAll()) as Event[]);

  // ── Worship (mock API) ─────────────────────────────────
  const {
    data: worships,
    isLoading: worshipsLoading,
    optimisticMutate: mutateWorships,
  } = useCrudQuery<Worship>('worships', async () => (await worshipsApi.getAll()) as Worship[]);

  // ── Praise (mock API) ──────────────────────────────────
  const {
    data: praises,
    isLoading: praisesLoading,
    optimisticMutate: mutatePraises,
  } = useCrudQuery<Praise>('praises', async () => (await praisesApi.getAll()) as Praise[]);

  // ── Survey (mock API) ──────────────────────────────────
  const {
    data: surveys,
    isLoading: surveysLoading,
    optimisticMutate: mutateSurveys,
  } = useCrudQuery<Survey>('surveys', async () => (await surveysApi.getAll()) as Survey[]);

  // ── Finance ────────────────────────────────────────────
  const addFinance = (finance: Omit<FinanceRecord, 'id'>) => {
    setFinances((prev) => [...prev, { ...finance, id: Date.now().toString() }]);
  };
  const updateFinance = (id: string, finance: Partial<FinanceRecord>) => {
    setFinances((prev) => prev.map((f) => (f.id === id ? { ...f, ...finance } : f)));
  };
  const deleteFinance = (id: string) => {
    setFinances((prev) => prev.filter((f) => f.id !== id));
  };

  // ── Community ──────────────────────────────────────────
  const addPost = (post: Omit<CommunityPost, 'id' | 'createdAt' | 'comments' | 'likes'>) => {
    const newPost: CommunityPost = {
      ...post,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      comments: [],
      likes: [],
    };
    setPosts((prev) => [newPost, ...prev]);
  };
  const addComment = (postId: string, content: string, author: string, authorName: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                { id: Date.now().toString(), content, author, authorName, createdAt: new Date().toISOString() },
              ],
            }
          : post,
      ),
    );
  };
  const toggleLike = (postId: string, userId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const likes = post.likes.includes(userId)
          ? post.likes.filter((id) => id !== userId)
          : [...post.likes, userId];
        return { ...post, likes };
      }),
    );
  };

  // ── Events ─────────────────────────────────────────────
  const addEvent = async (event: Omit<Event, 'id'>) => {
    const newEvent: Event = { ...event, id: Date.now().toString() };
    await mutateEvents(
      (prev) => [...prev, newEvent],
      () => eventsApi.add(newEvent),
    );
  };
  const updateEvent = async (id: string, event: Partial<Event>) => {
    await mutateEvents(
      (prev) => prev.map((e) => (e.id === id ? { ...e, ...event } : e)),
      () => eventsApi.update(id, event),
    );
  };
  const deleteEvent = async (id: string) => {
    await mutateEvents(
      (prev) => prev.filter((e) => e.id !== id),
      () => eventsApi.remove(id),
    );
  };

  // ── Worship ────────────────────────────────────────────
  const addWorship = async (worship: Omit<Worship, 'id'>) => {
    const newWorship: Worship = { ...worship, id: Date.now().toString() };
    await mutateWorships(
      (prev) => [newWorship, ...prev],
      () => worshipsApi.add(newWorship),
    );
  };
  const updateWorship = async (id: string, worship: Partial<Worship>) => {
    await mutateWorships(
      (prev) => prev.map((w) => (w.id === id ? { ...w, ...worship } : w)),
      () => worshipsApi.update(id, worship),
    );
  };
  const deleteWorship = async (id: string) => {
    await mutateWorships(
      (prev) => prev.filter((w) => w.id !== id),
      () => worshipsApi.remove(id),
    );
  };

  // ── Praise ─────────────────────────────────────────────
  const addPraise = async (praise: Omit<Praise, 'id'>) => {
    const newPraise: Praise = { ...praise, id: Date.now().toString() };
    await mutatePraises(
      (prev) => [...prev, newPraise],
      () => praisesApi.add(newPraise),
    );
  };
  const updatePraise = async (id: string, praise: Partial<Praise>) => {
    await mutatePraises(
      (prev) => prev.map((p) => (p.id === id ? { ...p, ...praise } : p)),
      () => praisesApi.update(id, praise),
    );
  };
  const deletePraise = async (id: string) => {
    await mutatePraises(
      (prev) => prev.filter((p) => p.id !== id),
      () => praisesApi.remove(id),
    );
  };

  // ── Survey ─────────────────────────────────────────────
  const addSurvey = async (survey: Omit<Survey, 'id' | 'createdAt' | 'responses'>) => {
    const newSurvey: Survey = {
      ...survey,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      responses: [],
    };
    await mutateSurveys(
      (prev) => [newSurvey, ...prev],
      () => surveysApi.add(newSurvey),
    );
  };

  const updateSurvey = async (
    id: string,
    data: { title?: string; description?: string; deadline?: string; isActive?: boolean },
  ) => {
    await mutateSurveys(
      (prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)),
      () => surveysApi.update(id, data),
    );
  };

  const deleteSurvey = async (id: string) => {
    await mutateSurveys(
      (prev) => prev.filter((s) => s.id !== id),
      () => surveysApi.remove(id),
    );
  };

  const submitSurveyResponse = async (surveyId: string, userId: string, userName: string, answers: Record<string, string | string[]>) => {
    const newResponse = {
      id: Date.now().toString(),
      userId,
      userName,
      answers,
      submittedAt: new Date().toISOString(),
    };
    await mutateSurveys(
      (prev) =>
        prev.map((survey) => {
          if (survey.id !== surveyId) return survey;
          const responses = [...survey.responses];
          const existingIdx = responses.findIndex((r) => r.userId === userId);
          if (existingIdx >= 0) responses[existingIdx] = newResponse;
          else responses.push(newResponse);
          return { ...survey, responses };
        }),
      () => surveysApi.respond(surveyId, { userId, userName, answers }),
    );
  };

  // ── Prayer ─────────────────────────────────────────────
  const addPrayer = (prayer: Omit<Prayer, 'id' | 'createdAt' | 'reactions'>) => {
    setPrayers((prev) => [
      { ...prayer, id: Date.now().toString(), createdAt: new Date().toISOString(), reactions: [] },
      ...prev,
    ]);
  };
  const updatePrayer = (id: string, prayer: Partial<Prayer>) => {
    setPrayers((prev) => prev.map((p) => (p.id === id ? { ...p, ...prayer } : p)));
  };
  const deletePrayer = (id: string) => {
    setPrayers((prev) => prev.filter((p) => p.id !== id));
  };
  const togglePrayerReaction = (id: string, userId: string) => {
    setPrayers((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const reactions = p.reactions.includes(userId)
          ? p.reactions.filter((r) => r !== userId)
          : [...p.reactions, userId];
        return { ...p, reactions };
      }),
    );
  };

  return (
    <DataContext.Provider
      value={{
        finances, addFinance, updateFinance, deleteFinance,
        posts, addPost, addComment, toggleLike,
        events, eventsLoading, addEvent, updateEvent, deleteEvent,
        worships, worshipsLoading, addWorship, updateWorship, deleteWorship,
        praises, praisesLoading, addPraise, updatePraise, deletePraise,
        surveys, surveysLoading, addSurvey, updateSurvey, deleteSurvey, submitSurveyResponse,
        prayers, addPrayer, updatePrayer, deletePrayer, togglePrayerReaction,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
