import React, { useState } from 'react';
import {
  Search,
  Calendar,
  Bell,
  ChevronDown,
  Menu,
  Users,
  Building2,
  Briefcase,
  FileText,
  TrendingUp,
} from 'lucide-react';
import AdminSidebar from './AdminSidebar';

// ==========================================
// STATIC DATA FOR DASHBOARD
// ==========================================

const STATS_DATA = [
  {
    id: 'job-seekers',
    label: 'Job Seekers',
    value: '2,845',
    trend: '+12%',
    trendText: 'vs last month',
    icon: Users,
    iconColor: 'text-[#2563EB]',
    iconBg: 'bg-[#EBF3FF]',
  },
  {
    id: 'companies',
    label: 'Companies',
    value: '326',
    trend: '+8%',
    trendText: 'vs last month',
    icon: Building2,
    iconColor: 'text-[#0F8B8D]',
    iconBg: 'bg-[#E6F8F3]',
  },
  {
    id: 'active-jobs',
    label: 'Active Jobs',
    value: '1,128',
    trend: '+18%',
    trendText: 'vs last month',
    icon: Briefcase,
    iconColor: 'text-[#7C3AED]',
    iconBg: 'bg-[#F3EEFE]',
  },
  {
    id: 'total-applications',
    label: 'Total Applications',
    value: '5,642',
    trend: '+24%',
    trendText: 'vs last month',
    icon: FileText,
    iconColor: 'text-[#EA580C]',
    iconBg: 'bg-[#FFF2E8]',
  },
];

const REGISTRATION_CHART_DATA = [
  { month: 'Jan', seekers: 110, companies: 30 },
  { month: 'Feb', seekers: 155, companies: 65 },
  { month: 'Mar', seekers: 205, companies: 45 },
  { month: 'Apr', seekers: 145, companies: 80 },
  { month: 'May', seekers: 215, companies: 125 },
  { month: 'Jun', seekers: 175, companies: 95 },
  { month: 'Jul', seekers: 220, companies: 135 },
  { month: 'Aug', seekers: 265, companies: 155 },
  { month: 'Sep', seekers: 290, companies: 195 },
  { month: 'Oct', seekers: 345, companies: 215 },
];

const TOP_DISTRICTS_DATA = [
  { rank: 1, name: 'Thoothukudi', count: 280, percentage: 93 },
  { rank: 2, name: 'Coimbatore', count: 180, percentage: 60 },
  { rank: 3, name: 'Chennai', count: 150, percentage: 50 },
  { rank: 4, name: 'Madurai', count: 120, percentage: 40 },
  { rank: 5, name: 'Tirunelveli', count: 95, percentage: 32 },
];

const RECENT_COMPANIES_DATA = [
  {
    id: 1,
    name: 'ABC Industrial Services',
    district: 'Thoothukudi',
    registeredOn: 'Oct 14, 2026',
    status: 'Pending',
    initial: 'A',
    bgColor: 'bg-slate-900 text-white',
  },
  {
    id: 2,
    name: 'Bright Tech Solutions',
    district: 'Chennai',
    registeredOn: 'Oct 13, 2026',
    status: 'Verified',
    initial: 'B',
    bgColor: 'bg-teal-600 text-white',
  },
  {
    id: 3,
    name: 'Solai Construction',
    district: 'Tirunelveli',
    registeredOn: 'Oct 12, 2026',
    status: 'Pending',
    initial: 'S',
    bgColor: 'bg-amber-600 text-white',
  },
  {
    id: 4,
    name: 'Tamil Skills Academy',
    district: 'Madurai',
    registeredOn: 'Oct 11, 2026',
    status: 'Verified',
    initial: 'T',
    bgColor: 'bg-blue-600 text-white',
  },
  {
    id: 5,
    name: 'Healthy Care Hospital',
    district: 'Coimbatore',
    registeredOn: 'Oct 10, 2026',
    status: 'Pending',
    initial: 'H',
    bgColor: 'bg-sky-500 text-white',
  },
];

const RECENT_JOBS_DATA = [
  {
    id: 1,
    title: 'Electrician',
    company: 'ABC Industrial...',
    district: 'Thoothukudi',
    postedOn: 'Oct 14, 2026',
    status: 'Active',
  },
  {
    id: 2,
    title: 'Flutter Developer',
    company: 'Bright Tech...',
    district: 'Chennai',
    postedOn: 'Oct 13, 2026',
    status: 'Active',
  },
  {
    id: 3,
    title: 'Site Supervisor',
    company: 'Solai Construction',
    district: 'Tirunelveli',
    postedOn: 'Oct 12, 2026',
    status: 'Under Review',
  },
  {
    id: 4,
    title: 'Accountant',
    company: 'Lakshmi Traders',
    district: 'Madurai',
    postedOn: 'Oct 11, 2026',
    status: 'Active',
  },
  {
    id: 5,
    title: 'Nurse',
    company: 'Healthy Care Ho...',
    district: 'Coimbatore',
    postedOn: 'Oct 10, 2026',
    status: 'Closed',
  },
];

/**
 * Super Admin Dashboard Page (Single-File Page Implementation)
 * Uses separate reusable AdminSidebar component for platform-wide consistency.
 */
export default function AdminDashboard({ onLogout, onNavigateHome, onNavigateTab }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Top header states
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('Oct 01, 2026 - Oct 31, 2026');
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Chart states
  const [chartFilter, setChartFilter] = useState('This Year');
  const [chartFilterOpen, setChartFilterOpen] = useState(false);
  const [hoveredChartPoint, setHoveredChartPoint] = useState(null);

  // Table action menu
  const [activeCompanyMenu, setActiveCompanyMenu] = useState(null);

  // Chart SVG Calculations
  const chartSvgWidth = 640;
  const chartSvgHeight = 240;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 35;
  const chartW = chartSvgWidth - paddingLeft - paddingRight;
  const chartH = chartSvgHeight - paddingTop - paddingBottom;
  const maxY = 400;

  const getChartX = (index) => paddingLeft + (index / (REGISTRATION_CHART_DATA.length - 1)) * chartW;
  const getChartY = (val) => paddingTop + chartH - (val / maxY) * chartH;

  const buildSmoothCurve = (key) => {
    const points = REGISTRATION_CHART_DATA.map((d, i) => ({ x: getChartX(i), y: getChartY(d[key]) }));
    if (points.length === 0) return '';

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? 0 : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const seekersPath = buildSmoothCurve('seekers');
  const companiesPath = buildSmoothCurve('companies');
  const seekersAreaPath = `${seekersPath} L ${getChartX(REGISTRATION_CHART_DATA.length - 1)} ${paddingTop + chartH} L ${getChartX(0)} ${paddingTop + chartH} Z`;
  const companiesAreaPath = `${companiesPath} L ${getChartX(REGISTRATION_CHART_DATA.length - 1)} ${paddingTop + chartH} L ${getChartX(0)} ${paddingTop + chartH} Z`;

  const getJobStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-100/70 text-emerald-700';
      case 'Under Review':
        return 'bg-amber-100/70 text-amber-700';
      case 'Closed':
        return 'bg-rose-100/70 text-rose-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6FA] flex font-sans">
      
      {/* ============================================================== */}
      {/* 1. SEPARATE REUSABLE SIDEBAR COMPONENT                         */}
      {/* ============================================================== */}
      <AdminSidebar
        activeTab="dashboard"
        onSelectTab={(tabId) => {
          if (onNavigateTab) {
            onNavigateTab(tabId);
          } else {
            setActiveTab(tabId);
          }
        }}
        onLogout={onLogout || onNavigateHome}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* ============================================================== */}
      {/* 2. MAIN DASHBOARD CONTENT AREA                                 */}
      {/* ============================================================== */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        
        {/* ----------------- TOP NAVBAR HEADER ----------------- */}
        <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          
          {/* Left: Mobile Toggle + Search Bar */}
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users, companies, jobs..."
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* Right: Date Picker, Notifications, User Avatar */}
          <div className="flex items-center gap-2.5 sm:gap-4 flex-shrink-0">
            
            {/* Date Range Selector */}
            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-2xs cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>{dateRange}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {dateDropdownOpen && (
                <div 
                  className="absolute right-0 top-12 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-fadeIn"
                  onMouseLeave={() => setDateDropdownOpen(false)}
                >
                  {['Today', 'Last 7 Days', 'Oct 01, 2026 - Oct 31, 2026', 'Last 30 Days', 'This Quarter', 'This Year (2026)'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setDateRange(opt); setDateDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors ${
                        dateRange === opt ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <button
              type="button"
              onClick={() => alert('You have 3 unread system alerts.')}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5 stroke-[2]" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
            </button>

            {/* User Avatar Circle */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="w-9 h-9 rounded-full bg-[#1A365D] text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-sm hover:ring-2 hover:ring-blue-500/30 transition-all cursor-pointer"
                title="Super Admin Profile"
              >
                SA
              </button>

              {profileDropdownOpen && (
                <div
                  className="absolute right-0 top-12 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-fadeIn"
                  onMouseLeave={() => setProfileDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800">Super Admin</p>
                    <p className="text-[11px] text-slate-400">admin@starkjobs.com</p>
                  </div>
                  <button
                    onClick={() => { alert('Opening Admin Settings'); setProfileDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Account Settings
                  </button>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      if (onLogout) onLogout();
                      else if (onNavigateHome) onNavigateHome();
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-semibold transition-colors"
                  >
                    Logout System
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* ----------------- MAIN SCROLLABLE DASHBOARD BODY ----------------- */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Page Title & Subtitle */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Overview of the Stark Jobs platform
            </p>
          </div>

          {/* ============================================================== */}
          {/* ROW 1: 4 STAT METRIC CARDS                                     */}
          {/* ============================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {STATS_DATA.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all duration-200 flex items-center gap-4 group"
                >
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${item.iconBg} ${item.iconColor} flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105`}
                  >
                    <Icon className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs sm:text-[13px] font-semibold text-slate-500 block truncate">
                      {item.label}
                    </span>
                    <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5 leading-none">
                      {item.value}
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 text-[11px] sm:text-xs">
                      <span className="inline-flex items-center gap-0.5 font-bold text-emerald-600">
                        <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>{item.trend}</span>
                      </span>
                      <span className="text-slate-400 font-medium whitespace-nowrap">
                        {item.trendText}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ============================================================== */}
          {/* ROW 2: DUAL REGISTRATION CHART + TOP DISTRICTS                 */}
          {/* ============================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Chart Column (2 cols) */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
              
              {/* Chart Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">New Registrations</h2>
                </div>

                <div className="flex items-center gap-4">
                  {/* Legend */}
                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
                      <span className="text-slate-600">Job Seekers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                      <span className="text-slate-600">Companies</span>
                    </div>
                  </div>

                  {/* Period Filter Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setChartFilterOpen(!chartFilterOpen)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-2xs cursor-pointer"
                    >
                      <span>{chartFilter}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    {chartFilterOpen && (
                      <div
                        className="absolute right-0 top-10 w-36 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-20 animate-fadeIn"
                        onMouseLeave={() => setChartFilterOpen(false)}
                      >
                        {['This Year', 'Last 6 Months', 'Last Quarter'].map((opt) => (
                          <button
                            key={opt}
                            onClick={() => { setChartFilter(opt); setChartFilterOpen(false); }}
                            className={`w-full text-left px-3 py-1.5 text-xs font-medium transition-colors ${
                              chartFilter === opt ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Chart SVG */}
              <div className="relative w-full h-[240px] mt-2 select-none">
                <svg
                  viewBox={`0 0 ${chartSvgWidth} ${chartSvgHeight}`}
                  className="w-full h-full overflow-visible"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="seekersGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563EB" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="companiesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Y Axis Grid Lines */}
                  {[0, 100, 200, 300, 400].map((val) => {
                    const y = getChartY(val);
                    return (
                      <g key={val}>
                        <line
                          x1={paddingLeft}
                          y1={y}
                          x2={chartSvgWidth - paddingRight}
                          y2={y}
                          stroke="#E2E8F0"
                          strokeDasharray="4 4"
                          strokeWidth="1"
                        />
                        <text
                          x={paddingLeft - 10}
                          y={y + 4}
                          textAnchor="end"
                          fontSize="10"
                          fill="#94A3B8"
                          fontWeight="500"
                        >
                          {val}
                        </text>
                      </g>
                    );
                  })}

                  {/* X Axis Month Labels */}
                  {REGISTRATION_CHART_DATA.map((d, i) => (
                    <text
                      key={d.month}
                      x={getChartX(i)}
                      y={chartSvgHeight - 10}
                      textAnchor="middle"
                      fontSize="11"
                      fill="#94A3B8"
                      fontWeight="500"
                    >
                      {d.month}
                    </text>
                  ))}

                  {/* Areas */}
                  <path d={seekersAreaPath} fill="url(#seekersGrad)" />
                  <path d={companiesAreaPath} fill="url(#companiesGrad)" />

                  {/* Lines */}
                  <path d={seekersPath} fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d={companiesPath} fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                  {/* Interactive Nodes */}
                  {REGISTRATION_CHART_DATA.map((d, i) => {
                    const sx = getChartX(i);
                    const sy = getChartY(d.seekers);
                    const cx = getChartX(i);
                    const cy = getChartY(d.companies);
                    const isHovered = hoveredChartPoint === i;

                    return (
                      <g key={i}>
                        {isHovered && (
                          <line
                            x1={sx}
                            y1={paddingTop}
                            x2={sx}
                            y2={paddingTop + chartH}
                            stroke="#CBD5E1"
                            strokeWidth="1"
                            strokeDasharray="3 3"
                          />
                        )}

                        {/* Seekers Node */}
                        <circle
                          cx={sx}
                          cy={sy}
                          r={isHovered ? 6 : 4}
                          fill="#FFFFFF"
                          stroke="#2563EB"
                          strokeWidth="2.5"
                          className="transition-all duration-150 cursor-pointer"
                          onMouseEnter={() => setHoveredChartPoint(i)}
                          onMouseLeave={() => setHoveredChartPoint(null)}
                        />

                        {/* Companies Node */}
                        <circle
                          cx={cx}
                          cy={cy}
                          r={isHovered ? 6 : 4}
                          fill="#FFFFFF"
                          stroke="#10B981"
                          strokeWidth="2.5"
                          className="transition-all duration-150 cursor-pointer"
                          onMouseEnter={() => setHoveredChartPoint(i)}
                          onMouseLeave={() => setHoveredChartPoint(null)}
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Tooltip Overlay */}
                {hoveredChartPoint !== null && (
                  <div
                    className="absolute z-20 pointer-events-none bg-slate-900 text-white rounded-xl px-3 py-2 text-xs shadow-xl border border-slate-700/50"
                    style={{
                      left: `${(getChartX(hoveredChartPoint) / chartSvgWidth) * 100}%`,
                      top: '15%',
                      transform: 'translateX(-50%)',
                    }}
                  >
                    <p className="font-bold text-slate-300 pb-1 border-b border-slate-700 text-[11px]">
                      {REGISTRATION_CHART_DATA[hoveredChartPoint].month} 2026
                    </p>
                    <div className="pt-1.5 space-y-1">
                      <div className="flex items-center justify-between gap-3 text-blue-400 font-semibold">
                        <span>Seekers:</span>
                        <span>{REGISTRATION_CHART_DATA[hoveredChartPoint].seekers}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3 text-emerald-400 font-semibold">
                        <span>Companies:</span>
                        <span>{REGISTRATION_CHART_DATA[hoveredChartPoint].companies}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Top Districts Column (1 col) */}
            <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-800">
                  Top Districts <span className="text-sm font-normal text-slate-500">(Active Jobs)</span>
                </h2>
                <button
                  onClick={() => alert('Viewing all districts')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors cursor-pointer"
                >
                  View All
                </button>
              </div>

              <div className="space-y-4 my-auto">
                {TOP_DISTRICTS_DATA.map((item) => (
                  <div key={item.rank} className="flex items-center justify-between gap-3 text-sm group">
                    <span className="w-5 text-slate-400 font-medium text-xs text-center">
                      {item.rank}
                    </span>
                    <span className="w-28 font-medium text-slate-700 text-sm truncate group-hover:text-blue-600 transition-colors">
                      {item.name}
                    </span>
                    <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden mx-2">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="w-10 text-right font-semibold text-slate-700 text-sm">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ============================================================== */}
          {/* ROW 3: RECENT COMPANIES TABLE + RECENT JOBS TABLE              */}
          {/* ============================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Table 1: Recent Company Registrations */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800">Recent Company Registrations</h2>
                <button
                  onClick={() => alert('Viewing all registered companies')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors cursor-pointer"
                >
                  View All
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-xs font-medium text-slate-400 border-b border-slate-100 pb-3">
                      <th className="pb-3 font-semibold">Company Name</th>
                      <th className="pb-3 font-semibold">District</th>
                      <th className="pb-3 font-semibold">Registered On</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {RECENT_COMPANIES_DATA.map((company) => (
                      <tr key={company.id} className="hover:bg-slate-50/70 transition-colors group">
                        <td className="py-3 pr-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${company.bgColor} shadow-sm flex-shrink-0`}>
                              {company.initial}
                            </div>
                            <span className="font-semibold text-slate-800 text-sm truncate max-w-[170px] group-hover:text-blue-600 transition-colors">
                              {company.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-slate-600 text-xs font-medium">
                          {company.district}
                        </td>
                        <td className="py-3 px-2 text-slate-500 text-xs">
                          {company.registeredOn}
                        </td>
                        <td className="py-3 px-2">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              company.status === 'Verified'
                                ? 'bg-emerald-100/70 text-emerald-700'
                                : 'bg-amber-100/70 text-amber-700'
                            }`}
                          >
                            {company.status}
                          </span>
                        </td>
                        <td className="py-3 pl-2 text-right relative">
                          <button
                            onClick={() => setActiveCompanyMenu(activeCompanyMenu === company.id ? null : company.id)}
                            className="p-1 rounded hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                            title="Options"
                          >
                            <svg className="w-5 h-5 inline-block" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                          </button>

                          {activeCompanyMenu === company.id && (
                            <div
                              className="absolute right-0 top-10 w-36 bg-white border border-slate-100 rounded-xl shadow-lg py-1.5 z-20 text-left animate-fadeIn"
                              onMouseLeave={() => setActiveCompanyMenu(null)}
                            >
                              <button
                                onClick={() => { alert(`Viewing ${company.name}`); setActiveCompanyMenu(null); }}
                                className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 text-left font-medium block"
                              >
                                View Details
                              </button>
                              <button
                                onClick={() => { alert(`Verifying ${company.name}`); setActiveCompanyMenu(null); }}
                                className="w-full px-3 py-1.5 text-xs text-emerald-600 hover:bg-emerald-50 text-left font-medium block"
                              >
                                Approve Company
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 2: Recent Job Listings */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800">Recent Job Listings</h2>
                <button
                  onClick={() => alert('Viewing all job listings')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors cursor-pointer"
                >
                  View All
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-xs font-medium text-slate-400 border-b border-slate-100 pb-3">
                      <th className="pb-3 font-semibold">Job Title</th>
                      <th className="pb-3 font-semibold">Company</th>
                      <th className="pb-3 font-semibold">District</th>
                      <th className="pb-3 font-semibold">Posted On</th>
                      <th className="pb-3 font-semibold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {RECENT_JOBS_DATA.map((job) => (
                      <tr key={job.id} className="hover:bg-slate-50/70 transition-colors group">
                        <td className="py-3 pr-2">
                          <span className="font-semibold text-slate-800 text-sm group-hover:text-blue-600 transition-colors block">
                            {job.title}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-slate-600 text-xs font-medium truncate max-w-[130px]">
                          {job.company}
                        </td>
                        <td className="py-3 px-2 text-slate-500 text-xs">
                          {job.district}
                        </td>
                        <td className="py-3 px-2 text-slate-500 text-xs">
                          {job.postedOn}
                        </td>
                        <td className="py-3 pl-2 text-right">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getJobStatusBadge(
                              job.status
                            )}`}
                          >
                            {job.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </main>
      </div>

    </div>
  );
}
