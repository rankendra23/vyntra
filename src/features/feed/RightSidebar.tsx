import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Profile } from '../../types';
import { profileService } from '../../services/profileService';
import { useAuth } from '../auth/AuthContext';
import { useToast } from '../../hooks/useToast';

export const RightSidebar: React.FC = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<Profile[]>([]);
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let mounted = true;
    const fetchSuggestions = async () => {
      try {
        const users = await profileService.getSuggestedUsers(user?.id);
        if (mounted) {
          setSuggestions(users);
          const initialMap: Record<string, boolean> = {};
          users.forEach((u) => {
            initialMap[u.id] = !!u.is_following;
          });
          setFollowingMap(initialMap);
        }
      } catch {
        // ignore
      }
    };

    fetchSuggestions();
    return () => {
      mounted = false;
    };
  }, [user]);

  const handleToggleFollow = async (targetId: string, username: string) => {
    if (!user) {
      toast('Please sign in to follow creators', 'info');
      return;
    }

    const currentStatus = !!followingMap[targetId];
    setFollowingMap((prev) => ({ ...prev, [targetId]: !currentStatus }));

    try {
      const res = await profileService.toggleFollow(user.id, targetId);
      setFollowingMap((prev) => ({ ...prev, [targetId]: res.isFollowing }));
      if (res.isPending) {
        toast(`Follow request sent to @${username}`, 'info');
      } else if (res.isFollowing) {
        toast(`Now following @${username}`, 'success');
      } else {
        toast(`Unfollowed @${username}`, 'info');
      }
    } catch {
      setFollowingMap((prev) => ({ ...prev, [targetId]: currentStatus }));
      toast('Failed to update follow status', 'error');
    }
  };

  return (
    <div className="hidden lg:flex flex-col w-[320px] shrink-0 pl-8 pt-4 space-y-6">
      {/* Current User Quick Header */}
      {user && profile && (
        <div className="flex items-center justify-between">
          <Link
            to={`/profile/${profile.username}`}
            className="flex items-center gap-3 group"
          >
            <Avatar src={profile.avatar_url} alt={profile.username} size="md" />
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-neutral-900 dark:text-white group-hover:underline">
                {profile.username}
              </span>
              <span className="text-xs text-neutral-500 truncate max-w-[150px]">
                {profile.full_name}
              </span>
            </div>
          </Link>

          <Link
            to="/settings"
            className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700"
          >
            Settings
          </Link>
        </div>
      )}

      {/* Suggestions Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400">
            Suggested for you
          </span>
          <Link
            to="/explore"
            className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 hover:text-teal-600"
          >
            See All
          </Link>
        </div>

        <div className="space-y-3">
          {suggestions.map((item) => {
            const isFollowing = !!followingMap[item.id];
            return (
              <div key={item.id} className="flex items-center justify-between">
                <Link
                  to={`/profile/${item.username}`}
                  className="flex items-center gap-2.5 group"
                >
                  <Avatar src={item.avatar_url} alt={item.username} size="sm" />
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 group-hover:underline">
                      {item.username}
                    </span>
                    <span className="text-[11px] text-neutral-400 truncate max-w-[130px]">
                      {item.is_private ? 'Private account' : `${item.followers_count || 0} followers`}
                    </span>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => handleToggleFollow(item.id, item.username)}
                  className={`text-xs font-bold transition-colors ${
                    isFollowing
                      ? 'text-neutral-400 hover:text-rose-500'
                      : 'text-teal-600 dark:text-teal-400 hover:text-teal-700'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Meta */}
      <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800/80 text-[11px] text-neutral-400 space-y-2">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <a href="#" className="hover:underline">About</a>
          <span>•</span>
          <a href="#" className="hover:underline">Help</a>
          <span>•</span>
          <a href="#" className="hover:underline">Privacy</a>
          <span>•</span>
          <a href="#" className="hover:underline">Terms</a>
          <span>•</span>
          <a href="#" className="hover:underline">Locations</a>
        </div>
        <p>© 2026 SocialSphere by Advanced Systems</p>
      </div>
    </div>
  );
};
