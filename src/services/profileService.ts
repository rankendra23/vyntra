import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockStore } from '../lib/mockStore';
import { Profile, FollowRequest } from '../types';

export const profileService = {
  async getProfileByUsername(username: string, currentUserId?: string): Promise<Profile | null> {
    if (!isSupabaseConfigured) {
      const p = mockStore.getProfileByUsername(username);
      if (!p) return null;
      return {
        ...p,
        is_following: currentUserId ? p.is_following : false,
      };
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .ilike('username', username)
      .maybeSingle();

    if (error || !profile) return null;

    // Fetch counts and relationship
    const [followersRes, followingRes, postsRes, followCheckRes] = await Promise.all([
      supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', profile.id),
      supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', profile.id),
      supabase.from('posts').select('*', { count: 'exact', head: true }).eq('author_id', profile.id),
      currentUserId
        ? supabase
            .from('follows')
            .select('*')
            .eq('follower_id', currentUserId)
            .eq('following_id', profile.id)
            .maybeSingle()
        : Promise.resolve({ data: null }),
    ]);

    return {
      ...profile,
      followers_count: followersRes.count || 0,
      following_count: followingRes.count || 0,
      posts_count: postsRes.count || 0,
      is_following: !!followCheckRes.data,
    };
  },

  async toggleFollow(
    currentUserId: string,
    targetUserId: string
  ): Promise<{ isFollowing: boolean; isPending: boolean }> {
    if (!isSupabaseConfigured) {
      return mockStore.toggleFollow(currentUserId, targetUserId);
    }

    // Check if target is private
    const { data: targetProfile } = await supabase
      .from('profiles')
      .select('is_private')
      .eq('id', targetUserId)
      .single();

    // Check existing follow
    const { data: existingFollow } = await supabase
      .from('follows')
      .select('*')
      .eq('follower_id', currentUserId)
      .eq('following_id', targetUserId)
      .maybeSingle();

    if (existingFollow) {
      // Unfollow
      await supabase
        .from('follows')
        .delete()
        .eq('follower_id', currentUserId)
        .eq('following_id', targetUserId);
      return { isFollowing: false, isPending: false };
    }

    if (targetProfile?.is_private) {
      // Check if pending request exists
      const { data: existingReq } = await supabase
        .from('follow_requests')
        .select('*')
        .eq('requester_id', currentUserId)
        .eq('target_id', targetUserId)
        .maybeSingle();

      if (existingReq) {
        // Cancel request
        await supabase
          .from('follow_requests')
          .delete()
          .eq('id', existingReq.id);
        return { isFollowing: false, isPending: false };
      } else {
        // Send request
        await supabase.from('follow_requests').insert({
          requester_id: currentUserId,
          target_id: targetUserId,
        });
        return { isFollowing: false, isPending: true };
      }
    }

    // Public account follow
    await supabase.from('follows').insert({
      follower_id: currentUserId,
      following_id: targetUserId,
    });

    return { isFollowing: true, isPending: false };
  },

  async getSuggestedUsers(currentUserId?: string): Promise<Profile[]> {
    if (!isSupabaseConfigured) {
      return mockStore.getProfiles().filter((p) => p.id !== currentUserId).slice(0, 5);
    }

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .neq('id', currentUserId || '')
      .limit(5);

    return data || [];
  },

  async searchProfiles(query: string): Promise<Profile[]> {
    if (!query.trim()) return [];

    if (!isSupabaseConfigured) {
      const q = query.toLowerCase();
      return mockStore
        .getProfiles()
        .filter(
          (p) =>
            p.username.toLowerCase().includes(q) ||
            p.full_name.toLowerCase().includes(q)
        );
    }

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
      .limit(10);

    return data || [];
  },

  async getFollowRequests(targetUserId: string): Promise<FollowRequest[]> {
    if (!isSupabaseConfigured) {
      return mockStore.getFollowRequests(targetUserId);
    }

    const { data } = await supabase
      .from('follow_requests')
      .select('*, requester:profiles(*)')
      .eq('target_id', targetUserId)
      .eq('status', 'pending');

    return data || [];
  },

  async respondFollowRequest(requestId: string, accept: boolean): Promise<void> {
    if (!isSupabaseConfigured) {
      mockStore.respondFollowRequest(requestId, accept);
      return;
    }

    if (accept) {
      const { data: req } = await supabase
        .from('follow_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (req) {
        await supabase.from('follows').insert({
          follower_id: req.requester_id,
          following_id: req.target_id,
        });
      }
    }

    await supabase
      .from('follow_requests')
      .update({ status: accept ? 'accepted' : 'rejected' })
      .eq('id', requestId);
  },

  async blockUser(currentUserId: string, targetUserId: string): Promise<void> {
    if (!isSupabaseConfigured) {
      mockStore.blockUser(currentUserId, targetUserId);
      return;
    }

    await supabase.from('blocks').insert({
      blocker_id: currentUserId,
      blocked_id: targetUserId,
    });
  },

  async unblockUser(currentUserId: string, targetUserId: string): Promise<void> {
    if (!isSupabaseConfigured) {
      mockStore.unblockUser(currentUserId, targetUserId);
      return;
    }

    await supabase
      .from('blocks')
      .delete()
      .eq('blocker_id', currentUserId)
      .eq('blocked_id', targetUserId);
  },

  async report(params: {
    reporterId: string;
    targetType: 'post' | 'user' | 'comment';
    targetId: string;
    reason: string;
    details?: string;
  }): Promise<void> {
    if (!isSupabaseConfigured) {
      mockStore.reportContent(params);
      return;
    }

    await supabase.from('reports').insert({
      reporter_id: params.reporterId,
      target_type: params.targetType,
      target_id: params.targetId,
      reason: params.reason,
      details: params.details || null,
    });
  },
};
