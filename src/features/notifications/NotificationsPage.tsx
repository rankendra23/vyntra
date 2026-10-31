import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  MessageCircle,
  UserPlus,
  Clock,
  CheckCheck,
  Bell,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Notification } from '../../types';
import { notificationService } from '../../services/notificationService';
import { profileService } from '../../services/profileService';
import { useAuth } from '../auth/AuthContext';
import { useToast } from '../../hooks/useToast';
import { formatTimeAgo } from '../../lib/utils';
import { PostCommentsModal } from '../feed/PostCommentsModal';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchNotifs = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await notificationService.getNotifications(user.id);
      setNotifications(data);
    } catch {
      toast('Failed to load activity', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, [user]);

  const handleMarkAllRead = async () => {
    if (!user) return;
    try {
      await notificationService.markAsRead(user.id);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      toast('All notifications marked as read', 'success');
    } catch {
      toast('Failed to mark notifications', 'error');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />;
      case 'comment':
        return <MessageCircle className="w-3.5 h-3.5 text-teal-500 fill-teal-500" />;
      case 'follow':
      case 'follow_accept':
        return <UserPlus className="w-3.5 h-3.5 text-blue-500" />;
      case 'follow_request':
        return <Clock className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-teal-500" />;
    }
  };

  const getNotificationText = (n: Notification) => {
    switch (n.type) {
      case 'like':
        return 'liked your post.';
      case 'comment':
        return 'commented on your post.';
      case 'follow':
        return 'started following you.';
      case 'follow_request':
        return 'requested to follow you.';
      case 'follow_accept':
        return 'accepted your follow request.';
      default:
        return 'interacted with your content.';
    }
  };

  return (
    <div className="w-full max-w-2xl px-4 py-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
            Activity
          </h1>
          <p className="text-xs text-neutral-500">
            Likes, comments, followers, and mentions
          </p>
        </div>

        {notifications.some((n) => !n.is_read) && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleMarkAllRead}
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 gap-1.5"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </Button>
        )}
      </div>

      {/* List */}
      <div className="space-y-2">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-neutral-400">
            <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-3">
              <Bell className="w-7 h-7 opacity-40 text-teal-600" />
            </div>
            <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
              No notifications yet
            </h3>
            <p className="text-xs text-neutral-500 max-w-xs mt-1">
              When people like your posts, comment, or follow you, you'll see it here.
            </p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`flex items-center justify-between p-3.5 rounded-2xl transition-colors ${
                !n.is_read
                  ? 'bg-teal-50/50 dark:bg-teal-950/20 border border-teal-500/20'
                  : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/40 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative">
                  <Link to={`/profile/${n.actor?.username}`}>
                    <Avatar
                      src={n.actor?.avatar_url}
                      alt={n.actor?.username || 'User'}
                      size="md"
                    />
                  </Link>
                  <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-white dark:bg-[#121214] shadow">
                    {getNotificationIcon(n.type)}
                  </div>
                </div>

                <div className="flex flex-col text-xs leading-snug">
                  <p className="text-neutral-900 dark:text-neutral-100">
                    <Link
                      to={`/profile/${n.actor?.username}`}
                      className="font-bold hover:underline mr-1"
                    >
                      {n.actor?.username}
                    </Link>
                    <span className="text-neutral-600 dark:text-neutral-300">
                      {getNotificationText(n)}
                    </span>
                  </p>
                  <span className="text-[10px] text-neutral-400 mt-0.5">
                    {formatTimeAgo(n.created_at)}
                  </span>
                </div>
              </div>

              {/* Action item on right */}
              {n.post_id && (
                <button
                  type="button"
                  onClick={() => setSelectedPostId(n.post_id!)}
                  className="w-11 h-11 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0 border border-neutral-200 dark:border-neutral-700/60 ml-3 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  {n.post?.media && n.post.media[0] ? (
                    <img
                      src={n.post.media[0].media_url}
                      alt="Post"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-400">
                      Post
                    </div>
                  )}
                </button>
              )}

              {n.type === 'follow' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/profile/${n.actor?.username}`)}
                  className="ml-3 shrink-0"
                >
                  View
                </Button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Post Modal when clicked in activity list */}
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
