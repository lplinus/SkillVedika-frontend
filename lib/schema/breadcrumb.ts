import { generateBreadcrumbSchema } from '@/lib/structuredData';
import { getSiteUrl } from '@/lib/seo';

/**
 * Reusable breadcrumb helper for static pages
 *
 * @example
 * buildStaticBreadcrumb([
 *   { label: 'About Us', path: '/about-us' }
 * ])
 */
export function buildStaticBreadcrumb(
  items: Array<{
    label: string;
    path?: string;
  }>
) {
  const siteUrl = getSiteUrl();

  return generateBreadcrumbSchema([
    {
      name: 'Home',
      url: siteUrl,
    },
    ...items.map(item => ({
      name: item.label,
      ...(item.path && { url: `${siteUrl}${item.path}` }),
    })),
  ]);
}
