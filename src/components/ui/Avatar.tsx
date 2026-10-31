import React, { useState } from 'react';
import { User } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  hasStory?: boolean;
  storyViewed?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'User avatar',
  size = 'md',
  hasStory = false,
  storyViewed = false,
  onClick,
  className,
}) => {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
    '2xl': 'w-28 h-28 text-3xl',
  };

  const ringPaddings = {
    xs: 'p-[1.5px]',
    sm: 'p-[2px]',
    md: 'p-[2.5px]',
    lg: 'p-[3px]',
    xl: 'p-[3.5px]',
    '2xl': 'p-[4px]',
  };

  const innerAvatar = (
    <div
      className={cn(
        'relative rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center font-semibold text-neutral-600 dark:text-neutral-300 select-none shrink-0 border border-black/5 dark:border-white/10',
        sizeClasses[size]
      )}
    >
      {src && !hasError ? (
        <img
          src={src}
          alt={alt}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <User className="w-1/2 h-1/2 text-neutral-400 dark:text-neutral-500" />
      )}
    </div>
  );

  if (hasStory) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'rounded-full transition-transform active:scale-95 inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2',
          ringPaddings[size],
          storyViewed ? 'story-ring-viewed' : 'story-ring-gradient',
          className
        )}
      >
        <div className="rounded-full bg-white dark:bg-[#0c0c0e] p-[2px]">
          {innerAvatar}
        </div>
      </button>
    );
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        onClick && 'cursor-pointer active:scale-95 transition-transform',
        'inline-flex',
        className
      )}
    >
      {innerAvatar}
    </div>
  );
};
