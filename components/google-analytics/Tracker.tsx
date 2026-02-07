'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const GA4_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;

const EXCLUDED_PATHS = [
  '/admin',
  '/dashboard',
  '/api',
  '/_next',
  '/auth',
  '/login',
  '/logout',
  '/internal',
];

function shouldTrack(pathname: string) {
  return !EXCLUDED_PATHS.some(path =>
    pathname.startsWith(path)
  );
}

export default function GoogleAnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (
      !GA4_MEASUREMENT_ID ||
      typeof window === 'undefined' ||
      typeof window.gtag !== 'function' ||
      !shouldTrack(pathname)
    ) {
      return;
    }

    window.gtag('event', 'page_view', {
      page_path: pathname,
      page_title: document.title,
      page_location: window.location.href, // includes query params
    });
  }, [pathname]);

  return null;
}
