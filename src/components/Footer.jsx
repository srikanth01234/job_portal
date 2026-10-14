import React from 'react';
import Logo from './Logo';
import { colors } from '../theme/colors';
import { Mail, ArrowRight } from 'lucide-react';

/**
 * Reusable Footer Component
 * Structured into reusable link columns, newsletter, and copyright bar
 */
export default function Footer({ onNavigateAdmin }) {
  const footerSections = [
    {
      title: 'For Candidates',
      links: [
        { label: 'Browse Jobs', href: '#' },
        { label: 'Candidate Dashboard', href: '#' },
        { label: 'Saved Jobs', href: '#' },
        { label: 'Job Alerts', href: '#' },
        { label: 'Career Advice', href: '#' },
      ],
    },
    {
      title: 'For Employers',
      links: [
        { label: 'Post a Job', href: '#' },
        { label: 'Browse Candidates', href: '#' },
        { label: 'Employer Dashboard', href: '#' },
        { label: 'Applications', href: '#' },
        { label: 'Pricing Plans', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '#' },
        { label: 'Contact Us', href: '#' },
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
        { label: 'Super Admin Portal', href: '#admin', isAction: true },
      ],
    },
  ];

  return (
    <footer className="w-full bg-primary text-slate-200 pt-12 sm:pt-16 pb-10 sm:pb-12 mt-12 sm:mt-16 border-t border-primary-hover">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16">
        
        {/* Top Section: Brand + Links + Newsletter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 pb-10 sm:pb-12 border-b border-white/10">
          
          {/* Brand Info (2 cols on lg) */}
          <div className="sm:col-span-2 lg:col-span-2 space-y-3.5 sm:space-y-4">
            <div className="inline-block p-2 rounded-xl bg-white shadow-xs">
              <Logo />
            </div>
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm font-normal">
              Stark Jobs connects skilled technicians, mechanics, electricians, welders, plumbers, drivers, and supervisors with top industrial employers across India.
            </p>
            
            {/* Newsletter Subscription */}
            <div className="pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200 block mb-2">
                Subscribe to Job Alerts
              </span>
              <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row max-w-sm gap-2">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full bg-[#102B48] border border-[#234B75] rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-accent"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-bold text-white bg-accent hover:bg-accent-hover rounded-xl transition duration-200 shadow-xs flex items-center justify-center cursor-pointer"
                  aria-label="Subscribe"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Links Columns (3 cols on lg) */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.isAction ? (
                      <button
                        type="button"
                        onClick={onNavigateAdmin}
                        className="text-sm text-accent hover:text-white font-bold transition-colors duration-150 inline-flex items-center gap-1.5 py-0.5 cursor-pointer"
                      >
                        <span>🔒</span>
                        <span>{link.label}</span>
                      </button>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-slate-300 hover:text-white font-medium transition-colors duration-150 inline-block py-0.5"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom Section: Copyright & Legal */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-300/80 font-medium gap-3 sm:gap-4 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Stark Jobs Inc. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
            <button
              type="button"
              onClick={onNavigateAdmin}
              className="text-accent hover:text-white font-bold transition-colors cursor-pointer flex items-center gap-1"
            >
              Super Admin
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
