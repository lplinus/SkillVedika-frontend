// import SafeHTML from '@/components/SafeHTML';

// interface BlogContentProps {
//   post: {
//     blog_content?: string;
//     content?: string;
//     body?: string;
//   };
// }

// export default function BlogContent({ post }: BlogContentProps) {
//   const content = post?.blog_content || post?.content || post?.body || '';

//   return (
//     <section className="py-16 px-6 bg-white">
//       <div className="max-w-7xl mx-auto">
//         <article
//           className="
//     max-w-none
//     text-gray-800
//     [&_p]:my-6
//     [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:my-10
//     [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:my-8
//     [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:my-6
//   "
//         >
//           <SafeHTML html={content} />
//         </article>
//       </div>
//     </section>
//   );
// }


import SafeHTML from "@/components/SafeHTML";

interface BlogContentProps {
  post: {
    blog_content?: string;
    content?: string;
    body?: string;
  };
}

export default function BlogContent({ post }: BlogContentProps) {
  const content = post?.blog_content || post?.content || post?.body || "";

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <article
          className="
            max-w-none
            text-gray-800
            leading-relaxed

            /* Paragraphs */
            [&_p]:my-6

            /* Headings */
            [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:my-10
            [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:my-8
            [&_h3]:text-xl  [&_h3]:font-semibold [&_h3]:my-6

            /* Lists */
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-6
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-6
            [&_li]:my-2

            /* Blockquote */
            [&_blockquote]:border-l-4
            [&_blockquote]:border-gray-300
            [&_blockquote]:pl-4
            [&_blockquote]:italic
            [&_blockquote]:my-8

            /* Images */
            [&_img]:my-10
            [&_img]:rounded-xl
            [&_img]:mx-auto

            /* Text align (TipTap inline styles) */
            [&_[style*='text-align:center']]:text-center
            [&_[style*='text-align:right']]:text-right
            [&_[style*='text-align:justify']]:text-justify
          "
        >
          <SafeHTML html={content} />
        </article>
      </div>
    </section>
  );
}
