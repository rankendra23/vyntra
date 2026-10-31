import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { Story } from '../../types';
import { Avatar } from '../../components/ui/Avatar';
import { storyService } from '../../services/storyService';
import { useAuth } from '../auth/AuthContext';
import { formatTimeAgo } from '../../lib/utils';

interface StoryViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  stories: Story[];
  initialIndex?: number;
}

const STORY_DURATION = 5000; // 5 seconds per photo story

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  isOpen,
  onClose,
  stories,
  initialIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const { user } = useAuth();
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const elapsedBeforePauseRef = useRef<number>(0);

  const currentStory = stories[currentIndex];

  const handleNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
      elapsedBeforePauseRef.current = 0;
      startTimeRef.current = Date.now();
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
      elapsedBeforePauseRef.current = 0;
      startTimeRef.current = Date.now();
    }
  }, [currentIndex]);

  // Mark story as viewed
  useEffect(() => {
    if (!isOpen || !currentStory) return;
    if (user) {
      storyService.markViewed(currentStory.id, user.id);
    }
  }, [isOpen, currentStory, user]);

  // Timer loop for progress bar
  useEffect(() => {
    if (!isOpen || !currentStory || isPaused) return;

    startTimeRef.current = Date.now() - elapsedBeforePauseRef.current;

    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min(100, (elapsed / STORY_DURATION) * 100);
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        handleNext();
      }
    }, 50);

    timerRef.current = interval;

    return () => clearInterval(interval);
  }, [isOpen, currentIndex, isPaused, handleNext, currentStory]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  if (!isOpen || !currentStory) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-fade-in select-none"
    >
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label="Close stories"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Main Story Container */}
      <div
        className="relative w-full max-w-sm h-[90vh] max-h-[750px] bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between"
        onMouseDown={() => {
          setIsPaused(true);
          elapsedBeforePauseRef.current = Date.now() - startTimeRef.current;
        }}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => {
          setIsPaused(true);
          elapsedBeforePauseRef.current = Date.now() - startTimeRef.current;
        }}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Progress Bars */}
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center gap-1.5">
          {stories.map((s, idx) => {
            let widthPct = 0;
            if (idx < currentIndex) widthPct = 100;
            else if (idx === currentIndex) widthPct = progress;

            return (
              <div
                key={s.id}
                className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-white transition-all duration-75 rounded-full"
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* Top Header: Author & Time */}
        <div className="absolute top-6 left-3 right-3 z-20 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <Avatar
              src={currentStory.author?.avatar_url}
              alt={currentStory.author?.username || 'User'}
              size="sm"
            />
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold truncate max-w-[140px]">
                {currentStory.author?.username}
              </span>
              <span className="text-[11px] text-white/70">
                {formatTimeAgo(currentStory.created_at)}
              </span>
            </div>
          </div>

          {isPaused && (
            <div className="p-1 rounded-full bg-black/40 text-white/80">
              <Pause className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        {/* Media display */}
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          {currentStory.media_type === 'video' ? (
            <video
              src={currentStory.media_url}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={currentStory.media_url}
              alt={currentStory.caption || 'Story'}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Story Caption (if any) */}
        {currentStory.caption && (
          <div className="absolute bottom-6 left-4 right-4 z-20 px-4 py-2.5 rounded-2xl bg-black/60 backdrop-blur-md text-white text-xs font-medium text-center">
            {currentStory.caption}
          </div>
        )}

        {/* Left/Right click targets */}
        <div
          className="absolute inset-y-0 left-0 w-1/3 z-10 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
        />
        <div
          className="absolute inset-y-0 right-0 w-2/3 z-10 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
        />
      </div>

      {/* Desktop Prev/Next Buttons */}
      {currentIndex > 0 && (
        <button
          type="button"
          onClick={handlePrev}
          className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Previous story"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}
      {currentIndex < stories.length - 1 && (
        <button
          type="button"
          onClick={handleNext}
          className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Next story"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};
