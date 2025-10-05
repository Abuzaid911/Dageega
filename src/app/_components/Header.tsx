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
    <header className="sticky top-0 z-30 border-b border-warmgray/70 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-sm bg-olive text-base font-semibold text-white">
            1
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold uppercase tracking-wide text-olive">
              {copy.header.titlePrimary}
            </span>
            <span className="text-sm text-charcoal/70" dir="rtl">
              {copy.header.titleSecondary}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <p
            className="hidden text-sm text-charcoal/70 sm:block"
            title={lastUpdatedAt ? formatAbsolute(lastUpdatedAt, lang) : undefined}
          >
            <span className="font-medium text-charcoal">{copy.header.updatedLabel}:</span>{' '}
            <span>{updatedLabel}</span>
          </p>
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
