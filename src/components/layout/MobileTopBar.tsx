import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Heart, MessageCircle } from 'lucide-react';

interface MobileTopBarProps {
  unreadMessagesCount?: number;
  unreadNotificationsCount?: number;
}

export const MobileTopBar: React.FC<MobileTopBarProps> = ({
  unreadMessagesCount = 0,
  unreadNotificationsCount = 0,
}) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 flex md:hidden items-center justify-between px-4 h-14 bg-white/95 dark:bg-[#0c0c0e]/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800/80">
      <div
        onClick={() => navigate('/')}
        className="flex items-center gap-2 cursor-pointer select-none"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 via-teal-500 to-blue-600 flex items-center justify-center text-white shadow-sm shadow-teal-500/20">
          <Sparkles className="w-4 h-4 fill-white" />
        </div>
        <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-teal-600 to-cyan-500 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
          Vyntra
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => navigate('/notifications')}
          className="relative p-2 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          aria-label="Notifications"
        >
          <Heart className="w-6 h-6" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-3.5 min-w-3.5 px-0.5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-[#0c0c0e]">
              {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => navigate('/messages')}
          className="relative p-2 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          aria-label="Direct Messages"
        >
          <MessageCircle className="w-6 h-6" />
          {unreadMessagesCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-3.5 min-w-3.5 px-0.5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-[#0c0c0e]">
              {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
