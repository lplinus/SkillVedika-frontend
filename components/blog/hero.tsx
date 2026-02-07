import Image from 'next/image';

/* ---------------------------------------------
   Cloudinary optimizer for Blog Listing Hero
--------------------------------------------- */
function optimizeCloudinaryCircle(url: string) {
  if (!url) return '/placeholder.svg';

  if (!url.includes('res.cloudinary.com') || url.endsWith('.svg')) {
    return url;
  }

  // Force square image (1:1) – perfect for circular UI
  return url.replace(
    '/upload/',
    '/upload/w_420,h_420,c_fill,q_auto,f_auto/'
  );
}

export default function Hero({
  title,
  description,
  image,
}: {
  title: { text?: string; part1?: string; part2?: string } | null;
  description: string;
  image: string;
}) {
  const optimizedImg = optimizeCloudinaryCircle(
    image || '/blog/Frame 290.webp'
  );

  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">

          {/* LEFT CONTENT */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {(() => {
                const hasParts = Boolean(
                  (title?.part1 && title.part1.trim()) ||
                  (title?.part2 && title.part2.trim())
                );
                const p1 = hasParts
                  ? (title?.part1 ?? title?.text ?? '')
                  : (title?.text ?? 'Explore');
                const p2 = hasParts ? (title?.part2 ?? '') : '';

                return (
                  <>
                    <span className="text-[#1E5BA8]">{p1}</span>{' '}
                    {p2 ? <span className="text-gray-900">{p2}</span> : null}
                  </>
                );
              })()}
            </h1>

            {/* Description */}
            <p
              className="text-gray-700 text-lg mb-8 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: description || '' }}
            />
          </div>

          {/* RIGHT IMAGE — SEO PERFECT */}
          <div className="flex justify-center md:justify-end">
            <div className="relative w-64 sm:w-72 md:w-80 aspect-square rounded-full bg-blue-100 overflow-hidden">
              <Image
                src={optimizedImg}
                alt="Blog illustration"
                fill
                sizes="(max-width: 768px) 256px, (max-width: 1024px) 288px, 320px"
                className="object-contain"
                priority
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
