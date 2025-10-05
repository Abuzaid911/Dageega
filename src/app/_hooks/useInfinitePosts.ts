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

  const fetchPage = useCallback(
    async (offset: number, append: boolean) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setError(null);
      if (append) {
        setIsFetchingMore(true);
      } else {
        setIsLoading(true);
        setPosts([]);
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
        setPosts((prev) => (append ? [...prev, ...payload.data] : payload.data));
        setHasMore(payload.hasMore);
        setLastFetchedAt(new Date());
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          return;
        }
        setError(err as Error);
      } finally {
        if (append) {
          setIsFetchingMore(false);
        } else {
          setIsLoading(false);
        }
      }
    },
    [lang, pageSize, query, tag]
  );

  useEffect(() => {
    fetchPage(0, false);
    return () => {
      abortRef.current?.abort();
    };
  }, [fetchPage]);

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
