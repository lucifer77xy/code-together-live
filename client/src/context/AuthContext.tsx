'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';

export interface User {
  id: string;
  username: string;
  name: string;
  avatar?: string | null;
  bio?: string | null;
  streakDays: number;
  totalHours: number;
  totalProblems: number;
  duoId?: string | null;
}

export interface DuoPartner {
  id: string;
  name: string;
  username: string;
  avatar?: string | null;
  streakDays: number;
  totalHours: number;
}

export interface DuoInfo {
  id: string;
  code: string;
  status: string;
  coupleScore: number;
  streakDays: number;
  connectedAt: string;
  partner: DuoPartner | null;
}

interface AuthContextType {
  user: User | null;
  duo: DuoInfo | null;
  token: string | null;
  loading: boolean;
  loginWithToken: (token: string) => Promise<void>;
  devLogin: (username: 'maya_codes' | 'alex_dev') => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [duo, setDuo] = useState<DuoInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const data = await apiFetch('/auth/me');
      if (data.success) {
        setUser(data.user);
        setDuo(data.duo);
      }
    } catch (err) {
      console.error('Failed to load current user:', err);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      setDuo(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      refreshUser();
    } else {
      // Auto dev-login as Maya for zero-friction initial experience
      devLogin('maya_codes');
    }
  }, []);

  const loginWithToken = async (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    await refreshUser();
  };

  const devLogin = async (username: 'maya_codes' | 'alex_dev') => {
    setLoading(true);
    try {
      const data = await apiFetch('/auth/dev-login', {
        method: 'POST',
        body: JSON.stringify({ username }),
      });
      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        await refreshUser();
      }
    } catch (err) {
      console.error('Dev login failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setDuo(null);
  };

  return (
    <AuthContext.Provider value={{ user, duo, token, loading, loginWithToken, devLogin, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
