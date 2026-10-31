import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockStore } from '../lib/mockStore';
import { Post, Comment, PostMedia } from '../types';

export const postService = {
  async getFeedPosts(userId?: string): Promise<Post[]> {
    if (!isSupabaseConfigured) {
      return mockStore.getPosts();
    }

    // Real Supabase: fetch posts with author, media, and counts
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        id,
        author_id,
        caption,
        location,
        created_at,
        updated_at,
        author:profiles(*),
        media:post_media(*),
        likes(user_id),
        comments(id)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!posts) return [];

    return posts.map((p: any) => {
      const hasLiked = userId ? p.likes?.some((l: any) => l.user_id === userId) : false;
      return {
        id: p.id,
        author_id: p.author_id,
        caption: p.caption,
        location: p.location,
        created_at: p.created_at,
        updated_at: p.updated_at,
        author: p.author,
        media: (p.media || []).sort((a: any, b: any) => a.display_order - b.display_order),
        likes_count: p.likes?.length || 0,
        comments_count: p.comments?.length || 0,
        has_liked: hasLiked,
      };
    });
  },

  async getPostById(postId: string, userId?: string): Promise<Post | null> {
    if (!isSupabaseConfigured) {
      return mockStore.getPostById(postId) || null;
    }

    const { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        author_id,
        caption,
        location,
        created_at,
        updated_at,
        author:profiles(*),
        media:post_media(*),
        likes(user_id),
        comments(id)
      `)
      .eq('id', postId)
      .single();

    if (error || !data) return null;

    const hasLiked = userId ? data.likes?.some((l: any) => l.user_id === userId) : false;
    return {
      id: data.id,
      author_id: data.author_id,
      caption: data.caption,
      location: data.location,
      created_at: data.created_at,
      updated_at: data.updated_at,
      author: data.author as any,
      media: (data.media || []).sort((a: any, b: any) => a.display_order - b.display_order),
      likes_count: data.likes?.length || 0,
      comments_count: data.comments?.length || 0,
      has_liked: hasLiked,
    };
  },

  async createPost(params: {
    authorId: string;
    caption: string;
    location?: string;
    media: Array<{ url: string; mediaType: 'image' | 'video' }>;
  }): Promise<Post> {
    if (!isSupabaseConfigured) {
      const postMedia: PostMedia[] = params.media.map((m, idx) => ({
        id: `med_${Date.now()}_${idx}`,
        post_id: '',
        media_url: m.url,
        media_type: m.mediaType,
        display_order: idx,
        created_at: new Date().toISOString(),
      }));

      return mockStore.createPost({
        author_id: params.authorId,
        caption: params.caption,
        location: params.location || null,
        media: postMedia,
      });
    }

    // 1. Insert post record
    const { data: post, error: postErr } = await supabase
      .from('posts')
      .insert({
        author_id: params.authorId,
        caption: params.caption,
        location: params.location || null,
      })
      .select(`*, author:profiles(*)`)
      .single();

    if (postErr || !post) throw postErr || new Error('Failed to create post');

    // 2. Insert post_media
    const mediaToInsert = params.media.map((m, index) => ({
      post_id: post.id,
      media_url: m.url,
      media_type: m.mediaType,
      display_order: index,
    }));

    const { data: insertedMedia, error: mediaErr } = await supabase
      .from('post_media')
      .insert(mediaToInsert)
      .select();

    if (mediaErr) throw mediaErr;

    return {
      ...post,
      media: insertedMedia || [],
      likes_count: 0,
      comments_count: 0,
      has_liked: false,
      has_saved: false,
    };
  },

  async deletePost(postId: string, authorId: string): Promise<boolean> {
    if (!isSupabaseConfigured) {
      return mockStore.deletePost(postId, authorId);
    }

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)
      .eq('author_id', authorId);

    if (error) throw error;
    return true;
  },

  async toggleLike(postId: string, userId: string): Promise<boolean> {
    if (!isSupabaseConfigured) {
      return mockStore.toggleLike(postId, userId);
    }

    // Check if like exists
    const { data: existing } = await supabase
      .from('likes')
      .select('post_id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);
      if (error) throw error;
      return false;
    } else {
      const { error } = await supabase
        .from('likes')
        .insert({ post_id: postId, user_id: userId });
      if (error) throw error;
      return true;
    }
  },

  async toggleSave(postId: string, userId: string): Promise<boolean> {
    if (!isSupabaseConfigured) {
      return mockStore.toggleSave(postId);
    }

    const { data: existing } = await supabase
      .from('saved_posts')
      .select('post_id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('saved_posts')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);
      if (error) throw error;
      return false;
    } else {
      const { error } = await supabase
        .from('saved_posts')
        .insert({ post_id: postId, user_id: userId });
      if (error) throw error;
      return true;
    }
  },

  async getSavedPosts(userId: string): Promise<Post[]> {
    if (!isSupabaseConfigured) {
      return mockStore.getSavedPosts();
    }

    const { data, error } = await supabase
      .from('saved_posts')
      .select(`
        post:posts(
          id,
          author_id,
          caption,
          location,
          created_at,
          updated_at,
          author:profiles(*),
          media:post_media(*),
          likes(user_id),
          comments(id)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map((row: any) => ({
      ...row.post,
      has_saved: true,
      likes_count: row.post.likes?.length || 0,
      comments_count: row.post.comments?.length || 0,
    }));
  },

  async getComments(postId: string): Promise<Comment[]> {
    if (!isSupabaseConfigured) {
      return mockStore.getComments(postId);
    }

    const { data, error } = await supabase
      .from('comments')
      .select(`*, author:profiles(*)`)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async addComment(postId: string, authorId: string, content: string): Promise<Comment> {
    if (!isSupabaseConfigured) {
      return mockStore.addComment(postId, authorId, content);
    }

    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        author_id: authorId,
        content: content.trim(),
      })
      .select(`*, author:profiles(*)`)
      .single();

    if (error) throw error;
    return data;
  },

  async deleteComment(commentId: string, userId: string): Promise<boolean> {
    if (!isSupabaseConfigured) {
      return mockStore.deleteComment(commentId, userId);
    }

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) throw error;
    return true;
  },
};
