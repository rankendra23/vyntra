export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AccountPrivacy = 'public' | 'private';

export interface Profile {
  id: string; // matches auth.users.id
  username: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  website: string | null;
  is_private: boolean;
  is_verified?: boolean;
  created_at: string;
  updated_at: string;
  // Computed / aggregated fields
  followers_count?: number;
  following_count?: number;
  posts_count?: number;
  is_following?: boolean;
  is_pending_request?: boolean;
  is_blocked?: boolean;
}

export type MediaType = 'image' | 'video';

export interface PostMedia {
  id: string;
  post_id: string;
  media_url: string;
  media_type: MediaType;
  aspect_ratio?: number;
  display_order: number;
  created_at: string;
}

export interface Post {
  id: string;
  author_id: string;
  caption: string;
  location: string | null;
  created_at: string;
  updated_at: string;
  // Joins
  author?: Profile;
  media: PostMedia[];
  // Interactions
  likes_count: number;
  comments_count: number;
  has_liked?: boolean;
  has_saved?: boolean;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  parent_id?: string | null;
  created_at: string;
  updated_at: string;
  author?: Profile;
  replies?: Comment[];
}

export interface Like {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
  user?: Profile;
}

export interface SavedPost {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
  post?: Post;
}

export type FollowStatus = 'accepted' | 'pending';

export interface Follow {
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface FollowRequest {
  id: string;
  requester_id: string;
  target_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  requester?: Profile;
}

export interface Story {
  id: string;
  author_id: string;
  media_url: string;
  media_type: MediaType;
  caption?: string | null;
  created_at: string;
  expires_at: string;
  author?: Profile;
  has_viewed?: boolean;
  views_count?: number;
}

export interface StoryView {
  id: string;
  story_id: string;
  viewer_id: string;
  created_at: string;
  viewer?: Profile;
}

export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  last_message?: Message;
  members: Profile[];
  unread_count?: number;
}

export interface ConversationMember {
  id: string;
  conversation_id: string;
  user_id: string;
  joined_at: string;
  last_read_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  media_url?: string | null;
  created_at: string;
  sender?: Profile;
  is_read?: boolean;
}

export type NotificationType =
  | 'like'
  | 'comment'
  | 'follow'
  | 'follow_request'
  | 'follow_accept'
  | 'mention';

export interface Notification {
  id: string;
  recipient_id: string;
  actor_id: string;
  type: NotificationType;
  post_id?: string | null;
  comment_id?: string | null;
  is_read: boolean;
  created_at: string;
  actor?: Profile;
  post?: Post;
}

export interface Block {
  blocker_id: string;
  blocked_id: string;
  created_at: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  target_type: 'post' | 'user' | 'comment';
  target_id: string;
  reason: string;
  details?: string | null;
  status: 'pending' | 'reviewed' | 'resolved';
  created_at: string;
}

export interface Hashtag {
  id: string;
  name: string;
  posts_count: number;
}
