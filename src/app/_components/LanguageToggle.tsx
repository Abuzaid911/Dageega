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
    <div className="inline-flex items-center overflow-hidden rounded-full border-2 border-warmgray/60 bg-white shadow-sm">
      <button
        type="button"
        aria-label="Switch to English"
        aria-pressed={lang === 'en'}
        onClick={() => handleSelect('en')}
        className={`px-4 py-1.5 text-sm font-semibold transition-all duration-200 ${
          lang === 'en'
            ? 'bg-gradient-to-r from-olive to-olive/90 text-white shadow-md'
            : 'text-charcoal/70 hover:bg-olive/5 hover:text-olive'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        aria-label="التبديل إلى العربية"
        aria-pressed={lang === 'ar'}
        onClick={() => handleSelect('ar')}
        className={`px-4 py-1.5 text-sm font-semibold transition-all duration-200 ${
          lang === 'ar'
            ? 'bg-gradient-to-r from-olive to-olive/90 text-white shadow-md'
            : 'text-charcoal/70 hover:bg-olive/5 hover:text-olive'
        }`}
      >
        AR
      </button>
    </div>
  );
};

export default LanguageToggle;
