'use client';

import { useMemo } from 'react';
import Image from 'next/image';


function normalizeImage(src?: string): string {
  if (!src) return '/placeholder.png';

  const clean = String(src).trim();

  // absolute URL → OK
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    return clean;
  }

  // already root-relative → OK
  if (clean.startsWith('/')) {
    return clean;
  }

  // relative path → fix it
  return `/${clean}`;
}

//Realted blogs
export default function RelatedBlogs({ blogs }: any) {
  const normalizedBlogs = useMemo(() => {
    return (blogs || [])
      .filter(
        (b: any) =>
          String(b.status).toLowerCase() === 'published' // ✅ admin-controlled visibility
      )
      .map((b: any) => ({
        id: b.blog_id || b.id,
        title: b.blog_name,
        slug: b.url_friendly_title,
        image: normalizeImage(b.thumbnail_image || b.banner_image),
        date: b.published_at,
      }));
  }, [blogs]);

  if (normalizedBlogs.length === 0) return (
    <section className="py-12 text-center">
      <p className="text-sm text-gray-500 italic">
        No related blogs found.
      </p>
    </section>
  );



  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-10">
          Related Blogs
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {normalizedBlogs.map((b: any) => (
            <article
              key={b.id}
              className="bg-white rounded-xl shadow border p-4 flex flex-col"
            >
              <Image
                src={b.image}
                alt={b.title}
                width={400}
                height={338}
                className="rounded-lg object-cover mb-4"
              />

              <h3 className="font-bold text-lg mb-2 line-clamp-2">
                {b.title}
              </h3>

              <time className="text-sm text-gray-500 mb-4">
                {b.date ? new Date(b.date).toDateString() : ''}
              </time>

              <a
                href={`/blog/${b.slug}`}
                className="mt-auto bg-[#1e5ba8] text-white px-4 py-2 rounded text-sm w-fit"
              >
                Read More
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
