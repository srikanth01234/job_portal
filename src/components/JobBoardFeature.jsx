import React from 'react';
import teamOffice from '../assets/team_office.jpg';

const FREELANCERS = [
  {
    name: 'Ramesh Kumar',
    role: 'Master Electrician (10+ Yrs Exp)',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
  },
  {
    name: 'Suresh Verma',
    role: 'Heavy Vehicle Driver (All India)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
  },
  {
    name: 'Amit Sharma',
    role: 'Senior Site Construction Supervisor',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
  },
];

/**
 * Job Board Feature Section Component
 * Faithful representation for Stark Jobs skilled trade workers
 */
export default function JobBoardFeature() {
  return (
    <section className="relative w-full max-w-[1440px] mx-auto px-3 sm:px-6 md:px-10 lg:px-14 xl:px-16 py-12 sm:py-24 overflow-hidden">
      
      {/* ================= EXACT BACKGROUND PASTEL SHAPES ================= */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden -z-10">
        
        {/* Mint green circle dot at top-left */}
        <div className="absolute top-8 sm:top-12 left-6 sm:left-10 w-11 h-11 rounded-full bg-[#B6E7B6]" />

        {/* Diagonal Soft Lavender Rounded Pill Shape */}
        <div className="absolute -left-16 sm:-left-20 top-20 sm:top-24 w-[340px] sm:w-[420px] h-36 sm:h-44 bg-[#E0D7FE] rounded-full rotate-[-35deg]" />

        {/* Diagonal Soft Baby Blue Rounded Pill Shape */}
        <div className="absolute -left-20 sm:-left-24 top-64 sm:top-72 w-[380px] sm:w-[460px] h-40 sm:h-48 bg-[#D4E4FC] rounded-full rotate-[-35deg]" />

        {/* Small peach dot above title */}
        <div className="absolute top-10 sm:top-12 left-[32%] sm:left-[35%] w-3.5 h-3.5 rounded-full bg-[#FED7AA]" />

        {/* Cyan floating dot near description */}
        <div className="absolute top-64 sm:top-72 left-[24%] sm:left-[27%] w-5 h-5 rounded-full bg-[#A5F3FC]" />

        {/* Small pink dot at bottom */}
        <div className="absolute bottom-20 left-[22%] sm:left-[24%] w-3 h-3 rounded-full bg-[#FCE7F3]" />

        {/* Peach circle arc at bottom-left corner */}
        <div className="absolute -bottom-12 left-6 sm:left-10 w-36 h-36 rounded-full bg-[#FED7AA]/50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-10 items-center">
        
        {/* ================= LEFT CONTENT COLUMN (6 cols) ================= */}
        <div className="lg:col-span-6 z-10 pr-0 lg:pr-4">
          
          {/* Main Headline */}
          <h2 className="text-3xl sm:text-5xl lg:text-[52px] xl:text-[58px] font-black text-slate-950 leading-[1.14] tracking-tight">
            The #1 Job Board for <br className="hidden sm:inline" />
            Skilled Trade Jobs
          </h2>

          {/* Subtitle Description */}
          <p className="mt-4 sm:mt-6 text-sm sm:text-[17px] text-slate-800 leading-relaxed max-w-md font-semibold">
            Search and connect with certified Supervisors, Mechanics, Welders, Electricians, Plumbers, and Drivers across India. Hire verified technicians faster.
          </p>

          {/* CTA Actions */}
          <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-7">
            {/* Primary Action Button: 'Post a job now' */}
            <button
              type="button"
              className="px-8 py-3.5 text-sm sm:text-base font-bold text-white bg-[#8B6CEF] hover:bg-[#7A56EC] rounded-xl transition-all duration-200 shadow-[0_12px_28px_-6px_rgba(139,108,239,0.5)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer text-center"
            >
              Post a job now
            </button>

            {/* Secondary Action Link: 'Learn more' */}
            <a
              href="#learn-more"
              className="text-sm sm:text-base font-extrabold text-slate-900 hover:text-[#8B6CEF] transition-colors cursor-pointer text-center py-2 sm:py-0"
            >
              Learn more →
            </a>
          </div>
        </div>

        {/* ================= RIGHT VISUAL COLUMN (6 cols) ================= */}
        <div className="lg:col-span-6 relative flex justify-center lg:justify-end items-center mt-6 lg:mt-0">
          
          <div className="relative w-full max-w-[500px] xl:max-w-[620px]">
            
            {/* Team Collaboration Photo with distinct Large Curved Top-Left Corner */}
            <div className="relative w-full aspect-[4/3] rounded-[24px] sm:rounded-[32px] rounded-tl-[64px] sm:rounded-tl-[96px] overflow-hidden shadow-card-elevated">
              <img
                src={teamOffice}
                alt="Creative design team collaborating in studio"
                className="w-full h-full object-cover select-none"
              />
            </div>

            {/* Floating 'Top Freelancers' Card (overlapping bottom-left of the image) */}
            <div className="absolute -bottom-6 sm:-bottom-12 left-1 sm:-left-10 z-20 w-[240px] sm:w-[285px] bg-white rounded-[20px] sm:rounded-[24px] p-3 sm:p-4 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.18)] border border-slate-100/90 animate-float-slow scale-90 sm:scale-100 origin-bottom-left">
              
              {/* Lavender Header Banner */}
              <div className="bg-[#F0EBFE] rounded-xl py-2 sm:py-3 px-3 sm:px-4 text-center mb-2.5 sm:mb-4">
                <span className="text-[13px] sm:text-[15px] font-extrabold text-purple-950">
                  Top Verified Workers
                </span>
              </div>

              {/* Freelancers List */}
              <div className="space-y-3 sm:space-y-3.5">
                {FREELANCERS.map((person) => (
                  <div key={person.name} className="flex items-center gap-3">
                    <img
                      src={person.avatar}
                      alt={person.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-100 flex-shrink-0"
                    />
                    <div className="leading-tight">
                      <h4 className="text-[13px] font-extrabold text-slate-950">
                        {person.name}
                      </h4>
                      <p className="text-[11px] text-slate-700 font-bold mt-0.5">
                        {person.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
