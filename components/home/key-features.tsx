'use client';

import Image from 'next/image';
import { BookOpen, Briefcase, Clock, Award } from 'lucide-react';
import { useState, useEffect } from 'react';
import parse from 'html-react-parser';

interface KeyFeaturesProps {
  keyFeatures?: any;
}

export default function KeyFeatures({ keyFeatures }: Readonly<KeyFeaturesProps>) {
  // Map dynamic text points -> icons (looping safely)
  const icons = [
    <BookOpen size={20} />,
    <Award size={20} />,
    <Clock size={20} />,
    <Briefcase size={20} />,
  ];

  const features = (keyFeatures?.key_features_points || []).map((text: string, index: number) => ({
    icon: icons[index % icons.length], // auto-loop icons
    text,
  }));

  const [activeIndex, setActiveIndex] = useState(0);

  /* 🔁 Auto-rotate features */
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        setActiveIndex(0); // reset when tab is inactive
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);


  return (
    <section className="relative bg-gradient-to-br from-[#F6FAFF] via-[#EEF4FA] to-[#E6EEFA] py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Mobile: Single column layout with features on left */}
        <div className="block md:hidden space-y-8">
          {/* Title and Description */}
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight min-h-[4em] text-[#1A3F66]">
              {keyFeatures?.key_features_title ? parse(keyFeatures.key_features_title) : null}
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              {keyFeatures?.key_features_content ? parse(keyFeatures.key_features_content) : null}
            </p>
          </div>

          {/* Center Icon - Smaller on mobile */}
          <div className="relative w-64 h-64 flex items-center justify-center animate-spin-slow">
            <div className="absolute inset-0 rounded-full border-[3px] border-[#2C5AA0]/30" />

            <div className="relative w-[256px] h-[256px]">
              <Image
                src="/home/Frame 211.webp"
                alt="Rotating Icon"
                fill
                priority
                sizes="256px"
                className="object-contain z-10"
              />
            </div>
          </div>

          {/* Feature Cards - Left aligned on mobile */}
          <div className="flex flex-col gap-4">
            {features.map((feature: any, index: number) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={index}
                  className={`relative flex items-center gap-4 rounded-xl border border-[#D6E4F0] px-4 py-3 shadow-md backdrop-blur-sm transition-all duration-300
    ${isActive
                      ? 'scale-[1.02] bg-[rgba(44,90,160,0.15)] ring-2 ring-[#2C5AA0]/40'
                      : 'bg-white'
                    }`}
                >
                  {/* Circular Icon - Left aligned */}
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0 ${isActive ? 'bg-[#2C5AA0] text-white shadow-lg' : 'bg-[#E6EEFA] text-[#2C5AA0]'
                      }`}
                  >
                    {feature.icon}
                  </div>

                  {/* Text */}
                  <p
                    className={`font-semibold text-sm sm:text-base transition-all duration-300 ${isActive ? 'text-[#2C5AA0]' : 'text-[#1A3F66]'
                      }`}
                  >
                    {feature.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop: 3-column layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* LEFT CONTENT — now fully dynamic */}
          <div className="space-y-4 sm:space-y-6">
            {/* ⭐ Dynamic Title */}
            <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight sm:leading-snug text-[#1A3F66]">
              {keyFeatures?.key_features_title ? parse(keyFeatures.key_features_title) : null}
            </div>

            {/* ⭐ Dynamic Paragraph */}
            <div className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed max-w-md">
              {keyFeatures?.key_features_content ? parse(keyFeatures.key_features_content) : null}
            </div>
          </div>


          {/* CENTER ROTATING ICON */}
          <div className="relative w-64 h-64 flex items-center justify-center animate-spin-slow">
            <div className="absolute inset-0 rounded-full border-[3px] border-[#2C5AA0]/30" />

            <div className="relative w-[256px] h-[256px]">
              <Image
                src="/home/Frame 211.webp"
                alt="Rotating Icon"
                fill
                priority
                sizes="256px"
                className="object-contain z-10"
              />
            </div>
          </div>

          {/* RIGHT SIDE — dynamic feature cards */}
          <div className="flex flex-col gap-5 w-full max-w-lg">
            {features.map((feature: any, index: number) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={index}
                  className={`relative flex items-center gap-5 rounded-xl border border-[#D6E4F0] px-8 py-4 shadow-md hover:shadow-lg backdrop-blur-sm transition-all duration-300
    ${isActive
                      ? 'scale-[1.03] translate-x-[6px] bg-[rgba(44,90,160,0.15)] ring-2 ring-[#2C5AA0]/40'
                      : 'bg-white'
                    }`}
                >
                  {/* Circular Icon */}
                  <div
                    className={`absolute -left-5 flex items-center justify-center w-12 h-12 rounded-full ${isActive ? 'bg-[#2C5AA0] text-white shadow-lg' : 'bg-[#E6EEFA] text-[#2C5AA0]'
                      }`}
                  >
                    {feature.icon}
                  </div>

                  {/* Text */}
                  <p
                    className={`ml-10 font-semibold text-base transition-all duration-300 ${isActive ? 'text-[#2C5AA0]' : 'text-[#1A3F66]'
                      }`}
                  >
                    {feature.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* BACKGROUND VISUAL ELEMENTS */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#4A90E2]/10 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#2C5AA0]/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
    </section>
  );
}
