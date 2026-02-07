'use client';

import { motion } from 'framer-motion';
import { getTitleParts } from '@/utils/getTitle';

export default function WhyChoose({
  title,
  points,
  image,
}: {
  title: any;
  points: string[];
  image: string;
}) {
  const { part1, part2 } = getTitleParts(title);

  return (
    <section className="relative bg-gradient-to-b from-white to-white py-16 sm:py-20 lg:py-24 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-16 left-20 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-24 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl animate-float" />

      {/* Shared container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* TITLE - First */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              {part1 || 'Why Choose'}{' '}
              <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                {part2 || 'SkillVedika?'}
              </span>
            </h2>
                  </div>

        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:gap-16">
          {/* IMAGE - Second (After Title) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="w-full flex justify-center lg:justify-end order-1 lg:order-1"
          >
            <div
              className="
                relative
                w-[200px] h-[200px]
                sm:w-[240px] sm:h-[240px]
                md:w-[300px] md:h-[300px]
                lg:w-[380px] lg:h-[380px]
                rounded-full
                bg-white/90
                backdrop-blur-md
                border-8 border-white/70
                shadow-inner shadow-blue-200/50
                flex items-center justify-center
              "
            >
              <img
                src={image || '/on-job-support/Frame 278.webp'}
                alt="Why Choose SkillVedika"
                className="
                  w-[150px] h-[150px]
                  sm:w-[180px] sm:h-[180px]
                  md:w-[220px] md:h-[220px]
                  lg:w-[270px] lg:h-[270px]
                  object-cover rounded-full
                  border-4 border-white shadow-xl
                "
              />
            </div>
          </motion.div>

          {/* POINTS LIST - Third (After Image) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="w-full max-w-xl text-center lg:text-left order-2 lg:order-2"
          >
            <ul className="space-y-4 sm:space-y-5">
              {points?.map((reason, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex gap-3 sm:gap-4 items-start justify-center lg:justify-start p-2 sm:p-3 rounded-xl hover:bg-white/60 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-700 to-teal-600 text-white font-bold shadow-md flex-shrink-0">
                    ✓
                  </div>
                  <span className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium">
                    {reason}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
