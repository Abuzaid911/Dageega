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
    <article className="flex h-full flex-col rounded-2xl border border-warmgray/60 bg-white p-5 shadow-subtle transition will-change-transform hover:-translate-y-0.5 hover:shadow-lg">
      <header className="mb-4 flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-charcoal">{post.sourceName}</p>
          <p className="text-xs text-charcoal/70">
            <span className="me-1" aria-hidden>
              {platform.icon}
            </span>
            <span>
              {platform.label[lang]}
              {post.authorHandle ? ` · ${post.authorHandle}` : ''}
            </span>
          </p>
        </div>
        <time
          className="shrink-0 text-xs text-charcoal/60"
          dateTime={post.publishedAt}
          title={formatAbsolute(post.publishedAt, lang)}
        >
          {formatRelative(post.publishedAt, lang)}
        </time>
      </header>
      {headline && (
        <h3 className="mb-3 text-lg font-semibold leading-snug text-charcoal" dir={contentDir}>
          {headline}
        </h3>
      )}
      {post.text && post.title && (
        <p className="mb-3 text-sm leading-relaxed text-charcoal/80" dir={contentDir}>
          {truncate(post.text, 180)}
        </p>
      )}
      {post.mediaThumbUrl && (
        <img
          src={post.mediaThumbUrl}
          alt={`${post.sourceName} visual`}
          loading="lazy"
          className="mb-3 w-full rounded-xl object-cover"
        />
      )}
      {post.embedHtml && (
        <div
          className="mb-3 overflow-hidden rounded-xl border border-warmgray/80 bg-black/5"
          dangerouslySetInnerHTML={{ __html: post.embedHtml }}
        />
      )}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={`${post.id}-${tag}`}
              className="rounded-full border border-warmgray/80 bg-white px-3 py-1 text-xs font-medium uppercase tracking-wide text-charcoal/70"
            >
              {tag}
            </span>
          ))}
        </div>
        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-olive hover:text-charcoal"
        >
          {copy.feed.openSource}
        </a>
      </div>
    </article>
  );
});

export default PostCard;
