'use client';

import { useEffect } from 'react';

interface LCPPreloadProps {
  imageUrl: string;
}

/**
 * Preloads the LCP (Largest Contentful Paint) image
 * IMPORTANT:
 * - Always preload an optimized Cloudinary variant
 * - Never preload original / oversized images
 */
export default function LCPPreload({ imageUrl }: LCPPreloadProps) {
  useEffect(() => {
    if (!imageUrl || typeof window === 'undefined') return;

    // ✅ Force Cloudinary optimization for LCP
    const optimizedUrl = imageUrl.includes('res.cloudinary.com')
      ? imageUrl.replace(
          '/upload/',
          '/upload/w_1200,h_675,c_fill,q_auto,f_auto/'
        )
      : imageUrl;
  
    const encodedUrl = encodeURI(optimizedUrl);

    // Avoid duplicate preload tags
    const existing = document.querySelector(
      `link[rel="preload"][as="image"][href="${encodedUrl}"]`
    );
    if (existing) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = encodedUrl;
    link.setAttribute('fetchpriority', 'high');

    document.head.appendChild(link);

    return () => {
      const el = document.querySelector(
        `link[rel="preload"][as="image"][href="${encodedUrl}"]`
      );
      if (el) el.remove();
    };
  }, [imageUrl]);

  return null;
}
