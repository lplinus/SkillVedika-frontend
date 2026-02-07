/**
 * robots.txt Generator
 * Follows Google Search Central best practices
 * URL: /robots.txt
 */

import { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/dashboard/',
          '/api/',
          '/auth/',
          '/login',
          '/logout',
          '/test/',
          '/internal/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
