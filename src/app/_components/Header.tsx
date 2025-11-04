'use client';

import { memo } from 'react';

import { formatAbsolute, formatRelative } from '../_lib/dayjs';
import { getCopy } from '../_lib/i18n';
import { useLanguage } from '../providers';
import LanguageToggle from './LanguageToggle';

const Header = memo(function Header({
  lastUpdatedAt
}: {
  lastUpdatedAt: Date | null;
}) {
  const { lang } = useLanguage();
  const copy = getCopy(lang);

  const updatedLabel = lastUpdatedAt
    ? formatRelative(lastUpdatedAt, lang)
    : copy.header.updatedFallback;

  return (
    <header className="sticky top-0 z-30 border-b border-warmgray/60 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-olive to-olive/80 text-lg font-bold text-white shadow-lg shadow-olive/30 transition-transform hover:scale-105">
              1
            </span>
            {lastUpdatedAt && (
              <span className="absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full bg-green-500 ring-2 ring-white" />
            )}
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold uppercase tracking-wider text-olive">
              {copy.header.titlePrimary}
            </span>
            <span className="text-xs font-medium text-charcoal/70" dir="rtl">
              {copy.header.titleSecondary}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          {lastUpdatedAt && (
            <div className="hidden items-center gap-2 rounded-full bg-olive/10 px-3 py-1.5 sm:flex">
              <div className="relative">
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                <div className="absolute inset-0 h-2 w-2 animate-ping rounded-full bg-green-500 opacity-75" />
              </div>
              <p
                className="text-sm font-medium text-charcoal/80"
                title={formatAbsolute(lastUpdatedAt, lang)}
              >
                <span className="text-xs text-charcoal/60">{copy.header.updatedLabel}:</span>{' '}
                <span className="font-semibold">{updatedLabel}</span>
              </p>
            </div>
          )}
          {!lastUpdatedAt && (
            <p className="hidden text-sm text-charcoal/60 sm:block">
              {copy.header.updatedFallback}
            </p>
          )}
          <p
            className="text-xs text-charcoal/60 sm:hidden"
            title={lastUpdatedAt ? formatAbsolute(lastUpdatedAt, lang) : undefined}
          >
            {updatedLabel}
          </p>
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
});

export default Header;
