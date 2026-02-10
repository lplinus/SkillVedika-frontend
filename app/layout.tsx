import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals-critical.css';

import './globals.css';
import { Suspense } from 'react';

import Header from '@/components/header';
import { GoogleAnalyticsHead } from '@/components/google-analytics';
import { getCanonicalUrl } from '@/lib/seo';
import RootClientWrapper from '@/components/RootClientWrapper';
import { StructuredData } from '@/components/StructuredData';
import { getGlobalSchema } from '@/lib/schema/globalSchema';
import ClientSideEffects from './ClientSideEffects';
  // import { Toaster } from 'sonner';//newly added
  import { Toaster } from '@/components/ui/sonner';



/* ---------------- Fonts ---------------- */
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
});

/* ---------------- SEO ---------------- */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://skillvedika.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      'SkillVedika – IT Training Institute | SAP, AWS DevOps, Salesforce & Data Science Courses',
    template: '%s | SkillVedika',
  },
  description:
    'SkillVedika is a leading IT training institute offering SAP training, AWS DevOps, Salesforce, Data Science, cloud computing and online IT courses with hands-on training.',
  alternates: {
    canonical: getCanonicalUrl('/'),
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

/* ---------------- HERO CRITICAL CSS ---------------- */
const heroCriticalCSS = `
@media (max-width: 767px) {
  .hero-section {
    padding: 2rem 0;
    background: linear-gradient(135deg, #E8F0F7, #F0F4F9);
  }
  #hero-heading h1 {
    font-size: 1.5rem;
    line-height: 1.15;
    font-weight: 700;
    color: #111827;
    margin: 0;
  }
  .hero-image-wrapper {
    max-width: 280px;
    margin: 0 auto;
  }
}
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: heroCriticalCSS }} />
      </head>

      <body className="font-sans antialiased">
        <StructuredData data={getGlobalSchema()} />
        <GoogleAnalyticsHead />

        <Suspense fallback={null}>
          <Header />
        </Suspense>

        <main className="pt-20 md:pt-[72px]">
          <RootClientWrapper>{children}</RootClientWrapper>
        </main>

        {/* client-only */}
        <ClientSideEffects />
      {/* <Toaster /> */}
<Toaster
  position="bottom-right"
  toastOptions={{
    classNames: {
      toast:
        'text-base px-6 py-4 min-h-[64px] rounded-xl',
      error:
        'bg-white text-red-600 border border-red-200',
      success:
        'bg-white text-green-600 border border-green-200',
      warning:
        'bg-white text-yellow-600 border border-yellow-200',
    },
  }}
/>



      </body>
    </html>
  );


}
