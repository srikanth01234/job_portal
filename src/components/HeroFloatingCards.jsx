import React from 'react';
import { Mail, CheckCircle2, GraduationCap, Star } from 'lucide-react';
import { colors } from '../theme/colors';

/**
 * 1. App Icon Badge (Top-Left)
 */
export function AppIconBadge({ className = '' }) {
  return (
    <div
      className={`bg-gradient-to-br from-accent to-primary rounded-xl sm:rounded-2xl p-2 sm:p-2.5 shadow-card-elevated border border-white/60 flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 ${className}`}
    >
      <span className="text-white text-xl sm:text-2xl font-black italic tracking-tighter drop-shadow-sm select-none">
        S
      </span>
    </div>
  );
}

/**
 * 2. Congratulation Card (Middle-Left)
 */
export function CongratulationCard({ className = '' }) {
  return (
    <div
      className={`bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-3 shadow-card-elevated border border-card-border flex items-center gap-2.5 ${className}`}
    >
      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-primary flex items-center justify-center text-white flex-shrink-0 shadow-xs">
        <Mail className="w-4 h-4 stroke-[2.2]" />
      </div>
      <div>
        <div className="flex items-center gap-1">
          <span className="text-[12px] sm:text-[13px] font-bold text-main-text leading-tight">
            Congratulation!
          </span>
          <CheckCircle2 className="w-3.5 h-3.5 text-accent fill-accent-light stroke-[2.5]" />
        </div>
        <p className="text-[11px] text-muted-text mt-0.5 whitespace-nowrap font-medium">
          Your Job Offer is Confirmed
        </p>
      </div>
    </div>
  );
}

/**
 * 3. Courses Card (Top-Right)
 */
export function CoursesCard({ className = '' }) {
  return (
    <div
      className={`bg-white rounded-xl sm:rounded-2xl px-3 py-2 sm:px-3.5 sm:py-2.5 shadow-card-elevated border border-card-border flex flex-col items-center justify-center text-center ${className}`}
    >
      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-accent-light text-accent flex items-center justify-center mb-1">
        <GraduationCap className="w-4 h-4 stroke-[2.2]" />
      </div>
      <div className="text-sm sm:text-base font-black text-main-text leading-none">
        15000+
      </div>
      <div className="text-[11px] text-muted-text mt-0.5 whitespace-nowrap font-medium">
        Verified Trade Jobs
      </div>
    </div>
  );
}

/**
 * 4. Technical Training Class Card (Middle-Right)
 */
export function ClassScheduleCard({ className = '' }) {
  return (
    <div
      className={`bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-3 shadow-card-elevated border border-card-border flex items-center gap-2.5 ${className}`}
    >
      <img
        src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=100&auto=format&fit=crop&q=80"
        alt="Technical Instructor"
        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-accent-border flex-shrink-0"
      />
      <div>
        <h4 className="text-[12px] font-bold text-main-text leading-snug">
          Industrial Safety Class
        </h4>
        <p className="text-[11px] text-muted-text">
          Tomorrow at 10.00 AM
        </p>
        <button
          type="button"
          className="mt-1 px-2.5 py-0.5 text-[10px] font-bold text-white bg-primary hover:bg-primary-hover rounded-md transition-colors shadow-xs cursor-pointer"
        >
          Join now
        </button>
      </div>
    </div>
  );
}

/**
 * 5. Review & Rating Card (Bottom-Center/Left)
 */
export function ReviewRatingCard({ className = '' }) {
  return (
    <div
      className={`bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-3 shadow-card-elevated border border-card-border ${className}`}
    >
      {/* Overlapping Avatars */}
      <div className="flex items-center -space-x-1.5 mb-1.5">
        <img
          src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&auto=format&fit=crop&q=80"
          alt="User 1"
          className="w-6 h-6 rounded-full object-cover ring-2 ring-white"
        />
        <img
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80"
          alt="User 2"
          className="w-6 h-6 rounded-full object-cover ring-2 ring-white"
        />
        <img
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80"
          alt="User 3"
          className="w-6 h-6 rounded-full object-cover ring-2 ring-white"
        />
        <div className="w-6 h-6 rounded-full bg-accent-light text-accent ring-2 ring-white flex items-center justify-center text-[9px] font-bold">
          98+
        </div>
      </div>

      {/* Star Rating */}
      <div className="flex items-center gap-1">
        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
        <span className="text-[12px] font-bold text-main-text">4.9</span>
        <span className="text-[11px] text-muted-text font-medium">
          (3.7k review)
        </span>
      </div>
    </div>
  );
}
