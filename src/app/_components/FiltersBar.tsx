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
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {CATEGORY_VALUES.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              aria-pressed={isActive}
              className={`whitespace-nowrap rounded-full border px-4 py-1 text-sm font-medium transition-colors ${
                isActive
                  ? 'border-olive bg-olive text-white'
                  : 'border-warmgray/80 bg-white text-charcoal/80 hover:bg-warmgray/60'
              }`}
            >
              {getCategoryLabel(category, lang)}
            </button>
          );
        })}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label htmlFor="regions" className="text-sm font-medium text-charcoal/70">
          {copy.regionsLabel}
        </label>
        <select
          id="regions"
          value={selectedRegion}
          disabled={activeCategory !== 'Regions'}
          onChange={(event) => onRegionChange(event.target.value)}
          className="max-w-xs rounded-full border border-warmgray/80 bg-white px-4 py-2 text-sm shadow-subtle disabled:opacity-60"
        >
          <option value="">--</option>
          {REGION_OPTIONS.map((region) => (
            <option key={region.value} value={region.value}>
              {region.labels[lang]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FiltersBar;
