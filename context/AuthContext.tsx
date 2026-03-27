'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface AuthState {
  nickname: string | null;
  character: string | null;
}

interface AuthContextValue extends AuthState {
  isAuthenticated: boolean;
  login: (nickname: string, character: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    nickname: null,
    character: null,
  });

  useEffect(() => {
    const nickname = localStorage.getItem('nickname');
    const character = localStorage.getItem('character');
    if (nickname && character) {
      setAuth({ nickname, character });
    }
  }, []);

  const login = (nickname: string, character: string) => {
    localStorage.setItem('nickname', nickname);
    localStorage.setItem('character', character);
    setAuth({ nickname, character });
  };

  const logout = () => {
    localStorage.removeItem('nickname');
    localStorage.removeItem('character');
    setAuth({ nickname: null, character: null });
  };

  return (
    <AuthContext.Provider
      value={{ ...auth, isAuthenticated: !!auth.nickname, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
