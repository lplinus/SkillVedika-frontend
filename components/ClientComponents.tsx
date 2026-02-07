'use client';

import dynamic from 'next/dynamic';
import Footer from '@/components/footer';

/* =========================
   Lazy-loaded client widgets
========================= */

const CookieConsentWrapper = dynamic(
  () => import('@/components/CookieConsentWrapper').then(m => m.default),
  { ssr: false }
);

const StickyFooter = dynamic(
  () => import('@/components/StickyFooter').then(m => m.default),
  { ssr: false }
);

const UnifiedHelpButton = dynamic(
  () => import('@/components/UnifiedHelpButton').then(m => m.default),
  { ssr: false }
);

const WhatsAppButton = dynamic(
  () => import('@/components/WhatsAppButton').then(m => m.default),
  { ssr: false }
);

export default function ClientComponents({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <>
      {children}

      <StickyFooter />
      <UnifiedHelpButton />

      <div className="hidden sm:block">
        <WhatsAppButton />
      </div>

      <CookieConsentWrapper />
      <Footer /> 
    </>
  );
}
