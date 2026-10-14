import React from 'react';
import logoImg from '../assets/logo.png';

/**
 * Reusable Stark Jobs Logo Component
 * Uses the user provided logo from assets/logo.png
 */
export default function Logo({ className = '', showText = true }) {
  return (
    <a href="#" className={`flex items-center gap-2.5 group select-none ${className}`}>
      {/* Brand Icon Image */}
      <img
        src={logoImg}
        alt="Stark Jobs Logo"
        className="w-9 h-9 sm:w-10 sm:h-10 object-contain transition-transform duration-300 group-hover:scale-105"
      />

      {/* Brand Text */}
      {showText && (
        <span className="text-2xl font-black tracking-tight text-primary">
          Stark <span className="text-accent">Jobs</span>
        </span>
      )}
    </a>
  );
}
