'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useInfinitePosts } from '../_hooks/useInfinitePosts';
import {
  CATEGORY_VALUES,
  CategoryValue,
  getCopy
} from '../_lib/i18n';
import { useLanguage } from '../providers';
import FiltersBar from './FiltersBar';
import PostCard from './PostCard';
import SearchBox from './SearchBox';
import SkeletonCard from './SkeletonCard';

const DEFAULT_CATEGORY: CategoryValue = 'All';

const Feed = ({ onUpdated }: { onUpdated: (date: Date) => void }) => {
  const { lang } = useLanguage();
  const copy = getCopy(lang);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const categoryParam = (searchParams.get('category') as CategoryValue) ?? DEFAULT_CATEGORY;
  const regionParam = searchParams.get('region') ?? '';
  const queryParam = searchParams.get('q') ?? '';

  const [category, setCategory] = useState<CategoryValue>(categoryParam);
  const [region, setRegion] = useState(regionParam);
  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [observerSupported, setObserverSupported] = useState(false);

  useEffect(() => {
    const nextCategory = CATEGORY_VALUES.includes(categoryParam) ? categoryParam : DEFAULT_CATEGORY;
    setCategory(nextCategory);
    setRegion(regionParam);
    setSearchTerm(queryParam);
  }, [categoryParam, queryParam, regionParam]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      setObserverSupported(true);
    }
  }, []);

  const tagParam = useMemo(() => {
    if (category === 'All') return undefined;
    if (category === 'Regions') return region || undefined;
    return category;
  }, [category, region]);

  const { posts, isLoading, isFetchingMore, hasMore, loadMore, lastFetchedAt, error, refresh } = useInfinitePosts({
    lang,
    tag: tagParam,
    query: searchTerm
  });

  useEffect(() => {
    if (lastFetchedAt) {
      onUpdated(lastFetchedAt);
    }
  }, [lastFetchedAt, onUpdated]);

  const updateUrl = useCallback(
    (updates: { category?: CategoryValue; region?: string; q?: string }) => {
      const params = new URLSearchParams(searchParams.toString());

      if (updates.category !== undefined) {
        if (updates.category === 'All') {
          params.delete('category');
        } else {
          params.set('category', updates.category);
        }
      }

      if (updates.region !== undefined) {
        if (!updates.region) {
          params.delete('region');
        } else {
          params.set('region', updates.region);
        }
      }

      if (updates.q !== undefined) {
        if (!updates.q) {
          params.delete('q');
        } else {
          params.set('q', updates.q);
        }
      }

      const next = params.toString();
      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const handleCategoryChange = useCallback(
    (next: CategoryValue) => {
      setCategory(next);
      if (next !== 'Regions') {
        setRegion('');
        updateUrl({ category: next, region: '', q: searchTerm });
      } else {
        updateUrl({ category: next, region, q: searchTerm });
      }
    },
    [region, searchTerm, updateUrl]
  );

  const handleRegionChange = useCallback(
    (value: string) => {
      const nextRegion = value;
      setRegion(nextRegion);
      setCategory('Regions');
      updateUrl({ category: 'Regions', region: nextRegion, q: searchTerm });
    },
    [searchTerm, updateUrl]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value);
      updateUrl({ q: value, category, region: category === 'Regions' ? region : '' });
    },
    [category, region, updateUrl]
  );

  const manualLoadHandler = useCallback(() => {
    loadMore();
  }, [loadMore]);

  const refreshHandler = useCallback(() => {
    refresh();
  }, [refresh]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!observerSupported || !hasMore) return;
    const target = sentinelRef.current;
    if (!target) return;

    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry?.isIntersecting) {
        loadMore();
      }
    });
    observerRef.current.observe(target);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [hasMore, loadMore, observerSupported, posts.length]);

  return (
    <section className="mx-auto max-w-6xl" aria-live="polite">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 border-b border-warmgray/60 pb-4 md:flex-row md:items-center md:justify-between">
          <FiltersBar
            activeCategory={category}
            onCategoryChange={handleCategoryChange}
            selectedRegion={region}
            onRegionChange={handleRegionChange}
          />
          <SearchBox value={searchTerm} onDebouncedChange={handleSearchChange} />
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
            Something went wrong while loading updates.{' '}
            <button onClick={refreshHandler} className="font-semibold underline">
              Retry
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl border border-warmgray/70 bg-white p-12 text-center text-sm text-charcoal/70">
            {copy.feed.emptyState}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
            {isFetchingMore &&
              Array.from({ length: 2 }).map((_, index) => <SkeletonCard key={`more-${index}`} />)}
          </div>
        )}

        {hasMore && !observerSupported && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={manualLoadHandler}
              className="rounded-full bg-olive px-6 py-2 text-sm font-semibold text-white shadow-subtle hover:bg-olive/90"
            >
              {copy.feed.loadMore}
            </button>
          </div>
        )}

        <div ref={sentinelRef} aria-hidden className="h-px w-full" />
      </div>
    </section>
  );
};

export default Feed;
