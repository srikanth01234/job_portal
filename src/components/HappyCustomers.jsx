import React, { useState } from 'react';
import { Star } from 'lucide-react';

const TESTIMONIALS = [
  [
    {
      id: 1,
      title: 'Placed as Senior Site Supervisor in 3 days',
      quote:
        'Stark Jobs made my job search completely hassle-free. Direct recruiter verification, clear ₹38,000 monthly pay, and zero commission fees.',
      author: 'Rajesh Patel',
      role: 'L&T Projects / Construction Supervisor',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    },
    {
      id: 2,
      title: 'Hired 25 certified welders in a week',
      quote:
        'Finding qualified MIG/TIG welders and industrial electricians used to take weeks. Stark Jobs delivered verified trade candidates with trade certificates.',
      author: 'Sunil Sharma',
      role: 'Tata Motors Vendor / Head of Plant HR',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    },
  ],
  [
    {
      id: 3,
      title: 'Found top-tier engineering talent',
      quote:
        'Jobhub dramatically shortened our recruitment cycle. We were able to shortlist and hire senior full-stack developers within just 48 hours of posting.',
      author: 'Michael Chang',
      role: 'Stripe / Tech Lead',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    },
    {
      id: 4,
      title: 'Seamless application experience',
      quote:
        'The interface is intuitive, transparent, and trustworthy. I landed my dream remote product design position with an amazing compensation package.',
      author: 'Elena Rostova',
      role: 'Spotify / Senior Designer',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    },
  ],
  [
    {
      id: 5,
      title: 'Outstanding candidate quality',
      quote:
        'The candidate verification and rating system saved our HR team dozens of hours. Every candidate we interviewed met or exceeded our high technical bar.',
      author: 'David Sterling',
      role: 'Airbnb / VP of Engineering',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    },
    {
      id: 6,
      title: 'Effortless remote recruiting',
      quote:
        'Managing international contractor pipelines was always complex until we migrated to Jobhub. Clean, straightforward, and exceptional support team.',
      author: 'Sophia Martinez',
      role: 'Figma / Global Talent Partner',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    },
  ],
];

/**
 * Reusable "Our Happy Customer" Section Component
 * Exact match to the reference design with diamond avatar frames, pastel quote marks, and pagination dots
 */
export default function HappyCustomers() {
  const [activeSlide, setActiveSlide] = useState(0);

  const currentCards = TESTIMONIALS[activeSlide];

  return (
    <section className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 md:px-10 lg:px-14 xl:px-16 py-10 sm:py-20">
      
      {/* Header: Title and Subtitle */}
      <div className="max-w-2xl mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-4xl lg:text-[44px] font-black text-primary tracking-tight leading-tight">
          Our Happy Customer
        </h2>
        <p className="mt-2 sm:mt-3 text-sm sm:text-base lg:text-[17px] text-main-text/80 leading-relaxed max-w-xl font-medium">
          Discover how thousands of skilled technicians and contractors find verified trade jobs and transparent salaries across India.
        </p>
      </div>

      {/* Testimonials Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
        {currentCards.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-card-border p-5 sm:p-9 shadow-xs hover:shadow-md hover:border-accent/30 transition-all duration-200 flex flex-col justify-between group"
          >
            {/* Top Row: Diamond Avatar + Quote & Review Content */}
            <div className="flex items-start gap-3.5 sm:gap-6">
              
              {/* Diamond-shaped Avatar Frame */}
              <div className="relative flex-shrink-0 pt-1.5 pl-1.5 sm:pt-2 sm:pl-2">
                <div className="w-11 h-11 sm:w-16 sm:h-16 rotate-45 rounded-lg sm:rounded-2xl overflow-hidden border-2 border-card-border shadow-xs bg-secondary-bg">
                  <img
                    src={item.avatar}
                    alt={item.author}
                    className="w-full h-full object-cover -rotate-45 scale-125"
                  />
                </div>
              </div>

              {/* Review Text */}
              <div className="flex-1 min-w-0">
                {/* Teal Double Quote Icon */}
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 text-accent/40 mb-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>

                {/* Review Title */}
                <h3 className="text-base sm:text-[19px] font-bold text-main-text tracking-tight leading-snug">
                  {item.title}
                </h3>

                {/* Review Body */}
                <p className="mt-2 text-xs sm:text-[15px] text-main-text/75 leading-relaxed font-normal">
                  {item.quote}
                </p>
              </div>

            </div>

            {/* Bottom Row: Author Details & Star Rating */}
            <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-card-border flex items-center justify-between gap-3">
              {/* Author & Role */}
              <div>
                <h4 className="text-sm sm:text-[15px] font-bold text-main-text">
                  {item.author}
                </h4>
                <p className="text-[11px] sm:text-xs text-main-text/65 mt-0.5 font-medium">
                  {item.role}
                </p>
              </div>

              {/* 5 Gold Stars */}
              <div className="flex items-center gap-1 text-[#FBBF24]">
                {[...Array(item.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-[#FBBF24] stroke-none"
                  />
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Centered Pagination Dots */}
      <div className="flex items-center justify-center gap-2 mt-8 sm:mt-10">
        {TESTIMONIALS.map((_, index) => {
          const isActive = activeSlide === index;
          return (
            <button
              key={index}
              type="button"
              onClick={() => setActiveSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`transition-all duration-200 cursor-pointer rounded-full ${
                isActive
                  ? 'w-6 h-2.5 bg-primary'
                  : 'w-2.5 h-2.5 bg-card-border hover:bg-[#CBD5E1]'
              }`}
            />
          );
        })}
      </div>

    </section>
  );
}
