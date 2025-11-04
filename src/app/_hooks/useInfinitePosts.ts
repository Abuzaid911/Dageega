'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import type { Post } from '@/types/post';

import type { UILanguage } from '../_lib/i18n';

type UseInfinitePostsArgs = {
  lang: UILanguage;
  tag?: string;
  query?: string;
  pageSize?: number;
};

type ApiResponse = {
  data: Post[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
};

export const useInfinitePosts = ({ lang, tag, query, pageSize = 12 }: UseInfinitePostsArgs) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetchedAt, setLastFetchedAt] = useState<Date | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchPage = useCallback(
    async (offset: number, append: boolean, isPolling = false) => {
      // Don't abort if this is a polling request (silent update)
      if (!isPolling) {
        abortRef.current?.abort();
      }
      const controller = new AbortController();
      if (!isPolling) {
        abortRef.current = controller;
      }

      setError(null);
      // Don't show loading state for polling updates
      if (!isPolling) {
        if (append) {
          setIsFetchingMore(true);
        } else {
          setIsLoading(true);
          setPosts([]);
        }
      }

      try {
        const params = new URLSearchParams({
          limit: String(pageSize),
          offset: String(offset),
          lang
        });
        if (tag) params.set('tag', tag);
        if (query) params.set('q', query);

        const response = await fetch(`/api/posts?${params.toString()}`, {
          cache: 'no-store',
          signal: controller.signal
        });
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const payload = (await response.json()) as ApiResponse;
        
        // For polling, only update if we're on the first page and not appending
        if (isPolling && offset === 0 && !append) {
          setPosts(payload.data);
        } else {
          setPosts((prev) => (append ? [...prev, ...payload.data] : payload.data));
        }
        setHasMore(payload.hasMore);
        setLastFetchedAt(new Date());
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          return;
        }
        // Only set error for non-polling requests
        if (!isPolling) {
          setError(err as Error);
        }
      } finally {
        if (!isPolling) {
          if (append) {
            setIsFetchingMore(false);
          } else {
            setIsLoading(false);
          }
        }
      }
    },
    [lang, pageSize, query, tag]
  );

  // Initial fetch
  useEffect(() => {
    fetchPage(0, false);
    return () => {
      abortRef.current?.abort();
    };
  }, [fetchPage]);

  // Polling: fetch every 1 minute (only when page is visible)
  useEffect(() => {
    // Clear any existing interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    const startPolling = () => {
      // Set up polling interval (60 seconds = 1 minute)
      pollingIntervalRef.current = setInterval(() => {
        // Only poll if page is visible and not currently loading
        if (document.visibilityState === 'visible' && !isLoading && !isFetchingMore) {
          fetchPage(0, false, true);
        }
      }, 60000); // 60000ms = 1 minute
    };

    // Start polling if page is visible
    if (document.visibilityState === 'visible') {
      startPolling();
    }

    // Handle visibility change (pause/resume polling)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Page became visible, start polling
        startPolling();
        // Also fetch immediately when page becomes visible
        if (!isLoading && !isFetchingMore) {
          fetchPage(0, false, true);
        }
      } else {
        // Page became hidden, stop polling
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup on unmount or when dependencies change
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchPage, isLoading, isFetchingMore]);

  const loadMore = useCallback(() => {
    if (!hasMore || isFetchingMore || isLoading) return;
    fetchPage(posts.length, true);
  }, [fetchPage, hasMore, isFetchingMore, isLoading, posts.length]);

  const refresh = useCallback(() => {
    fetchPage(0, false);
  }, [fetchPage]);

  return {
    posts,
    hasMore,
    isLoading,
    isFetchingMore,
    error,
    loadMore,
    refresh,
    lastFetchedAt
  };
};
