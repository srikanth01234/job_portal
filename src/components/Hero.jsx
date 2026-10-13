import React from 'react';
import SearchBar from './SearchBar';
import {
  AppIconBadge,
  CongratulationCard,
  CoursesCard,
  ClassScheduleCard,
  ReviewRatingCard,
} from './HeroFloatingCards';
import heroMan from '../assets/hero_man_transparent.png';

const POPULAR_SEARCHES = ['Supervisor', 'Mechanic', 'Welder', 'Electrician', 'Plumber', 'Driver'];

/**
 * Hero Section Component
 * Faithful implementation of the Stark Jobs skilled trades portal
 */
export default function Hero() {
  const handleSearch = (query) => {
    console.log('Searching jobs for:', query);
  };

  return (
    <section className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 md:px-10 lg:px-14 xl:px-16 py-2 lg:py-3 lg:h-[calc(100vh-68px)] flex flex-col justify-center">
      {/* Warm Cream Rounded Hero Container matching reference image (#FDF8EE) */}
      <div className="relative w-full h-full rounded-[24px] sm:rounded-[36px] lg:rounded-[44px] overflow-hidden px-4 sm:px-8 lg:px-12 xl:px-16 py-6 lg:py-8 flex flex-col justify-center bg-[#FDF8EE]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center h-full">
          
          {/* ================= LEFT CONTENT COLUMN (7 cols) ================= */}
          <div className="lg:col-span-7 flex flex-col justify-center z-10 py-1 sm:py-2">
            
            {/* Tag Badge: Mint dot + High-contrast Sky uppercase text */}
            <div className="inline-flex items-center gap-2 mb-3 lg:mb-4 bg-sky-50 border border-sky-200/80 px-3 py-1 rounded-full w-fit">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] inline-block flex-shrink-0" />
              <span className="text-[11px] sm:text-[13px] font-black uppercase tracking-wider text-sky-800">
                #1 SKILLED TRADES JOBS PLACE
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] xl:text-[56px] 2xl:text-[62px] font-black text-slate-950 leading-[1.12] tracking-tight">
              The Easiest Way to <br className="hidden sm:inline" />
              Get Your Skilled Job
            </h1>

            {/* Description Subtitle - High Visibility */}
            <p className="mt-3 lg:mt-4 text-sm sm:text-base lg:text-[18px] text-slate-900 leading-relaxed max-w-xl font-semibold">
              Find verified jobs for Supervisors, Mechanics, Welders, Electricians, Plumbers, and Drivers across India with verified salary packages
            </p>

            {/* Prominent Search Bar with separate bordered input cards */}
            <div className="mt-5 sm:mt-8 max-w-2xl">
              <SearchBar onSearch={handleSearch} />
            </div>

            {/* Popular Searches */}
            <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <span className="font-black text-slate-950 text-xs sm:text-sm">Popular:</span>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => console.log('Selected search tag:', term)}
                    className="font-bold text-xs sm:text-sm text-slate-900 bg-white border border-slate-300 px-2.5 sm:px-3.5 py-1 rounded-lg hover:text-[#7B61FF] hover:border-purple-400 transition-all shadow-xs cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ================= RIGHT VISUAL COLUMN (5 cols) ================= */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end items-end h-full mt-4 lg:mt-0">
            
            {/* Visual Frame */}
            <div className="relative w-full max-w-[340px] sm:max-w-[420px] xl:max-w-[460px] 2xl:max-w-[500px] h-[330px] sm:h-[420px] lg:h-[calc(100vh-170px)] lg:max-h-[500px] flex items-end justify-center">
              
              {/* Vibrant Blue Arch Shape (curves smoothly behind the transparent cutout) */}
              <div className="absolute inset-x-4 sm:inset-x-8 bottom-0 top-8 sm:top-12 bg-[#2D74FF] rounded-t-[140px] sm:rounded-t-[200px] rounded-b-[28px] sm:rounded-b-[32px] overflow-hidden" />

              {/* Businessman Photo (Transparent Cutout PNG) */}
              <div className="relative z-10 w-full h-full flex items-end justify-center pointer-events-none">
                <img
                  src={heroMan}
                  alt="Job seeker with laptop giving thumbs up"
                  className="w-auto h-full max-h-[310px] sm:max-h-[410px] lg:max-h-[calc(100vh-175px)] xl:max-h-[490px] object-contain object-bottom drop-shadow-2xl select-none"
                />
              </div>

              {/* ---------------- FLOATING BADGES (scaled neatly on mobile) ---------------- */}

              {/* 1. App Icon Badge (Top Left above arch) */}
              <div className="absolute top-1 sm:top-2 left-0 sm:left-4 z-20 animate-float-slow scale-85 sm:scale-100 origin-top-left">
                <AppIconBadge />
              </div>

              {/* 2. Congratulation! Card (Mid Left) */}
              <div className="absolute top-[30%] -left-2 sm:-left-12 z-20 animate-float-reverse scale-85 sm:scale-100 origin-left">
                <CongratulationCard />
              </div>

              {/* 3. 10000+ Courses Card (Top Right) */}
              <div className="absolute top-2 sm:top-4 -right-1 sm:right-1 z-20 animate-float-delayed scale-85 sm:scale-100 origin-top-right">
                <CoursesCard />
              </div>

              {/* 4. Web Development Class Card (Mid Right) */}
              <div className="absolute top-[48%] -right-2 sm:-right-8 z-20 animate-float-slow scale-85 sm:scale-100 origin-right">
                <ClassScheduleCard />
              </div>

              {/* 5. Rating & Review Card (Bottom Left in front of laptop) */}
              <div className="absolute bottom-4 sm:bottom-6 left-1 sm:left-6 z-20 animate-float-reverse scale-85 sm:scale-100 origin-bottom-left">
                <ReviewRatingCard />
              </div>

              {/* 6. Decorative Checklist Folder Icon (Bottom Left corner) */}
              <div className="hidden sm:flex absolute -bottom-1 -left-4 z-20 w-10 h-10 bg-[#4F46E5] rounded-xl items-center justify-center text-white shadow-lg rotate-[-8deg] animate-pulse-subtle">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H7v-2h5v2zm4-4H7v-2h9v2zm0-4H7V7h9v2z" />
                </svg>
              </div>

              {/* 7. Decorative Purple Badge (Bottom Right corner) */}
              <div className="hidden sm:flex absolute -bottom-1 -right-3 z-20 w-9 h-9 bg-[#8B5CF6] rounded-xl items-center justify-center text-white shadow-lg rotate-[12deg] animate-pulse-subtle">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4m-14 0v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
