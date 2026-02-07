'use client';

import { Suspense } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { GoogleAnalyticsTracker } from '@/components/google-analytics';
import ClientComponents from '@/components/ClientComponents';

export default function RootClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      <Suspense fallback={null}>
        <GoogleAnalyticsTracker />
      </Suspense>

      {children}

      {/* Client-only UI */}
      <ClientComponents />
    </ErrorBoundary>
  );
}
