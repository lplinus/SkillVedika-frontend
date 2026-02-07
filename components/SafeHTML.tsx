'use client';

import { useEffect, useState } from 'react';

interface SafeHTMLProps {
  html: string;
  className?: string;
}

export default function SafeHTML({ html, className }: SafeHTMLProps) {
  const [clean, setClean] = useState('');

  useEffect(() => {
    if (!html) {
      setClean('');
      return;
    }

    import('dompurify').then((module) => {
      const DOMPurify = module.default;

      const sanitized = DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
          'p',
          'br',
          'strong',
          'em',
          'b',
          'i',
          'u',
          'ul',
          'ol',
          'li',
          'a',
          'h1',
          'h2',
          'h3',
          'h4',
          'h5',
          'h6',
          'blockquote',
          'code',
          'pre',
          'img',
          'hr',
          'span',
          'div',
        ],
        ALLOWED_ATTR: [
          'href',
          'target',
          'rel',
          'src',
          'alt',
          'width',
          'height',
          'class',
          'style', // ✅ REQUIRED for justify
        ],
        FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form'],
        FORBID_ATTR: [
          'onerror',
          'onload',
          'onclick',
          'onmouseover',
          'onmouseenter',
          'onfocus',
        ],
      });

      setClean(sanitized);
    });
  }, [html]);

  if (!clean) return null;

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
