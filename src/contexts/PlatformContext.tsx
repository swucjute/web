import React, { createContext, useContext } from 'react';
import type { Platform, PlatformOperatingStatusAction, PlatformSaveRequest } from '../types';
import { platformsApi } from '../utils/api';
import { useCrudQuery } from '../hooks/useCrudQuery';

interface PlatformContextType {
  platforms: Platform[];
  loading: boolean;
  addPlatform: (data: PlatformSaveRequest) => Promise<void>;
  updatePlatform: (id: string, data: PlatformSaveRequest) => Promise<void>;
  deletePlatform: (id: string) => Promise<void>;
  approvePlatform: (id: string) => Promise<void>;
  rejectPlatform: (id: string) => Promise<void>;
  changeOperatingStatus: (id: string, action: PlatformOperatingStatusAction) => Promise<void>;
}

/** 운영상태 변경 액션이 로컬 상태에 미치는 효과 (낙관적 업데이트용, 백엔드 엔티티 메서드와 1:1 대응). */
function applyOperatingStatusAction(platform: Platform, action: PlatformOperatingStatusAction): Platform {
  switch (action) {
    case 'START_RECRUITING':
      return { ...platform, recruiting: true, closedStatus: null };
    case 'STOP_RECRUITING':
      return { ...platform, recruiting: false };
    case 'START_OPERATING':
      return { ...platform, operating: true, closedStatus: null };
    case 'STOP_OPERATING':
      return { ...platform, operating: false };
    case 'FINISH':
      return { ...platform, recruiting: false, operating: false, closedStatus: 'FINISHED' };
    case 'CANCEL':
      return { ...platform, recruiting: false, operating: false, closedStatus: 'CANCELLED' };
  }
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  const {
    data: platforms,
    isLoading: loading,
    optimisticMutate,
  } = useCrudQuery<Platform>('platforms', async () => (await platformsApi.getAll()).content);

  const addPlatform = async (data: PlatformSaveRequest) => {
    // 서버가 만든 실제 id를 알아야 목록에 정확히 반영되므로, 낙관적 추가 없이 성공 후 재조회한다.
    await optimisticMutate((prev) => prev, () => platformsApi.add(data));
  };

  const updatePlatform = async (id: string, data: PlatformSaveRequest) => {
    await optimisticMutate(
      (prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)),
      () => platformsApi.update(id, data),
    );
  };

  const deletePlatform = async (id: string) => {
    await optimisticMutate((prev) => prev.filter((p) => p.id !== id), () => platformsApi.remove(id));
  };

  const approvePlatform = async (id: string) => {
    // 백엔드가 승인 시 모집을 자동으로 시작하므로, 낙관적 업데이트에도 recruiting: true를 반영한다.
    await optimisticMutate(
      (prev) => prev.map((p) => (p.id === id ? { ...p, approvalStatus: 'APPROVED', recruiting: true } : p)),
      () => platformsApi.changeApprovalStatus(id, 'APPROVED'),
    );
  };

  const rejectPlatform = async (id: string) => {
    await optimisticMutate(
      (prev) => prev.map((p) => (p.id === id ? { ...p, approvalStatus: 'REJECTED' } : p)),
      () => platformsApi.changeApprovalStatus(id, 'REJECTED'),
    );
  };

  const changeOperatingStatus = async (id: string, action: PlatformOperatingStatusAction) => {
    await optimisticMutate(
      (prev) => prev.map((p) => (p.id === id ? applyOperatingStatusAction(p, action) : p)),
      () => platformsApi.changeOperatingStatus(id, action),
    );
  };

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
        changeOperatingStatus,
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
