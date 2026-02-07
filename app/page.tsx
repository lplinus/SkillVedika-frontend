// import { Metadata } from 'next';
// import Hero from '@/components/home/hero';
// import HomePageClient from './HomePageClient';
// import { StructuredData } from '@/lib/structuredData';
// import KeyFeatures from '@/components/home/key-features';
// import JobAssistance from '@/components/home/job-assistance';
// import JobProgrammeSupport from '@/components/home/job-programme-support';
// import RecentBlog from '@/components/home/recent-blog';
// import { Suspense } from 'react';
// import { getApiUrl } from '@/lib/apiConfig';

// // Adaptive timeout (dev vs prod)
// const TIMEOUT =
//   process.env.NODE_ENV === 'production' ? 4000 : 2000;

// /* ================================
//    SERVER DATA FETCHERS
// ================================ */

// // Fetch homepage data
// async function getHomePageData() {
//   try {
//     const apiUrl = getApiUrl('/homepage');

//     const timeoutPromise = new Promise<never>((_, reject) => {
//       setTimeout(() => reject(new Error('Timeout')), TIMEOUT);
//     });

//     const fetchPromise = (async () => {
//       const res = await fetch(apiUrl, {
//         next: { revalidate: 300 },
//         headers: { Accept: 'application/json' },
//       });

//       if (!res.ok) return null;

//       const contentType = res.headers.get('content-type');
//       if (!contentType?.includes('application/json')) return null;

//       return await res.json();
//     })();

//     return await Promise.race([fetchPromise, timeoutPromise]);
//   } catch {
//     return null;
//   }
// }

// // Fetch blogs
// async function getBlogs() {
//   try {
//     const apiUrl = getApiUrl('/blogs?recent=yes');

//     const timeoutPromise = new Promise<never>((_, reject) => {
//       setTimeout(() => reject(new Error('Timeout')), TIMEOUT);
//     });

//     const fetchPromise = (async () => {
//       const res = await fetch(apiUrl, {
//         next: { revalidate: 300 },
//         headers: { Accept: 'application/json' },
//       });

//       if (!res.ok) return [];

//       const data = await res.json();
//       return Array.isArray(data) ? data.slice(0, 6) : [];
//     })();

//     return await Promise.race([fetchPromise, timeoutPromise]);
//   } catch {
//     return [];
//   }
// }

// /* ================================
//    SEO METADATA
// ================================ */

// export async function generateMetadata(): Promise<Metadata> {
//   const FALLBACK_DESCRIPTION =
//     'SkillVedika offers industry-ready online courses, corporate training, and job support programs designed to help professionals grow their careers in IT and technology.';

//   try {
//     const apiUrl = getApiUrl('/seo?slug=home');

//     const res = await fetch(apiUrl, {
//       next: { revalidate: 300 },
//       headers: { Accept: 'application/json' },
//     });

//     if (res.ok) {
//       const json = await res.json();
//       const seo = json?.data ?? json;

//       return {
//         title:
//           seo?.meta_title ||
//           'SkillVedika - Online Courses & Professional Training',

//         description:
//           seo?.meta_description?.trim() ||
//           FALLBACK_DESCRIPTION,

//         keywords: seo?.meta_keywords,

//         openGraph: {
//           title:
//             seo?.meta_title ||
//             'SkillVedika - Online Courses & Professional Training',
//           description:
//             seo?.meta_description?.trim() ||
//             FALLBACK_DESCRIPTION,
//         },

//         twitter: {
//           card: 'summary_large_image',
//           description:
//             seo?.meta_description?.trim() ||
//             FALLBACK_DESCRIPTION,
//         },
//       };
//     }
//   } catch {
//     // silent fallback
//   }

//   // ✅ GUARANTEED fallback
//   return {
//     title: 'SkillVedika - Online Courses & Professional Training',
//     description: FALLBACK_DESCRIPTION,
//   };
// }


// /* ================================
//    PAGE
// ================================ */

// export default async function Home() {
//   const [homeResult, blogsResult] = await Promise.allSettled([
//     getHomePageData(),
//     getBlogs(),
//   ]);

//   const home = homeResult.status === 'fulfilled' ? homeResult.value : null;
//   const blogs = blogsResult.status === 'fulfilled' ? blogsResult.value : [];

//   return (
//     <main className="min-h-screen bg-[#F0F4F9] overflow-x-hidden">
//       <StructuredData data={[{}, {}, {}]} />

//       <Hero hero={home ?? undefined} />

//       <Suspense fallback={null}>
//         <HomePageClient explore={home ?? undefined} />
//       </Suspense>

//       <KeyFeatures keyFeatures={home ?? undefined} />
//       <JobAssistance jobAssist={home ?? undefined} />
//       <JobProgrammeSupport jobSupport={home ?? undefined} />
//       <RecentBlog blogs={blogs} blogHeading={home?.blog_section_heading} />
//     </main>
//   );
// }





import { Metadata } from 'next';
import { Suspense } from 'react';

import Hero from '@/components/home/hero';
import HomePageClient from './HomePageClient';
import KeyFeatures from '@/components/home/key-features';
import JobAssistance from '@/components/home/job-assistance';
import JobProgrammeSupport from '@/components/home/job-programme-support';
import RecentBlog from '@/components/home/recent-blog';

import { StructuredData } from '@/lib/structuredData';
import { getHomeSchema } from '@/lib/schema/homeSchema';
import { getApiUrl } from '@/lib/apiConfig';

export const revalidate = 300;  //newly added code
export const dynamic = 'force-static';  //newly added code


/* ================================
   CONFIG
================================ */
const TIMEOUT =
  process.env.NODE_ENV === 'production' ? 4000 : 2000;

/* ================================
   SERVER DATA FETCHERS
================================ */

// Homepage content
async function getHomePageData() {
  try {
    const apiUrl = getApiUrl('/homepage');

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), TIMEOUT)
    );

    const fetchPromise = (async () => {
      const res = await fetch(apiUrl, {
        next: { revalidate: 300 },
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) return null;
      if (!res.headers.get('content-type')?.includes('application/json'))
        return null;

      return await res.json();
    })();

    return await Promise.race([fetchPromise, timeoutPromise]);
  } catch {
    return null;
  }
}

// Recent blogs
async function getBlogs() {
  try {
    const apiUrl = getApiUrl('/blogs/public');

    const res = await fetch(apiUrl, {
      next: { revalidate: 300 },
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) return [];

    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data
      .filter(
        blog =>
          blog.status === 'published' &&
          blog.recent_blog === 'YES'
      )
      .sort(
        (a, b) =>
          new Date(b.published_at || 0).getTime() -
          new Date(a.published_at || 0).getTime()
      )
      .slice(0, 6);
  } catch {
    return [];
  }
}


// SEO data (used for metadata + schema)
async function getHomeSeo() {
  try {
    const res = await fetch(getApiUrl('/seo?slug=home'), {
      next: { revalidate: 300 },
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? json;
  } catch {
    return null;
  }
}

/* ================================
   SEO METADATA
================================ */
export async function generateMetadata(): Promise<Metadata> {
  const FALLBACK_DESCRIPTION =
    'SkillVedika offers industry-ready online courses, corporate training, and job support programs designed to help professionals grow their careers in IT and technology.';

  try {
    const seo = await getHomeSeo();

    if (seo) {
      return {
        title:
          seo.meta_title ||
          'SkillVedika – Online Courses & Professional Training',
        description:
          seo.meta_description?.trim() || FALLBACK_DESCRIPTION,
        keywords: seo.meta_keywords,
        openGraph: {
          title:
            seo.meta_title ||
            'SkillVedika – Online Courses & Professional Training',
          description:
            seo.meta_description?.trim() || FALLBACK_DESCRIPTION,
          url: 'https://skillvedika.com/',
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title:
            seo.meta_title ||
            'SkillVedika – Online Courses & Professional Training',
          description:
            seo.meta_description?.trim() || FALLBACK_DESCRIPTION,
        },
      };
    }
  } catch {
    // silent fallback
  }

  return {
    title: 'SkillVedika – Online Courses & Professional Training',
    description: FALLBACK_DESCRIPTION,
  };
}

/* ================================
   PAGE
================================ */
export default async function Home() {
  const [homeResult, blogsResult, seoResult] =
    await Promise.allSettled([
      getHomePageData(),
      getBlogs(),
      getHomeSeo(),
    ]);

  const home =
    homeResult.status === 'fulfilled' ? homeResult.value : null;

  const blogs =
    blogsResult.status === 'fulfilled' ? blogsResult.value : [];

  const seo =
    seoResult.status === 'fulfilled' ? seoResult.value : null;

  return (
    <main className="min-h-screen bg-[#F0F4F9] overflow-x-hidden">
      {/* ✅ VALID HOME PAGE SCHEMA */}
      <StructuredData data={getHomeSchema(seo)} />

      <Hero hero={home ?? undefined} />

      <Suspense fallback={null}>
        <HomePageClient explore={home ?? undefined} />
      </Suspense>

      <KeyFeatures keyFeatures={home ?? undefined} />
      <JobAssistance jobAssist={home ?? undefined} />
      <JobProgrammeSupport jobSupport={home ?? undefined} />
      <RecentBlog
        blogs={blogs}
        blogHeading={home?.blog_section_heading}
      />
    </main>
  );
}
