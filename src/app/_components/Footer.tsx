'use client';

import { getCopy } from '../_lib/i18n';
import { useLanguage } from '../providers';

const Footer = () => {
  const { lang } = useLanguage();
  const copy = getCopy(lang);

  return (
    <footer className="mt-auto border-t border-warmgray/70 bg-white/95">
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-charcoal/70 sm:px-6 lg:px-8">
        <p className="leading-relaxed">{copy.footer.disclaimer}</p>
        <p className="mt-2 text-xs text-charcoal/50">© {new Date().getFullYear()} 1 Minute | دقيقة واحدة</p>
      </div>
    </footer>
  );
};

export default Footer;
