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
      router.replace((next ? `${pathname}?${next}` : pathname) as any, { scroll: false });
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
        <div className="flex flex-col gap-4 border-b border-warmgray/60 pb-6 md:flex-row md:items-center md:justify-between">
          <FiltersBar
            activeCategory={category}
            onCategoryChange={handleCategoryChange}
            selectedRegion={region}
            onRegionChange={handleRegionChange}
          />
          <SearchBox value={searchTerm} onDebouncedChange={handleSearchChange} />
        </div>

        {error && (
          <div className="rounded-xl border-2 border-red-200 bg-gradient-to-r from-red-50 to-red-40/50 p-5 shadow-md" role="alert">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0">
                <svg className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-900">Something went wrong while loading updates.</p>
                <button
                  onClick={refreshHandler}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-red-700 hover:shadow-md"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-warmgray/60 bg-gradient-to-br from-white to-warmgray/20 p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-olive/10">
              <svg className="h-8 w-8 text-olive/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-base font-semibold text-charcoal/80">{copy.feed.emptyState}</p>
            <p className="mt-2 text-sm text-charcoal/60">Try adjusting your filters or search terms</p>
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
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-olive to-olive/90 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-olive/20 transition-all hover:scale-105 hover:shadow-xl hover:shadow-olive/30"
            >
              <span>{copy.feed.loadMore}</span>
              <svg className="h-4 w-4 transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}

        <div ref={sentinelRef} aria-hidden className="h-px w-full" />
      </div>
    </section>
  );
};

export default Feed;
