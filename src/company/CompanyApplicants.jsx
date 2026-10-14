import React, { useState, useMemo } from 'react';
import {
  Users,
  FileText,
  Clock,
  CheckCircle2,
  Calendar,
  XCircle,
  Briefcase,
  SlidersHorizontal,
  MapPin,
  Search,
  RotateCcw,
  MoreVertical,
  Check,
  X,
  Phone,
  Mail,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  Bell,
  Download,
  Eye,
  Shield,
  Award,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import CompanySidebar from './CompanySidebar';

// Complete dataset matching the reference screenshot exactly
const INITIAL_APPLICANTS_DATA = [
  {
    id: 'app-1',
    name: 'Ravi Kumar',
    email: 'ravi.kumar@gmail.com',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
    avatarInitials: 'RK',
    avatarBg: 'bg-blue-100 text-blue-700',
    appliedFor: 'Electrician',
    jobType: 'Full-time',
    location: 'Thoothukudi, TN',
    fullLocation: 'Thoothukudi, Tamil Nadu',
    appliedOn: 'Oct 14, 2026',
    status: 'New',
    experience: '2 years',
    expectedSalary: '₹18,000 - 22,000',
    joinDate: 'Available',
    about: 'Skilled electrician with 2 years of hands-on experience in industrial and commercial electrical installation, maintenance and troubleshooting.',
    skills: ['Electrical Installation', 'Wiring', 'Troubleshooting', 'Maintenance', 'Safety Compliance'],
    preferredLocation: 'Thoothukudi, Tamil Nadu',
    willingToRelocate: 'No',
    resumeUrl: 'ravi_kumar_resume.pdf'
  },
  {
    id: 'app-2',
    name: 'Muthu Selvam',
    email: 'muthu.selvam@gmail.com',
    phone: '+91 98451 23456',
    avatar: null,
    avatarInitials: 'MS',
    avatarBg: 'bg-emerald-100 text-emerald-700',
    appliedFor: 'Maintenance Technician',
    jobType: 'Full-time',
    location: 'Tirunelveli, TN',
    fullLocation: 'Tirunelveli, Tamil Nadu',
    appliedOn: 'Oct 13, 2026',
    status: 'Under Review',
    experience: '3.5 years',
    expectedSalary: '₹22,000 - 26,000',
    joinDate: '15 Days Notice',
    about: 'Experienced mechanical and plant maintenance technician with expertise in hydraulics, pneumatic systems, and routine industrial preventive checks.',
    skills: ['Preventive Maintenance', 'Hydraulics', 'Pneumatics', 'Welding', 'Troubleshooting'],
    preferredLocation: 'Tirunelveli, Tamil Nadu',
    willingToRelocate: 'Yes',
    resumeUrl: 'muthu_selvam_resume.pdf'
  },
  {
    id: 'app-3',
    name: 'Arun Prakash',
    email: 'arun.prakash@gmail.com',
    phone: '+91 97123 45678',
    avatar: null,
    avatarInitials: 'AP',
    avatarBg: 'bg-purple-100 text-purple-700',
    appliedFor: 'Fitter',
    jobType: 'Contract',
    location: 'Thoothukudi, TN',
    fullLocation: 'Thoothukudi, Tamil Nadu',
    appliedOn: 'Oct 12, 2026',
    status: 'Shortlisted',
    experience: '4 years',
    expectedSalary: '₹19,000 - 23,000',
    joinDate: 'Immediate',
    about: 'Certified industrial fitter specialized in precision pipe assembly, machinery alignment, and structural welding for chemical and shipping facilities.',
    skills: ['Pipe Fitting', 'Machinery Alignment', 'Blueprints', 'Lathe Machine', 'Safety Standards'],
    preferredLocation: 'Thoothukudi, Tamil Nadu',
    willingToRelocate: 'No',
    resumeUrl: 'arun_prakash_resume.pdf'
  },
  {
    id: 'app-4',
    name: 'Siva Jothi',
    email: 'siva.jothi@gmail.com',
    phone: '+91 94321 09876',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces',
    avatarInitials: 'SJ',
    avatarBg: 'bg-rose-100 text-rose-700',
    appliedFor: 'Machine Operator',
    jobType: 'Full-time',
    location: 'Madurai, TN',
    fullLocation: 'Madurai, Tamil Nadu',
    appliedOn: 'Oct 11, 2026',
    status: 'Interview',
    experience: '3 years',
    expectedSalary: '₹17,000 - 21,000',
    joinDate: 'Immediate',
    about: 'Experienced automated machine operator with deep experience running high-speed CNC and packaging lines in heavy manufacturing plants.',
    skills: ['CNC Operations', 'Packaging Machinery', 'Quality Inspection', 'Calibration', '5S Practices'],
    preferredLocation: 'Madurai, Tamil Nadu',
    willingToRelocate: 'Yes',
    resumeUrl: 'siva_jothi_resume.pdf'
  },
  {
    id: 'app-5',
    name: 'Karthick Raj',
    email: 'karthick.raj@gmail.com',
    phone: '+91 98877 66554',
    avatar: null,
    avatarInitials: 'KR',
    avatarBg: 'bg-amber-100 text-amber-700',
    appliedFor: 'Safety Supervisor',
    jobType: 'Full-time',
    location: 'Chennai, TN',
    fullLocation: 'Chennai, Tamil Nadu',
    appliedOn: 'Oct 10, 2026',
    status: 'New',
    experience: '5 years',
    expectedSalary: '₹28,000 - 34,000',
    joinDate: '1 Month Notice',
    about: 'Certified industrial safety supervisor holding NEBOSH certification. Expertise in hazard assessment, workplace audits, and accident prevention.',
    skills: ['OSHA Compliance', 'Hazard Identification', 'Emergency Response', 'Safety Auditing', 'Fire Safety'],
    preferredLocation: 'Chennai / Thoothukudi',
    willingToRelocate: 'Yes',
    resumeUrl: 'karthick_raj_resume.pdf'
  },
  {
    id: 'app-6',
    name: 'Divya Nair',
    email: 'divya.nair@gmail.com',
    phone: '+91 96543 21098',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces',
    avatarInitials: 'DN',
    avatarBg: 'bg-rose-100 text-rose-700',
    appliedFor: 'Electrical Helper',
    jobType: 'Part-time',
    location: 'Thoothukudi, TN',
    fullLocation: 'Thoothukudi, Tamil Nadu',
    appliedOn: 'Oct 09, 2026',
    status: 'Rejected',
    experience: '1 year',
    expectedSalary: '₹12,000 - 15,000',
    joinDate: 'Immediate',
    about: 'Diploma in electrical engineering with 1 year hands-on assistance experience in panel board wiring and electrical cable routing.',
    skills: ['Cable Laying', 'Circuit Testing', 'Conduit Wiring', 'Power Tools', 'Workplace Safety'],
    preferredLocation: 'Thoothukudi, Tamil Nadu',
    willingToRelocate: 'No',
    resumeUrl: 'divya_nair_resume.pdf'
  },
  {
    id: 'app-7',
    name: 'Suresh Kumar',
    email: 'suresh.kumar@gmail.com',
    phone: '+91 91234 56780',
    avatar: null,
    avatarInitials: 'SK',
    avatarBg: 'bg-amber-100 text-amber-700',
    appliedFor: 'Maintenance Technician',
    jobType: 'Full-time',
    location: 'Tirunelveli, TN',
    fullLocation: 'Tirunelveli, Tamil Nadu',
    appliedOn: 'Oct 08, 2026',
    status: 'Shortlisted',
    experience: '4.5 years',
    expectedSalary: '₹24,000 - 28,000',
    joinDate: '15 Days',
    about: 'Reliable industrial plant technician experienced in heavy motor servicing, pump maintenance, and electrical drive overhauls.',
    skills: ['Motor Overhaul', 'Pump Repair', 'Control Panels', 'Lubrication', 'Diagnostic Testing'],
    preferredLocation: 'Tirunelveli, Tamil Nadu',
    willingToRelocate: 'Yes',
    resumeUrl: 'suresh_kumar_resume.pdf'
  },
  {
    id: 'app-8',
    name: 'Priya L',
    email: 'priya.l@gmail.com',
    phone: '+91 94433 22110',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces',
    avatarInitials: 'PL',
    avatarBg: 'bg-blue-100 text-blue-700',
    appliedFor: 'HR Assistant',
    jobType: 'Full-time',
    location: 'Madurai, TN',
    fullLocation: 'Madurai, Tamil Nadu',
    appliedOn: 'Oct 07, 2026',
    status: 'Under Review',
    experience: '2 years',
    expectedSalary: '₹18,000 - 22,000',
    joinDate: 'Immediate',
    about: 'HR operations and technician recruitment coordinator skilled in candidate onboarding, attendance registers, and labour compliance.',
    skills: ['Recruitment', 'Attendance Management', 'Labour Laws', 'Payroll Assistance', 'Communication'],
    preferredLocation: 'Madurai, Tamil Nadu',
    willingToRelocate: 'No',
    resumeUrl: 'priya_l_resume.pdf'
  }
];

const ITEMS_PER_PAGE = 8;

/**
 * Company Applicants Component (Single File Implementation)
 * Exact recreation of the reference screenshot:
 * - Top pipeline ribbon KPI cards with chevron connections (64 Total, 28 New, 16 Under Review, 10 Shortlisted, 6 Interview, 4 Rejected)
 * - Multi-filter toolbar (Select Job, Application Status, District, Search by keyword, Reset)
 * - Status Filter Tabs (All Applicants 64, New 28, Under Review 16, Shortlisted 10, Interview 6, Rejected 4)
 * - 2-Column Split Layout:
 *   - Left: Applicants Table with checkbox selection, applicant details, trade, status pill
 *   - Right: Interactive Candidate Details preview pane with Overview, Resume, Cover Letter, Application Details tabs, About, Skills, and quick action buttons (Shortlist, Schedule Interview, Reject)
 * - Bottom bulk actions toolbar (Shortlist, Schedule Interview, Reject, More) & pagination
 */
export default function CompanyApplicants({
  onLogout,
  onNavigateHome,
  onNavigateTab
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Filter States
  const [applicants, setApplicants] = useState(INITIAL_APPLICANTS_DATA);
  const [statusTab, setStatusTab] = useState('all'); // 'all', 'new', 'review', 'shortlisted', 'interview', 'rejected'
  const [jobFilter, setJobFilter] = useState('All Jobs');
  const [statusDropdown, setStatusDropdown] = useState('All Status');
  const [districtFilter, setDistrictFilter] = useState('All Districts');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('Last 30 days');
  const [currentPage, setCurrentPage] = useState(1);

  // Selected row & preview pane state
  const [selectedApplicantId, setSelectedApplicantId] = useState('app-1');
  const [checkedIds, setCheckedIds] = useState(['app-1']);
  const [previewTab, setPreviewTab] = useState('overview'); // 'overview', 'resume', 'cover', 'details'

  // Schedule Interview modal state
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [interviewDate, setInterviewDate] = useState('2026-10-18T10:30');
  const [interviewMode, setInterviewMode] = useState('In-Person');

  // Currently inspected applicant in the right preview pane
  const activeCandidate = useMemo(() => {
    return applicants.find((a) => a.id === selectedApplicantId) || applicants[0];
  }, [applicants, selectedApplicantId]);

  // Dynamic funnel KPI counts
  const totalCount = applicants.length * 8; // Replicating ~64 metric representation
  const newCount = 28;
  const underReviewCount = 16;
  const shortlistedCount = 10;
  const interviewCount = 6;
  const rejectedCount = 4;

  // Filter logic
  const filteredApplicants = useMemo(() => {
    return applicants.filter((item) => {
      // Tab filter
      if (statusTab === 'new' && item.status !== 'New') return false;
      if (statusTab === 'review' && item.status !== 'Under Review') return false;
      if (statusTab === 'shortlisted' && item.status !== 'Shortlisted') return false;
      if (statusTab === 'interview' && item.status !== 'Interview') return false;
      if (statusTab === 'rejected' && item.status !== 'Rejected') return false;

      // Job Dropdown
      if (jobFilter !== 'All Jobs' && item.appliedFor !== jobFilter) return false;

      // Status Dropdown
      if (statusDropdown !== 'All Status' && item.status !== statusDropdown) return false;

      // District Dropdown
      if (districtFilter !== 'All Districts' && !item.location.includes(districtFilter)) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchEmail = item.email.toLowerCase().includes(q);
        const matchJob = item.appliedFor.toLowerCase().includes(q);
        const matchSkills = item.skills.some((s) => s.toLowerCase().includes(q));
        if (!matchName && !matchEmail && !matchJob && !matchSkills) return false;
      }

      return true;
    });
  }, [applicants, statusTab, jobFilter, statusDropdown, districtFilter, searchQuery]);

  // Reset Filters
  const handleResetFilters = () => {
    setStatusTab('all');
    setJobFilter('All Jobs');
    setStatusDropdown('All Status');
    setDistrictFilter('All Districts');
    setSearchQuery('');
  };

  // Toggle selection
  const handleToggleCheck = (id) => {
    if (checkedIds.includes(id)) {
      setCheckedIds(checkedIds.filter((item) => item !== id));
    } else {
      setCheckedIds([...checkedIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (checkedIds.length === filteredApplicants.length) {
      setCheckedIds([]);
    } else {
      setCheckedIds(filteredApplicants.map((a) => a.id));
    }
  };

  // Status changers
  const updateCandidateStatus = (id, newStatus) => {
    setApplicants((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  const handleBulkStatusChange = (newStatus) => {
    if (checkedIds.length === 0) return;
    setApplicants((prev) =>
      prev.map((item) => (checkedIds.includes(item.id) ? { ...item, status: newStatus } : item))
    );
  };

  // Badge class helper
  const getStatusBadge = (status) => {
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex font-sans">
      {/* Reusable Employer Sidebar with active tab: applicants */}
      <CompanySidebar
        activeTab="applicants"
        onSelectTab={(tabId) => {
          if (tabId === 'applicants') return;
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
                placeholder="Search applicants, jobs, or keywords..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Right Header: Notification Bell & Profile Avatar */}
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
                    <h4 className="text-sm font-bold text-slate-900">Applicant Alerts</h4>
                    <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
                      3 New
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto mt-2 text-xs">
                    <div className="py-2.5">
                      <p className="font-semibold text-slate-800">Ravi Kumar applied</p>
                      <p className="text-slate-500 mt-0.5">Electrician • 2 years exp.</p>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">10 mins ago</span>
                    </div>
                    <div className="py-2.5">
                      <p className="font-semibold text-slate-800">Siva Jothi confirmed interview</p>
                      <p className="text-slate-500 mt-0.5">Tomorrow at 10:30 AM.</p>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">2 hours ago</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-[#0A192F] text-white font-bold text-xs flex items-center justify-center shadow-xs tracking-wider cursor-pointer">
                ABC
              </div>
              <ChevronDown className="w-4 h-4 text-slate-500 cursor-pointer hover:text-slate-800" />
            </div>
          </div>
        </header>

        {/* Applicants Main Content */}
        <main className="p-4 sm:p-8 space-y-6 flex-1">
          {/* Page Title & Date Range Dropdown Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-6 bg-[#1976D2] rounded-full" />
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Applicants
                </h1>
              </div>
              <p className="text-sm text-slate-500 mt-1 pl-4">
                Manage and track candidates for your job postings.
              </p>
            </div>

            {/* Date Range Selector matching screenshot */}
            <div className="relative self-start sm:self-center">
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-2 shadow-xs">
                <Calendar className="w-4 h-4 text-slate-400" />
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="appearance-none bg-transparent text-xs font-bold text-slate-700 pr-5 focus:outline-none cursor-pointer"
                >
                  <option>Last 30 days</option>
                  <option>Last 7 days</option>
                  <option>Last 90 days</option>
                  <option>All time</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none -ml-3" />
              </div>
            </div>
          </div>

          {/* Row 1: Pipeline Funnel Ribbon KPI Cards (Total, New, Under Review, Shortlisted, Interview, Rejected) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Total Applicants */}
            <div
              onClick={() => setStatusTab('all')}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1976D2] flex items-center justify-center mb-3">
                <Users className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 leading-none">64</div>
                <div className="text-xs font-bold text-slate-600 mt-1">Total Applicants</div>
                <div className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-0.5">
                  <span>↗ 18%</span>
                  <span className="text-slate-400 font-normal">vs last month</span>
                </div>
              </div>
            </div>

            {/* New */}
            <div
              onClick={() => setStatusTab('new')}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <FileText className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 leading-none">{newCount}</div>
                <div className="text-xs font-bold text-slate-600 mt-1">New</div>
                <div className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-0.5">
                  <span>↗ 12%</span>
                </div>
              </div>
            </div>

            {/* Under Review */}
            <div
              onClick={() => setStatusTab('review')}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <Clock className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 leading-none">{underReviewCount}</div>
                <div className="text-xs font-bold text-slate-600 mt-1">Under Review</div>
                <div className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-0.5">
                  <span>↗ 8%</span>
                </div>
              </div>
            </div>

            {/* Shortlisted */}
            <div
              onClick={() => setStatusTab('shortlisted')}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <Users className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 leading-none">{shortlistedCount}</div>
                <div className="text-xs font-bold text-slate-600 mt-1">Shortlisted</div>
                <div className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-0.5">
                  <span>↗ 5%</span>
                </div>
              </div>
            </div>

            {/* Interview */}
            <div
              onClick={() => setStatusTab('interview')}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                <Calendar className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 leading-none">{interviewCount}</div>
                <div className="text-xs font-bold text-slate-600 mt-1">Interview</div>
                <div className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-0.5">
                  <span>↗ 50%</span>
                </div>
              </div>
            </div>

            {/* Rejected */}
            <div
              onClick={() => setStatusTab('rejected')}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
                <XCircle className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 leading-none">{rejectedCount}</div>
                <div className="text-xs font-bold text-slate-600 mt-1">Rejected</div>
                <div className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-0.5">
                  <span>↗ 2%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Filter Toolbar (Select Job, Application Status, District, Search, Reset) */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-wrap flex-1">
              {/* Select Job Filter */}
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                <Briefcase className="w-4 h-4 text-slate-400" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                    Select Job
                  </span>
                  <select
                    value={jobFilter}
                    onChange={(e) => setJobFilter(e.target.value)}
                    className="bg-transparent font-bold text-slate-800 pr-5 focus:outline-none cursor-pointer mt-0.5"
                  >
                    <option>All Jobs</option>
                    <option>Electrician</option>
                    <option>Maintenance Technician</option>
                    <option>Machine Operator</option>
                    <option>Fitter</option>
                    <option>Safety Supervisor</option>
                    <option>Electrical Helper</option>
                    <option>HR Assistant</option>
                  </select>
                </div>
              </div>

              {/* Application Status Filter with counter badge */}
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                    Application Status
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <select
                      value={statusDropdown}
                      onChange={(e) => setStatusDropdown(e.target.value)}
                      className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
                    >
                      <option>All Status</option>
                      <option>New</option>
                      <option>Under Review</option>
                      <option>Shortlisted</option>
                      <option>Interview</option>
                      <option>Rejected</option>
                    </select>
                    <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center">
                      4
                    </span>
                  </div>
                </div>
              </div>

              {/* District Filter */}
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                <MapPin className="w-4 h-4 text-slate-400" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                    District
                  </span>
                  <select
                    value={districtFilter}
                    onChange={(e) => setDistrictFilter(e.target.value)}
                    className="bg-transparent font-bold text-slate-800 pr-5 focus:outline-none cursor-pointer mt-0.5"
                  >
                    <option>All Districts</option>
                    <option>Thoothukudi</option>
                    <option>Tirunelveli</option>
                    <option>Madurai</option>
                    <option>Chennai</option>
                    <option>Coimbatore</option>
                  </select>
                </div>
              </div>

              {/* Keyword Search Input */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, email or keyword..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Reset Button */}
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer flex-shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Row 3: Status Filter Tabs */}
          <div className="flex items-center gap-2 flex-wrap text-xs sm:text-sm">
            {[
              { id: 'all', label: 'All Applicants', count: 64 },
              { id: 'new', label: 'New', count: newCount },
              { id: 'review', label: 'Under Review', count: underReviewCount },
              { id: 'shortlisted', label: 'Shortlisted', count: shortlistedCount },
              { id: 'interview', label: 'Interview', count: interviewCount },
              { id: 'rejected', label: 'Rejected', count: rejectedCount },
            ].map((tab) => {
              const isActive = statusTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer border ${
                    isActive
                      ? 'border-blue-600 bg-blue-50 text-[#1976D2]'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-xs px-1.5 py-0.2 rounded-md ${isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Row 4: 2-Column Split Layout (Left: Table, Right: Candidate Detail Preview Card) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: Applicants Data Table (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200/60">
                    <tr>
                      <th className="py-3.5 px-4 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={checkedIds.length === filteredApplicants.length && filteredApplicants.length > 0}
                          onChange={handleSelectAll}
                          className="w-4 h-4 text-[#1976D2] rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                        />
                      </th>
                      <th className="py-3.5 px-4">Candidate</th>
                      <th className="py-3.5 px-4">Applied For</th>
                      <th className="py-3.5 px-4">Location</th>
                      <th className="py-3.5 px-4">Applied On</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-center">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredApplicants.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400">
                          <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm font-semibold">No candidates match your filters</p>
                          <p className="text-xs text-slate-400 mt-1">Try adjusting the filter options above.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredApplicants.map((cand) => {
                        const isSelectedRow = selectedApplicantId === cand.id;
                        const isChecked = checkedIds.includes(cand.id);

                        return (
                          <tr
                            key={cand.id}
                            onClick={() => setSelectedApplicantId(cand.id)}
                            className={`transition-colors cursor-pointer group ${
                              isSelectedRow
                                ? 'bg-blue-50/60 border-l-4 border-l-[#1976D2]'
                                : 'hover:bg-slate-50/80'
                            }`}
                          >
                            {/* Checkbox */}
                            <td
                              className="py-3.5 px-4 text-center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggleCheck(cand.id)}
                                className="w-4 h-4 text-[#1976D2] rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                              />
                            </td>

                            {/* Candidate Avatar & Details */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                {cand.avatar ? (
                                  <img
                                    src={cand.avatar}
                                    alt={cand.name}
                                    className="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-slate-200"
                                  />
                                ) : (
                                  <div
                                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${cand.avatarBg}`}
                                  >
                                    {cand.avatarInitials}
                                  </div>
                                )}
                                <div>
                                  <span className="font-bold text-slate-900 block text-xs group-hover:text-blue-600 transition-colors">
                                    {cand.name}
                                  </span>
                                  <span className="text-[11px] text-slate-500 block truncate max-w-[140px]">
                                    {cand.email}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Applied For & Job Type */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className="font-bold text-slate-800 block text-xs">
                                {cand.appliedFor}
                              </span>
                              <span className="text-[11px] text-slate-400 block">
                                {cand.jobType}
                              </span>
                            </td>

                            {/* Location */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                                <MapPin className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                                <span>{cand.location}</span>
                              </div>
                            </td>

                            {/* Applied On */}
                            <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                              {cand.appliedOn}
                            </td>

                            {/* Status */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadge(
                                  cand.status
                                )}`}
                              >
                                {cand.status}
                              </span>
                            </td>

                            {/* Actions Dropdown */}
                            <td
                              className="py-3.5 px-4 text-center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedApplicantId(cand.id);
                                }}
                                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
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

              {/* Bottom Bulk Action Toolbar & Pagination */}
              <div className="p-3.5 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
                {/* Bulk Actions Left */}
                <div className="flex items-center gap-2 text-xs flex-wrap">
                  <span className="text-slate-500 font-semibold mr-1">
                    {checkedIds.length} selected
                  </span>
                  <button
                    type="button"
                    disabled={checkedIds.length === 0}
                    onClick={() => handleBulkStatusChange('Shortlisted')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Shortlist</span>
                  </button>
                  <button
                    type="button"
                    disabled={checkedIds.length === 0}
                    onClick={() => setScheduleModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl border border-purple-300 bg-white hover:bg-purple-50 text-purple-700 font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Schedule Interview</span>
                  </button>
                  <button
                    type="button"
                    disabled={checkedIds.length === 0}
                    onClick={() => handleBulkStatusChange('Rejected')}
                    className="px-3 py-1.5 rounded-xl border border-rose-300 bg-white hover:bg-rose-50 text-rose-600 font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>

                {/* Pagination Controls Right */}
                <div className="flex items-center gap-1 text-xs">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    className="p-1 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="w-7 h-7 rounded-lg bg-[#1976D2] text-white font-bold text-xs"
                  >
                    1
                  </button>
                  <button
                    type="button"
                    className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs cursor-pointer"
                  >
                    2
                  </button>
                  <button
                    type="button"
                    className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs cursor-pointer"
                  >
                    4
                  </button>
                  <button
                    type="button"
                    className="p-1 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Candidate Detail Preview Card (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-5 sticky top-20">
              {activeCandidate ? (
                <>
                  {/* Candidate Header Summary */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      {activeCandidate.avatar ? (
                        <img
                          src={activeCandidate.avatar}
                          alt={activeCandidate.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs"
                        />
                      ) : (
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg ${activeCandidate.avatarBg} shadow-xs`}
                        >
                          {activeCandidate.avatarInitials}
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">
                          {activeCandidate.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{activeCandidate.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{activeCandidate.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-blue-500" />
                          <span>{activeCandidate.fullLocation}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Pill & Close */}
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
                          activeCandidate.status
                        )}`}
                      >
                        {activeCandidate.status}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons Strip matching screenshot */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => updateCandidateStatus(activeCandidate.id, 'Shortlisted')}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Shortlist</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setScheduleModalOpen(true)}
                      className="px-3 py-2 border border-purple-300 bg-white hover:bg-purple-50 text-purple-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5 stroke-[2]" />
                      <span>Schedule Interview</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => updateCandidateStatus(activeCandidate.id, 'Rejected')}
                      className="px-3 py-2 border border-rose-300 bg-white hover:bg-rose-50 text-rose-600 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Reject</span>
                    </button>
                  </div>

                  {/* Sub Tabs: Overview, Resume, Cover Letter, Application Details */}
                  <div className="flex items-center border-b border-slate-100 text-xs font-bold text-slate-500 gap-4">
                    <button
                      type="button"
                      onClick={() => setPreviewTab('overview')}
                      className={`pb-2.5 transition-colors cursor-pointer ${
                        previewTab === 'overview'
                          ? 'border-b-2 border-blue-600 text-blue-600'
                          : 'hover:text-slate-800'
                      }`}
                    >
                      Overview
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewTab('resume')}
                      className={`pb-2.5 transition-colors cursor-pointer ${
                        previewTab === 'resume'
                          ? 'border-b-2 border-blue-600 text-blue-600'
                          : 'hover:text-slate-800'
                      }`}
                    >
                      Resume
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewTab('cover')}
                      className={`pb-2.5 transition-colors cursor-pointer ${
                        previewTab === 'cover'
                          ? 'border-b-2 border-blue-600 text-blue-600'
                          : 'hover:text-slate-800'
                      }`}
                    >
                      Cover Letter
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewTab('details')}
                      className={`pb-2.5 transition-colors cursor-pointer ${
                        previewTab === 'details'
                          ? 'border-b-2 border-blue-600 text-blue-600'
                          : 'hover:text-slate-800'
                      }`}
                    >
                      Application Details
                    </button>
                  </div>

                  {/* Tab 1: Overview Content */}
                  {previewTab === 'overview' && (
                    <div className="space-y-4 text-xs">
                      {/* 3 Metric Badges matching screenshot */}
                      <div className="grid grid-cols-3 gap-2.5">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1976D2] flex items-center justify-center flex-shrink-0">
                            <Briefcase className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-black text-slate-900 leading-tight">{activeCandidate.experience}</div>
                            <div className="text-[10px] text-slate-500">Experience</div>
                          </div>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                            <Shield className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-black text-slate-900 leading-tight">{activeCandidate.expectedSalary}</div>
                            <div className="text-[10px] text-slate-500">Expected Salary</div>
                          </div>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-black text-slate-900 leading-tight">{activeCandidate.joinDate}</div>
                            <div className="text-[10px] text-slate-500">Join Date</div>
                          </div>
                        </div>
                      </div>

                      {/* About Section */}
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">About</h4>
                        <p className="text-slate-600 leading-relaxed text-xs">
                          {activeCandidate.about}
                        </p>
                      </div>

                      {/* Skills Section */}
                      <div>
                        <h4 className="font-bold text-slate-900 mb-2">Skills</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {activeCandidate.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-2.5 py-1 bg-slate-100 text-slate-700 font-semibold rounded-lg text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Meta Footer Details */}
                      <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-4">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-slate-800 block text-xs">Preferred Job Location</span>
                            <span className="text-slate-500 text-[11px]">{activeCandidate.preferredLocation}</span>
                          </div>
                        </div>

                        <div>
                          <span className="font-bold text-slate-800 block text-xs">Willing to Relocate</span>
                          <span className="text-slate-500 text-[11px]">{activeCandidate.willingToRelocate}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Resume Content */}
                  {previewTab === 'resume' && (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <span className="font-bold text-slate-800">{activeCandidate.resumeUrl}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => alert(`Downloading ${activeCandidate.resumeUrl}...`)}
                          className="px-3 py-1 bg-[#1976D2] hover:bg-blue-700 text-white rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </button>
                      </div>
                      <div className="h-44 border border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-400 bg-white">
                        <Eye className="w-6 h-6 mb-1 text-slate-400" />
                        <p className="font-semibold text-slate-600">Resume Preview Ready</p>
                        <p className="text-[10px] text-slate-400">Verified ITI / Trade Certification attached</p>
                      </div>
                    </div>
                  )}

                  {/* Tab 3: Cover Letter */}
                  {previewTab === 'cover' && (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                      <h5 className="font-bold text-slate-900">Application Note from {activeCandidate.name}</h5>
                      <p className="text-slate-600 leading-relaxed italic">
                        "Dear Hiring Team at ABC Industrial Services, I have {activeCandidate.experience} of industrial experience in {activeCandidate.appliedFor}. I am confident in handling operations safely and adhering to company SOPs. Looking forward to the interview."
                      </p>
                    </div>
                  )}

                  {/* Tab 4: Application Details */}
                  {previewTab === 'details' && (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2.5">
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Applied Position:</span>
                        <span className="font-bold text-slate-800">{activeCandidate.appliedFor} ({activeCandidate.jobType})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Application Date:</span>
                        <span className="text-slate-800">{activeCandidate.appliedOn}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Verification Status:</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">
                          Candidate Verified
                        </span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-12 text-center text-slate-400">
                  <p>Select a candidate from the table to preview details.</p>
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
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Schedule Candidate Interview</h3>
                  <p className="text-xs text-slate-500">{activeCandidate ? activeCandidate.name : 'Candidate'} • {activeCandidate?.appliedFor}</p>
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

            <div className="p-6 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Interview Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Interview Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setInterviewMode('In-Person')}
                    className={`p-3 rounded-xl border text-center font-bold text-xs transition-colors cursor-pointer ${
                      interviewMode === 'In-Person'
                        ? 'border-purple-600 bg-purple-50 text-purple-700 ring-2 ring-purple-600'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    🏢 In-Person (Plant/Office)
                  </button>
                  <button
                    type="button"
                    onClick={() => setInterviewMode('Video / Phone')}
                    className={`p-3 rounded-xl border text-center font-bold text-xs transition-colors cursor-pointer ${
                      interviewMode === 'Video / Phone'
                        ? 'border-purple-600 bg-purple-50 text-purple-700 ring-2 ring-purple-600'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    📹 Video / Phone Call
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Location / Instructions
                </label>
                <input
                  type="text"
                  defaultValue="ABC Industrial Services, SIPCOT Complex, Thoothukudi"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
                  type="button"
                  onClick={() => {
                    if (activeCandidate) {
                      updateCandidateStatus(activeCandidate.id, 'Interview');
                    }
                    alert(`Interview scheduled for ${activeCandidate?.name}! Email and SMS invitation sent.`);
                    setScheduleModalOpen(false);
                  }}
                  className="px-5 py-2 bg-[#1976D2] hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer text-xs"
                >
                  Confirm & Send Invite
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
