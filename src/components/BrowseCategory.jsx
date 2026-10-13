import React, { useState } from 'react';
import { ChevronRight, ArrowUp } from 'lucide-react';

const CATEGORIES = [
  // --- ROW 1 ---
  {
    id: 1,
    title: 'Supervisor &\nForeman',
    vacancies: '480 Available Vacancy',
    icon: (
      <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="30" fill="#6366F1" fillOpacity="0.14" />
        <circle cx="32" cy="32" r="24" fill="#4F46E5" />
        {/* Safety Helmet & Clipboard */}
        <path d="M22 30c0-6 4.5-10 10-10s10 4 10 10v2H22v-2z" fill="#FBBF24" />
        <rect x="20" y="32" width="24" height="3" rx="1.5" fill="#F59E0B" />
        {/* Person / Badge */}
        <circle cx="32" cy="39" r="3.5" fill="#FFFFFF" />
        <path d="M25 46c0-3.5 3-6 7-6s7 2.5 7 6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Mechanic &\nAutomobile',
    vacancies: '620 Available Vacancy',
    icon: (
      <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="30" fill="#EF4444" fillOpacity="0.14" />
        <circle cx="32" cy="32" r="24" fill="#EF4444" />
        {/* Crossed Wrench & Gear */}
        <circle cx="32" cy="32" r="8" fill="#1E293B" stroke="#FFFFFF" strokeWidth="2" />
        <path d="M22 22l7 7m13 13l-7-7" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
        <path d="M42 22l-7 7m-13 13l7-7" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Welder &\nFabricator',
    vacancies: '390 Available Vacancy',
    icon: (
      <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="30" fill="#8B5CF6" fillOpacity="0.18" />
        <circle cx="32" cy="32" r="24" fill="#7C3AED" />
        {/* Welding Mask / Torch Flame */}
        <rect x="22" y="20" width="20" height="24" rx="4" fill="#1E293B" stroke="#FFFFFF" strokeWidth="1.5" />
        <rect x="26" y="26" width="12" height="6" rx="2" fill="#F59E0B" />
        <path d="M38 38l6 6-2 2-6-6z" fill="#94A3B8" />
        <circle cx="45" cy="45" r="3" fill="#EF4444" />
        <circle cx="47" cy="42" r="1.5" fill="#FBBF24" />
      </svg>
    ),
  },
  {
    id: 4,
    title: 'Electrician &\nWireman',
    vacancies: '540 Available Vacancy',
    icon: (
      <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="30" fill="#3B82F6" fillOpacity="0.15" />
        <circle cx="32" cy="32" r="24" fill="#2563EB" />
        {/* Electric Bolt & Circuit */}
        <path d="M33 18l-8 13h8l-2 15 11-16h-9l4-12h-4z" fill="#FBBF24" stroke="#FFFFFF" strokeWidth="1" strokeLinejoin="round" />
      </svg>
    ),
  },

  // --- ROW 2 ---
  {
    id: 5,
    title: 'Plumber &\nPipe Fitter',
    vacancies: '310 Available Vacancy',
    icon: (
      <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="30" fill="#0EA5E9" fillOpacity="0.15" />
        <circle cx="32" cy="32" r="24" fill="#0284C7" />
        {/* Water Tap & Pipe */}
        <path d="M22 26h14v8H22v-8z" fill="#E2E8F0" />
        <path d="M32 20v6m0 8v8" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
        <path d="M30 42c0 2 2 3.5 2 3.5s2-1.5 2-3.5a2 2 0 10-4 0z" fill="#38BDF8" />
      </svg>
    ),
  },
  {
    id: 6,
    title: 'Heavy & Light\nDriver',
    vacancies: '750 Available Vacancy',
    icon: (
      <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="30" fill="#10B981" fillOpacity="0.15" />
        <circle cx="32" cy="32" r="24" fill="#059669" />
        {/* Steering Wheel / Commercial Vehicle */}
        <circle cx="32" cy="32" r="11" stroke="#FFFFFF" strokeWidth="2.5" />
        <circle cx="32" cy="32" r="4" fill="#FBBF24" />
        <line x1="32" y1="21" x2="32" y2="28" stroke="#FFFFFF" strokeWidth="2" />
        <line x1="22" y1="36" x2="28" y2="34" stroke="#FFFFFF" strokeWidth="2" />
        <line x1="42" y1="36" x2="36" y2="34" stroke="#FFFFFF" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: 7,
    title: 'HVAC & AC\nTechnician',
    vacancies: '290 Available Vacancy',
    icon: (
      <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="30" fill="#06B6D4" fillOpacity="0.15" />
        <circle cx="32" cy="32" r="24" fill="#0891B2" />
        {/* AC Cooling Unit & Fan */}
        <rect x="20" y="22" width="24" height="18" rx="3" fill="#1E293B" stroke="#FFFFFF" strokeWidth="1.5" />
        <circle cx="32" cy="31" r="5" fill="#38BDF8" />
        <path d="M24 37h16" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 8,
    title: 'Carpenter &\nFitter',
    vacancies: '340 Available Vacancy',
    icon: (
      <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="30" fill="#F59E0B" fillOpacity="0.15" />
        <circle cx="32" cy="32" r="24" fill="#D97706" />
        {/* Woodworking Saw & Hammer */}
        <path d="M20 38l12-14 4 4-12 14-4-4z" fill="#E2E8F0" />
        <path d="M36 24l6-6 4 4-6 6" fill="#F59E0B" />
        <line x1="26" y1="36" x2="32" y2="30" stroke="#1E293B" strokeWidth="1.5" />
      </svg>
    ),
  },
];

/**
 * Reusable "Browse by category" Section Component
 * Updated for skilled trade categories (Supervisors, Mechanics, Welders, Electricians, Drivers, Plumbers)
 */
export default function BrowseCategory() {
  const [selectedId, setSelectedId] = useState(3); // Welder highlighted by default

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative w-full max-w-[1440px] mx-auto px-3 sm:px-6 md:px-10 lg:px-14 xl:px-16 py-10 sm:py-16">
      
      {/* Header Row: Title & Subtitle on left, 'Browse all >' on right */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-5 mb-8 sm:mb-12">
        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-4xl lg:text-[44px] font-black text-slate-950 tracking-tight leading-tight">
            Browse by category
          </h2>
          <p className="mt-2 sm:mt-3 text-sm sm:text-base lg:text-[17px] text-slate-800 leading-relaxed max-w-xl font-semibold">
            Find verified jobs for skilled technicians, tradesmen, and industrial specialists across India. Verified recruiters and transparent salaries.
          </p>
        </div>

        {/* 'Browse all >' pill button */}
        <a
          href="#categories"
          className="inline-flex items-center gap-1.5 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full border border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50 text-slate-950 text-xs sm:text-sm font-extrabold transition-all duration-200 self-start md:self-auto shadow-sm active:scale-95"
        >
          <span>Browse all</span>
          <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-900 stroke-[2.5]" />
        </a>
      </div>

      {/* Category Cards Grid - 2 columns on mobile, 4 columns on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {CATEGORIES.map((category) => {
          const isSelected = selectedId === category.id;
          return (
            <div
              key={category.id}
              onClick={() => setSelectedId(category.id)}
              className={`relative bg-white rounded-2xl min-h-[220px] sm:min-h-[290px] py-6 sm:py-11 px-3 sm:px-6 flex flex-col items-center justify-between text-center transition-all duration-250 cursor-pointer group ${
                isSelected
                  ? 'border-2 border-[#8B6CEF] shadow-[0_18px_40px_-12px_rgba(139,108,239,0.22)] -translate-y-1'
                  : 'border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md hover:-translate-y-1'
              }`}
            >
              {/* Illustration Icon */}
              <div className="transition-transform duration-200 group-hover:scale-110 select-none mb-2 sm:mb-4 scale-85 sm:scale-100">
                {category.icon}
              </div>

              {/* Title & Vacancies */}
              <div className="space-y-1.5 sm:space-y-2.5">
                <h3 className="text-sm sm:text-[19px] font-black text-slate-950 tracking-tight leading-snug whitespace-pre-line group-hover:text-[#7B61FF] transition-colors">
                  {category.title}
                </h3>
                <span className="inline-block px-2 sm:px-3.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[13px] font-extrabold text-purple-900 bg-purple-100 border border-purple-200">
                  {category.vacancies}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Scroll-to-Top Button */}
      <div className="absolute right-3 sm:right-8 -bottom-5 sm:-bottom-8 z-30">
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#8B6CEF] hover:bg-[#7B59EC] text-white flex items-center justify-center shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
        >
          <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
        </button>
      </div>

    </section>
  );
}
