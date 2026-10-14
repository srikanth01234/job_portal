import React, { useState } from 'react';
import {
  Search,
  Calendar,
  Bell,
  ChevronDown,
  Menu,
  Plus,
  MoreVertical,
  X,
  ChevronLeft,
  ChevronRight,
  Info,
  Monitor,
  HardHat,
  Factory,
  HeartPulse,
  GraduationCap,
  Store,
  Truck,
  Sprout,
  Briefcase,
  Layers,
  ChevronUp,
} from 'lucide-react';
import AdminSidebar from './AdminSidebar';

// Complete 38 Tamil Nadu Districts
const ALL_DISTRICTS = [
  { id: 1, name: 'Ariyalur', totalJobs: 128, active: true },
  { id: 2, name: 'Chengalpattu', totalJobs: 642, active: true },
  { id: 3, name: 'Chennai', totalJobs: 2581, active: true },
  { id: 4, name: 'Coimbatore', totalJobs: 1942, active: true },
  { id: 5, name: 'Cuddalore', totalJobs: 310, active: true },
  { id: 6, name: 'Dharmapuri', totalJobs: 246, active: true },
  { id: 7, name: 'Dindigul', totalJobs: 409, active: true },
  { id: 8, name: 'Erode', totalJobs: 498, active: true },
  { id: 9, name: 'Kallakurichi', totalJobs: 180, active: false },
  { id: 10, name: 'Kancheepuram', totalJobs: 736, active: true },
  { id: 11, name: 'Karur', totalJobs: 285, active: true },
  { id: 12, name: 'Krishnagiri', totalJobs: 520, active: true },
  { id: 13, name: 'Madurai', totalJobs: 1450, active: true },
  { id: 14, name: 'Nagapattinam', totalJobs: 165, active: true },
  { id: 15, name: 'Kanyakumari', totalJobs: 390, active: true },
  { id: 16, name: 'Namakkal', totalJobs: 340, active: true },
  { id: 17, name: 'Perambalur', totalJobs: 115, active: true },
  { id: 18, name: 'Pudukkottai', totalJobs: 210, active: true },
  { id: 19, name: 'Ramanathapuram', totalJobs: 195, active: true },
  { id: 20, name: 'Ranipet', totalJobs: 430, active: true },
  { id: 21, name: 'Salem', totalJobs: 890, active: true },
  { id: 22, name: 'Sivaganga', totalJobs: 175, active: true },
  { id: 23, name: 'Tenkasi', totalJobs: 230, active: true },
  { id: 24, name: 'Thanjavur', totalJobs: 420, active: true },
  { id: 25, name: 'Theni', totalJobs: 190, active: true },
  { id: 26, name: 'Thoothukudi', totalJobs: 980, active: true },
  { id: 27, name: 'Tiruchirappalli', totalJobs: 1120, active: true },
  { id: 28, name: 'Tirunelveli', totalJobs: 870, active: true },
  { id: 29, name: 'Tirupathur', totalJobs: 240, active: true },
  { id: 30, name: 'Tiruppur', totalJobs: 1260, active: true },
  { id: 31, name: 'Tiruvallur', totalJobs: 780, active: true },
  { id: 32, name: 'Tiruvannamalai', totalJobs: 310, active: true },
  { id: 33, name: 'Tiruvarur', totalJobs: 140, active: true },
  { id: 34, name: 'Vellore', totalJobs: 650, active: true },
  { id: 35, name: 'Viluppuram', totalJobs: 280, active: true },
  { id: 36, name: 'Virudhunagar', totalJobs: 460, active: true },
  { id: 37, name: 'Nilgiris', totalJobs: 170, active: true },
  { id: 38, name: 'Mayiladuthurai', totalJobs: 155, active: true },
];

// 12 Job Categories Data
const INITIAL_CATEGORIES = [
  {
    id: 1,
    name: 'IT & Software',
    icon: Monitor,
    iconBg: 'bg-blue-50 text-blue-600',
    totalJobs: 1248,
    active: true,
    subCategories: [
      'Frontend Development',
      'Backend Systems',
      'Mobile Apps',
      'Cloud & DevOps',
      'QA & Testing',
      'UI/UX Design',
      'Data Science',
      'Cybersecurity',
    ],
  },
  {
    id: 2,
    name: 'Construction & Engineering',
    icon: HardHat,
    iconBg: 'bg-amber-50 text-amber-600',
    totalJobs: 982,
    active: true,
    subCategories: [
      'Civil Engineering',
      'Site Supervision',
      'Structural Drafting',
      'HVAC & Plumbing',
      'Electrical Contracting',
      'Heavy Equipment',
    ],
  },
  {
    id: 3,
    name: 'Manufacturing',
    icon: Factory,
    iconBg: 'bg-purple-50 text-purple-600',
    totalJobs: 864,
    active: true,
    subCategories: [
      'CNC Machining',
      'Welding & Fabrication',
      'Tool & Die',
      'Assembly Line',
      'Quality Inspection',
    ],
  },
  {
    id: 4,
    name: 'Healthcare',
    icon: HeartPulse,
    iconBg: 'bg-rose-50 text-rose-600',
    totalJobs: 756,
    active: true,
    subCategories: [
      'Nursing Care',
      'Pharmacy Support',
      'Lab Diagnostics',
      'Patient Coordination',
    ],
  },
  {
    id: 5,
    name: 'Education & Training',
    icon: GraduationCap,
    iconBg: 'bg-emerald-50 text-emerald-600',
    totalJobs: 642,
    active: true,
    subCategories: [
      'Primary Education',
      'Vocational Training',
      'Academic Tutoring',
      'Corporate Coaching',
    ],
  },
  {
    id: 6,
    name: 'Retail & Sales',
    icon: Store,
    iconBg: 'bg-orange-50 text-orange-600',
    totalJobs: 520,
    active: true,
    subCategories: [
      'Store Associate',
      'Counter Sales',
      'Cashier & Billing',
      'Merchandising',
      'Field Sales',
    ],
  },
  {
    id: 7,
    name: 'Transportation & Logistics',
    icon: Truck,
    iconBg: 'bg-sky-50 text-sky-600',
    totalJobs: 486,
    active: true,
    subCategories: [
      'Heavy Vehicle Driving',
      'Forklift Operating',
      'Warehouse Dispatch',
      'Fleet Logistics',
    ],
  },
  {
    id: 8,
    name: 'Agriculture & Farming',
    icon: Sprout,
    iconBg: 'bg-teal-50 text-teal-600',
    totalJobs: 310,
    active: true,
    subCategories: [
      'Crop Harvesting',
      'Dairy Farm Operations',
      'Agro Machinery',
    ],
  },
  {
    id: 9,
    name: 'Hospitality & Tourism',
    icon: Store,
    iconBg: 'bg-indigo-50 text-indigo-600',
    totalJobs: 295,
    active: true,
    subCategories: ['Front Desk', 'Housekeeping', 'Culinary & Chef', 'Event Management'],
  },
  {
    id: 10,
    name: 'Automotive Services',
    icon: Factory,
    iconBg: 'bg-slate-100 text-slate-700',
    totalJobs: 280,
    active: true,
    subCategories: ['Auto Mechanics', 'Electrical Diagnostics', 'Body Paint & Repair'],
  },
  {
    id: 11,
    name: 'Customer Support',
    icon: Monitor,
    iconBg: 'bg-blue-50 text-blue-600',
    totalJobs: 260,
    active: true,
    subCategories: ['Voice Support', 'Chat & Email', 'Technical Helpdesk'],
  },
  {
    id: 12,
    name: 'Security & Facilities',
    icon: HardHat,
    iconBg: 'bg-slate-100 text-slate-700',
    totalJobs: 220,
    active: true,
    subCategories: ['Security Guard', 'Facility Supervisor', 'Surveillance Operations'],
  },
];

export default function AdminDistrictsCategories({ onLogout, onNavigateHome, onNavigateTab }) {
  const [districts, setDistricts] = useState(ALL_DISTRICTS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [selectedDistrictId, setSelectedDistrictId] = useState(3); // Default Chennai selected
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Search & Sorting States
  const [globalSearch, setGlobalSearch] = useState('');
  const [districtSearch, setDistrictSearch] = useState('');
  const [districtSort, setDistrictSort] = useState('name-asc');
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);

  // Pagination States
  const [districtPage, setDistrictPage] = useState(1);
  const [categoryPage, setCategoryPage] = useState(1);
  const districtsPerPage = 10;
  const categoriesPerPage = 8;

  // Header States
  const [dateRange, setDateRange] = useState('Oct 01, 2026 - Oct 31, 2026');
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [activeDistrictMenu, setActiveDistrictMenu] = useState(null);
  const [activeCategoryMenu, setActiveCategoryMenu] = useState(null);

  // Modals
  const [isAddDistrictModalOpen, setIsAddDistrictModalOpen] = useState(false);
  const [newDistrictName, setNewDistrictName] = useState('');
  const [newDistrictJobs, setNewDistrictJobs] = useState(100);

  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubCategories, setNewSubCategories] = useState('');

  // Toggle District Active Switch
  const handleToggleDistrict = (id, e) => {
    if (e) e.stopPropagation();
    setDistricts(
      districts.map((d) => (d.id === id ? { ...d, active: !d.active } : d))
    );
  };

  // Toggle Category Active Switch
  const handleToggleCategory = (id, e) => {
    if (e) e.stopPropagation();
    setCategories(
      categories.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  };

  // Filtered & Sorted Districts
  const filteredDistricts = districts
    .filter((d) => {
      const q = (districtSearch || globalSearch).toLowerCase().trim();
      return !q || d.name.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (districtSort === 'name-asc') return a.name.localeCompare(b.name);
      if (districtSort === 'name-desc') return b.name.localeCompare(a.name);
      if (districtSort === 'jobs-desc') return b.totalJobs - a.totalJobs;
      if (districtSort === 'jobs-asc') return a.totalJobs - b.totalJobs;
      return 0;
    });

  const paginatedDistricts = filteredDistricts.slice(
    (districtPage - 1) * districtsPerPage,
    districtPage * districtsPerPage
  );

  // Filtered Categories
  const filteredCategories = categories.filter((c) => {
    const q = globalSearch.toLowerCase().trim();
    if (!q) return true;
    const matchName = c.name.toLowerCase().includes(q);
    const matchSub = c.subCategories.some((s) => s.toLowerCase().includes(q));
    return matchName || matchSub;
  });

  const paginatedCategories = filteredCategories.slice(
    (categoryPage - 1) * categoriesPerPage,
    categoryPage * categoriesPerPage
  );

  // Add District Submit
  const handleAddDistrict = (e) => {
    e.preventDefault();
    if (!newDistrictName.trim()) return;
    const created = {
      id: Date.now(),
      name: newDistrictName.trim(),
      totalJobs: Number(newDistrictJobs) || 0,
      active: true,
    };
    setDistricts([...districts, created]);
    setIsAddDistrictModalOpen(false);
    setNewDistrictName('');
    setNewDistrictJobs(100);
  };

  // Add Category Submit
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const subList = newSubCategories
      ? newSubCategories.split(',').map((s) => s.trim()).filter(Boolean)
      : ['General'];

    const created = {
      id: Date.now(),
      name: newCategoryName.trim(),
      icon: Briefcase,
      iconBg: 'bg-blue-50 text-blue-600',
      totalJobs: 0,
      active: true,
      subCategories: subList,
    };

    setCategories([...categories, created]);
    setIsAddCategoryModalOpen(false);
    setNewCategoryName('');
    setNewSubCategories('');
  };

  return (
    <div className="min-h-screen bg-[#F4F6FA] flex font-sans">
      
      {/* ============================================================== */}
      {/* 1. SEPARATE REUSABLE SIDEBAR COMPONENT                         */}
      {/* ============================================================== */}
      <AdminSidebar
        activeTab="districts"
        onSelectTab={(tabId) => {
          if (onNavigateTab) {
            onNavigateTab(tabId);
          } else if (tabId === 'dashboard') {
            window.location.pathname = '/admin-dashboard';
          } else if (tabId === 'job-seekers') {
            window.location.pathname = '/admin/job-seekers';
          } else if (tabId === 'companies') {
            window.location.pathname = '/admin/companies';
          } else if (tabId === 'jobs') {
            window.location.pathname = '/admin/job-listings';
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
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search districts or categories..."
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
              onClick={() => alert('All regional locations active.')}
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
          
          {/* Breadcrumb + Page Header & Info Alert Box */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1">
                <span>Home</span>
                <span>›</span>
                <span className="text-slate-600 font-semibold">Districts & Categories</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                Districts & Categories
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Manage districts and job categories used across the platform.
              </p>
            </div>

            {/* Info Alert Box */}
            <div className="inline-flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-blue-900 text-xs font-medium max-w-xl">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>
                These settings are used for job postings, company profiles and job seeker location preferences.
              </span>
            </div>
          </div>

          {/* ============================================================== */}
          {/* DUAL PANELS GRID (50% Districts | 50% Job Categories)          */}
          {/* ============================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            
            {/* ----------------- LEFT PANEL: Districts (38) ----------------- */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
              
              <div>
                {/* Title & Add District Button */}
                <div className="flex items-center justify-between gap-4 mb-1">
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-lg font-bold text-slate-900">Districts</h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-extrabold">
                      {districts.length}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddDistrictModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1976D2] hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-500/20 transition-all cursor-pointer active:scale-[0.98]"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Add District</span>
                  </button>
                </div>
                <p className="text-xs text-slate-400 font-medium mb-4">
                  Manage Tamil Nadu districts for job locations.
                </p>

                {/* Filter Controls: Search & Sort */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={districtSearch}
                      onChange={(e) => {
                        setDistrictSearch(e.target.value);
                        setDistrictPage(1);
                      }}
                      placeholder="Search district name..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>

                  <div className="relative flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">Sort by</span>
                    <select
                      value={districtSort}
                      onChange={(e) => setDistrictSort(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="name-asc">Name (A-Z)</option>
                      <option value="name-desc">Name (Z-A)</option>
                      <option value="jobs-desc">Jobs (High to Low)</option>
                      <option value="jobs-asc">Jobs (Low to High)</option>
                    </select>
                  </div>
                </div>

                {/* Districts Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="text-xs font-semibold text-slate-400 border-b border-slate-100 pb-3">
                        <th className="pb-3 w-8 font-medium">#</th>
                        <th className="pb-3 font-semibold">District Name</th>
                        <th className="pb-3 font-semibold">Total Jobs</th>
                        <th className="pb-3 font-semibold">Status</th>
                        <th className="pb-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedDistricts.map((d, idx) => {
                        const globalIndex = (districtPage - 1) * districtsPerPage + idx + 1;
                        const isSelected = selectedDistrictId === d.id;

                        return (
                          <tr
                            key={d.id}
                            onClick={() => setSelectedDistrictId(d.id)}
                            className={`cursor-pointer transition-colors group ${
                              isSelected ? 'bg-blue-50/60 font-medium' : 'hover:bg-slate-50/70'
                            }`}
                          >
                            <td className="py-3 pr-2 text-slate-400 text-xs">{globalIndex}</td>
                            <td className="py-3 px-2 font-bold text-slate-800 text-xs sm:text-sm group-hover:text-blue-600 transition-colors">
                              {d.name}
                            </td>
                            <td className="py-3 px-2 text-slate-600 text-xs font-medium">
                              {d.totalJobs.toLocaleString()}
                            </td>
                            <td className="py-3 px-2">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                  d.active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                }`}
                              >
                                {d.active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="py-3 pl-2 text-right relative" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end gap-2">
                                {/* Toggle Switch */}
                                <button
                                  type="button"
                                  onClick={(e) => handleToggleDistrict(d.id, e)}
                                  className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                                    d.active ? 'bg-blue-600' : 'bg-slate-300'
                                  }`}
                                  title={d.active ? 'Deactivate district' : 'Activate district'}
                                >
                                  <div
                                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                                      d.active ? 'translate-x-4' : 'translate-x-0'
                                    }`}
                                  />
                                </button>

                                {/* 3-dots */}
                                <button
                                  onClick={() => setActiveDistrictMenu(activeDistrictMenu === d.id ? null : d.id)}
                                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                                >
                                  <MoreVertical className="w-3.5 h-3.5" />
                                </button>

                                {activeDistrictMenu === d.id && (
                                  <div
                                    className="absolute right-0 top-8 w-32 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-30 text-left animate-fadeIn"
                                    onMouseLeave={() => setActiveDistrictMenu(null)}
                                  >
                                    <button
                                      onClick={() => {
                                        alert(`Editing ${d.name}`);
                                        setActiveDistrictMenu(null);
                                      }}
                                      className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 text-left font-medium block"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleToggleDistrict(d.id);
                                        setActiveDistrictMenu(null);
                                      }}
                                      className="w-full px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 text-left font-medium block"
                                    >
                                      Toggle Status
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Districts Pagination */}
              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Showing {(districtPage - 1) * districtsPerPage + 1} to{' '}
                  {Math.min(districtPage * districtsPerPage, filteredDistricts.length)} of{' '}
                  {filteredDistricts.length} districts
                </span>

                <div className="flex items-center gap-1">
                  <button
                    disabled={districtPage === 1}
                    onClick={() => setDistrictPage(districtPage - 1)}
                    className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  {[1, 2, 3, 4].map((p) => (
                    <button
                      key={p}
                      onClick={() => setDistrictPage(p)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-colors cursor-pointer ${
                        districtPage === p
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    disabled={districtPage === 4}
                    onClick={() => setDistrictPage(districtPage + 1)}
                    className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

            {/* ----------------- RIGHT PANEL: Job Categories (12) ----------------- */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
              
              <div>
                {/* Title & Add Category Button */}
                <div className="flex items-center justify-between gap-4 mb-1">
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-lg font-bold text-slate-900">Job Categories</h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-extrabold">
                      {categories.length}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddCategoryModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1976D2] hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-500/20 transition-all cursor-pointer active:scale-[0.98]"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Add Category</span>
                  </button>
                </div>
                <p className="text-xs text-slate-400 font-medium mb-4">
                  Manage job categories and sub-categories.
                </p>

                {/* Categories Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="text-xs font-semibold text-slate-400 border-b border-slate-100 pb-3">
                        <th className="pb-3 w-8 font-medium">#</th>
                        <th className="pb-3 font-semibold">Category Name</th>
                        <th className="pb-3 font-semibold">Sub-categories</th>
                        <th className="pb-3 font-semibold">Total Jobs</th>
                        <th className="pb-3 font-semibold">Status</th>
                        <th className="pb-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedCategories.map((c, idx) => {
                        const globalIndex = (categoryPage - 1) * categoriesPerPage + idx + 1;
                        const Icon = c.icon;
                        const isExpanded = expandedCategoryId === c.id;

                        return (
                          <React.Fragment key={c.id}>
                            <tr className="hover:bg-slate-50/70 transition-colors group">
                              <td className="py-3 pr-2 text-slate-400 text-xs">{globalIndex}</td>
                              
                              {/* Category Name with Icon */}
                              <td className="py-3 px-2">
                                <div className="flex items-center gap-2.5">
                                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-2xs ${c.iconBg}`}>
                                    <Icon className="w-4 h-4" />
                                  </div>
                                  <span className="font-bold text-slate-800 text-xs sm:text-sm group-hover:text-blue-600 transition-colors">
                                    {c.name}
                                  </span>
                                </div>
                              </td>

                              {/* Sub-categories dropdown trigger */}
                              <td className="py-3 px-2">
                                <button
                                  type="button"
                                  onClick={() => setExpandedCategoryId(isExpanded ? null : c.id)}
                                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-[11px] font-semibold text-slate-600 transition-colors cursor-pointer"
                                >
                                  <span>{c.subCategories.length} sub-categories</span>
                                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3 text-slate-400" />}
                                </button>
                              </td>

                              {/* Total Jobs */}
                              <td className="py-3 px-2 text-slate-600 text-xs font-medium">
                                {c.totalJobs.toLocaleString()}
                              </td>

                              {/* Status Badge */}
                              <td className="py-3 px-2">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                    c.active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                  }`}
                                >
                                  {c.active ? 'Active' : 'Inactive'}
                                </span>
                              </td>

                              {/* Action Switch & 3-dots */}
                              <td className="py-3 pl-2 text-right relative">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={(e) => handleToggleCategory(c.id, e)}
                                    className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                                      c.active ? 'bg-blue-600' : 'bg-slate-300'
                                    }`}
                                    title={c.active ? 'Deactivate category' : 'Activate category'}
                                  >
                                    <div
                                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                                        c.active ? 'translate-x-4' : 'translate-x-0'
                                      }`}
                                    />
                                  </button>

                                  <button
                                    onClick={() => setActiveCategoryMenu(activeCategoryMenu === c.id ? null : c.id)}
                                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                                  >
                                    <MoreVertical className="w-3.5 h-3.5" />
                                  </button>

                                  {activeCategoryMenu === c.id && (
                                    <div
                                      className="absolute right-0 top-8 w-32 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-30 text-left animate-fadeIn"
                                      onMouseLeave={() => setActiveCategoryMenu(null)}
                                    >
                                      <button
                                        onClick={() => {
                                          alert(`Editing ${c.name}`);
                                          setActiveCategoryMenu(null);
                                        }}
                                        className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 text-left font-medium block"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => {
                                          handleToggleCategory(c.id);
                                          setActiveCategoryMenu(null);
                                        }}
                                        className="w-full px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 text-left font-medium block"
                                      >
                                        Toggle Status
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>

                            {/* Sub-categories Expandable Accordion Tray */}
                            {isExpanded && (
                              <tr className="bg-slate-50/90 animate-fadeIn">
                                <td colSpan={6} className="p-3 pl-12">
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-2">
                                      Sub-Categories:
                                    </span>
                                    {c.subCategories.map((sub) => (
                                      <span
                                        key={sub}
                                        className="px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[11px] font-medium shadow-2xs"
                                      >
                                        {sub}
                                      </span>
                                    ))}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Categories Pagination */}
              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Showing {(categoryPage - 1) * categoriesPerPage + 1} to{' '}
                  {Math.min(categoryPage * categoriesPerPage, filteredCategories.length)} of{' '}
                  {filteredCategories.length} categories
                </span>

                <div className="flex items-center gap-1">
                  <button
                    disabled={categoryPage === 1}
                    onClick={() => setCategoryPage(categoryPage - 1)}
                    className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  {[1, 2].map((p) => (
                    <button
                      key={p}
                      onClick={() => setCategoryPage(p)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-colors cursor-pointer ${
                        categoryPage === p
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    disabled={categoryPage === 2}
                    onClick={() => setCategoryPage(categoryPage + 1)}
                    className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

          </div>

        </main>
      </div>

      {/* ============================================================== */}
      {/* 3. MODAL: ADD DISTRICT                                         */}
      {/* ============================================================== */}
      {isAddDistrictModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Add New District</h3>
                <p className="text-xs text-slate-500 mt-0.5">Register a new district for Tamil Nadu job postings</p>
              </div>
              <button
                onClick={() => setIsAddDistrictModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDistrict} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">District Name</label>
                <input
                  type="text"
                  required
                  value={newDistrictName}
                  onChange={(e) => setNewDistrictName(e.target.value)}
                  placeholder="e.g. Sivakasi"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Initial Active Jobs</label>
                <input
                  type="number"
                  min="0"
                  value={newDistrictJobs}
                  onChange={(e) => setNewDistrictJobs(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddDistrictModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  Save District
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. MODAL: ADD CATEGORY                                         */}
      {/* ============================================================== */}
      {isAddCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Add New Category</h3>
                <p className="text-xs text-slate-500 mt-0.5">Define a primary skilled trade or job industry</p>
              </div>
              <button
                onClick={() => setIsAddCategoryModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Renewable Energy & Solar"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sub-categories (comma-separated)</label>
                <input
                  type="text"
                  value={newSubCategories}
                  onChange={(e) => setNewSubCategories(e.target.value)}
                  placeholder="e.g. Solar PV Installer, Wind Turbine Tech"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
