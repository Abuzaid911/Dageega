'use client';

import { useState } from 'react';

import Feed from './_components/Feed';
import Footer from './_components/Footer';
import Header from './_components/Header';

export default function HomePage() {
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header lastUpdatedAt={lastUpdatedAt} />
      <main className="flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <Feed onUpdated={setLastUpdatedAt} />
      </main>
      <Footer />
    </div>
  );
}
