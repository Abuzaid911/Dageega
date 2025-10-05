export type Platform = 'rss' | 'x' | 'yt' | 'ig' | 'fb' | 'web';

export type Post = {
  id: string;
  platform: Platform;
  sourceName: string;
  authorHandle?: string;
  title?: string;
  text?: string;
  url: string;
  embedHtml?: string | null;
  mediaThumbUrl?: string | null;
  publishedAt: string;
  tags: string[];
  lang: 'ar' | 'en' | 'both';
};
