'use client';

import { memo } from 'react';

import type { Post, Platform } from '@/types/post';

import { formatAbsolute, formatRelative } from '../_lib/dayjs';
import { getCopy } from '../_lib/i18n';
import { useLanguage } from '../providers';

const PLATFORM_META: Record<Platform, { icon: string; label: { en: string; ar: string } }> = {
  rss: { icon: '📰', label: { en: 'Newswire', ar: 'وكالة' } },
  x: { icon: '𝕏', label: { en: 'X', ar: 'إكس' } },
  yt: { icon: '▶️', label: { en: 'YouTube', ar: 'يوتيوب' } },
  ig: { icon: '📷', label: { en: 'Instagram', ar: 'إنستغرام' } },
  fb: { icon: '📘', label: { en: 'Facebook', ar: 'فيسبوك' } },
  web: { icon: '🌐', label: { en: 'Web', ar: 'ويب' } }
};

const truncate = (value: string, max = 140) => {
  if (value.length <= max) return value;
  return `${value.slice(0, max).trim()}…`;
};

const PostCard = memo(function PostCard({ post }: { post: Post }) {
  const { lang } = useLanguage();
  const copy = getCopy(lang);
  const displayLang = post.lang === 'both' ? lang : post.lang;
  const contentDir = displayLang === 'ar' ? 'rtl' : 'ltr';

  const headline = post.title ?? (post.text ? truncate(post.text, 140) : undefined);

  const platform = PLATFORM_META[post.platform];

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-warmgray/60 bg-white p-6 shadow-subtle transition-all duration-300 hover:-translate-y-1 hover:border-olive/20 hover:shadow-xl">
      {/* Subtle gradient overlay on hover */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-olive/0 via-transparent to-olive/0 opacity-0 transition-opacity duration-300 group-hover:opacity-5" />
      
      <header className="mb-4 flex items-start justify-between gap-3">
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-olive/10 to-olive/5 text-base">
              {platform.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-charcoal">{post.sourceName}</p>
              <p className="flex items-center gap-1.5 text-xs text-charcoal/60">
                <span className="shrink-0">{platform.label[lang]}</span>
                {post.authorHandle && (
                  <>
                    <span className="text-warmgray/60">·</span>
                    <span className="truncate text-olive/80">{post.authorHandle}</span>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
        <time
          className="shrink-0 rounded-full bg-warmgray/40 px-2.5 py-1 text-xs font-medium text-charcoal/70 backdrop-blur-sm"
          dateTime={post.publishedAt}
          title={formatAbsolute(post.publishedAt, lang)}
        >
          {formatRelative(post.publishedAt, lang)}
        </time>
      </header>
      
      {headline && (
        <h3 className="mb-3 line-clamp-2 text-lg font-bold leading-tight text-charcoal transition-colors group-hover:text-olive" dir={contentDir}>
          {headline}
        </h3>
      )}
      
      {post.text && post.title && (
        <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-charcoal/75" dir={contentDir}>
          {truncate(post.text, 180)}
        </p>
      )}
      
      {post.mediaThumbUrl && (
        <div className="relative mb-4 overflow-hidden rounded-xl">
          <img
            src={post.mediaThumbUrl}
            alt={`${post.sourceName} visual`}
            loading="lazy"
            className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      )}
      
      {post.embedHtml && (
        <div
          className="mb-4 overflow-hidden rounded-xl border border-warmgray/80 bg-black/5 transition-transform duration-300 group-hover:scale-[1.02]"
          dangerouslySetInnerHTML={{ __html: post.embedHtml }}
        />
      )}
      
      <div className="relative z-10 mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-warmgray/40 pt-4">
        <div className="flex flex-wrap gap-1.5">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={`${post.id}-${tag}`}
              className="inline-flex items-center rounded-full border border-olive/20 bg-gradient-to-r from-olive/5 to-olive/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-olive/90 backdrop-blur-sm transition-colors hover:border-olive/40 hover:from-olive/10 hover:to-olive/15"
            >
              {tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="inline-flex items-center rounded-full border border-warmgray/60 bg-warmgray/30 px-2.5 py-1 text-xs font-medium text-charcoal/60">
              +{post.tags.length - 3}
            </span>
          )}
        </div>
        {post.url && (
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link inline-flex items-center gap-1.5 rounded-full bg-olive/10 px-4 py-1.5 text-sm font-semibold text-olive transition-all hover:bg-olive hover:text-white hover:shadow-md active:scale-95"
          >
            <span>{copy.feed.openSource}</span>
            <span className="transition-transform group-hover/link:translate-x-0.5">→</span>
          </a>
        )}
      </div>
    </article>
  );
});

export default PostCard;
