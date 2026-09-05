import React, { createContext, useContext } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { Platform, PlatformOperatingStatusAction, PlatformSaveRequest } from '../types';
import {
  useCreate1,
  useDelete1,
  useGetPlatforms,
  useUpdate1,
  useUpdateApprovalStatus,
  useUpdateOperatingStatus,
} from '../api/generated/platform/platform';
import { toPlatformsFromResponse } from '../api/platformAdapter';
import type { PlatformSaveRequest as GeneratedPlatformSaveRequest } from '../api/model';

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

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

const platformListParams = { page: 0, size: 100 } as const;

function toGeneratedRequest(data: PlatformSaveRequest): GeneratedPlatformSaveRequest {
  return {
    title: data.title,
    scheduleText: data.scheduleText ?? undefined,
    startsAt: data.startsAt ?? undefined,
    endsAt: data.endsAt ?? undefined,
    location: data.location ?? undefined,
    content: data.content ?? undefined,
    purpose: data.purpose ?? undefined,
    etc: data.etc ?? undefined,
    posterUrl: data.posterUrl ?? undefined,
  };
}

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const { data: platforms = [], isLoading: loading } = useGetPlatforms(platformListParams, {
    query: { select: toPlatformsFromResponse },
  });
  const createMutation = useCreate1();
  const updateMutation = useUpdate1();
  const deleteMutation = useDelete1();
  const approvalMutation = useUpdateApprovalStatus();
  const operatingMutation = useUpdateOperatingStatus();

  const invalidatePlatforms = () =>
    queryClient.invalidateQueries({
      predicate: (query) =>
        typeof query.queryKey[0] === 'string' && query.queryKey[0].startsWith('/api/v1/platforms'),
    });

  const addPlatform = async (data: PlatformSaveRequest) => {
    await createMutation.mutateAsync({ data: toGeneratedRequest(data) });
    await invalidatePlatforms();
  };

  const updatePlatform = async (id: string, data: PlatformSaveRequest) => {
    await updateMutation.mutateAsync({ platformId: Number(id), data: toGeneratedRequest(data) });
    await invalidatePlatforms();
  };

  const deletePlatform = async (id: string) => {
    await deleteMutation.mutateAsync({ platformId: Number(id) });
    await invalidatePlatforms();
  };

  const approvePlatform = async (id: string) => {
    await approvalMutation.mutateAsync({
      platformId: Number(id),
      data: { approvalStatus: 'APPROVED' },
    });
    await invalidatePlatforms();
  };

  const rejectPlatform = async (id: string) => {
    await approvalMutation.mutateAsync({
      platformId: Number(id),
      data: { approvalStatus: 'REJECTED' },
    });
    await invalidatePlatforms();
  };

  const changeOperatingStatus = async (id: string, action: PlatformOperatingStatusAction) => {
    await operatingMutation.mutateAsync({ platformId: Number(id), data: { action } });
    await invalidatePlatforms();
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
