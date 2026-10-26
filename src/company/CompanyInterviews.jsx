import React, { useState, useMemo, useEffect } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  XCircle,
  Plus,
  Search,
  Filter,
  RotateCcw,
  Video,
  Building2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Copy,
  Edit2,
  MapPin,
  ExternalLink,
  ChevronDown,
  Menu,
  Bell,
  Briefcase,
  Share2,
  CalendarCheck,
  FileText,
  Loader2
} from 'lucide-react';
import CompanySidebar from './CompanySidebar';
import api from '../services/api';

/**
 * Helper to map backend Interview model to the UI format
 */
function formatBackendInterview(item) {
  const d = item.interview_date ? new Date(item.interview_date) : new Date();
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formattedDate = `${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;

  const rawStatus = item.status || 'scheduled';
  const statusCapitalized = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);
  const candidateName = item.user?.name || 'Applicant';
  const jobTitle = item.application?.job_listing?.title || item.round_name || 'Position';
  const location = item.user?.seeker_profile?.current_location || item.company?.location || 'Thoothukudi, TN';

  const avatarUrl = item.user?.avatar_url || (item.user?.avatar ? (item.user.avatar.startsWith('http') ? item.user.avatar : `http://127.0.0.1:8000/storage/${item.user.avatar}`) : null);
  const initials = candidateName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'AP';

  return {
    id: item.id,
    realId: item.id,
    candidateName,
    location,
    fullLocation: item.location_address || location,
    jobTitle,
    date: formattedDate,
    rawDate: d,
    time: formattedTime,
    timeRange: `${formattedTime} - 45 mins`,
    dayNumber: d.getDate(),
    type: item.interview_type === 'in_person' ? 'On-site' : 'Online',
    status: statusCapitalized,
    isToday,
    applicantBadge: item.round_name || 'Interview',
    avatar: avatarUrl,
    avatarInitials: initials,
    avatarBg: 'bg-blue-100 text-[#1976D2]',
    meetingLink: item.meeting_link,
    venue: item.location_address,
    interviewer: 'You (Hiring Manager)',
    interviewerEmail: item.company?.email || 'hr@starkjobs.com',
    notes: item.notes || 'Interview scheduled with candidate.',
    experience: item.user?.seeker_profile?.experience_level || '1-3 years',
    phone: item.user?.phone || 'N/A',
    email: item.user?.email || 'N/A',
    skills: item.user?.seeker_profile?.skills || [],
    workHistory: item.user?.seeker_profile?.work_history || [],
    education: item.user?.seeker_profile?.education || [],
    professionalSummary: item.user?.seeker_profile?.professional_summary || '',
    resumeUrl: item.user?.seeker_profile?.resume_path
      ? (item.user.seeker_profile.resume_path.startsWith('http')
          ? item.user.seeker_profile.resume_path
          : `http://127.0.0.1:8000/storage/${item.user.seeker_profile.resume_path}`)
      : null,
  };
}

export default function CompanyInterviews({
  onLogout,
  onNavigateHome,
  onNavigateTab
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Interviews State
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [selectedInterviewId, setSelectedInterviewId] = useState(null);
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(new Date().getDate());
  const [statusTab, setStatusTab] = useState('all'); // 'all', 'upcoming', 'today', 'completed', 'rescheduled', 'cancelled'

  // Table Filters
  const [jobFilter, setJobFilter] = useState('All Jobs');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusDropdown, setStatusDropdown] = useState('All Status');
  const [tableSearch, setTableSearch] = useState('');

  // Right Preview Sub-tabs
  const [previewSubTab, setPreviewSubTab] = useState('details'); // 'details', 'candidate', 'resume', 'notes'
  const [copiedLink, setCopiedLink] = useState(false);

  // Schedule Interview Modal State
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState('');
  const [newCandidate, setNewCandidate] = useState('');
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newDate, setNewDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [newTime, setNewTime] = useState('11:00');
  const [newType, setNewType] = useState('Online');
  const [newNotes, setNewNotes] = useState('');
  const [submittingSchedule, setSubmittingSchedule] = useState(false);

  // Fetch interviews from backend
  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const res = await api.getCompanyInterviews();
      const raw = res?.data || [];
      const mapped = raw.map(formatBackendInterview);
      setInterviews(mapped);
      if (mapped.length > 0) {
        setSelectedInterviewId((curr) => curr || mapped[0].id);
      }
    } catch (err) {
      console.error('Failed to load interviews:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch applications for scheduling dropdown
  const fetchApplications = async () => {
    try {
      const res = await api.getApplications();
      const apps = res?.data || [];
      setApplications(apps);
      if (apps.length > 0) {
        setSelectedAppId(apps[0].id);
        setNewCandidate(apps[0].user?.name || '');
        setNewJobTitle(apps[0].job_listing?.title || '');
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
    }
  };

  useEffect(() => {
    fetchInterviews();
    fetchApplications();
  }, []);

  // Days with scheduled interviews for calendar dots
  const interviewCalendarDays = useMemo(() => {
    return Array.from(new Set(interviews.map((i) => i.dayNumber).filter(Boolean)));
  }, [interviews]);

  // KPI Dynamic Counts
  const totalCount = interviews.length;
  const todayCount = interviews.filter((i) => i.isToday).length;
  const completedCount = interviews.filter((i) => i.status.toLowerCase() === 'completed').length;
  const rescheduledCount = interviews.filter((i) => i.status.toLowerCase() === 'rescheduled').length;
  const cancelledCount = interviews.filter((i) => i.status.toLowerCase() === 'cancelled').length;
  const upcomingCount = interviews.filter((i) => ['scheduled', 'upcoming'].includes(i.status.toLowerCase())).length;

  // Active interview preview item
  const activeInterview = useMemo(() => {
    if (!interviews.length) return null;
    return interviews.find((i) => i.id === selectedInterviewId) || interviews[0];
  }, [interviews, selectedInterviewId]);

  // Today's interviews timeline list
  const todayInterviews = useMemo(() => {
    return interviews.filter((i) => i.isToday);
  }, [interviews]);

  // Filtered interviews for the main table
  const filteredInterviews = useMemo(() => {
    return interviews.filter((item) => {
      // Status Tab filter
      if (statusTab === 'upcoming' && item.status !== 'Upcoming' && item.status !== 'Scheduled') return false;
      if (statusTab === 'today' && !item.isToday) return false;
      if (statusTab === 'completed' && item.status !== 'Completed') return false;
      if (statusTab === 'rescheduled' && item.status !== 'Rescheduled') return false;
      if (statusTab === 'cancelled' && item.status !== 'Cancelled') return false;

      // Job Filter
      if (jobFilter !== 'All Jobs' && item.jobTitle.toLowerCase() !== jobFilter.toLowerCase()) return false;

      // Type Filter
      if (typeFilter !== 'All Types' && item.type !== typeFilter) return false;

      // Status Dropdown
      if (statusDropdown !== 'All Status' && item.status.toLowerCase() !== statusDropdown.toLowerCase()) return false;

      // Search Filter
      if (tableSearch.trim()) {
        const q = tableSearch.toLowerCase();
        const matchName = item.candidateName.toLowerCase().includes(q);
        const matchJob = item.jobTitle.toLowerCase().includes(q);
        const matchLoc = item.location.toLowerCase().includes(q);
        if (!matchName && !matchJob && !matchLoc) return false;
      }

      return true;
    });
  }, [interviews, statusTab, jobFilter, typeFilter, statusDropdown, tableSearch]);

  // Handle Copy Meeting Link
  const handleCopyLink = (link) => {
    if (!link) return;
    navigator.clipboard?.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Status updates via API
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.updateInterviewStatus(id, newStatus.toLowerCase());
      setInterviews((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
      alert(`Interview marked as ${newStatus}!`);
    } catch (err) {
      console.error('Failed to update interview status:', err);
      alert('Failed to update status. Please try again.');
    }
  };

  // Add new interview submit to backend
  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAppId && applications.length > 0) {
      alert('Please select an applicant.');
      return;
    }

    setSubmittingSchedule(true);
    try {
      const combinedDateTime = `${newDate} ${newTime}:00`;
      const res = await api.scheduleInterview({
        application_id: selectedAppId || applications[0]?.id,
        interview_date: combinedDateTime,
        round_name: 'Interview',
        interview_type: newType === 'Online' ? 'online' : 'in_person',
        meeting_link: newType === 'Online' ? `https://meet.google.com/stark-meet-${Math.floor(1000 + Math.random() * 9000)}` : null,
        location_address: newType === 'On-site' ? 'Stark Industrial Office, Tuticorin' : null,
        notes: newNotes || 'Interview scheduled with candidate.',
      });

      if (res?.success) {
        alert(`Interview scheduled successfully with ${newCandidate}!`);
        setScheduleModalOpen(false);
        await fetchInterviews();
        if (res.data?.id) setSelectedInterviewId(res.data.id);
      } else {
        alert(res?.message || 'Failed to schedule interview.');
      }
    } catch (err) {
      console.error('Schedule interview error:', err);
      alert(err.message || 'Error scheduling interview. Please try again.');
    } finally {
      setSubmittingSchedule(false);
    }
  };

  // Helper for status badge styling
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-blue-100 text-[#1976D2] border-blue-200';
      case 'Scheduled':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Completed':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Rescheduled':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex font-sans">
      {/* Reusable Employer Sidebar with active tab: interviews */}
      <CompanySidebar
        activeTab="interviews"
        onSelectTab={(tabId) => {
          if (tabId === 'interviews') return;
          if (onNavigateTab) onNavigateTab(tabId);
        }}
        onLogout={onLogout}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Navbar Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            {/* Mobile Sidebar Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Universal Search Bar */}
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                placeholder="Search candidates, jobs, or keywords..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Right Header: Notification Bell & Profile Avatar */}
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            {/* Notification Bell */}
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

              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h4 className="text-sm font-bold text-slate-900">Interview Reminders</h4>
                    <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
                      2 Today
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto mt-2 text-xs">
                    <div className="py-2.5">
                      <p className="font-semibold text-slate-800">Interview with Ravi Kumar in 30 mins</p>
                      <p className="text-slate-500 mt-0.5">Electrician • Google Meet</p>
                      <span className="text-[10px] text-blue-600 mt-0.5 block">10:00 AM Today</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-[#0A192F] text-white font-bold text-xs flex items-center justify-center shadow-xs tracking-wider cursor-pointer">
                ABC
              </div>
              <ChevronDown className="w-4 h-4 text-slate-500 cursor-pointer hover:text-slate-800" />
            </div>
          </div>
        </header>

        {/* Interviews Main Content */}
        <main className="p-4 sm:p-8 space-y-6 flex-1">
          {/* Breadcrumb & Page Header Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1.5">
                <button
                  type="button"
                  onClick={() => onNavigateTab && onNavigateTab('dashboard')}
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Home
                </button>
                <span>›</span>
                <span className="text-slate-700 font-semibold">Interviews</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Interviews
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Schedule, manage and track all your candidate interviews.
              </p>
            </div>

            {/* Primary Action Button: + Schedule Interview */}
            <button
              type="button"
              onClick={() => setScheduleModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1976D2] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-center"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Schedule Interview</span>
            </button>
          </div>

          {/* Row 1: 5 Metric KPI Cards (Total Interviews, Today, Completed, Rescheduled, Cancelled) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {/* Card 1: Total Interviews */}
            <div
              onClick={() => setStatusTab('all')}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block leading-tight">
                    Total Interviews
                  </span>
                  <div className="text-2xl font-black text-slate-900 leading-tight mt-0.5">
                    {totalCount}
                  </div>
                  <div className="text-[10px] font-semibold text-emerald-600 mt-0.5">
                    {totalCount === 1 ? '1 interview scheduled' : `${totalCount} interviews`}
                  </div>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-blue-50 text-[#1976D2] flex items-center justify-center">
                <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
            </div>

            {/* Card 2: Today */}
            <div
              onClick={() => setStatusTab('today')}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#1976D2] flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block leading-tight">
                    Today
                  </span>
                  <div className="text-2xl font-black text-slate-900 leading-tight mt-0.5">
                    {todayCount}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {upcomingCount} upcoming
                  </div>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-blue-50 text-[#1976D2] flex items-center justify-center">
                <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
            </div>

            {/* Card 3: Completed */}
            <div
              onClick={() => setStatusTab('completed')}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block leading-tight">
                    Completed
                  </span>
                  <div className="text-2xl font-black text-slate-900 leading-tight mt-0.5">
                    {completedCount}
                  </div>
                  <div className="text-[10px] font-semibold text-emerald-600 mt-0.5">
                    {completedCount} finished
                  </div>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-blue-50 text-[#1976D2] flex items-center justify-center">
                <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
            </div>

            {/* Card 4: Rescheduled */}
            <div
              onClick={() => setStatusTab('rescheduled')}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block leading-tight">
                    Rescheduled
                  </span>
                  <div className="text-2xl font-black text-slate-900 leading-tight mt-0.5">
                    {rescheduledCount}
                  </div>
                  <div className="text-[10px] font-semibold text-amber-600 mt-0.5">
                    {rescheduledCount} pending
                  </div>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-blue-50 text-[#1976D2] flex items-center justify-center">
                <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
            </div>

            {/* Card 5: Cancelled */}
            <div
              onClick={() => setStatusTab('cancelled')}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
                  <XCircle className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block leading-tight">
                    Cancelled
                  </span>
                  <div className="text-2xl font-black text-slate-900 leading-tight mt-0.5">
                    {cancelledCount}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {cancelledCount} cancelled
                  </div>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-blue-50 text-[#1976D2] flex items-center justify-center">
                <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
            </div>
          </div>

          {/* Row 2: 3-Column Layout (Left Calendar & Today, Middle Table, Right Preview Card) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* COLUMN 1: Left Widgets (Mini Calendar & Today's Interviews) (3 cols) */}
            <div className="lg:col-span-3 space-y-6">
              {/* Widget 1: Interactive Mini Calendar matching screenshot */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
                {/* Calendar Month Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-slate-900">
                    October 2026
                  </h3>
                  <div className="flex items-center gap-1 text-slate-500">
                    <button
                      type="button"
                      className="p-1 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="p-1 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Days of Week */}
                <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 mb-2">
                  <span>Sun</span>
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                </div>

                {/* Days Grid matching October 2026 */}
                <div className="grid grid-cols-7 text-center text-xs font-semibold gap-y-1.5">
                  {/* Prev month padding */}
                  <span className="text-slate-300 py-1">27</span>
                  <span className="text-slate-300 py-1">28</span>
                  <span className="text-slate-300 py-1">29</span>
                  <span className="text-slate-300 py-1">30</span>
                  {Array.from({ length: 31 }, (_, idx) => {
                    const day = idx + 1;
                    const isSelected = selectedCalendarDay === day;
                    const hasInterview = interviewCalendarDays.includes(day);
                    return (
                      <div key={day} className="flex flex-col items-center justify-center">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCalendarDay(day);
                            const match = interviews.find((i) => i.dayNumber === day);
                            if (match) {
                              setSelectedInterviewId(match.id);
                            }
                          }}
                          className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#1976D2] text-white shadow-xs'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {day}
                        </button>
                        {hasInterview && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-0.5" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Widget 2: Today's Interviews timeline */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900">
                    Today's Interviews ({todayCount})
                  </h3>
                  <button
                    type="button"
                    onClick={() => setStatusTab('today')}
                    className="text-xs font-bold text-[#1976D2] hover:underline cursor-pointer"
                  >
                    View all ›
                  </button>
                </div>

                {todayInterviews.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center italic">
                    No interviews scheduled for today
                  </p>
                ) : (
                  <div className="space-y-4 relative pl-3 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {todayInterviews.map((item, index) => {
                      const dotColors = ['bg-emerald-500', 'bg-amber-500', 'bg-blue-500'];
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedInterviewId(item.id)}
                          className="relative flex items-center justify-between text-xs cursor-pointer group"
                        >
                          <span
                            className={`absolute -left-3.5 w-2.5 h-2.5 rounded-full ring-4 ring-white ${dotColors[index % 3]}`}
                          />
                          <div className="pl-3 min-w-0">
                            <span className="text-[11px] font-mono text-slate-400 block font-semibold">
                              {item.time}
                            </span>
                            <span className="font-bold text-slate-900 block truncate group-hover:text-blue-600 transition-colors">
                              {item.candidateName}
                            </span>
                            <span className="text-[10px] text-slate-500 block truncate">
                              {item.jobTitle}
                            </span>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              item.type === 'Online'
                                ? 'bg-blue-50 text-[#1976D2] border border-blue-200/60'
                                : 'bg-purple-50 text-purple-700 border border-purple-200/60'
                            }`}
                          >
                            {item.type}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* COLUMN 2: Middle Interviews Table (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Filter Tabs Bar with Dynamic counts */}
              <div className="flex items-center gap-1.5 flex-wrap text-xs font-bold">
                {[
                  { id: 'all', label: 'All', count: totalCount },
                  { id: 'upcoming', label: 'Upcoming', count: upcomingCount },
                  { id: 'today', label: 'Today', count: todayCount },
                  { id: 'completed', label: 'Completed', count: completedCount },
                  { id: 'rescheduled', label: 'Rescheduled', count: rescheduledCount },
                  { id: 'cancelled', label: 'Cancelled', count: cancelledCount },
                ].map((tab) => {
                  const isActive = statusTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setStatusTab(tab.id)}
                      className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer border ${
                        isActive
                          ? 'border-blue-600 bg-blue-50 text-[#1976D2]'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{tab.label}</span>{' '}
                      <span className="text-[11px] font-semibold opacity-75">{tab.count}</span>
                    </button>
                  );
                })}
              </div>

              {/* Table Filters Toolbar (Select Job, Interview Type, Status, Search, Reset) */}
              <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 flex-wrap flex-1">
                  {/* Select Job */}
                  <div className="relative">
                    <select
                      value={jobFilter}
                      onChange={(e) => setJobFilter(e.target.value)}
                      className="appearance-none bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 py-1.5 pl-3 pr-7 focus:outline-none cursor-pointer"
                    >
                      <option>All Jobs</option>
                      {Array.from(new Set(interviews.map((i) => i.jobTitle).filter(Boolean))).map((title) => (
                        <option key={title} value={title}>{title}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Interview Type */}
                  <div className="relative">
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="appearance-none bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 py-1.5 pl-3 pr-7 focus:outline-none cursor-pointer"
                    >
                      <option>All Types</option>
                      <option>Online</option>
                      <option>On-site</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Status Dropdown */}
                  <div className="relative">
                    <select
                      value={statusDropdown}
                      onChange={(e) => setStatusDropdown(e.target.value)}
                      className="appearance-none bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 py-1.5 pl-3 pr-7 focus:outline-none cursor-pointer"
                    >
                      <option>All Status</option>
                      <option>Upcoming</option>
                      <option>Scheduled</option>
                      <option>Completed</option>
                      <option>Cancelled</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Search Input */}
                  <div className="relative flex-1 min-w-[150px]">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={tableSearch}
                      onChange={(e) => setTableSearch(e.target.value)}
                      placeholder="Search by candidate name..."
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setJobFilter('All Jobs');
                    setTypeFilter('All Types');
                    setStatusDropdown('All Status');
                    setTableSearch('');
                    setStatusTab('all');
                  }}
                  className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Interviews Table matching screenshot */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200/60">
                      <tr>
                        <th className="py-3 px-3 w-8 text-center">
                          <input
                            type="checkbox"
                            className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </th>
                        <th className="py-3 px-3">Candidate</th>
                        <th className="py-3 px-3">Job Title</th>
                        <th className="py-3 px-3">Date & Time</th>
                        <th className="py-3 px-3">Type</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3 text-center">Actions</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {loading ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                            <Loader2 className="w-6 h-6 text-blue-600 animate-spin mx-auto mb-2" />
                            <span>Loading interviews...</span>
                          </td>
                        </tr>
                      ) : filteredInterviews.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                            <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                            <p className="font-bold text-slate-700 text-sm">No interviews found</p>
                            <p className="text-slate-400 text-[11px] mt-0.5">
                              {interviews.length === 0
                                ? "You haven't scheduled any candidate interviews yet."
                                : "No interviews match the selected status or filters."}
                            </p>
                            {interviews.length === 0 && (
                              <button
                                type="button"
                                onClick={() => setScheduleModalOpen(true)}
                                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1976D2] text-white text-xs font-bold rounded-xl shadow-xs"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Schedule Your First Interview</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      ) : (
                        filteredInterviews.map((item) => {
                          const isSelected = selectedInterviewId === item.id;
                          return (
                            <tr
                              key={item.id}
                              onClick={() => setSelectedInterviewId(item.id)}
                              className={`transition-colors cursor-pointer group ${
                                isSelected ? 'bg-blue-50/60' : 'hover:bg-slate-50/80'
                              }`}
                            >
                              <td
                                className="py-3.5 px-3 text-center"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <input
                                  type="checkbox"
                                  className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                />
                              </td>

                              {/* Candidate */}
                              <td className="py-3.5 px-3">
                                <div className="flex items-center gap-2.5">
                                  {item.avatar ? (
                                    <img
                                      src={item.avatar}
                                      alt={item.candidateName}
                                      className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-slate-200"
                                    />
                                  ) : (
                                    <div
                                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${item.avatarBg}`}
                                    >
                                      {item.avatarInitials}
                                    </div>
                                  )}
                                  <div className="min-w-0">
                                    <span className="font-bold text-slate-900 block truncate group-hover:text-blue-600 transition-colors">
                                      {item.candidateName}
                                    </span>
                                    <span className="text-[10px] text-slate-400 block truncate">
                                      {item.location}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              {/* Job Title */}
                              <td className="py-3.5 px-3 font-semibold text-slate-700 whitespace-nowrap">
                                {item.jobTitle}
                              </td>

                              {/* Date & Time */}
                              <td className="py-3.5 px-3 whitespace-nowrap">
                                <div className="flex items-center gap-1 text-[11px] text-slate-700 font-semibold">
                                  <Calendar className="w-3 h-3 text-slate-400" />
                                  <span>{item.date}</span>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono mt-0.5">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  <span>{item.time}</span>
                                </div>
                              </td>

                              {/* Type Pill */}
                              <td className="py-3.5 px-3 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                    item.type === 'Online'
                                      ? 'bg-blue-100 text-[#1976D2]'
                                      : 'bg-purple-100 text-purple-700'
                                  }`}
                                >
                                  {item.type === 'Online' ? (
                                    <Video className="w-3 h-3" />
                                  ) : (
                                    <Building2 className="w-3 h-3" />
                                  )}
                                  <span>{item.type}</span>
                                </span>
                              </td>

                              {/* Status Pill */}
                              <td className="py-3.5 px-3 whitespace-nowrap">
                                <span
                                  className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadgeClass(
                                    item.status
                                  )}`}
                                >
                                  {item.status}
                                </span>
                              </td>

                              {/* Actions Dropdown */}
                              <td
                                className="py-3.5 px-3 text-center"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  type="button"
                                  onClick={() => setSelectedInterviewId(item.id)}
                                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer */}
                <div className="p-3 border-t border-slate-100 flex items-center justify-between text-xs bg-slate-50/50">
                  <span className="text-slate-500">
                    Showing 1 to {filteredInterviews.length} of {filteredInterviews.length} interviews
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled
                      className="p-1 rounded-lg border border-slate-200 bg-white text-slate-400 opacity-50"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      className="w-6 h-6 rounded-lg bg-[#1976D2] text-white font-bold text-xs"
                    >
                      1
                    </button>
                    <button
                      type="button"
                      disabled
                      className="p-1 rounded-lg border border-slate-200 bg-white text-slate-400 opacity-50"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 3: Right Preview Card Pane (4 cols) */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4 sticky top-20">
              {activeInterview ? (
                <>
                  {/* Candidate Header matching screenshot */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {activeInterview.avatar ? (
                        <img
                          src={activeInterview.avatar}
                          alt={activeInterview.candidateName}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-xs"
                        />
                      ) : (
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm ${activeInterview.avatarBg}`}
                        >
                          {activeInterview.avatarInitials}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-black text-slate-900 tracking-tight">
                            {activeInterview.candidateName}
                          </h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-[#1976D2]">
                            {activeInterview.applicantBadge}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 block mt-0.5">
                          {activeInterview.jobTitle}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-blue-500" />
                          {activeInterview.fullLocation}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons Strip matching screenshot */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(activeInterview.id, 'Completed')}
                      className="px-2.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                    >
                      <Check className="w-3 h-3 stroke-[2.5]" />
                      <span>Mark as Completed</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(activeInterview.id, 'Rescheduled')}
                      className="px-2.5 py-2 border border-purple-300 bg-white hover:bg-purple-50 text-purple-700 font-bold text-[11px] rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Calendar className="w-3 h-3" />
                      <span>Reschedule</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(activeInterview.id, 'Cancelled')}
                      className="px-2.5 py-2 border border-rose-300 bg-white hover:bg-rose-50 text-rose-600 font-bold text-[11px] rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <X className="w-3 h-3 stroke-[2.5]" />
                      <span>Cancel</span>
                    </button>
                  </div>

                  {/* Sub-Tabs: Interview Details, Candidate Info, Resume, Notes */}
                  <div className="flex items-center border-b border-slate-100 text-xs font-bold text-slate-500 gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setPreviewSubTab('details')}
                      className={`pb-2 transition-colors cursor-pointer ${
                        previewSubTab === 'details'
                          ? 'border-b-2 border-blue-600 text-blue-600'
                          : 'hover:text-slate-800'
                      }`}
                    >
                      Interview Details
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewSubTab('candidate')}
                      className={`pb-2 transition-colors cursor-pointer ${
                        previewSubTab === 'candidate'
                          ? 'border-b-2 border-blue-600 text-blue-600'
                          : 'hover:text-slate-800'
                      }`}
                    >
                      Candidate Info
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewSubTab('resume')}
                      className={`pb-2 transition-colors cursor-pointer ${
                        previewSubTab === 'resume'
                          ? 'border-b-2 border-blue-600 text-blue-600'
                          : 'hover:text-slate-800'
                      }`}
                    >
                      Resume
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewSubTab('notes')}
                      className={`pb-2 transition-colors cursor-pointer ${
                        previewSubTab === 'notes'
                          ? 'border-b-2 border-blue-600 text-blue-600'
                          : 'hover:text-slate-800'
                      }`}
                    >
                      Notes
                    </button>
                  </div>

                  {/* SubTab 1: Interview Details (Exact Content from Screenshot) */}
                  {previewSubTab === 'details' && (
                    <div className="space-y-4 text-xs">
                      {/* 2x2 Metric Badges */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1976D2] flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block font-medium">Date</span>
                            <span className="font-bold text-slate-900 block text-xs">{activeInterview.date}</span>
                          </div>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1976D2] flex items-center justify-center flex-shrink-0">
                            <Clock className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block font-medium">Time</span>
                            <span className="font-bold text-slate-900 block text-xs">{activeInterview.timeRange}</span>
                          </div>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1976D2] flex items-center justify-center flex-shrink-0">
                            <Briefcase className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block font-medium">Type</span>
                            <span className="font-bold text-slate-900 block text-xs">
                              {activeInterview.type} Interview
                            </span>
                          </div>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1976D2] flex items-center justify-center flex-shrink-0">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block font-medium">Status</span>
                            <span className="font-bold text-slate-900 block text-xs">{activeInterview.status}</span>
                          </div>
                        </div>
                      </div>

                      {/* Meeting Link Box */}
                      {activeInterview.meetingLink ? (
                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1">
                            Meeting Link
                          </label>
                          <div className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                            <span className="font-mono text-xs text-slate-700 truncate flex-1">
                              {activeInterview.meetingLink}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyLink(activeInterview.meetingLink)}
                              className="p-1 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                              title="Copy link"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            {copiedLink && (
                              <span className="text-[10px] text-emerald-600 font-bold">Copied!</span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1">
                            Venue Address
                          </label>
                          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium leading-relaxed">
                            {activeInterview.venue}
                          </div>
                        </div>
                      )}

                      {/* Interviewer(s) Box */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
                          Interviewer(s)
                        </label>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#0A192F] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                            ABC
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block text-xs">
                              {activeInterview.interviewer}
                            </span>
                            <span className="text-[11px] text-slate-400 block">
                              {activeInterview.interviewerEmail}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Notes Box */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-slate-800">
                            Notes
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = prompt('Edit Interview Notes:', activeInterview.notes);
                              if (updated) {
                                setInterviews((prev) =>
                                  prev.map((i) =>
                                    i.id === activeInterview.id ? { ...i, notes: updated } : i
                                  )
                                );
                              }
                            }}
                            className="text-slate-400 hover:text-slate-700 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-slate-600 text-xs leading-relaxed p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                          {activeInterview.notes}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* SubTab 2: Candidate Info */}
                  {previewSubTab === 'candidate' && (
                    <div className="space-y-3 text-xs p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Email Address</span>
                        <span className="font-bold text-slate-800">{activeInterview.email}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Phone Number</span>
                        <span className="font-bold text-slate-800">{activeInterview.phone}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Experience</span>
                        <span className="font-bold text-slate-800">{activeInterview.experience}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Job Applied</span>
                        <span className="font-bold text-slate-800">{activeInterview.jobTitle}</span>
                      </div>
                    </div>
                  )}

                  {/* SubTab 3: Resume */}
                  {previewSubTab === 'resume' && (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-2">
                      <FileText className="w-8 h-8 text-blue-600 mx-auto" />
                      <h4 className="font-bold text-slate-800 text-xs">{activeInterview.candidateName}_Resume.pdf</h4>
                      <p className="text-[11px] text-slate-500">Verified candidate resume & technical trade credentials</p>
                      <button
                        type="button"
                        onClick={() => {
                          if (activeInterview.resumeUrl) {
                            window.open(activeInterview.resumeUrl, '_blank');
                          } else {
                            alert(`No resume uploaded yet for ${activeInterview.candidateName}`);
                          }
                        }}
                        className="px-4 py-1.5 bg-[#1976D2] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        View / Download PDF
                      </button>
                    </div>
                  )}

                  {/* SubTab 4: Notes */}
                  {previewSubTab === 'notes' && (
                    <div className="space-y-2 text-xs">
                      <textarea
                        rows={5}
                        defaultValue={activeInterview.notes}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Add private evaluation notes..."
                      />
                      <button
                        type="button"
                        onClick={() => alert('Notes saved successfully!')}
                        className="px-4 py-1.5 bg-[#1976D2] text-white font-bold text-xs rounded-xl"
                      >
                        Save Notes
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs">
                  Select an interview from the list to preview details.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* SCHEDULE INTERVIEW MODAL */}
      {scheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#1976D2] flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Schedule New Interview</h3>
                  <p className="text-xs text-slate-500">ABC Industrial Services • Recruitment</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setScheduleModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Candidate / Application *
                </label>
                {applications.length > 0 ? (
                  <select
                    value={selectedAppId}
                    onChange={(e) => {
                      const id = Number(e.target.value);
                      setSelectedAppId(id);
                      const chosen = applications.find((a) => a.id === id);
                      if (chosen) {
                        setNewCandidate(chosen.user?.name || '');
                        setNewJobTitle(chosen.job_listing?.title || '');
                      }
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold"
                  >
                    {applications.map((app) => (
                      <option key={app.id} value={app.id}>
                        {app.user?.name} — {app.job_listing?.title || 'Applicant'} (App #{app.id})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    value={newCandidate}
                    onChange={(e) => setNewCandidate(e.target.value)}
                    placeholder="Candidate Name"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Job Position *
                </label>
                <input
                  type="text"
                  required
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  placeholder="e.g. Electrician"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Interview Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewType('Online')}
                    className={`py-2 px-3 rounded-xl border text-center font-bold text-xs transition-colors cursor-pointer ${
                      newType === 'Online'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-600'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    📹 Online (Google Meet)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewType('On-site')}
                    className={`py-2 px-3 rounded-xl border text-center font-bold text-xs transition-colors cursor-pointer ${
                      newType === 'On-site'
                        ? 'border-purple-600 bg-purple-50 text-purple-700 ring-2 ring-purple-600'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    🏢 On-site (Plant / Office)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Instructions / Notes
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Bring original ITI trade certificate and identity card."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setScheduleModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingSchedule}
                  className="px-5 py-2 bg-[#1976D2] hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer text-xs flex items-center gap-1.5"
                >
                  {submittingSchedule && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{submittingSchedule ? 'Scheduling...' : 'Schedule & Send Invite'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
