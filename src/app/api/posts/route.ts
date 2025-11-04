import { NextRequest, NextResponse } from 'next/server';

import type { Post, Platform } from '@/types/post';

type ApiEvent = {
  id: string;
  platform: string;
  source_id?: string;
  author_name?: string;
  title?: string;
  text?: string;
  url: string;
  embed_html?: string | null;
  media_thumb_url?: string | null;
  published_at: string;
  tags?: string[];
  langOriginal?: string;
  titleAR?: string;
  titleEN?: string;
  summaryAR?: string;
  summaryEN?: string;
  bodyAR?: string;
  bodyEN?: string;
  categories?: string[];
  regions?: string[];
};

type ApiResponse = {
  status: string;
  page: number;
  limit: number;
  total: number;
  events: ApiEvent[];
};

const normalize = (value: string | null | undefined) => (value ? value.toLowerCase() : null);

const mapPlatform = (platform: string): Platform => {
  const normalized = platform.toLowerCase();
  if (normalized === 'x' || normalized === 'twitter') return 'x';
  if (normalized === 'yt' || normalized === 'youtube') return 'yt';
  if (normalized === 'ig' || normalized === 'instagram') return 'ig';
  if (normalized === 'fb' || normalized === 'facebook') return 'fb';
  if (normalized === 'web' || normalized === 'website') return 'web';
  return 'rss'; // default to rss
};

const mapLang = (langOriginal?: string, titleAR?: string, titleEN?: string): 'ar' | 'en' | 'both' => {
  const hasAR = !!titleAR || langOriginal === 'ar';
  const hasEN = !!titleEN || langOriginal === 'en';
  
  if (hasAR && hasEN) return 'both';
  if (hasAR) return 'ar';
  if (hasEN) return 'en';
  return langOriginal === 'ar' ? 'ar' : 'en';
};

const transformEvent = (event: ApiEvent, langParam?: string | null): Post | null => {
  const lang = mapLang(event.langOriginal, event.titleAR, event.titleEN);
  
  // Filter by language if specified
  if (langParam === 'en' && lang === 'ar') return null;
  if (langParam === 'ar' && lang === 'en') return null;

  // Determine title and text based on language preference
  let title: string | undefined;
  let text: string | undefined;

  if (langParam === 'ar' || (!langParam && lang === 'ar')) {
    title = event.titleAR || event.title;
    text = event.bodyAR || event.summaryAR || event.text;
  } else if (langParam === 'en' || (!langParam && lang === 'en')) {
    title = event.titleEN || event.title;
    text = event.bodyEN || event.summaryEN || event.text;
  } else {
    // For 'both' or no preference, prioritize English if available
    title = event.titleEN || event.titleAR || event.title;
    text = event.bodyEN || event.summaryEN || event.bodyAR || event.summaryAR || event.text;
  }

  // Combine tags, categories, and regions into tags array
  const allTags: string[] = [];
  
  // Add tags if available
  if (event.tags && event.tags.length > 0) {
    allTags.push(...event.tags);
  }
  
  // Add categories if available
  if (event.categories && event.categories.length > 0) {
    allTags.push(...event.categories);
  }
  
  // Add regions if available
  if (event.regions && event.regions.length > 0) {
    allTags.push(...event.regions);
  }
  
  const tags = allTags;

  // Filter out posts with unknown sources
  const sourceName = event.author_name || event.source_id;
  if (!sourceName) {
    return null; // Skip posts without a valid source
  }

  // Create author handle for X platform
  let authorHandle: string | undefined;
  if (event.platform === 'x' && event.author_name) {
    // Try to extract handle from author_name if it looks like a handle
    if (event.author_name.startsWith('@')) {
      authorHandle = event.author_name;
    } else {
      // Create a handle-like format from source_id or author_name
      authorHandle = event.source_id ? `@${event.source_id}` : undefined;
    }
  }

  return {
    id: event.id,
    platform: mapPlatform(event.platform),
    sourceName,
    authorHandle,
    title,
    text,
    url: event.url,
    embedHtml: event.embed_html,
    mediaThumbUrl: event.media_thumb_url,
    publishedAt: event.published_at,
    tags,
    lang
  };
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limitParam = Math.max(1, Math.min(50, Number(searchParams.get('limit')) || 12));
  const offsetParam = Math.max(0, Number(searchParams.get('offset')) || 0);
  const langParam = searchParams.get('lang');
  const tagParam = searchParams.get('tag');
  const normalizedTag = normalize(tagParam);
  const queryParam = normalize(searchParams.get('q'));

  try {
    // Fetch all posts from external API by paginating through all pages
    const allEvents: ApiEvent[] = [];
    let currentPage = 1;
    let hasMorePages = true;
    const perPage = 100; // Try higher limit first, API may support it

    while (hasMorePages) {
      const apiUrl = new URL('https://dageega.duckdns.org/api/event');
      // Use the perPage limit, but API might cap it at 20
      apiUrl.searchParams.set('limit', String(perPage));
      apiUrl.searchParams.set('page', String(currentPage));

      const response = await fetch(apiUrl.toString(), {
        next: { revalidate: 60 } // Cache for 60 seconds
      });

      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }

      const apiData = (await response.json()) as ApiResponse;
      
      // Add events from this page
      if (apiData.events && apiData.events.length > 0) {
        allEvents.push(...apiData.events);
      }

      // Check if there are more pages
      // The API returns the actual limit used in the response
      const actualLimit = apiData.limit || apiData.events.length;
      const totalAvailable = apiData.total || 0;
      const totalFetched = allEvents.length;
      
      // Stop if:
      // 1. We got fewer events than requested (no more pages)
      // 2. We've fetched all available events
      // 3. We got 0 events on this page
      if (apiData.events.length === 0 || 
          apiData.events.length < actualLimit || 
          (totalAvailable > 0 && totalFetched >= totalAvailable)) {
        hasMorePages = false;
      } else {
        currentPage++;
        // Safety limit: don't fetch more than 100 pages to prevent infinite loops
        // (100 pages * 20 per page = 2000 posts max)
        if (currentPage > 100) {
          hasMorePages = false;
        }
      }
    }

    // Transform events to Posts
    let posts = allEvents
      .map((event) => transformEvent(event, langParam))
      .filter((post): post is Post => post !== null);

    // Apply tag filter (case-insensitive exact matching)
    if (normalizedTag) {
      posts = posts.filter((post) =>
        post.tags.some((tag) => {
          const normalizedPostTag = normalize(tag);
          // Exact match
          if (normalizedPostTag === normalizedTag) return true;
          // Handle variations like "Blue Nile" vs "bluenile" or "blue-nile"
          const cleanPostTag = normalizedPostTag.replace(/[\s-]/g, '');
          const cleanFilterTag = normalizedTag.replace(/[\s-]/g, '');
          return cleanPostTag === cleanFilterTag;
        })
      );
    }

    // Apply query filter
    if (queryParam) {
      posts = posts.filter((post) => {
        const searchText = `${post.title ?? ''} ${post.text ?? ''} ${post.sourceName}`.toLowerCase();
        return searchText.includes(queryParam);
      });
    }

    // Sort by published date (newest first)
    posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    const total = posts.length;
    const slice = posts.slice(offsetParam, offsetParam + limitParam);

    return NextResponse.json({
      data: slice,
      total,
      limit: limitParam,
      offset: offsetParam,
      hasMore: offsetParam + limitParam < total
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
