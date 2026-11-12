import { Profile, Post, Comment, Story, Notification, Message, Conversation, FollowRequest } from '../types';

export const INITIAL_PROFILES: Profile[] = [
  {
    id: 'usr_elena',
    username: 'elena_creative',
    full_name: 'Elena Rostova',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&auto=format&fit=crop&q=80',
    bio: 'Architectural photographer & visual designer ✨ Capturing shadows & modern spaces in Tokyo & Berlin.',
    website: 'https://elenarostova.design',
    is_private: false,
    is_verified: true,
    followers_count: 1420,
    following_count: 310,
    posts_count: 3,
    is_following: true,
    created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'usr_marcus',
    username: 'marcus_dev',
    full_name: 'Marcus Chen',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80',
    bio: 'Full-stack engineer & coffee aficionado ☕ Building open-source web tooling with React & TypeScript.',
    website: 'https://github.com/marcuschen',
    is_private: false,
    is_verified: true,
    followers_count: 890,
    following_count: 420,
    posts_count: 2,
    is_following: false,
    created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'usr_sophia',
    username: 'sophia_wander',
    full_name: 'Sophia Laurent',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80',
    bio: 'Alpine adventures & Nordic travel journals 🏔️ Finding quiet places in a busy world.',
    website: 'https://nordicwanders.com',
    is_private: false,
    is_verified: false,
    followers_count: 2340,
    following_count: 180,
    posts_count: 1,
    is_following: true,
    created_at: new Date(Date.now() - 45 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'usr_alex',
    username: 'alex_sound',
    full_name: 'Alex Rivera',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&auto=format&fit=crop&q=80',
    bio: 'Sound engineer & modular synth builder 🎛️ Exploring analog soundscapes.',
    website: 'https://soundcloud.com/alexrivera',
    is_private: false,
    is_verified: false,
    followers_count: 512,
    following_count: 240,
    posts_count: 1,
    is_following: false,
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'usr_clara',
    username: 'clara_private',
    full_name: 'Clara Vance',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=250&auto=format&fit=crop&q=80',
    bio: 'Private journal & close friends only 🌿 Follow request required.',
    website: null,
    is_private: true,
    is_verified: false,
    followers_count: 85,
    following_count: 90,
    posts_count: 1,
    is_following: false,
    is_pending_request: false,
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post_1',
    author_id: 'usr_elena',
    caption: 'Golden hour symmetry in the heart of Shibuya. The light reflects endlessly across the glass facades. #architecture #tokyo #minimalism #urbanphotography',
    location: 'Tokyo, Japan',
    likes_count: 128,
    comments_count: 2,
    has_liked: false,
    has_saved: false,
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    media: [
      {
        id: 'med_1a',
        post_id: 'post_1',
        media_url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1080&auto=format&fit=crop&q=80',
        media_type: 'image',
        aspect_ratio: 1,
        display_order: 0,
        created_at: new Date().toISOString(),
      },
      {
        id: 'med_1b',
        post_id: 'post_1',
        media_url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=1080&auto=format&fit=crop&q=80',
        media_type: 'image',
        aspect_ratio: 1,
        display_order: 1,
        created_at: new Date().toISOString(),
      },
    ],
  },
  {
    id: 'post_2',
    author_id: 'usr_marcus',
    caption: 'Shipped the new dark mode design system today! Super excited about the contrast ratios and accessibility improvements. #webdev #typescript #designsystem',
    location: 'San Francisco, CA',
    likes_count: 94,
    comments_count: 1,
    has_liked: true,
    has_saved: true,
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 3600000).toISOString(),
    media: [
      {
        id: 'med_2a',
        post_id: 'post_2',
        media_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1080&auto=format&fit=crop&q=80',
        media_type: 'image',
        aspect_ratio: 1,
        display_order: 0,
        created_at: new Date().toISOString(),
      },
    ],
  },
  {
    id: 'post_3',
    author_id: 'usr_sophia',
    caption: 'First snowfall in the Dolomites. The silence here early in the morning is unlike anything else. Swipe to see the frozen lake cabin. #travel #dolomites #winter #mountains',
    location: 'Dolomites, Italy',
    likes_count: 342,
    comments_count: 4,
    has_liked: false,
    has_saved: false,
    created_at: new Date(Date.now() - 9 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 9 * 3600000).toISOString(),
    media: [
      {
        id: 'med_3a',
        post_id: 'post_3',
        media_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1080&auto=format&fit=crop&q=80',
        media_type: 'image',
        aspect_ratio: 1,
        display_order: 0,
        created_at: new Date().toISOString(),
      },
      {
        id: 'med_3b',
        post_id: 'post_3',
        media_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1080&auto=format&fit=crop&q=80',
        media_type: 'image',
        aspect_ratio: 1,
        display_order: 1,
        created_at: new Date().toISOString(),
      },
    ],
  },
  {
    id: 'post_4',
    author_id: 'usr_alex',
    caption: 'Late night patch cables and ambient drones. Sometimes the best sounds come from accidental feedback loops. #sounddesign #synth #musicproduction',
    location: 'Berlin, Germany',
    likes_count: 57,
    comments_count: 0,
    has_liked: false,
    has_saved: false,
    created_at: new Date(Date.now() - 14 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 14 * 3600000).toISOString(),
    media: [
      {
        id: 'med_4a',
        post_id: 'post_4',
        media_url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1080&auto=format&fit=crop&q=80',
        media_type: 'image',
        aspect_ratio: 1,
        display_order: 0,
        created_at: new Date().toISOString(),
      },
    ],
  },
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'com_1',
    post_id: 'post_1',
    author_id: 'usr_marcus',
    content: 'Incredible perspective Elena! The reflection in the second shot is perfection.',
    created_at: new Date(Date.now() - 1 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 3600000).toISOString(),
  },
  {
    id: 'com_2',
    post_id: 'post_1',
    author_id: 'usr_sophia',
    content: 'Adding this spot to my next itinerary! Gorgeous work.',
    created_at: new Date(Date.now() - 30 * 60000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: 'com_3',
    post_id: 'post_2',
    author_id: 'usr_elena',
    content: 'The contrast looks so clean! Can’t wait to try it.',
    created_at: new Date(Date.now() - 4 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 3600000).toISOString(),
  },
];

export const INITIAL_STORIES: Story[] = [
  {
    id: 'str_1',
    author_id: 'usr_elena',
    media_url: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=1080&auto=format&fit=crop&q=80',
    media_type: 'image',
    caption: 'Coffee break in Ginza ☕',
    created_at: new Date(Date.now() - 3 * 3600000).toISOString(),
    expires_at: new Date(Date.now() + 21 * 3600000).toISOString(),
    has_viewed: false,
    views_count: 42,
  },
  {
    id: 'str_2',
    author_id: 'usr_marcus',
    media_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1080&auto=format&fit=crop&q=80',
    media_type: 'image',
    caption: 'Terminal flow 💻',
    created_at: new Date(Date.now() - 4 * 3600000).toISOString(),
    expires_at: new Date(Date.now() + 20 * 3600000).toISOString(),
    has_viewed: false,
    views_count: 18,
  },
  {
    id: 'str_3',
    author_id: 'usr_sophia',
    media_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1080&auto=format&fit=crop&q=80',
    media_type: 'image',
    caption: 'Trail views today 🌲',
    created_at: new Date(Date.now() - 1 * 3600000).toISOString(),
    expires_at: new Date(Date.now() + 23 * 3600000).toISOString(),
    has_viewed: true,
    views_count: 89,
  },
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_1',
    recipient_id: 'usr_current',
    actor_id: 'usr_elena',
    type: 'like',
    post_id: 'post_2',
    is_read: false,
    created_at: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: 'notif_2',
    recipient_id: 'usr_current',
    actor_id: 'usr_marcus',
    type: 'comment',
    post_id: 'post_1',
    comment_id: 'com_1',
    is_read: false,
    created_at: new Date(Date.now() - 1 * 3600000).toISOString(),
  },
  {
    id: 'notif_3',
    recipient_id: 'usr_current',
    actor_id: 'usr_sophia',
    type: 'follow',
    is_read: true,
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
];

// Helper to get or init mock state in localStorage
class MockDataStore {
  private STORAGE_KEY = 'vyntra_mock_db';

  private getState() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }

    const initial = {
      profiles: INITIAL_PROFILES,
      posts: INITIAL_POSTS,
      comments: INITIAL_COMMENTS,
      stories: INITIAL_STORIES,
      notifications: INITIAL_NOTIFICATIONS,
      followRequests: [] as FollowRequest[],
      savedPostIds: ['post_2'] as string[],
      blockedUserIds: [] as string[],
      conversations: [
        {
          id: 'conv_1',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date(Date.now() - 1800000).toISOString(),
          members: [INITIAL_PROFILES[0]],
          unread_count: 1,
          last_message: {
            id: 'msg_1',
            conversation_id: 'conv_1',
            sender_id: 'usr_elena',
            content: 'Hey! Loved the shots from Tokyo. Are you planning another trip soon?',
            created_at: new Date(Date.now() - 1800000).toISOString(),
          },
        },
      ],
      messages: [
        {
          id: 'msg_0',
          conversation_id: 'conv_1',
          sender_id: 'usr_current',
          content: 'Hey Elena! Big fan of your architectural work.',
          created_at: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 'msg_1',
          conversation_id: 'conv_1',
          sender_id: 'usr_elena',
          content: 'Hey! Loved the shots from Tokyo. Are you planning another trip soon?',
          created_at: new Date(Date.now() - 1800000).toISOString(),
        },
      ] as Message[],
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  private saveState(state: any) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
  }

  public getProfiles(): Profile[] {
    return this.getState().profiles;
  }

  public getProfileByUsername(username: string): Profile | undefined {
    return this.getProfiles().find(
      (p) => p.username.toLowerCase() === username.toLowerCase()
    );
  }

  public getProfileById(id: string): Profile | undefined {
    return this.getProfiles().find((p) => p.id === id);
  }

  public updateProfile(id: string, updates: Partial<Profile>): Profile {
    const state = this.getState();
    const index = state.profiles.findIndex((p: Profile) => p.id === id);
    if (index >= 0) {
      state.profiles[index] = { ...state.profiles[index], ...updates, updated_at: new Date().toISOString() };
      this.saveState(state);
      return state.profiles[index];
    }
    const newProfile: Profile = {
      id,
      username: updates.username || 'user',
      full_name: updates.full_name || 'User',
      avatar_url: updates.avatar_url || null,
      bio: updates.bio || '',
      website: updates.website || null,
      is_private: updates.is_private ?? false,
      followers_count: 0,
      following_count: 0,
      posts_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...updates,
    };
    state.profiles.push(newProfile);
    this.saveState(state);
    return newProfile;
  }

  public getPosts(): Post[] {
    const state = this.getState();
    const profiles = this.getProfiles();
    const savedIds = new Set(state.savedPostIds || []);

    return state.posts
      .map((post: Post) => ({
        ...post,
        author: profiles.find((p) => p.id === post.author_id),
        has_saved: savedIds.has(post.id),
      }))
      .sort(
        (a: Post, b: Post) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  }

  public getPostById(id: string): Post | undefined {
    return this.getPosts().find((p) => p.id === id);
  }

  public createPost(post: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'likes_count' | 'comments_count'>): Post {
    const state = this.getState();
    const id = `post_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const newPost: Post = {
      ...post,
      id,
      likes_count: 0,
      comments_count: 0,
      has_liked: false,
      has_saved: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    state.posts.unshift(newPost);
    // increment author posts_count
    const author = state.profiles.find((p: Profile) => p.id === post.author_id);
    if (author) author.posts_count = (author.posts_count || 0) + 1;
    this.saveState(state);
    return newPost;
  }

  public deletePost(id: string, authorId: string): boolean {
    const state = this.getState();
    const prevLen = state.posts.length;
    state.posts = state.posts.filter((p: Post) => !(p.id === id && p.author_id === authorId));
    if (state.posts.length < prevLen) {
      const author = state.profiles.find((p: Profile) => p.id === authorId);
      if (author && author.posts_count && author.posts_count > 0) {
        author.posts_count -= 1;
      }
      this.saveState(state);
      return true;
    }
    return false;
  }

  public toggleLike(postId: string, userId: string): boolean {
    const state = this.getState();
    const post = state.posts.find((p: Post) => p.id === postId);
    if (!post) return false;

    if (post.has_liked) {
      post.has_liked = false;
      post.likes_count = Math.max(0, post.likes_count - 1);
    } else {
      post.has_liked = true;
      post.likes_count += 1;
      // create notification
      if (post.author_id !== userId) {
        state.notifications.unshift({
          id: `notif_${Date.now()}`,
          recipient_id: post.author_id,
          actor_id: userId,
          type: 'like',
          post_id: postId,
          is_read: false,
          created_at: new Date().toISOString(),
        });
      }
    }
    this.saveState(state);
    return post.has_liked;
  }

  public toggleSave(postId: string): boolean {
    const state = this.getState();
    state.savedPostIds = state.savedPostIds || [];
    const index = state.savedPostIds.indexOf(postId);
    let saved = false;
    if (index >= 0) {
      state.savedPostIds.splice(index, 1);
    } else {
      state.savedPostIds.push(postId);
      saved = true;
    }
    this.saveState(state);
    return saved;
  }

  public getSavedPosts(): Post[] {
    const state = this.getState();
    const savedIds = new Set(state.savedPostIds || []);
    return this.getPosts().filter((p) => savedIds.has(p.id));
  }

  public getComments(postId: string): Comment[] {
    const state = this.getState();
    const profiles = this.getProfiles();
    return (state.comments || [])
      .filter((c: Comment) => c.post_id === postId)
      .map((c: Comment) => ({
        ...c,
        author: profiles.find((p) => p.id === c.author_id),
      }))
      .sort((a: Comment, b: Comment) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }

  public addComment(postId: string, authorId: string, content: string): Comment {
    const state = this.getState();
    const id = `com_${Date.now()}`;
    const newComment: Comment = {
      id,
      post_id: postId,
      author_id: authorId,
      content,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    state.comments = state.comments || [];
    state.comments.push(newComment);

    const post = state.posts.find((p: Post) => p.id === postId);
    if (post) {
      post.comments_count = (post.comments_count || 0) + 1;
      if (post.author_id !== authorId) {
        state.notifications.unshift({
          id: `notif_${Date.now()}`,
          recipient_id: post.author_id,
          actor_id: authorId,
          type: 'comment',
          post_id: postId,
          comment_id: id,
          is_read: false,
          created_at: new Date().toISOString(),
        });
      }
    }
    this.saveState(state);
    return {
      ...newComment,
      author: this.getProfileById(authorId),
    };
  }

  public deleteComment(commentId: string, userId: string): boolean {
    const state = this.getState();
    const comment = (state.comments || []).find((c: Comment) => c.id === commentId);
    if (!comment) return false;

    // Allowed if comment author or post owner
    const post = state.posts.find((p: Post) => p.id === comment.post_id);
    if (comment.author_id !== userId && post?.author_id !== userId) {
      return false;
    }

    state.comments = state.comments.filter((c: Comment) => c.id !== commentId);
    if (post && post.comments_count > 0) {
      post.comments_count -= 1;
    }
    this.saveState(state);
    return true;
  }

  public toggleFollow(currentUserId: string, targetUserId: string): { isFollowing: boolean; isPending: boolean } {
    const state = this.getState();
    const target = state.profiles.find((p: Profile) => p.id === targetUserId);
    const currentUser = state.profiles.find((p: Profile) => p.id === currentUserId);
    if (!target) return { isFollowing: false, isPending: false };

    // If target is private and not currently following
    if (target.is_private && !target.is_following) {
      if (target.is_pending_request) {
        // Cancel pending request
        target.is_pending_request = false;
        state.followRequests = (state.followRequests || []).filter(
          (r: FollowRequest) => !(r.requester_id === currentUserId && r.target_id === targetUserId)
        );
        this.saveState(state);
        return { isFollowing: false, isPending: false };
      } else {
        // Create pending request
        target.is_pending_request = true;
        state.followRequests = state.followRequests || [];
        state.followRequests.push({
          id: `req_${Date.now()}`,
          requester_id: currentUserId,
          target_id: targetUserId,
          status: 'pending',
          created_at: new Date().toISOString(),
        });
        state.notifications.unshift({
          id: `notif_${Date.now()}`,
          recipient_id: targetUserId,
          actor_id: currentUserId,
          type: 'follow_request',
          is_read: false,
          created_at: new Date().toISOString(),
        });
        this.saveState(state);
        return { isFollowing: false, isPending: true };
      }
    }

    if (target.is_following) {
      target.is_following = false;
      target.followers_count = Math.max(0, (target.followers_count || 1) - 1);
      if (currentUser) currentUser.following_count = Math.max(0, (currentUser.following_count || 1) - 1);
    } else {
      target.is_following = true;
      target.followers_count = (target.followers_count || 0) + 1;
      if (currentUser) currentUser.following_count = (currentUser.following_count || 0) + 1;
      state.notifications.unshift({
        id: `notif_${Date.now()}`,
        recipient_id: targetUserId,
        actor_id: currentUserId,
        type: 'follow',
        is_read: false,
        created_at: new Date().toISOString(),
      });
    }
    this.saveState(state);
    return { isFollowing: !!target.is_following, isPending: false };
  }

  public getFollowRequests(targetUserId: string): FollowRequest[] {
    const state = this.getState();
    const profiles = this.getProfiles();
    return (state.followRequests || [])
      .filter((r: FollowRequest) => r.target_id === targetUserId && r.status === 'pending')
      .map((r: FollowRequest) => ({
        ...r,
        requester: profiles.find((p) => p.id === r.requester_id),
      }));
  }

  public respondFollowRequest(requestId: string, accept: boolean): boolean {
    const state = this.getState();
    const req = (state.followRequests || []).find((r: FollowRequest) => r.id === requestId);
    if (!req) return false;

    req.status = accept ? 'accepted' : 'rejected';
    if (accept) {
      const requester = state.profiles.find((p: Profile) => p.id === req.requester_id);
      const target = state.profiles.find((p: Profile) => p.id === req.target_id);
      if (requester && target) {
        target.followers_count = (target.followers_count || 0) + 1;
        requester.following_count = (requester.following_count || 0) + 1;
        state.notifications.unshift({
          id: `notif_${Date.now()}`,
          recipient_id: req.requester_id,
          actor_id: req.target_id,
          type: 'follow_accept',
          is_read: false,
          created_at: new Date().toISOString(),
        });
      }
    }
    this.saveState(state);
    return true;
  }

  public getStories(): Story[] {
    const state = this.getState();
    const profiles = this.getProfiles();
    const now = new Date().getTime();
    // Filter stories that have not expired (< 24h)
    return (state.stories || [])
      .filter((s: Story) => new Date(s.expires_at).getTime() > now)
      .map((s: Story) => ({
        ...s,
        author: profiles.find((p) => p.id === s.author_id),
      }));
  }

  public addStory(story: Omit<Story, 'id' | 'created_at' | 'expires_at'>): Story {
    const state = this.getState();
    const id = `str_${Date.now()}`;
    const newStory: Story = {
      ...story,
      id,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 24 * 3600000).toISOString(),
      views_count: 0,
      has_viewed: false,
    };
    state.stories = state.stories || [];
    state.stories.unshift(newStory);
    this.saveState(state);
    return {
      ...newStory,
      author: this.getProfileById(story.author_id),
    };
  }

  public markStoryViewed(storyId: string): void {
    const state = this.getState();
    const story = (state.stories || []).find((s: Story) => s.id === storyId);
    if (story && !story.has_viewed) {
      story.has_viewed = true;
      story.views_count = (story.views_count || 0) + 1;
      this.saveState(state);
    }
  }

  public getNotifications(userId: string): Notification[] {
    const state = this.getState();
    const profiles = this.getProfiles();
    const posts = this.getPosts();
    return (state.notifications || [])
      .filter((n: Notification) => n.recipient_id === userId)
      .map((n: Notification) => ({
        ...n,
        actor: profiles.find((p) => p.id === n.actor_id),
        post: n.post_id ? posts.find((p) => p.id === n.post_id) : undefined,
      }))
      .sort((a: Notification, b: Notification) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public markNotificationsAsRead(userId: string): void {
    const state = this.getState();
    (state.notifications || []).forEach((n: Notification) => {
      if (n.recipient_id === userId) n.is_read = true;
    });
    this.saveState(state);
  }

  public getConversations(userId: string): Conversation[] {
    const state = this.getState();
    const profiles = this.getProfiles();
    return (state.conversations || []).map((conv: any) => ({
      ...conv,
      members: (conv.members || []).map((m: any) => profiles.find((p) => p.id === m.id) || m),
    }));
  }

  public getMessages(conversationId: string): Message[] {
    const state = this.getState();
    const profiles = this.getProfiles();
    return (state.messages || [])
      .filter((m: Message) => m.conversation_id === conversationId)
      .map((m: Message) => ({
        ...m,
        sender: profiles.find((p) => p.id === m.sender_id),
      }))
      .sort((a: Message, b: Message) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }

  public sendMessage(conversationId: string, senderId: string, content: string): Message {
    const state = this.getState();
    const msgId = `msg_${Date.now()}`;
    const newMsg: Message = {
      id: msgId,
      conversation_id: conversationId,
      sender_id: senderId,
      content,
      created_at: new Date().toISOString(),
    };
    state.messages = state.messages || [];
    state.messages.push(newMsg);

    const conv = (state.conversations || []).find((c: any) => c.id === conversationId);
    if (conv) {
      conv.last_message = newMsg;
      conv.updated_at = new Date().toISOString();
    }
    this.saveState(state);
    return {
      ...newMsg,
      sender: this.getProfileById(senderId),
    };
  }

  public blockUser(blockerId: string, blockedId: string): void {
    const state = this.getState();
    state.blockedUserIds = state.blockedUserIds || [];
    if (!state.blockedUserIds.includes(blockedId)) {
      state.blockedUserIds.push(blockedId);
    }
    // Also remove follow
    const target = (state.profiles || []).find((p: Profile) => p.id === blockedId);
    if (target) {
      target.is_following = false;
      target.is_blocked = true;
    }
    this.saveState(state);
  }

  public unblockUser(blockerId: string, blockedId: string): void {
    const state = this.getState();
    state.blockedUserIds = (state.blockedUserIds || []).filter((id: string) => id !== blockedId);
    const target = (state.profiles || []).find((p: Profile) => p.id === blockedId);
    if (target) {
      target.is_blocked = false;
    }
    this.saveState(state);
  }

  public reportContent(report: { reporterId: string; targetType: string; targetId: string; reason: string; details?: string }): void {
    const state = this.getState();
    state.reports = state.reports || [];
    state.reports.push({
      ...report,
      id: `rep_${Date.now()}`,
      status: 'pending',
      created_at: new Date().toISOString(),
    });
    this.saveState(state);
  }
}

export const mockStore = new MockDataStore();
