import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockStore } from '../lib/mockStore';
import { Conversation, Message } from '../types';

export const messageService = {
  async getConversations(userId: string): Promise<Conversation[]> {
    if (!isSupabaseConfigured) {
      return mockStore.getConversations(userId);
    }

    const { data, error } = await supabase
      .from('conversations')
      .select(`
        id,
        created_at,
        updated_at,
        members:conversation_members(
          user:profiles(*)
        ),
        messages:messages(
          id,
          content,
          sender_id,
          created_at
        )
      `)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    if (!data) return [];

    return data.map((conv: any) => {
      const sortedMsgs = (conv.messages || []).sort(
        (a: any, b: any) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      return {
        id: conv.id,
        created_at: conv.created_at,
        updated_at: conv.updated_at,
        members: (conv.members || []).map((m: any) => m.user),
        last_message: sortedMsgs[0],
      };
    });
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    if (!isSupabaseConfigured) {
      return mockStore.getMessages(conversationId);
    }

    const { data, error } = await supabase
      .from('messages')
      .select('*, sender:profiles(*)')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async sendMessage(
    conversationId: string,
    senderId: string,
    content: string
  ): Promise<Message> {
    if (!isSupabaseConfigured) {
      return mockStore.sendMessage(conversationId, senderId, content.trim());
    }

    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        content: content.trim(),
      })
      .select('*, sender:profiles(*)')
      .single();

    if (error) throw error;

    // update conversation updated_at
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    return data;
  },

  async startConversation(userId: string, targetUserId: string): Promise<string> {
    if (!isSupabaseConfigured) {
      // Find or create in mock
      const convs = mockStore.getConversations(userId);
      const existing = convs.find((c) =>
        c.members.some((m) => m.id === targetUserId)
      );
      if (existing) return existing.id;

      const newId = `conv_${Date.now()}`;
      const targetUser = mockStore.getProfileById(targetUserId);
      if (targetUser) {
        mockStore.getConversations(userId).push({
          id: newId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          members: [targetUser],
        });
      }
      return newId;
    }

    // Create conversation in Supabase
    const { data: conv, error: convErr } = await supabase
      .from('conversations')
      .insert({})
      .select()
      .single();

    if (convErr) throw convErr;

    // Add both members
    await supabase.from('conversation_members').insert([
      { conversation_id: conv.id, user_id: userId },
      { conversation_id: conv.id, user_id: targetUserId },
    ]);

    return conv.id;
  },
};
