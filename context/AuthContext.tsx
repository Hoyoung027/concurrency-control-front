'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface AuthState {
  nickname: string | null;
  character: string | null;
  accessToken: string | null;
}

interface AuthContextValue extends AuthState {
  isAuthenticated: boolean;
  login: (nickname: string, character: string, accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    nickname: null,
    character: null,
    accessToken: null,
  });

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const nickname = localStorage.getItem('nickname');
    const character = localStorage.getItem('character');
    if (accessToken && nickname && character) {
      setAuth({ accessToken, nickname, character });
    }
  }, []);

  const login = (
    nickname: string,
    character: string,
    accessToken: string,
    refreshToken: string
  ) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('nickname', nickname);
    localStorage.setItem('character', character);
    setAuth({ nickname, character, accessToken });
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('nickname');
    localStorage.removeItem('character');
    setAuth({ nickname: null, character: null, accessToken: null });
  };

  return (
    <AuthContext.Provider
      value={{ ...auth, isAuthenticated: !!auth.accessToken, login, logout }}
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
