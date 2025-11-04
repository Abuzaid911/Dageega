'use client';

import { CATEGORY_VALUES, CategoryValue, REGION_OPTIONS, getCategoryLabel, getCopy } from '../_lib/i18n';
import { useLanguage } from '../providers';

type FiltersBarProps = {
  activeCategory: CategoryValue;
  onCategoryChange: (category: CategoryValue) => void;
  selectedRegion: string;
  onRegionChange: (value: string) => void;
};

const FiltersBar = ({ activeCategory, onCategoryChange, selectedRegion, onRegionChange }: FiltersBarProps) => {
  const { lang } = useLanguage();
  const copy = getCopy(lang);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORY_VALUES.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              aria-pressed={isActive}
              className={`group relative whitespace-nowrap rounded-full border-2 px-5 py-2 text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'border-olive bg-gradient-to-r from-olive to-olive/90 text-white shadow-lg shadow-olive/20'
                  : 'border-warmgray/60 bg-white text-charcoal/70 hover:border-olive/40 hover:bg-olive/5 hover:text-olive hover:shadow-md'
              }`}
            >
              {getCategoryLabel(category, lang)}
              {isActive && (
                <span className="absolute inset-0 rounded-full bg-white/20 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <label htmlFor="regions" className="text-sm font-semibold text-charcoal/80">
          {copy.regionsLabel}
        </label>
        <div className="relative">
          <select
            id="regions"
            value={selectedRegion}
            onChange={(event) => {
              onRegionChange(event.target.value);
              // Automatically switch to Regions category when a region is selected
              if (event.target.value && activeCategory !== 'Regions') {
                onCategoryChange('Regions');
              }
            }}
            className="w-full max-w-xs appearance-none rounded-full border-2 border-warmgray/60 bg-white px-4 py-2.5 pr-10 text-sm font-medium text-charcoal shadow-subtle transition-all hover:border-olive/40 hover:bg-olive/5 hover:shadow-md focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/20"
          >
            <option value="">{lang === 'ar' ? '-- اختر --' : '-- Select --'}</option>
            {REGION_OPTIONS.map((region) => (
              <option key={region.value} value={region.value}>
                {region.labels[lang]}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg className="h-5 w-5 text-charcoal/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltersBar;
