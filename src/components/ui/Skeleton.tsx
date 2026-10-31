import React from 'react';
import { cn } from '../../lib/utils';

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-lg',
        className
      )}
    />
  );
};

export const PostCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#121214] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 space-y-4 mb-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full shrink-0" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-2.5 w-16" />
        </div>
      </div>
      {/* Media Image */}
      <Skeleton className="w-full aspect-square rounded-xl" />
      {/* Action buttons */}
      <div className="flex items-center gap-3">
        <Skeleton className="w-7 h-7 rounded-lg" />
        <Skeleton className="w-7 h-7 rounded-lg" />
        <Skeleton className="w-7 h-7 rounded-lg" />
        <Skeleton className="w-7 h-7 rounded-lg ml-auto" />
      </div>
      {/* Text lines */}
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
};

export const StorySkeleton: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-1.5 shrink-0 w-16">
      <Skeleton className="w-16 h-16 rounded-full" />
      <Skeleton className="h-2.5 w-12" />
    </div>
  );
};

export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <Skeleton className="w-24 h-24 sm:w-28 sm:h-28 rounded-full shrink-0" />
        <div className="space-y-3 flex-1">
          <Skeleton className="h-5 w-40" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-3.5 w-3/4" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1 sm:gap-2 pt-6 border-t border-neutral-200 dark:border-neutral-800">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-lg" />
        ))}
      </div>
    </div>
  );
};
