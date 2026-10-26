import React, { useState, useMemo } from 'react';
import {
  Bookmark,
  Search,
  MapPin,
  Briefcase,
  IndianRupee,
  Send,
  CheckCircle2,
  Calendar,
  XCircle,
  MoreVertical,
  Trash2,
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Bell,
  Menu,
  BookOpen,
  Sparkles,
  ExternalLink,
  Share2,
  X,
  Check,
  Building2,
  Layers,
  Clock,
  RotateCcw
} from 'lucide-react';
import JobSeekerSidebar from './JobSeekerSidebar';
import kavinAvatar from '../assets/kavin_avatar.jpg';
import api from '../services/api';

export default function JobSeekerSavedJobs({
  onLogout,
  onNavigateTab,
  onNavigateHome
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Filters
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('All Job Types');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('Recently Saved');

  // Filter Dropdown Open states
  const [openDropdown, setOpenDropdown] = useState(null); // 'type', 'loc', 'cat', 'sort'

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Active Action Menu
  const [actionMenuJobId, setActionMenuJobId] = useState(null);

  // Modals
  const [viewDetailsJob, setViewDetailsJob] = useState(null);
  const [removeJobConfirm, setRemoveJobConfirm] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Saved Jobs State loaded dynamically from MySQL
  const [savedJobs, setSavedJobs] = useState([]);

  const fetchSavedJobs = () => {
    setIsLoading(true);
    api.getSavedJobs()
      .then((res) => {
        if (res && res.data) {
          const colors = [
            'border-l-[#1976D2]',
            'border-l-[#10B981]',
            'border-l-[#8B5CF6]',
            'border-l-[#FFA000]',
            'border-l-[#06B6D4]'
          ];

          const mapped = res.data.map((item, index) => {
            const job = item.jobListing || item.job_listing || {};
            const comp = job.company || {};
            const cat = job.category || {};
            const dist = job.district || {};

            let reqs = [];
            if (Array.isArray(job.requirements)) {
              reqs = job.requirements;
            } else if (typeof job.requirements === 'string') {
              try {
                const parsed = JSON.parse(job.requirements);
                reqs = Array.isArray(parsed) ? parsed : [job.requirements];
              } catch {
                reqs = [job.requirements];
              }
            } else {
              reqs = ['Relevant trade qualification or experience', 'Good communication & teamwork'];
            }

            const compName = comp.company_name || 'Verified Employer';
            const initials = compName
              .split(' ')
              .filter(Boolean)
              .map((w) => w[0])
              .join('')
              .slice(0, 3)
              .toUpperCase() || 'ST';

            return {
              id: item.id,
              realJobId: job.id,
              title: job.title || 'Technical Specialist',
              company: compName,
              industry: comp.industry || 'Industrial & Manufacturing',
              location: job.location || (dist.name ? `${dist.name}, TN` : 'Thoothukudi, TN'),
              type: job.job_type || 'Full-time',
              salary: job.salary_range || '₹18,000 – 25,000/month',
              category: cat.name || 'Technical',
              accentColor: colors[index % colors.length],
              logoText: initials,
              logoBg: 'bg-[#0A192F]',
              logoColor: 'text-white',
              status: 'Saved',
              statusDate: item.created_at
                ? `Saved on ${new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                : 'Recently Saved',
              statusIcon: 'bookmark',
              statusPillBg: 'bg-blue-50 text-blue-700 border-blue-200',
              description: job.description || 'Job opening available for immediate joining.',
              requirements: reqs
            };
          });
          setSavedJobs(mapped);
        }
      })
      .catch((err) => {
        console.warn('Live saved jobs fetch:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  React.useEffect(() => {
    fetchSavedJobs();
  }, []);

  // Remove saved job
  const handleRemoveSavedJob = async (jobId) => {
    const job = savedJobs.find((j) => j.id === jobId);
    if (job && job.realJobId) {
      try {
        await api.toggleSaveJob(job.realJobId);
      } catch (err) {
        console.warn('Error removing saved job:', err);
      }
    }
    setSavedJobs((prev) => prev.filter((j) => j.id !== jobId));
    setRemoveJobConfirm(null);
    showToast(`Removed "${job ? job.title : 'Job'}" from Saved Jobs`);
  };

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return savedJobs.filter((job) => {
      // Keyword
      const kw = searchKeyword.toLowerCase().trim();
      const matchesKeyword =
        !kw ||
        job.title.toLowerCase().includes(kw) ||
        job.company.toLowerCase().includes(kw) ||
        job.location.toLowerCase().includes(kw);

      // Job Type
      const matchesType =
        selectedJobType === 'All Job Types' || job.type === selectedJobType;

      // Location
      const matchesLoc =
        selectedLocation === 'All Locations' ||
        job.location.toLowerCase().includes(selectedLocation.split(',')[0].toLowerCase().trim());

      // Category
      const matchesCat =
        selectedCategory === 'All Categories' || job.category === selectedCategory;

      return matchesKeyword && matchesType && matchesLoc && matchesCat;
    });
  }, [savedJobs, searchKeyword, selectedJobType, selectedLocation, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans antialiased text-slate-800">
      {/* Job Seeker Sidebar with 'saved-jobs' active tab */}
      <JobSeekerSidebar
        activeTab="saved-jobs"
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

          {/* Right Header Icons */}
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
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                      <div>
                        <p className="text-slate-800 font-medium">
                          Application deadline closing soon for <span className="font-semibold text-slate-900">South Coast Industries</span>
                        </p>
                        <span className="text-slate-400 text-[10px] block mt-0.5">3 hours ago</span>
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
                <img
                  src={kavinAvatar}
                  alt="Kavin Raj"
                  className="w-10 h-10 rounded-full object-cover shadow-xs ring-1 ring-slate-200"
                />
                <ChevronDown className="w-4 h-4 text-slate-600" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="font-bold text-slate-900">Kavin Raj</p>
                    <p className="text-slate-500 truncate">kavinraj@gmail.com</p>
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

        {/* Main Content Area */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto space-y-6">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-medium animate-in fade-in slide-in-from-bottom-3 duration-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Heading & Top Right Widget matching Screenshot */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <Bookmark className="w-7 h-7 text-[#1976D2] fill-[#1976D2]/15 stroke-[2.2]" />
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Saved Jobs
                </h1>
              </div>
              <p className="text-sm sm:text-base text-slate-500 mt-1">
                Jobs you've saved for later. Don't miss your next opportunity!
              </p>
            </div>

            {/* Top Right Widget: 3 jobs saved matching Screenshot */}
            <div className="flex items-center justify-between gap-4 px-4 py-3 bg-blue-50/60 rounded-2xl border border-blue-200/90 shadow-2xs hover:bg-blue-50 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-[#1976D2] border border-blue-200 flex items-center justify-center flex-shrink-0 shadow-2xs">
                  <Bookmark className="w-5 h-5 fill-[#1976D2]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    {savedJobs.length} jobs saved
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Keep track of your interesting opportunities.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-blue-600 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
            </div>
          </div>

          {/* Filter Toolbar matching Screenshot */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="flex-1 flex items-center gap-3 px-3 py-1">
              <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Search saved jobs..."
                className="w-full text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
              />
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Filter 1: All Job Types */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === 'type' ? null : 'type')}
                  className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white transition-colors cursor-pointer"
                >
                  <span>{selectedJobType}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {openDropdown === 'type' && (
                  <div className="absolute top-full left-0 mt-1.5 w-40 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-40 text-xs">
                    {['All Job Types', 'Full-time', 'Part-time', 'Contract'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          setSelectedJobType(t);
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg font-medium ${
                          selectedJobType === t ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Filter 2: All Locations */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === 'loc' ? null : 'loc')}
                  className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white transition-colors cursor-pointer"
                >
                  <span>{selectedLocation}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {openDropdown === 'loc' && (
                  <div className="absolute top-full left-0 mt-1.5 w-48 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-40 text-xs">
                    {['All Locations', 'Thoothukudi', 'Tirunelveli', 'Madurai', 'Chennai'].map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => {
                          setSelectedLocation(l);
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg font-medium ${
                          selectedLocation === l ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Filter 3: All Categories */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === 'cat' ? null : 'cat')}
                  className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white transition-colors cursor-pointer"
                >
                  <span>{selectedCategory}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {openDropdown === 'cat' && (
                  <div className="absolute top-full left-0 mt-1.5 w-52 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-40 text-xs">
                    {[
                      'All Categories',
                      'Technical / Maintenance',
                      'IT / Software',
                      'Education & Teaching',
                      'Sales & Marketing'
                    ].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(c);
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg font-medium truncate ${
                          selectedCategory === c ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort: Recently Saved */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')}
                  className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white transition-colors cursor-pointer"
                >
                  <span className="font-bold text-slate-400">⇅</span>
                  <span>{sortBy}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {openDropdown === 'sort' && (
                  <div className="absolute top-full right-0 mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-40 text-xs">
                    {['Recently Saved', 'Highest Salary', 'Closing Soon'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setSortBy(s);
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg font-medium ${
                          sortBy === s ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Saved Job Cards Stack matching Screenshot */}
          <div className="space-y-4">
            {filteredJobs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                <Bookmark className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-800 text-base">No saved jobs found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {searchKeyword || selectedJobType !== 'All Job Types'
                    ? 'No jobs match your filter criteria. Try clearing the search filters.'
                    : 'You haven’t saved any jobs yet. Browse recommended jobs and click the bookmark icon to save them for later.'}
                </p>
                <button
                  type="button"
                  onClick={() => onNavigateTab && onNavigateTab('find-jobs')}
                  className="mt-2 px-5 py-2.5 bg-[#1976D2] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#1565C0] cursor-pointer"
                >
                  Explore Jobs
                </button>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className={`bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all border-l-4 ${job.accentColor} p-5 sm:p-6`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                    {/* Left: Logo & Job Info (5 cols) */}
                    <div className="lg:col-span-5 flex items-start gap-4">
                      {job.logoIcon === 'book' ? (
                        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0 text-amber-700 shadow-2xs">
                          <BookOpen className="w-7 h-7 stroke-[2]" />
                        </div>
                      ) : job.logoType === 'swirl' ? (
                        <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center flex-shrink-0 text-rose-500 shadow-2xs">
                          <Sparkles className="w-7 h-7 stroke-[2]" />
                        </div>
                      ) : (
                        <div
                          className={`w-14 h-14 rounded-2xl ${job.logoBg} ${job.logoColor} flex items-center justify-center font-black text-base tracking-wide flex-shrink-0 shadow-2xs`}
                        >
                          {job.logoText}
                        </div>
                      )}

                      <div className="min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer">
                          {job.title}
                        </h3>
                        <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
                          {job.company}
                        </p>

                        <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 mt-2.5 text-xs text-slate-600">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{job.location}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                            <span>{job.type}</span>
                          </span>
                        </div>

                        <div className="mt-2 text-xs font-semibold text-slate-800 flex items-center gap-1">
                          <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                          <span>{job.salary}</span>
                        </div>
                      </div>
                    </div>

                    {/* Middle Left: Application Status Pill & Date (2 cols) */}
                    <div className="lg:col-span-2 flex flex-col items-start lg:items-center justify-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${job.statusPillBg}`}
                      >
                        {job.statusIcon === 'send' && <Send className="w-3 h-3" />}
                        {job.statusIcon === 'check' && <Check className="w-3 h-3 stroke-[2.5]" />}
                        {job.statusIcon === 'calendar' && <Calendar className="w-3 h-3" />}
                        {job.statusIcon === 'x' && <X className="w-3 h-3 stroke-[2.5]" />}
                        <span>{job.status}</span>
                      </span>

                      <span className="text-[11px] text-slate-400 mt-1.5 font-medium">
                        {job.statusDate}
                      </span>
                    </div>

                    {/* Middle Right: Brief Description & View Details link (3 cols) */}
                    <div className="lg:col-span-3 space-y-1.5">
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {job.description}
                      </p>
                      <button
                        type="button"
                        onClick={() => setViewDetailsJob(job)}
                        className="text-xs font-bold text-[#1976D2] hover:text-[#1565C0] flex items-center gap-1 cursor-pointer group"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>

                    {/* Far Right: Actions & Remove Button (2 cols) */}
                    <div className="lg:col-span-2 flex items-center justify-between lg:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                      {/* Three-dots menu */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() =>
                            setActionMenuJobId(actionMenuJobId === job.id ? null : job.id)
                          }
                          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                          aria-label="Options"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {actionMenuJobId === job.id && (
                          <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-40 text-xs">
                            <button
                              type="button"
                              onClick={() => {
                                setActionMenuJobId(null);
                                setViewDetailsJob(job);
                              }}
                              className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-50"
                            >
                              Job Overview
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setActionMenuJobId(null);
                                navigator.clipboard.writeText(window.location.href);
                                showToast('Job link copied!');
                              }}
                              className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-50"
                            >
                              Copy Link
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Remove Button matching Screenshot */}
                      <button
                        type="button"
                        onClick={() => setRemoveJobConfirm(job)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#EBF5FF] text-[#1976D2] hover:bg-red-50 hover:text-red-600 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bottom Pagination matching Screenshot */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200/80">
            <span className="text-xs text-slate-500 font-medium">
              Showing 1 to {filteredJobs.length} of {savedJobs.length} saved jobs
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                className="w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center bg-[#1976D2] text-white shadow-xs cursor-pointer"
              >
                1
              </button>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => p + 1)}
                className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Remove Confirmation Dialog */}
      {removeJobConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 text-center">
              Remove Saved Job?
            </h3>
            <p className="text-xs text-slate-500 text-center mt-2 leading-relaxed">
              Remove <span className="font-bold text-slate-800">{removeJobConfirm.title}</span> at{' '}
              <span className="font-bold text-slate-800">{removeJobConfirm.company}</span> from your saved jobs collection?
            </p>

            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setRemoveJobConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleRemoveSavedJob(removeJobConfirm.id)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job Details Modal */}
      {viewDetailsJob && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900">
                {viewDetailsJob.title}
              </h3>
              <button
                type="button"
                onClick={() => setViewDetailsJob(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900">{viewDetailsJob.company}</h4>
                  <p className="text-xs text-slate-500">{viewDetailsJob.location} • {viewDetailsJob.type}</p>
                </div>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl">
                  {viewDetailsJob.salary}
                </span>
              </div>

              <div>
                <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Job Description
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {viewDetailsJob.description}
                </p>
              </div>

              {viewDetailsJob.requirements && (
                <div>
                  <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                    Requirements
                  </h5>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {viewDetailsJob.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-slate-400 font-bold">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-4 mt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setViewDetailsJob(null);
                  if (onNavigateTab) onNavigateTab('find-jobs');
                }}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Open in Find Jobs →
              </button>

              <button
                type="button"
                onClick={() => setViewDetailsJob(null)}
                className="px-5 py-2 text-xs font-bold text-white bg-[#1976D2] hover:bg-[#1565C0] rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
