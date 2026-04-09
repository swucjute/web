import React, { createContext, useContext, useState, useEffect } from 'react';
import { FinanceRecord, CommunityPost, Event, Worship, Praise, Survey, Prayer } from '../types';
import { eventsApi, surveysApi } from '../utils/api';

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
  submitSurveyResponse: (surveyId: string, userId: string, userName: string, answers: any) => Promise<void>;

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

  // Load non-Supabase data from localStorage
  useEffect(() => {
    const loadLocal = (key: string, setter: any) => {
      const data = localStorage.getItem(key);
      if (data) setter(JSON.parse(data));
    };
    loadLocal('finances', setFinances);
    loadLocal('posts', setPosts);
    loadLocal('worships', setWorships);
    loadLocal('praises', setPraises);
    loadLocal('prayers', setPrayers);
  }, []);

  // Load events from Supabase
  useEffect(() => {
    eventsApi.getAll()
      .then((data) => setEvents(data as Event[]))
      .catch((err) => {
        console.error('[DataContext] Failed to load events:', err);
        const local = localStorage.getItem('events');
        if (local) setEvents(JSON.parse(local));
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

  // Persist non-Supabase data to localStorage
  useEffect(() => { localStorage.setItem('finances', JSON.stringify(finances)); }, [finances]);
  useEffect(() => { localStorage.setItem('posts', JSON.stringify(posts)); }, [posts]);
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

  const submitSurveyResponse = async (surveyId: string, userId: string, userName: string, answers: any) => {
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
      const updated = await surveysApi.respond(surveyId, userId, userName, answers);
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

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}