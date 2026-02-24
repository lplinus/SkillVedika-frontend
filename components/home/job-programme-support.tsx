'use client';

import parse from 'html-react-parser';
import { useState, useEffect } from 'react';
import { EnrollModal } from '../EmptyLoginForm';
import { getApiUrl } from '@/lib/apiConfig';
import Image from 'next/image';

interface JobProgrammeSupportProps {
  readonly jobSupport?: {
    readonly job_support_payment_types?: readonly string[];
    readonly job_support_title?: string;
    readonly job_support_content?: string;
    readonly job_support_button?: string;
  };
}

export default function JobProgrammeSupport({ jobSupport }: JobProgrammeSupportProps) {
  const paymentTypes = jobSupport?.job_support_payment_types || [];
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [courses, setCourses] = useState<Array<{ id: number; title: string }>>([]);

  useEffect(() => {
    if (!showEnrollModal) return;

    const controller = new AbortController();

    async function fetchCourses() {
      try {
        const apiUrl = getApiUrl('/courses?limit=50');
        const res = await fetch(apiUrl, { signal: controller.signal });
        if (!res.ok) return;

        const data = await res.json();
        const list = (data.data || data || []).map((c: any) => ({
          id: c.id,
          title: c.title,
        }));

        setCourses(list);
      } catch { }
    }

    fetchCourses();
    return () => controller.abort();
  }, [showEnrollModal]);


  return (
    <section className="relative overflow-hidden">
      {/* Aspect-ratio image wrapper defines height */}
      {/* <div className="relative w-full aspect-[1200/686]"> */}
      <div className="relative w-full min-h-[420px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[686px]">
        <Image
          src="/home/handshake.webp"
          alt="Job programme support background"
          fill
          sizes="100vw"
          className="object-cover"
          loading="lazy"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full py-12 sm:py-16 md:py-20 lg:py-24">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 px-2">
              {jobSupport?.job_support_title
                ? parse(jobSupport.job_support_title)
                : 'Job Programme Support'}
            </h2>

            <div className="text-gray-100 text-sm sm:text-base mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
              {jobSupport?.job_support_content
                ? parse(jobSupport.job_support_content)
                : null}
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-6 px-2">
              {paymentTypes.map((type, index) => (
                <button
                  key={index}
                  // className="bg-white text-[#2C5AA0] px-6 py-2.5 rounded font-semibold min-h-[44px]"
                  className="bg-white text-[#2C5AA0] px-6 py-3 rounded font-semibold min-h-[44px] w-full sm:w-auto max-w-xs"
                >
                  {type}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowEnrollModal(true)}
              className="bg-[#2C5AA0] text-white px-6 py-3 rounded font-semibold min-h-[44px]"
            >
              {jobSupport?.job_support_button || 'Get Started'}
            </button>

            {showEnrollModal && (
              <EnrollModal
                courses={courses}
                page="Home page"
                onClose={() => setShowEnrollModal(false)}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
