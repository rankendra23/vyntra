import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { Story } from '../../types';
import { storyService } from '../../services/storyService';
import { useAuth } from '../auth/AuthContext';
import { StoryViewerModal } from './StoryViewerModal';
import { CreateStoryModal } from './CreateStoryModal';

export const StoriesBar: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { user, profile } = useAuth();

  const fetchStories = async () => {
    try {
      setLoading(true);
      const data = await storyService.getActiveStories();
      setStories(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  return (
    <div className="w-full bg-white dark:bg-[#121214] border border-neutral-200 dark:border-neutral-800/80 rounded-3xl p-4 mb-6 shadow-sm overflow-hidden">
      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-1">
        {/* Your Story (+) Button */}
        <div className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
          <div
            className="relative"
            onClick={() => setIsCreateOpen(true)}
          >
            <Avatar
              src={profile?.avatar_url}
              alt="Your story"
              size="lg"
              className="group-hover:opacity-90"
            />
            <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center ring-2 ring-white dark:ring-[#121214] shadow-sm">
              <Plus className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 truncate max-w-[64px]">
            Your story
          </span>
        </div>

        {/* Active Stories List */}
        {stories.map((story, index) => (
          <div
            key={story.id}
            className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer"
            onClick={() => setSelectedStoryIndex(index)}
          >
            <Avatar
              src={story.author?.avatar_url}
              alt={story.author?.username || 'Story'}
              size="lg"
              hasStory={true}
              storyViewed={story.has_viewed}
            />
            <span className="text-[11px] font-medium text-neutral-700 dark:text-neutral-300 truncate max-w-[64px]">
              {story.author?.username}
            </span>
          </div>
        ))}
      </div>

      {/* Story Viewer Modal */}
      {selectedStoryIndex !== null && (
        <StoryViewerModal
          isOpen={true}
          stories={stories}
          initialIndex={selectedStoryIndex}
          onClose={() => {
            setSelectedStoryIndex(null);
            fetchStories(); // refresh viewed state
          }}
        />
      )}

      {/* Story Creator Modal */}
      <CreateStoryModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onStoryCreated={() => {
          fetchStories();
        }}
      />
    </div>
  );
};
