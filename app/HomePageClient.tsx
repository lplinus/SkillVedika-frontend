'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import CourseCards from '@/components/home/course-cards';
import type { StatusFilter } from '@/components/home/explore-skills';

const ExploreSkills = dynamic(
  () => import('@/components/home/explore-skills'),
  { ssr: true }
);

interface HomePageClientProps {
  explore: any;
}

export default function HomePageClient({ explore }: HomePageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* Validate URL param */
  const isValidStatus = (value: string | null): value is StatusFilter =>
    value === 'trending' || value === 'popular' || value === 'free';

  const rawStatus = searchParams?.get('status');
  const statusFromUrl: StatusFilter = isValidStatus(rawStatus)
    ? rawStatus
    : 'trending';

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>(statusFromUrl);

  /* Sync state when URL changes */
  useEffect(() => {
    setStatusFilter(statusFromUrl);
  }, [statusFromUrl]);

  /* Update URL + state when tab clicked */
  const handleStatusChange = (status: StatusFilter) => {
    setStatusFilter(status);

    const params = new URLSearchParams(searchParams?.toString());
    params.set('status', status);

    router.replace(`/?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <ExploreSkills
        explore={explore}
        initialStatus={statusFilter}
        setStatusFilter={handleStatusChange}
      />

      <CourseCards statusFilter={statusFilter} />
    </>
  );
}
