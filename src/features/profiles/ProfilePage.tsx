import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Grid,
  Bookmark,
  Lock,
  ExternalLink,
  Settings,
  UserCheck,
  UserPlus,
  Clock,
  MoreHorizontal,
  ShieldAlert,
  MessageCircle,
  Share2,
  Copy,
  Users,
} from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { ProfileSkeleton } from '../../components/ui/Skeleton';
import { Profile, Post } from '../../types';
import { profileService } from '../../services/profileService';
import { postService } from '../../services/postService';
import { useAuth } from '../auth/AuthContext';
import { useToast } from '../../hooks/useToast';
import { EditProfileModal } from './EditProfileModal';
import { FollowRequestsModal } from './FollowRequestsModal';
import { PostCommentsModal } from '../feed/PostCommentsModal';

export const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user, profile: activeProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts');
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRequestsModalOpen, setIsRequestsModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const isOwner = user && profile && user.id === profile.id;

  const loadProfileData = useCallback(async () => {
    if (!username) return;
    try {
      setLoading(true);
      const prof = await profileService.getProfileByUsername(username, user?.id);
      if (!prof) {
        setProfile(null);
        return;
      }
      setProfile(prof);
      setIsFollowing(!!prof.is_following);
      setIsPending(!!prof.is_pending_request);

      // Check if can view content
      const canView = !prof.is_private || prof.is_following || (user && user.id === prof.id);

      if (canView) {
        const feedPosts = await postService.getFeedPosts(user?.id);
        const userPosts = feedPosts.filter((p) => p.author_id === prof.id);
        setPosts(userPosts);

        if (user && user.id === prof.id) {
          const saved = await postService.getSavedPosts(user.id);
          setSavedPosts(saved);
        }
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  }, [username, user]);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  const handleToggleFollow = async () => {
    if (!user || !profile) {
      toast('Please sign in to follow', 'info');
      return;
    }

    try {
      const res = await profileService.toggleFollow(user.id, profile.id);
      setIsFollowing(res.isFollowing);
      setIsPending(res.isPending);

      if (res.isPending) {
        toast(`Follow request sent to @${profile.username}`, 'info');
      } else if (res.isFollowing) {
        toast(`Now following @${profile.username}`, 'success');
        setProfile((prev) =>
          prev ? { ...prev, followers_count: (prev.followers_count || 0) + 1 } : null
        );
      } else {
        toast(`Unfollowed @${profile.username}`, 'info');
        setProfile((prev) =>
          prev ? { ...prev, followers_count: Math.max(0, (prev.followers_count || 1) - 1) } : null
        );
      }
      loadProfileData();
    } catch {
      toast('Failed to update follow status', 'error');
    }
  };

  const handleShareProfile = () => {
    navigator.clipboard.writeText(window.location.href);
    toast('Profile link copied to clipboard!', 'success');
  };

  const handleMessageUser = () => {
    if (!profile) return;
    navigate(`/messages?user=${profile.id}`);
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl p-6">
        <ProfileSkeleton />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="w-full max-w-md mx-auto text-center py-20">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
          Profile not found
        </h2>
        <p className="text-sm text-neutral-500 mb-6">
          The link you followed may be broken or the account may have been removed.
        </p>
        <Button onClick={() => navigate('/')}>Back to Vyntra</Button>
      </div>
    );
  }

  const isRestrictedPrivate = profile.is_private && !isFollowing && !isOwner;

  return (
    <div className="w-full max-w-4xl px-4 py-6">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-12 mb-8">
        <Avatar
          src={profile.avatar_url}
          alt={profile.username}
          size="2xl"
          className="shrink-0"
        />

        <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left space-y-4">
          {/* Top Row: Username and action buttons */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
              {profile.username}
              {profile.is_verified && (
                <span className="w-2 h-2 rounded-full bg-teal-500" title="Verified" />
              )}
            </h2>

            {isOwner ? (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  Edit profile
                </Button>
                {profile.is_private && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsRequestsModalOpen(true)}
                  >
                    Requests
                  </Button>
                )}
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => navigate('/settings')}
                  aria-label="Settings"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {isPending ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleToggleFollow}
                    className="gap-1.5"
                  >
                    <Clock className="w-4 h-4 text-neutral-400" />
                    Requested
                  </Button>
                ) : isFollowing ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleToggleFollow}
                  >
                    Following
                  </Button>
                ) : (
                  <Button size="sm" onClick={handleToggleFollow}>
                    Follow
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleMessageUser}
                >
                  Message
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleShareProfile}
                  title="Share profile"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Counts Row */}
          <div className="flex items-center justify-center sm:justify-start gap-8 text-sm">
            <div>
              <span className="font-bold text-neutral-900 dark:text-white mr-1">
                {profile.posts_count || posts.length}
              </span>
              <span className="text-neutral-500">posts</span>
            </div>
            <div>
              <span className="font-bold text-neutral-900 dark:text-white mr-1">
                {profile.followers_count || 0}
              </span>
              <span className="text-neutral-500">followers</span>
            </div>
            <div>
              <span className="font-bold text-neutral-900 dark:text-white mr-1">
                {profile.following_count || 0}
              </span>
              <span className="text-neutral-500">following</span>
            </div>
          </div>

          {/* Bio & Details */}
          <div className="space-y-1 max-w-md">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
              {profile.full_name}
            </h3>
            {profile.bio && (
              <p className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap leading-relaxed">
                {profile.bio}
              </p>
            )}
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline pt-0.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {profile.website.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-center gap-12">
          <button
            type="button"
            onClick={() => setActiveTab('posts')}
            className={`flex items-center gap-2 py-3.5 text-xs font-bold tracking-wider uppercase border-t-2 -mt-[2px] transition-colors ${
              activeTab === 'posts'
                ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
            }`}
          >
            <Grid className="w-4 h-4" />
            Posts
          </button>

          {isOwner && (
            <button
              type="button"
              onClick={() => setActiveTab('saved')}
              className={`flex items-center gap-2 py-3.5 text-xs font-bold tracking-wider uppercase border-t-2 -mt-[2px] transition-colors ${
                activeTab === 'saved'
                  ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-white'
                  : 'border-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              Saved
            </button>
          )}
        </div>
      </div>

      {/* Content Stream */}
      {isRestrictedPrivate ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border-t border-neutral-100 dark:border-neutral-800/80">
          <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 flex items-center justify-center mb-3">
            <Lock className="w-8 h-8" />
          </div>
          <h4 className="text-base font-bold text-neutral-800 dark:text-neutral-200 mb-1">
            This Account is Private
          </h4>
          <p className="text-xs text-neutral-500 max-w-xs">
            Follow this account to see their photos, videos, and stories.
          </p>
        </div>
      ) : activeTab === 'posts' ? (
        posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-neutral-400">
            <Grid className="w-12 h-12 mb-2 opacity-40" />
            <h4 className="text-base font-semibold text-neutral-700 dark:text-neutral-300">
              No posts yet
            </h4>
            <p className="text-xs text-neutral-500">
              {isOwner ? 'Capture moments and share your first post!' : 'When they share photos, they will appear here.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1 sm:gap-4 mt-2">
            {posts.map((post) => (
              <div
                key={post.id}
                onClick={() => setSelectedPostId(post.id)}
                className="group relative aspect-square bg-neutral-100 dark:bg-neutral-900 rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer"
              >
                {post.media && post.media[0] ? (
                  post.media[0].media_type === 'video' ? (
                    <video
                      src={post.media[0].media_url}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={post.media[0].media_url}
                      alt={post.caption || 'Post'}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  )
                ) : null}

                {/* Hover overlay with likes & comments */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white text-sm font-bold">
                  <div className="flex items-center gap-1.5">
                    <span>❤️</span>
                    <span>{post.likes_count}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>💬</span>
                    <span>{post.comments_count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        // Saved posts tab (owner only)
        savedPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-neutral-400">
            <Bookmark className="w-12 h-12 mb-2 opacity-40" />
            <h4 className="text-base font-semibold text-neutral-700 dark:text-neutral-300">
              Save photos and videos
            </h4>
            <p className="text-xs text-neutral-500">
              Save items that you want to see again. No one is notified, and only you can see what you've saved.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1 sm:gap-4 mt-2">
            {savedPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => setSelectedPostId(post.id)}
                className="group relative aspect-square bg-neutral-100 dark:bg-neutral-900 rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer"
              >
                {post.media && post.media[0] && (
                  <img
                    src={post.media[0].media_url}
                    alt={post.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                )}
              </div>
            ))}
          </div>
        )
      )}

      {/* Edit Profile Modal */}
      {isOwner && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          profile={profile}
          onProfileUpdated={(updated) => {
            setProfile(updated);
            loadProfileData();
          }}
        />
      )}

      {/* Follow Requests Modal */}
      {isOwner && (
        <FollowRequestsModal
          isOpen={isRequestsModalOpen}
          onClose={() => setIsRequestsModalOpen(false)}
          userId={user.id}
          onRequestHandled={() => loadProfileData()}
        />
      )}

      {/* Post Modal when clicked in grid */}
      {selectedPostId && (
        <PostCommentsModal
          isOpen={true}
          onClose={() => setSelectedPostId(null)}
          postId={selectedPostId}
        />
      )}
    </div>
  );
};
