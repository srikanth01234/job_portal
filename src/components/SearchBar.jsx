import React, { useState } from 'react';
import { Briefcase, MapPin, ChevronDown } from 'lucide-react';

/**
 * Reusable Job Search Bar Component
 * Styled with Deep Navy #173E68, Charcoal #1F2937, and Teal #0F8B8D
 */
export default function SearchBar({ onSearch, className = '' }) {
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('Location');
  const [locationOpen, setLocationOpen] = useState(false);

  const locations = [
    'All India',
    'Mumbai, Maharashtra',
    'Delhi NCR',
    'Bengaluru, Karnataka',
    'Chennai, Tamil Nadu',
    'Hyderabad, Telangana',
    'Pune, Maharashtra',
    'Ahmedabad, Gujarat',
    'Kolkata, West Bengal',
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ jobTitle, location: location === 'Location' ? '' : location });
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`bg-white rounded-[24px] sm:rounded-[30px] p-3 sm:p-3.5 shadow-sm border border-card-border flex flex-col md:flex-row items-stretch md:items-center gap-2.5 sm:gap-3 ${className}`}
    >
      {/* Field 1: Distinct Bordered Card for Job Title / Company */}
      <div className="flex-1 flex items-center gap-3 border border-card-border rounded-2xl px-4 py-3 sm:py-3.5 bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all">
        <Briefcase className="w-5 h-5 text-muted-text stroke-[2.2] flex-shrink-0" />
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="Supervisor, Mechanic, Welder, Electrician..."
          className="w-full bg-transparent text-sm sm:text-[15px] text-main-text font-semibold placeholder-[#9CA3AF] focus:outline-none"
        />
      </div>

      {/* Field 2: Distinct Bordered Card for Location Dropdown */}
      <div className="relative flex-1">
        <button
          type="button"
          onClick={() => setLocationOpen(!locationOpen)}
          className="w-full flex items-center justify-between gap-3 border border-card-border rounded-2xl px-4 py-3 sm:py-3.5 bg-white hover:border-[#D1D5DB] focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all text-left cursor-pointer"
        >
          <div className="flex items-center gap-3 truncate">
            <MapPin className="w-5 h-5 text-muted-text stroke-[2.2] flex-shrink-0" />
            <span className={`text-sm sm:text-[15px] font-semibold ${location === 'Location' ? 'text-[#6B7280]' : 'text-main-text'}`}>
              {location}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 text-muted-text stroke-[2.5] transition-transform duration-200 flex-shrink-0 ${locationOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Location Dropdown Menu */}
        {locationOpen && (
          <div className="absolute top-full left-0 mt-2 w-full min-w-[200px] max-h-56 overflow-y-auto bg-white rounded-2xl shadow-card-elevated border border-card-border py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
            {locations.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => {
                  setLocation(loc);
                  setLocationOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm font-medium text-main-text hover:bg-secondary-bg hover:text-accent transition-colors cursor-pointer"
              >
                {loc}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button: Clear Primary Action */}
      <button
        type="submit"
        className="w-full md:w-auto px-8 py-3.5 text-sm sm:text-[15px] font-bold text-white bg-primary hover:bg-primary-hover active:scale-95 rounded-2xl transition-all duration-200 shadow-sm flex items-center justify-center cursor-pointer flex-shrink-0"
      >
        Find now
      </button>
    </form>
  );
}
