import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Platform, PlatformStatus } from '../types';
import { platformsApi } from '../utils/api';

interface PlatformContextType {
  platforms: Platform[];
  loading: boolean;
  addPlatform: (p: Omit<Platform, 'id' | 'createdAt' | 'participants' | 'status'>) => Promise<void>;
  updatePlatform: (id: string, data: Partial<Platform>) => Promise<void>;
  deletePlatform: (id: string) => Promise<void>;
  approvePlatform: (id: string) => Promise<void>;
  rejectPlatform: (id: string, reason: string) => Promise<void>;
  joinPlatform: (id: string, userId: string) => Promise<void>;
  leavePlatform: (id: string, userId: string) => Promise<void>;
  changeStatus: (id: string, status: PlatformStatus) => Promise<void>;
  getPlatformById: (id: string) => Platform | undefined;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from Supabase on mount
  useEffect(() => {
    platformsApi.getAll()
      .then((data) => setPlatforms(data as Platform[]))
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
    const prev = platforms;
    setPlatforms(optimisticFn(prev));
    try {
      await serverFn();
    } catch (err) {
      console.error('[PlatformContext] sync failed, rolling back:', err);
      setPlatforms(prev);
    }
  };

  const addPlatform = async (data: Omit<Platform, 'id' | 'createdAt' | 'participants' | 'status'>) => {
    const newPlatform: Platform = {
      ...data,
      id: `p${Date.now()}`,
      status: 'pending',
      participants: [],
      createdAt: new Date().toISOString(),
    };
    await syncUpdate(
      (prev) => [newPlatform, ...prev],
      () => platformsApi.add(newPlatform),
    );
  };

  const updatePlatform = async (id: string, data: Partial<Platform>) => {
    await syncUpdate(
      (prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)),
      () => platformsApi.update(id, data),
    );
  };

  const deletePlatform = async (id: string) => {
    await syncUpdate(
      (prev) => prev.filter((p) => p.id !== id),
      () => platformsApi.remove(id),
    );
  };

  const approvePlatform = async (id: string) => {
    const updates = { status: 'recruiting' as PlatformStatus, approvedAt: new Date().toISOString(), rejectedReason: undefined };
    await syncUpdate(
      (prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      () => platformsApi.update(id, updates),
    );
  };

  const rejectPlatform = async (id: string, reason: string) => {
    const updates = { rejectedReason: reason };
    await syncUpdate(
      (prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      () => platformsApi.update(id, updates),
    );
  };

  const joinPlatform = async (id: string, userId: string) => {
    const platform = platforms.find((p) => p.id === id);
    if (!platform || platform.participants.includes(userId)) return;
    const participants = [...platform.participants, userId];
    await syncUpdate(
      (prev) => prev.map((p) => (p.id === id ? { ...p, participants } : p)),
      () => platformsApi.update(id, { participants }),
    );
  };

  const leavePlatform = async (id: string, userId: string) => {
    const platform = platforms.find((p) => p.id === id);
    if (!platform) return;
    const participants = platform.participants.filter((uid) => uid !== userId);
    await syncUpdate(
      (prev) => prev.map((p) => (p.id === id ? { ...p, participants } : p)),
      () => platformsApi.update(id, { participants }),
    );
  };

  const changeStatus = async (id: string, status: PlatformStatus) => {
    await syncUpdate(
      (prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)),
      () => platformsApi.update(id, { status }),
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
        changeStatus,
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
