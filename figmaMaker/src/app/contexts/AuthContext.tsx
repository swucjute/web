import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { membersApi } from '../utils/api';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  loading: boolean;
  login: (email: string, password: string) => boolean;
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
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(defaultUsers); // start with defaults so login works immediately
  const [loading, setLoading] = useState(true);

  // Load users from Supabase on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    membersApi.getAll()
      .then((data) => {
        setUsers(data as User[]);
      })
      .catch((err) => {
        console.error('[AuthContext] Failed to load members from Supabase, using defaults:', err);
        setUsers(defaultUsers);
      })
      .finally(() => setLoading(false));
  }, []);

  // Refresh currentUser from latest users data (keeps profile in sync)
  useEffect(() => {
    if (currentUser && users.length > 0) {
      const refreshed = users.find((u) => u.id === currentUser.id);
      if (refreshed && JSON.stringify(refreshed) !== JSON.stringify(currentUser)) {
        setCurrentUser(refreshed);
        localStorage.setItem('currentUser', JSON.stringify(refreshed));
      }
    }
  }, [users]);

  const login = (email: string, password: string): boolean => {
    const user = users.find((u) => u.email === email && u.password === password && u.isActive);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const isAdmin = () => currentUser?.role === 'admin';
  const isLeader = () => currentUser?.role === 'admin' || currentUser?.role === 'leader';

  const addUser = async (userData: Omit<User, 'id'>) => {
    const newUser: User = { ...userData, id: Date.now().toString() };
    // Optimistic update
    setUsers((prev) => [...prev, newUser]);
    try {
      await membersApi.add(newUser);
    } catch (err) {
      console.error('[AuthContext] addUser failed:', err);
      // Rollback
      setUsers((prev) => prev.filter((u) => u.id !== newUser.id));
    }
  };

  const updateUser = async (id: string, userData: Partial<User>) => {
    // Optimistic update
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...userData } : u)));
    if (currentUser?.id === id) {
      const updated = { ...currentUser, ...userData };
      setCurrentUser(updated);
      localStorage.setItem('currentUser', JSON.stringify(updated));
    }
    try {
      await membersApi.update(id, userData);
    } catch (err) {
      console.error('[AuthContext] updateUser failed:', err);
      // Reload from server on error
      membersApi.getAll().then((data) => setUsers(data as User[])).catch(() => {});
    }
  };

  const deleteUser = async (id: string) => {
    // Optimistic update (soft-delete)
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, isActive: false } : u)));
    try {
      await membersApi.remove(id);
    } catch (err) {
      console.error('[AuthContext] deleteUser failed:', err);
      membersApi.getAll().then((data) => setUsers(data as User[])).catch(() => {});
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        loading,
        login,
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}