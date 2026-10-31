import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Compass,
  MessageCircle,
  Heart,
  PlusSquare,
  User,
  Settings,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useAuth } from '../../features/auth/AuthContext';
import { cn } from '../../lib/utils';

interface SidebarProps {
  onOpenCreateModal: () => void;
  unreadMessagesCount?: number;
  unreadNotificationsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onOpenCreateModal,
  unreadMessagesCount = 0,
  unreadNotificationsCount = 0,
}) => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Explore', path: '/explore', icon: Compass },
    {
      label: 'Messages',
      path: '/messages',
      icon: MessageCircle,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
    },
    {
      label: 'Notifications',
      path: '/notifications',
      icon: Heart,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-30 hidden md:flex flex-col justify-between border-r border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-[#0c0c0e] w-[76px] xl:w-[245px] px-3 py-6 transition-all">
      {/* Top Branding & Nav */}
      <div className="flex flex-col gap-6">
        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          className="cursor-pointer flex items-center gap-3 px-3 py-2 rounded-2xl hover:bg-neutral-100 dark:hover:bg-neutral-900/60 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20 shrink-0">
            <Sparkles className="w-5 h-5 fill-white" />
          </div>
          <span className="hidden xl:inline-block font-extrabold text-xl tracking-tight bg-gradient-to-r from-teal-600 to-cyan-500 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
            SocialSphere
          </span>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-1.5" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-4 px-3.5 py-3 rounded-xl font-medium transition-all group relative',
                    isActive
                      ? 'bg-neutral-100 dark:bg-neutral-800/70 text-teal-600 dark:text-teal-400 font-semibold'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100/70 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-white'
                  )
                }
              >
                <div className="relative shrink-0 flex items-center justify-center">
                  <Icon className="w-6 h-6 transition-transform group-hover:scale-105" />
                  {item.badge !== undefined && (
                    <span className="absolute -top-1 -right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-[#0c0c0e]">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </div>
                <span className="hidden xl:inline text-sm">{item.label}</span>
              </NavLink>
            );
          })}

          {/* Create Post Button */}
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="flex items-center gap-4 px-3.5 py-3 rounded-xl font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100/70 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-white transition-all group text-left w-full"
          >
            <PlusSquare className="w-6 h-6 shrink-0 transition-transform group-hover:scale-105 text-teal-600 dark:text-teal-400" />
            <span className="hidden xl:inline text-sm">Create</span>
          </button>

          {/* Profile Link */}
          {user && (
            <NavLink
              to={`/profile/${profile?.username || user.id}`}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-4 px-3 py-2.5 rounded-xl font-medium transition-all group',
                  isActive
                    ? 'bg-neutral-100 dark:bg-neutral-800/70 text-teal-600 dark:text-teal-400 font-semibold'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100/70 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-white'
                )
              }
            >
              <Avatar
                src={profile?.avatar_url}
                alt={profile?.username || 'My Profile'}
                size="sm"
                className="shrink-0 group-hover:ring-2 group-hover:ring-teal-500 transition-all"
              />
              <span className="hidden xl:inline text-sm truncate">
                {profile?.username || 'Profile'}
              </span>
            </NavLink>
          )}
        </nav>
      </div>

      {/* Bottom Controls */}
      <div className="flex flex-col gap-2 pt-4 border-t border-neutral-200 dark:border-neutral-800/80">
        <ThemeToggle compact={false} className="hidden xl:flex" />
        <ThemeToggle compact={true} className="xl:hidden self-center" />

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-4 px-3.5 py-2.5 rounded-xl font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors',
              isActive && 'text-teal-600 dark:text-teal-400 font-semibold'
            )
          }
        >
          <Settings className="w-5 h-5 shrink-0" />
          <span className="hidden xl:inline text-sm">Settings</span>
        </NavLink>

        {user && (
          <button
            type="button"
            onClick={() => signOut()}
            className="flex items-center gap-4 px-3.5 py-2.5 rounded-xl font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="hidden xl:inline text-sm">Log out</span>
          </button>
        )}
      </div>
    </aside>
  );
};
