import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authService } from '../../services/authService';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { Profile } from '../../types';

interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (params: {
    email: string;
    password: string;
    username: string;
    full_name: string;
    is_private?: boolean;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<Profile>;
  refreshProfile: () => Promise<void>;
  isSupabaseLive: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const initAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      const session = await authService.getSession();
      if (session) {
        setUser(session.user);
        setProfile(session.profile);
      } else {
        setUser(null);
        setProfile(null);
      }
    } catch (err) {
      console.error('Failed to initialize auth:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();

    if (isSupabaseConfigured) {
      const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          const p = await authService.getProfile(session.user.id);
          setProfile(p);
        } else {
          setUser(null);
          setProfile(null);
        }
      });

      return () => {
        listener.subscription.unsubscribe();
      };
    }
  }, [initAuth]);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const session = await authService.signIn(email, password);
      setUser(session.user);
      setProfile(session.profile);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (params: {
    email: string;
    password: string;
    username: string;
    full_name: string;
    is_private?: boolean;
  }) => {
    setIsLoading(true);
    try {
      const session = await authService.signUp(params);
      setUser(session.user);
      setProfile(session.profile);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error('Not authenticated');
    const updated = await authService.updateProfile(user.id, updates);
    setProfile(updated);
    return updated;
  };

  const refreshProfile = async () => {
    if (!user) return;
    const fresh = await authService.getProfile(user.id);
    if (fresh) setProfile(fresh);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        refreshProfile,
        isSupabaseLive: isSupabaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
