import React from 'react';
import api from '../services/api';
import {
  Home,
  Search,
  Send,
  User,
  Bookmark,
  Settings,
  LogOut,
  Briefcase,
  ChevronRight,
  X
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'find-jobs', label: 'Find Jobs', icon: Search },
  { id: 'applications', label: 'My Applications', icon: Send },
  { id: 'profile', label: 'My Profile & Resume', icon: User },
  { id: 'saved-jobs', label: 'Saved Jobs', icon: Bookmark },
];

/**
 * Reusable Job Seeker Sidebar Component
 * Matches the reference design:
 * - Brand: Stark Jobs Job Seeker with blue briefcase logo
 * - Active tab style: vibrant blue (#1976D2) with rounded pill highlight
 * - Navigation links: Dashboard, Find Jobs, My Applications, My Profile & Resume, Saved Jobs
 * - Bottom items: Settings, Logout, and User Profile Pill (Kavin Raj)
 */
export default function JobSeekerSidebar({
  activeTab = 'dashboard',
  onSelectTab,
  onLogout,
  mobileOpen = false,
  onCloseMobile
}) {
  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0A192F] text-slate-300 flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-slate-800/80 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Branding Section */}
        <div>
          <div className="p-5 flex items-center justify-between border-b border-slate-800/60">
            <div className="flex items-center gap-3">
              {/* Blue Briefcase Icon matching reference screenshot */}
              <div className="w-10 h-10 rounded-xl bg-[#1976D2] flex items-center justify-center text-white shadow-md flex-shrink-0">
                <Briefcase className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-lg font-black text-white tracking-tight">Stark</span>
                  <span className="text-lg font-black text-[#2196F3] tracking-tight">Jobs</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-400 block mt-1 tracking-wide">
                  Job Seeker
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3.5 space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (onSelectTab) onSelectTab(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer text-left select-none ${
                    isActive
                      ? 'bg-[#1976D2] text-white shadow-md shadow-blue-900/30 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Navigation: Settings, Logout & User Profile Pill */}
        <div className="p-4 border-t border-slate-800/80 space-y-1">
          <button
            type="button"
            onClick={() => {
              if (onSelectTab) onSelectTab('settings');
              if (onCloseMobile) onCloseMobile();
            }}
            className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer text-left select-none ${
              activeTab === 'settings'
                ? 'bg-[#1976D2] text-white font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Settings className="w-5 h-5 text-slate-400" />
            <span>Settings</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer text-left select-none"
          >
            <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-400" />
            <span>Logout</span>
          </button>

          {/* User Profile Footer Strip */}
          {(() => {
            const storedUser = api.getStoredUser?.() || {};
            const displayName = storedUser.name || 'Job Seeker';
            const initials = displayName.split(' ').filter(Boolean).map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'JS';
            const avatarUrl = storedUser.avatar_url || (storedUser.avatar ? (storedUser.avatar.startsWith('http') ? storedUser.avatar : `http://127.0.0.1:8000/storage/${storedUser.avatar}`) : null);
            return (
              <div
                onClick={() => {
                  if (onSelectTab) onSelectTab('profile');
                  if (onCloseMobile) onCloseMobile();
                }}
                className="pt-2 mt-2 border-t border-slate-800/60 flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/60 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-700 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 ring-1 ring-slate-700">
                      {initials}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate group-hover:text-blue-300 transition-colors">
                      {displayName}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate">Job Seeker</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white flex-shrink-0 transition-colors" />
              </div>
            );
          })()}
        </div>
      </aside>
    </>
  );
}
