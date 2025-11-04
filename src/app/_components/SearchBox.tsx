'use client';

import { useEffect, useState } from 'react';

import { getCopy } from '../_lib/i18n';
import { useLanguage } from '../providers';

type SearchBoxProps = {
  value: string;
  onDebouncedChange: (value: string) => void;
};

const SearchBox = ({ value, onDebouncedChange }: SearchBoxProps) => {
  const { lang, dir } = useLanguage();
  const copy = getCopy(lang);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      onDebouncedChange(inputValue.trim());
    }, 280);
    return () => window.clearTimeout(id);
  }, [inputValue, onDebouncedChange]);

  return (
    <div className="w-full max-w-xl">
      <label htmlFor="search" className="sr-only">
        {copy.search.ariaLabel}
      </label>
      <div className="relative w-full">
        <input
          id="search"
          type="search"
          value={inputValue}
          dir={dir}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder={copy.search.placeholder}
          className="w-full rounded-full border-2 border-warmgray/60 bg-white pl-10 pr-4 py-2.5 text-sm font-medium shadow-subtle transition-all placeholder:text-charcoal/40 hover:border-olive/40 hover:shadow-md focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/20"
        />
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-charcoal/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        {inputValue && inputValue.length > 0 && (
          <button
            type="button"
            onClick={() => setInputValue('')}
            className="absolute inset-y-0 end-3 flex items-center rounded-full bg-warmgray/60 p-1 text-xs font-bold text-charcoal/70 transition-all hover:bg-warmgray/80 hover:text-charcoal"
            aria-label={copy.search.clear}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBox;
