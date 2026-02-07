import Image from 'next/image';

/* ---------------------------------------------
   Cloudinary optimizer for Blog Hero
--------------------------------------------- */
function optimizeCloudinaryHero(url: string) {
  if (!url) return '/placeholder.svg';

  // If not Cloudinary or SVG, return as-is
  if (!url.includes('res.cloudinary.com') || url.endsWith('.svg')) {
    return url;
  }

  // Force correct hero dimensions (16:5)
  return url.replace(
    '/upload/',
    '/upload/w_1920,h_600,c_fill,q_auto,f_auto/'
  );
}

/* ---------------------------------------------
   BLOG HERO SECTION (SEO SAFE)
--------------------------------------------- */
export default function BlogHero({ post, img }: any) {
  const optimizedImg = optimizeCloudinaryHero(img);

  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-12 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Author row */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-gray-300" />
          <div>
            <p className="font-semibold text-gray-900">
              {post?.published_by || post?.author || 'Admin'}
            </p>
            <p className="text-sm text-gray-500">
              Posted on{' '}
              {post?.published_at
                ? new Date(post.published_at).toDateString()
                : ''}
            </p>
          </div>
        </div>

        {/* Blog Title */}
        <h1 className="text-4xl font-bold mb-8 text-gray-900">
          {post?.blog_name || post?.title || 'Blog'}
        </h1>

        {/* HERO IMAGE — SEO PERFECT */}
        <section className="relative w-full aspect-[16/5] rounded-lg overflow-hidden bg-gray-200">
          <Image
            src={optimizedImg}
            alt={post?.blog_name || 'Blog banner'}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </section>

      </div>
    </section>
  );
}
