import React, { useState } from 'react';
import {
  Search,
  Calendar,
  Bell,
  ChevronDown,
  Menu,
  Building2,
  ShieldCheck,
  Clock,
  Ban,
  Plus,
  SlidersHorizontal,
  ChevronRight,
  MoreVertical,
  X,
  MapPin,
  Globe,
  Check,
  Edit2,
  ChevronLeft,
  Briefcase,
  Users,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from 'lucide-react';
import AdminSidebar from './AdminSidebar';

// Initial Companies Data matching the design screenshot
const INITIAL_COMPANIES = [];

export default function AdminCompanies({ onLogout, onNavigateHome, onNavigateTab }) {
  const [companies, setCompanies] = useState(INITIAL_COMPANIES);
  const [selectedCompany, setSelectedCompany] = useState(null);

  React.useEffect(() => {
    fetch('http://127.0.0.1:8000/api/admin/companies')
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          const mapped = data.data.map(c => ({
            id: c.id,
            name: c.company_name,
            location: c.location || (c.district ? `${c.district.name}, Tamil Nadu` : 'Tamil Nadu'),
            district: c.district?.name || 'Thoothukudi',
            industry: c.industry || 'Industrial Manufacturing',
            status: c.verification_status === 'verified' ? 'Verified' : (c.verification_status === 'rejected' ? 'Rejected' : 'Pending'),
            statusLabel: c.verification_status === 'verified' ? 'Verified Company' : 'Pending Verification',
            jobsCount: c.job_listings_count || 0,
            applicationsCount: 0,
            joinedDate: new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            companySize: c.company_size || '50 - 100 Employees',
            email: c.email || c.user?.email || 'contact@company.com',
            phone: c.phone || c.user?.phone || '+91 98765 43210',
            website: c.website || 'www.company.in',
            address: c.location || 'SIPCOT Industrial Estate, Tamil Nadu',
            about: c.about || 'Registered employer on Stark Jobs platform.',
            logo: c.logo_url || (c.logo ? (c.logo.startsWith('http') ? c.logo : `http://127.0.0.1:8000/storage/${c.logo}`) : null),
            logoType: c.logo_url || c.logo ? 'image' : 'text',
            logoText: (c.company_name || 'CO').slice(0, 2).toUpperCase(),
            logoBg: 'bg-slate-900 text-white font-black',
          }));
          setCompanies(mapped);
          if (mapped.length > 0) setSelectedCompany(mapped[0]);
        }
      })
      .catch(err => console.warn('Could not fetch admin companies:', err));
  }, []);
  const [showDetailPanel, setShowDetailPanel] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [detailTab, setDetailTab] = useState('Overview');

  // Filter States
  const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Pending', 'Verified', 'Rejected'
  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('All');
  const [industryFilter, setIndustryFilter] = useState('All');

  // Dropdown States
  const [dateRange, setDateRange] = useState('Oct 01, 2026 - Oct 31, 2026');
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Modal State for + Add Company
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: '',
    industry: 'Industrial',
    district: 'Thoothukudi',
    companySize: '50 - 100 Employees',
    email: '',
    phone: '',
    website: '',
    address: '',
    about: '',
  });

  // Dynamic status counts
  const countAll = companies.length;
  const countPending = companies.filter((c) => c.status === 'Pending').length;
  const countVerified = companies.filter((c) => c.status === 'Verified').length;
  const countRejected = companies.filter((c) => c.status === 'Rejected').length;

  // Filtered Companies
  const filteredCompanies = companies.filter((comp) => {
    // Status filter
    if (statusFilter !== 'All' && comp.status !== statusFilter) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        comp.name.toLowerCase().includes(q) ||
        comp.location.toLowerCase().includes(q) ||
        comp.email.toLowerCase().includes(q) ||
        comp.phone.includes(q);
      if (!match) return false;
    }

    // District filter
    if (districtFilter !== 'All' && comp.district !== districtFilter) {
      return false;
    }

    // Industry filter
    if (industryFilter !== 'All' && comp.industry !== industryFilter) {
      return false;
    }

    return true;
  });

  // Action handlers
  const handleVerify = (id) => {
    const updated = companies.map((c) =>
      c.id === id ? { ...c, status: 'Verified', statusLabel: 'Verified Company' } : c
    );
    setCompanies(updated);
    if (selectedCompany?.id === id) {
      setSelectedCompany({ ...selectedCompany, status: 'Verified', statusLabel: 'Verified Company' });
    }
  };

  const handleReject = (id) => {
    const updated = companies.map((c) =>
      c.id === id ? { ...c, status: 'Rejected', statusLabel: 'Rejected / Suspended' } : c
    );
    setCompanies(updated);
    if (selectedCompany?.id === id) {
      setSelectedCompany({ ...selectedCompany, status: 'Rejected', statusLabel: 'Rejected / Suspended' });
    }
  };

  const handleCreateCompany = (e) => {
    e.preventDefault();
    if (!newCompany.name || !newCompany.email) {
      alert('Please fill out at least Company Name and Official Email.');
      return;
    }

    const created = {
      id: Date.now(),
      name: newCompany.name,
      location: `${newCompany.district}, Tamil Nadu`,
      district: newCompany.district,
      industry: newCompany.industry,
      status: 'Pending',
      statusLabel: 'Pending Verification',
      jobsCount: 0,
      applicationsCount: 0,
      joinedDate: 'Oct 14, 2026',
      companySize: newCompany.companySize,
      email: newCompany.email,
      phone: newCompany.phone || '+91 90000 00000',
      website: newCompany.website || `www.${newCompany.name.toLowerCase().replace(/\s+/g, '')}.com`,
      address: newCompany.address || `${newCompany.district}, Tamil Nadu`,
      about: newCompany.about || `${newCompany.name} is an active employer on Stark Jobs platform.`,
      bannerImg: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
      logoType: 'text',
      logoText: newCompany.name.slice(0, 3).toLowerCase(),
      logoBg: 'bg-slate-900 text-white font-bold',
    };

    setCompanies([created, ...companies]);
    setSelectedCompany(created);
    setShowDetailPanel(true);
    setIsAddModalOpen(false);
    setNewCompany({
      name: '',
      industry: 'Industrial',
      district: 'Thoothukudi',
      companySize: '50 - 100 Employees',
      email: '',
      phone: '',
      website: '',
      address: '',
      about: '',
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Verified':
        return 'bg-emerald-100/70 text-emerald-700';
      case 'Pending':
        return 'bg-amber-100/70 text-amber-700';
      case 'Rejected':
        return 'bg-rose-100/70 text-rose-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6FA] flex font-sans">
      
      {/* ============================================================== */}
      {/* 1. SEPARATE REUSABLE SIDEBAR COMPONENT (activeTab='companies')  */}
      {/* ============================================================== */}
      <AdminSidebar
        activeTab="companies"
        onSelectTab={(tabId) => {
          if (onNavigateTab) {
            onNavigateTab(tabId);
          } else if (tabId === 'dashboard') {
            window.location.pathname = '/admin-dashboard';
          } else if (tabId === 'job-seekers') {
            window.location.pathname = '/admin/job-seekers';
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
                placeholder="Search companies, industry or location..."
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
              onClick={() => alert('You have 2 pending verification requests.')}
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
          
          {/* Header Title + + Add Company Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                Companies
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Manage registered companies and their job postings
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0A192F] hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-md shadow-slate-900/20 transition-all cursor-pointer self-start sm:self-auto active:scale-[0.98]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Company</span>
            </button>
          </div>

          {/* ============================================================== */}
          {/* ROW 1: 4 STAT METRIC CARDS                                     */}
          {/* ============================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            {/* Card 1: All Companies */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500 block">All Companies</span>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                    {countAll}
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6 stroke-[2.2]" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
                <button
                  onClick={() => setStatusFilter('All')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>View all</span>
                  <span>→</span>
                </button>
                <div className="flex items-center -space-x-1.5">
                  {companies.slice(0, 3).map((comp, idx) => (
                    <span
                      key={comp.id || idx}
                      className="w-6 h-6 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white uppercase"
                    >
                      {comp.name ? comp.name.slice(0, 2) : 'CO'}
                    </span>
                  ))}
                  {companies.length > 3 && (
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                      +{companies.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Card 2: Verified Companies */}
            <div
              onClick={() => setStatusFilter('Verified')}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all duration-200 flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 block">Verified Companies</span>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
                    {countVerified}
                  </div>
                  <span className="text-xs font-medium text-slate-400 mt-1 block">
                    {countAll > 0 ? `${Math.round((countVerified / countAll) * 100)}% of total` : '0% of total'}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
            </div>

            {/* Card 3: Pending Verification */}
            <div
              onClick={() => setStatusFilter('Pending')}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all duration-200 flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Clock className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 block">Pending Verification</span>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
                    {countPending}
                  </div>
                  <span className="text-xs font-medium text-amber-600 mt-1 block">Need your review</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
            </div>

            {/* Card 4: Rejected / Suspended */}
            <div
              onClick={() => setStatusFilter('Rejected')}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all duration-200 flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Ban className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 block">Rejected / Suspended</span>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
                    {countRejected}
                  </div>
                  <span className="text-xs font-medium text-slate-400 mt-1 block">Not allowed to post</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
            </div>

          </div>

          {/* ============================================================== */}
          {/* ROW 2: STATUS PILLS + SEARCH & FILTERS                          */}
          {/* ============================================================== */}
          <div className="space-y-3">
            
            {/* Top row of Filter: Status Pills + Filters toggle */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStatusFilter('All')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    statusFilter === 'All'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>All</span>
                  <span className={statusFilter === 'All' ? 'opacity-90' : 'text-slate-400'}>{countAll}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatusFilter('Pending')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    statusFilter === 'Pending'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-amber-100/70 text-amber-700 hover:bg-amber-200/60'
                  }`}
                >
                  <span>Pending</span>
                  <span>{countPending}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatusFilter('Verified')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    statusFilter === 'Verified'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-100/70 text-emerald-700 hover:bg-emerald-200/60'
                  }`}
                >
                  <span>Verified</span>
                  <span>{countVerified}</span>
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
                  <span>{countRejected}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setDistrictFilter('All');
                  setIndustryFilter('All');
                  setStatusFilter('All');
                }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors shadow-2xs cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                <span>Reset Filters</span>
              </button>
            </div>

            {/* Bottom Row of Filter: Search + District + Industry */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-3">
              
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search company name, email or phone..."
                  className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              {/* District Dropdown */}
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
                  <option value="Erode">Erode</option>
                </select>
              </div>

              {/* Industry Dropdown */}
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 hidden sm:block">Industry</span>
                <select
                  value={industryFilter}
                  onChange={(e) => setIndustryFilter(e.target.value)}
                  className="bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white cursor-pointer"
                >
                  <option value="All">All Industries</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Technology">Technology</option>
                  <option value="Construction">Construction</option>
                  <option value="Education">Education</option>
                  <option value="Healthcare">Healthcare</option>
                </select>
              </div>

            </div>

          </div>

          {/* ============================================================== */}
          {/* ROW 3: COMPANY CARDS (2 cols) + COMPANY DETAIL PANEL (1 col)   */}
          {/* ============================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left/Center Cards Grid (takes 7 cols if panel open, or 12) */}
            <div className={`${showDetailPanel ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-4`}>
              
              {/* Cards 2-col Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredCompanies.map((company) => {
                  const isSelected = selectedCompany?.id === company.id;

                  return (
                    <div
                      key={company.id}
                      onClick={() => {
                        setSelectedCompany(company);
                        setShowDetailPanel(true);
                      }}
                      className={`bg-white rounded-2xl p-5 border transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between group ${
                        isSelected
                          ? 'border-blue-500 ring-2 ring-blue-500/20'
                          : 'border-slate-200/80 hover:border-slate-300'
                      }`}
                    >
                      {/* Top Row: Logo, Name, Location, 3-dots */}
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            {/* Logo */}
                            {company.logo ? (
                              <img
                                src={company.logo}
                                alt={company.name}
                                className="w-11 h-11 rounded-xl object-contain bg-white p-1 border border-slate-200 flex-shrink-0 shadow-2xs"
                              />
                            ) : (
                              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xs flex-shrink-0 shadow-2xs ${company.logoBg}`}>
                                {company.logoText}
                              </div>
                            )}
                            <div className="min-w-0">
                              <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-blue-600 transition-colors truncate">
                                {company.name}
                              </h3>
                              <p className="text-xs text-slate-400 font-medium truncate mt-0.5">
                                {company.location}
                              </p>
                            </div>
                          </div>

                          {/* 3 dots menu button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(activeMenuId === company.id ? null : company.id);
                            }}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Status Badge */}
                        <div className="mt-3 flex items-center justify-between">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusBadge(
                              company.status
                            )}`}
                          >
                            {company.status}
                          </span>

                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>

                      {/* Bottom Stats: Jobs, Applications, Joined Date */}
                      <div className="pt-3.5 mt-3.5 border-t border-slate-100 grid grid-cols-3 gap-2 text-[11px] text-slate-500 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span><strong className="font-bold text-slate-700">{company.jobsCount}</strong> Jobs</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span><strong className="font-bold text-slate-700">{company.applicationsCount}</strong> Apps</span>
                        </div>
                        <div className="flex items-center gap-1.5 justify-end text-slate-400">
                          <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">{company.joinedDate}</span>
                        </div>
                      </div>

                      {/* Dropdown Menu for 3-dots */}
                      {activeMenuId === company.id && (
                        <div
                          className="absolute bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-30 text-left animate-fadeIn mt-10 right-4"
                          onClick={(e) => e.stopPropagation()}
                          onMouseLeave={() => setActiveMenuId(null)}
                        >
                          <button
                            onClick={() => {
                              handleVerify(company.id);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3.5 py-1.5 text-xs text-emerald-600 hover:bg-emerald-50 text-left font-semibold flex items-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Verify Company</span>
                          </button>
                          <button
                            onClick={() => {
                              handleReject(company.id);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 text-left font-semibold flex items-center gap-1.5"
                          >
                            <Ban className="w-3.5 h-3.5" />
                            <span>Reject / Suspend</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Pagination Bar */}
              <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                <span>Showing 1 to {filteredCompanies.length} of 326 companies</span>
                
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
                  <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 cursor-pointer">
                    5
                  </button>
                  <span className="px-1 text-slate-400">...</span>
                  <button className="w-8 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 cursor-pointer">
                    33
                  </button>
                  <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 cursor-pointer">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

            {/* Right: Company Detail Panel (takes 5 cols) */}
            {showDetailPanel && selectedCompany && (
              <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden animate-fadeIn space-y-5">
                
                {/* Header Banner Image */}
                <div className="relative h-40 w-full overflow-hidden bg-slate-900">
                  <img
                    src={selectedCompany.bannerImg}
                    alt={selectedCompany.name}
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

                  {/* Top Right Actions */}
                  <div className="absolute top-3.5 right-3.5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => alert(`More actions for ${selectedCompany.name}`)}
                      className="p-1.5 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md transition-colors"
                      title="More options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDetailPanel(false)}
                      className="p-1.5 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md transition-colors"
                      title="Close panel"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Overlapping Logo */}
                  <div className="absolute -bottom-6 left-6">
                    {selectedCompany.logo ? (
                      <img
                        src={selectedCompany.logo}
                        alt={selectedCompany.name}
                        className="w-16 h-16 rounded-2xl object-contain bg-white p-1 ring-4 ring-white shadow-md flex-shrink-0"
                      />
                    ) : (
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-sm ring-4 ring-white shadow-md ${selectedCompany.logoBg}`}>
                        {selectedCompany.logoText}
                      </div>
                    )}
                  </div>
                </div>

                {/* Company Name & Status Tag */}
                <div className="px-6 pt-3">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                      {selectedCompany.name}
                    </h2>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusBadge(
                        selectedCompany.status
                      )}`}
                    >
                      {selectedCompany.statusLabel}
                    </span>
                  </div>

                  {/* Meta row: Industry, Location, Website */}
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedCompany.industry}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedCompany.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-blue-600 hover:underline">
                      <Globe className="w-3.5 h-3.5" />
                      <a href={`https://${selectedCompany.website}`} target="_blank" rel="noreferrer">
                        {selectedCompany.website}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="px-6 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleVerify(selectedCompany.id)}
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>Verify Company</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleReject(selectedCompany.id)}
                    className="py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Ban className="w-4 h-4 stroke-[2.5]" />
                    <span>Reject</span>
                  </button>

                  <a
                    href={`https://${selectedCompany.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
                  >
                    <span>View Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Navigation Tabs */}
                <div className="px-6 border-b border-slate-100 flex items-center gap-5 text-xs font-semibold overflow-x-auto no-scrollbar">
                  {['Overview', `Jobs ${selectedCompany.jobsCount}`, 'Representatives 3', 'Documents 4', 'Activity'].map((tab) => {
                    const tabKey = tab.split(' ')[0];
                    return (
                      <button
                        key={tab}
                        onClick={() => setDetailTab(tabKey)}
                        className={`pb-2.5 transition-colors cursor-pointer whitespace-nowrap ${
                          detailTab === tabKey
                            ? 'border-b-2 border-blue-600 text-blue-600 font-bold'
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        {tab}
                      </button>
                    );
                  })}
                </div>

                {/* Company Information Grid */}
                <div className="px-6 space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 text-sm">Company Information</h3>
                    <button
                      onClick={() => alert(`Editing info for ${selectedCompany.name}`)}
                      className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </div>

                  <div className="space-y-2.5 text-slate-600 font-medium">
                    <div className="grid grid-cols-3">
                      <span className="text-slate-400">Company Name</span>
                      <span className="col-span-2 font-bold text-slate-800">{selectedCompany.name}</span>
                    </div>

                    <div className="grid grid-cols-3">
                      <span className="text-slate-400">Industry</span>
                      <span className="col-span-2 font-bold text-slate-800">{selectedCompany.industry}</span>
                    </div>

                    <div className="grid grid-cols-3">
                      <span className="text-slate-400">Company Size</span>
                      <span className="col-span-2 text-slate-700">{selectedCompany.companySize}</span>
                    </div>

                    <div className="grid grid-cols-3">
                      <span className="text-slate-400">Registration Date</span>
                      <span className="col-span-2 text-slate-700">{selectedCompany.joinedDate}</span>
                    </div>

                    <div className="grid grid-cols-3">
                      <span className="text-slate-400">Email</span>
                      <span className="col-span-2 text-blue-600 hover:underline cursor-pointer">{selectedCompany.email}</span>
                    </div>

                    <div className="grid grid-cols-3">
                      <span className="text-slate-400">Phone</span>
                      <span className="col-span-2 text-slate-800">{selectedCompany.phone}</span>
                    </div>

                    <div className="grid grid-cols-3">
                      <span className="text-slate-400">Website</span>
                      <span className="col-span-2 text-blue-600 hover:underline cursor-pointer">{selectedCompany.website}</span>
                    </div>

                    <div className="grid grid-cols-3">
                      <span className="text-slate-400">Address</span>
                      <span className="col-span-2 text-slate-700 leading-relaxed">{selectedCompany.address}</span>
                    </div>
                  </div>
                </div>

                {/* About Company */}
                <div className="px-6 pb-6 text-xs border-t border-slate-100 pt-4">
                  <h3 className="font-bold text-slate-800 text-sm mb-2">About Company</h3>
                  <p className="text-slate-500 leading-relaxed font-normal">
                    {selectedCompany.about}
                  </p>
                </div>

              </div>
            )}

          </div>

        </main>
      </div>

      {/* ============================================================== */}
      {/* 3. MODAL: ADD NEW COMPANY                                      */}
      {/* ============================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Add New Company</h3>
                <p className="text-xs text-slate-500 mt-0.5">Register an employer organization manually</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCompany} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                  placeholder="e.g. Apex Marine Logistics"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Industry</label>
                  <select
                    value={newCompany.industry}
                    onChange={(e) => setNewCompany({ ...newCompany, industry: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                  >
                    <option value="Industrial">Industrial</option>
                    <option value="Technology">Technology</option>
                    <option value="Construction">Construction</option>
                    <option value="Education">Education</option>
                    <option value="Healthcare">Healthcare</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">District</label>
                  <select
                    value={newCompany.district}
                    onChange={(e) => setNewCompany({ ...newCompany, district: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                  >
                    <option value="Thoothukudi">Thoothukudi</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Tirunelveli">Tirunelveli</option>
                    <option value="Madurai">Madurai</option>
                    <option value="Coimbatore">Coimbatore</option>
                    <option value="Erode">Erode</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={newCompany.email}
                    onChange={(e) => setNewCompany({ ...newCompany, email: e.target.value })}
                    placeholder="hr@company.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={newCompany.phone}
                    onChange={(e) => setNewCompany({ ...newCompany, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Official Address</label>
                <input
                  type="text"
                  value={newCompany.address}
                  onChange={(e) => setNewCompany({ ...newCompany, address: e.target.value })}
                  placeholder="Street, City, PIN code"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">About Company</label>
                <textarea
                  rows={3}
                  value={newCompany.about}
                  onChange={(e) => setNewCompany({ ...newCompany, about: e.target.value })}
                  placeholder="Short description of the company and operations..."
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
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md shadow-slate-900/20 cursor-pointer"
                >
                  Save Company
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
