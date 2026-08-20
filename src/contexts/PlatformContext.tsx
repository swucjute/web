import React, { createContext, useContext } from 'react';
import type { Platform, PlatformOperatingStatus, PlatformSaveRequest } from '../types';
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
  changeOperatingStatus: (id: string, status: PlatformOperatingStatus) => Promise<void>;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  const {
    data: platforms,
    isLoading: loading,
    optimisticMutate,
  } = useCrudQuery<Platform>('platforms', async () => {
    const page = await platformsApi.getAll();
    return page.content.map((item) => ({ ...item, id: String(item.platformId) }));
  });

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
    await optimisticMutate(
      (prev) => prev.map((p) => (p.id === id ? { ...p, approvalStatus: 'APPROVED' } : p)),
      () => platformsApi.changeApprovalStatus(id, 'APPROVED'),
    );
  };

  const rejectPlatform = async (id: string) => {
    await optimisticMutate(
      (prev) => prev.map((p) => (p.id === id ? { ...p, approvalStatus: 'REJECTED' } : p)),
      () => platformsApi.changeApprovalStatus(id, 'REJECTED'),
    );
  };

  /**
   * 운영상태만 바꾸는 API가 따로 없어서, 상세 정보를 먼저 조회해 나머지 필드는 그대로 두고
   * operatingStatus만 바꿔서 수정(PUT) API로 저장한다. 목록 데이터만으로 바로 PUT하면
   * content/purpose/etc(목록 응답엔 없는 필드)이 빈 값으로 덮어써지므로 주의.
   */
  const changeOperatingStatus = async (id: string, operatingStatus: PlatformOperatingStatus) => {
    const detail = await platformsApi.getById(id);
    const body: PlatformSaveRequest = {
      title: detail.title,
      scheduleText: detail.scheduleText,
      startsAt: detail.startsAt,
      endsAt: detail.endsAt,
      location: detail.location,
      content: detail.content,
      purpose: detail.purpose,
      etc: detail.etc,
      posterUrl: detail.posterUrl,
      operatingStatus,
    };
    await optimisticMutate(
      (prev) => prev.map((p) => (p.id === id ? { ...p, operatingStatus } : p)),
      () => platformsApi.update(id, body),
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
