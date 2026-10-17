import React, { useState } from 'react';
import {
  Search,
  Calendar,
  Bell,
  ChevronDown,
  Menu,
  Users,
  UserCheck,
  Clock,
  UserX,
  Plus,
  Download,
  MoreVertical,
  X,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react';
import AdminSidebar from './AdminSidebar';

// Initial candidates list from reference screenshot
const INITIAL_CANDIDATES = [];

export default function AdminJobSeekers({ onLogout, onNavigateHome, onNavigateTab }) {
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  React.useEffect(() => {
    fetch('http://127.0.0.1:8000/api/admin/job-seekers')
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          const mapped = data.data.map(s => ({
            id: s.id,
            name: s.name,
            email: s.email,
            phone: s.phone || 'N/A',
            district: s.seeker_profile?.district?.name || 'Thoothukudi',
            state: 'Tamil Nadu',
            qualification: s.seeker_profile?.highest_qualification || 'Degree / Diploma',
            experience: s.seeker_profile?.experience_years ? `${s.seeker_profile.experience_years} Years` : 'Fresher',
            status: s.is_active ? 'Active' : 'Inactive',
            registeredOn: new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            avatar: s.avatar || null,
            initials: (s.name || 'JS').slice(0, 2).toUpperCase(),
            skills: s.seeker_profile?.skills || ['Trade Knowledge'],
            preferredLocation: s.seeker_profile?.preferred_location || 'Tamil Nadu',
            bio: s.seeker_profile?.bio || 'Registered job candidate on Stark Jobs.',
          }));
          setCandidates(mapped);
          if (mapped.length > 0) setSelectedCandidate(mapped[0]);
        }
      })
      .catch(err => console.warn('Could not fetch seekers:', err));
  }, []);
  const [selectedRows, setSelectedRows] = useState([1]);
  const [showDetailPanel, setShowDetailPanel] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [detailTab, setDetailTab] = useState('Overview');

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('All');
  const [qualificationFilter, setQualificationFilter] = useState('All');
  const [experienceFilter, setExperienceFilter] = useState('Any');
  const [statusFilter, setStatusFilter] = useState('All');

  // Header Dropdown States
  const [dateRange, setDateRange] = useState('Oct 01, 2026 - Oct 31, 2026');
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Modal State for + Add Job Seeker
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSeeker, setNewSeeker] = useState({
    name: '',
    email: '',
    phone: '',
    district: 'Thoothukudi',
    qualification: 'B.E. (CSE)',
    experience: 'Fresher',
    status: 'Active',
    skills: 'React, JavaScript, HTML, CSS',
  });

  // Filter Logic
  const filteredCandidates = candidates.filter((item) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      item.name.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query) ||
      item.phone.includes(query);

    const matchesDistrict = districtFilter === 'All' || item.district === districtFilter;
    const matchesQual = qualificationFilter === 'All' || item.qualification === qualificationFilter;
    const matchesExp = experienceFilter === 'Any' || item.experience.includes(experienceFilter);
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;

    return matchesSearch && matchesDistrict && matchesQual && matchesExp && matchesStatus;
  });

  // Checkbox handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(filteredCandidates.map((c) => c.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleToggleRow = (id, e) => {
    e.stopPropagation();
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rId) => rId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setDistrictFilter('All');
    setQualificationFilter('All');
    setExperienceFilter('Any');
    setStatusFilter('All');
  };

  // Status Badge Class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-100 text-emerald-700';
      case 'Inactive':
        return 'bg-amber-100 text-amber-700';
      case 'Suspended':
        return 'bg-rose-100 text-rose-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  // Add Candidate submit
  const handleCreateSeeker = (e) => {
    e.preventDefault();
    if (!newSeeker.name || !newSeeker.email) {
      alert('Please fill out at least name and email.');
      return;
    }

    const created = {
      id: Date.now(),
      name: newSeeker.name,
      email: newSeeker.email,
      phone: newSeeker.phone || '+91 99999 00000',
      district: newSeeker.district,
      state: 'Tamil Nadu',
      qualification: newSeeker.qualification,
      experience: newSeeker.experience,
      status: newSeeker.status,
      registeredOn: 'Oct 14, 2026',
      avatar: null,
      initials: newSeeker.name.slice(0, 2).toUpperCase(),
      skills: newSeeker.skills.split(',').map((s) => s.trim()),
      preferredLocation: newSeeker.district,
      bio: 'Newly registered job seeker on Stark Jobs candidate network.',
    };

    setCandidates([created, ...candidates]);
    setSelectedCandidate(created);
    setShowDetailPanel(true);
    setIsAddModalOpen(false);
    setNewSeeker({
      name: '',
      email: '',
      phone: '',
      district: 'Thoothukudi',
      qualification: 'B.E. (CSE)',
      experience: 'Fresher',
      status: 'Active',
      skills: 'React, JavaScript, HTML, CSS',
    });
  };

  return (
    <div className="min-h-screen bg-[#F4F6FA] flex font-sans">
      
      {/* ============================================================== */}
      {/* 1. SHARED SIDEBAR COMPONENT (activeTab='job-seekers')           */}
      {/* ============================================================== */}
      <AdminSidebar
        activeTab="job-seekers"
        onSelectTab={(tabId) => {
          if (onNavigateTab) {
            onNavigateTab(tabId);
          } else if (tabId === 'dashboard') {
            window.location.pathname = '/admin-dashboard';
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
                placeholder="Search job seekers by name, email or phone..."
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
              onClick={() => alert('You have 3 candidate notifications.')}
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
          
          {/* Header Title + + Add Job Seeker Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                Job Seekers
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Manage all registered job seekers on Stark Jobs
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1976D2] hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer self-start sm:self-auto active:scale-[0.98]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Job Seeker</span>
            </button>
          </div>

          {/* ============================================================== */}
          {/* ROW 1: 4 STAT METRIC CARDS                                     */}
          {/* ============================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            {/* Card 1: Total Job Seekers */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all duration-200 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 block">Total Job Seekers</span>
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">{candidates.length}</div>
                <div className="flex items-center gap-1.5 mt-1.5 text-xs">
                  <span className="font-bold text-emerald-600">↗ +12%</span>
                  <span className="text-slate-400 font-medium text-[11px]">vs last month</span>
                </div>
              </div>
            </div>

            {/* Card 2: Active Job Seekers */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all duration-200 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <UserCheck className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 block">Active Job Seekers</span>
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">2,310</div>
                <div className="flex items-center gap-1.5 mt-1.5 text-xs">
                  <span className="font-bold text-emerald-600">↗ +8%</span>
                  <span className="text-slate-400 font-medium text-[11px]">vs last month</span>
                </div>
              </div>
            </div>

            {/* Card 3: New Registrations */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all duration-200 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 block">New Registrations</span>
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">245</div>
                <div className="flex items-center gap-1.5 mt-1.5 text-xs">
                  <span className="font-bold text-emerald-600">↗ +18%</span>
                  <span className="text-slate-400 font-medium text-[11px]">this month</span>
                </div>
              </div>
            </div>

            {/* Card 4: Inactive / Suspended */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all duration-200 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
                <UserX className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 block">Inactive / Suspended</span>
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">290</div>
                <div className="flex items-center gap-1.5 mt-1.5 text-xs">
                  <span className="font-bold text-rose-600">↗ +4%</span>
                  <span className="text-slate-400 font-medium text-[11px]">vs last month</span>
                </div>
              </div>
            </div>

          </div>

          {/* ============================================================== */}
          {/* ROW 2: SEARCH & FILTER BAR                                     */}
          {/* ============================================================== */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, email or phone..."
                className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>

            {/* District Filter */}
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 hidden sm:block">District</span>
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white cursor-pointer"
              >
                <option value="All">All Districts</option>
                <option value="Thoothukudi">Thoothukudi</option>
                <option value="Tirunelveli">Tirunelveli</option>
                <option value="Madurai">Madurai</option>
                <option value="Chennai">Chennai</option>
                <option value="Coimbatore">Coimbatore</option>
                <option value="Tiruchirappalli">Tiruchirappalli</option>
              </select>
            </div>

            {/* Qualification Filter */}
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 hidden sm:block">Qualification</span>
              <select
                value={qualificationFilter}
                onChange={(e) => setQualificationFilter(e.target.value)}
                className="bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white cursor-pointer"
              >
                <option value="All">All Qualifications</option>
                <option value="B.E. (CSE)">B.E. (CSE)</option>
                <option value="B.Tech (IT)">B.Tech (IT)</option>
                <option value="ITI (Electrician)">ITI (Electrician)</option>
                <option value="Diploma (Mech)">Diploma (Mech)</option>
                <option value="B.Sc (Nursing)">B.Sc (Nursing)</option>
                <option value="12th">12th</option>
                <option value="B.Com">B.Com</option>
                <option value="M.A. (English)">M.A. (English)</option>
              </select>
            </div>

            {/* Experience Filter */}
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 hidden sm:block">Experience</span>
              <select
                value={experienceFilter}
                onChange={(e) => setExperienceFilter(e.target.value)}
                className="bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white cursor-pointer"
              >
                <option value="Any">Any Experience</option>
                <option value="Fresher">Fresher</option>
                <option value="1 Year">1 Year</option>
                <option value="2 Years">2 Years</option>
                <option value="3 Years">3 Years</option>
                <option value="5 Years">5 Years</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 hidden sm:block">Status</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>

            {/* Reset Button */}
            <div className="flex flex-col self-end">
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold text-slate-600 transition-colors cursor-pointer"
              >
                Reset
              </button>
            </div>

          </div>

          {/* ============================================================== */}
          {/* ROW 3: TABLE + DETAIL PANEL DUAL LAYOUT                         */}
          {/* ============================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Table Container (takes 8 cols if panel open, or full 12) */}
            <div className={`${showDetailPanel ? 'lg:col-span-8' : 'lg:col-span-12'} bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between transition-all duration-300`}>
              
              {/* Table Top Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base sm:text-lg font-bold text-slate-800">
                  Job Seekers <span className="text-slate-400 font-semibold text-sm">({filteredCandidates.length})</span>
                </h2>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-2xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>Export</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {exportDropdownOpen && (
                    <div
                      className="absolute right-0 top-10 w-36 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-20 animate-fadeIn"
                      onMouseLeave={() => setExportDropdownOpen(false)}
                    >
                      <button
                        onClick={() => { alert('Exported as CSV'); setExportDropdownOpen(false); }}
                        className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        Export as CSV
                      </button>
                      <button
                        onClick={() => { alert('Exported as Excel'); setExportDropdownOpen(false); }}
                        className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        Export as Excel
                      </button>
                      <button
                        onClick={() => { alert('Exported as PDF'); setExportDropdownOpen(false); }}
                        className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        Export as PDF
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Candidates Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="text-xs font-semibold text-slate-400 border-b border-slate-100 pb-3">
                      <th className="pb-3 w-8 pr-2">
                        <input
                          type="checkbox"
                          onChange={handleSelectAll}
                          checked={selectedRows.length === filteredCandidates.length && filteredCandidates.length > 0}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </th>
                      <th className="pb-3 font-semibold">Name & Contact</th>
                      <th className="pb-3 font-semibold">District</th>
                      <th className="pb-3 font-semibold">Qualification</th>
                      <th className="pb-3 font-semibold">Experience</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold">Registered On</th>
                      <th className="pb-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCandidates.map((candidate) => {
                      const isSelected = selectedCandidate?.id === candidate.id;
                      const isChecked = selectedRows.includes(candidate.id);

                      return (
                        <tr
                          key={candidate.id}
                          onClick={() => {
                            setSelectedCandidate(candidate);
                            setShowDetailPanel(true);
                          }}
                          className={`cursor-pointer transition-colors group ${
                            isSelected
                              ? 'bg-blue-50/60 font-medium'
                              : 'hover:bg-slate-50/80'
                          }`}
                        >
                          {/* Checkbox */}
                          <td className="py-3.5 pr-2" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => handleToggleRow(candidate.id, e)}
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                          </td>

                          {/* Candidate Avatar & Contact */}
                          <td className="py-3.5 pr-3">
                            <div className="flex items-center gap-3">
                              {candidate.avatar ? (
                                <img
                                  src={candidate.avatar}
                                  alt={candidate.name}
                                  className="w-9 h-9 rounded-full object-cover shadow-2xs border border-slate-200 flex-shrink-0"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                                  {candidate.initials}
                                </div>
                              )}
                              <div className="min-w-0">
                                <span className="font-bold text-slate-800 text-xs sm:text-sm group-hover:text-blue-600 transition-colors block truncate">
                                  {candidate.name}
                                </span>
                                <span className="text-[11px] text-slate-400 block truncate">
                                  {candidate.email}
                                </span>
                                <span className="text-[11px] text-slate-400 block truncate">
                                  {candidate.phone}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* District */}
                          <td className="py-3.5 px-2 text-slate-600 text-xs font-medium">
                            {candidate.district}
                          </td>

                          {/* Qualification */}
                          <td className="py-3.5 px-2 text-slate-600 text-xs font-medium">
                            {candidate.qualification}
                          </td>

                          {/* Experience */}
                          <td className="py-3.5 px-2 text-slate-600 text-xs font-medium">
                            {candidate.experience}
                          </td>

                          {/* Status Badge */}
                          <td className="py-3.5 px-2">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusBadgeClass(
                                candidate.status
                              )}`}
                            >
                              {candidate.status}
                            </span>
                          </td>

                          {/* Registered Date */}
                          <td className="py-3.5 px-2 text-slate-500 text-xs whitespace-nowrap">
                            {candidate.registeredOn}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 pl-2 text-right relative" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => setActiveMenuId(activeMenuId === candidate.id ? null : candidate.id)}
                              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                              <MoreVertical className="w-4 h-4 inline-block" />
                            </button>

                            {activeMenuId === candidate.id && (
                              <div
                                className="absolute right-0 top-10 w-36 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-30 text-left animate-fadeIn"
                                onMouseLeave={() => setActiveMenuId(null)}
                              >
                                <button
                                  onClick={() => {
                                    setSelectedCandidate(candidate);
                                    setShowDetailPanel(true);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 text-left font-medium block"
                                >
                                  View Details
                                </button>
                                <button
                                  onClick={() => {
                                    const updated = candidates.map((c) =>
                                      c.id === candidate.id
                                        ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' }
                                        : c
                                    );
                                    setCandidates(updated);
                                    if (selectedCandidate?.id === candidate.id) {
                                      setSelectedCandidate({
                                        ...selectedCandidate,
                                        status: selectedCandidate.status === 'Active' ? 'Inactive' : 'Active',
                                      });
                                    }
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 text-left font-medium block"
                                >
                                  Toggle Status
                                </button>
                                <button
                                  onClick={() => {
                                    setCandidates(candidates.filter((c) => c.id !== candidate.id));
                                    if (selectedCandidate?.id === candidate.id) {
                                      setSelectedCandidate(candidates.find((c) => c.id !== candidate.id) || null);
                                    }
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 text-left font-medium block"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Table Pagination Footer */}
              <div className="pt-4 mt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                <span>Showing 1 to {filteredCandidates.length} of {candidates.length} results</span>
                
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
                    356
                  </button>
                  <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 cursor-pointer">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

            {/* Right: Candidate Detail Panel (takes 4 cols) */}
            {showDetailPanel && selectedCandidate && (
              <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm relative space-y-6 animate-fadeIn">
                
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setShowDetailPanel(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Close candidate preview"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Candidate Profile Header */}
                <div className="flex items-center gap-4">
                  {selectedCandidate.avatar ? (
                    <img
                      src={selectedCandidate.avatar}
                      alt={selectedCandidate.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-slate-100 shadow-sm"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 font-extrabold text-lg flex items-center justify-center shadow-sm">
                      {selectedCandidate.initials}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-extrabold text-slate-800">
                        {selectedCandidate.name}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadgeClass(
                          selectedCandidate.status
                        )}`}
                      >
                        {selectedCandidate.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">Job Seeker</p>
                  </div>
                </div>

                {/* Detail Tabs */}
                <div className="flex border-b border-slate-100 text-xs font-semibold">
                  {['Overview', 'Education', 'Experience', 'Documents'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setDetailTab(tab)}
                      className={`pb-2.5 px-2.5 transition-colors cursor-pointer ${
                        detailTab === tab
                          ? 'border-b-2 border-blue-600 text-blue-600 font-bold'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Contact Information */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 mb-3">Contact Information</h4>
                  <div className="space-y-2 text-xs text-slate-600 font-medium">
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{selectedCandidate.email}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span>{selectedCandidate.phone}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span>{selectedCandidate.district}, {selectedCandidate.state}</span>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 mb-2.5">Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCandidate.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 2-Column Info Grid */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                      <GraduationCap className="w-4 h-4" />
                      <span className="font-semibold text-[11px]">Qualification</span>
                    </div>
                    <p className="font-bold text-slate-800">{selectedCandidate.qualification}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                      <Briefcase className="w-4 h-4" />
                      <span className="font-semibold text-[11px]">Experience</span>
                    </div>
                    <p className="font-bold text-slate-800">{selectedCandidate.experience}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                      <MapPin className="w-4 h-4" />
                      <span className="font-semibold text-[11px]">Preferred Location</span>
                    </div>
                    <p className="font-bold text-slate-800">{selectedCandidate.preferredLocation}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                      <ExternalLink className="w-4 h-4" />
                      <span className="font-semibold text-[11px]">Resume</span>
                    </div>
                    <button
                      onClick={() => alert(`Opening resume for ${selectedCandidate.name}`)}
                      className="text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Resume</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => alert(`Full profile for ${selectedCandidate.name}`)}
                    className="py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors text-center cursor-pointer"
                  >
                    View Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => alert(`Message sent to ${selectedCandidate.email}`)}
                    className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-500/20 transition-colors text-center cursor-pointer"
                  >
                    Send Message
                  </button>
                </div>

              </div>
            )}

          </div>

        </main>
      </div>

      {/* ============================================================== */}
      {/* 3. MODAL: ADD NEW JOB SEEKER                                   */}
      {/* ============================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 relative">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Add New Job Seeker</h3>
                <p className="text-xs text-slate-500 mt-0.5">Register a candidate manually to the platform</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSeeker} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newSeeker.name}
                  onChange={(e) => setNewSeeker({ ...newSeeker, name: e.target.value })}
                  placeholder="e.g. Anand Murugan"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={newSeeker.email}
                    onChange={(e) => setNewSeeker({ ...newSeeker, email: e.target.value })}
                    placeholder="candidate@gmail.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={newSeeker.phone}
                    onChange={(e) => setNewSeeker({ ...newSeeker, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">District</label>
                  <select
                    value={newSeeker.district}
                    onChange={(e) => setNewSeeker({ ...newSeeker, district: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                  >
                    <option value="Thoothukudi">Thoothukudi</option>
                    <option value="Tirunelveli">Tirunelveli</option>
                    <option value="Madurai">Madurai</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Coimbatore">Coimbatore</option>
                    <option value="Tiruchirappalli">Tiruchirappalli</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Qualification</label>
                  <select
                    value={newSeeker.qualification}
                    onChange={(e) => setNewSeeker({ ...newSeeker, qualification: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                  >
                    <option value="B.E. (CSE)">B.E. (CSE)</option>
                    <option value="B.Tech (IT)">B.Tech (IT)</option>
                    <option value="ITI (Electrician)">ITI (Electrician)</option>
                    <option value="Diploma (Mech)">Diploma (Mech)</option>
                    <option value="B.Sc (Nursing)">B.Sc (Nursing)</option>
                    <option value="12th">12th</option>
                    <option value="B.Com">B.Com</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Skills (comma separated)</label>
                <input
                  type="text"
                  value={newSeeker.skills}
                  onChange={(e) => setNewSeeker({ ...newSeeker, skills: e.target.value })}
                  placeholder="e.g. React, Node.js, SQL"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
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
                  Save Job Seeker
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
