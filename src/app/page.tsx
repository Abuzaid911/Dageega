'use client';

import { Suspense, useState } from 'react';

import Feed from './_components/Feed';
import Footer from './_components/Footer';
import Header from './_components/Header';
import SkeletonCard from './_components/SkeletonCard';

export default function HomePage() {
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header lastUpdatedAt={lastUpdatedAt} />
      <main className="flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="mx-auto max-w-6xl">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {Array.from({ length: 8 }).map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </div>
            </div>
          }
        >
          <Feed onUpdated={setLastUpdatedAt} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
