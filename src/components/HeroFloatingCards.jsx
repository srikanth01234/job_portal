import React from 'react';
import { Mail, CheckCircle2, GraduationCap, Star } from 'lucide-react';
import { colors } from '../theme/colors';

/**
 * 1. App Icon Badge (Top-Left)
 */
export function AppIconBadge({ className = '' }) {
  return (
    <div
      className={`bg-gradient-to-br from-[#4dd0e1] to-[#26c6da] rounded-xl sm:rounded-2xl p-2 sm:p-2.5 shadow-card-elevated border border-white/60 flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 ${className}`}
    >
      <span className="text-white text-xl sm:text-2xl font-black italic tracking-tighter drop-shadow-sm select-none">
        a
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
      className={`bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-3 shadow-card-elevated border border-slate-100 flex items-center gap-2.5 backdrop-blur-md ${className}`}
    >
      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white flex-shrink-0 shadow-sm">
        <Mail className="w-4 h-4 stroke-[2.2]" />
      </div>
      <div>
        <div className="flex items-center gap-1">
          <span className="text-[12px] sm:text-[13px] font-extrabold text-slate-950 leading-tight">
            Congratulation!
          </span>
          <CheckCircle2 className="w-3 h-3 text-emerald-600 fill-emerald-100 stroke-[2.5]" />
        </div>
        <p className="text-[11px] text-slate-700 mt-0.5 whitespace-nowrap font-bold">
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
      className={`bg-white rounded-xl sm:rounded-2xl px-3 py-2 sm:px-3.5 sm:py-2.5 shadow-card-elevated border border-slate-100 flex flex-col items-center justify-center text-center ${className}`}
    >
      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-1">
        <GraduationCap className="w-4 h-4 stroke-[2.2]" />
      </div>
      <div className="text-sm sm:text-base font-black text-slate-950 leading-none">
        15000+
      </div>
      <div className="text-[11px] text-slate-800 mt-0.5 whitespace-nowrap font-bold">
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
      className={`bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-3 shadow-card-elevated border border-slate-100 flex items-center gap-2.5 ${className}`}
    >
      <img
        src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=100&auto=format&fit=crop&q=80"
        alt="Technical Instructor"
        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-purple-100 flex-shrink-0"
      />
      <div>
        <h4 className="text-[12px] font-extrabold text-slate-950 leading-snug">
          Industrial Safety Class
        </h4>
        <p className="text-[11px] text-slate-700 font-semibold">
          Tomorrow at 10.00 AM
        </p>
        <button
          type="button"
          className="mt-1 px-2.5 py-0.5 text-[10px] font-bold text-white rounded-md transition hover:opacity-90 shadow-sm cursor-pointer"
          style={{ backgroundColor: colors.primary.DEFAULT }}
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
      className={`bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-3 shadow-card-elevated border border-slate-100 ${className}`}
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
        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 ring-2 ring-white flex items-center justify-center text-[9px] font-bold">
          98+
        </div>
      </div>

      {/* Star Rating */}
      <div className="flex items-center gap-1">
        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
        <span className="text-[12px] font-black text-slate-950">4.9</span>
        <span className="text-[11px] text-slate-800 font-bold">
          (3.7k review)
        </span>
      </div>
    </div>
  );
}
