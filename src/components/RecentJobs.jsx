import React, { useState } from 'react';
import { Clock, MapPin, ShieldCheck, Bookmark } from 'lucide-react';

const FILTER_TABS = [
  'All Trades',
  'Supervisor',
  'Mechanic',
  'Welder',
  'Electrician',
  'Driver',
  'Plumber',
];

const RECENT_JOBS = [
  // --- ROW 1 ---
  {
    id: 1,
    title: 'Site Construction Supervisor (Civil & Infrastructure)',
    company: 'L&T Construction',
    companyLogo: '🏗️',
    companyLogoBg: 'bg-amber-50',
    type: 'Fulltime',
    isUrgent: true,
    time: '5 mins ago',
    location: 'Mumbai, Maharashtra',
    salary: '₹38,000',
    period: '/Month',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    title: 'Senior Automobile Mechanic & Engine Specialist',
    company: 'Maruti Suzuki Service',
    companyLogo: '🚗',
    companyLogoBg: 'bg-blue-50',
    type: 'Fulltime',
    isUrgent: false,
    time: '15 mins ago',
    location: 'Bengaluru, Karnataka',
    salary: '₹28,000',
    period: '/Month',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    title: 'Certified TIG / MIG Welder & Metal Fabricator',
    company: 'Jindal Steel & Power',
    companyLogo: '⚡',
    companyLogoBg: 'bg-purple-50',
    type: 'Fulltime',
    isUrgent: true,
    time: '25 mins ago',
    location: 'Pune, Maharashtra',
    salary: '₹32,000',
    period: '/Month',
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80',
  },

  // --- ROW 2 ---
  {
    id: 4,
    title: 'Industrial High Voltage Electrician & Control Wireman',
    company: 'Siemens Manufacturing',
    companyLogo: '💡',
    companyLogoBg: 'bg-cyan-50',
    type: 'Fulltime',
    isUrgent: true,
    time: '35 mins ago',
    location: 'Chennai, Tamil Nadu',
    salary: '₹35,000',
    period: '/Month',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 5,
    title: 'Heavy Commercial Vehicle (HCV) Trailer Driver',
    company: 'Blue Dart Logistics',
    companyLogo: '🚛',
    companyLogoBg: 'bg-emerald-50',
    type: 'Fulltime',
    isUrgent: false,
    time: '1 hour ago',
    location: 'Delhi NCR',
    salary: '₹30,000',
    period: '/Month',
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 6,
    title: 'Master Commercial Plumber & Pipeline Fitter',
    company: 'Godrej Properties',
    companyLogo: '🔧',
    companyLogoBg: 'bg-indigo-50',
    type: 'Fulltime',
    isUrgent: true,
    time: '2 hours ago',
    location: 'Hyderabad, Telangana',
    salary: '₹26,000',
    period: '/Month',
    image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&auto=format&fit=crop&q=80',
  },
];

/**
 * Reusable Recent Jobs Section Component
 * Matches the reference design with 2 full rows (6 job cards), category filter tabs, and interactive bookmarking
 */
export default function RecentJobs() {
  const [activeTab, setActiveTab] = useState('All Trades');
  const [bookmarkedJobs, setBookmarkedJobs] = useState([1]);

  const toggleBookmark = (id) => {
    setBookmarkedJobs((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 md:px-10 lg:px-14 xl:px-16 py-10 sm:py-16">
      
      {/* Header Row: Title & Count on left, Category Tabs on right */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
        <div>
          <h2 className="text-2xl sm:text-4xl lg:text-[44px] font-black text-primary tracking-tight leading-tight">
            Recent Jobs
          </h2>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-main-text/80 font-medium">
            8 new opportunities posted today!
          </p>
        </div>

        {/* Category Filter Tabs - horizontally scrollable on mobile */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-2 sm:pb-0 w-full lg:w-auto -mx-1 px-1">
          {FILTER_TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex-shrink-0 ${
                  isActive
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-main-text hover:text-primary bg-white border border-card-border hover:bg-secondary-bg'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2 Rows of Job Cards (3 columns x 2 rows = 6 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
        {RECENT_JOBS.map((job) => {
          const isSaved = bookmarkedJobs.includes(job.id);
          return (
            <div
              key={job.id}
              className="bg-white rounded-2xl border border-card-border overflow-hidden shadow-xs hover:shadow-md hover:border-accent/40 hover:-translate-y-1 transition-all duration-200 flex flex-col group cursor-pointer"
            >
              {/* Card Banner Image */}
              <div className="relative h-40 sm:h-52 w-full overflow-hidden bg-secondary-bg">
                <img
                  src={job.image}
                  alt={job.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Urgent Pill Badge */}
                {job.isUrgent && (
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md text-[10px] sm:text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-xs select-none">
                    Urgent
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
                
                {/* Company & Job Type Row */}
                <div className="flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-secondary-bg border border-card-border flex items-center justify-center text-xs sm:text-sm">
                      {job.companyLogo}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-main-text">
                      {job.company}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-lg text-[10px] sm:text-xs font-bold bg-accent-light text-accent border border-accent-border">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    {job.type}
                  </span>
                </div>

                {/* Job Title */}
                <h3 className="text-base sm:text-lg font-bold text-main-text tracking-tight leading-snug line-clamp-2 group-hover:text-accent transition-colors duration-200">
                  {job.title}
                </h3>

                {/* Time & Location */}
                <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-main-text/75 font-medium">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-main-text/60 stroke-[2]" />
                    <span>{job.time}</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-main-text/60 stroke-[2]" />
                    <span>{job.location}</span>
                  </div>
                </div>

                {/* Bottom Row: Salary & Action Icons */}
                <div className="pt-2.5 sm:pt-3 border-t border-card-border flex items-center justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg sm:text-2xl font-black text-primary tracking-tight">
                      {job.salary}
                    </span>
                    <span className="text-[11px] sm:text-xs text-main-text/70 font-semibold">
                      {job.period}
                    </span>
                  </div>

                  {/* Actions: Verified Shield & Bookmark */}
                  <div className="flex items-center gap-2 sm:gap-2.5 text-main-text/60">
                    <ShieldCheck className="w-4 h-4 text-accent hover:text-[#0D7678] transition-colors" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(job.id);
                      }}
                      className="p-1 hover:text-accent transition-colors focus:outline-none"
                      aria-label="Save job"
                    >
                      <Bookmark
                        className={`w-4 h-4 transition-colors ${
                          isSaved
                            ? 'text-accent fill-accent'
                            : 'hover:text-accent'
                        }`}
                      />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}
