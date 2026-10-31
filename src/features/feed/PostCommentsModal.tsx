import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, Trash2, MessageSquare, Loader2 } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Avatar } from '../../components/ui/Avatar';
import { Comment } from '../../types';
import { postService } from '../../services/postService';
import { useAuth } from '../auth/AuthContext';
import { useToast } from '../../hooks/useToast';
import { formatTimeAgo } from '../../lib/utils';

interface PostCommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  authorUsername?: string;
  onCommentCountChange?: (count: number) => void;
}

export const PostCommentsModal: React.FC<PostCommentsModalProps> = ({
  isOpen,
  onClose,
  postId,
  authorUsername,
  onCommentCountChange,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;
    const fetchComments = async () => {
      try {
        setLoading(true);
        const data = await postService.getComments(postId);
        if (mounted) {
          setComments(data);
          if (onCommentCountChange) onCommentCountChange(data.length);
        }
      } catch (err: any) {
        toast('Failed to load comments', 'error');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchComments();
    return () => {
      mounted = false;
    };
  }, [isOpen, postId, toast, onCommentCountChange]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast('Please sign in to comment', 'info');
      return;
    }
    if (!newComment.trim() || submitting) return;

    try {
      setSubmitting(true);
      const added = await postService.addComment(postId, user.id, newComment.trim());
      const updated = [...comments, added];
      setComments(updated);
      setNewComment('');
      if (onCommentCountChange) onCommentCountChange(updated.length);
    } catch (err: any) {
      toast(err.message || 'Failed to post comment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user) return;
    try {
      await postService.deleteComment(commentId, user.id);
      const updated = comments.filter((c) => c.id !== commentId);
      setComments(updated);
      if (onCommentCountChange) onCommentCountChange(updated.length);
      toast('Comment deleted', 'success');
    } catch (err: any) {
      toast(err.message || 'Failed to delete comment', 'error');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md" title="Comments">
      <div className="flex flex-col h-[450px]">
        {/* Comment list */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
            </div>
          ) : comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 text-neutral-400">
              <MessageSquare className="w-10 h-10 mb-2 opacity-50" />
              <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                No comments yet
              </p>
              <p className="text-xs text-neutral-500">Be the first to share your thoughts!</p>
            </div>
          ) : (
            comments.map((comment) => {
              const canDelete =
                user &&
                (user.id === comment.author_id ||
                  (authorUsername && user.user_metadata?.username === authorUsername));

              return (
                <div key={comment.id} className="flex items-start justify-between gap-3 group">
                  <div className="flex items-start gap-3">
                    <Link to={`/profile/${comment.author?.username}`}>
                      <Avatar
                        src={comment.author?.avatar_url}
                        alt={comment.author?.username || 'User'}
                        size="sm"
                      />
                    </Link>
                    <div className="text-xs">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/profile/${comment.author?.username}`}
                          className="font-bold text-neutral-900 dark:text-white hover:underline"
                        >
                          {comment.author?.username}
                        </Link>
                        <span className="text-[10px] text-neutral-400">
                          {formatTimeAgo(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-neutral-800 dark:text-neutral-200 mt-0.5 leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  </div>

                  {canDelete && (
                    <button
                      type="button"
                      onClick={() => handleDeleteComment(comment.id)}
                      className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-rose-500 p-1 transition-opacity"
                      title="Delete comment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Comment input form */}
        <form
          onSubmit={handleAddComment}
          className="flex items-center gap-2 pt-3 border-t border-neutral-200 dark:border-neutral-800 shrink-0"
        >
          <input
            type="text"
            placeholder={user ? 'Add a comment...' : 'Sign in to comment'}
            disabled={!user || submitting}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 px-3 py-2 text-xs bg-neutral-100 dark:bg-neutral-800/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 text-neutral-900 dark:text-white disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!user || !newComment.trim() || submitting}
            className="p-2 rounded-xl bg-teal-600 text-white disabled:opacity-40 hover:bg-teal-500 transition-colors"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
      </div>
    </Modal>
  );
};
