import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  MapPin,
  Briefcase,
  IndianRupee,
  Calendar,
  FileText,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ExternalLink,
  ChevronDown,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Menu,
  Bell,
  X,
  FileCheck,
  Check,
  Building2,
  Sparkles,
  BookOpen,
  UserCheck,
  Eye,
  AlertTriangle
} from 'lucide-react';
import JobSeekerSidebar from './JobSeekerSidebar';
import api from '../services/api';

const mapBackendSeekerApp = (app) => {
  const job = app.jobListing || app.job_listing || {};
  const company = job.company || {};
  const district = job.district || {};

  const statusMap = {
    'applied': 'Under Review',
    'under_review': 'Under Review',
    'shortlisted': 'Shortlisted',
    'interview': 'Interview',
    'rejected': 'Rejected',
    'withdrawn': 'Withdrawn',
    'hired': 'Offer'
  };

  const stepMap = {
    'applied': 1,
    'under_review': 2,
    'shortlisted': 3,
    'interview': 4,
    'hired': 5,
    'rejected': 2,
    'withdrawn': 1
  };

  const companyName = company.company_name || 'Employer';
  const logoText = (companyName || 'CO').substring(0, 2).toUpperCase();

  const appliedDate = app.created_at
    ? new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Recently';

  let responsibilities = [];
  if (Array.isArray(job.responsibilities)) {
    responsibilities = job.responsibilities;
  } else if (job.requirements) {
    responsibilities = [job.requirements];
  } else {
    responsibilities = ['Perform assigned duties adhering to factory and engineering safety rules.'];
  }

  const salaryFormatted = job.salary_min
    ? `₹ ${Number(job.salary_min).toLocaleString('en-IN')} – ${Number(job.salary_max).toLocaleString('en-IN')}`
    : '₹ 18,000 – 25,000';

  return {
    id: app.id,
    jobId: app.job_listing_id,
    title: job.job_title || 'Applied Position',
    company: companyName,
    industry: company.industry || 'Industrial Services',
    location: district.name ? `${district.name}, TN` : (job.location || 'Tamil Nadu'),
    fullLocation: `${job.location || ''}${job.location && district.name ? ', ' : ''}${district.name || 'Tamil Nadu'}`,
    type: job.job_type || 'Full-time',
    salary: salaryFormatted,
    salaryMonthly: `${salaryFormatted}/month`,
    appliedDate: appliedDate,
    status: statusMap[app.status] || 'Under Review',
    currentStep: stepMap[app.status] || 2,
    logoText: logoText,
    logoBg: 'bg-[#0A192F]',
    logoColor: 'text-white',
    resumeName: 'my_resume.pdf',
    coverLetter: app.cover_note ? 'Submitted' : 'Not submitted',
    notes: app.status === 'withdrawn' ? 'Application withdrawn' : (app.status === 'interview' ? 'Interview scheduled' : '-'),
    description: job.description || 'Job application submitted successfully.',
    responsibilities: responsibilities
  };
};

export default function JobSeekerApplications({
  onLogout,
  onNavigateTab,
  onNavigateHome
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Filter States
  const [activeStatusTab, setActiveStatusTab] = useState('All'); // 'All', 'Under Review', 'Shortlisted', 'Interview', 'Rejected', 'Withdrawn'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusDropdown, setStatusDropdown] = useState('All');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [dateDropdown, setDateDropdown] = useState('All');
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [viewDetailsModal, setViewDetailsModal] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Live applications from API
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppId, setSelectedAppId] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        const res = await api.getApplications();
        const list = res.data || res.applications || [];
        if (isMounted) {
          const mapped = list.map(mapBackendSeekerApp);
          setApplications(mapped);
          if (mapped.length > 0) {
            setSelectedAppId(mapped[0].id);
          } else {
            setSelectedAppId(null);
          }
        }
      } catch (err) {
        console.error('Failed to load seeker applications:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchApplications();
    return () => { isMounted = false; };
  }, []);

  const activeApp = useMemo(() => {
    if (!applications || applications.length === 0) return null;
    return applications.find((a) => a.id === selectedAppId) || applications[0];
  }, [applications, selectedAppId]);

  // Counts for Ribbon
  const counts = useMemo(() => {
    return {
      all: applications.length,
      underReview: applications.filter((a) => a.status === 'Under Review').length,
      shortlisted: applications.filter((a) => a.status === 'Shortlisted').length,
      interview: applications.filter((a) => a.status.toLowerCase().includes('interview')).length,
      rejected: applications.filter((a) => a.status === 'Rejected').length,
      withdrawn: applications.filter((a) => a.status === 'Withdrawn').length
    };
  }, [applications]);

  // Handle Withdraw Application
  const handleConfirmWithdraw = async () => {
    if (!activeApp) return;
    try {
      await api.withdrawApplication(activeApp.id);
      setApplications((prev) =>
        prev.map((app) =>
          app.id === activeApp.id
            ? {
                ...app,
                status: 'Withdrawn',
                currentStep: 1,
                notes: `Application withdrawn by candidate on ${new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}`
              }
            : app
        )
      );
      setWithdrawModalOpen(false);
      showToast(`Withdrew application for ${activeApp.title} at ${activeApp.company}`);
    } catch (err) {
      console.error('Failed to withdraw application:', err);
      setApplications((prev) =>
        prev.map((app) =>
          app.id === activeApp.id
            ? { ...app, status: 'Withdrawn', currentStep: 1, notes: 'Application withdrawn' }
            : app
        )
      );
      setWithdrawModalOpen(false);
      showToast(`Withdrew application for ${activeApp.title}`);
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setActiveStatusTab('All');
    setSearchQuery('');
    setStatusDropdown('All');
    setDateDropdown('All');
    showToast('Filters reset');
  };

  // Filtered Applications
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      // Ribbon filter
      let matchesRibbon = true;
      if (activeStatusTab === 'Under Review') matchesRibbon = app.status === 'Under Review';
      else if (activeStatusTab === 'Shortlisted') matchesRibbon = app.status === 'Shortlisted';
      else if (activeStatusTab === 'Interview') matchesRibbon = app.status.toLowerCase().includes('interview');
      else if (activeStatusTab === 'Rejected') matchesRibbon = app.status === 'Rejected';
      else if (activeStatusTab === 'Withdrawn') matchesRibbon = app.status === 'Withdrawn';

      // Dropdown status filter
      let matchesStatus = true;
      if (statusDropdown !== 'All') {
        matchesStatus = app.status.toLowerCase().includes(statusDropdown.toLowerCase());
      }

      // Keyword query
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        app.title.toLowerCase().includes(q) ||
        app.company.toLowerCase().includes(q) ||
        app.location.toLowerCase().includes(q);

      return matchesRibbon && matchesStatus && matchesQuery;
    });
  }, [applications, activeStatusTab, statusDropdown, searchQuery]);

  // Status Pill Helper
  const renderStatusPill = (status) => {
    switch (status) {
      case 'Under Review':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200">
            Under Review
          </span>
        );
      case 'Shortlisted':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
            Shortlisted
          </span>
        );
      case 'Interview Scheduled':
      case 'Interview':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200">
            Interview Scheduled
          </span>
        );
      case 'Rejected':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200">
            Rejected
          </span>
        );
      case 'Withdrawn':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200">
            Withdrawn
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans antialiased text-slate-800">
      {/* Job Seeker Sidebar with 'applications' active tab */}
      <JobSeekerSidebar
        activeTab="applications"
        onSelectTab={(tab) => {
          if (onNavigateTab) onNavigateTab(tab);
        }}
        onLogout={onLogout}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
        {/* Top Header Navbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Top Search Input */}
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                placeholder="Search jobs, companies or skills..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Right Header: Notification & User Avatar */}
          <div className="flex items-center gap-3 sm:gap-4 relative">
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="relative p-2.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
              </button>

              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
                    <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      2 Unread
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100 text-xs mt-2">
                    <div className="py-2.5 flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                      <div>
                        <p className="text-slate-800 font-medium">
                          Application shortlisted by <span className="font-semibold text-slate-900">BlueKite Software</span>
                        </p>
                        <span className="text-slate-400 text-[10px] block mt-0.5">2 days ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-1.5 p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-[#0A192F] text-white flex items-center justify-center font-bold text-sm tracking-wide shadow-xs">
                  KR
                </div>
                <ChevronDown className="w-4 h-4 text-slate-600" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="font-bold text-slate-900">Kavin Raj</p>
                    <p className="text-slate-500 truncate">kavin.raj@gmail.com</p>
                  </div>
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => onNavigateTab && onNavigateTab('dashboard')}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50"
                    >
                      Dashboard
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigateTab && onNavigateTab('find-jobs')}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50"
                    >
                      Find Jobs
                    </button>
                    <button
                      type="button"
                      onClick={() => onLogout && onLogout()}
                      className="w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 font-semibold"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto space-y-6">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-medium animate-in fade-in slide-in-from-bottom-3 duration-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Heading */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              My Applications
            </h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1">
              Track the status of your job applications.
            </p>
          </div>

          {/* Status KPI Ribbon (6 Cards Across) matching Screenshot */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {/* Card 1: All */}
            <div
              onClick={() => setActiveStatusTab('All')}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                activeStatusTab === 'All'
                  ? 'border-[#1976D2] bg-blue-50/50 shadow-xs ring-1 ring-blue-500/20'
                  : 'bg-white border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#1976D2] flex items-center justify-center flex-shrink-0">
                <FileCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <p className={`text-xs font-semibold ${activeStatusTab === 'All' ? 'text-blue-700' : 'text-slate-500'}`}>
                  All
                </p>
                <p className="text-xl font-extrabold text-slate-900 leading-tight">
                  {counts.all}
                </p>
              </div>
            </div>

            {/* Card 2: Under Review */}
            <div
              onClick={() => setActiveStatusTab('Under Review')}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                activeStatusTab === 'Under Review'
                  ? 'border-amber-500 bg-amber-50/50 shadow-xs ring-1 ring-amber-500/20'
                  : 'bg-white border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <p className={`text-xs font-semibold ${activeStatusTab === 'Under Review' ? 'text-amber-800' : 'text-slate-500'}`}>
                  Under Review
                </p>
                <p className="text-xl font-extrabold text-slate-900 leading-tight">
                  {counts.underReview}
                </p>
              </div>
            </div>

            {/* Card 3: Shortlisted */}
            <div
              onClick={() => setActiveStatusTab('Shortlisted')}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                activeStatusTab === 'Shortlisted'
                  ? 'border-emerald-500 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-500/20'
                  : 'bg-white border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <p className={`text-xs font-semibold ${activeStatusTab === 'Shortlisted' ? 'text-emerald-800' : 'text-slate-500'}`}>
                  Shortlisted
                </p>
                <p className="text-xl font-extrabold text-slate-900 leading-tight">
                  {counts.shortlisted}
                </p>
              </div>
            </div>

            {/* Card 4: Interview */}
            <div
              onClick={() => setActiveStatusTab('Interview')}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                activeStatusTab === 'Interview'
                  ? 'border-purple-500 bg-purple-50/50 shadow-xs ring-1 ring-purple-500/20'
                  : 'bg-white border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
                <UserCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <p className={`text-xs font-semibold ${activeStatusTab === 'Interview' ? 'text-purple-800' : 'text-slate-500'}`}>
                  Interview
                </p>
                <p className="text-xl font-extrabold text-slate-900 leading-tight">
                  {counts.interview}
                </p>
              </div>
            </div>

            {/* Card 5: Rejected */}
            <div
              onClick={() => setActiveStatusTab('Rejected')}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                activeStatusTab === 'Rejected'
                  ? 'border-rose-500 bg-rose-50/50 shadow-xs ring-1 ring-rose-500/20'
                  : 'bg-white border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <p className={`text-xs font-semibold ${activeStatusTab === 'Rejected' ? 'text-rose-800' : 'text-slate-500'}`}>
                  Rejected
                </p>
                <p className="text-xl font-extrabold text-slate-900 leading-tight">
                  {counts.rejected}
                </p>
              </div>
            </div>

            {/* Card 6: Withdrawn */}
            <div
              onClick={() => setActiveStatusTab('Withdrawn')}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                activeStatusTab === 'Withdrawn'
                  ? 'border-slate-500 bg-slate-100 shadow-xs ring-1 ring-slate-500/20'
                  : 'bg-white border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0">
                <RotateCcw className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <p className={`text-xs font-semibold ${activeStatusTab === 'Withdrawn' ? 'text-slate-800' : 'text-slate-500'}`}>
                  Withdrawn
                </p>
                <p className="text-xl font-extrabold text-slate-900 leading-tight">
                  {counts.withdrawn}
                </p>
              </div>
            </div>
          </div>

          {/* Filter Toolbar matching Screenshot */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex-1 flex items-center gap-3 px-3 py-1">
              <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by job title or company..."
                className="w-full text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
              />
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              {/* All Status Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                  className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white transition-colors cursor-pointer"
                >
                  <span>{statusDropdown === 'All' ? 'All Status' : statusDropdown}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {statusDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-40 text-xs">
                    {['All', 'Under Review', 'Shortlisted', 'Interview', 'Rejected', 'Withdrawn'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setStatusDropdown(s);
                          setStatusDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg font-medium ${
                          statusDropdown === s ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50'
                        }`}
                      >
                        {s === 'All' ? 'All Status' : s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Applied Date Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
                  className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white transition-colors cursor-pointer"
                >
                  <span>{dateDropdown === 'All' ? 'Applied Date' : dateDropdown}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {dateDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-40 text-xs">
                    {['All', 'Last 7 Days', 'Last 30 Days', 'September 2026', 'October 2026'].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => {
                          setDateDropdown(d);
                          setDateDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg font-medium ${
                          dateDropdown === d ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50'
                        }`}
                      >
                        {d === 'All' ? 'Applied Date (All)' : d}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Reset Button */}
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Master-Detail 2-Column Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: List of Application Cards (7 Cols) */}
            <div className="lg:col-span-7 space-y-3.5">
              {filteredApplications.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                  <p className="font-bold text-slate-700">No applications match your filter.</p>
                  <p className="text-xs text-slate-500 mt-1">Try resetting the status filter.</p>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                filteredApplications.map((app) => {
                  const isSelected = app.id === selectedAppId;
                  return (
                    <div
                      key={app.id}
                      onClick={() => setSelectedAppId(app.id)}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer bg-white ${
                        isSelected
                          ? 'border-[#1976D2] ring-2 ring-blue-500/20 shadow-sm'
                          : 'border-slate-200/80 hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* Left Job Info */}
                        <div className="flex items-start gap-4">
                          {/* Logo */}
                          {app.logoIcon === 'book' ? (
                            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0 text-amber-700 shadow-2xs">
                              <BookOpen className="w-6 h-6 stroke-[2]" />
                            </div>
                          ) : app.logoType === 'swirl' ? (
                            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center flex-shrink-0 text-rose-500 shadow-2xs">
                              <Sparkles className="w-6 h-6 stroke-[2]" />
                            </div>
                          ) : (
                            <div
                              className={`w-12 h-12 rounded-xl ${app.logoBg} ${app.logoColor} flex items-center justify-center font-black text-sm tracking-wide flex-shrink-0 shadow-2xs`}
                            >
                              {app.logoText}
                            </div>
                          )}

                          <div className="min-w-0">
                            <h3 className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors">
                              {app.title}
                            </h3>
                            <p className="text-sm font-medium text-slate-500 mt-0.5">
                              {app.company}
                            </p>

                            <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 mt-2 text-xs text-slate-600">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                <span>{app.location}</span>
                              </span>
                              <span className="flex items-center gap-1">
                                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                                <span>{app.type}</span>
                              </span>
                              <span className="flex items-center gap-1 font-semibold text-slate-700">
                                <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                                <span>{app.salary.replace('₹ ', '')}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Date, Status Pill, Chevron */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex-shrink-0">
                          <span className="text-xs text-slate-400 font-medium">
                            Applied on {app.appliedDate}
                          </span>

                          <div className="flex items-center gap-2">
                            {renderStatusPill(app.status)}
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                                isSelected
                                  ? 'bg-blue-50 text-blue-600'
                                  : 'text-slate-400 hover:text-slate-600'
                              }`}
                            >
                              <ChevronRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200/80">
                <span className="text-xs text-slate-500 font-medium">
                  Showing 1 to 6 of 8 applications
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentPage(1)}
                    className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center transition-colors cursor-pointer ${
                      currentPage === 1
                        ? 'bg-[#1976D2] text-white shadow-xs'
                        : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    1
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentPage(2)}
                    className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center transition-colors cursor-pointer ${
                      currentPage === 2
                        ? 'bg-[#1976D2] text-white shadow-xs'
                        : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    2
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(2, p + 1))}
                    className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Application Details & Timeline Stepper (5 Cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-6 sticky top-20">
              {activeApp ? (
                <>

              {/* Header with Company Logo & Status Pill */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  {activeApp.logoIcon === 'book' ? (
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0 text-amber-700 shadow-2xs">
                      <BookOpen className="w-7 h-7 stroke-[2]" />
                    </div>
                  ) : activeApp.logoType === 'swirl' ? (
                    <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center flex-shrink-0 text-rose-500 shadow-2xs">
                      <Sparkles className="w-7 h-7 stroke-[2]" />
                    </div>
                  ) : (
                    <div
                      className={`w-14 h-14 rounded-2xl ${activeApp.logoBg} ${activeApp.logoColor} flex items-center justify-center font-black text-base tracking-wide flex-shrink-0 shadow-2xs`}
                    >
                      {activeApp.logoText}
                    </div>
                  )}

                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      {activeApp.company}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {activeApp.industry}
                    </p>
                  </div>
                </div>

                {renderStatusPill(activeApp.status)}
              </div>

              {/* Job Title & Meta */}
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  {activeApp.title}
                </h2>

                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-2.5 text-xs text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{activeApp.fullLocation}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    <span>{activeApp.type}</span>
                  </span>
                </div>

                <div className="mt-2 text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                  <span>{activeApp.salaryMonthly}</span>
                </div>
              </div>

              {/* Status Timeline / Stepper matching Screenshot */}
              <div className="pt-2">
                <div className="relative flex items-center justify-between">
                  {/* Connecting Line */}
                  <div className="absolute top-1/2 left-3 right-3 -translate-y-1/2 h-0.5 bg-slate-200 z-0" />
                  <div
                    className="absolute top-1/2 left-3 -translate-y-1/2 h-0.5 bg-[#1976D2] z-0 transition-all duration-300"
                    style={{
                      width:
                        activeApp.currentStep === 1
                          ? '0%'
                          : activeApp.currentStep === 2
                          ? '25%'
                          : activeApp.currentStep === 3
                          ? '50%'
                          : activeApp.currentStep === 4
                          ? '75%'
                          : '100%'
                    }}
                  />

                  {/* 5 Steps: Applied, Under Review, Shortlisted, Interview, Offer */}
                  {[
                    { label: 'Applied', sub: activeApp.appliedDate.split(',')[0], step: 1 },
                    { label: 'Under Review', sub: '', step: 2 },
                    { label: 'Shortlisted', sub: '', step: 3 },
                    { label: 'Interview', sub: '', step: 4 },
                    { label: 'Offer', sub: '', step: 5 }
                  ].map((s) => {
                    const isPassedOrCurrent = s.step <= activeApp.currentStep;
                    const isCurrent = s.step === activeApp.currentStep;
                    return (
                      <div key={s.label} className="relative z-10 flex flex-col items-center">
                        <div
                          className={`w-4 h-4 rounded-full transition-colors flex items-center justify-center ring-4 ring-white ${
                            isCurrent
                              ? 'bg-[#1976D2]'
                              : isPassedOrCurrent
                              ? 'bg-[#1976D2]'
                              : 'bg-slate-300'
                          }`}
                        />
                        <span
                          className={`text-[10px] sm:text-[11px] font-semibold mt-2.5 text-center ${
                            isCurrent
                              ? 'text-slate-900 font-bold'
                              : isPassedOrCurrent
                              ? 'text-slate-700'
                              : 'text-slate-400'
                          }`}
                        >
                          {s.label}
                        </span>
                        {s.sub && (
                          <span className="text-[9px] text-slate-400 block -mt-0.5">
                            {s.sub}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Application Details Section matching Screenshot */}
              <div className="pt-4 border-t border-slate-100 space-y-3.5">
                <h4 className="text-sm font-bold text-slate-900">
                  Application Details
                </h4>

                <div className="space-y-3 text-xs">
                  {/* Applied Date */}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-500">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>Applied Date</span>
                    </span>
                    <span className="font-semibold text-slate-900">
                      {activeApp.appliedDate}
                    </span>
                  </div>

                  {/* Resume */}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-500">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span>Resume</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setResumeModalOpen(true)}
                      className="font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <span>{activeApp.resumeName}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Cover Letter */}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-500">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span>Cover Letter</span>
                    </span>
                    <span className="text-slate-500 font-medium">
                      {activeApp.coverLetter}
                    </span>
                  </div>

                  {/* Additional Notes */}
                  <div className="flex items-start justify-between">
                    <span className="flex items-center gap-2 text-slate-500">
                      <MessageSquare className="w-4 h-4 text-slate-400 mt-0.5" />
                      <span>Additional Notes</span>
                    </span>
                    <span className="text-slate-600 font-medium text-right max-w-[200px]">
                      {activeApp.notes}
                    </span>
                  </div>
                </div>
              </div>

                {/* Bottom Buttons matching Screenshot */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setViewDetailsModal(true)}
                    className="flex-1 py-3 px-4 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-50 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View Job Details</span>
                  </button>

                  {activeApp.status !== 'Withdrawn' && activeApp.status !== 'Rejected' ? (
                    <button
                      type="button"
                      onClick={() => setWithdrawModalOpen(true)}
                      className="flex-1 py-3 px-4 rounded-xl border border-red-500 text-red-600 hover:bg-red-50 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4 stroke-[2.5]" />
                      <span>Withdraw Application</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-400 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 bg-slate-50 cursor-not-allowed"
                    >
                      <span>{activeApp.status === 'Withdrawn' ? 'Withdrawn' : 'Closed'}</span>
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="py-16 text-center text-slate-400">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#1976D2]" />
                <h4 className="font-bold text-slate-700 text-sm">No Application Selected</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Select an application from the list on the left to track its interview schedule and review details.
                </p>
              </div>
            )}
            </div>
          </div>
        </main>
      </div>

      {/* Withdraw Confirmation Modal */}
      {withdrawModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 text-center">
              Withdraw Application?
            </h3>
            <p className="text-xs text-slate-500 text-center mt-2 leading-relaxed">
              Are you sure you want to withdraw your application for{' '}
              <span className="font-bold text-slate-800">{activeApp.title}</span> at{' '}
              <span className="font-bold text-slate-800">{activeApp.company}</span>? The hiring team will be notified and your submission will be archived.
            </p>

            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setWithdrawModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
              >
                Keep Application
              </button>
              <button
                type="button"
                onClick={handleConfirmWithdraw}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs"
              >
                Yes, Withdraw
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Job Details Modal */}
      {viewDetailsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900">
                {activeApp.title}
              </h3>
              <button
                type="button"
                onClick={() => setViewDetailsModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900">{activeApp.company}</h4>
                  <p className="text-xs text-slate-500">{activeApp.fullLocation} • {activeApp.type}</p>
                </div>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl">
                  {activeApp.salaryMonthly}
                </span>
              </div>

              <div>
                <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                  Job Description
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {activeApp.description}
                </p>
              </div>

              {activeApp.responsibilities && (
                <div>
                  <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                    Responsibilities
                  </h5>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {activeApp.responsibilities.map((r, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-slate-400 font-bold">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4 mt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setViewDetailsModal(false)}
                className="px-5 py-2 text-xs font-bold text-white bg-[#1976D2] hover:bg-[#1565C0] rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resume Preview Modal */}
      {resumeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900">
                  {activeApp.resumeName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setResumeModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-5 p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-bold">Kavin Raj</span>
                <span className="text-emerald-600 font-semibold">Verified Resume v2.4</span>
              </div>
              <p><span className="font-semibold text-slate-900">Education:</span> Diploma in Electrical & Electronics Engineering (2024)</p>
              <p><span className="font-semibold text-slate-900">Skills:</span> PLC Automation, Industrial Wiring, Circuit Troubleshooting, Safety Protocol</p>
              <p><span className="font-semibold text-slate-900">Experience:</span> 2 years as Junior Maintenance Technician</p>
              <p><span className="font-semibold text-slate-900">Contact:</span> kavin.raj@gmail.com | +91 98765 43210</p>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  showToast('Resume downloaded successfully!');
                  setResumeModalOpen(false);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-[#1976D2] hover:bg-[#1565C0] rounded-xl"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
