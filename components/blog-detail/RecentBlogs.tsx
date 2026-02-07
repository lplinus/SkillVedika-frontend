// 'use client';

// import { useMemo } from 'react';
// import Image from 'next/image';

// export default function RecentBlogs({ blogs }: any) {
//   /* ---------------- NORMALIZE DATA ---------------- */
//   const normalizedBlogs = useMemo(() => {
//     return (blogs || [])
//       .filter((b: any) => b.recent_blog === 'YES') // ✅ KEY FIX
//       .map((blog: any) => ({
//         id: blog.blog_id || blog.id,
//         title: blog.blog_name || blog.title,
//         slug: blog.url_friendly_title || blog.slug,
//         image:
//           blog.banner_image ||
//           blog.thumbnail_image ||
//           '/placeholder.png',
//         date: blog.published_at,
//       }));
//   }, [blogs]);

//   /* ---------------- SORT (NEWEST FIRST) ---------------- */
//   const sortedBlogs = useMemo(() => {
//     return [...normalizedBlogs].sort(
//       (a, b) =>
//         new Date(b.date).getTime() - new Date(a.date).getTime()
//     );
//   }, [normalizedBlogs]);

//   if (sortedBlogs.length === 0) return null; // ✅ hide section if none

//   return (
//     <section className="py-16 px-6 bg-white">
//       <div className="max-w-7xl mx-auto">
//         <h2 className="text-3xl font-bold text-gray-900 mb-10">
//           Recent Blogs
//         </h2>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//           {sortedBlogs.map((b: any) => {
//             let img = b.image;
//             if (!img.startsWith('http') && !img.startsWith('/')) {
//               img = '/' + img;
//             }

//             return (
//               <article
//                 key={b.id}
//                 className="bg-white rounded-xl shadow border p-4 flex flex-col"
//               >
//                 <Image
//                   src={img}
//                   alt={b.title}
//                   width={400}
//                   height={225}
//                   className="rounded-lg object-cover mb-4"
//                   quality={85}
//                 />

//                 <h3 className="font-bold text-lg mb-2 line-clamp-2">
//                   {b.title}
//                 </h3>

//                 <time className="text-sm text-gray-500 mb-4">
//                   {b.date ? new Date(b.date).toDateString() : ''}
//                 </time>

//                 <a
//                   href={`/blog/${b.slug}`}
//                   className="mt-auto bg-[#1e5ba8] text-white px-4 py-2 rounded text-sm inline-flex w-fit"
//                 >
//                   Read More
//                 </a>
//               </article>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }



'use client';

import { useMemo } from 'react';
import Image from 'next/image';

export default function RecentBlogs({ blogs }: any) {
  /* ---------------- NORMALIZE + FILTER ---------------- */
  const normalizedBlogs = useMemo(() => {
    return (blogs || [])
      .filter(
        (b: any) =>
          b.recent_blog === 'YES' && // ✅ admin control
          b.status === 'published'   // ✅ website visibility
      )
      .map((blog: any) => ({
        id: blog.blog_id || blog.id,
        title: blog.blog_name || blog.title,
        slug: blog.url_friendly_title || blog.slug,
        image:
          blog.banner_image ||
          blog.thumbnail_image ||
          '/placeholder.png',
        date: blog.published_at,
      }));
  }, [blogs]);

  /* ---------------- SORT (NEWEST FIRST) ---------------- */
  const sortedBlogs = useMemo(() => {
    return [...normalizedBlogs].sort(
      (a, b) =>
        new Date(b.date || 0).getTime() -
        new Date(a.date || 0).getTime()
    );
  }, [normalizedBlogs]);

  /* ---------------- HIDE SECTION IF EMPTY ---------------- */
  if (sortedBlogs.length === 0) return null;

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-10">
          Recent Blogs
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedBlogs.map((b: any) => {
            let img = b.image;
            if (!img.startsWith('http') && !img.startsWith('/')) {
              img = '/' + img;
            }

            return (
              <article
                key={b.id}
                className="bg-white rounded-xl shadow border p-4 flex flex-col"
              >
                <Image
                  src={img}
                  alt={b.title}
                  width={400}
                  height={225}
                  className="rounded-lg object-cover mb-4"
                  quality={85}
                />

                <h3 className="font-bold text-lg mb-2 line-clamp-2">
                  {b.title}
                </h3>

                <time className="text-sm text-gray-500 mb-4">
                  {b.date ? new Date(b.date).toDateString() : ''}
                </time>

                <a
                  href={`/blog/${b.slug}`}
                  className="mt-auto bg-[#1e5ba8] text-white px-4 py-2 rounded text-sm inline-flex w-fit"
                >
                  Read More
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
