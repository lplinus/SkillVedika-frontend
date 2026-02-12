// import BlogHero from '@/components/blog-detail/Hero';
import BlogContent from '@/components/blog-detail/Content';
// import TrendingBlogs from '@/components/blog-detail/TrendingBlogs';//newly trending blogs
// import RelatedBlogs from '@/components/blog-detail/RelatedBlogs';//newly added(recent blogs)
// import RecentBlogs from '@/components/blog-detail/RecentBlogs';
import DemoSection from '@/components/blog-detail/DemoSection';
import { generateBreadcrumbSchema } from '@/lib/structuredData';
import fs from 'node:fs';
import path from 'node:path';
import Image from 'next/image';


// Use auto-dynamic with revalidation for better performance
export const dynamic = 'auto';
export const revalidate = 300; // Revalidate every 5 minutes (blog posts change less frequently)

// Helper to resolve slug from props
async function resolveSlug(props: any): Promise<string> {
  const propsResolved = await props;
  const paramsResolved = await propsResolved.params;
  const slugRaw = paramsResolved?.slug;
  return Array.isArray(slugRaw) ? slugRaw[0] : slugRaw;
}

// Helper to get API URL
function getApiUrl(): string {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
  return apiBase.endsWith('/api') ? apiBase : `${apiBase}/api`;
}

// Helper to fetch blog post
async function fetchBlogPost(api: string, slug: string): Promise<any> {
  try {
    const res = await fetch(`${api}/blogs/${slug}`, { cache: 'no-store' });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Silently fail
  }
  return null;
}

// Helper to process image URL
function processImageUrl(imageRaw: string, backendOrigin: string): string {
  const imageClean = String(imageRaw ?? '/placeholder.svg')
    .replaceAll(/\s+/g, '')
    .trim();

  if (imageClean.startsWith('http')) {
    return imageClean;
  }

  const publicFile = path.join(process.cwd(), 'public', imageClean.replace(/^\/+/, ''));
  if (fs.existsSync(publicFile)) {
    return imageClean.startsWith('/') ? imageClean : `/${imageClean}`;
  }

  return imageClean.startsWith('/')
    ? `${backendOrigin}${imageClean}`
    : `${backendOrigin}/${imageClean}`;
}

// Helper to build metadata from post
function buildMetadataFromPost(post: any, canonicalUrl: string, image: string) {
  const metaTitle = post.meta_title || post.blog_name;
  const metaDescription =
    post.meta_description ||
    (post.blog_content ? post.blog_content.replaceAll(/<[^>]*>/g, '').slice(0, 155) : '');
  const metaKeywords = post.meta_keywords
    ? post.meta_keywords.split(',').map((k: string) => k.trim())
    : [];

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      images: [image],
      type: 'article',
      url: canonicalUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [image],
    },
  };
}

/* ============================================================
   1. DYNAMIC METADATA (Next 16 safe version)
============================================================ */
export async function generateMetadata(props: any) {
  const slug = await resolveSlug(props);
  const api = getApiUrl();
  const post = await fetchBlogPost(api, slug);

  if (!post) {
    return {
      title: 'Blog Not Found | SkillVedika',
      description: 'The requested blog post could not be found.',
    };
  }

  const backendOrigin = api.replace(/\/api$/, '');
  const imageRaw = post.thumbnail_image || post.banner_image || '/placeholder.svg';
  const image = processImageUrl(imageRaw, backendOrigin);

  const { getCanonicalUrl } = await import('@/lib/seo');
  const canonicalUrl = getCanonicalUrl(`/blog/${slug}`);

  return buildMetadataFromPost(post, canonicalUrl, image);
}

// Helper to process image from post
function processPostImage(post: any): string {
  let img = post?.banner_image || post?.thumbnail_image || post?.images || '/placeholder.svg';

  if (typeof img === 'string' && img.startsWith('[')) {
    try {
      const parsed = JSON.parse(img);
      img = parsed.thumbnail || parsed.banner || Object.values(parsed)[0] || '/placeholder.svg';
    } catch {
      // Silently fail
    }
  }

  if (typeof img === 'string') {
    img = img.replaceAll(/\r?\n/g, '').trim();
  }

  return img;
}

// Helper to fetch trending blogs - ONLY returns if marked 'yes'
async function fetchTrendingBlogs(api: string): Promise<any[]> {
  try {
    // Use no-store so trending blogs reflect admin changes immediately
    const res = await fetch(`${api}/blogs/public?is_trending=yes`, {
      cache: 'no-store',
    });

    if (res.ok) {
      const list = await res.json();
      // Only return blogs that actually have is_trending === 'yes'
      return Array.isArray(list)
        ? list.filter((b: any) => b.is_trending === 'yes')
        : [];
    }
  } catch (error) {
    console.error("Trending fetch error:", error);
  }
  return [];
}

// Helper to fetch recent blogs — no limit, show all marked as recent
// async function fetchRecentBlogs(api: string): Promise<any[]> {
//   try {
//     const res = await fetch(`${api}/blogs/public`, {
//       cache: 'no-store',
//     });
//     if (res.ok) {
//       const list = await res.json();
//       if (Array.isArray(list)) {
//         // Filter to only blogs marked as recent by admin
//         return list.filter(
//           (b: any) =>
//             b.recent_blog === 'YES' &&
//             String(b.status).toLowerCase() === 'published'
//         );
//       }
//     }
//   } catch {
//     // Silently fail
//   }
//   return [];
// }


//related blogs-------------------------------
async function fetchRelatedBlogs(api: string, slug: string): Promise<any[]> {
  if (!slug) return [];

  try {
    const res = await fetch(
      `${api}/blogs/public?related_to=${encodeURIComponent(slug)}`,
      {
        cache: 'no-store',
      }
    );

    if (res.ok) {
      const list = await res.json();
      return Array.isArray(list) ? list : [];
    }
  } catch {
    // silent fail
  }

  return [];
}


// Helper to process API response
async function processResponse<T>(
  result: PromiseSettledResult<Response>,
  parser: (json: any) => T,
  fallback: T
): Promise<T> {
  if (result.status === 'fulfilled' && result.value.ok) {
    try {
      const json = await result.value.json();
      return parser(json);
    } catch {
      // Silently fail
    }
  }
  return fallback;
}



/* ============================================================
   2. PAGE COMPONENT — Updated for Next.js 16
============================================================ */
export default async function BlogDetailPage(props: any) {
  const cleanSlug = await resolveSlug(props);
  const envBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';
  const api = envBase.endsWith('/api') ? envBase : `${envBase}/api`;

  // ⚡ OPTIMIZATION: Fetch all data in parallel for better performance
  const [postRes, , coursesRes, formDetailsRes] = await Promise.allSettled([
    fetch(`${api}/blogs/${cleanSlug}`, { cache: 'force-cache', next: { revalidate: 300 } }),
    fetch(`${api}/blogs?recent=yes`, { cache: 'force-cache', next: { revalidate: 300 } }),
    fetch(`${api}/courses`, { next: { revalidate: 86400 } }),
    fetch(`${api}/form-details`, { cache: 'force-cache', next: { revalidate: 3600 } }),
  ]);

  // Process all responses
  const post = await processResponse(postRes, (json) => json, null);
  // const recentBlogs = await fetchRecentBlogs(api);
  const trendingBlogs = await fetchTrendingBlogs(api);
  const relatedBlogs = await fetchRelatedBlogs(api, cleanSlug);

  const allCourses = await processResponse(
    coursesRes,
    (json) => Array.isArray(json) ? json : json?.data || json?.courses || [],
    []
  );
  const formDetails = await processResponse(
    formDetailsRes,
    (json) => {
      const payload = json.data ?? json;
      return Array.isArray(payload) ? (payload.at(-1) ?? null) : payload;
    },
    null
  );

  // Process image
  const img = post ? processPostImage(post) : '/placeholder.svg';

  /* -----------------------------
     If post STILL not found
  ----------------------------- */
  if (!post) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
          <a href="/blog" className="text-blue-600 hover:underline">
            Back to Blogs
          </a>
        </div>
      </main>
    );
  }

  // Ensure absolute URL for images
  const backendOrigin = api.replace(/\/api$/, '');
  const finalImage = processImageUrl(img, backendOrigin);


  /* -----------------------------
   GENERATE STRUCTURED DATA
----------------------------- */
  const { generateBlogPostingSchema, StructuredData } =
    await import('@/lib/structuredData');
  const { getCanonicalUrl } = await import('@/lib/seo');

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://skillvedika.com';

  const canonicalUrl = getCanonicalUrl(`/blog/${cleanSlug}`);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteUrl },
    { name: 'Blog', url: `${siteUrl}/blog` },
    { name: post.title || post.blog_name || 'Blog Post' },
  ]);

  const blogPostingSchema = generateBlogPostingSchema({
    headline: post.title || 'Blog Post',
    description: post.description || post.excerpt || post.meta_description || '',
    image: finalImage,
    datePublished: post.published_at || post.created_at || '',
    dateModified: post.updated_at || post.published_at || post.created_at || '',
    url: canonicalUrl,
    authorName: post.author || 'SkillVedika',
    publisherName: 'SkillVedika',
    publisherLogo: `${siteUrl}/skillvedika-logo.webp`,
  });

  /* -----------------------------
     Render page successfully
  ----------------------------- */
  return (
    <main className="min-h-screen bg-white flex flex-col">
      <StructuredData data={[blogPostingSchema, breadcrumbSchema]} />

      {/* Main Content Section */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* ================= LEFT: BLOG CONTENT ================= */}
            <article className="lg:col-span-8 pt-10 pb-20">
              {/* Author */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gray-300" />
                <div>
                  <p className="font-semibold text-gray-900">
                    {post?.published_by || post?.author || 'Admin'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {post?.published_at
                      ? new Date(post.published_at).toDateString()
                      : ''}
                  </p>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
                {post?.blog_name || post?.title}
              </h1>

              {/* BIG HERO IMAGE */}
              <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-10 shadow-sm">
                <Image
                  src={finalImage}
                  alt={post?.blog_name || 'Blog image'}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Blog Content */}
              <div className="prose prose-lg max-w-none [&>*:first-child]:mt-0">
                <BlogContent post={post} />
              </div>
            </article>

            {/* ================= RIGHT: FIXED SIDEBAR ================= */}
            <aside className="lg:col-span-4 relative self-start sticky top-10">
              {/* Changed pt-10 to pt-32 to move the blocks down level with the title */}
              <div className="space-y-10 pt-32 pb-20">

                {/* Trending Blogs */}
                {trendingBlogs.length > 0 && (
                  <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
                    <h3 className="text-lg font-bold px-5 py-4 border-b bg-gray-50/50">
                      Trending Blogs
                    </h3>
                    <div className="divide-y divide-gray-50">
                      {trendingBlogs
                        .filter((blog: any) => blog.blog_id !== post?.blog_id)
                        .map((blog: any) => (
                          <a
                            key={blog.blog_id}
                            href={`/blog/${blog.url_friendly_title}`}
                            className="flex gap-3 p-4 hover:bg-gray-50 transition-colors"
                          >
                            <div className="w-16 h-16 relative rounded overflow-hidden shrink-0 shadow-sm">
                              <Image
                                src={processImageUrl(
                                  blog.thumbnail_image || blog.banner_image,
                                  backendOrigin
                                )}
                                alt={blog.blog_name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex flex-col justify-center">
                              <p className="text-sm font-semibold line-clamp-2 text-gray-800">
                                {blog.blog_name}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {blog.published_at
                                  ? new Date(blog.published_at).toDateString()
                                  : 'Recent'}
                              </p>
                            </div>
                          </a>
                        ))}
                    </div>
                  </div>
                )}

                {/* Recent Blogs — commented out, shown on other pages */}
                {/* {recentBlogs.length > 0 && (
                  <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
                    <h3 className="text-lg font-bold px-5 py-4 border-b bg-gray-50/50">
                      Recent Blogs
                    </h3>
                    <div className="divide-y divide-gray-50">
                      {recentBlogs.map((blog: any) => (
                        <a
                          key={blog.blog_id}
                          href={`/blog/${blog.url_friendly_title}`}
                          className="flex gap-3 p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-16 h-16 relative rounded overflow-hidden shrink-0 shadow-sm">
                            <Image
                              src={processImageUrl(
                                blog.thumbnail_image || blog.banner_image,
                                backendOrigin
                              )}
                              alt={blog.blog_name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-col justify-center">
                            <p className="text-sm font-semibold line-clamp-2 text-gray-800">
                              {blog.blog_name}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {blog.published_at
                                ? new Date(blog.published_at).toDateString()
                                : 'Recent'}
                            </p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )} */}

                {/* Related Blogs */}
                {relatedBlogs.length > 0 && (
                  <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
                    <h3 className="text-lg font-bold px-5 py-4 border-b bg-gray-50/50">
                      Related Blogs
                    </h3>
                    <div className="divide-y divide-gray-50">
                      {relatedBlogs
                        .filter((blog: any) => blog.blog_id !== post?.blog_id)
                        .map((blog: any) => (
                          <a
                            key={blog.blog_id}
                            href={`/blog/${blog.url_friendly_title}`}
                            className="flex gap-3 p-4 hover:bg-gray-50 transition-colors"
                          >
                            <div className="w-16 h-16 relative rounded overflow-hidden shrink-0 shadow-sm">
                              <Image
                                src={processImageUrl(
                                  blog.thumbnail_image || blog.banner_image,
                                  backendOrigin
                                )}
                                alt={blog.blog_name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex flex-col justify-center">
                              <p className="text-sm font-semibold line-clamp-2 text-gray-800">
                                {blog.blog_name}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {blog.published_at
                                  ? new Date(blog.published_at).toDateString()
                                  : 'Recent'}
                              </p>
                            </div>
                          </a>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>

          </div>
        </div>
      </section>

      {/* ================= BOTTOM: FORM SECTION ================= */}
      <DemoSection allCourses={allCourses} formDetails={formDetails} />
    </main>
  );
}
