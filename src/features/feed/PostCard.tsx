import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Send,
  Trash2,
  Flag,
  Copy,
  MapPin,
} from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { Post, Comment } from '../../types';
import { formatTimeAgo } from '../../lib/utils';
import { postService } from '../../services/postService';
import { profileService } from '../../services/profileService';
import { useAuth } from '../auth/AuthContext';
import { useToast } from '../../hooks/useToast';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { PostCommentsModal } from './PostCommentsModal';

interface PostCardProps {
  post: Post;
  onPostDeleted?: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onPostDeleted }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [hasLiked, setHasLiked] = useState(post.has_liked ?? false);
  const [hasSaved, setHasSaved] = useState(post.has_saved ?? false);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.comments_count);

  const isOwner = user && user.id === post.author_id;

  // Like action with optimistic UI
  const handleToggleLike = async () => {
    if (!user) {
      toast('Please sign in to like posts', 'info');
      return;
    }

    const previousLiked = hasLiked;
    const previousCount = likesCount;

    setHasLiked(!previousLiked);
    setLikesCount(previousLiked ? previousCount - 1 : previousCount + 1);

    try {
      await postService.toggleLike(post.id, user.id);
    } catch {
      // Rollback on error
      setHasLiked(previousLiked);
      setLikesCount(previousCount);
      toast('Failed to update like', 'error');
    }
  };

  // Double tap to like
  const handleDoubleTap = () => {
    if (!hasLiked) {
      handleToggleLike();
    }
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 800);
  };

  // Save action
  const handleToggleSave = async () => {
    if (!user) {
      toast('Please sign in to save posts', 'info');
      return;
    }
    const previousSaved = hasSaved;
    setHasSaved(!previousSaved);
    try {
      await postService.toggleSave(post.id, user.id);
      toast(previousSaved ? 'Removed from saved' : 'Saved to collection', 'success');
    } catch {
      setHasSaved(previousSaved);
      toast('Failed to save post', 'error');
    }
  };

  // Copy link
  const handleCopyLink = () => {
    const postUrl = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard.writeText(postUrl);
    toast('Link copied to clipboard!', 'success');
    setShowMenu(false);
  };

  // Delete post
  const handleDeletePost = async () => {
    if (!user) return;
    try {
      await postService.deletePost(post.id, user.id);
      toast('Post deleted', 'success');
      setShowDeleteConfirm(false);
      if (onPostDeleted) onPostDeleted(post.id);
    } catch (err: any) {
      toast(err.message || 'Failed to delete post', 'error');
    }
  };

  // Report post
  const handleReportPost = async () => {
    if (!user) {
      toast('Please sign in to report content', 'info');
      return;
    }
    try {
      await profileService.report({
        reporterId: user.id,
        targetType: 'post',
        targetId: post.id,
        reason: 'Inappropriate content',
      });
      toast('Thank you for reporting. Our moderation team will review this.', 'info');
      setShowMenu(false);
    } catch {
      toast('Failed to submit report', 'error');
    }
  };

  // Submit inline quick comment
  const handleInlineComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast('Please sign in to comment', 'info');
      return;
    }
    if (!commentInput.trim() || isSubmittingComment) return;

    try {
      setIsSubmittingComment(true);
      await postService.addComment(post.id, user.id, commentInput.trim());
      setCommentInput('');
      setCommentsCount((prev) => prev + 1);
      toast('Comment posted', 'success');
    } catch (err: any) {
      toast(err.message || 'Failed to post comment', 'error');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Format caption with highlighted hashtags
  const renderFormattedCaption = (text: string) => {
    const parts = text.split(/(#[a-zA-Z0-9_]+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('#')) {
        const tag = part.slice(1);
        return (
          <span
            key={index}
            onClick={() => navigate(`/explore?tag=${tag}`)}
            className="text-teal-600 dark:text-teal-400 hover:underline cursor-pointer font-medium"
          >
            {part}{' '}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <article className="bg-white dark:bg-[#121214] border border-neutral-200 dark:border-neutral-800/80 rounded-3xl overflow-hidden mb-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.author?.username}`}>
            <Avatar
              src={post.author?.avatar_url}
              alt={post.author?.username || 'User'}
              size="md"
            />
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <Link
                to={`/profile/${post.author?.username}`}
                className="text-sm font-semibold text-neutral-900 dark:text-white hover:underline"
              >
                {post.author?.username}
              </Link>
              {post.author?.is_verified && (
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500" title="Verified Creator" />
              )}
              <span className="text-xs text-neutral-400">•</span>
              <span className="text-xs text-neutral-400">{formatTimeAgo(post.created_at)}</span>
            </div>
            {post.location && (
              <div className="flex items-center gap-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                <span className="truncate max-w-[200px]">{post.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Options Menu button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-xl text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Post options"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 top-8 z-20 w-44 bg-white dark:bg-[#18181b] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl py-1 animate-scale-in text-xs font-medium text-neutral-700 dark:text-neutral-200">
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center gap-2.5 w-full px-3.5 py-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors"
              >
                <Copy className="w-4 h-4 text-neutral-400" />
                Copy Link
              </button>
              {isOwner ? (
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    setShowDeleteConfirm(true);
                  }}
                  className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Post
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleReportPost}
                  className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                >
                  <Flag className="w-4 h-4" />
                  Report Post
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Media Carousel */}
      <div
        className="relative aspect-square w-full bg-black flex items-center justify-center overflow-hidden cursor-pointer select-none"
        onDoubleClick={handleDoubleTap}
      >
        {post.media && post.media.length > 0 ? (
          post.media[currentSlide]?.media_type === 'video' ? (
            <video
              src={post.media[currentSlide].media_url}
              controls
              playsInline
              className="w-full h-full object-contain"
            />
          ) : (
            <img
              src={post.media[currentSlide].media_url}
              alt={post.caption || 'Post image'}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          )
        ) : (
          <div className="text-neutral-500 text-sm">Media unavailable</div>
        )}

        {/* Animated Heart Overlay on double tap */}
        {showHeartAnim && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-like-bounce">
            <Heart className="w-24 h-24 text-rose-500 fill-rose-500 drop-shadow-lg" />
          </div>
        )}

        {/* Previous / Next buttons */}
        {post.media && post.media.length > 1 && (
          <>
            {currentSlide > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide((prev) => prev - 1);
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors backdrop-blur-sm"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {currentSlide < post.media.length - 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide((prev) => prev + 1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors backdrop-blur-sm"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {/* Dot indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm">
              {post.media.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === currentSlide ? 'w-4 bg-teal-400' : 'w-1.5 bg-white/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Action Bar */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Like */}
            <button
              type="button"
              onClick={handleToggleLike}
              className={`transition-transform active:scale-75 ${
                hasLiked ? 'text-rose-500 fill-rose-500' : 'text-neutral-700 dark:text-neutral-200 hover:text-rose-500'
              }`}
              aria-label={hasLiked ? 'Unlike post' : 'Like post'}
            >
              <Heart className={`w-6 h-6 ${hasLiked ? 'fill-current' : ''}`} />
            </button>

            {/* Comment */}
            <button
              type="button"
              onClick={() => setShowCommentsModal(true)}
              className="text-neutral-700 dark:text-neutral-200 hover:text-teal-600 transition-colors"
              aria-label="View comments"
            >
              <MessageCircle className="w-6 h-6" />
            </button>

            {/* Share */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="text-neutral-700 dark:text-neutral-200 hover:text-teal-600 transition-colors"
              aria-label="Share post"
            >
              <Share2 className="w-6 h-6" />
            </button>
          </div>

          {/* Bookmark */}
          <button
            type="button"
            onClick={handleToggleSave}
            className={`transition-colors ${
              hasSaved
                ? 'text-teal-600 dark:text-teal-400 fill-teal-600 dark:fill-teal-400'
                : 'text-neutral-700 dark:text-neutral-200 hover:text-teal-600'
            }`}
            aria-label={hasSaved ? 'Unsave post' : 'Save post'}
          >
            <Bookmark className={`w-6 h-6 ${hasSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Likes Count */}
        <div className="text-sm font-bold text-neutral-900 dark:text-white">
          {likesCount.toLocaleString()} {likesCount === 1 ? 'like' : 'likes'}
        </div>

        {/* Caption */}
        {post.caption && (
          <div className="text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed">
            <Link
              to={`/profile/${post.author?.username}`}
              className="font-bold text-neutral-900 dark:text-white mr-2 hover:underline"
            >
              {post.author?.username}
            </Link>
            {renderFormattedCaption(post.caption)}
          </div>
        )}

        {/* Comments count link */}
        {commentsCount > 0 && (
          <button
            type="button"
            onClick={() => setShowCommentsModal(true)}
            className="text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 font-medium"
          >
            View all {commentsCount} comments
          </button>
        )}

        {/* Inline comment form */}
        <form
          onSubmit={handleInlineComment}
          className="flex items-center gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/80"
        >
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            className="flex-1 bg-transparent text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none"
          />
          {commentInput.trim() && (
            <button
              type="submit"
              disabled={isSubmittingComment}
              className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 disabled:opacity-50"
            >
              Post
            </button>
          )}
        </form>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeletePost}
        title="Delete Post?"
        description="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />

      {/* Comments Full Modal */}
      <PostCommentsModal
        isOpen={showCommentsModal}
        onClose={() => setShowCommentsModal(false)}
        postId={post.id}
        authorUsername={post.author?.username}
        onCommentCountChange={(newCount) => setCommentsCount(newCount)}
      />
    </article>
  );
};
