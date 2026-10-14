import React from 'react';
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  FileCheck,
  MapPin,
  Grid2X2,
  BarChart3,
  Settings,
  Clock,
  LogOut,
  X,
  ChevronDown,
  Flag,
  Shield
} from 'lucide-react';

const NAV_GROUPS = [
  {
    title: 'OVERVIEW',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'MANAGEMENT',
    items: [
      { id: 'job-seekers', label: 'Job Seekers', icon: Users },
      { id: 'companies', label: 'Companies', icon: Building2 },
      { id: 'jobs', label: 'Job Listings', icon: Briefcase },
      { id: 'applications', label: 'Applications', icon: FileCheck },
      { id: 'districts', label: 'Districts & Categories', icon: MapPin },
      { id: 'categories', label: 'Job Categories', icon: Grid2X2 },
    ],
  },
  {
    title: 'MONITORING',
    items: [
      { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
      { id: 'reported', label: 'Reported Jobs & Users', icon: Flag },
    ],
  },
  {
    title: 'CONFIGURATION',
    items: [
      { id: 'roles', label: 'Roles & Permissions', icon: Shield },
      { id: 'settings', label: 'Settings', icon: Settings },
      { id: 'logs', label: 'Activity Logs', icon: Clock },
    ],
  },
];

/**
 * Super Admin Sidebar Component
 * Matches the reference design with dark navy theme, active pill highlight,
 * grouped navigation dividers, and user profile box.
 */
export default function AdminSidebar({
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
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0A192F] text-slate-300 flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-slate-800/80 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Logo Header */}
        <div className="p-5 flex items-center justify-between border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            {/* Custom Briefcase Logo matching screenshot */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-[#1976D2] flex items-center justify-center text-white shadow-md flex-shrink-0">
              <Briefcase className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-lg font-black text-white tracking-tight">Stark</span>
                <span className="text-lg font-black text-[#2196F3] tracking-tight">Jobs</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-400 block mt-1 tracking-wide">
                Super Admin
              </span>
            </div>
          </div>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links Scrollable Area */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-5 no-scrollbar">
          {NAV_GROUPS.map((group, gIdx) => (
            <div key={group.title} className={gIdx > 0 ? 'pt-2 border-t border-slate-800/60' : ''}>
              <h4 className="px-3 mb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                {group.title}
              </h4>
              <div className="space-y-1">
                {group.items.map((item) => {
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
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer text-left select-none ${
                        isActive
                          ? 'bg-[#1976D2] text-white shadow-md shadow-blue-900/40 font-bold'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Profile & Logout Footer Card */}
        <div className="p-3.5 border-t border-slate-800/80">
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/90 flex flex-col gap-3">
            {/* User Info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white text-[#0A192F] font-bold text-sm flex items-center justify-center shadow-xs flex-shrink-0">
                SA
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-white truncate">Super Admin</h4>
                <p className="text-[11px] text-slate-400 truncate">Administrator</p>
              </div>
            </div>

            {/* Logout Action */}
            <button
              type="button"
              onClick={onLogout}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

      </aside>
    </>
  );
}
