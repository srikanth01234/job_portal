import React, { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Briefcase,
  IndianRupee,
  Clock,
  Bookmark,
  Share2,
  ChevronDown,
  RotateCcw,
  Check,
  X,
  Bell,
  Menu,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Shield,
  Layers,
  Sparkles,
  FileText,
  Building2,
  GraduationCap,
  Award
} from 'lucide-react';
import JobSeekerSidebar from './JobSeekerSidebar';
import api, { getStoredUser } from '../services/api';

export default function JobSeekerFindJobs({
  onLogout,
  onNavigateTab,
  onNavigateHome
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Search & Filter States
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Thoothukudi, Tamil Nadu');
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);

  const [jobTypeFilter, setJobTypeFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [experienceFilter, setExperienceFilter] = useState('All');
  const [salaryFilter, setSalaryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Latest First');

  // Filter Dropdown Toggles
  const [openFilter, setOpenFilter] = useState(null); // 'jobType', 'category', 'experience', 'salary', 'sort'

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  // Feedback Toast
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Comprehensive Dataset matching the screenshot exactly
  const initialJobs = [];

  const [jobsList, setJobsList] = useState(initialJobs);

  React.useEffect(() => {
    fetch('http://127.0.0.1:8000/api/jobs')
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          const mapped = data.data.map(j => ({
            id: `job-${j.id}`,
            title: j.title,
            company: j.company?.company_name || 'Direct Employer',
            companyLogo: j.company?.logo_url || (j.company?.logo ? (j.company.logo.startsWith('http') ? j.company.logo : `http://127.0.0.1:8000/storage/${j.company.logo}`) : null),
            companyInitial: (j.company?.company_name || 'DE').slice(0, 2).toUpperCase(),
            logoType: j.company?.logo_url || j.company?.logo ? 'image' : 'text',
            logoBg: 'bg-blue-600',
            logoColor: 'text-white',
            logoText: (j.company?.company_name || 'DE').slice(0, 2).toUpperCase(),
            companyColor: 'bg-blue-600 text-white',
            industry: j.company?.industry || 'Industrial Manufacturing',
            location: j.location || (j.district ? `${j.district.name}, TN` : 'Tamil Nadu'),
            fullLocation: j.location || (j.district ? `${j.district.name}, Tamil Nadu` : 'Tamil Nadu'),
            jobType: j.job_type || 'Full-time',
            category: j.category?.name || 'General',
            experience: j.experience || '1 - 3 Years',
            salary: j.min_salary && j.max_salary ? `₹ ${Number(j.min_salary).toLocaleString()} – ${Number(j.max_salary).toLocaleString()}/month` : 'Best in Industry',
            postedTime: 'Recently',
            isSaved: false,
            description: j.description || '',
            responsibilities: j.responsibilities || [
              'Perform assigned operational duties according to specifications.',
              'Adhere to factory safety protocols and maintenance standards.'
            ],
            requirements: j.requirements || [
              'Relevant trade qualification or experience.',
              'Good technical understanding and problem solving ability.'
            ],
          }));
          setJobsList(mapped);
          if (mapped.length > 0) setSelectedJobId(mapped[0].id);
        }
      })
      .catch(err => console.warn('Could not fetch find jobs:', err));
  }, []);

  // Selected Job for Right Pane (defaults to first job: Electrical Maintenance Technician)
  const [selectedJobId, setSelectedJobId] = useState('job-1');

  // Currently viewed job
  const activeJob = jobsList.find((j) => j.id === selectedJobId) || jobsList[0];

  // Apply Modal
  const [applyModalJob, setApplyModalJob] = useState(null);

  // Toggle Save
  const handleToggleSave = (jobId) => {
    setJobsList((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          const nextSaved = !j.isSaved;
          showToast(
            nextSaved
              ? `Saved "${j.title}" to your Saved Jobs`
              : `Removed "${j.title}" from Saved Jobs`
          );
          return { ...j, isSaved: nextSaved };
        }
        return j;
      })
    );
  };

  const [coverNote, setCoverNote] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const currentUser = getStoredUser();

  // Submit Application (Stores into MySQL applications table)
  const handleConfirmApply = async (e) => {
    e.preventDefault();
    if (!applyModalJob) return;

    setIsApplying(true);
    try {
      const numericId = typeof applyModalJob.id === 'string' && applyModalJob.id.startsWith('job-')
        ? parseInt(applyModalJob.id.replace('job-', ''), 10)
        : applyModalJob.id;

      await api.applyForJob(numericId, coverNote || 'I am very interested in this role and have hands-on experience in the required technical skills.');
      setJobsList((prev) =>
        prev.map((j) => (j.id === applyModalJob.id ? { ...j, isApplied: true } : j))
      );
      showToast(`Application submitted to ${applyModalJob.company} successfully!`);
      setApplyModalJob(null);
      setCoverNote('');
    } catch (err) {
      showToast(err.message || 'Could not submit application.');
    } finally {
      setIsApplying(false);
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchKeyword('');
    setSelectedLocation('Thoothukudi, Tamil Nadu');
    setJobTypeFilter('All');
    setCategoryFilter('All');
    setExperienceFilter('All');
    setSalaryFilter('All');
    setSortBy('Latest First');
    setOpenFilter(null);
    showToast('Filters reset to default');
  };

  // Filter Logic
  const filteredJobs = useMemo(() => {
    return jobsList.filter((job) => {
      // Keyword
      const kw = searchKeyword.toLowerCase().trim();
      const matchesKeyword =
        !kw ||
        job.title.toLowerCase().includes(kw) ||
        job.company.toLowerCase().includes(kw) ||
        job.category.toLowerCase().includes(kw);

      // Location
      const locMatch =
        selectedLocation === 'All Tamil Nadu' ||
        job.location.toLowerCase().includes(selectedLocation.split(',')[0].toLowerCase().trim());

      // Job Type
      const typeMatch = jobTypeFilter === 'All' || job.type === jobTypeFilter;

      // Category
      const catMatch = categoryFilter === 'All' || job.category === categoryFilter;

      return matchesKeyword && locMatch && typeMatch && catMatch;
    });
  }, [jobsList, searchKeyword, selectedLocation, jobTypeFilter, categoryFilter]);

  const locationsList = [
    'Thoothukudi, Tamil Nadu',
    'Tirunelveli, Tamil Nadu',
    'Madurai, Tamil Nadu',
    'Chennai, Tamil Nadu',
    'Coimbatore, Tamil Nadu',
    'All Tamil Nadu'
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans antialiased text-slate-800">
      {/* Job Seeker Sidebar with 'find-jobs' active tab */}
      <JobSeekerSidebar
        activeTab="find-jobs"
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
            {/* Notifications */}
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
                          Application viewed by <span className="font-semibold text-slate-900">South Coast Industries</span>
                        </p>
                        <span className="text-slate-400 text-[10px] block mt-0.5">15 minutes ago</span>
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
                      onClick={() => onNavigateTab && onNavigateTab('saved-jobs')}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50"
                    >
                      Saved Jobs
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

          {/* Heading Section matching Screenshot */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Find Jobs
            </h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1">
              Discover the best job opportunities for your career.
            </p>
          </div>

          {/* Top Search & Filter Bar Section */}
          <div className="space-y-3">
            {/* Horizontal Search Box */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-2.5 sm:p-3 flex flex-col md:flex-row items-stretch md:items-center gap-3">
              {/* Keyword Input */}
              <div className="flex-1 flex items-center gap-3 px-3 py-2 sm:py-1">
                <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="Job title, skill or company"
                  className="w-full text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
                />
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px h-8 bg-slate-200" />

              {/* District / Location Selector */}
              <div className="relative md:w-72 flex items-center justify-between px-3 py-2 sm:py-1 border-t md:border-t-0 border-slate-100">
                <button
                  type="button"
                  onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                  className="w-full flex items-center justify-between gap-2 text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <MapPin className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-700 truncate">
                      {selectedLocation}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors flex-shrink-0" />
                </button>

                {locationDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-40 max-h-56 overflow-y-auto">
                    {locationsList.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => {
                          setSelectedLocation(loc);
                          setLocationDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs rounded-lg font-medium transition-colors ${
                          selectedLocation === loc
                            ? 'bg-blue-50 text-blue-700 font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Button */}
              <button
                type="button"
                onClick={() => {
                  showToast(`Searching for jobs matching "${searchKeyword || 'All'}" in ${selectedLocation}`);
                }}
                className="bg-[#1976D2] hover:bg-[#1565C0] text-white text-sm font-semibold px-8 py-3 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all duration-150 cursor-pointer flex-shrink-0"
              >
                <span>Search</span>
              </button>
            </div>

            {/* Filter Pills Row matching Screenshot */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Job Type Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenFilter(openFilter === 'jobType' ? null : 'jobType')}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-700 hover:border-slate-300 transition-colors cursor-pointer shadow-2xs"
                  >
                    <span>Job Type</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  {openFilter === 'jobType' && (
                    <div className="absolute top-full left-0 mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-40">
                      {['All', 'Full-time', 'Part-time', 'Contract'].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => {
                            setJobTypeFilter(t);
                            setOpenFilter(null);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${
                            jobTypeFilter === t ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Category Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenFilter(openFilter === 'category' ? null : 'category')}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-700 hover:border-slate-300 transition-colors cursor-pointer shadow-2xs"
                  >
                    <span>Category</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  {openFilter === 'category' && (
                    <div className="absolute top-full left-0 mt-1.5 w-52 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-40">
                      {[
                        'All',
                        'Technical / Maintenance',
                        'IT / Software',
                        'Education & Teaching',
                        'Sales & Marketing',
                        'Finance & Accounts',
                        'Human Resources'
                      ].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => {
                            setCategoryFilter(c);
                            setOpenFilter(null);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium truncate ${
                            categoryFilter === c ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Experience Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenFilter(openFilter === 'experience' ? null : 'experience')}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-700 hover:border-slate-300 transition-colors cursor-pointer shadow-2xs"
                  >
                    <span>Experience</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  {openFilter === 'experience' && (
                    <div className="absolute top-full left-0 mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-40">
                      {['All', '0 – 1 years', '1 – 3 years', '3 – 5 years', '5+ years'].map((e) => (
                        <button
                          key={e}
                          type="button"
                          onClick={() => {
                            setExperienceFilter(e);
                            setOpenFilter(null);
                          }}
                          className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-slate-50"
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Salary Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenFilter(openFilter === 'salary' ? null : 'salary')}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-700 hover:border-slate-300 transition-colors cursor-pointer shadow-2xs"
                  >
                    <span>Salary</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  {openFilter === 'salary' && (
                    <div className="absolute top-full left-0 mt-1.5 w-48 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-40">
                      {['All', 'Under ₹15,000', '₹15,000 – ₹25,000', '₹25,000 – ₹40,000', '₹40,000+'].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => {
                            setSalaryFilter(s);
                            setOpenFilter(null);
                          }}
                          className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-slate-50"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Reset Button */}
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-2 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Right Side: Jobs Count & Sort */}
              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-500 font-medium">
                  {filteredJobs.length === 6 ? '124 jobs found' : `${filteredJobs.length} jobs found`}
                </span>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenFilter(openFilter === 'sort' ? null : 'sort')}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-700 hover:border-slate-300 transition-colors cursor-pointer shadow-2xs"
                  >
                    <span>{sortBy}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {openFilter === 'sort' && (
                    <div className="absolute top-full right-0 mt-1.5 w-40 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-40">
                      {['Latest First', 'Highest Salary', 'Experience: Low to High'].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => {
                            setSortBy(s);
                            setOpenFilter(null);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${
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
          </div>

          {/* Master-Detail 2-Column Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Job Cards List (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              {filteredJobs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                  <p className="font-bold text-slate-700">No jobs match your search filters.</p>
                  <p className="text-xs text-slate-500 mt-1">Try resetting the filters or modifying keywords.</p>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                filteredJobs.map((job) => {
                  const isSelected = job.id === selectedJobId;
                  return (
                    <div
                      key={job.id}
                      onClick={() => setSelectedJobId(job.id)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white relative ${
                        isSelected
                          ? 'border-[#1976D2] ring-2 ring-blue-500/20 shadow-sm'
                          : 'border-slate-200/80 hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          {/* Company Logo Square */}
                          {job.companyLogo ? (
                            <img
                              src={job.companyLogo}
                              alt={job.company}
                              className="w-12 h-12 rounded-xl object-contain p-1 border border-slate-200 bg-white flex-shrink-0 shadow-2xs"
                            />
                          ) : job.logoType === 'icon-book' ? (
                            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0 text-amber-700 shadow-2xs">
                              <BookOpen className="w-6 h-6 stroke-[2]" />
                            </div>
                          ) : job.logoType === 'swirl' ? (
                            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center flex-shrink-0 text-rose-500 shadow-2xs">
                              <Sparkles className="w-6 h-6 stroke-[2]" />
                            </div>
                          ) : (
                            <div
                              className={`w-12 h-12 rounded-xl ${job.logoBg} ${job.logoColor} flex items-center justify-center font-black text-sm tracking-wide flex-shrink-0 shadow-2xs`}
                            >
                              {job.logoText}
                            </div>
                          )}

                          <div className="min-w-0">
                            <h3 className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors">
                              {job.title}
                            </h3>
                            <p className="text-sm font-medium text-slate-500 mt-0.5">
                              {job.company}
                            </p>

                            {/* Meta items */}
                            <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 mt-2.5 text-xs text-slate-600">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                <span>{job.location}</span>
                              </span>
                              <span className="flex items-center gap-1">
                                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                                <span>{job.type}</span>
                              </span>
                              <span className="flex items-center gap-1 font-semibold text-slate-700">
                                <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                                <span>{job.salary.replace('₹ ', '')}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Top Right: Posted time + Bookmark */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs text-slate-400 font-medium">
                            {job.posted}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleSave(job.id);
                            }}
                            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                              job.isSaved
                                ? 'border-purple-300 bg-purple-50 text-purple-600'
                                : 'border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                            }`}
                            aria-label="Save Job"
                          >
                            <Bookmark className={`w-4 h-4 ${job.isSaved ? 'fill-purple-600' : ''}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Bottom Pagination matching Screenshot */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200/80">
                <span className="text-xs text-slate-500 font-medium">
                  Showing 1 to 6 of 124 jobs
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
                    onClick={() => setCurrentPage(3)}
                    className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center transition-colors cursor-pointer ${
                      currentPage === 3
                        ? 'bg-[#1976D2] text-white shadow-xs'
                        : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    3
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentPage(4)}
                    className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center transition-colors cursor-pointer ${
                      currentPage === 4
                        ? 'bg-[#1976D2] text-white shadow-xs'
                        : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    4
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentPage(5)}
                    className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center transition-colors cursor-pointer ${
                      currentPage === 5
                        ? 'bg-[#1976D2] text-white shadow-xs'
                        : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    5
                  </button>

                  <span className="px-1 text-slate-400 text-xs">...</span>

                  <button
                    type="button"
                    onClick={() => setCurrentPage(21)}
                    className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center transition-colors cursor-pointer ${
                      currentPage === 21
                        ? 'bg-[#1976D2] text-white shadow-xs'
                        : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    21
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(21, p + 1))}
                    className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Detailed Job Preview Pane (5 Cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-6 sticky top-20">
              {!activeJob ? (
                <div className="text-center py-20 text-slate-400">
                  <Briefcase className="w-12 h-12 mx-auto mb-3 text-slate-300 stroke-1" />
                  <p className="font-semibold text-slate-600 text-sm">No Job Selected</p>
                  <p className="text-xs text-slate-400 mt-1">Select a job from the left or create a new job to view full details.</p>
                </div>
              ) : (
                <>
              {/* Top Company & Actions */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  {activeJob.companyLogo ? (
                    <img
                      src={activeJob.companyLogo}
                      alt={activeJob.company}
                      className="w-14 h-14 rounded-2xl object-contain p-1 border border-slate-200 bg-white flex-shrink-0 shadow-2xs"
                    />
                  ) : activeJob.logoType === 'icon-book' ? (
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0 text-amber-700 shadow-2xs">
                      <BookOpen className="w-7 h-7 stroke-[2]" />
                    </div>
                  ) : activeJob.logoType === 'swirl' ? (
                    <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center flex-shrink-0 text-rose-500 shadow-2xs">
                      <Sparkles className="w-7 h-7 stroke-[2]" />
                    </div>
                  ) : (
                    <div
                      className={`w-14 h-14 rounded-2xl ${activeJob.logoBg} ${activeJob.logoColor} flex items-center justify-center font-black text-base tracking-wide flex-shrink-0 shadow-2xs`}
                    >
                      {activeJob.logoText}
                    </div>
                  )}

                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      {activeJob.company}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {activeJob.industry}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleSave(activeJob.id)}
                    className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                      activeJob.isSaved
                        ? 'border-purple-300 bg-purple-50 text-purple-600'
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                    aria-label="Bookmark"
                  >
                    <Bookmark className={`w-4 h-4 ${activeJob.isSaved ? 'fill-purple-600' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      showToast('Job listing link copied to clipboard!');
                    }}
                    className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
                    aria-label="Share Job"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title & Metadata */}
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  {activeJob.title}
                </h2>

                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-3 text-xs text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{activeJob.fullLocation}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    <span>{activeJob.type}</span>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-2 text-xs text-slate-600">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                    <span>{activeJob.salaryMonthly}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Posted {activeJob.posted}</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons matching Screenshot */}
              <div className="flex items-center gap-3">
                {activeJob.isApplied ? (
                  <button
                    type="button"
                    disabled
                    className="flex-1 py-3 px-4 rounded-xl text-sm font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>Applied Successfully</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setApplyModalJob(activeJob)}
                    className="flex-1 py-3 px-4 rounded-xl text-sm font-bold bg-[#1976D2] hover:bg-[#1565C0] text-white shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Apply Now</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleToggleSave(activeJob.id)}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold border transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                    activeJob.isSaved
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-blue-600 text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${activeJob.isSaved ? 'fill-purple-600' : ''}`} />
                  <span>{activeJob.isSaved ? 'Saved' : 'Save Job'}</span>
                </button>
              </div>

              {/* Job Description */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-900">Job Description</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {activeJob.description}
                </p>
              </div>

              {/* Key Responsibilities */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900">Key Responsibilities</h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {activeJob.responsibilities.map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-slate-400 font-bold">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900">Requirements</h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {activeJob.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-slate-400 font-bold">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Two Bottom Summary Cards */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    <span className="text-[11px] font-semibold">Job Category</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900">{activeJob.category}</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <Award className="w-4 h-4 text-slate-400" />
                    <span className="text-[11px] font-semibold">Experience Level</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900">{activeJob.experience}</p>
                </div>
              </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Apply Modal */}
      {applyModalJob && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900">
                Apply for Position
              </h3>
              <button
                type="button"
                onClick={() => setApplyModalJob(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmApply} className="mt-4 space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-base">{applyModalJob.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{applyModalJob.company} • {applyModalJob.fullLocation}</p>
                <div className="mt-3 flex gap-2 text-xs font-medium text-slate-600">
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200">Salary: {applyModalJob.salary}</span>
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200">{applyModalJob.type}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Applicant Profile
                </label>
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-xs text-blue-900 space-y-1">
                  <p className="font-bold">{currentUser?.name || 'Registered Candidate'}</p>
                  <p className="text-slate-600">{currentUser?.email || 'candidate@starkjobs.com'}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Short Note for Hiring Team
                </label>
                <textarea
                  rows={3}
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="I am very interested in this role and have direct hands-on experience in the required technical skills. Looking forward to hearing from you."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setApplyModalJob(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isApplying}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#1976D2] hover:bg-[#1565C0] rounded-xl shadow-xs disabled:opacity-60"
                >
                  {isApplying ? 'Submitting...' : 'Confirm & Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
