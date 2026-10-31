import React, { useState, useEffect, useCallback } from 'react';
import { StoriesBar } from '../stories/StoriesBar';
import { PostCard } from './PostCard';
import { RightSidebar } from './RightSidebar';
import { PostCardSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { Post } from '../../types';
import { postService } from '../../services/postService';
import { useAuth } from '../auth/AuthContext';
import { ImagePlus, RefreshCw } from 'lucide-react';

export const FeedPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  const fetchPosts = useCallback(async () => {
    try {
      const data = await postService.getFeedPosts(user?.id);
      setPosts(data);
    } catch (err) {
      console.error('Failed to load posts:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPosts();

    const handleNewPost = () => {
      fetchPosts();
    };

    window.addEventListener('socialsphere:post-created', handleNewPost);
    return () => {
      window.removeEventListener('socialsphere:post-created', handleNewPost);
    };
  }, [fetchPosts]);

  const handlePostDeleted = (deletedId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== deletedId));
  };

  return (
    <div className="flex justify-center w-full max-w-5xl px-2 sm:px-4 py-4">
      {/* Center Feed Stream */}
      <div className="w-full max-w-[500px] flex flex-col">
        {/* Stories Bar */}
        <StoriesBar />

        {/* Posts Stream */}
        {loading ? (
          <div className="space-y-4">
            <PostCardSkeleton />
            <PostCardSkeleton />
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white dark:bg-[#121214] border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6">
            <EmptyState
              icon={ImagePlus}
              title="Welcome to your feed"
              description="Follow users or create your first post to start filling your SocialSphere feed."
            />
          </div>
        ) : (
          <div className="space-y-1">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onPostDeleted={handlePostDeleted}
              />
            ))}
          </div>
        )}
      </div>

      {/* Right Desktop Suggestions Sidebar */}
      <RightSidebar />
    </div>
  );
};
