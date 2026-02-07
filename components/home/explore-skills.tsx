'use client';

import { useState, useEffect } from 'react';
import parse from 'html-react-parser';

/* ---------------- TYPES ---------------- */
export type StatusFilter = 'trending' | 'popular' | 'free';

interface ExploreTab {
  key: StatusFilter;
  label: string;
}

interface ExploreSkillsProps {
  explore?: any;
  initialStatus?: StatusFilter;
  setStatusFilter: (filter: StatusFilter) => void;
}

/* ---------------- COMPONENT ---------------- */
export default function ExploreSkills({
  explore,
  initialStatus = 'trending',
  setStatusFilter,
}: Readonly<ExploreSkillsProps>) {
  const [activeTab, setActiveTab] = useState<StatusFilter>(initialStatus);

  /* Tabs from CMS (fallback safe) */
  const tabs: ExploreTab[] = (
    explore?.explore_tabs || ['Trending', 'Popular', 'Free']
  ).map((label: string) => {
    const key = label.toLowerCase().trim();

    return {
      key: key.includes('trend')
        ? 'trending'
        : key.includes('popular')
        ? 'popular'
        : 'free',
      label,
    };
  });

  /* Sync when URL changes (back / forward) */
  useEffect(() => {
    setActiveTab(initialStatus);
  }, [initialStatus]);

  const handleTab = (tabKey: StatusFilter) => {
    setActiveTab(tabKey);
    setStatusFilter(tabKey);
  };

  return (
    <section className="pt-8 sm:pt-10 md:pt-12 pb-0 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-2">
          {explore?.explore_heading
            ? parse(explore.explore_heading)
            : 'Explore Skill for Changing World'}
        </h2>

        {/* Description */}
        <div className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
          {explore?.explore_content ? parse(explore.explore_content) : null}
        </div>

        {/* Tabs */}
        <div className="flex justify-center">
          <div className="flex bg-white border border-gray-300 rounded-full px-2 py-1 gap-1 flex-wrap justify-center">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTab(tab.key)}
                className={`px-4 py-2 rounded-full transition ${
                  activeTab === tab.key
                    ? 'bg-[#2C5AA0] text-white'
                    : 'text-gray-800 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
