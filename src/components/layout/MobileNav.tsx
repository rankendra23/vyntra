import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, PlusSquare, User, Heart } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { useAuth } from '../../features/auth/AuthContext';
import { cn } from '../../lib/utils';

interface MobileNavProps {
  onOpenCreateModal: () => void;
  unreadNotificationsCount?: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  onOpenCreateModal,
  unreadNotificationsCount = 0,
}) => {
  const { user, profile } = useAuth();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 flex md:hidden items-center justify-around h-14 bg-white/95 dark:bg-[#0c0c0e]/95 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800/80 px-2"
      aria-label="Mobile Navigation"
    >
      <NavLink
        to="/"
        className={({ isActive }) =>
          cn(
            'flex items-center justify-center p-2 rounded-xl text-neutral-600 dark:text-neutral-400 transition-colors',
            isActive && 'text-teal-600 dark:text-teal-400 font-bold'
          )
        }
        aria-label="Home"
      >
        <Home className="w-6 h-6" />
      </NavLink>

      <NavLink
        to="/explore"
        className={({ isActive }) =>
          cn(
            'flex items-center justify-center p-2 rounded-xl text-neutral-600 dark:text-neutral-400 transition-colors',
            isActive && 'text-teal-600 dark:text-teal-400 font-bold'
          )
        }
        aria-label="Explore"
      >
        <Compass className="w-6 h-6" />
      </NavLink>

      <button
        type="button"
        onClick={onOpenCreateModal}
        className="flex items-center justify-center w-10 h-10 rounded-xl bg-teal-600 text-white shadow-sm shadow-teal-600/30 active:scale-95 transition-transform"
        aria-label="Create Post"
      >
        <PlusSquare className="w-6 h-6" />
      </button>

      <NavLink
        to="/notifications"
        className={({ isActive }) =>
          cn(
            'relative flex items-center justify-center p-2 rounded-xl text-neutral-600 dark:text-neutral-400 transition-colors',
            isActive && 'text-teal-600 dark:text-teal-400 font-bold'
          )
        }
        aria-label="Notifications"
      >
        <Heart className="w-6 h-6" />
        {unreadNotificationsCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#0c0c0e]" />
        )}
      </NavLink>

      {user ? (
        <NavLink
          to={`/profile/${profile?.username || user.id}`}
          className={({ isActive }) =>
            cn(
              'flex items-center justify-center p-1 rounded-full transition-all',
              isActive && 'ring-2 ring-teal-500'
            )
          }
          aria-label="My Profile"
        >
          <Avatar src={profile?.avatar_url} alt="Profile" size="xs" />
        </NavLink>
      ) : (
        <NavLink
          to="/login"
          className="flex items-center justify-center p-2 rounded-xl text-neutral-600 dark:text-neutral-400"
          aria-label="Log In"
        >
          <User className="w-6 h-6" />
        </NavLink>
      )}
    </nav>
  );
};
