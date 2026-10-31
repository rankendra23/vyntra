import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  X,
  Layers,
  Film,
  Heart,
  MessageCircle,
  TrendingUp,
  Hash,
  Users,
} from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { Post, Profile } from '../../types';
import { postService } from '../../services/postService';
import { profileService } from '../../services/profileService';
import { useDebounce } from '../../hooks/useDebounce';
import { PostCommentsModal } from '../feed/PostCommentsModal';
import { Skeleton } from '../../components/ui/Skeleton';

const TRENDING_TAGS = [
  'architecture',
  'tokyo',
  'minimalism',
  'travel',
  'webdev',
  'designsystem',
  'photography',
  'dolomites',
];

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTag = searchParams.get('tag') || '';

  const [searchQuery, setSearchQuery] = useState(initialTag ? `#${initialTag}` : '');
  const [filterType, setFilterType] = useState<'all' | 'people' | 'tags'>('all');
  const [posts, setPosts] = useState<Post[]>([]);
  const [userResults, setUserResults] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const debouncedQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    let mounted = true;
    const loadExploreData = async () => {
      try {
        setLoading(true);
        const allPosts = await postService.getFeedPosts();
        if (mounted) {
          // Exclude posts from private authors that viewer doesn't follow
          const publicPosts = allPosts.filter((p) => !p.author?.is_private);
          setPosts(publicPosts);
        }
      } catch (err) {
        console.error('Failed to load explore feed:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadExploreData();
    return () => {
      mounted = false;
    };
  }, []);

  // Handle debounced search for users
  useEffect(() => {
    let mounted = true;
    const runSearch = async () => {
      const clean = debouncedQuery.replace(/^#/, '').trim();
      if (!clean) {
        setUserResults([]);
        return;
      }
      try {
        const users = await profileService.searchProfiles(clean);
        if (mounted) {
          setUserResults(users);
        }
      } catch {
        // ignore
      }
    };
    runSearch();
    return () => {
      mounted = false;
    };
  }, [debouncedQuery]);

  // Filter posts based on search query
  const filteredPosts = useMemo(() => {
    if (!debouncedQuery.trim()) return posts;
    const query = debouncedQuery.toLowerCase().trim();

    return posts.filter((post) => {
      const captionMatch = post.caption.toLowerCase().includes(query);
      const locationMatch = post.location?.toLowerCase().includes(query);
      return captionMatch || locationMatch;
    });
  }, [posts, debouncedQuery]);

  const handleTagClick = (tag: string) => {
    setSearchQuery(`#${tag}`);
    setSearchParams({ tag });
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchParams({});
    setUserResults([]);
  };

  return (
    <div className="w-full max-w-5xl px-3 sm:px-4 py-4 space-y-6">
      {/* Search Header */}
      <div className="relative max-w-lg mx-auto">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-4 h-4 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search creators, captions, or #hashtags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-3 bg-neutral-100 dark:bg-neutral-800/80 rounded-2xl text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all border border-transparent dark:border-neutral-700/50"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3.5 p-1 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Trending Hashtags Badges */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 pl-1 shrink-0">
          <TrendingUp className="w-4 h-4" />
          <span>Trending:</span>
        </div>
        {TRENDING_TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => handleTagClick(tag)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 ${
              searchQuery.toLowerCase() === `#${tag}`
                ? 'bg-teal-600 text-white font-semibold shadow-sm'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Search Results for People */}
      {searchQuery && userResults.length > 0 && (
        <div className="bg-white dark:bg-[#121214] border border-neutral-200 dark:border-neutral-800 rounded-3xl p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Creators Matching "{searchQuery}"</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {userResults.map((u) => (
              <Link
                key={u.id}
                to={`/profile/${u.username}`}
                className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700/60"
              >
                <Avatar src={u.avatar_url} alt={u.username} size="md" />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                    {u.username}
                  </span>
                  <span className="text-[11px] text-neutral-500 truncate">
                    {u.full_name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Explore Grid of Posts */}
      {loading ? (
        <div className="grid grid-cols-3 gap-1 sm:gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-2xl" />
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-16 text-neutral-400">
          <Hash className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <h3 className="text-base font-semibold text-neutral-700 dark:text-neutral-300">
            No matching posts found
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            Try searching for another keyword or hashtag.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1 sm:gap-4">
          {filteredPosts.map((post) => {
            const hasMultiple = post.media && post.media.length > 1;
            const isVideo = post.media && post.media[0]?.media_type === 'video';

            return (
              <div
                key={post.id}
                onClick={() => setSelectedPostId(post.id)}
                className="group relative aspect-square bg-neutral-100 dark:bg-neutral-900 rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer shadow-sm select-none"
              >
                {post.media && post.media[0] ? (
                  isVideo ? (
                    <video
                      src={post.media[0].media_url}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={post.media[0].media_url}
                      alt={post.caption}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  )
                ) : null}

                {/* Multi-image / Video indicator */}
                <div className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 text-white backdrop-blur-sm pointer-events-none">
                  {hasMultiple ? (
                    <Layers className="w-4 h-4" />
                  ) : isVideo ? (
                    <Film className="w-4 h-4" />
                  ) : null}
                </div>

                {/* Hover stats overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white text-sm font-bold">
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-5 h-5 fill-white" />
                    <span>{post.likes_count}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MessageCircle className="w-5 h-5 fill-white" />
                    <span>{post.comments_count}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Post Modal when clicked */}
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
