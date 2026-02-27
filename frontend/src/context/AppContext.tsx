import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AppUser, UserRole } from '../types';

interface AppContextType {
  user: AppUser | null;
  setUser: (user: AppUser) => void;
  clearUser: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const SESSION_KEY = 'polling_user';

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AppUser | null>(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const setUser = (u: AppUser) => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(u));
    setUserState(u);
  };

  const clearUser = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setUserState(null);
  };

  return <AppContext.Provider value={{ user, setUser, clearUser }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

export function generateStudentId(): string {
  return uuidv4();
}
