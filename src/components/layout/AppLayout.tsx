import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileTopBar } from './MobileTopBar';
import { MobileNav } from './MobileNav';
import { CreatePostModal } from '../../features/posts/CreatePostModal';

interface AppLayoutProps {
  unreadMessagesCount?: number;
  unreadNotificationsCount?: number;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  unreadMessagesCount = 0,
  unreadNotificationsCount = 0,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0c0c0e] text-neutral-900 dark:text-neutral-100 flex flex-col md:flex-row">
      {/* Desktop & Tablet Sidebar */}
      <Sidebar
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        unreadMessagesCount={unreadMessagesCount}
        unreadNotificationsCount={unreadNotificationsCount}
      />

      {/* Mobile Top Header */}
      <MobileTopBar
        unreadMessagesCount={unreadMessagesCount}
        unreadNotificationsCount={unreadNotificationsCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 md:pl-[76px] xl:pl-[245px] pb-16 md:pb-0 min-h-screen flex flex-col items-center">
        <div className="w-full max-w-6xl mx-auto px-0 sm:px-4 py-0 sm:py-6 flex-1 flex justify-center">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        unreadNotificationsCount={unreadNotificationsCount}
      />

      {/* Global Post Creation Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPostCreated={() => {
          setIsCreateModalOpen(false);
          // Custom event to refresh feed if on feed page
          window.dispatchEvent(new CustomEvent('vyntra:post-created'));
        }}
      />
    </div>
  );
};
