'use client';

import { Button } from '@/components/ui/button';
import SafeHTML from '@/components/SafeHTML';

interface HeroSectionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  image?: string;
}

export default function HeroSection({ 
  title = "Become an Instructor at SkillVedika",
  description = "Share your expertise with learners worldwide and build a rewarding teaching career. Join our community of expert instructors and make a lasting impact.",
  buttonText = "Apply Now",
  // image
}: HeroSectionProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
<section
  className="relative bg-gradient-to-br from-[#E8F0F7] to-[#F0F4F9] px-6 py-20 md:py-28 border-b border-[#E2E8F0]"
>
  <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">

    {/* Main Heading */}
    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#002B5B] leading-tight tracking-tight">
      <SafeHTML html={title} className="prose max-w-none" />
    </h1>

    {/* Subheading */}
    <div className="text-base sm:text-lg md:text-xl text-[#1e293b] max-w-3xl mx-auto leading-relaxed">
      <SafeHTML html={description} className="prose max-w-none" />
    </div>

    {/* CTA Buttons */}
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
      <Button
        onClick={() => scrollToSection('instructor-form')}
        size="lg"
        className="w-full sm:w-auto bg-[#002B5B] hover:bg-[#001f42] text-white font-medium px-8 py-5 text-base transition-all duration-200"
      >
        {buttonText}
      </Button>

      <Button
        onClick={() => scrollToSection('benefits-section')}
        size="lg"
        variant="outline"
        className="w-full sm:w-auto border-[#002B5B]/30 text-[#002B5B] hover:bg-white/50 px-8 py-5 text-base"
      >
        Learn More
      </Button>
    </div>
  </div>

  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#F0F4F9]/40 pointer-events-none" />
</section>

  );
}

