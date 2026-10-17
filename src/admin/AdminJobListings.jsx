import React, { useState } from 'react';
import {
  Search,
  Calendar,
  Bell,
  ChevronDown,
  Menu,
  Briefcase,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Download,
  Plus,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Eye,
  Check,
  X,
  MoreVertical,
  Building2,
  MapPin,
  Globe,
  GraduationCap,
  Users,
  DollarSign,
  Tag,
  Edit2,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import AdminSidebar from './AdminSidebar';

// Complete Jobs Data
const INITIAL_JOBS = [];

export default function AdminJobListings({ onLogout, onNavigateHome, onNavigateTab }) {
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [selectedJob, setSelectedJob] = useState(null);

  React.useEffect(() => {
    fetch('http://127.0.0.1:8000/api/jobs')
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          const mapped = data.data.map(j => ({
            id: j.id,
            title: j.title,
            company: j.company?.company_name || 'Direct Employer',
            companyLogoBg: 'bg-slate-900 text-white font-black',
            companyLogoText: (j.company?.company_name || 'DE').slice(0, 2).toUpperCase(),
            location: j.location || (j.district ? `${j.district.name}, Tamil Nadu` : 'Tamil Nadu'),
            district: j.district?.name || 'Thoothukudi',
            jobType: j.job_type || 'Full-time',
            vacancies: j.openings || 1,
            status: j.status === 'active' ? 'Active' : 'Closed',
            postedTimeAgo: 'Recently',
            postedDate: new Date(j.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            salary: j.min_salary && j.max_salary ? `₹${Number(j.min_salary).toLocaleString()} - ₹${Number(j.max_salary).toLocaleString()}` : 'Negotiable',
            experience: j.experience || '1 - 3 Years',
            qualification: 'Relevant Trade Qualification',
            category: j.category?.name || 'Technical Trades',
            website: j.company?.website || 'www.company.in',
            description: j.description || '',
            skills: j.requirements || ['Safety Compliance', 'Technical Aptitude'],
          }));
          setJobs(mapped);
          if (mapped.length > 0) setSelectedJob(mapped[0]);
        }
      })
      .catch(err => console.warn('Could not fetch jobs:', err));
  }, []);
  const [showDetailPanel, setShowDetailPanel] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  // Filter States
  const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Active', 'Pending Review', 'Rejected', 'Closed'
  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [detailTab, setDetailTab] = useState('Overview');

  // Header States
  const [dateRange, setDateRange] = useState('Oct 01, 2026 - Oct 31, 2026');
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Modal State for + Add Job
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    company: 'ABC Industrial Services',
    location: 'Thoothukudi, Tamil Nadu',
    district: 'Thoothukudi',
    jobType: 'Full-time',
    vacancies: 2,
    salary: '₹20,000 - ₹30,000',
    experience: '1 - 3 Years',
    qualification: 'ITI / Diploma',
    category: 'Electrical & Electronics',
    description: '',
    skills: 'Troubleshooting, Maintenance, Safety Compliance',
  });

  // Action Handlers
  const handleApproveJob = (id, e) => {
    if (e) e.stopPropagation();
    const updated = jobs.map((j) => (j.id === id ? { ...j, status: 'Active' } : j));
    setJobs(updated);
    if (selectedJob?.id === id) {
      setSelectedJob({ ...selectedJob, status: 'Active' });
    }
  };

  const handleRejectJob = (id, e) => {
    if (e) e.stopPropagation();
    const updated = jobs.map((j) => (j.id === id ? { ...j, status: 'Rejected' } : j));
    setJobs(updated);
    if (selectedJob?.id === id) {
      setSelectedJob({ ...selectedJob, status: 'Rejected' });
    }
  };

  const handleCreateJob = (e) => {
    e.preventDefault();
    if (!newJob.title || !newJob.company) {
      alert('Please fill out Job Title and Company.');
      return;
    }

    const created = {
      id: Date.now(),
      title: newJob.title,
      company: newJob.company,
      companyLogoBg: 'bg-slate-900 text-white font-bold',
      companyLogoText: newJob.company.slice(0, 3).toLowerCase(),
      location: newJob.location,
      district: newJob.district,
      jobType: newJob.jobType,
      vacancies: Number(newJob.vacancies) || 1,
      status: 'Pending Review',
      postedTimeAgo: 'Just now',
      postedDate: 'Oct 14, 2026',
      salary: newJob.salary,
      experience: newJob.experience,
      qualification: newJob.qualification,
      category: newJob.category,
      website: 'www.starkjobs.com',
      description: newJob.description || 'Newly posted job requiring administrative review and approval.',
      skills: newJob.skills.split(',').map((s) => s.trim()),
    };

    setJobs([created, ...jobs]);
    setSelectedJob(created);
    setShowDetailPanel(true);
    setIsAddModalOpen(false);
    setNewJob({
      title: '',
      company: 'ABC Industrial Services',
      location: 'Thoothukudi, Tamil Nadu',
      district: 'Thoothukudi',
      jobType: 'Full-time',
      vacancies: 2,
      salary: '₹20,000 - ₹30,000',
      experience: '1 - 3 Years',
      qualification: 'ITI / Diploma',
      category: 'Electrical & Electronics',
      description: '',
      skills: 'Troubleshooting, Maintenance, Safety Compliance',
    });
  };

  // Filter Logic
  const filteredJobs = jobs.filter((j) => {
    if (statusFilter !== 'All' && j.status !== statusFilter) {
      return false;
    }
    if (districtFilter !== 'All' && j.district !== districtFilter) {
      return false;
    }
    if (categoryFilter !== 'All' && j.category !== categoryFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q) ||
        j.category.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-100 text-emerald-700';
      case 'Pending Review':
        return 'bg-amber-100 text-amber-700';
      case 'Rejected':
        return 'bg-rose-100 text-rose-700';
      case 'Closed':
        return 'bg-slate-100 text-slate-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6FA] flex font-sans">
      
      {/* ============================================================== */}
      {/* 1. SEPARATE REUSABLE SIDEBAR COMPONENT (activeTab='jobs')       */}
      {/* ============================================================== */}
      <AdminSidebar
        activeTab="jobs"
        onSelectTab={(tabId) => {
          if (onNavigateTab) {
            onNavigateTab(tabId);
          } else if (tabId === 'dashboard') {
            window.location.pathname = '/admin-dashboard';
          } else if (tabId === 'job-seekers') {
            window.location.pathname = '/admin/job-seekers';
          } else if (tabId === 'companies') {
            window.location.pathname = '/admin/companies';
          }
        }}
        onLogout={onLogout || onNavigateHome}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* ============================================================== */}
      {/* 2. MAIN CONTENT AREA                                           */}
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
                placeholder="Search jobs, companies, keywords..."
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* Right: Date Picker, Notifications, User Profile */}
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
              onClick={() => alert('You have 5 new pending job postings to review.')}
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
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#1A365D] text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-sm">
                  SA
                </div>
                <span className="hidden sm:inline-block text-xs font-semibold text-slate-700">
                  Super Admin
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
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

        {/* ----------------- MAIN SCROLLABLE CONTENT ----------------- */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Header Title + Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block mb-1">
                MANAGE JOB LISTINGS
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                Job Listings
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Track, review and manage all job postings on the platform.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Export Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors shadow-2xs cursor-pointer"
                >
                  <Download className="w-4 h-4 text-slate-500" />
                  <span>Export</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {exportDropdownOpen && (
                  <div
                    className="absolute right-0 top-12 w-40 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-20 animate-fadeIn"
                    onMouseLeave={() => setExportDropdownOpen(false)}
                  >
                    <button
                      onClick={() => { alert('Exported as CSV'); setExportDropdownOpen(false); }}
                      className="w-full text-left px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      Export as CSV
                    </button>
                    <button
                      onClick={() => { alert('Exported as Excel'); setExportDropdownOpen(false); }}
                      className="w-full text-left px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      Export as Excel
                    </button>
                    <button
                      onClick={() => { alert('Exported as PDF'); setExportDropdownOpen(false); }}
                      className="w-full text-left px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      Export as PDF
                    </button>
                  </div>
                )}
              </div>

              {/* Add Job Button */}
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1976D2] hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer active:scale-[0.98]"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Add Job</span>
              </button>
            </div>
          </div>

          {/* ============================================================== */}
          {/* ROW 1: 5 STAT METRIC CARDS                                     */}
          {/* ============================================================== */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
            
            {/* 1. Total Jobs */}
            <div 
              onClick={() => setStatusFilter('All')}
              className={`bg-white rounded-2xl p-4 border transition-all duration-200 cursor-pointer shadow-xs flex items-center gap-3.5 ${
                statusFilter === 'All' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-slate-500 block truncate">Total Jobs</span>
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none mt-0.5">
                  428
                </div>
                <span className="text-[11px] font-bold text-emerald-600 block mt-1">↗ +12% vs last month</span>
              </div>
            </div>

            {/* 2. Active */}
            <div
              onClick={() => setStatusFilter('Active')}
              className={`bg-white rounded-2xl p-4 border transition-all duration-200 cursor-pointer shadow-xs flex items-center gap-3.5 ${
                statusFilter === 'Active' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200/80 hover:border-emerald-300'
              }`}
            >
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-slate-500 block truncate">Active</span>
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none mt-0.5">
                  312
                </div>
                <span className="text-[11px] font-medium text-slate-400 block mt-1">73% of total</span>
              </div>
            </div>

            {/* 3. Pending Review */}
            <div
              onClick={() => setStatusFilter('Pending Review')}
              className={`bg-white rounded-2xl p-4 border transition-all duration-200 cursor-pointer shadow-xs flex items-center gap-3.5 ${
                statusFilter === 'Pending Review' ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200/80 hover:border-amber-300'
              }`}
            >
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-slate-500 block truncate">Pending Review</span>
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none mt-0.5">
                  46
                </div>
                <span className="text-[11px] font-medium text-amber-600 block mt-1">11% of total</span>
              </div>
            </div>

            {/* 4. Rejected */}
            <div
              onClick={() => setStatusFilter('Rejected')}
              className={`bg-white rounded-2xl p-4 border transition-all duration-200 cursor-pointer shadow-xs flex items-center gap-3.5 ${
                statusFilter === 'Rejected' ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-slate-200/80 hover:border-rose-300'
              }`}
            >
              <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
                <XCircle className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-slate-500 block truncate">Rejected</span>
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none mt-0.5">
                  42
                </div>
                <span className="text-[11px] font-medium text-slate-400 block mt-1">10% of total</span>
              </div>
            </div>

            {/* 5. Closed / Expired */}
            <div
              onClick={() => setStatusFilter('Closed')}
              className={`bg-white rounded-2xl p-4 border transition-all duration-200 cursor-pointer shadow-xs flex items-center gap-3.5 col-span-2 sm:col-span-1 ${
                statusFilter === 'Closed' ? 'border-slate-700 ring-2 ring-slate-700/20' : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-slate-500 block truncate">Closed / Expired</span>
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none mt-0.5">
                  28
                </div>
                <span className="text-[11px] font-medium text-slate-400 block mt-1">6% of total</span>
              </div>
            </div>

          </div>

          {/* ============================================================== */}
          {/* ROW 2: STATUS FILTER PILLS & SEARCH / CONTROLS                 */}
          {/* ============================================================== */}
          <div className="space-y-3">
            
            {/* Filter Pills row + View Mode */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStatusFilter('All')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    statusFilter === 'All'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>All Jobs</span>
                  <span className={statusFilter === 'All' ? 'opacity-90' : 'text-slate-400'}>428</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatusFilter('Active')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    statusFilter === 'Active'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-100/70 text-emerald-700 hover:bg-emerald-200/60'
                  }`}
                >
                  <span>Active</span>
                  <span>312</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatusFilter('Pending Review')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    statusFilter === 'Pending Review'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-amber-100/70 text-amber-700 hover:bg-amber-200/60'
                  }`}
                >
                  <span>Pending Review</span>
                  <span>46</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatusFilter('Rejected')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    statusFilter === 'Rejected'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-rose-100/70 text-rose-700 hover:bg-rose-200/60'
                  }`}
                >
                  <span>Rejected</span>
                  <span>42</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatusFilter('Closed')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    statusFilter === 'Closed'
                      ? 'bg-slate-800 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/60'
                  }`}
                >
                  <span>Closed</span>
                  <span>28</span>
                </button>
              </div>

              {/* View Switcher: Grid vs List */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-white text-slate-800 shadow-2xs font-bold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Grid</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      viewMode === 'list'
                        ? 'bg-white text-slate-800 shadow-2xs font-bold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                    <span>Table</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('All');
                    setDistrictFilter('All');
                    setCategoryFilter('All');
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors shadow-2xs cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                  <span>Reset Filters</span>
                </button>
              </div>
            </div>

            {/* Search + District + Category Bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search job title, company name or skills..."
                  className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 hidden sm:block">District</span>
                <select
                  value={districtFilter}
                  onChange={(e) => setDistrictFilter(e.target.value)}
                  className="bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white cursor-pointer"
                >
                  <option value="All">All Districts</option>
                  <option value="Thoothukudi">Thoothukudi</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Tirunelveli">Tirunelveli</option>
                  <option value="Madurai">Madurai</option>
                  <option value="Coimbatore">Coimbatore</option>
                  <option value="Salem">Salem</option>
                  <option value="Trichy">Trichy</option>
                </select>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 hidden sm:block">Category</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  <option value="Electrical & Electronics">Electrical & Electronics</option>
                  <option value="Construction & Civil">Construction & Civil</option>
                  <option value="Software & IT">Software & IT</option>
                  <option value="Manufacturing & Trades">Manufacturing & Trades</option>
                  <option value="Finance & Accounting">Finance & Accounting</option>
                  <option value="Sales & Marketing">Sales & Marketing</option>
                </select>
              </div>
            </div>

          </div>

          {/* ============================================================== */}
          {/* ROW 3: SPACIOUS JOB CARDS (NO CRAMPED COLUMNS) + DETAIL PANEL  */}
          {/* ============================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Area: Job Cards Grid / Table (takes 7 cols if panel open, or 12) */}
            <div className={`${showDetailPanel ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-4`}>
              
              {/* If Grid View */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredJobs.map((job) => {
                    const isSelected = selectedJob?.id === job.id;

                    return (
                      <div
                        key={job.id}
                        onClick={() => {
                          setSelectedJob(job);
                          setShowDetailPanel(true);
                        }}
                        className={`bg-white rounded-2xl p-5 border transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between group ${
                          isSelected
                            ? 'border-blue-500 ring-2 ring-blue-500/20'
                            : 'border-slate-200/80 hover:border-slate-300'
                        }`}
                      >
                        {/* Top: Logo + Company + Status Badge */}
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xs flex-shrink-0 shadow-2xs ${job.companyLogoBg}`}>
                                {job.companyLogoText}
                              </div>
                              <div className="min-w-0">
                                <span className="text-xs text-slate-500 font-semibold block truncate">
                                  {job.company}
                                </span>
                                <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-blue-600 transition-colors truncate">
                                  {job.title}
                                </h3>
                              </div>
                            </div>

                            {/* Status Badge */}
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold flex-shrink-0 ${getStatusBadge(job.status)}`}>
                              {job.status}
                            </span>
                          </div>

                          {/* Location & Category */}
                          <div className="flex items-center gap-3 mt-3 text-xs text-slate-500 font-medium">
                            <div className="flex items-center gap-1 truncate">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                              <span className="truncate">{job.location}</span>
                            </div>
                          </div>

                          {/* Pills row: Job Type, Vacancies, Salary */}
                          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs font-semibold">
                            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px]">
                              {job.jobType}
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-[11px]">
                              {job.vacancies} Vacancies
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[11px]">
                              {job.salary}
                            </span>
                          </div>
                        </div>

                        {/* Bottom: Posted time + Quick action buttons */}
                        <div className="pt-3.5 mt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                          <div className="flex items-center gap-1.5 font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{job.postedTimeAgo}</span>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            {job.status === 'Pending Review' ? (
                              <>
                                <button
                                  type="button"
                                  onClick={(e) => handleApproveJob(job.id, e)}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                                  title="Approve Job"
                                >
                                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                  <span>Approve</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => handleRejectJob(job.id, e)}
                                  className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] border border-rose-200 transition-colors cursor-pointer"
                                  title="Reject Job"
                                >
                                  <X className="w-3.5 h-3.5 stroke-[2.5]" />
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedJob(job);
                                  setShowDetailPanel(true);
                                }}
                                className="px-3 py-1 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 font-bold text-xs border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>View</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Table View */
                <div className="bg-white rounded-2xl border border-slate-200/80 p-4 overflow-x-auto shadow-xs">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="text-xs font-semibold text-slate-400 border-b border-slate-100 pb-3">
                        <th className="pb-3">Job Title & Company</th>
                        <th className="pb-3">Category</th>
                        <th className="pb-3">Location</th>
                        <th className="pb-3">Salary</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredJobs.map((job) => (
                        <tr
                          key={job.id}
                          onClick={() => {
                            setSelectedJob(job);
                            setShowDetailPanel(true);
                          }}
                          className={`cursor-pointer transition-colors ${
                            selectedJob?.id === job.id ? 'bg-blue-50/60 font-medium' : 'hover:bg-slate-50/70'
                          }`}
                        >
                          <td className="py-3.5 pr-2">
                            <span className="font-bold text-slate-900 block">{job.title}</span>
                            <span className="text-xs text-slate-500">{job.company}</span>
                          </td>
                          <td className="py-3.5 px-2 text-slate-600 text-xs">{job.category}</td>
                          <td className="py-3.5 px-2 text-slate-600 text-xs">{job.location}</td>
                          <td className="py-3.5 px-2 font-bold text-slate-800 text-xs">{job.salary}</td>
                          <td className="py-3.5 px-2">
                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusBadge(job.status)}`}>
                              {job.status}
                            </span>
                          </td>
                          <td className="py-3.5 pl-2 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedJob(job);
                                setShowDetailPanel(true);
                              }}
                              className="text-xs font-bold text-blue-600 hover:underline"
                            >
                              Details →
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Bottom Pagination */}
              <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                <span>Showing 1 to {filteredJobs.length} of 428 jobs</span>
                
                <div className="flex items-center gap-1">
                  <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 cursor-pointer">
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center shadow-xs">
                    1
                  </button>
                  <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 cursor-pointer">
                    2
                  </button>
                  <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 cursor-pointer">
                    3
                  </button>
                  <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 cursor-pointer">
                    4
                  </button>
                  <span className="px-1 text-slate-400">...</span>
                  <button className="w-8 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 cursor-pointer">
                    42
                  </button>
                  <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 cursor-pointer">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

            {/* Right Area: Job Detail Slide-over Panel (takes 5 cols) */}
            {showDetailPanel && selectedJob && (
              <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 relative space-y-5 animate-fadeIn">
                
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setShowDetailPanel(false)}
                  className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Close preview"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Company & Job Header */}
                <div className="flex items-start gap-3.5 pr-8">
                  <div className={`w-13 h-13 rounded-2xl flex items-center justify-center text-sm flex-shrink-0 shadow-sm ${selectedJob.companyLogoBg}`}>
                    {selectedJob.companyLogoText}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">
                      {selectedJob.company}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mt-1 ${getStatusBadge(
                        selectedJob.status
                      )}`}
                    >
                      {selectedJob.status}
                    </span>
                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedJob.location}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-blue-600 font-medium">
                      <Globe className="w-3.5 h-3.5" />
                      <a href={`https://${selectedJob.website}`} target="_blank" rel="noreferrer" className="hover:underline">
                        {selectedJob.website}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-100 text-xs font-semibold overflow-x-auto no-scrollbar gap-4">
                  {['Overview', 'Company', 'Requirements', 'Applications', 'Activity'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setDetailTab(tab)}
                      className={`pb-2.5 transition-colors cursor-pointer whitespace-nowrap ${
                        detailTab === tab
                          ? 'border-b-2 border-blue-600 text-blue-600 font-bold'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* 2-Column Info Grid */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                      <Briefcase className="w-4 h-4" />
                      <span className="font-semibold text-[11px]">Job Title</span>
                    </div>
                    <p className="font-bold text-slate-900 text-sm">{selectedJob.title}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                      <Clock className="w-4 h-4" />
                      <span className="font-semibold text-[11px]">Experience</span>
                    </div>
                    <p className="font-bold text-slate-800">{selectedJob.experience}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                      <Tag className="w-4 h-4" />
                      <span className="font-semibold text-[11px]">Job Type</span>
                    </div>
                    <p className="font-bold text-slate-800">{selectedJob.jobType}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                      <GraduationCap className="w-4 h-4" />
                      <span className="font-semibold text-[11px]">Qualification</span>
                    </div>
                    <p className="font-bold text-slate-800">{selectedJob.qualification}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                      <Users className="w-4 h-4" />
                      <span className="font-semibold text-[11px]">Vacancies</span>
                    </div>
                    <p className="font-bold text-slate-800">{selectedJob.vacancies}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                      <Building2 className="w-4 h-4" />
                      <span className="font-semibold text-[11px]">Category</span>
                    </div>
                    <p className="font-bold text-slate-800">{selectedJob.category}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-semibold text-[11px]">Salary</span>
                    </div>
                    <p className="font-bold text-slate-800">{selectedJob.salary}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span className="font-semibold text-[11px]">Posted On</span>
                    </div>
                    <p className="font-bold text-slate-800">{selectedJob.postedDate}</p>
                  </div>
                </div>

                {/* Job Description */}
                <div className="pt-3 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-800 mb-1.5">Job Description</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    {selectedJob.description}
                  </p>
                </div>

                {/* Skills Required */}
                <div className="pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-800 mb-2">Skills Required</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedJob.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleApproveJob(selectedJob.id, e)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>Approve Job</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleRejectJob(selectedJob.id, e)}
                    className="py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <X className="w-4 h-4 stroke-[2.5]" />
                    <span>Reject Job</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => alert(`Editing job: ${selectedJob.title}`)}
                    className="py-2.5 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Job</span>
                  </button>
                </div>

              </div>
            )}

          </div>

        </main>
      </div>

      {/* ============================================================== */}
      {/* 3. MODAL: ADD NEW JOB                                          */}
      {/* ============================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Add New Job Listing</h3>
                <p className="text-xs text-slate-500 mt-0.5">Post an approved skilled vacancy on Stark Jobs</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  placeholder="e.g. Senior CNC Operator"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company</label>
                  <input
                    type="text"
                    required
                    value={newJob.company}
                    onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                    placeholder="e.g. ABC Industrial Services"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newJob.category}
                    onChange={(e) => setNewJob({ ...newJob, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                  >
                    <option value="Electrical & Electronics">Electrical & Electronics</option>
                    <option value="Construction & Civil">Construction & Civil</option>
                    <option value="Software & IT">Software & IT</option>
                    <option value="Manufacturing & Trades">Manufacturing & Trades</option>
                    <option value="Finance & Accounting">Finance & Accounting</option>
                    <option value="Sales & Marketing">Sales & Marketing</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">District / Location</label>
                  <select
                    value={newJob.district}
                    onChange={(e) => setNewJob({ ...newJob, district: e.target.value, location: `${e.target.value}, Tamil Nadu` })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                  >
                    <option value="Thoothukudi">Thoothukudi</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Tirunelveli">Tirunelveli</option>
                    <option value="Madurai">Madurai</option>
                    <option value="Coimbatore">Coimbatore</option>
                    <option value="Salem">Salem</option>
                    <option value="Trichy">Trichy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Vacancies</label>
                  <input
                    type="number"
                    min="1"
                    value={newJob.vacancies}
                    onChange={(e) => setNewJob({ ...newJob, vacancies: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Salary Range</label>
                  <input
                    type="text"
                    value={newJob.salary}
                    onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                    placeholder="e.g. ₹20,000 - ₹30,000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Experience</label>
                  <input
                    type="text"
                    value={newJob.experience}
                    onChange={(e) => setNewJob({ ...newJob, experience: e.target.value })}
                    placeholder="e.g. 1 - 3 Years"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Required Skills (comma separated)</label>
                <input
                  type="text"
                  value={newJob.skills}
                  onChange={(e) => setNewJob({ ...newJob, skills: e.target.value })}
                  placeholder="e.g. Welding, Safety, Blueprint Reading"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Job Description</label>
                <textarea
                  rows={3}
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  placeholder="Responsibilities, daily schedule, and requirements..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white resize-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  Post Job Listing
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
