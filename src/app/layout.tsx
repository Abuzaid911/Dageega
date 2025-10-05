import type { Metadata } from 'next';
import { Inter, Noto_Sans_Arabic } from 'next/font/google';

import './globals.css';
import { LanguageProvider } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const noto = Noto_Sans_Arabic({ subsets: ['arabic'], variable: '--font-noto', display: 'swap' });

export const metadata: Metadata = {
  title: '1 Minute | دقيقة واحدة',
  description:
    'Fast, bilingual Sudanese news briefing delivering trusted headlines in under a minute.',
  openGraph: {
    title: '1 Minute | دقيقة واحدة',
    description:
      'Fast, bilingual Sudanese news briefing delivering trusted headlines in under a minute.',
    url: 'https://example.com/one-minute',
    siteName: '1 Minute',
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: '1 Minute | دقيقة واحدة',
    description:
      'Fast, bilingual Sudanese news briefing delivering trusted headlines in under a minute.'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${noto.variable} min-h-screen bg-white text-charcoal`}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
