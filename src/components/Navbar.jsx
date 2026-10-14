import React, { useState, useEffect } from 'react';
import { ChevronDown, Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';
import Logo from './Logo';
import { colors } from '../theme/colors';

const NAV_ITEMS = [
  {
    label: 'Home',
    href: '#',
    hasDropdown: true,
    dropdownItems: [
      { name: 'Home Modern', desc: 'Main job discovery portal', badge: 'Popular' },
      { name: 'Home Executive', desc: 'Curated leadership roles' },
      { name: 'Remote Jobs', desc: 'Global work opportunities' },
    ],
  },
  {
    label: 'Browse Jobs',
    href: '#',
    hasDropdown: true,
    dropdownItems: [
      { name: 'All Jobs', desc: 'Search all active openings' },
      { name: 'Tech & Engineering', desc: 'Frontend, Backend, AI & DevOps' },
      { name: 'Design & Creative', desc: 'UI/UX, Product & Graphic Design' },
    ],
  },
  {
    label: 'Employers',
    href: '#',
    hasDropdown: true,
    dropdownItems: [
      { name: 'Employer Directory', desc: 'Discover top hiring firms' },
      { name: 'Post a Job', desc: 'Reach 3M+ active candidates', badge: 'Hot' },
    ],
  },
  {
    label: 'Candidates',
    href: '#',
    hasDropdown: true,
    dropdownItems: [
      { name: 'Candidate Search', desc: 'Find verified talent profiles' },
      { name: 'Dashboard', desc: 'Manage your applications' },
    ],
  },
  { label: 'Blog', href: '#', hasDropdown: false },
  { label: 'Pages', href: '#', hasDropdown: false },
];

/**
 * Modern Glassmorphic Navbar Component
 * Sleek, compact 68px height, modern pill interactions, micro-animations
 */
export default function Navbar({ onOpenAuth }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileExpandedItem, setMobileExpandedItem] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileSubmenu = (label) => {
    setMobileExpandedItem(prev => (prev === label ? null : label));
  };

  return (
    <header
      className={`w-full sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100'
          : 'bg-white/80 backdrop-blur-sm border-b border-slate-100/80'
      }`}
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16">
        <div className="flex items-center justify-between h-[68px]">
          
          {/* Left: Brand Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Logo />
          </div>

          {/* Center: Modern Pill Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1.5 xl:space-x-2">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <a
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[14px] transition-all duration-200 select-none ${
                    activeDropdown === item.label
                      ? 'bg-secondary-bg text-primary font-bold'
                      : 'text-main-text font-semibold hover:text-accent hover:bg-secondary-bg'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.hasDropdown && (
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-muted-text stroke-[2.5] transition-transform duration-200 ${
                        activeDropdown === item.label ? 'rotate-180 text-accent' : ''
                      }`}
                    />
                  )}
                </a>

                {/* Modern Dropdown Card */}
                {item.hasDropdown && activeDropdown === item.label && (
                  <div className="absolute top-full left-0 pt-2 w-64 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="bg-white rounded-2xl shadow-card-elevated border border-card-border p-2 space-y-1">
                      {item.dropdownItems.map((subItem) => (
                        <a
                          key={subItem.name}
                          href="#"
                          className="flex items-start justify-between p-2.5 rounded-xl hover:bg-secondary-bg transition-colors group"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[13px] font-bold text-main-text group-hover:text-accent">
                                {subItem.name}
                              </span>
                              {subItem.badge && (
                                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-accent-light text-accent border border-accent-border">
                                  {subItem.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-muted-text font-medium mt-0.5 group-hover:text-main-text">
                              {subItem.desc}
                            </p>
                          </div>
                          <ArrowUpRight className="w-3.5 h-3.5 text-[#9CA3AF] opacity-0 group-hover:opacity-100 group-hover:text-accent transition-all flex-shrink-0 mt-0.5" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Actions: Apply Now, Sign In, Menu Icon */}
          <div className="flex items-center space-x-2.5 sm:space-x-4">
            {/* Apply Now with glowing pulse dot */}
            <button
              type="button"
              onClick={() => onOpenAuth && onOpenAuth('signup')}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[14px] font-bold text-accent hover:bg-accent-light transition-all duration-200 group cursor-pointer"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
              </span>
              <span>Apply Now</span>
            </button>

            {/* Modern Sign In Button */}
            <button
              type="button"
              onClick={() => onOpenAuth && onOpenAuth('signin')}
              className="relative inline-flex items-center justify-center px-4 sm:px-6 py-2 text-xs sm:text-[14px] font-bold text-white bg-primary hover:bg-primary-hover rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer"
            >
              Sign in
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-main-text hover:text-primary rounded-xl hover:bg-secondary-bg transition-colors focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 stroke-[2.2]" /> : <Menu className="w-6 h-6 stroke-[2.2]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Modern Mobile Slide-Down Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-card-border bg-white px-5 py-5 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-200 max-h-[calc(100vh-68px)] overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isExpanded = mobileExpandedItem === item.label;
            return (
              <div key={item.label} className="border-b border-card-border pb-2">
                <div
                  className="flex items-center justify-between py-2 cursor-pointer select-none"
                  onClick={() => {
                    if (item.hasDropdown) {
                      toggleMobileSubmenu(item.label);
                    } else {
                      setMobileMenuOpen(false);
                    }
                  }}
                >
                  <span className="text-base font-bold text-main-text hover:text-accent">
                    {item.label}
                  </span>
                  {item.hasDropdown && (
                    <button
                      type="button"
                      aria-label="Toggle submenu"
                      className="p-1 text-muted-text"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180 text-accent' : ''
                        }`}
                      />
                    </button>
                  )}
                </div>

                {/* Submenu links */}
                {item.hasDropdown && isExpanded && (
                  <div className="pl-3 pr-1 py-2 space-y-2 bg-secondary-bg rounded-xl my-1 border border-card-border">
                    {item.dropdownItems.map((subItem) => (
                      <a
                        key={subItem.name}
                        href="#"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-1.5 px-2.5 rounded-lg hover:bg-white transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-main-text">
                            {subItem.name}
                          </span>
                          {subItem.badge && (
                            <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-accent-light text-accent border border-accent-border">
                              {subItem.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-text mt-0.5">
                          {subItem.desc}
                        </p>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Mobile Bottom Actions */}
          <div className="pt-3 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenAuth) onOpenAuth('signup');
              }}
              className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-accent bg-accent-light hover:bg-[#E0F2F2] rounded-xl cursor-pointer transition-colors border border-accent-border"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
              </span>
              <span>Apply Now</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenAuth) onOpenAuth('signin');
              }}
              className="w-full py-3 text-center text-sm font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-sm cursor-pointer transition-transform active:scale-95"
            >
              Sign in to Stark Jobs
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
