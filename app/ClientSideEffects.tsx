'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import NonCriticalStyles from './NonCriticalStyles';
import ErrorHandler from './error-handler';
import FontErrorHandler from './font-error-handler';

export default function ClientSideEffects() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (typeof window.gtag !== 'function') return;

    window.gtag('event', 'page_view', {
      page_path: pathname,
      page_title: document.title,
      page_location: window.location.href, // includes query params
    });
  }, [pathname]);

  return (
    <>
      <NonCriticalStyles />
      <ErrorHandler />
      <FontErrorHandler />
    </>
  );
}
