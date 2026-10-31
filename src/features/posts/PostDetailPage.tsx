import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PostCard } from '../feed/PostCard';
import { PostCardSkeleton } from '../../components/ui/Skeleton';
import { Button } from '../../components/ui/Button';
import { Post } from '../../types';
import { postService } from '../../services/postService';
import { useAuth } from '../auth/AuthContext';
import { ArrowLeft } from 'lucide-react';

export const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await postService.getPostById(id, user?.id);
        setPost(data);
      } catch (err) {
        console.error('Failed to load post:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, user]);

  return (
    <div className="w-full max-w-[520px] px-2 sm:px-4 py-4 space-y-4">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {loading ? (
        <PostCardSkeleton />
      ) : !post ? (
        <div className="text-center py-16 bg-white dark:bg-[#121214] border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8">
          <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-200 mb-1">
            Post not found
          </h3>
          <p className="text-xs text-neutral-500 mb-6">
            The link you followed may be broken or the post may have been removed.
          </p>
          <Button onClick={() => navigate('/')}>Back to Feed</Button>
        </div>
      ) : (
        <PostCard post={post} onPostDeleted={() => navigate('/')} />
      )}
    </div>
  );
};
