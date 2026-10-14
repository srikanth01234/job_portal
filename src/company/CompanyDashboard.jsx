import React, { useState } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  Briefcase,
  Users,
  Calendar,
  CheckCircle2,
  TrendingUp,
  MoreVertical,
  Plus,
  ArrowRight,
  ExternalLink,
  Filter,
  UserCheck,
  Building2,
  MapPin,
  Clock,
  Eye,
  Check,
  X,
  Menu,
  Sparkles,
  Mail,
  Phone,
  FileText
} from 'lucide-react';
import CompanySidebar from './CompanySidebar';

// Initial sample data replicating the reference dashboard
const INITIAL_APPLICANTS = [
  {
    id: 'app-1',
    initials: 'RK',
    initialsColor: 'bg-blue-100 text-blue-700',
    name: 'Ravi Kumar',
    location: 'Thoothukudi, TN',
    jobTitle: 'Electrician',
    appliedOn: 'Oct 14, 2026',
    status: 'New',
    email: 'ravi.kumar@example.com',
    phone: '+91 98765 43210',
    experience: '4 years',
    education: 'ITI Electrician'
  },
  {
    id: 'app-2',
    initials: 'MS',
    initialsColor: 'bg-emerald-100 text-emerald-700',
    name: 'Muthu Selvam',
    location: 'Tirunelveli, TN',
    jobTitle: 'Maintenance Technician',
    appliedOn: 'Oct 13, 2026',
    status: 'Under Review',
    email: 'muthu.s@example.com',
    phone: '+91 98451 23456',
    experience: '3 years',
    education: 'Diploma in Mechanical'
  },
  {
    id: 'app-3',
    initials: 'AP',
    initialsColor: 'bg-purple-100 text-purple-700',
    name: 'Arun Prakash',
    location: 'Thoothukudi, TN',
    jobTitle: 'Fitter',
    appliedOn: 'Oct 12, 2026',
    status: 'Shortlisted',
    email: 'arun.prakash@example.com',
    phone: '+91 97123 45678',
    experience: '5 years',
    education: 'ITI Fitter'
  },
  {
    id: 'app-4',
    initials: 'SJ',
    initialsColor: 'bg-rose-100 text-rose-700',
    name: 'Siva Jothi',
    location: 'Madurai, TN',
    jobTitle: 'Machine Operator',
    appliedOn: 'Oct 11, 2026',
    status: 'Interview',
    email: 'siva.jothi@example.com',
    phone: '+91 94321 09876',
    experience: '2 years',
    education: 'Diploma in Production'
  }
];

const INITIAL_JOBS = [
  {
    id: 'job-1',
    title: 'Electrician',
    location: 'Thoothukudi, TN',
    applicants: 48,
    status: 'Published',
    type: 'Full-time',
    salary: '₹18,000 - ₹24,000/mo'
  },
  {
    id: 'job-2',
    title: 'Maintenance Technician',
    location: 'Thoothukudi, TN',
    applicants: 26,
    status: 'Published',
    type: 'Full-time',
    salary: '₹20,000 - ₹28,000/mo'
  },
  {
    id: 'job-3',
    title: 'Machine Operator',
    location: 'Thoothukudi, TN',
    applicants: 12,
    status: 'Pending Review',
    type: 'Contract',
    salary: '₹16,000 - ₹22,000/mo'
  },
  {
    id: 'job-4',
    title: 'Fitter',
    location: 'Tirunelveli, TN',
    applicants: 18,
    status: 'Published',
    type: 'Full-time',
    salary: '₹17,000 - ₹23,000/mo'
  },
  {
    id: 'job-5',
    title: 'Safety Supervisor',
    location: 'Madurai, TN',
    applicants: 9,
    status: 'Closed',
    type: 'Full-time',
    salary: '₹25,000 - ₹35,000/mo'
  }
];

// Trend Line Chart Data
const TREND_DATA = [
  { date: 'Oct 8', count: 5 },
  { date: 'Oct 9', count: 10 },
  { date: 'Oct 10', count: 8 },
  { date: 'Oct 11', count: 14 },
  { date: 'Oct 12', count: 8 },
  { date: 'Oct 13', count: 12 },
  { date: 'Oct 14', count: 18 },
];

// Applications by Job Role
const ROLE_DISTRIBUTION = [
  { role: 'Electrician', count: 24, percent: 80, barColor: 'bg-[#1976D2]' },
  { role: 'Machine Operator', count: 12, percent: 40, barColor: 'bg-[#2196F3]' },
  { role: 'Maintenance Technician', count: 8, percent: 27, barColor: 'bg-[#42A5F5]' },
  { role: 'Fitter', count: 6, percent: 20, barColor: 'bg-[#90CAF9]' },
  { role: 'Others', count: 14, percent: 46, barColor: 'bg-[#90CAF9]' },
];

/**
 * Company Dashboard Component (Single File Implementation)
 * Features complete fidelity to the reference screenshot:
 * - Top header with universal search, notifications, company badge
 * - Welcome greeting & "Company Verified" badge
 * - 4 metric KPI cards with trends
 * - 3 visual charts: Applications Trend, Applications by Job Role, Application Status Donut
 * - 2 data tables: Recent Applicants & Your Job Listings
 * - Quick Actions bar for immediate recruitment operations
 */
export default function CompanyDashboard({
  onLogout,
  onNavigateHome,
  onNavigateTab
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [trendRange, setTrendRange] = useState('Last 7 days');
  const [activeSidebarTab, setActiveSidebarTab] = useState('dashboard');

  // Modals state
  const [createJobModalOpen, setCreateJobModalOpen] = useState(false);
  const [scheduleInterviewModalOpen, setScheduleInterviewModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Job form state
  const [jobList, setJobList] = useState(INITIAL_JOBS);
  const [applicantList, setApplicantList] = useState(INITIAL_APPLICANTS);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobLocation, setNewJobLocation] = useState('Thoothukudi, TN');
  const [newJobSalary, setNewJobSalary] = useState('');

  // Handle Tab navigation
  const handleSelectSidebarTab = (tabId) => {
    setActiveSidebarTab(tabId);
    if (tabId !== 'dashboard' && onNavigateTab) {
      onNavigateTab(tabId);
    }
  };

  // Handle New Job Creation
  const handleCreateJob = (e) => {
    e.preventDefault();
    if (!newJobTitle.trim()) return;

    const newJob = {
      id: `job-${Date.now()}`,
      title: newJobTitle,
      location: newJobLocation,
      applicants: 0,
      status: 'Published',
      type: 'Full-time',
      salary: newJobSalary || '₹20,000 - ₹25,000/mo'
    };

    setJobList([newJob, ...jobList]);
    setCreateJobModalOpen(false);
    setNewJobTitle('');
    setNewJobSalary('');
    alert(`Job "${newJob.title}" posted successfully!`);
  };

  // Helper for status badge styling
  const getApplicantBadgeClass = (status) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-[#1976D2] border-blue-200';
      case 'Under Review':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Shortlisted':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Interview':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Rejected':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getJobBadgeClass = (status) => {
    switch (status) {
      case 'Published':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Pending Review':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Closed':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex">
      {/* Reusable Sidebar Component */}
      <CompanySidebar
        activeTab={activeSidebarTab}
        onSelectTab={handleSelectSidebarTab}
        onLogout={onLogout}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            {/* Mobile Sidebar Toggle */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Global Search Bar */}
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidates, jobs, or anything..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Right Header Icons & Company Badge */}
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            {/* Notification Bell with Badge */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
              </button>

              {/* Notification Popover Dropdown */}
              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h4 className="text-sm font-bold text-slate-900">Notifications</h4>
                    <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
                      3 New
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto mt-2">
                    <div className="py-2.5 text-xs">
                      <p className="font-semibold text-slate-800">New application received</p>
                      <p className="text-slate-500 mt-0.5">Ravi Kumar applied for Electrician.</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">10 mins ago</span>
                    </div>
                    <div className="py-2.5 text-xs">
                      <p className="font-semibold text-slate-800">Interview reminder</p>
                      <p className="text-slate-500 mt-0.5">Siva Jothi tomorrow at 11:00 AM.</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">2 hours ago</span>
                    </div>
                    <div className="py-2.5 text-xs">
                      <p className="font-semibold text-emerald-600">Company verified</p>
                      <p className="text-slate-500 mt-0.5">Your organization documents were approved.</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">Yesterday</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar & Dropdown */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-[#0A192F] text-white font-bold text-xs flex items-center justify-center shadow-xs tracking-wider cursor-pointer">
                ABC
              </div>
              <ChevronDown className="w-4 h-4 text-slate-500 cursor-pointer hover:text-slate-800" />
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-4 sm:p-8 space-y-6 flex-1">
          {/* Greeting & Company Verification Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Good morning, ABC Industrial Services
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Here's what's happening with your recruitment today.
              </p>
            </div>

            {/* Verification Status Card */}
            <div className="flex items-center gap-3.5 bg-white border border-emerald-200 px-4 py-3 rounded-2xl shadow-xs">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 leading-tight">
                  Company Verified
                </h4>
                <p className="text-xs text-slate-500 leading-tight mt-0.5">
                  You can post and manage job listings.
                </p>
              </div>
            </div>
          </div>

          {/* Row 1: 4 Metric KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Active Jobs */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1976D2] flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                    Active Jobs
                  </span>
                  <div className="text-3xl font-black text-slate-900 mt-1">
                    8
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 mt-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+2</span>
                    <span className="text-slate-400 font-normal">vs last month</span>
                  </div>
                </div>
              </div>
            </div>

            {/* New Applicants */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                    New Applicants
                  </span>
                  <div className="text-3xl font-black text-slate-900 mt-1">
                    17
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 mt-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+6</span>
                    <span className="text-slate-400 font-normal">vs last week</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Applicants */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                  <UserCheck className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                    Total Applicants
                  </span>
                  <div className="text-3xl font-black text-slate-900 mt-1">
                    64
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 mt-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+18</span>
                    <span className="text-slate-400 font-normal">vs last month</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interviews Scheduled */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                    Interviews Scheduled
                  </span>
                  <div className="text-3xl font-black text-slate-900 mt-1">
                    4
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 mt-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+2</span>
                    <span className="text-slate-400 font-normal">vs last week</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: 3 Visual Analysis Cards (Trend, Roles, Status Donut) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart 1: Applications Trend Line Chart */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900">
                  Applications Trend
                </h3>
                <div className="relative">
                  <select
                    value={trendRange}
                    onChange={(e) => setTrendRange(e.target.value)}
                    className="appearance-none bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 py-1.5 pl-3 pr-7 focus:outline-none cursor-pointer"
                  >
                    <option>Last 7 days</option>
                    <option>Last 14 days</option>
                    <option>Last 30 days</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* High-Fidelity SVG Area & Line Graph */}
              <div className="h-44 w-full relative pt-2">
                <svg viewBox="0 0 340 140" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1976D2" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#1976D2" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Y Axis Grid Lines */}
                  {[0, 30, 60, 90, 120].map((yVal, i) => (
                    <g key={yVal}>
                      <line
                        x1="25"
                        y1={yVal}
                        x2="335"
                        y2={yVal}
                        stroke="#F1F5F9"
                        strokeDasharray="3 3"
                      />
                      <text
                        x="18"
                        y={yVal + 3}
                        fontSize="9"
                        fill="#94A3B8"
                        textAnchor="end"
                      >
                        {20 - i * 5}
                      </text>
                    </g>
                  ))}

                  {/* Path coordinates calculated for:
                      Oct 8 (5): y = 120 - (5/20)*120 = 90
                      Oct 9 (10): y = 120 - (10/20)*120 = 60
                      Oct 10 (8): y = 120 - (8/20)*120 = 72
                      Oct 11 (14): y = 120 - (14/20)*120 = 36
                      Oct 12 (8): y = 120 - (8/20)*120 = 72
                      Oct 13 (12): y = 120 - (12/20)*120 = 48
                      Oct 14 (18): y = 120 - (18/20)*120 = 12
                  */}
                  {/* Area fill */}
                  <path
                    d="M 30,90 C 50,75 60,60 80,60 C 100,60 110,72 130,72 C 150,72 160,36 180,36 C 200,36 210,72 230,72 C 250,72 260,48 280,48 C 300,48 310,12 330,12 L 330,120 L 30,120 Z"
                    fill="url(#trendGradient)"
                  />

                  {/* Line stroke */}
                  <path
                    d="M 30,90 C 50,75 60,60 80,60 C 100,60 110,72 130,72 C 150,72 160,36 180,36 C 200,36 210,72 230,72 C 250,72 260,48 280,48 C 300,48 310,12 330,12"
                    fill="none"
                    stroke="#1976D2"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  {/* Highlight dots on data points */}
                  {[
                    { cx: 30, cy: 90, val: 5 },
                    { cx: 80, cy: 60, val: 10 },
                    { cx: 130, cy: 72, val: 8 },
                    { cx: 180, cy: 36, val: 14 },
                    { cx: 230, cy: 72, val: 8 },
                    { cx: 280, cy: 48, val: 12 },
                    { cx: 330, cy: 12, val: 18 },
                  ].map((pt, idx) => (
                    <g key={idx} className="group cursor-pointer">
                      <circle
                        cx={pt.cx}
                        cy={pt.cy}
                        r="3.5"
                        fill="#1976D2"
                        className="transition-all group-hover:r-5"
                      />
                      <circle
                        cx={pt.cx}
                        cy={pt.cy}
                        r="6"
                        fill="#1976D2"
                        opacity="0.2"
                        className="transition-opacity group-hover:opacity-40"
                      />
                    </g>
                  ))}
                </svg>

                {/* X Axis Labels */}
                <div className="flex justify-between pl-6 text-[10px] text-slate-400 mt-2 font-medium">
                  {TREND_DATA.map((item) => (
                    <span key={item.date}>{item.date}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Chart 2: Applications by Job Role (Progress Bars) */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <h3 className="text-base font-bold text-slate-900 mb-4">
                Applications by Job Role
              </h3>

              <div className="space-y-3.5 my-auto">
                {ROLE_DISTRIBUTION.map((item) => (
                  <div key={item.role} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                      <span className="truncate max-w-[170px]">{item.role}</span>
                      <span className="text-slate-900 font-bold">{item.count}</span>
                    </div>
                    {/* Horizontal Bar */}
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${item.barColor}`}
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 3: Application Status (Donut Chart) */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <h3 className="text-base font-bold text-slate-900 mb-3">
                Application Status
              </h3>

              <div className="flex items-center justify-between gap-4 my-auto">
                {/* Donut Chart SVG */}
                <div className="relative w-36 h-36 flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    {/* Segments:
                        Total = 64
                        New = 28 (43.75%) -> Dasharray 43.75, 100
                        Under Review = 16 (25%) -> Dasharray 25, 100
                        Shortlisted = 10 (15.6%) -> Dasharray 15.6, 100
                        Interview = 6 (9.4%) -> Dasharray 9.4, 100
                        Rejected = 4 (6.25%) -> Dasharray 6.25, 100
                    */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#E2E8F0"
                      strokeWidth="14"
                    />
                    {/* New (Blue) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#1976D2"
                      strokeWidth="14"
                      strokeDasharray="104.5 238.8"
                      strokeDashoffset="0"
                    />
                    {/* Under Review (Amber) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#FFA000"
                      strokeWidth="14"
                      strokeDasharray="59.7 238.8"
                      strokeDashoffset="-104.5"
                    />
                    {/* Shortlisted (Green) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#10B981"
                      strokeWidth="14"
                      strokeDasharray="37.3 238.8"
                      strokeDashoffset="-164.2"
                    />
                    {/* Interview (Purple) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#8B5CF6"
                      strokeWidth="14"
                      strokeDasharray="22.4 238.8"
                      strokeDashoffset="-201.5"
                    />
                    {/* Rejected (Rose) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#EF4444"
                      strokeWidth="14"
                      strokeDasharray="14.9 238.8"
                      strokeDashoffset="-223.9"
                    />
                  </svg>
                  {/* Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-black text-slate-900 leading-none">64</span>
                    <span className="text-[11px] font-semibold text-slate-400 mt-0.5">Total</span>
                  </div>
                </div>

                {/* Legend list on the right */}
                <div className="space-y-1.5 text-xs flex-1">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#1976D2]" />
                      New
                    </span>
                    <span className="font-bold text-slate-800">28 (44%)</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FFA000]" />
                      Under Review
                    </span>
                    <span className="font-bold text-slate-800">16 (25%)</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                      Shortlisted
                    </span>
                    <span className="font-bold text-slate-800">10 (16%)</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
                      Interview
                    </span>
                    <span className="font-bold text-slate-800">6 (9%)</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                      Rejected
                    </span>
                    <span className="font-bold text-slate-800">4 (6%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: 2 Column Tables (Recent Applicants & Your Job Listings) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Table 1: Recent Applicants */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between overflow-hidden">
              <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Recent Applicants
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Latest candidates who applied for your job postings.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectSidebarTab('applicants')}
                  className="text-xs font-bold text-[#1976D2] hover:text-blue-700 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Applicants Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-5">Candidate</th>
                      <th className="py-3 px-4">Job Title</th>
                      <th className="py-3 px-4">Applied On</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applicantList.map((cand) => (
                      <tr
                        key={cand.id}
                        className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                        onClick={() => setSelectedApplicant(cand)}
                      >
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${cand.initialsColor}`}
                            >
                              {cand.initials}
                            </div>
                            <div>
                              <span className="font-bold text-slate-800 block text-xs group-hover:text-blue-600 transition-colors">
                                {cand.name}
                              </span>
                              <span className="text-[11px] text-slate-400 block">
                                {cand.location}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-700">
                          {cand.jobTitle}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                          {cand.appliedOn}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getApplicantBadgeClass(
                              cand.status
                            )}`}
                          >
                            {cand.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedApplicant(cand);
                            }}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 2: Your Job Listings */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between overflow-hidden">
              <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Your Job Listings
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Manage and track performance of your posted jobs.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCreateJobModalOpen(true)}
                  className="px-3.5 py-1.5 bg-[#1976D2] hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Create Job
                </button>
              </div>

              {/* Jobs Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-5">Job Title</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4 text-center">Applicants</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {jobList.map((job) => (
                      <tr key={job.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-5 font-bold text-slate-800">
                          {job.title}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                          {job.location}
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                          {job.applicants}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getJobBadgeClass(
                              job.status
                            )}`}
                          >
                            {job.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => alert(`Manage ${job.title}`)}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Row 4: Quick Actions Bar */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Quick Actions</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Common tasks to manage your recruitment.
                </p>
              </div>
            </div>

            {/* Quick Actions Action Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <button
                type="button"
                onClick={() => setCreateJobModalOpen(true)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50/60 hover:bg-blue-100/70 border border-blue-200/60 rounded-xl text-xs sm:text-sm font-bold text-[#1976D2] transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Create Job</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectSidebarTab('applicants')}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-700 transition-colors cursor-pointer"
              >
                <Users className="w-4 h-4 text-slate-500" />
                <span>View Applicants</span>
              </button>

              <button
                type="button"
                onClick={() => setScheduleInterviewModalOpen(true)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-700 transition-colors cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>Schedule Interview</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectSidebarTab('profile')}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-700 transition-colors cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-slate-500" />
                <span>Edit Company Profile</span>
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* MODAL 1: Create Job Modal */}
      {createJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#1976D2] flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Post a New Job</h3>
                  <p className="text-xs text-slate-500">ABC Industrial Services Employer Portal</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCreateJobModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  placeholder="e.g. CNC Machine Operator, Industrial Electrician"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Location / District
                  </label>
                  <select
                    value={newJobLocation}
                    onChange={(e) => setNewJobLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option>Thoothukudi, TN</option>
                    <option>Tirunelveli, TN</option>
                    <option>Madurai, TN</option>
                    <option>Chennai, TN</option>
                    <option>Coimbatore, TN</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Monthly Salary Range
                  </label>
                  <input
                    type="text"
                    value={newJobSalary}
                    onChange={(e) => setNewJobSalary(e.target.value)}
                    placeholder="e.g. ₹22,000 - ₹30,000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCreateJobModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#1976D2] hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Publish Job Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Candidate Details Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm ${selectedApplicant.initialsColor}`}
                >
                  {selectedApplicant.initials}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedApplicant.name}
                  </h3>
                  <p className="text-xs text-slate-500">{selectedApplicant.jobTitle}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApplicant(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-500">Status</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full font-bold border ${getApplicantBadgeClass(
                    selectedApplicant.status
                  )}`}
                >
                  {selectedApplicant.status}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{selectedApplicant.location}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>{selectedApplicant.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{selectedApplicant.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span>Education: {selectedApplicant.education}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  <span>Experience: {selectedApplicant.experience}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    alert(`Shortlisted ${selectedApplicant.name}`);
                    setSelectedApplicant(null);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Shortlist
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setScheduleInterviewModalOpen(true);
                    setSelectedApplicant(null);
                  }}
                  className="px-4 py-2 bg-[#1976D2] hover:bg-blue-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Schedule Interview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Schedule Interview Modal */}
      {scheduleInterviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Schedule Interview</h3>
                  <p className="text-xs text-slate-500">Set date & time for interview</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setScheduleInterviewModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Candidate</label>
                <select className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                  <option>Ravi Kumar - Electrician</option>
                  <option>Muthu Selvam - Maintenance Technician</option>
                  <option>Arun Prakash - Fitter</option>
                  <option>Siva Jothi - Machine Operator</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Interview Date & Time</label>
                <input
                  type="datetime-local"
                  defaultValue="2026-10-16T10:00"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Interview Mode</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5">
                    <input type="radio" name="mode" defaultChecked /> In-Person (Factory / Office)
                  </label>
                  <label className="flex items-center gap-1.5">
                    <input type="radio" name="mode" /> Phone / Video
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setScheduleInterviewModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert('Interview scheduled and invitation sent to candidate!');
                    setScheduleInterviewModalOpen(false);
                  }}
                  className="px-4 py-2 bg-[#1976D2] hover:bg-blue-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Send Invitation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
