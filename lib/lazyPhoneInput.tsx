'use client';

/**
 * LazyPhoneInput
 * ----------------
 * ✔ Loads JS lazily (dynamic import)
 * ✔ Loads CSS AFTER mount (non-blocking)
 * ✔ No hardcoded _next paths
 * ✔ Turbopack / Next.js safe
 */

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

/* -------------------------------
   Lazy JS import
-------------------------------- */
const PhoneInput = dynamic(
  () => import('react-phone-input-2').then(m => m.default),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-12 bg-gray-100 rounded-xl animate-pulse" />
    ),
  }
);

export default function LazyPhoneInput(props: any) {
  const [cssReady, setCssReady] = useState(false);

  /* -------------------------------
     Lazy CSS (SAFE way)
  -------------------------------- */
  useEffect(() => {
    let mounted = true;

    // ⬇️ This is the ONLY safe approach
    import('react-phone-input-2/lib/style.css')
      .then(() => {
        if (mounted) setCssReady(true);
      })
      .catch(() => {
        // Fail silently (won’t break render)
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (!cssReady) {
    return (
      <div className="w-full h-12 bg-gray-100 rounded-xl animate-pulse" />
    );
  }

  return <PhoneInput {...props} />;
}
