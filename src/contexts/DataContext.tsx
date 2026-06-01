import React, { createContext, useContext, useState, useEffect } from 'react';
import type { FinanceRecord, CommunityPost, Event, Worship, Praise, Survey, Prayer } from '../types';
import { eventsApi, surveysApi } from '../utils/api';
import { mockWorships, mockPraises } from '../mocks/data';

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

  // Events (Supabase 연동)
  events: Event[];
  eventsLoading: boolean;
  addEvent: (event: Omit<Event, 'id'>) => Promise<void>;
  updateEvent: (id: string, event: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;

  // Worship
  worships: Worship[];
  addWorship: (worship: Omit<Worship, 'id'>) => void;
  updateWorship: (id: string, worship: Partial<Worship>) => void;
  deleteWorship: (id: string) => void;

  // Praise
  praises: Praise[];
  addPraise: (praise: Omit<Praise, 'id'>) => void;
  updatePraise: (id: string, praise: Partial<Praise>) => void;
  deletePraise: (id: string) => void;

  // Survey (Supabase 연동)
  surveys: Survey[];
  surveysLoading: boolean;
  addSurvey: (survey: Omit<Survey, 'id' | 'createdAt' | 'responses'>) => Promise<void>;
  updateSurvey: (id: string, data: { title?: string; description?: string; deadline?: string; isActive?: boolean }) => Promise<void>;
  deleteSurvey: (id: string) => Promise<void>;
  submitSurveyResponse: (surveyId: string, userId: string, userName: string, answers: Record<string, unknown>) => Promise<void>;

  // Prayer
  prayers: Prayer[];
  addPrayer: (prayer: Omit<Prayer, 'id' | 'createdAt' | 'reactions'>) => void;
  updatePrayer: (id: string, prayer: Partial<Prayer>) => void;
  deletePrayer: (id: string) => void;
  togglePrayerReaction: (id: string, userId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [finances, setFinances] = useState<FinanceRecord[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [worships, setWorships] = useState<Worship[]>([]);
  const [praises, setPraises] = useState<Praise[]>([]);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [surveysLoading, setSurveysLoading] = useState(true);
  const [prayers, setPrayers] = useState<Prayer[]>([]);

  // Load non-Supabase data from localStorage (없으면 mock 데이터로 초기화)
  useEffect(() => {
    const loadLocal = <T,>(key: string, setter: React.Dispatch<React.SetStateAction<T[]>>, fallback?: T[]) => {
      const data = localStorage.getItem(key);
      if (data) {
        setter(JSON.parse(data) as T[]);
      } else if (fallback) {
        setter(fallback);
      }
    };
    loadLocal('finances', setFinances);
    loadLocal('posts', setPosts, SEED_POSTS);
    loadLocal('worships', setWorships, mockWorships);
    loadLocal('praises', setPraises, mockPraises);
    loadLocal('prayers', setPrayers);
  }, []);

  // Load events - localStorage 먼저 복구 후 API로 갱신
  useEffect(() => {
    const local = localStorage.getItem('events');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (local) setEvents(JSON.parse(local));

    eventsApi.getAll()
      .then((data) => {
        const apiEvents = data as Event[];
        // localStorage에 저장된 이벤트 중 mock에 없는 것(사용자 추가분)을 병합
        setEvents((prev) => {
          const apiIds = new Set(apiEvents.map((e) => e.id));
          const userAdded = prev.filter((e) => !apiIds.has(e.id));
          return [...apiEvents, ...userAdded];
        });
      })
      .catch((err) => {
        console.error('[DataContext] Failed to load events:', err);
      })
      .finally(() => setEventsLoading(false));
  }, []);

  // Load surveys from Supabase
  useEffect(() => {
    surveysApi.getAll()
      .then((data) => setSurveys(data as Survey[]))
      .catch((err) => {
        console.error('[DataContext] Failed to load surveys:', err);
        const local = localStorage.getItem('surveys');
        if (local) setSurveys(JSON.parse(local));
      })
      .finally(() => setSurveysLoading(false));
  }, []);

  // Persist data to localStorage
  useEffect(() => { localStorage.setItem('finances', JSON.stringify(finances)); }, [finances]);
  useEffect(() => { localStorage.setItem('posts', JSON.stringify(posts)); }, [posts]);
  useEffect(() => { localStorage.setItem('events', JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem('worships', JSON.stringify(worships)); }, [worships]);
  useEffect(() => { localStorage.setItem('praises', JSON.stringify(praises)); }, [praises]);
  useEffect(() => { localStorage.setItem('prayers', JSON.stringify(prayers)); }, [prayers]);

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

  // ── Events (Supabase) ──────────────────────────────────
  const addEvent = async (event: Omit<Event, 'id'>) => {
    const newEvent: Event = { ...event, id: Date.now().toString() };
    setEvents((prev) => [...prev, newEvent]);
    try {
      await eventsApi.add(newEvent);
    } catch (err) {
      console.error('[DataContext] addEvent failed:', err);
      setEvents((prev) => prev.filter((e) => e.id !== newEvent.id));
    }
  };
  const updateEvent = async (id: string, event: Partial<Event>) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...event } : e)));
    try {
      await eventsApi.update(id, event);
    } catch (err) {
      console.error('[DataContext] updateEvent failed:', err);
      eventsApi.getAll().then((d) => setEvents(d as Event[])).catch(() => {});
    }
  };
  const deleteEvent = async (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    try {
      await eventsApi.remove(id);
    } catch (err) {
      console.error('[DataContext] deleteEvent failed:', err);
      eventsApi.getAll().then((d) => setEvents(d as Event[])).catch(() => {});
    }
  };

  // ── Worship ────────────────────────────────────────────
  const addWorship = (worship: Omit<Worship, 'id'>) => {
    setWorships((prev) => [...prev, { ...worship, id: Date.now().toString() }]);
  };
  const updateWorship = (id: string, worship: Partial<Worship>) => {
    setWorships((prev) => prev.map((w) => (w.id === id ? { ...w, ...worship } : w)));
  };
  const deleteWorship = (id: string) => {
    setWorships((prev) => prev.filter((w) => w.id !== id));
  };

  // ── Praise ─────────────────────────────────────────────
  const addPraise = (praise: Omit<Praise, 'id'>) => {
    setPraises((prev) => [...prev, { ...praise, id: Date.now().toString() }]);
  };
  const updatePraise = (id: string, praise: Partial<Praise>) => {
    setPraises((prev) => prev.map((p) => (p.id === id ? { ...p, ...praise } : p)));
  };
  const deletePraise = (id: string) => {
    setPraises((prev) => prev.filter((p) => p.id !== id));
  };

  // ── Survey (Supabase) ──────────────────────────────────
  const addSurvey = async (survey: Omit<Survey, 'id' | 'createdAt' | 'responses'>) => {
    const newSurvey: Survey = {
      ...survey,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      responses: [],
    };
    setSurveys((prev) => [newSurvey, ...prev]);
    try {
      await surveysApi.add(newSurvey);
    } catch (err) {
      console.error('[DataContext] addSurvey failed:', err);
      setSurveys((prev) => prev.filter((s) => s.id !== newSurvey.id));
    }
  };

  const updateSurvey = async (
    id: string,
    data: { title?: string; description?: string; deadline?: string; isActive?: boolean },
  ) => {
    setSurveys((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
    try {
      await surveysApi.update(id, data);
    } catch (err) {
      console.error('[DataContext] updateSurvey failed:', err);
      surveysApi.getAll().then((d) => setSurveys(d as Survey[])).catch(() => {});
    }
  };

  const deleteSurvey = async (id: string) => {
    setSurveys((prev) => prev.filter((s) => s.id !== id));
    try {
      await surveysApi.remove(id);
    } catch (err) {
      console.error('[DataContext] deleteSurvey failed:', err);
      surveysApi.getAll().then((d) => setSurveys(d as Survey[])).catch(() => {});
    }
  };

  const submitSurveyResponse = async (surveyId: string, userId: string, userName: string, answers: Record<string, unknown>) => {
    // Optimistic local update
    setSurveys((prev) =>
      prev.map((survey) => {
        if (survey.id !== surveyId) return survey;
        const newResponse = {
          id: Date.now().toString(),
          userId,
          userName,
          answers,
          submittedAt: new Date().toISOString(),
        };
        const responses = [...survey.responses];
        const existingIdx = responses.findIndex((r) => r.userId === userId);
        if (existingIdx >= 0) responses[existingIdx] = newResponse;
        else responses.push(newResponse);
        return { ...survey, responses };
      }),
    );
    try {
      // Server responds with the updated survey including new response
      const updated = await surveysApi.respond(surveyId, { userId, userName, answers });
      // Sync with server truth
      setSurveys((prev) => prev.map((s) => (s.id === surveyId ? (updated as Survey) : s)));
    } catch (err) {
      console.error('[DataContext] submitSurveyResponse failed:', err);
      surveysApi.getAll().then((d) => setSurveys(d as Survey[])).catch(() => {});
    }
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
        worships, addWorship, updateWorship, deleteWorship,
        praises, addPraise, updatePraise, deletePraise,
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