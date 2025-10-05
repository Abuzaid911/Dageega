'use client';

import { useCallback } from 'react';

import { useLanguage } from '../providers';

const LanguageToggle = () => {
  const { lang, setLang } = useLanguage();

  const handleSelect = useCallback(
    (value: 'en' | 'ar') => {
      setLang(value);
    },
    [setLang]
  );

  return (
    <div className="inline-flex items-center overflow-hidden rounded-full border border-warmgray bg-white shadow-sm">
      <button
        type="button"
        aria-label="Switch to English"
        aria-pressed={lang === 'en'}
        onClick={() => handleSelect('en')}
        className={`px-3 py-1 text-sm font-medium transition-colors ${
          lang === 'en' ? 'bg-olive text-white' : 'text-charcoal/80 hover:bg-warmgray/60'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        aria-label="التبديل إلى العربية"
        aria-pressed={lang === 'ar'}
        onClick={() => handleSelect('ar')}
        className={`px-3 py-1 text-sm font-medium transition-colors ${
          lang === 'ar' ? 'bg-olive text-white' : 'text-charcoal/80 hover:bg-warmgray/60'
        }`}
      >
        AR
      </button>
    </div>
  );
};

export default LanguageToggle;
