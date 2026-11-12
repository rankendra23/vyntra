import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockStore, INITIAL_PROFILES } from '../lib/mockStore';
import { Profile } from '../types';

export const authService = {
  async signUp(params: {
    email: string;
    password: string;
    username: string;
    full_name: string;
    is_private?: boolean;
  }): Promise<{ user: any; profile: Profile }> {
    if (!isSupabaseConfigured) {
      // Demo preview mode registration
      const newUserId = `usr_${Date.now()}`;
      const newProfile: Profile = {
        id: newUserId,
        username: params.username,
        full_name: params.full_name,
        avatar_url: null,
        bio: '',
        website: null,
        is_private: !!params.is_private,
        followers_count: 0,
        following_count: 0,
        posts_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      mockStore.updateProfile(newUserId, newProfile);
      const user = { id: newUserId, email: params.email };
      localStorage.setItem('vyntra_active_user', JSON.stringify({ user, profile: newProfile }));
      return { user, profile: newProfile };
    }

    // Real Supabase Auth SignUp
    const { data, error } = await supabase.auth.signUp({
      email: params.email,
      password: params.password,
      options: {
        data: {
          username: params.username,
          full_name: params.full_name,
          is_private: params.is_private || false,
        },
      },
    });

    if (error) throw error;
    if (!data.user) throw new Error('User creation failed');

    // Fetch the profile that was created by trigger
    const profile = await this.getProfile(data.user.id);
    return { user: data.user, profile: profile || ({} as Profile) };
  },

  async signIn(email: string, password: string): Promise<{ user: any; profile: Profile }> {
    if (!isSupabaseConfigured) {
      // Allow sign-in with any credentials in demo mode, or check mock
      const existing = localStorage.getItem('vyntra_active_user');
      let profile: Profile;
      let user: any;

      if (existing) {
        const parsed = JSON.parse(existing);
        user = parsed.user;
        profile = mockStore.getProfileById(user.id) || parsed.profile;
      } else {
        // Default to Elena or a demo user
        profile = INITIAL_PROFILES[0];
        user = { id: profile.id, email };
      }

      const session = { user, profile };
      localStorage.setItem('vyntra_active_user', JSON.stringify(session));
      return session;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('Sign in failed');

    const profile = await this.getProfile(data.user.id);
    return { user: data.user, profile: profile || ({} as Profile) };
  },

  async signOut(): Promise<void> {
    if (!isSupabaseConfigured) {
      localStorage.removeItem('vyntra_active_user');
      return;
    }
    await supabase.auth.signOut();
  },

  async getSession(): Promise<{ user: any; profile: Profile | null } | null> {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('vyntra_active_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const freshProfile = mockStore.getProfileById(parsed.user.id) || parsed.profile;
          return { user: parsed.user, profile: freshProfile };
        } catch {
          return null;
        }
      }
      // Return default logged in demo user for immediate seamless interaction
      const defaultProfile = INITIAL_PROFILES[0];
      const defaultUser = { id: defaultProfile.id, email: 'elena@example.com' };
      localStorage.setItem(
        'vyntra_active_user',
        JSON.stringify({ user: defaultUser, profile: defaultProfile })
      );
      return { user: defaultUser, profile: defaultProfile };
    }

    const { data } = await supabase.auth.getSession();
    if (!data.session?.user) return null;

    const profile = await this.getProfile(data.session.user.id);
    return { user: data.session.user, profile };
  },

  async getProfile(userId: string): Promise<Profile | null> {
    if (!isSupabaseConfigured) {
      return mockStore.getProfileById(userId) || null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) return null;
    return data as Profile;
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    if (!isSupabaseConfigured) {
      const updated = mockStore.updateProfile(userId, updates);
      // update active session
      const stored = localStorage.getItem('vyntra_active_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.user.id === userId) {
          parsed.profile = updated;
          localStorage.setItem('vyntra_active_user', JSON.stringify(parsed));
        }
      }
      return updated;
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  },

  async resetPassword(email: string): Promise<void> {
    if (!isSupabaseConfigured) {
      await new Promise((r) => setTimeout(r, 400));
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  },
};
