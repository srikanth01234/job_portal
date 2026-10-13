import React, { useState } from 'react';
import { Briefcase, MapPin, ChevronDown } from 'lucide-react';

/**
 * Reusable Job Search Bar Component
 * Matches the reference design with separate rounded input cards and purple 'Find now' button
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
      className={`bg-white rounded-[24px] sm:rounded-[30px] p-3 sm:p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-slate-100 flex flex-col md:flex-row items-stretch md:items-center gap-2.5 sm:gap-3 ${className}`}
    >
      {/* Field 1: Distinct Bordered Card for Job Title / Company */}
      <div className="flex-1 flex items-center gap-3 border border-slate-300 rounded-2xl px-4 py-3 sm:py-3.5 bg-white focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-200 transition-all">
        <Briefcase className="w-5 h-5 text-slate-700 stroke-[2.2] flex-shrink-0" />
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="Supervisor, Mechanic, Welder, Electrician..."
          className="w-full bg-transparent text-sm sm:text-[15px] text-slate-950 font-bold placeholder-slate-600 focus:outline-none"
        />
      </div>

      {/* Field 2: Distinct Bordered Card for Location Dropdown */}
      <div className="relative flex-1">
        <button
          type="button"
          onClick={() => setLocationOpen(!locationOpen)}
          className="w-full flex items-center justify-between gap-3 border border-slate-300 rounded-2xl px-4 py-3 sm:py-3.5 bg-white hover:border-slate-400 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition-all text-left cursor-pointer"
        >
          <div className="flex items-center gap-3 truncate">
            <MapPin className="w-5 h-5 text-slate-700 stroke-[2.2] flex-shrink-0" />
            <span className={`text-sm sm:text-[15px] font-bold ${location === 'Location' ? 'text-slate-700' : 'text-slate-950'}`}>
              {location}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-700 stroke-[2.5] transition-transform duration-200 flex-shrink-0 ${locationOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Location Dropdown Menu */}
        {locationOpen && (
          <div className="absolute top-full left-0 mt-2 w-full min-w-[200px] max-h-56 overflow-y-auto bg-white rounded-2xl shadow-card-elevated border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
            {locations.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => {
                  setLocation(loc);
                  setLocationOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-purple-50 hover:text-purple-700 transition-colors cursor-pointer"
              >
                {loc}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button: Soft Lavender/Purple 'Find now' */}
      <button
        type="submit"
        className="w-full md:w-auto px-8 py-3.5 text-sm sm:text-[15px] font-bold text-white bg-[#8B6CEF] hover:bg-[#7D5CEB] active:scale-95 rounded-2xl transition-all duration-200 shadow-sm flex items-center justify-center cursor-pointer flex-shrink-0"
      >
        Find now
      </button>
    </form>
  );
}
