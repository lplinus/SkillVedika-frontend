'use client';

import { INDUSTRY_SKILLS } from './hero-search.worker';
import Image from 'next/image';
import { Search, CheckCircle2, X } from 'lucide-react';
import { useState, useEffect, useRef, startTransition, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import parse from 'html-react-parser';

interface HeroProps {
  hero?: any;
}
//newly added
// const [dynamicPlaceholder, setDynamicPlaceholder] = useState('Search by skill');


const DEFAULT_HERO_HEADING =
  'SkillVedika – IT Training Institute for SAP, AWS DevOps & Salesforce Courses';


function normalizeImageSrc(src?: string) {
  if (!src || typeof src !== 'string') return '/home/Frame 162.webp';

  // valid absolute URLs
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  // valid local public assets
  if (src.startsWith('/')) {
    return src;
  }

  // ❌ everything else (public_id, garbage, old DB values)
  return '/home/Frame 162.webp';
}

const isBrowser = typeof window !== 'undefined';

// Performance: Memoize Hero component to prevent unnecessary re-renders
function Hero({ hero }: Readonly<HeroProps>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showPopular, setShowPopular] = useState(false);
  const [suggestions, setSuggestions] = useState<{
    popular: string[];
    categories: unknown[];
    courses: unknown[];
    blogs: unknown[];
  }>({
    popular: [],
    categories: [],
    courses: [],
    blogs: [],
  });

  const isMobile =
    typeof window !== 'undefined' && window.innerWidth < 768;

  const [showDropdown, setShowDropdown] = useState(false);

  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Performance: useCallback for search handler
  const handleSearch = useCallback(() => {
    if (!searchTerm.trim()) return;
    router.push(`/courses?search=${encodeURIComponent(searchTerm)}`);
    setShowDropdown(false);
  }, [searchTerm, router]);

  // Performance: useCallback for keyboard handler
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleSearch();
      } else if (e.key === 'Escape') {
        setShowDropdown(false);
      }
    },
    [handleSearch]
  );


  // Performance: useCallback for fetch suggestions
  const fetchSuggestions = useCallback(async () => {
    try {
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL ||
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        'http://127.0.0.1:8000/api';

      // If no search term, use empty string to get popular searches
      const query = searchTerm.trim() || '';
      const url = `${apiBase.replace(/\/$/, '')}/search/suggestions?q=${encodeURIComponent(query)}`;

      const res = await fetch(url, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch suggestions: ${res.status}`);
      }

      const data = await res.json();

      // Defer heavy computation to avoid blocking main thread
      const processSuggestions = async () => {
        let mergedPopular: string[] = [];

        if (query) {
          // If there's a search term, rank and merge
          const { rankSkills, INDUSTRY_SKILLS } = await import('./hero-search.worker');

          const rankedIndustry = await rankSkills(INDUSTRY_SKILLS, searchTerm);


          const backendPopular = Array.isArray(data.popular) ? data.popular : [];
          mergedPopular = Array.from(new Set([...backendPopular, ...rankedIndustry])).slice(0, 15);
        } else {
          // If no search term, show top popular from backend or default industry skills
          const backendPopular = Array.isArray(data.popular) ? data.popular : [];
          const defaultPopular = INDUSTRY_SKILLS.slice(0, 15);
          mergedPopular = Array.from(new Set([...backendPopular, ...defaultPopular])).slice(0, 15);
        }

        // Use startTransition for non-urgent UI updates
        startTransition(() => {
          setSuggestions({
            popular: mergedPopular,
            categories: data.categories || [],
            courses: data.courses || [],
            blogs: data.blogs || [],
          });
          // Only show dropdown if there's a search term or popular suggestions
          if (searchTerm.trim() || mergedPopular.length > 0) {
            setShowDropdown(true);
          }
        });
      };

      // Break up work using requestIdleCallback or setTimeout
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        requestIdleCallback(() => processSuggestions(), { timeout: 100 });
      } else {
        setTimeout(() => processSuggestions(), 0);
      }
    } catch (error) {
      console.error(error);
      // Defer fallback computation too
      const processFallback = async () => {
        let fallbackPopular: string[] = [];

        const { rankSkills, INDUSTRY_SKILLS } = await import('./hero-search.worker');

        if (searchTerm.trim()) {
          fallbackPopular = await rankSkills(
            INDUSTRY_SKILLS,
            searchTerm
          );
        } else {
          fallbackPopular = INDUSTRY_SKILLS.slice(0, 15);
        }

        startTransition(() => {
          setSuggestions({
            popular: fallbackPopular,
            categories: [],
            courses: [],
            blogs: [],
          });

          if (searchTerm.trim() || fallbackPopular.length > 0) {
            setShowDropdown(true);
          }
        });
      };


      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        requestIdleCallback(() => processFallback(), { timeout: 100 });
      } else {
        setTimeout(() => processFallback(), 0);
      }
    }
  }, [searchTerm]);


  useEffect(() => {
    if (!isBrowser) return;

    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => setShowPopular(true), { timeout: 1500 });
    } else {
      setTimeout(() => setShowPopular(true), 1200);
    }
  }, []);


  // Debounce search input - optimized with requestIdleCallback
  useEffect(() => {
    if (!isBrowser) return;

    if (searchTerm.trim().length < 2) {
      setShowDropdown(false);
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let idleId: number | null = null;

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      idleId = (window as any).requestIdleCallback(
        () => fetchSuggestions(),
        { timeout: 300 }
      );
    } else {
      timeoutId = globalThis.setTimeout(() => {
        fetchSuggestions();
      }, 300);
    }

    return () => {
      if (idleId !== null && typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
        (window as any).cancelIdleCallback(idleId);
      }
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, [searchTerm, fetchSuggestions]);



  // Click outside handler
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  // Performance: Memoize hero content arrays
  const heroContent = useMemo(() => hero?.hero_content || [], [hero?.hero_content]);
  const heroPopular = useMemo(() => hero?.hero_popular || [], [hero?.hero_popular]);
  const heroImage = useMemo(
    () => normalizeImageSrc(hero?.hero_image),
    [hero?.hero_image]
  );


  // Performance: Memoize suggestion click handler
  const handleSuggestionClick = useCallback(
    (item: string) => {
      setSearchTerm(item);
      handleSearch();
    },
    [handleSearch]
  );

  return (
    <section
      className="hero-section bg-gradient-to-br from-[#E8F0F7] to-[#F0F4F9] py-8 sm:py-12 md:py-16 lg:py-24 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* LEFT SECTION */}
          <div className="space-y-4 sm:space-y-6 order-2 md:order-1">
            {/* ⭐ HERO HEADING FROM CMS */}
            <div className="space-y-3 sm:space-y-4 w-full" id="hero-heading">
              <h1
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.15] min-h-[3.5em] sm:min-h-[3em] md:min-h-[2.8em]"
              >
                {hero?.hero_heading
                  ? parse(hero.hero_heading, {
                    replace: (domNode: any) => {
                      // ✅ Allow highlight span
                      if (domNode.name === 'span') {
                        return (
                          <span className="text-[#2C5AA0]">
                            {domNode.children?.[0]?.data}
                          </span>
                        );
                      }

                      // ❌ Strip block-level tags from CMS
                      if (['h1', 'h2', 'p', 'div'].includes(domNode.name)) {
                        return <>{domNode.children?.map((c: any) => c.data).join('')}</>;
                      }

                      return undefined;
                    },
                  })
                  : DEFAULT_HERO_HEADING}

              </h1>
            </div>

            {/* ⭐ BULLET FEATURES FROM CMS ARRAY */}
            <ul className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm text-gray-700 list-none">
              {heroContent.map((item: string) => (
                <li key={item} className="flex items-center gap-1.5 sm:gap-2">
                  <CheckCircle2
                    size={14}
                    className="sm:w-4 sm:h-4 text-[#2C5AA0] flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="leading-tight">{item}</span>
                </li>
              ))}
            </ul>

            {/* SEARCH BAR */}
            <div className="pt-3 sm:pt-4 relative w-full z-20">
              {/* Accessibility: Proper form with labels */}
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSearch();
                }}
                role="search"
                aria-label="Search courses"
                className="w-full"
              >
                <div className="flex gap-2 flex-row w-full items-center">
                  <label htmlFor="hero-search" className="sr-only">
                    Search by skill
                  </label>
                  <div className="flex-1 flex items-center bg-white rounded-md px-2 sm:px-3 md:px-4 border border-gray-200 min-w-0 relative">
                    <input
                      id="hero-search"
                      type="text"
                      placeholder="Search by skill"
                      value={searchTerm}
                      onChange={e => {
                        setSearchTerm(e.target.value);
                        // Show dropdown when user starts typing
                        if (e.target.value.trim()) {
                          // Will be handled by the useEffect
                        } else {
                          setShowDropdown(false);
                        }
                      }}
                      onKeyDown={handleKeyDown}
                      onFocus={() => {
                        // Only show dropdown if user has typed something and suggestions exist
                        if (searchTerm.trim() && suggestions.popular?.length > 0) {
                          setShowDropdown(true);
                        }
                        // Don't auto-open dropdown on focus - let user type first
                      }}
                      className="w-full py-2.5 sm:py-3 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none text-sm sm:text-base min-w-0"
                      aria-autocomplete="list"
                      aria-controls="search-suggestions"
                      aria-describedby="search-description"
                      aria-haspopup="listbox"
                    />
                    <span id="search-description" className="sr-only">
                      Search for courses by entering a skill name
                    </span>
                  </div>

                  <button
                    type="submit"
                    aria-label="Search courses by skill"
                    className="bg-[#2C5AA0] text-white px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 rounded-md hover:bg-[#1A3F66] transition-colors flex items-center justify-center w-[44px] sm:w-auto min-w-[44px] h-[44px] flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <Search size={20} aria-hidden="true" className="flex-shrink-0 w-5 h-5" />
                  </button>
                </div>
              </form>

              {/* DROPDOWN - Positioned relative to parent div */}
              {showDropdown && (suggestions.popular?.length > 0 || searchTerm.trim()) && (
                <div
                  ref={dropdownRef}
                  id="search-suggestions"
                  className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-xl z-30 max-h-80 overflow-y-auto left-0"
                  role="listbox"
                  aria-label="Search suggestions"
                >
                  {/* Header with close button */}
                  <div className="sticky top-0 bg-white border-b border-gray-200 flex items-center justify-between px-4 py-2 z-10">
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      {searchTerm.trim() ? 'Suggestions' : 'Popular Searches'}
                    </div>
                    <button
                      onClick={() => setShowDropdown(false)}
                      aria-label="Close search suggestions"
                      className="text-gray-400 hover:text-gray-600 min-w-[32px] min-h-[32px] flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <X size={16} aria-hidden="true" />
                    </button>
                  </div>

                  {/* Popular Suggestions */}
                  {suggestions.popular?.length > 0 && (
                    <div className="py-1">
                      {suggestions.popular.map((item: string) => (
                        <button
                          key={item}
                          onClick={() => handleSuggestionClick(item)}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#2C5AA0] transition-colors focus:outline-none focus:bg-blue-50 focus:text-[#2C5AA0] focus:ring-2 focus:ring-inset focus:ring-blue-500"
                          role="option"
                          aria-selected="false"
                          tabIndex={0}
                        >
                          <div className="flex items-center gap-2">
                            <Search
                              size={14}
                              className="text-gray-400 flex-shrink-0"
                              aria-hidden="true"
                            />
                            <span>{item}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Empty state */}
                  {(!suggestions.popular || suggestions.popular.length === 0) &&
                    searchTerm.trim() && (
                      <div className="px-4 py-8 text-center text-sm text-gray-500">
                        No suggestions found for "{searchTerm}"
                      </div>
                    )}
                </div>
              )}
            </div>

            {/* ⭐ POPULAR (Deferred for LCP) */}
            <div className="pt-3 sm:pt-4 min-h-[36px] md:min-h-[48px]">
              {showPopular && (
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-xs sm:text-sm font-semibold text-gray-700 mr-2 sm:mr-3 whitespace-nowrap">
                    Popular:
                  </span>

                  <div className="relative w-full overflow-hidden" aria-label="Popular skills">
                    <div className="marquee-track">
                      {heroPopular.concat(heroPopular).map((tag: string, idx: number) => (
                        <button
                          key={`${tag}-${idx}`}
                          className="marquee-tag inline-flex items-center px-3 py-1 bg-white border border-[#E0E8F0] text-xs text-gray-600 rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          type="button"
                          onClick={() => handleSuggestionClick(tag)}
                          aria-hidden={idx >= heroPopular.length}
                          tabIndex={idx >= heroPopular.length ? -1 : 0}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* ⭐ RIGHT IMAGE FROM CMS - Visible on all devices */}
          {/* Performance: Priority image for LCP - hero image is above the fold */}
          {/* <div className="flex justify-center items-center relative order-1 md:order-2 mb-6 sm:mb-8 md:mb-0 w-full"> */}
          {/* <div className="hidden md:flex justify-center items-center relative order-2 mb-0 w-full">
            <div className="hero-image-wrapper relative w-full max-w-[450px] aspect-square flex items-center justify-center z-10">
              <Image
                src={heroImage}
                alt="SkillVedika - Professional IT Training and Courses"
                width={450}
                height={450}
                priority={!isMobile}           // ✅ priority ONLY for desktop
                fetchPriority={isMobile ? 'low' : 'high'}
                quality={isMobile ? 60 : 85}
                sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, (max-width: 1024px) 380px, 450px"
                className="object-contain drop-shadow-lg w-auto h-auto max-w-full max-h-full"
              />
            </div>
          </div> */}
          <div className="hidden md:flex justify-center items-center relative order-2 w-full">
            <div className="relative w-full max-w-[450px] aspect-square flex items-center justify-center">
              <Image
                src={heroImage}
                alt="SkillVedika - Professional IT Training and Courses"
                width={450}
                height={450}
                quality={85}
                sizes="(max-width: 1024px) 380px, 450px"
                className="object-contain drop-shadow-lg w-auto h-auto max-w-full max-h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


export default Hero;

