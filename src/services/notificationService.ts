import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockStore } from '../lib/mockStore';
import { Notification } from '../types';

export const notificationService = {
  async getNotifications(userId: string): Promise<Notification[]> {
    if (!isSupabaseConfigured) {
      return mockStore.getNotifications(userId);
    }

    const { data, error } = await supabase
      .from('notifications')
      .select(`
        *,
        actor:profiles(*),
        post:posts(
          id,
          caption,
          media:post_media(media_url)
        )
      `)
      .eq('recipient_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async markAsRead(userId: string): Promise<void> {
    if (!isSupabaseConfigured) {
      mockStore.markNotificationsAsRead(userId);
      return;
    }

    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('recipient_id', userId)
      .eq('is_read', false);
  },
};
