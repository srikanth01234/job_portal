import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const COMPANIES = [
  {
    name: 'L&T',
    logo: (
      <div className="flex items-center gap-2">
        <span className="w-8 h-8 rounded-full bg-[#003366] text-white flex items-center justify-center font-black text-sm tracking-tighter">
          L&T
        </span>
        <span className="text-lg font-extrabold tracking-tight text-[#003366]">L&T Construction</span>
      </div>
    ),
  },
  {
    name: 'Tata Motors',
    logo: (
      <div className="flex items-center gap-1.5 text-xl font-extrabold tracking-tight text-[#003C71]">
        <span>TATA</span>
        <span className="text-slate-700 font-bold text-base">MOTORS</span>
      </div>
    ),
  },
  {
    name: 'Bosch',
    logo: (
      <div className="flex items-center gap-1.5">
        <svg className="w-6 h-6 text-[#EA1D2D]" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M7 12h10M12 7v10" stroke="currentColor" strokeWidth="2" />
        </svg>
        <span className="text-xl font-black text-[#EA1D2D] tracking-wider">BOSCH</span>
      </div>
    ),
  },
  {
    name: 'Siemens',
    logo: (
      <div className="flex items-center text-xl font-black tracking-widest text-[#00646E]">
        SIEMENS
      </div>
    ),
  },
  {
    name: 'Mahindra',
    logo: (
      <div className="flex items-center gap-1 text-xl font-black tracking-tight text-[#E31837]">
        <span>Mahindra</span>
      </div>
    ),
  },
  {
    name: 'Blue Dart',
    logo: (
      <div className="flex items-center gap-1.5 text-lg font-extrabold tracking-tight">
        <span className="text-[#002B49]">BLUE</span>
        <span className="text-[#E31837]">DART</span>
      </div>
    ),
  },
];

/**
 * Reusable Company Logos Carousel Section
 * Highlights major industrial, engineering, and logistics hiring partners
 */
export default function CompanyLogos() {
  const containerRef = React.useRef(null);

  const handlePrev = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 md:px-10 lg:px-14 xl:px-16 py-8 sm:py-14">
      <div className="relative flex items-center justify-between gap-2.5 sm:gap-4">
        
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous company logos"
          className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-secondary-bg hover:bg-card-border text-main-text flex items-center justify-center transition-all duration-200 flex-shrink-0 cursor-pointer active:scale-95 shadow-xs border border-card-border"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
        </button>

        {/* Logos Cards Container - swipeable on mobile, grid on desktop */}
        <div
          ref={containerRef}
          className="flex-1 flex sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-4 overflow-x-auto sm:overflow-hidden no-scrollbar scroll-smooth snap-x snap-mandatory py-1"
        >
          {COMPANIES.map((company) => (
            <div
              key={company.name}
              className="bg-white rounded-2xl border border-card-border hover:border-accent/40 shadow-xs hover:shadow-sm transition-all duration-200 h-20 sm:h-28 min-w-[145px] sm:min-w-0 flex items-center justify-center p-3 sm:p-4 group cursor-pointer snap-start flex-shrink-0 sm:flex-shrink"
            >
              <div className="transition-transform duration-200 group-hover:scale-105 select-none scale-90 sm:scale-100">
                {company.logo}
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next company logos"
          className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-secondary-bg hover:bg-card-border text-main-text flex items-center justify-center transition-all duration-200 flex-shrink-0 cursor-pointer active:scale-95 shadow-xs border border-card-border"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
        </button>

      </div>
    </section>
  );
}
