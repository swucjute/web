import React, { createContext, useContext } from 'react';
import type { Platform, PlatformLifecycle, PlatformActiveState } from '../types';
import { platformsApi } from '../utils/api';
import { useCrudQuery } from '../hooks/useCrudQuery';

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

// 구버전 데이터(status 필드) → 신버전(lifecycle + activeStates) 마이그레이션
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function migratePlatform(p: any): Platform {
  const participants = p.participants || [];
  const pendingParticipants = p.pendingParticipants || [];
  const locations = [
    '교회 소그룹실', '청년부실', '본당', '카페 베들레헴',
    '야외 정원', '온라인 (Zoom)', '체육관', '세미나실',
  ];
  const location = p.location || locations[Math.floor(Math.random() * locations.length)];

  // 이미 신버전 포맷인 경우
  if (p.lifecycle !== undefined && p.activeStates !== undefined) {
    return { ...p, participants, pendingParticipants, location } as Platform;
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

  return { ...p, lifecycle, activeStates, participants, pendingParticipants, location };
}

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  const {
    data: platforms,
    isLoading: loading,
    optimisticMutate,
  } = useCrudQuery<Platform>('platforms', async () => {
    const data = (await platformsApi.getAll()) as unknown[];
    return data.map(migratePlatform);
  });

  const addPlatform = async (data: Omit<Platform, 'id' | 'createdAt' | 'participants' | 'lifecycle' | 'activeStates'>) => {
    const newPlatform: Platform = {
      ...data,
      id: `p${Date.now()}`,
      lifecycle: 'pending',
      activeStates: [],
      participants: [],
      createdAt: new Date().toISOString(),
    };
    await optimisticMutate(
      (prev) => [newPlatform, ...prev],
      () => platformsApi.add(newPlatform),
    );
  };

  const updatePlatform = async (id: string, data: Partial<Platform>) => {
    await optimisticMutate(
      (prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)),
      () => platformsApi.update(id, data),
    );
  };

  const deletePlatform = async (id: string) => {
    await optimisticMutate(
      (prev) => prev.filter((p) => p.id !== id),
      () => platformsApi.remove(id),
    );
  };

  const approvePlatform = async (id: string) => {
    const updates = {
      lifecycle: 'active' as PlatformLifecycle,
      activeStates: ['recruiting' as PlatformActiveState],
      approvedAt: new Date().toISOString(),
      rejectedReason: undefined,
    };
    await optimisticMutate(
      (prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      () => platformsApi.update(id, updates),
    );
  };

  const rejectPlatform = async (id: string, reason: string) => {
    const updates = { rejectedReason: reason };
    await optimisticMutate(
      (prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      () => platformsApi.update(id, updates),
    );
  };

  // 참여 신청 → 대기열에 등록 (승인 전까지는 participants에 들어가지 않음)
  const joinPlatform = async (id: string, userId: string) => {
    const platform = platforms.find((p) => p.id === id);
    if (!platform) return;
    const currentParticipants = platform.participants || [];
    const currentPending = platform.pendingParticipants || [];
    if (currentParticipants.includes(userId) || currentPending.includes(userId)) return;
    const pendingParticipants = [...currentPending, userId];
    await optimisticMutate(
      (prev) => prev.map((p) => (p.id === id ? { ...p, pendingParticipants } : p)),
      () => platformsApi.update(id, { pendingParticipants }),
    );
  };

  const approveParticipant = async (id: string, userId: string) => {
    const platform = platforms.find((p) => p.id === id);
    if (!platform) return;
    const pendingParticipants = (platform.pendingParticipants || []).filter((uid) => uid !== userId);
    const participants = [...(platform.participants || []), userId];
    await optimisticMutate(
      (prev) => prev.map((p) => (p.id === id ? { ...p, participants, pendingParticipants } : p)),
      () => platformsApi.update(id, { participants, pendingParticipants }),
    );
  };

  const rejectParticipant = async (id: string, userId: string) => {
    const platform = platforms.find((p) => p.id === id);
    if (!platform) return;
    const pendingParticipants = (platform.pendingParticipants || []).filter((uid) => uid !== userId);
    await optimisticMutate(
      (prev) => prev.map((p) => (p.id === id ? { ...p, pendingParticipants } : p)),
      () => platformsApi.update(id, { pendingParticipants }),
    );
  };

  const removeParticipant = async (id: string, userId: string) => {
    const platform = platforms.find((p) => p.id === id);
    if (!platform) return;
    const participants = (platform.participants || []).filter((uid) => uid !== userId);
    await optimisticMutate(
      (prev) => prev.map((p) => (p.id === id ? { ...p, participants } : p)),
      () => platformsApi.update(id, { participants }),
    );
  };

  const leavePlatform = async (id: string, userId: string) => {
    const platform = platforms.find((p) => p.id === id);
    if (!platform) return;
    const participants = (platform.participants || []).filter((uid) => uid !== userId);
    await optimisticMutate(
      (prev) => prev.map((p) => (p.id === id ? { ...p, participants } : p)),
      () => platformsApi.update(id, { participants }),
    );
  };

  const toggleActiveState = async (id: string, state: PlatformActiveState) => {
    const platform = platforms.find((p) => p.id === id);
    if (!platform || platform.lifecycle !== 'active') return;
    const currentStates = platform.activeStates || [];
    const activeStates = currentStates.includes(state)
      ? currentStates.filter((s) => s !== state)
      : [...currentStates, state];
    await optimisticMutate(
      (prev) => prev.map((p) => (p.id === id ? { ...p, activeStates } : p)),
      () => platformsApi.update(id, { activeStates }),
    );
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

// eslint-disable-next-line react-refresh/only-export-components
export function usePlatform() {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error('usePlatform must be used within PlatformProvider');
  return ctx;
}
