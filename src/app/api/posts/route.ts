import { NextRequest, NextResponse } from 'next/server';

import type { Post } from '@/types/post';

const RAW_POSTS: Post[] = [
  {
    id: 'news-001',
    platform: 'rss',
    sourceName: 'Radio Dabanga',
    title: 'Aid convoys reach El Geneina after week-long standoff',
    text:
      'Local mediators cleared the way for humanitarian convoys to enter El Geneina with medical supplies and food items for displaced families.',
    url: 'https://radiodabanga.org/news/el-geneina-convoy',
    mediaThumbUrl: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=60',
    publishedAt: '2024-05-30T09:45:00Z',
    tags: ['Breaking', 'Humanitarian', 'Darfur'],
    lang: 'en'
  },
  {
    id: 'news-002',
    platform: 'x',
    sourceName: 'Sudan Tribune Arabic',
    authorHandle: '@sudantribune_ar',
    text:
      'المجلس السيادي يعلن عن جولة جديدة من المحادثات السياسية في الخرطوم بمشاركة ممثلين من الولايات المتأثرة بالنزاع.',
    url: 'https://x.com/sudantribune_ar/status/002',
    publishedAt: '2024-05-30T09:15:00Z',
    tags: ['Politics', 'Khartoum'],
    lang: 'ar'
  },
  {
    id: 'news-003',
    platform: 'web',
    sourceName: 'Sudanese Business Review',
    title: 'Sudan Central Bank eases forex restrictions for agricultural imports',
    url: 'https://sbr.africa/analysis/cbank-forex-easing',
    mediaThumbUrl: 'https://images.unsplash.com/photo-1444650331054-5e1c23d3b8f8?auto=format&fit=crop&w=800&q=60',
    publishedAt: '2024-05-30T08:55:00Z',
    tags: ['Economy', 'Blue Nile'],
    lang: 'en'
  },
  {
    id: 'news-004',
    platform: 'fb',
    sourceName: 'Nuba Reports',
    text:
      'Community patrols in South Kordofan increased after reports of livestock theft along the Kadugli corridor, according to local monitors.',
    url: 'https://facebook.com/nubareports/posts/004',
    publishedAt: '2024-05-30T08:35:00Z',
    tags: ['Security', 'Kordofan'],
    lang: 'en'
  },
  {
    id: 'news-005',
    platform: 'yt',
    sourceName: 'Sudan Live',
    title: 'Field update: rebuilding clinics in Kassala',
    url: 'https://youtube.com/watch?v=fieldupdate005',
    embedHtml: `<iframe src="https://www.youtube.com/embed/8Z1pJv_ZfA4" title="Field update from Kassala" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:100%;height:100%;min-height:220px;border:0;"></iframe>`,
    publishedAt: '2024-05-30T08:10:00Z',
    tags: ['Humanitarian', 'Red Sea'],
    lang: 'en'
  },
  {
    id: 'news-006',
    platform: 'rss',
    sourceName: 'Al Hadath Khartoum',
    title: 'Heavy rainfall prompts new flooding alerts in Gezira state',
    text:
      'Civil defense units issued a high alert for Wad Madani districts following overnight storms that overwhelmed drainage canals.',
    url: 'https://alhadath.sd/flood-alert-gezira',
    mediaThumbUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=60',
    publishedAt: '2024-05-30T07:45:00Z',
    tags: ['Breaking', 'Humanitarian', 'Gezira'],
    lang: 'both'
  },
  {
    id: 'news-007',
    platform: 'ig',
    sourceName: 'Blue Nile Spotlight',
    text:
      'فرق الإغاثة افتتحت مركزاً متنقلاً جديداً للكشف عن سوء التغذية في مدينة الدمازين لتغطية القرى التي يصعب الوصول إليها.',
    url: 'https://instagram.com/p/bluenile007',
    mediaThumbUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=60',
    publishedAt: '2024-05-30T07:20:00Z',
    tags: ['Humanitarian', 'Blue Nile'],
    lang: 'ar'
  },
  {
    id: 'news-008',
    platform: 'x',
    sourceName: 'Sudan Watch',
    authorHandle: '@sudanwatch',
    title: 'Power-sharing roadmap garners cautious approval from civil coalitions',
    url: 'https://x.com/sudanwatch/status/008',
    publishedAt: '2024-05-30T06:50:00Z',
    tags: ['Politics', 'Khartoum'],
    lang: 'en'
  },
  {
    id: 'news-009',
    platform: 'web',
    sourceName: 'Port Sudan Daily',
    title: 'Red Sea port resumes second shift after security sweep',
    url: 'https://portsudan.daily/operations-update',
    publishedAt: '2024-05-30T06:25:00Z',
    tags: ['Security', 'Red Sea'],
    lang: 'en'
  },
  {
    id: 'news-010',
    platform: 'rss',
    sourceName: 'Al Tayar',
    text:
      'تجار الخرطوم يطالبون الحكومة بخفض الرسوم الجمركية على الواردات الغذائية لتخفيف الضغط على الأسر عقب موجة التضخم الأخيرة.',
    url: 'https://altayar.sd/news010',
    publishedAt: '2024-05-30T06:00:00Z',
    tags: ['Economy', 'Khartoum'],
    lang: 'ar'
  },
  {
    id: 'news-011',
    platform: 'fb',
    sourceName: 'Darfur Women Voices',
    title: 'Women-led cooperatives reopen flour mills in Nyala',
    text:
      'Community groups say the reopened mills could serve nearly 12,000 families each week while larger bakeries remain closed.',
    url: 'https://facebook.com/darfurwomenvoices/posts/011',
    publishedAt: '2024-05-30T05:42:00Z',
    tags: ['Humanitarian', 'Darfur'],
    lang: 'en'
  },
  {
    id: 'news-012',
    platform: 'rss',
    sourceName: 'Gedaref Now',
    title: 'Cross-border trade picks up cautiously at Gallabat crossing',
    url: 'https://gedarefnow.com/cross-border-trade',
    publishedAt: '2024-05-30T05:20:00Z',
    tags: ['Economy', 'Gedaref'],
    lang: 'en'
  },
  {
    id: 'news-013',
    platform: 'x',
    sourceName: 'Sudan Daily Arabic',
    authorHandle: '@sudandaily_ar',
    text:
      'اندلاع اشتباكات متقطعة في الفاشر بعد محاولة مجموعة مسلحة السيطرة على مركز للشرطة المحلية.',
    url: 'https://x.com/sudandaily_ar/status/013',
    publishedAt: '2024-05-30T05:00:00Z',
    tags: ['Breaking', 'Security', 'Darfur'],
    lang: 'ar'
  },
  {
    id: 'news-014',
    platform: 'web',
    sourceName: 'African Negotiator',
    title: 'Regional envoys push for ceasefire monitors in South Kordofan',
    url: 'https://africannegotiator.org/analysis/ceasefire-monitors',
    publishedAt: '2024-05-30T04:40:00Z',
    tags: ['Politics', 'Kordofan'],
    lang: 'both'
  },
  {
    id: 'news-015',
    platform: 'rss',
    sourceName: 'Justice Hub',
    title: 'Human rights lawyers document new detentions in Kassala',
    url: 'https://justicehub.africa/detention-report',
    publishedAt: '2024-05-30T04:15:00Z',
    tags: ['Security', 'Red Sea'],
    lang: 'en'
  },
  {
    id: 'news-016',
    platform: 'ig',
    sourceName: 'Sudan Markets',
    text:
      'سوق نيالا يشهد تراجعًا طفيفًا في أسعار الذرة الرفيعة بعد وصول شحنات جديدة من الولايات المجاورة.',
    url: 'https://instagram.com/p/market-016',
    mediaThumbUrl: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=800&q=60',
    publishedAt: '2024-05-30T03:55:00Z',
    tags: ['Economy', 'Darfur'],
    lang: 'both'
  },
  {
    id: 'news-017',
    platform: 'yt',
    sourceName: 'Relief Sudan',
    title: 'Volunteer medics set up mobile clinic in Omdurman',
    url: 'https://youtube.com/watch?v=relief-017',
    embedHtml: `<iframe src="https://www.youtube.com/embed/O9I1SnVdK9M" title="Mobile clinic in Omdurman" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:100%;height:100%;min-height:220px;border:0;"></iframe>`,
    publishedAt: '2024-05-30T03:32:00Z',
    tags: ['Humanitarian', 'Khartoum'],
    lang: 'en'
  },
  {
    id: 'news-018',
    platform: 'x',
    sourceName: 'War Monitor Sudan',
    authorHandle: '@warmonitor_sd',
    text:
      'تقارير أولية تشير إلى تعزيزات عسكرية جديدة باتجاه مدينة الأبيض مع استمرار حالة الطوارئ.',
    url: 'https://x.com/warmonitor_sd/status/018',
    publishedAt: '2024-05-30T03:05:00Z',
    tags: ['Security', 'Kordofan'],
    lang: 'ar'
  },
  {
    id: 'news-019',
    platform: 'rss',
    sourceName: 'Sudan Health Desk',
    title: 'Rapid cholera screenings expand to Gezira refugee settlements',
    url: 'https://sudanhealthdesk.org/reports/cholera-screening',
    publishedAt: '2024-05-30T02:40:00Z',
    tags: ['Breaking', 'Humanitarian', 'Gezira'],
    lang: 'en'
  },
  {
    id: 'news-020',
    platform: 'web',
    sourceName: 'States Roundup',
    title: 'South Darfur community radios relaunch evening bulletins',
    url: 'https://statesroundup.africa/media/south-darfur-radio',
    publishedAt: '2024-05-30T02:10:00Z',
    tags: ['Politics', 'Darfur'],
    lang: 'en'
  },
  {
    id: 'news-021',
    platform: 'rss',
    sourceName: 'Alrakoba',
    text:
      'قوى الحرية والتغيير تقترح لجنة انتقالية أصغر مع صلاحيات محددة لإدارة مؤسسات الخرطوم خلال الأشهر الستة القادمة.',
    url: 'https://alrakoba.net/news/021',
    publishedAt: '2024-05-30T01:45:00Z',
    tags: ['Politics', 'Khartoum'],
    lang: 'ar'
  },
  {
    id: 'news-022',
    platform: 'web',
    sourceName: 'Nile Finance',
    title: 'Remittances surge as diaspora responds to humanitarian appeals',
    url: 'https://nilefinance.com/opinion/remittance-surge',
    publishedAt: '2024-05-30T01:20:00Z',
    tags: ['Economy', 'Khartoum'],
    lang: 'en'
  },
  {
    id: 'news-023',
    platform: 'fb',
    sourceName: 'Sudan Safety Network',
    title: 'Night-time curfew extended in El Fasher for another week',
    url: 'https://facebook.com/sudansafety/posts/023',
    publishedAt: '2024-05-30T00:55:00Z',
    tags: ['Security', 'Darfur'],
    lang: 'en'
  },
  {
    id: 'news-024',
    platform: 'rss',
    sourceName: 'Hala 96 FM',
    text:
      'مبادرات شبابية توزع وجبات ساخنة على النازحين في مدينة عطبرة بدعم من مجتمع رجال الأعمال المحلي.',
    url: 'https://hala96.fm/news/024',
    publishedAt: '2024-05-30T00:32:00Z',
    tags: ['Humanitarian', 'River Nile'],
    lang: 'ar'
  },
  {
    id: 'news-025',
    platform: 'web',
    sourceName: 'Sudan Civic Monitor',
    title: 'Grassroots mediators launch listening sessions in Kassala',
    url: 'https://sudancivicmonitor.org/briefings/listening-sessions',
    publishedAt: '2024-05-29T23:58:00Z',
    tags: ['Politics', 'Red Sea'],
    lang: 'en'
  },
  {
    id: 'news-026',
    platform: 'x',
    sourceName: 'Khartoum Flash Arabic',
    authorHandle: '@khflash_ar',
    text:
      'انفجار محدود في مخزن ذخيرة سابق شمالي الخرطوم دون تسجيل إصابات، والسلطات تحقق في أسباب الحادث.',
    url: 'https://x.com/khflash_ar/status/026',
    publishedAt: '2024-05-29T23:25:00Z',
    tags: ['Breaking', 'Security', 'Khartoum'],
    lang: 'ar'
  },
  {
    id: 'news-027',
    platform: 'web',
    sourceName: 'AgriPulse Sudan',
    title: 'Sesame farmers secure microloans ahead of planting season',
    url: 'https://agripulsesudan.com/stories/sesame-microloans',
    publishedAt: '2024-05-29T22:58:00Z',
    tags: ['Economy', 'Kassala'],
    lang: 'en'
  },
  {
    id: 'news-028',
    platform: 'fb',
    sourceName: 'Red Sea Watch Arabic',
    text:
      'قوات خفر السواحل تعلن ضبط شحنة تهريب في ميناء بورتسودان وإحالة المتورطين إلى النيابة.',
    url: 'https://facebook.com/redseawatch/posts/028',
    publishedAt: '2024-05-29T22:30:00Z',
    tags: ['Security', 'Red Sea'],
    lang: 'ar'
  },
  {
    id: 'news-029',
    platform: 'rss',
    sourceName: 'Relief Line',
    title: 'Community kitchens reopen in Abu Shouk camp',
    url: 'https://reliefline.org/update/abu-shouk-kitchens',
    publishedAt: '2024-05-29T22:02:00Z',
    tags: ['Humanitarian', 'Darfur'],
    lang: 'en'
  },
  {
    id: 'news-030',
    platform: 'web',
    sourceName: 'Sudan Policy Arabic',
    text:
      'ورشة عمل في بورتسودان تناقش مقترح ميثاق جديد لتقاسم السلطة بين القوى المدنية.',
    url: 'https://sudanpolicy.net/articles/030',
    publishedAt: '2024-05-29T21:40:00Z',
    tags: ['Politics', 'Red Sea'],
    lang: 'ar'
  },
  {
    id: 'news-031',
    platform: 'rss',
    sourceName: 'Security Brief',
    title: 'UN patrols expand buffer zone near Kadugli',
    url: 'https://securitybrief.org/dispatch/kadugli-buffer-zone',
    publishedAt: '2024-05-29T21:05:00Z',
    tags: ['Security', 'Kordofan'],
    lang: 'en'
  },
  {
    id: 'news-032',
    platform: 'x',
    sourceName: 'Markets Sudan Arabic',
    authorHandle: '@markets_sd',
    text:
      'أسعار الوقود في القضارف تشهد استقراراً نسبياً بعد وصول شحنات جديدة من بورتسودان.',
    url: 'https://x.com/markets_sd/status/032',
    publishedAt: '2024-05-29T20:42:00Z',
    tags: ['Economy', 'Gedaref'],
    lang: 'ar'
  },
  {
    id: 'news-033',
    platform: 'web',
    sourceName: 'Nomad Dispatch',
    title: 'Pastoralists navigate new corridors in North Darfur',
    url: 'https://nomaddispatch.org/reports/north-darfur-corridors',
    publishedAt: '2024-05-29T20:18:00Z',
    tags: ['Humanitarian', 'Darfur'],
    lang: 'en'
  },
  {
    id: 'news-034',
    platform: 'rss',
    sourceName: 'Al Shorouk TV',
    text:
      'قوافل طبية تطوعية تتجه إلى ولاية سنار لدعم المستشفيات الريفية بالأدوية الأساسية.',
    url: 'https://alshorouk.tv/news/034',
    publishedAt: '2024-05-29T19:52:00Z',
    tags: ['Humanitarian', 'Sennar'],
    lang: 'ar'
  }
];

const SORTED_POSTS = [...RAW_POSTS].sort(
  (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
);

const normalize = (value: string | null) => (value ? value.toLowerCase() : null);

export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limitParam = Math.max(1, Math.min(50, Number(searchParams.get('limit')) || 12));
  const offsetParam = Math.max(0, Number(searchParams.get('offset')) || 0);
  const langParam = searchParams.get('lang');
  const tagParam = searchParams.get('tag');
  const normalizedTag = normalize(tagParam);
  const queryParam = normalize(searchParams.get('q'));

  const filtered = SORTED_POSTS.filter((post) => {
    if (langParam === 'en' && post.lang === 'ar') return false;
    if (langParam === 'ar' && post.lang === 'en') return false;
    if (normalizedTag && !post.tags.some((tag) => normalize(tag) === normalizedTag)) {
      return false;
    }
    if (queryParam) {
      const text = `${post.title ?? ''} ${post.text ?? ''} ${post.sourceName}`.toLowerCase();
      if (!text.includes(queryParam)) {
        return false;
      }
    }
    return true;
  });

  const total = filtered.length;
  const slice = filtered.slice(offsetParam, offsetParam + limitParam);

  return NextResponse.json({
    data: slice,
    total,
    limit: limitParam,
    offset: offsetParam,
    hasMore: offsetParam + limitParam < total
  });
}
