import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockStore } from '../lib/mockStore';
import { Story } from '../types';

export const storyService = {
  async getActiveStories(): Promise<Story[]> {
    if (!isSupabaseConfigured) {
      return mockStore.getStories();
    }

    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('stories')
      .select('*, author:profiles(*)')
      .gt('expires_at', now)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createStory(params: {
    authorId: string;
    mediaUrl: string;
    mediaType: 'image' | 'video';
    caption?: string;
  }): Promise<Story> {
    if (!isSupabaseConfigured) {
      return mockStore.addStory({
        author_id: params.authorId,
        media_url: params.mediaUrl,
        media_type: params.mediaType,
        caption: params.caption,
      });
    }

    const { data, error } = await supabase
      .from('stories')
      .insert({
        author_id: params.authorId,
        media_url: params.mediaUrl,
        media_type: params.mediaType,
        caption: params.caption || null,
      })
      .select('*, author:profiles(*)')
      .single();

    if (error) throw error;
    return data;
  },

  async markViewed(storyId: string, viewerId: string): Promise<void> {
    if (!isSupabaseConfigured) {
      mockStore.markStoryViewed(storyId);
      return;
    }

    await supabase
      .from('story_views')
      .upsert({ story_id: storyId, viewer_id: viewerId });
  },
};
