'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import SafeHTML from '@/components/SafeHTML';

interface CTASectionProps {
  title?: string;
  description?: string;
  buttonText?: string;
}

export default function CTASection({
  title = "Ready to Start Your Teaching Journey?",
  description = "Join thousands of instructors who are making a difference. Start your application today and begin sharing your expertise with learners around the world.",
  buttonText = "Apply Now — It Takes Less Than 2 Minutes"
}: CTASectionProps) {
  const scrollToForm = () => {
    const element = document.getElementById('instructor-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-[#E8F0F7] to-[#F0F4F9] py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 border-t border-[#E2E8F0] overflow-hidden">

      {/* Content */}
      <div className="max-w-4xl mx-auto text-center relative z-10">

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#002B5B] mb-4 sm:mb-6 leading-tight">
          <SafeHTML html={title} className="prose max-w-none" />
        </h2>

        {/* Supporting Text */}
        <div className="text-base sm:text-lg md:text-xl text-[#1e293b] mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
          <SafeHTML html={description} className="prose max-w-none" />
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Button
            onClick={scrollToForm}
            size="lg"
            className="group bg-[#002147] hover:bg-[#001835] text-white font-semibold px-6 py-2.5 text-sm rounded-lg transition-all duration-200 flex items-center justify-center gap-2 border-none"
          >

            {buttonText}
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </Button>
        </div>
      </div>

      {/* Soft Bottom Fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#F0F4F9]/40 pointer-events-none" />
    </section>

  );
}

