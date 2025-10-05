export type UILanguage = 'en' | 'ar';

export const CATEGORY_VALUES = [
  'All',
  'Breaking',
  'Politics',
  'Economy',
  'Humanitarian',
  'Security',
  'Regions'
] as const;

export type CategoryValue = (typeof CATEGORY_VALUES)[number];

const CATEGORY_LABELS: Record<CategoryValue, { en: string; ar: string }> = {
  All: { en: 'All', ar: 'الكل' },
  Breaking: { en: 'Breaking', ar: 'عاجل' },
  Politics: { en: 'Politics', ar: 'سياسة' },
  Economy: { en: 'Economy', ar: 'اقتصاد' },
  Humanitarian: { en: 'Humanitarian', ar: 'إنساني' },
  Security: { en: 'Security', ar: 'أمن' },
  Regions: { en: 'Regions', ar: 'المناطق' }
};

export const REGION_OPTIONS = [
  { value: 'Khartoum', labels: { en: 'Khartoum', ar: 'الخرطوم' } },
  { value: 'Darfur', labels: { en: 'Darfur', ar: 'دارفور' } },
  { value: 'Kordofan', labels: { en: 'Kordofan', ar: 'كردفان' } },
  { value: 'Blue Nile', labels: { en: 'Blue Nile', ar: 'النيل الأزرق' } },
  { value: 'Red Sea', labels: { en: 'Red Sea', ar: 'البحر الأحمر' } }
] as const;

const copy = {
  en: {
    header: {
      titlePrimary: '1 Minute',
      titleSecondary: 'دقيقة واحدة',
      updatedLabel: 'Updated',
      updatedFallback: 'Waiting for latest updates'
    },
    search: {
      ariaLabel: 'Search Sudan news',
      placeholder: 'Search stories',
      clear: 'Clear search'
    },
    feed: {
      emptyState: 'No stories match your filters yet.',
      loadMore: 'Load more',
      loadMoreFallback: 'Show more stories',
      openSource: 'Open source'
    },
    footer: {
      disclaimer:
        'Mock newsroom for Sudanese updates. Content is sample only; connect your live backend to publish real alerts.'
    },
    regionsLabel: 'Select region'
  },
  ar: {
    header: {
      titlePrimary: '1 Minute',
      titleSecondary: 'دقيقة واحدة',
      updatedLabel: 'آخر تحديث',
      updatedFallback: 'جاري جلب آخر المستجدات'
    },
    search: {
      ariaLabel: 'ابحث في أخبار السودان',
      placeholder: 'ابحث في الأخبار',
      clear: 'مسح البحث'
    },
    feed: {
      emptyState: 'لا توجد قصص تطابق معايير التصفية الحالية.',
      loadMore: 'تحميل المزيد',
      loadMoreFallback: 'عرض قصص إضافية',
      openSource: 'عرض المصدر'
    },
    footer: {
      disclaimer:
        'غرفة أخبار تجريبية لتحديثات السودان. المحتوى وهمي؛ اربط بنظامك الخلفي لنشر التنبيهات الفعلية.'
    },
    regionsLabel: 'اختر المنطقة'
  }
} as const;

export const getCopy = (lang: UILanguage) => copy[lang];

export const getCategoryLabel = (value: CategoryValue, lang: UILanguage) =>
  CATEGORY_LABELS[value][lang];

export const getRegionLabel = (value: string, lang: UILanguage) => {
  const match = REGION_OPTIONS.find((option) => option.value === value);
  return match ? match.labels[lang] : value;
};
