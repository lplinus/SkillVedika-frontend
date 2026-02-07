'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { getApiBaseUrl } from '@/lib/apiConfig';

type Blog = {
  id: number;
  title: string;
  description: string;
  image: string;
  slug: string;
  date: string;
};

export interface BlogSectionProps {
  sidebarName?: string;
}


export default function BlogSection(_props: BlogSectionProps) {
  const API = getApiBaseUrl();

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const perPage = 9;

  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API}/blog-categories`);
        const data = await res.json();

        const normalized = (data || []).map((cat: any) => ({
          id: String(cat.category_id || cat.id),
          name: cat.category_name || cat.name,
        }));

        setCategories([{ id: 'all', name: 'All Categories' }, ...normalized]);
      } catch {
        setCategories([{ id: 'all', name: 'All Categories' }]);
      }
    };

    fetchCategories();
  }, [API]);

  /* ---------------------------------------
     FETCH BLOGS
  --------------------------------------- */
  const fetchBlogs = async () => {
    try {
      setLoading(true);

      const url = new URL(`${API}/blogs/public`);

      if (selectedCategory !== 'all') {
        url.searchParams.append('categories[0]', selectedCategory);
      }

      if (searchTerm.trim()) {
        url.searchParams.append('search', searchTerm.trim());
      }

      const res = await fetch(url.toString());
      const data = await res.json();

      const normalized: Blog[] = (data || []).map((item: any) => {
        let img =
          item.banner_image ||
          item.thumbnail_image ||
          '/placeholder.svg';

        if (typeof img === 'string' && img.startsWith('[')) {
          try {
            const parsed = JSON.parse(img);
            img =
              parsed.thumbnail ||
              parsed.banner ||
              Object.values(parsed)[0] ||
              '/placeholder.svg';
          } catch {
            img = '/placeholder.svg';
          }
        }

        if (!img.startsWith('http') && !img.startsWith('/')) {
          img = '/' + img;
        }

        return {
          id: item.id || item.blog_id,
          title: item.blog_name || item.title,
          description: item.short_description || '',
          image: img,
          slug: item.url_friendly_title,
          date: item.published_at
            ? new Date(item.published_at).toDateString()
            : '',
        };
      });

      setBlogs(normalized);
      setPage(1);
    } catch {
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };


  /* ---------------------------------------
     FETCH ON LOAD & SEARCH
  --------------------------------------- */
  useEffect(() => {
    const delay = setTimeout(fetchBlogs, 300);
    return () => clearTimeout(delay);
  }, [searchTerm, selectedCategory]);

  /* ---------------------------------------
     PAGINATION
  --------------------------------------- */
  const totalPages = Math.max(1, Math.ceil(blogs.length / perPage));
  const paginatedBlogs = blogs.slice(
    (page - 1) * perPage,
    page * perPage
  );

  /* ---------------------------------------
     BLOG CARD
  --------------------------------------- */
  const BlogCard = ({ blog }: { blog: Blog }) => {
    const href = `/blog/${blog.slug}`;

    return (
      <article
        onClick={() => (window.location.href = href)}
        className="cursor-pointer bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition overflow-hidden"
      >
        <div className="relative h-44 w-full bg-gray-100">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>

        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {blog.title}
          </h3>

          <p className="text-sm text-gray-600 line-clamp-3 mb-4">
            {blog.description}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{blog.date}</span>
            <span className="text-[#1E5BA8] font-medium">
              Read more →
            </span>
          </div>
        </div>
      </article>
    );
  };

  /* ---------------------------------------
     UI
  --------------------------------------- */
  return (
    <section className="py-12 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto">

        <div className="mb-10 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">

          {/* SEARCH */}
          <div className="relative w-full sm:max-w-lg">
            <input
              type="text"
              placeholder="Search blogs by topic, keyword, or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#1E5BA8] outline-none"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {/* CATEGORY FILTER */}
          <div className="relative w-full sm:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full appearance-none px-5 py-3 rounded-xl border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-[#1E5BA8] outline-none cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Dropdown icon */}
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              ▾
            </span>
          </div>



          {/* <div className="relative w-full max-w-2xl">
            <input
              type="text"
              placeholder="Search blogs by topic, keyword, or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#1E5BA8] outline-none"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div> */}
        </div>

        {/* BLOG GRID */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">
            Loading blogs...
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No blogs found.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-6 mt-12">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-40"
                >
                  <ChevronLeft size={18} />
                  Prev
                </button>

                <span className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section >

  );
} 