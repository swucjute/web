import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform, PlatformLifecycle, PlatformActiveState } from '../types';
import { platformsApi } from '../utils/api';

interface PlatformContextType {
  platforms: Platform[];
  loading: boolean;
  addPlatform: (p: Omit<Platform, 'id' | 'createdAt' | 'participants' | 'lifecycle' | 'activeStates'>) => Promise<void>;
  updatePlatform: (id: string, data: Partial<Platform>) => Promise<void>;
  deletePlatform: (id: string) => Promise<void>;
  approvePlatform: (id: string) => Promise<void>;
  rejectPlatform: (id: string, reason: string) => Promise<void>;
  joinPlatform: (id: string, userId: string) => Promise<void>;
  leavePlatform: (id: string, userId: string) => Promise<void>;
  approveParticipant: (id: string, userId: string) => Promise<void>;
  rejectParticipant: (id: string, userId: string) => Promise<void>;
  removeParticipant: (id: string, userId: string) => Promise<void>;
  toggleActiveState: (id: string, state: PlatformActiveState) => Promise<void>;
  getPlatformById: (id: string) => Platform | undefined;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);

  // Migrate old data format to new format
  const migratePlatform = (p: any): Platform => {
    // Ensure participants arrays exist
    const participants = p.participants || [];
    const pendingParticipants = p.pendingParticipants || [];

    // Ensure location exists - add default if missing
    const locations = [
      '교회 소그룹실',
      '청년부실',
      '본당',
      '카페 베들레헴',
      '야외 정원',
      '온라인 (Zoom)',
      '체육관',
      '세미나실',
    ];
    const location = p.location || locations[Math.floor(Math.random() * locations.length)];

    // If already in new format but has old ended lifecycle, migrate it
    if (p.lifecycle === 'ended') {
      const activeStates = p.activeStates || [];
      return {
        ...p,
        lifecycle: 'active',
        activeStates: activeStates.includes('ended') ? activeStates : [...activeStates, 'ended'],
        participants,
        pendingParticipants,
        location,
      } as Platform;
    }

    // If already in new format, return as-is
    if (p.lifecycle !== undefined && p.activeStates !== undefined) {
      return { ...p, participants, pendingParticipants, location } as Platform;
    }

    // Migrate old status field to new lifecycle + activeStates
    const oldStatus = p.status;
    let lifecycle: PlatformLifecycle;
    let activeStates: PlatformActiveState[];

    switch (oldStatus) {
      case 'pending':
        lifecycle = 'pending';
        activeStates = [];
        break;
      case 'recruiting':
        lifecycle = 'active';
        activeStates = ['recruiting'];
        break;
      case 'operating':
        lifecycle = 'active';
        activeStates = ['operating'];
        break;
      case 'ended':
        lifecycle = 'active';
        activeStates = ['ended'];
        break;
      default:
        lifecycle = 'active';
        activeStates = [];
    }

    return {
      ...p,
      lifecycle,
      activeStates,
      participants,
      pendingParticipants,
      location,
    };
  };

  // Load from Supabase on mount
  useEffect(() => {
    const platformsSeed: Platform[] = [
      {
        id: 'plat-1',
        title: '새벽기도 모임',
        scheduledDate: '2026-06-20',
        location: '본당 기도실',
        content: '매주 금요일 새벽 5시에 함께 모여 기도하는 모임입니다. 말씀 묵상과 중보기도를 중심으로 진행됩니다.',
        purpose: '기도 훈련과 영적 성장',
        other: '편안한 복장으로 참여 가능합니다.',
        lifecycle: 'active',
        activeStates: ['recruiting', 'operating'],
        proposedBy: 'user2',
        proposedByName: '박전도사',
        participants: ['user1', 'user3'],
        pendingParticipants: ['admin'],
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        approvedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'plat-2',
        title: '청년 성경공부 소그룹',
        scheduledDate: '2026-06-22',
        location: '교육관 302호',
        content: '로마서를 함께 공부하는 소그룹입니다. 매주 일요일 오후 2시에 진행됩니다. 성경 지식이 없어도 누구든 참여 가능합니다.',
        purpose: '말씀 훈련 및 소그룹 커뮤니티 형성',
        other: '성경책과 노트를 지참해주세요.',
        lifecycle: 'active',
        activeStates: ['recruiting'],
        proposedBy: 'user3',
        proposedByName: '최민준',
        participants: ['user1', 'user2', 'admin'],
        pendingParticipants: ['user3'],
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        approvedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'plat-3',
        title: '찬양팀 워십 리더십',
        scheduledDate: '2026-07-05',
        location: '예배실',
        content: '찬양 인도를 배우고 싶은 청년을 위한 플랫폼입니다. 기타, 건반, 드럼 등 악기 연주자 및 보컬 모집 중입니다.',
        purpose: '예배 사역자 양성',
        other: '악기 경험 없어도 지원 가능합니다.',
        lifecycle: 'active',
        activeStates: ['recruiting'],
        proposedBy: 'admin',
        proposedByName: '김목사',
        participants: ['user1'],
        pendingParticipants: ['user2', 'user3'],
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        approvedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'plat-4',
        title: '지역사회 봉사 플랫폼',
        scheduledDate: '2026-06-28',
        location: '교회 인근 경로당',
        content: '매월 마지막 주 토요일에 지역 어르신들을 위한 봉사 활동을 진행합니다. 식사 제공, 청소, 말벗 활동 등이 포함됩니다.',
        purpose: '지역사회 섬김과 전도',
        other: '봉사 확인서 발급 가능합니다.',
        lifecycle: 'active',
        activeStates: ['operating'],
        proposedBy: 'user2',
        proposedByName: '박전도사',
        participants: ['user1', 'user2', 'user3', 'admin'],
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        approvedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'plat-6',
        title: '청년 사진 & 영상 기록팀',
        scheduledDate: '2026-07-01',
        location: '교회 미디어실',
        content: '예배와 교회 행사를 사진·영상으로 기록하는 미디어 봉사팀입니다. 촬영 경험이 없어도 함께 배우며 성장할 수 있습니다. 스마트폰 촬영도 환영합니다.',
        purpose: '교회 기록 문화 형성 및 미디어 사역',
        other: '장비는 교회 지원 예정입니다.',
        lifecycle: 'pending',
        activeStates: [],
        proposedBy: '3',
        proposedByName: '이회원',
        participants: [],
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'plat-5',
        title: '청년 독서 클럽',
        scheduledDate: '2026-07-12',
        location: '카페 모임방',
        content: '한 달에 한 권, 신앙 서적 또는 고전 문학을 함께 읽고 나누는 모임입니다. 이번 달 도서: 《묵상하는 삶》',
        purpose: '독서 및 신앙 성장',
        other: '책은 개인 구매 또는 교회 비치본 이용 가능합니다.',
        lifecycle: 'pending',
        activeStates: [],
        proposedBy: 'user1',
        proposedByName: '이지수',
        participants: [],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    // 먼저 localStorage 캐시를 즉시 표시 (migration 포함)
    const cached = localStorage.getItem('platforms');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        const migrated = parsed.map(migratePlatform);
        setPlatforms(migrated);
        localStorage.setItem('platforms', JSON.stringify(migrated));
      } catch (err) {
        console.error('[PlatformContext] Failed to parse cached platforms:', err);
        localStorage.removeItem('platforms');
        setPlatforms(platformsSeed);
        localStorage.setItem('platforms', JSON.stringify(platformsSeed));
      }
    } else {
      setPlatforms(platformsSeed);
      localStorage.setItem('platforms', JSON.stringify(platformsSeed));
    }

    platformsApi.getAll()
      .then((data) => {
        const list = (data as any[]).map(migratePlatform);
        if (list.length > 0) {
          setPlatforms(list);
          localStorage.setItem('platforms', JSON.stringify(list));
        }
      })
      .catch((err) => {
        console.error('[PlatformContext] Failed to load platforms:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  // Helper: optimistic update + server sync
  const syncUpdate = async (
    optimisticFn: (prev: Platform[]) => Platform[],
    serverFn: () => Promise<any>,
  ) => {
    const next = optimisticFn(platforms);
    setPlatforms(next);
    localStorage.setItem('platforms', JSON.stringify(next));
    try {
      await serverFn();
    } catch (err) {
      // Supabase unavailable — keep local state, don't roll back
    }
  };

  const addPlatform = async (data: Omit<Platform, 'id' | 'createdAt' | 'participants' | 'lifecycle' | 'activeStates'>) => {
    const newPlatform: Platform = {
      ...data,
      id: `p${Date.now()}`,
      lifecycle: 'pending',
      activeStates: [],
      participants: [],
      createdAt: new Date().toISOString(),
    };
    await syncUpdate(
      (prev) => [newPlatform, ...prev],
      () => platformsApi.add(newPlatform),
    );
    // 캐시 동기화
    platformsApi.getAll().then((d) => {
      const migrated = (d as any[]).map(migratePlatform);
      localStorage.setItem('platforms', JSON.stringify(migrated));
    }).catch(() => {});
  };

  const updatePlatform = async (id: string, data: Partial<Platform>) => {
    await syncUpdate(
      (prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)),
      () => platformsApi.update(id, data),
    );
    platformsApi.getAll().then((d) => {
      const migrated = (d as any[]).map(migratePlatform);
      localStorage.setItem('platforms', JSON.stringify(migrated));
    }).catch(() => {});
  };

  const deletePlatform = async (id: string) => {
    await syncUpdate(
      (prev) => prev.filter((p) => p.id !== id),
      () => platformsApi.remove(id),
    );
    platformsApi.getAll().then((d) => {
      const migrated = (d as any[]).map(migratePlatform);
      localStorage.setItem('platforms', JSON.stringify(migrated));
    }).catch(() => {});
  };

  const approvePlatform = async (id: string) => {
    const updates = { lifecycle: 'active' as PlatformLifecycle, activeStates: ['recruiting' as PlatformActiveState], approvedAt: new Date().toISOString(), rejectedReason: undefined };
    await syncUpdate(
      (prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      () => platformsApi.update(id, updates),
    );
    platformsApi.getAll().then((d) => {
      const migrated = (d as any[]).map(migratePlatform);
      localStorage.setItem('platforms', JSON.stringify(migrated));
    }).catch(() => {});
  };

  const rejectPlatform = async (id: string, reason: string) => {
    const updates = { rejectedReason: reason };
    await syncUpdate(
      (prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      () => platformsApi.update(id, updates),
    );
    platformsApi.getAll().then((d) => {
      const migrated = (d as any[]).map(migratePlatform);
      localStorage.setItem('platforms', JSON.stringify(migrated));
    }).catch(() => {});
  };

  const joinPlatform = async (id: string, userId: string) => {
    const platform = platforms.find((p) => p.id === id);
    if (!platform) return;
    const currentParticipants = platform.participants || [];
    const currentPending = platform.pendingParticipants || [];
    if (currentParticipants.includes(userId) || currentPending.includes(userId)) return;
    const pendingParticipants = [...currentPending, userId];
    await syncUpdate(
      (prev) => prev.map((p) => (p.id === id ? { ...p, pendingParticipants } : p)),
      () => platformsApi.update(id, { pendingParticipants }),
    );
    platformsApi.getAll().then((d) => {
      const migrated = (d as any[]).map(migratePlatform);
      localStorage.setItem('platforms', JSON.stringify(migrated));
    }).catch(() => {});
  };

  const approveParticipant = async (id: string, userId: string) => {
    const platform = platforms.find((p) => p.id === id);
    if (!platform) return;
    const pendingParticipants = (platform.pendingParticipants || []).filter((uid) => uid !== userId);
    const participants = [...(platform.participants || []), userId];
    await syncUpdate(
      (prev) => prev.map((p) => (p.id === id ? { ...p, participants, pendingParticipants } : p)),
      () => platformsApi.update(id, { participants, pendingParticipants }),
    );
    platformsApi.getAll().then((d) => {
      const migrated = (d as any[]).map(migratePlatform);
      localStorage.setItem('platforms', JSON.stringify(migrated));
    }).catch(() => {});
  };

  const rejectParticipant = async (id: string, userId: string) => {
    const platform = platforms.find((p) => p.id === id);
    if (!platform) return;
    const pendingParticipants = (platform.pendingParticipants || []).filter((uid) => uid !== userId);
    await syncUpdate(
      (prev) => prev.map((p) => (p.id === id ? { ...p, pendingParticipants } : p)),
      () => platformsApi.update(id, { pendingParticipants }),
    );
    platformsApi.getAll().then((d) => {
      const migrated = (d as any[]).map(migratePlatform);
      localStorage.setItem('platforms', JSON.stringify(migrated));
    }).catch(() => {});
  };

  const removeParticipant = async (id: string, userId: string) => {
    const platform = platforms.find((p) => p.id === id);
    if (!platform) return;
    const participants = (platform.participants || []).filter((uid) => uid !== userId);
    await syncUpdate(
      (prev) => prev.map((p) => (p.id === id ? { ...p, participants } : p)),
      () => platformsApi.update(id, { participants }),
    );
    platformsApi.getAll().then((d) => {
      const migrated = (d as any[]).map(migratePlatform);
      localStorage.setItem('platforms', JSON.stringify(migrated));
    }).catch(() => {});
  };

  const leavePlatform = async (id: string, userId: string) => {
    const platform = platforms.find((p) => p.id === id);
    if (!platform) return;
    const currentParticipants = platform.participants || [];
    const participants = currentParticipants.filter((uid) => uid !== userId);
    await syncUpdate(
      (prev) => prev.map((p) => (p.id === id ? { ...p, participants } : p)),
      () => platformsApi.update(id, { participants }),
    );
    platformsApi.getAll().then((d) => {
      const migrated = (d as any[]).map(migratePlatform);
      localStorage.setItem('platforms', JSON.stringify(migrated));
    }).catch(() => {});
  };

  const toggleActiveState = async (id: string, state: PlatformActiveState) => {
    await syncUpdate(
      (prev) => prev.map((p) => {
        if (p.id !== id || p.lifecycle !== 'active') return p;
        const currentStates = p.activeStates || [];
        const activeStates = currentStates.includes(state)
          ? currentStates.filter(s => s !== state)
          : [...currentStates, state];
        return { ...p, activeStates };
      }),
      async () => {
        const platform = platforms.find(p => p.id === id);
        if (platform && platform.lifecycle === 'active') {
          const currentStates = platform.activeStates || [];
          const activeStates = currentStates.includes(state)
            ? currentStates.filter(s => s !== state)
            : [...currentStates, state];
          await platformsApi.update(id, { activeStates });
        }
      },
    );
    platformsApi.getAll().then((d) => {
      const migrated = (d as any[]).map(migratePlatform);
      localStorage.setItem('platforms', JSON.stringify(migrated));
    }).catch(() => {});
  };

  const getPlatformById = (id: string) => platforms.find((p) => p.id === id);

  return (
    <PlatformContext.Provider
      value={{
        platforms,
        loading,
        addPlatform,
        updatePlatform,
        deletePlatform,
        approvePlatform,
        rejectPlatform,
        joinPlatform,
        leavePlatform,
        approveParticipant,
        rejectParticipant,
        removeParticipant,
        toggleActiveState,
        getPlatformById,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatform() {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error('usePlatform must be used within PlatformProvider');
  return ctx;
}