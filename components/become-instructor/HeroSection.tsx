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
  image
}: HeroSectionProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    // <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
    //   {/* Background Image */}
    //   {image && (
    //     <div 
    //       className="absolute inset-0 opacity-10"
    //       style={{
    //         backgroundImage: `url(${image})`,
    //         backgroundSize: 'cover',
    //         backgroundPosition: 'center',
    //       }}
    //     />
    //   )}

    //   {/* Decorative Elements */}
    //   <div className="absolute inset-0 overflow-hidden pointer-events-none">
    //     <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
    //     <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
    //   </div>

    //   {/* Content */}
    //   <div className="max-w-7xl mx-auto relative z-10">
    //     <div className="text-center space-y-6 sm:space-y-8">
    //       {/* Main Heading */}
    //       <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
    //         <SafeHTML html={title} className="prose prose-invert max-w-none" />
    //       </h1>

    //       {/* Subheading */}
    //       <div className="text-base sm:text-lg md:text-xl text-blue-50 max-w-3xl mx-auto leading-relaxed">
    //         <SafeHTML html={description} className="prose prose-invert max-w-none" />
    //       </div>

    //       {/* CTA Buttons */}
    //       <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
    //         <Button
    //           onClick={() => scrollToSection('instructor-form')}
    //           size="lg"
    //           className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold px-8 py-6 text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
    //         >
    //           {buttonText}
    //         </Button>
    //         <Button
    //           onClick={() => scrollToSection('benefits-section')}
    //           size="lg"
    //           variant="outline"
    //           className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 hover:border-white/50 font-semibold px-8 py-6 text-base sm:text-lg backdrop-blur-sm transition-all duration-200 hover:scale-105"
    //         >
    //           Learn More
    //         </Button>
    //       </div>
    //     </div>
    //   </div>
    // </section>
    <section
  className="relative bg-gradient-to-br from-[#e8efff] via-[#e8fbff] to-[#e8efff] px-6 py-20 md:py-28 border-b border-blue-100"
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

  {/* Same decorative bottom fade as About */}
  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#e0e7ff]/40 pointer-events-none" />
</section>

  );
}

