import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from '../types';
import { membersApi } from '../utils/api';
import { useCrudQuery } from '../hooks/useCrudQuery';
import { clearTokens, logoutRequest, type MemberMeResponse, type MemberRole } from '../utils/authClient';

const MEMBER_ROLE_MAP: Record<MemberRole, UserRole> = {
  ADMIN: 'admin',
  MANAGER: 'admin',
  LEADER: 'leader',
  USER: 'member',
};

function memberToUser(member: MemberMeResponse): User {
  return {
    id: String(member.memberId),
    name: member.profile?.name ?? '',
    email: member.email ?? '',
    role: MEMBER_ROLE_MAP[member.role],
    phone: member.profile?.phoneNumber ?? '',
    birthDate: member.profile?.birthDate ?? '',
    joinDate: '',
    department: member.profile?.department ?? '',
    position: member.profile?.position ?? undefined,
    bank: member.profile?.bankName ?? undefined,
    accountNumber: member.profile?.accountNumber ?? undefined,
    isActive: member.status === 'ACTIVE',
    isPending: member.status !== 'ACTIVE',
    authSource: 'kakao',
  };
}

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  loading: boolean;
  login: (email: string, password: string) => boolean;
  loginWithMember: (member: MemberMeResponse) => void;
  logout: () => void;
  isAdmin: () => boolean;
  isLeader: () => boolean;
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  updateUser: (id: string, user: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fallback defaults for offline/error situations
const defaultUsers: User[] = [
  {
    id: '1',
    name: '관리자',
    email: 'admin@church.com',
    password: 'admin123',
    role: 'admin',
    phone: '010-1234-5678',
    birthDate: '1990-01-01',
    joinDate: '2020-01-01',
    department: '청년부',
    position: '총무',
    isActive: true,
  },
  {
    id: '2',
    name: '김리더',
    email: 'leader@church.com',
    password: 'leader123',
    role: 'leader',
    phone: '010-2345-6789',
    birthDate: '1992-05-15',
    joinDate: '2021-03-10',
    department: '청년부',
    position: '소그룹 리더',
    isActive: true,
  },
  {
    id: '3',
    name: '이회원',
    email: 'member@church.com',
    password: 'member123',
    role: 'member',
    phone: '010-3456-7890',
    birthDate: '1995-08-20',
    joinDate: '2022-06-15',
    department: '청년부',
    isActive: true,
  },
  {
    id: '4',
    name: '홍길동',
    email: 'pending@church.com',
    password: 'pending123',
    role: 'member',
    phone: '010-9999-0000',
    birthDate: '2000-01-01',
    joinDate: '2026-07-15',
    department: '청년부',
    isActive: false,
    isPending: true,
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? (JSON.parse(saved) as User) : null;
  });

  const {
    data: users,
    isLoading: loading,
    optimisticMutate,
  } = useCrudQuery<User>('members', async () => {
    try {
      return (await membersApi.getAll()) as User[];
    } catch (err) {
      console.error('[AuthContext] Failed to load members from Supabase, using defaults:', err);
      return defaultUsers;
    }
  });

  // Refresh currentUser from latest users data (keeps profile in sync)
  useEffect(() => {
    if (currentUser && users.length > 0) {
      const refreshed = users.find((u) => u.id === currentUser.id);
      if (refreshed && JSON.stringify(refreshed) !== JSON.stringify(currentUser)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentUser(refreshed);
        localStorage.setItem('currentUser', JSON.stringify(refreshed));
      }
    }
  }, [users]);

  const login = (email: string, password: string): boolean => {
    const user = users.find(
      (u) => u.email === email && u.password === password && (u.isActive || u.isPending)
    );
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('accessToken', 'mock-token-' + user.id);
      return true;
    }
    return false;
  };

  const loginWithMember = (member: MemberMeResponse) => {
    const user = memberToUser(member);
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const logout = () => {
    const token = localStorage.getItem('accessToken');
    const isRealSession = !!token && !token.startsWith('mock-token-');

    setCurrentUser(null);
    localStorage.removeItem('currentUser');

    // logoutRequest() reads the refreshToken before clearing it, so only
    // call clearTokens() directly for the mock session (no server call needed).
    if (isRealSession) {
      logoutRequest().catch((err) => console.error('[AuthContext] Failed to log out:', err));
    } else {
      clearTokens();
    }
  };

  const isAdmin = () => currentUser?.role === 'admin';
  const isLeader = () => currentUser?.role === 'admin' || currentUser?.role === 'leader';

  const addUser = async (userData: Omit<User, 'id'>) => {
    const newUser: User = { ...userData, id: Date.now().toString() };
    await optimisticMutate(
      (prev) => [...prev, newUser],
      () => membersApi.add(newUser),
    );
  };

  const updateUser = async (id: string, userData: Partial<User>) => {
    if (currentUser?.id === id) {
      const updated = { ...currentUser, ...userData };
      setCurrentUser(updated);
      localStorage.setItem('currentUser', JSON.stringify(updated));
    }
    await optimisticMutate(
      (prev) => prev.map((u) => (u.id === id ? { ...u, ...userData } : u)),
      () => membersApi.update(id, userData),
    );
  };

  const deleteUser = async (id: string) => {
    await optimisticMutate(
      (prev) => prev.map((u) => (u.id === id ? { ...u, isActive: false } : u)),
      () => membersApi.remove(id),
    );
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        loading,
        login,
        loginWithMember,
        logout,
        isAdmin,
        isLeader,
        addUser,
        updateUser,
        deleteUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
