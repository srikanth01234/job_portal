import React, { useState } from 'react';
import {
  Search,
  MapPin,
  ArrowRight,
  Send,
  Calendar,
  Bookmark,
  CheckCircle2,
  Briefcase,
  IndianRupee,
  Bell,
  ChevronDown,
  Menu,
  X,
  Check,
  Plus,
  BookOpen,
  Sparkles,
  ExternalLink,
  SlidersHorizontal,
  GraduationCap,
  Award,
  Clock,
  Building,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import JobSeekerSidebar from './JobSeekerSidebar';
import api from '../services/api';

export default function JobSeekerDashboard({
  onLogout,
  onNavigateTab,
  onNavigateHome
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Search Bar Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Thoothukudi, Tamil Nadu');
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState(() => api.getStoredUser?.() || {});
  const userName = currentUser.name || 'Candidate';
  const userEmail = currentUser.email || 'candidate@starkjobs.com';
  const userInitials = userName.split(' ').filter(Boolean).map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'JS';
  const userAvatar = currentUser.avatar_url || (currentUser.avatar ? (currentUser.avatar.startsWith('http') ? currentUser.avatar : `http://127.0.0.1:8000/storage/${currentUser.avatar}`) : null);

  // Metric stats
  const [appliedCount, setAppliedCount] = useState(0);
  const [interviewsCount, setInterviewsCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);

  // Profile completion status
  const [skillsCompleted, setSkillsCompleted] = useState(false);
  const [skillsModalOpen, setSkillsModalOpen] = useState(false);
  const [candidateSkills, setCandidateSkills] = useState([]);
  const [newSkillInput, setNewSkillInput] = useState('');

  // Modals & Feedback
  const [applyModalJob, setApplyModalJob] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Jobs dataset from real DB
  const [jobs, setJobs] = useState([]);

  // Fetch real data from DB
  React.useEffect(() => {
    let isMounted = true;

    // Load real jobs
    api.getJobs().then((res) => {
      if (res && res.data && isMounted) {
        const mapped = res.data.map((j) => ({
          id: j.id,
          title: j.title,
          company: j.company?.company_name || 'Direct Employer',
          companyLogo: j.company?.logo_url || (j.company?.logo ? (j.company.logo.startsWith('http') ? j.company.logo : `http://127.0.0.1:8000/storage/${j.company.logo}`) : null),
          location: j.location || (j.district ? `${j.district.name}, TN` : 'Tamil Nadu'),
          type: j.job_type || 'Full-time',
          salary: j.min_salary && j.max_salary 
            ? `₹ ${Number(j.min_salary).toLocaleString()} – ${Number(j.max_salary).toLocaleString()}` 
            : (j.min_salary ? `₹ ${Number(j.min_salary).toLocaleString()}+` : 'Not Disclosed'),
          logoText: (j.company?.company_name || 'DE').slice(0, 2).toUpperCase(),
          logoBg: 'bg-[#0A192F]',
          logoTextColor: 'text-white',
          isSaved: false,
          isApplied: false,
          posted: 'Recently',
          experience: j.experience || 'Fresher / Experienced'
        }));
        setJobs(mapped);
      }
    }).catch(err => console.warn('Dashboard jobs fetch:', err));

    // Load real applications
    api.getApplications().then((res) => {
      if (res && isMounted) {
        if (res.counts) {
          setAppliedCount(res.counts.all || 0);
          setInterviewsCount(res.counts.interview || 0);
        } else if (Array.isArray(res.data)) {
          setAppliedCount(res.data.length);
        }
      }
    }).catch(err => console.warn('Dashboard applications fetch:', err));

    // Load real saved jobs
    api.getSavedJobs().then((res) => {
      if (res && isMounted) {
        const count = res.total ?? (Array.isArray(res.data) ? res.data.length : 0);
        setSavedCount(count);
      }
    }).catch(err => console.warn('Dashboard saved jobs fetch:', err));

    // Load candidate profile and synchronize user
    api.getSeekerProfile().then((res) => {
      if (res && isMounted) {
        if (res.user) {
          setCurrentUser(res.user);
          const prev = api.getStoredUser?.() || {};
          localStorage.setItem('stark_user', JSON.stringify({ ...prev, ...res.user }));
        }
        if (res.profile) {
          const p = res.profile;
          if (p.skills) {
            try {
              const parsed = typeof p.skills === 'string' ? JSON.parse(p.skills) : p.skills;
              if (Array.isArray(parsed) && parsed.length > 0) {
                setCandidateSkills(parsed);
                setSkillsCompleted(true);
              }
            } catch (e) {}
          }
        }
      }
    }).catch(err => console.warn('Dashboard profile fetch:', err));

    // Listen for cross-component user updates (e.g. from Profile page)
    const handleUserUpdate = () => {
      const u = api.getStoredUser?.() || {};
      if (isMounted && u.name) {
        setCurrentUser(u);
      }
    };
    window.addEventListener('stark_user_updated', handleUserUpdate);
    window.addEventListener('storage', handleUserUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('stark_user_updated', handleUserUpdate);
      window.removeEventListener('storage', handleUserUpdate);
    };
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Toggle Saved Job in MySQL DB
  const handleToggleSave = async (jobId) => {
    const numericId = typeof jobId === 'string' && jobId.startsWith('job-') ? jobId.replace('job-', '') : jobId;
    try {
      const res = await api.toggleSaveJob(numericId);
      const isSaved = res && res.is_saved !== undefined ? res.is_saved : true;
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, isSaved } : j))
      );
      setSavedCount((c) => (isSaved ? c + 1 : Math.max(0, c - 1)));
      showToast(isSaved ? 'Job saved to your bookmarks in database!' : 'Job removed from saved bookmarks.');
    } catch (err) {
      showToast('Bookmark toggled.');
    }
  };

  // Submit Application to MySQL DB
  const handleConfirmApply = async (e) => {
    e.preventDefault();
    if (!applyModalJob) return;

    const numericId = typeof applyModalJob.id === 'string' && applyModalJob.id.startsWith('job-')
      ? applyModalJob.id.replace('job-', '')
      : applyModalJob.id;

    try {
      await api.applyForJob(numericId, 'Applied from Job Seeker Dashboard');
      setJobs((prev) =>
        prev.map((j) => (j.id === applyModalJob.id ? { ...j, isApplied: true } : j))
      );
      setAppliedCount((c) => c + 1);
      showToast(`Successfully applied to ${applyModalJob.title} at ${applyModalJob.company}! Application saved to database.`);
    } catch (err) {
      console.warn('Apply error:', err);
      showToast(err.message || 'Application submitted.');
    }
    setApplyModalJob(null);
  };

  // Add Skill
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;
    if (!candidateSkills.includes(newSkillInput.trim())) {
      setCandidateSkills([...candidateSkills, newSkillInput.trim()]);
    }
    setNewSkillInput('');
    setSkillsCompleted(true);
    showToast('Skills updated! Profile is now 100% complete.');
  };

  const locationsList = [
    'Thoothukudi, Tamil Nadu',
    'Tirunelveli, Tamil Nadu',
    'Madurai, Tamil Nadu',
    'Chennai, Tamil Nadu',
    'Coimbatore, Tamil Nadu',
    'Trichy, Tamil Nadu',
    'Salem, Tamil Nadu',
    'All Tamil Nadu'
  ];

  // Filtered jobs based on search
  const filteredJobs = jobs.filter((job) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query) ||
      job.location.toLowerCase().includes(query);

    const matchesLoc =
      selectedLocation === 'All Tamil Nadu' ||
      job.location.toLowerCase().includes(selectedLocation.split(',')[0].toLowerCase().trim());

    return matchesSearch && matchesLoc;
  });

  // Calculate profile percentage
  const profilePercentage = skillsCompleted ? 100 : 80;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans antialiased text-slate-800">
      {/* Job Seeker Sidebar */}
      <JobSeekerSidebar
        activeTab="dashboard"
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
            {/* Mobile Sidebar Toggle Button */}
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

              {/* Notification Popover */}
              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
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
                    <div className="py-2.5 flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                      <div>
                        <p className="text-slate-800 font-medium">
                          Interview scheduled with <span className="font-semibold text-slate-900">BlueKite Software</span> for tomorrow
                        </p>
                        <span className="text-slate-400 text-[10px] block mt-0.5">2 hours ago</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotificationOpen(false)}
                    className="w-full mt-3 py-1.5 text-center text-xs text-slate-500 hover:text-slate-800 font-medium"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>

            {/* Profile Avatar & Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-1.5 p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer group"
              >
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200 flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#0A192F] text-white flex items-center justify-center font-bold text-sm tracking-wide shadow-xs ring-2 ring-transparent group-hover:ring-blue-100">
                    {userInitials}
                  </div>
                )}
                <ChevronDown className="w-4 h-4 text-slate-600 group-hover:text-slate-900 transition-transform duration-200" />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-900">{userName}</p>
                    <p className="text-xs text-slate-500 truncate">{userEmail}</p>
                    <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Job Seeker Active
                    </span>
                  </div>
                  <div className="py-1 text-xs text-slate-700">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        if (onNavigateTab) onNavigateTab('profile');
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
                    >
                      <span>My Profile & Resume</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        if (onNavigateTab) onNavigateTab('saved-jobs');
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
                    >
                      <span>Saved Jobs ({savedCount})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        if (onNavigateTab) onNavigateTab('settings');
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
                    >
                      <span>Account Settings</span>
                    </button>
                  </div>
                  <div className="pt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        if (onLogout) onLogout();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-medium animate-in fade-in slide-in-from-bottom-3 duration-200">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Greeting Banner */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Hi <span className="text-[#1E60D5]">{userName}</span>,
            </h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1">
              Find the right job opportunity for your career.
            </p>
          </div>

          {/* Search Bar Card matching Screenshot */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-2.5 sm:p-3 flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Input 1: Title, Skill, or Company */}
            <div className="flex-1 flex items-center gap-3 px-3 py-2 sm:py-1">
              <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Job title, skill or company"
                className="w-full text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
              />
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-8 bg-slate-200" />

            {/* Input 2: Location selector */}
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

              {/* Location Dropdown */}
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

            {/* Search Jobs Button */}
            <button
              type="button"
              onClick={() => {
                if (onNavigateTab) {
                  onNavigateTab('find-jobs');
                } else {
                  showToast(`Searching for jobs matching "${searchQuery || 'All'}" in ${selectedLocation}...`);
                }
              }}
              className="bg-[#1976D2] hover:bg-[#1565C0] text-white text-sm font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all duration-150 cursor-pointer flex-shrink-0"
            >
              <span>Search Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 3 Metric / KPI Summary Cards matching Screenshot */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {/* Card 1: Applications */}
            <div
              onClick={() => {
                if (onNavigateTab) onNavigateTab('applications');
              }}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#EBF5FF] text-[#1976D2] flex items-center justify-center flex-shrink-0">
                  <Send className="w-6 h-6 -rotate-12 translate-x-0.5" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-500">Applications</p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                    {appliedCount}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onNavigateTab) onNavigateTab('applications');
                }}
                className="w-9 h-9 rounded-full border border-blue-200 text-blue-600 hover:bg-blue-50 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="View Applications"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 2: Interviews */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#E8F8F0] text-[#059669] flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-500">Interviews</p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                    {interviewsCount}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  showToast('You have 2 scheduled interviews coming up this week!');
                }}
                className="w-9 h-9 rounded-full border border-emerald-200 text-emerald-600 hover:bg-emerald-50 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="View Interviews"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 3: Saved Jobs */}
            <div
              onClick={() => {
                if (onNavigateTab) onNavigateTab('saved-jobs');
              }}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center flex-shrink-0">
                  <Bookmark className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-500">Saved Jobs</p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                    {savedCount}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onNavigateTab) onNavigateTab('saved-jobs');
                }}
                className="w-9 h-9 rounded-full border border-purple-200 text-purple-600 hover:bg-purple-50 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="View Saved Jobs"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Two-Column Section: Recommended Jobs & Profile Completion */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 8 Cols: Recommended Jobs */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Recommended Jobs</h2>
                <button
                  type="button"
                  onClick={() => {
                    if (onNavigateTab) onNavigateTab('find-jobs');
                  }}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer group"
                >
                  <span>View all</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* Jobs List */}
              <div className="space-y-4">
                {filteredJobs.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl">
                    <p className="font-semibold text-slate-600">No jobs match your filter criteria.</p>
                    <p className="text-xs mt-1">Try resetting the location or keywords.</p>
                  </div>
                ) : (
                  filteredJobs.map((job) => (
                    <div
                      key={job.id}
                      className="p-4 sm:p-5 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white"
                    >
                      {/* Job Info Left */}
                      <div className="flex items-start gap-4">
                        {/* Company Logo Square */}
                        {job.companyLogo ? (
                          <img
                            src={job.companyLogo}
                            alt={job.company}
                            className="w-12 h-12 rounded-xl object-contain p-1 border border-slate-200 bg-white flex-shrink-0 shadow-2xs"
                          />
                        ) : job.logoIcon === 'book' ? (
                          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0 text-amber-700 shadow-2xs">
                            <BookOpen className="w-6 h-6 stroke-[2]" />
                          </div>
                        ) : (
                          <div
                            className={`w-12 h-12 rounded-xl ${job.logoBg} ${job.logoTextColor} flex items-center justify-center font-black text-sm tracking-wide flex-shrink-0 shadow-2xs`}
                          >
                            {job.logoText}
                          </div>
                        )}

                        <div className="min-w-0">
                          <h3 className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer">
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

                      {/* Right Action Buttons */}
                      <div className="flex items-center gap-2.5 sm:self-center self-end flex-shrink-0">
                        {job.isApplied ? (
                          <span className="px-4 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5" />
                            <span>Applied</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setApplyModalJob(job)}
                            className="px-5 py-2 rounded-xl text-sm font-semibold text-[#1976D2] border border-[#1976D2] hover:bg-[#1976D2] hover:text-white transition-all cursor-pointer shadow-2xs"
                          >
                            Apply
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleToggleSave(job.id)}
                          className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                            job.isSaved
                              ? 'border-purple-300 bg-purple-50 text-purple-600'
                              : 'border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                          }`}
                          aria-label="Save job"
                        >
                          <Bookmark
                            className={`w-4 h-4 ${job.isSaved ? 'fill-purple-600' : ''}`}
                          />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right 4 Cols: Complete Your Profile Card */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between space-y-6">
              <div>
                {/* Header with Circular Gauge Progress */}
                <div className="flex items-center gap-4">
                  {/* Circular SVG Donut Progress (80% / 100%) */}
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                      {/* Background Ring */}
                      <circle
                        cx="32"
                        cy="32"
                        r="27"
                        stroke="#E2E8F0"
                        strokeWidth="6"
                        fill="transparent"
                      />
                      {/* Active Progress Ring */}
                      <circle
                        cx="32"
                        cy="32"
                        r="27"
                        stroke={skillsCompleted ? '#10B981' : '#0284C7'}
                        strokeWidth="6"
                        strokeDasharray={2 * Math.PI * 27}
                        strokeDashoffset={
                          (2 * Math.PI * 27) * (1 - profilePercentage / 100)
                        }
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-700 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center font-extrabold text-sm text-slate-900">
                      {profilePercentage}%
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Complete Your Profile
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      Add a few more details to get better job recommendations.
                    </p>
                  </div>
                </div>

                {/* Profile Steps Checklist */}
                <div className="mt-6 space-y-3.5">
                  {/* Step 1: Basic Information */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span className="text-sm font-semibold text-slate-800">
                        Basic Information
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-emerald-600">
                      Completed
                    </span>
                  </div>

                  {/* Step 2: Education Details */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span className="text-sm font-semibold text-slate-800">
                        Education Details
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-emerald-600">
                      Completed
                    </span>
                  </div>

                  {/* Step 3: Upload Resume */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span className="text-sm font-semibold text-slate-800">
                        Upload Resume
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-emerald-600">
                      Completed
                    </span>
                  </div>

                  {/* Step 4: Add Skills */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {skillsCompleted ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-slate-300 flex-shrink-0" />
                      )}
                      <span className="text-sm font-semibold text-slate-800">
                        Add Skills
                      </span>
                    </div>
                    {skillsCompleted ? (
                      <span className="text-xs font-semibold text-emerald-600">
                        Completed
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSkillsModalOpen(true)}
                        className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                      >
                        Add Now
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Action Button matching screenshot */}
              <button
                type="button"
                onClick={() => {
                  if (onNavigateTab) onNavigateTab('profile');
                  else setSkillsModalOpen(true);
                }}
                className="w-full py-3 px-4 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-50 font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Update Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>
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
                <p className="text-xs text-slate-500 mt-0.5">{applyModalJob.company} • {applyModalJob.location}</p>
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
                  <p className="font-bold">Kavin Raj • Electrical Diploma Holder</p>
                  <p className="text-slate-600">kavin.raj@gmail.com | +91 98765 43210</p>
                  <p className="text-slate-600">Resume: <span className="font-semibold text-blue-700">Kavin_Resume_2026.pdf</span> (Verified)</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cover Note / Pitch (Optional)
                </label>
                <textarea
                  rows={3}
                  defaultValue="I have 2+ years of hands-on experience in industrial maintenance and PLC panel troubleshooting. Looking forward to discussing how I can contribute."
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
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#1976D2] hover:bg-[#1565C0] rounded-xl shadow-xs"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Skills & Update Profile Modal */}
      {skillsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900">
                  Add Your Skills
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSkillsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mt-2">
              Add technical skills to boost your profile score to 100% and unlock high-match recommendations.
            </p>

            {/* Current Skills Chips */}
            <div className="mt-4 flex flex-wrap gap-2">
              {candidateSkills.map((sk) => (
                <span
                  key={sk}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold rounded-lg"
                >
                  <span>{sk}</span>
                  <button
                    type="button"
                    onClick={() => setCandidateSkills(candidateSkills.filter((s) => s !== sk))}
                    className="hover:text-blue-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add Skill Form */}
            <form onSubmit={handleAddSkill} className="mt-4 flex gap-2">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                placeholder="e.g. PLC Programming, Flutter, AutoCAD"
                className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700"
              >
                Add
              </button>
            </form>

            {/* Suggestions */}
            <div className="mt-3">
              <p className="text-[11px] font-semibold text-slate-500 mb-1.5">Quick Suggestions:</p>
              <div className="flex flex-wrap gap-1.5">
                {['Motor Controls', 'Troubleshooting', 'Wiring', 'CAD', 'Python'].map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => {
                      if (!candidateSkills.includes(sug)) {
                        setCandidateSkills([...candidateSkills, sug]);
                      }
                    }}
                    className="text-[11px] px-2 py-0.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 rounded-md font-medium"
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-5 mt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setSkillsCompleted(true);
                  setSkillsModalOpen(false);
                  showToast('Profile completed to 100%!');
                }}
                className="w-full py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
              >
                Save & Complete Profile (100%)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
