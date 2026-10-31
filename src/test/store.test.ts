import { describe, it, expect, beforeEach } from 'vitest';
import { mockStore, INITIAL_PROFILES } from '../lib/mockStore';

describe('Core Social Interactions & Store', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('retrieves initial seed profiles', () => {
    const profiles = mockStore.getProfiles();
    expect(profiles.length).toBeGreaterThanOrEqual(4);
    const elena = mockStore.getProfileByUsername('elena_creative');
    expect(elena).toBeDefined();
    expect(elena?.full_name).toBe('Elena Rostova');
  });

  it('creates and retrieves a new post', () => {
    const authorId = INITIAL_PROFILES[0].id;
    const newPost = mockStore.createPost({
      author_id: authorId,
      caption: 'Testing post creation with #vitest #react',
      location: 'Antigravity Studio',
      media: [
        {
          id: 'med_test_1',
          post_id: '',
          media_url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26',
          media_type: 'image',
          display_order: 0,
          created_at: new Date().toISOString(),
        },
      ],
    });

    expect(newPost.id).toBeDefined();
    expect(newPost.caption).toContain('#vitest');

    const posts = mockStore.getPosts();
    const retrieved = posts.find((p) => p.id === newPost.id);
    expect(retrieved).toBeDefined();
    expect(retrieved?.author?.username).toBe('elena_creative');
  });

  it('handles post like and unlike toggling', () => {
    const posts = mockStore.getPosts();
    const post = posts[0];
    const initialLikes = post.likes_count;

    // Like
    const liked = mockStore.toggleLike(post.id, 'user_tester');
    expect(liked).toBe(true);

    const postAfterLike = mockStore.getPostById(post.id);
    expect(postAfterLike?.likes_count).toBe(initialLikes + 1);

    // Unlike
    const unliked = mockStore.toggleLike(post.id, 'user_tester');
    expect(unliked).toBe(false);

    const postAfterUnlike = mockStore.getPostById(post.id);
    expect(postAfterUnlike?.likes_count).toBe(initialLikes);
  });

  it('handles saving and unsaving posts', () => {
    const posts = mockStore.getPosts();
    const post = posts[0];

    const saved = mockStore.toggleSave(post.id);
    expect(saved).toBe(true);

    const savedPosts = mockStore.getSavedPosts();
    expect(savedPosts.some((p) => p.id === post.id)).toBe(true);

    // Unsave
    const unsaved = mockStore.toggleSave(post.id);
    expect(unsaved).toBe(false);

    const savedPostsAfter = mockStore.getSavedPosts();
    expect(savedPostsAfter.some((p) => p.id === post.id)).toBe(false);
  });

  it('handles comments addition and deletion by authorized author', () => {
    const posts = mockStore.getPosts();
    const post = posts[0];

    const comment = mockStore.addComment(post.id, 'usr_marcus', 'Great shot!');
    expect(comment.id).toBeDefined();
    expect(comment.content).toBe('Great shot!');

    const comments = mockStore.getComments(post.id);
    expect(comments.some((c) => c.id === comment.id)).toBe(true);

    // Delete comment
    const deleted = mockStore.deleteComment(comment.id, 'usr_marcus');
    expect(deleted).toBe(true);

    const commentsAfter = mockStore.getComments(post.id);
    expect(commentsAfter.some((c) => c.id === comment.id)).toBe(false);
  });

  it('manages private account follow requests', () => {
    // Clara Vance is a private account
    const clara = mockStore.getProfileByUsername('clara_private');
    expect(clara).toBeDefined();
    expect(clara?.is_private).toBe(true);

    // Send follow request
    const requesterId = 'usr_marcus';
    const result = mockStore.toggleFollow(requesterId, clara!.id);
    expect(result.isPending).toBe(true);
    expect(result.isFollowing).toBe(false);

    // Clara receives request
    const requests = mockStore.getFollowRequests(clara!.id);
    expect(requests.length).toBeGreaterThan(0);
    const myRequest = requests.find((r) => r.requester_id === requesterId);
    expect(myRequest).toBeDefined();

    // Clara accepts
    const accepted = mockStore.respondFollowRequest(myRequest!.id, true);
    expect(accepted).toBe(true);

    const updatedClara = mockStore.getProfileById(clara!.id);
    expect(updatedClara?.followers_count).toBeGreaterThan(clara!.followers_count || 0);
  });

  it('manages blocking users', () => {
    const blockerId = 'usr_marcus';
    const targetId = 'usr_alex';

    mockStore.blockUser(blockerId, targetId);
    const target = mockStore.getProfileById(targetId);
    expect(target?.is_blocked).toBe(true);

    // Unblock
    mockStore.unblockUser(blockerId, targetId);
    const targetAfter = mockStore.getProfileById(targetId);
    expect(targetAfter?.is_blocked).toBe(false);
  });
});
