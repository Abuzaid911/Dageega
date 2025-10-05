import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import 'dayjs/locale/ar';
import 'dayjs/locale/en';

import type { UILanguage } from './i18n';

const localeMap: Record<UILanguage, string> = {
  en: 'en',
  ar: 'ar'
};

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'a few seconds',
    m: 'a minute',
    mm: '%d minutes',
    h: 'an hour',
    hh: '%d hours',
    d: 'a day',
    dd: '%d days',
    M: 'a month',
    MM: '%d months',
    y: 'a year',
    yy: '%d years'
  }
});

dayjs.updateLocale('ar', {
  relativeTime: {
    future: 'خلال %s',
    past: 'منذ %s',
    s: 'ثوانٍ قليلة',
    m: 'دقيقة',
    mm: '%d دقائق',
    h: 'ساعة',
    hh: '%d ساعات',
    d: 'يوم',
    dd: '%d أيام',
    M: 'شهر',
    MM: '%d أشهر',
    y: 'عام',
    yy: '%d أعوام'
  }
});

export const formatRelative = (value: string | number | Date, lang: UILanguage) =>
  dayjs(value).locale(localeMap[lang]).fromNow();

export const formatAbsolute = (value: string | number | Date, lang: UILanguage) =>
  dayjs(value).locale(localeMap[lang]).format('D MMM YYYY, HH:mm');

export const dayjsWithLocale = (lang: UILanguage) => dayjs().locale(localeMap[lang]);
