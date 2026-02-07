// import { useMemo } from 'react';
// import Image from 'next/image';
// import parse from 'html-react-parser';

// function optimizeCloudinary(
//   url: string,
//   width: number,
//   height: number
// ) {
//   if (!url) return '/placeholder.svg';

//   // Skip optimization for SVGs and local placeholders
//   if (url.endsWith('.svg') || !url.includes('res.cloudinary.com')) {
//     return url;
//   }

//   return url.replace(
//     '/upload/',
//     `/upload/w_${width},h_${height},c_fill,q_auto,f_auto/`
//   );
// }

// interface BlogItem {
//   id: number;
//   title: string;
//   slug: string;
//   image: string;
//   date: string | null;
//   recent: 'YES' | 'NO';
// }

// export default function RecentBlogs({
//   blogs = [],
//   blogHeading,
// }: {
//   blogs: any[];
//   blogHeading?: string;
// }) {
//   /* ---------------- NORMALIZE DATA ---------------- */
//   const normalizedBlogs: BlogItem[] = useMemo(
//     () =>
//       blogs.map((blog: any) => ({
//         id: blog.blog_id ?? blog.id,
//         title: blog.blog_name ?? blog.title ?? '',
//         slug: blog.url_friendly_title ?? blog.slug ?? '',
//         image:
//           blog.banner_image ||
//           blog.thumbnail_image ||
//           '/placeholder.svg',
//         date: blog.published_at ?? null,
//         recent: blog.recent_blog ?? 'NO', // ✅ IMPORTANT
//       })),
//     [blogs]
//   );

//   /* ---------------- FILTER + SORT ---------------- */
//   const recentBlogs = useMemo(() => {
//     return normalizedBlogs
//       .filter(blog => blog.recent === 'YES') // ✅ ONLY SHOW YES
//       .sort(
//         (a, b) =>
//           new Date(b.date || 0).getTime() -
//           new Date(a.date || 0).getTime()
//       );
//   }, [normalizedBlogs]);

//   /* ---------------- EMPTY STATE ---------------- */
//   if (recentBlogs.length === 0) {
//     return null; // ✅ Hide section completely if no recent blogs
//   }

//   return (
//     <section className="py-12 sm:py-16 px-4 sm:px-6 bg-white relative">
//       <div className="max-w-7xl mx-auto">
//         {/* ---------- HEADING ---------- */}
//         {blogHeading ? (
//           typeof blogHeading === 'string' &&
//           (blogHeading.includes('<h1') ||
//             blogHeading.includes('<h2') ||
//             blogHeading.includes('<h3')) ? (
//             <div className="mb-8 sm:mb-12">
//               {parse(blogHeading)}
//             </div>
//           ) : (
//             <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 sm:mb-12 px-2">
//               {parse(blogHeading)}
//             </h2>
//           )
//         ) : (
//           <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 sm:mb-12 px-2">
//             Recent Blogs
//           </h2>
//         )}

//         {/* ---------- BLOG SLIDER ---------- */}
//         <div className="relative -mx-4 sm:-mx-6 px-4 sm:px-6 group min-h-[450px]">
//           <div className="hidden md:block pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-white to-transparent z-10" />

//           <div
//             className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hidden pb-4"
//             role="region"
//             aria-label="Recent blog posts"
//           >
//             {recentBlogs.map((blog, index) => {
//               let img = blog.image;
//               if (
//                 img &&
//                 !img.startsWith('/') &&
//                 !img.startsWith('http')
//               ) {
//                 img = '/' + img;
//               }

//               return (
//                 <div
//                   key={blog.id}
//                   className="snap-start bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition p-4 border flex flex-col w-[280px] sm:w-[320px] md:w-[350px] h-[420px] flex-shrink-0"
//                 >
//                   {/* IMAGE */}
//                   <div className="relative w-full aspect-[16/9] mb-4 rounded-lg overflow-hidden">
//                     <Image
//                       src={optimizeCloudinary(img, 700, 394)}
//                       alt={blog.title}
//                       fill
//                       className="object-cover"
//                       sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, 350px"
//                       loading={index === 0 ? 'eager' : 'lazy'}
//                       priority={index === 0}
//                     />
//                   </div>

//                   {/* CONTENT */}
//                   <div className="flex flex-col flex-1">
//                     <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
//                       {blog.title}
//                     </h3>

//                     <span className="text-xs sm:text-sm text-gray-500 mb-3">
//                       {blog.date
//                         ? new Date(blog.date).toDateString()
//                         : ''}
//                     </span>

//                     <a
//                       href={`/blog/${blog.slug}`}
//                       aria-label={`Read more about ${blog.title}`}
//                       className="bg-[#1e5ba8] text-white px-4 py-2 rounded text-sm hover:bg-blue-700 mt-auto self-start min-h-[44px] flex items-center"
//                     >
//                       Read More
//                     </a>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

import { useMemo } from 'react';
import Image from 'next/image';
import parse from 'html-react-parser';

function optimizeCloudinary(url: string, width: number, height: number) {
  if (!url) return '/placeholder.svg';
  if (url.endsWith('.svg') || !url.includes('res.cloudinary.com')) {
    return url;
  }
  return url.replace(
    '/upload/',
    `/upload/w_${width},h_${height},c_fill,q_auto,f_auto/`
  );
}

interface BlogItem {
  id: number;
  title: string;
  slug: string;
  image: string;
  date: string | null;
  recent: 'YES' | 'NO';
  status: 'published' | 'draft' | 'archived';
}

export default function RecentBlogs({
  blogs = [],
  blogHeading,
}: {
  blogs: any[];
  blogHeading?: string;
}) {
  /* ---------------- NORMALIZE DATA ---------------- */
  const normalizedBlogs: BlogItem[] = useMemo(
    () =>
      blogs.map((blog: any) => ({
        id: blog.blog_id ?? blog.id,
        title: blog.blog_name ?? blog.title ?? '',
        slug: blog.url_friendly_title ?? blog.slug ?? '',
        image:
          blog.banner_image ||
          blog.thumbnail_image ||
          '/placeholder.svg',
        date: blog.published_at ?? null,
        recent: blog.recent_blog ?? 'NO',
        status: blog.status ?? 'draft',
      })),
    [blogs]
  );

  /* ---------------- FILTER + SORT ---------------- */
  const recentBlogs = useMemo(() => {
    return normalizedBlogs
      .filter(
        blog =>
          blog.recent === 'YES' &&
          blog.status === 'published'
      )
      .sort(
        (a, b) =>
          new Date(b.date || 0).getTime() -
          new Date(a.date || 0).getTime()
      );
  }, [normalizedBlogs]);

  if (recentBlogs.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 bg-white relative">
      <div className="max-w-7xl mx-auto">
        {blogHeading ? (
          typeof blogHeading === 'string' &&
            (blogHeading.includes('<h1') ||
              blogHeading.includes('<h2') ||
              blogHeading.includes('<h3')) ? (
            <div className="mb-8 sm:mb-12">{parse(blogHeading)}</div>
          ) : (
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 sm:mb-12 px-2">
              {parse(blogHeading)}
            </h2>
          )
        ) : (
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 sm:mb-12 px-2">
            Recent Blogs
          </h2>
        )}

        <div className="relative -mx-4 sm:-mx-6 px-4 sm:px-6 group min-h-[450px]">
          <div className="hidden md:block pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-white to-transparent z-10" />

          <div className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4">
            {/* index */}
            {recentBlogs.map((blog) => {   
              let img = blog.image;
              if (!img.startsWith('/') && !img.startsWith('http')) {
                img = '/' + img;
              }

              return (
                <div
                  key={blog.id}
                  className="snap-start bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition p-4 border flex flex-col w-[280px] sm:w-[320px] md:w-[350px] h-[420px] flex-shrink-0"
                >
                  <div className="relative w-full aspect-[16/9] mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={optimizeCloudinary(img, 700, 394)}
                      alt={blog.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, 350px"
                      // loading={index === 0 ? 'eager' : 'lazy'}
                      // priority={index === 0}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  <div className="flex flex-col flex-1">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
                      {blog.title}
                    </h3>

                    <span className="text-xs sm:text-sm text-gray-500 mb-3">
                      {blog.date
                        ? new Date(blog.date).toDateString()
                        : ''}
                    </span>

                    {/* <a
                      href={`/blog/${blog.slug}`}
                      className="bg-[#1e5ba8] text-white px-4 py-2 rounded text-sm mt-auto self-start min-h-[44px] flex items-center"
                    >
                      Read More
                    </a> */}
                    <a
                      href={`/blog/${blog.slug}`}
                      aria-label={`Read more about ${blog.title}`}
                      className="bg-[#1e5ba8] text-white px-4 py-2 rounded text-sm mt-auto self-start min-h-[44px] flex items-center"
                    >
                      Read More
                      <span className="sr-only"> about {blog.title}</span>
                    </a>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
