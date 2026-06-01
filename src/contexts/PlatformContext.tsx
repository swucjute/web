import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Platform, PlatformLifecycle, PlatformActiveState } from '../types';
import { platformsApi } from '../utils/api';
import { mockPlatforms } from '../mocks/data';

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
  toggleActiveState: (id: string, state: PlatformActiveState) => Promise<void>;
  getPlatformById: (id: string) => Platform | undefined;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);

  // 구버전 데이터(status 필드) → 신버전(lifecycle + activeStates) 마이그레이션
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const migratePlatform = (p: any): Platform => {
    const participants = p.participants || [];
    const locations = [
      '교회 소그룹실', '청년부실', '본당', '카페 베들레헴',
      '야외 정원', '온라인 (Zoom)', '체육관', '세미나실',
    ];
    const location = p.location || locations[Math.floor(Math.random() * locations.length)];

    // 이미 신버전 포맷인 경우
    if (p.lifecycle !== undefined && p.activeStates !== undefined) {
      return { ...p, participants, location } as Platform;
    }

    // 구버전 status → lifecycle + activeStates 변환
    const oldStatus = p.status;
    let lifecycle: PlatformLifecycle;
    let activeStates: PlatformActiveState[];

    switch (oldStatus) {
      case 'pending':
        lifecycle = 'pending'; activeStates = []; break;
      case 'recruiting':
        lifecycle = 'active'; activeStates = ['recruiting']; break;
      case 'operating':
        lifecycle = 'active'; activeStates = ['operating']; break;
      case 'ended':
        lifecycle = 'active'; activeStates = ['ended']; break;
      default:
        lifecycle = 'active'; activeStates = [];
    }

    return { ...p, lifecycle, activeStates, participants, location };
  };

  useEffect(() => {
    // localStorage 캐시 즉시 표시 (없으면 mock 데이터로 초기화, 마이그레이션 포함)
    const cached = localStorage.getItem('platforms');
    if (cached) {
      try {
        const migrated = JSON.parse(cached).map(migratePlatform);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPlatforms(migrated);
        localStorage.setItem('platforms', JSON.stringify(migrated));
      } catch {
        localStorage.removeItem('platforms');
        setPlatforms(mockPlatforms);
      }
    } else {
      setPlatforms(mockPlatforms);
    }

    platformsApi.getAll()
      .then((data) => {
        const list = (data as unknown[]).map(migratePlatform);
        setPlatforms(list);
        localStorage.setItem('platforms', JSON.stringify(list));
      })
      .catch((err) => {
        console.error('[PlatformContext] Failed to load platforms:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const syncUpdate = async (
    optimisticFn: (prev: Platform[]) => Platform[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    serverFn: () => Promise<any>,
  ) => {
    const prev = platforms;
    setPlatforms(optimisticFn(prev));
    try {
      await serverFn();
    } catch (err) {
      console.error('[PlatformContext] sync failed, rolling back:', err);
      setPlatforms(prev);
    }
  };

  const refreshCache = () => {
    platformsApi.getAll()
      .then((d) => {
        const migrated = (d as unknown[]).map(migratePlatform);
        localStorage.setItem('platforms', JSON.stringify(migrated));
      })
      .catch(() => {});
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
    refreshCache();
  };

  const updatePlatform = async (id: string, data: Partial<Platform>) => {
    await syncUpdate(
      (prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)),
      () => platformsApi.update(id, data),
    );
    refreshCache();
  };

  const deletePlatform = async (id: string) => {
    await syncUpdate(
      (prev) => prev.filter((p) => p.id !== id),
      () => platformsApi.remove(id),
    );
    refreshCache();
  };

  const approvePlatform = async (id: string) => {
    const updates = {
      lifecycle: 'active' as PlatformLifecycle,
      activeStates: ['recruiting' as PlatformActiveState],
      approvedAt: new Date().toISOString(),
      rejectedReason: undefined,
    };
    await syncUpdate(
      (prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      () => platformsApi.update(id, updates),
    );
    refreshCache();
  };

  const rejectPlatform = async (id: string, reason: string) => {
    const updates = { rejectedReason: reason };
    await syncUpdate(
      (prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      () => platformsApi.update(id, updates),
    );
    refreshCache();
  };

  const joinPlatform = async (id: string, userId: string) => {
    const platform = platforms.find((p) => p.id === id);
    if (!platform) return;
    const currentParticipants = platform.participants || [];
    if (currentParticipants.includes(userId)) return;
    const participants = [...currentParticipants, userId];
    await syncUpdate(
      (prev) => prev.map((p) => (p.id === id ? { ...p, participants } : p)),
      () => platformsApi.update(id, { participants }),
    );
    refreshCache();
  };

  const leavePlatform = async (id: string, userId: string) => {
    const platform = platforms.find((p) => p.id === id);
    if (!platform) return;
    const participants = (platform.participants || []).filter((uid) => uid !== userId);
    await syncUpdate(
      (prev) => prev.map((p) => (p.id === id ? { ...p, participants } : p)),
      () => platformsApi.update(id, { participants }),
    );
    refreshCache();
  };

  const toggleActiveState = async (id: string, state: PlatformActiveState) => {
    await syncUpdate(
      (prev) => prev.map((p) => {
        if (p.id !== id || p.lifecycle !== 'active') return p;
        const currentStates = p.activeStates || [];
        const activeStates = currentStates.includes(state)
          ? currentStates.filter((s) => s !== state)
          : [...currentStates, state];
        return { ...p, activeStates };
      }),
      async () => {
        const platform = platforms.find((p) => p.id === id);
        if (platform && platform.lifecycle === 'active') {
          const currentStates = platform.activeStates || [];
          const activeStates = currentStates.includes(state)
            ? currentStates.filter((s) => s !== state)
            : [...currentStates, state];
          await platformsApi.update(id, { activeStates });
        }
      },
    );
    refreshCache();
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
        toggleActiveState,
        getPlatformById,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePlatform() {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error('usePlatform must be used within PlatformProvider');
  return ctx;
}
