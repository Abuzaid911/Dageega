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
      <div className="relative">
        <input
          id="search"
          type="search"
          value={inputValue}
          dir={dir}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder={copy.search.placeholder}
          className="w-full rounded-full border border-warmgray/80 bg-white px-4 py-2 text-sm shadow-subtle placeholder:text-charcoal/40"
        />
        {inputValue && inputValue.length > 0 && (
          <button
            type="button"
            onClick={() => setInputValue('')}
            className="absolute inset-y-0 end-3 flex items-center text-xs text-charcoal/60 hover:text-charcoal"
            aria-label={copy.search.clear}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBox;
