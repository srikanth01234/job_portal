import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  User,
  GraduationCap,
  Briefcase,
  Sliders,
  FileText,
  MapPin,
  ListFilter,
  Eye,
  Camera,
  Calendar,
  CheckCircle2,
  Check,
  ChevronDown,
  Upload,
  Trash2,
  MoreVertical,
  Globe,
  Lightbulb,
  ExternalLink,
  Search,
  Bell,
  Menu,
  X,
  Plus,
  Share2,
  Download,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import JobSeekerSidebar from './JobSeekerSidebar';
import kavinAvatar from '../assets/kavin_avatar.jpg';

const LinkedinIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const GithubIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export default function JobSeekerProfile({
  onLogout,
  onNavigateTab,
  onNavigateHome
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Active Sub-Tab
  const [activeSubTab, setActiveSubTab] = useState('basic'); // 'basic', 'education', 'experience', 'skills', 'resume', 'location', 'additional'

  const storedUser = api.getStoredUser?.() || {};

  // Profile Form States
  const [fullName, setFullName] = useState(storedUser.name || '');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState(storedUser.email || '');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState(storedUser.phone || '');
  const [gender, setGender] = useState('Male');
  const [currentLocation, setCurrentLocation] = useState('');
  const [summary, setSummary] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(storedUser.avatar_url || (storedUser.avatar ? (storedUser.avatar.startsWith('http') ? storedUser.avatar : `http://127.0.0.1:8000/storage/${storedUser.avatar}`) : null));

  // Social Links
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');

  // Education list
  const [educationList, setEducationList] = useState([]);
  const [showEduModal, setShowEduModal] = useState(false);
  const [newEdu, setNewEdu] = useState({ degree: '', institution: '', year: '', grade: '' });

  // Work Experience
  const [experienceList, setExperienceList] = useState([]);
  const [showExpModal, setShowExpModal] = useState(false);
  const [newExp, setNewExp] = useState({ title: '', company: '', period: '', location: '', description: '' });

  // Skills
  const [skillsList, setSkillsList] = useState([]);
  const [newSkill, setNewSkill] = useState('');

  // Resume file state
  const [resumeData, setResumeData] = useState({
    name: 'No resume uploaded yet',
    uploadDate: '-',
    size: '-',
    exists: false
  });

  // Preferred Locations
  const [preferredLocations, setPreferredLocations] = useState([]);

  // Modals & Feedback
  const [toastMessage, setToastMessage] = useState('');
  const [fullPreviewOpen, setFullPreviewOpen] = useState(false);
  const [resumeMenuOpen, setResumeMenuOpen] = useState(false);
  const [replaceResumeModalOpen, setReplaceResumeModalOpen] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleExtractResume = async () => {
    try {
      setIsExtracting(true);
      showToast('⚡ Extracting profile information from resume...');
      const res = await api.extractResume(true);
      if (res && res.extracted) {
        const ext = res.extracted;
        if (ext.name) setFullName(ext.name);
        if (ext.email) setEmail(ext.email);
        if (ext.phone) setPhoneNumber(ext.phone);
        if (ext.linkedin_url) setLinkedinUrl(ext.linkedin_url);
        if (ext.professional_summary) setSummary(ext.professional_summary);
        if (ext.skills && Array.isArray(ext.skills)) setSkillsList(ext.skills);
        if (ext.education && Array.isArray(ext.education)) setEducationList(ext.education);
        if (ext.work_history && Array.isArray(ext.work_history)) setExperienceList(ext.work_history);

        const stored = api.getStoredUser?.() || {};
        if (ext.name) stored.name = ext.name;
        if (ext.email) stored.email = ext.email;
        if (ext.phone) stored.phone = ext.phone;
        localStorage.setItem('stark_user', JSON.stringify(stored));
        window.dispatchEvent(new Event('stark_user_updated'));

        showToast('✅ Profile details successfully extracted from resume and saved!');
      } else {
        showToast('Resume parsed, but no structured details found.');
      }
    } catch (err) {
      console.error('Resume extraction error:', err);
      showToast('Extraction error: ' + (err.message || 'Failed to extract resume info'));
    } finally {
      setIsExtracting(false);
    }
  };

  // Load profile from API on mount
  useEffect(() => {
    let isMounted = true;
    const loadProfile = async () => {
      try {
        const res = await api.getSeekerProfile();
        if (res && res.user && isMounted) {
          const u = res.user;
          const p = res.profile || {};
          if (u.name) setFullName(u.name);
          if (u.email) setEmail(u.email);
          if (u.phone) setPhoneNumber(u.phone);
          if (u.avatar_url || u.avatar) {
            setAvatarUrl(u.avatar_url || (u.avatar.startsWith('http') ? u.avatar : `http://127.0.0.1:8000/storage/${u.avatar}`));
          }
          if (p.current_location) setCurrentLocation(p.current_location);
          if (p.professional_summary) setSummary(p.professional_summary);
          if (p.linkedin_url) setLinkedinUrl(p.linkedin_url);
          if (p.portfolio_url) setPortfolioUrl(p.portfolio_url);
          if (p.github_url) setGithubUrl(p.github_url);
          if (p.skills) {
            try {
              const parsed = typeof p.skills === 'string' ? JSON.parse(p.skills) : p.skills;
              if (Array.isArray(parsed)) setSkillsList(parsed);
            } catch (e) {}
          }
          if (p.education) {
            try {
              const parsed = typeof p.education === 'string' ? JSON.parse(p.education) : p.education;
              if (Array.isArray(parsed)) setEducationList(parsed);
            } catch (e) {}
          }
          if (p.work_history) {
            try {
              const parsed = typeof p.work_history === 'string' ? JSON.parse(p.work_history) : p.work_history;
              if (Array.isArray(parsed)) setExperienceList(parsed);
            } catch (e) {}
          }
          if (p.preferred_locations) {
            try {
              const parsed = typeof p.preferred_locations === 'string' ? JSON.parse(p.preferred_locations) : p.preferred_locations;
              if (Array.isArray(parsed)) setPreferredLocations(parsed);
            } catch (e) {}
          }
          if (p.resume_path) {
            setResumeData({
              name: p.resume_filename || 'my_resume.pdf',
              uploadDate: 'Recently',
              size: 'Uploaded',
              exists: true,
              url: `http://127.0.0.1:8000/storage/${p.resume_path}`
            });
          }

          // Ensure localStorage is updated with live database user info
          const stored = api.getStoredUser?.() || {};
          localStorage.setItem('stark_user', JSON.stringify({
            ...stored,
            ...u,
            name: u.name || stored.name,
            email: u.email || stored.email,
            avatar_url: u.avatar_url || stored.avatar_url
          }));
          window.dispatchEvent(new Event('stark_user_updated'));
        }
      } catch (err) {
        console.warn('Seeker profile fetch:', err);
      }
    };
    loadProfile();
    return () => { isMounted = false; };
  }, []);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setSelectedAvatarFile(file);
    try {
      showToast('Uploading profile photo to server...');
      const res = await api.uploadAvatar(file);
      if (res && res.avatar_url) {
        setAvatarUrl(res.avatar_url);
        const stored = api.getStoredUser?.() || {};
        stored.avatar = res.user?.avatar;
        stored.avatar_url = res.avatar_url;
        localStorage.setItem('stark_user', JSON.stringify(stored));
        window.dispatchEvent(new Event('stark_user_updated'));
      }
      showToast('Profile photo updated successfully!');
    } catch (err) {
      console.error('Avatar upload failed:', err);
      setAvatarUrl(URL.createObjectURL(file));
      showToast('Preview updated. Click Save Changes to persist.');
    }
  };

  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      // 1. If an avatar photo file was selected, upload it
      let finalAvatarUrl = avatarUrl;
      if (selectedAvatarFile) {
        try {
          const avatarRes = await api.uploadAvatar(selectedAvatarFile);
          if (avatarRes && avatarRes.avatar_url) {
            finalAvatarUrl = avatarRes.avatar_url;
            setAvatarUrl(finalAvatarUrl);
          }
        } catch (uploadErr) {
          console.warn('Avatar upload on save:', uploadErr);
        }
      }

      // 2. Save profile fields to database
      const res = await api.updateSeekerProfile({
        name: fullName,
        email: email,
        phone: phoneNumber,
        current_location: currentLocation,
        professional_summary: summary,
        linkedin_url: linkedinUrl,
        portfolio_url: portfolioUrl,
        github_url: githubUrl,
        skills: skillsList,
        education: educationList,
        work_history: experienceList,
        preferred_locations: preferredLocations
      });

      const stored = api.getStoredUser?.() || {};
      const updatedUser = {
        ...stored,
        ...(res && res.user ? res.user : {}),
        name: fullName,
        email: email,
        phone: phoneNumber,
        avatar_url: finalAvatarUrl || stored.avatar_url
      };
      localStorage.setItem('stark_user', JSON.stringify(updatedUser));
      window.dispatchEvent(new Event('stark_user_updated'));

      showToast('✅ Profile information & photo saved successfully!');
    } catch (err) {
      console.error('Failed to update seeker profile:', err);
      showToast('Profile saved locally.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (!skillsList.includes(newSkill.trim())) {
      setSkillsList([...skillsList, newSkill.trim()]);
    }
    setNewSkill('');
    showToast('New skill added!');
  };

  const SUB_TABS = [
    { id: 'basic', label: 'Basic Information', icon: User },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'experience', label: 'Work Experience', icon: Briefcase },
    { id: 'skills', label: 'Skills', icon: Sliders },
    { id: 'resume', label: 'Resume', icon: FileText },
    { id: 'location', label: 'Preferred Location', icon: MapPin },
    { id: 'additional', label: 'Additional Information', icon: ListFilter },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans antialiased text-slate-800">
      {/* Job Seeker Sidebar */}
      <JobSeekerSidebar
        activeTab="profile"
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
                          Your profile was viewed by 3 companies today
                        </p>
                        <span className="text-slate-400 text-[10px] block mt-0.5">1 hour ago</span>
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
                  src={avatarUrl || kavinAvatar}
                  alt={fullName || 'User Avatar'}
                  className="w-10 h-10 rounded-full object-cover shadow-xs ring-1 ring-slate-200"
                />
                <ChevronDown className="w-4 h-4 text-slate-600" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="font-bold text-slate-900">{fullName || 'Candidate'}</p>
                    <p className="text-slate-500 truncate">{email || 'candidate@starkjobs.com'}</p>
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
                      onClick={() => onNavigateTab && onNavigateTab('applications')}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50"
                    >
                      My Applications
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

          {/* Page Heading & Top Action Cards matching Screenshot */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                My Profile & Resume
              </h1>
              <p className="text-sm sm:text-base text-slate-500 mt-1">
                Keep your profile updated to get better job recommendations.
              </p>
            </div>

            {/* Profile Completion Strip & Preview Profile Button */}
            <div className="flex items-center gap-3.5 flex-wrap sm:flex-nowrap">
              {/* Profile Completion Card */}
              <div className="flex items-center gap-3 px-4 py-2.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <div>
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="font-semibold text-slate-800">Profile Completion</span>
                    <span className="font-extrabold text-emerald-600">80%</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-36 h-2 bg-slate-100 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-[80%]" />
                  </div>
                </div>
              </div>

              {/* Preview Profile Button */}
              <button
                type="button"
                onClick={() => setFullPreviewOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-blue-600 text-blue-600 hover:bg-blue-50 font-bold text-xs sm:text-sm transition-colors cursor-pointer shadow-2xs"
              >
                <Eye className="w-4 h-4" />
                <span>Preview Profile</span>
              </button>
            </div>
          </div>

          {/* 3-Column Architecture matching Screenshot */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Column 1: Left Sub-navigation Tabs (3 Cols) */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-3 space-y-1">
              {SUB_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeSubTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveSubTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer text-left relative ${
                      isActive
                        ? 'bg-[#EBF5FF] text-[#1976D2] font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {/* Active Left Indicator Bar */}
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#1976D2] rounded-r-md" />
                    )}
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#1976D2]' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Column 2: Center Active Form (6 Cols) */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-6">
              {activeSubTab === 'basic' && (
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  {/* Sub-tab Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-slate-900">
                        Basic Information
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Add your personal details and a professional summary.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSaving}
                      className="bg-[#1976D2] hover:bg-[#1565C0] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>

                  {/* Profile Photo Section */}
                  <div className="flex items-center gap-5">
                    <div className="relative">
                      <img
                        src={avatarUrl || kavinAvatar}
                        alt={fullName || 'Candidate Avatar'}
                        className="w-20 h-20 rounded-full object-cover shadow-sm ring-2 ring-slate-100"
                      />
                      <label
                        htmlFor="photo-upload"
                        className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#0A192F] text-white flex items-center justify-center cursor-pointer shadow-xs hover:bg-blue-600 transition-colors"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <input
                          id="photo-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarUpload}
                        />
                      </label>
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={() => document.getElementById('photo-upload').click()}
                        className="px-3.5 py-1.5 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-50 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Change Photo
                      </button>
                      <p className="text-[11px] text-slate-400 mt-1.5">
                        Recommended size 400 × 400 px
                      </p>
                      <p className="text-[11px] text-slate-400">JPG, PNG, WEBP (Max 2MB)</p>
                    </div>
                  </div>

                  {/* Grid Inputs matching Screenshot */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                        required
                      />
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Date of Birth
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          className="w-full px-3.5 py-2 pr-10 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                        />
                        <Calendar className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                        required
                      />
                    </div>

                    {/* Phone Number with +91 Country Flag */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2">
                        <div className="flex items-center gap-1 px-2.5 py-2 border border-slate-200 rounded-xl bg-slate-50 text-xs font-semibold text-slate-700">
                          <span>🇮🇳</span>
                          <span>{countryCode}</span>
                          <ChevronDown className="w-3 h-3 text-slate-400" />
                        </div>
                        <input
                          type="text"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="flex-1 px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                          required
                        />
                      </div>
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Gender
                      </label>
                      <div className="relative">
                        <select
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className="w-full px-3.5 py-2 pr-10 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white appearance-none cursor-pointer"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Current Location */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Current Location <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={currentLocation}
                          onChange={(e) => setCurrentLocation(e.target.value)}
                          className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Professional Summary */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Professional Summary
                    </label>
                    <textarea
                      rows={4}
                      value={summary}
                      maxLength={500}
                      onChange={(e) => setSummary(e.target.value)}
                      className="w-full p-3.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 leading-relaxed bg-white"
                    />
                    <div className="text-right text-[11px] text-slate-400 mt-1">
                      {summary.length}/500
                    </div>
                  </div>

                  {/* Social Links (Optional) matching Screenshot */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <h3 className="text-xs font-bold text-slate-900">
                      Social Links (Optional)
                    </h3>

                    {/* LinkedIn */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        LinkedIn
                      </label>
                      <div className="relative">
                        <LinkedinIcon className="w-4 h-4 text-blue-700 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={linkedinUrl}
                          onChange={(e) => setLinkedinUrl(e.target.value)}
                          placeholder="https://www.linkedin.com/in/username"
                          className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                        />
                      </div>
                    </div>

                    {/* Portfolio / Website */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        Portfolio / Website
                      </label>
                      <div className="relative">
                        <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={portfolioUrl}
                          onChange={(e) => setPortfolioUrl(e.target.value)}
                          placeholder="https://yourwebsite.com"
                          className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                        />
                      </div>
                    </div>

                    {/* GitHub */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        GitHub
                      </label>
                      <div className="relative">
                        <GithubIcon className="w-4 h-4 text-slate-800 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={githubUrl}
                          onChange={(e) => setGithubUrl(e.target.value)}
                          placeholder="https://github.com/username"
                          className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Prominent Bottom Save Changes Button */}
                  <div className="pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70 p-4 rounded-xl border border-slate-200/80">
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Ready to save your profile?
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Ensure all your contact details, summary, and profile photo are saved to your account.
                      </p>
                    </div>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="bg-[#1976D2] hover:bg-[#1565C0] text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 flex-shrink-0"
                    >
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>{isSaving ? 'Saving Changes...' : 'Save Changes'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Education Sub-Tab */}
              {activeSubTab === 'education' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Education</h2>
                      <p className="text-xs text-slate-500">Your academic qualifications.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowEduModal(!showEduModal)}
                      className="px-3 py-1.5 bg-[#1976D2] hover:bg-[#1565C0] text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{showEduModal ? 'Cancel' : 'Add Degree'}</span>
                    </button>
                  </div>

                  {showEduModal && (
                    <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/50 space-y-3">
                      <h3 className="font-bold text-xs text-blue-900">Add New Education</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <input
                          type="text"
                          placeholder="Degree / Course (e.g. B.Tech, B.Sc)"
                          value={newEdu.degree}
                          onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                          className="p-2 border border-slate-200 rounded-lg bg-white"
                        />
                        <input
                          type="text"
                          placeholder="College / Institution name"
                          value={newEdu.institution}
                          onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })}
                          className="p-2 border border-slate-200 rounded-lg bg-white"
                        />
                        <input
                          type="text"
                          placeholder="Year (e.g. 2021 – 2025)"
                          value={newEdu.year}
                          onChange={(e) => setNewEdu({ ...newEdu, year: e.target.value })}
                          className="p-2 border border-slate-200 rounded-lg bg-white"
                        />
                        <input
                          type="text"
                          placeholder="Grade / Percentage (e.g. 85%)"
                          value={newEdu.grade}
                          onChange={(e) => setNewEdu({ ...newEdu, grade: e.target.value })}
                          className="p-2 border border-slate-200 rounded-lg bg-white"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!newEdu.degree.trim()) return;
                          const updated = [...educationList, newEdu];
                          setEducationList(updated);
                          setNewEdu({ degree: '', institution: '', year: '', grade: '' });
                          setShowEduModal(false);
                          try {
                            await api.updateSeekerProfile({ education: updated });
                            showToast('Education saved to database!');
                          } catch (e) {
                            showToast('Education added.');
                          }
                        }}
                        className="px-4 py-1.5 bg-[#1976D2] text-white text-xs font-bold rounded-lg cursor-pointer"
                      >
                        Save Degree
                      </button>
                    </div>
                  )}

                  <div className="space-y-3">
                    {educationList.length === 0 ? (
                      <div className="text-center py-8 text-slate-400 text-xs">
                        <GraduationCap className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p className="font-semibold text-slate-600">No education entries yet</p>
                        <p className="text-slate-400 mt-0.5">Click "Add Degree" above to list your qualifications.</p>
                      </div>
                    ) : (
                      educationList.map((edu, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1 relative group">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-slate-900 text-sm">{edu.degree}</h4>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-500">{edu.year}</span>
                              <button
                                type="button"
                                onClick={async () => {
                                  const updated = educationList.filter((_, i) => i !== idx);
                                  setEducationList(updated);
                                  await api.updateSeekerProfile({ education: updated });
                                  showToast('Entry removed.');
                                }}
                                className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-slate-600">{edu.institution}</p>
                          {edu.grade && <p className="text-xs font-semibold text-emerald-700 mt-1">{edu.grade}</p>}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Work Experience Sub-Tab */}
              {activeSubTab === 'experience' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Work Experience</h2>
                      <p className="text-xs text-slate-500">Internships, contracts and full-time employment.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowExpModal(!showExpModal)}
                      className="px-3 py-1.5 bg-[#1976D2] hover:bg-[#1565C0] text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{showExpModal ? 'Cancel' : 'Add Experience'}</span>
                    </button>
                  </div>

                  {showExpModal && (
                    <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/50 space-y-3">
                      <h3 className="font-bold text-xs text-blue-900">Add New Experience</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <input
                          type="text"
                          placeholder="Job Title (e.g. Flutter Intern, Junior Engineer)"
                          value={newExp.title}
                          onChange={(e) => setNewExp({ ...newExp, title: e.target.value })}
                          className="p-2 border border-slate-200 rounded-lg bg-white"
                        />
                        <input
                          type="text"
                          placeholder="Company name"
                          value={newExp.company}
                          onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                          className="p-2 border border-slate-200 rounded-lg bg-white"
                        />
                        <input
                          type="text"
                          placeholder="Period (e.g. Jan 2024 – Jun 2024)"
                          value={newExp.period}
                          onChange={(e) => setNewExp({ ...newExp, period: e.target.value })}
                          className="p-2 border border-slate-200 rounded-lg bg-white"
                        />
                        <input
                          type="text"
                          placeholder="Location (e.g. Tirunelveli, Tamil Nadu)"
                          value={newExp.location}
                          onChange={(e) => setNewExp({ ...newExp, location: e.target.value })}
                          className="p-2 border border-slate-200 rounded-lg bg-white"
                        />
                        <div className="sm:col-span-2">
                          <textarea
                            rows={2}
                            placeholder="Key responsibilities and achievements..."
                            value={newExp.description}
                            onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                            className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!newExp.title.trim()) return;
                          const updated = [...experienceList, newExp];
                          setExperienceList(updated);
                          setNewExp({ title: '', company: '', period: '', location: '', description: '' });
                          setShowExpModal(false);
                          try {
                            await api.updateSeekerProfile({ work_history: updated });
                            showToast('Work experience saved to database!');
                          } catch (e) {
                            showToast('Experience added.');
                          }
                        }}
                        className="px-4 py-1.5 bg-[#1976D2] text-white text-xs font-bold rounded-lg cursor-pointer"
                      >
                        Save Experience
                      </button>
                    </div>
                  )}

                  <div className="space-y-3">
                    {experienceList.length === 0 ? (
                      <div className="text-center py-8 text-slate-400 text-xs">
                        <Briefcase className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p className="font-semibold text-slate-600">No work experience listed yet</p>
                        <p className="text-slate-400 mt-0.5">Click "Add Experience" above to highlight your background.</p>
                      </div>
                    ) : (
                      experienceList.map((exp, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5 relative group">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-slate-900 text-sm">{exp.title}</h4>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-500">{exp.period}</span>
                              <button
                                type="button"
                                onClick={async () => {
                                  const updated = experienceList.filter((_, i) => i !== idx);
                                  setExperienceList(updated);
                                  await api.updateSeekerProfile({ work_history: updated });
                                  showToast('Entry removed.');
                                }}
                                className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs font-medium text-slate-600">{exp.company} • {exp.location}</p>
                          {exp.description && <p className="text-xs text-slate-500 leading-relaxed">{exp.description}</p>}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Skills Sub-Tab */}
              {activeSubTab === 'skills' && (
                <div className="space-y-5">
                  <div className="pb-3 border-b border-slate-100">
                    <h2 className="text-base font-bold text-slate-900">Skills & Expertise</h2>
                    <p className="text-xs text-slate-500">Technical languages, frameworks, tools and competencies.</p>
                  </div>

                  <form onSubmit={handleAddSkill} className="flex gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="e.g. Node.js, SQL, TailwindCSS"
                      className="flex-1 px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#1976D2] text-white text-xs font-bold rounded-xl"
                    >
                      Add Skill
                    </button>
                  </form>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {skillsList.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold rounded-xl"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => setSkillsList(skillsList.filter((s) => s !== skill))}
                          className="hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Resume Sub-Tab */}
              {activeSubTab === 'resume' && (
                <div className="space-y-5">
                  <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Resume & CV</h2>
                      <p className="text-xs text-slate-500">Manage uploaded CV document and auto-extract information.</p>
                    </div>
                    {resumeData.exists && (
                      <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                        Resume Active
                      </span>
                    )}
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#1976D2] flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{resumeData.name}</p>
                        <p className="text-xs text-slate-500">{resumeData.size} • Uploaded {resumeData.uploadDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => {
                          if (resumeData.url) window.open(resumeData.url, '_blank');
                          else setFullPreviewOpen(true);
                        }}
                        className="px-3.5 py-2 bg-white border border-slate-200 text-blue-600 font-bold rounded-xl text-xs hover:bg-blue-50 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Document</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setReplaceResumeModalOpen(true)}
                        className="px-3.5 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs hover:bg-blue-700 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload New Resume</span>
                      </button>
                    </div>
                  </div>

                  {/* Extract Info Card */}
                  <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50/50 rounded-2xl border border-blue-200/80 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
                        <Sparkles className="w-5 h-5 text-yellow-300" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">Auto-Extract Details from Resume</h4>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                          Extract your name, contact info, summary, education, experience, and key skills directly from your resume with our AI parser.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleExtractResume}
                      disabled={isExtracting}
                      className="w-full sm:w-auto px-5 py-2.5 bg-[#1976D2] hover:bg-[#1565C0] text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
                    >
                      <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                      <span>{isExtracting ? 'Extracting Resume Info...' : 'Extract Info from Uploaded Resume'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Preferred Location Sub-Tab */}
              {activeSubTab === 'location' && (
                <div className="space-y-5">
                  <div className="pb-3 border-b border-slate-100">
                    <h2 className="text-base font-bold text-slate-900">Preferred Work Locations</h2>
                    <p className="text-xs text-slate-500">Districts and cities where you are available to work.</p>
                  </div>

                  <div className="space-y-2">
                    {preferredLocations.map((loc, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800">
                        <span className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span>{loc}</span>
                        </span>
                        <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
                          Active
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Information Sub-Tab */}
              {activeSubTab === 'additional' && (
                <div className="space-y-5">
                  <div className="pb-3 border-b border-slate-100">
                    <h2 className="text-base font-bold text-slate-900">Additional Information</h2>
                    <p className="text-xs text-slate-500">Notice period, languages known and certifications.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-slate-400 text-[11px]">Notice Period</p>
                      <p className="font-bold text-slate-900 mt-0.5">Immediate (15 Days max)</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-slate-400 text-[11px]">Expected CTC</p>
                      <p className="font-bold text-slate-900 mt-0.5">₹ 2.5 – 3.2 LPA</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-slate-400 text-[11px]">Languages</p>
                      <p className="font-bold text-slate-900 mt-0.5">Tamil (Native), English (Fluent)</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-slate-400 text-[11px]">Two-Wheeler License</p>
                      <p className="font-bold text-emerald-600 mt-0.5">Yes, Available</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Column 3: Right Column Widgets (3 Cols) */}
            <div className="lg:col-span-3 space-y-5">
              {/* Widget 1: Resume Box matching Screenshot */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Resume</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Upload or manage your resume. Supported formats: PDF, DOC, DOCX (Max 5MB).
                  </p>
                </div>

                {/* File Card matching Screenshot */}
                <div className="p-3.5 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#1976D2] flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 text-xs truncate">
                        {resumeData.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">
                        Uploaded on {resumeData.uploadDate}
                      </p>
                      <p className="text-[10px] text-slate-500">Size: {resumeData.size}</p>
                    </div>
                  </div>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setResumeMenuOpen(!resumeMenuOpen)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {resumeMenuOpen && (
                      <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-xl border border-slate-200 p-1 z-30 text-[11px]">
                        <button
                          type="button"
                          onClick={() => {
                            setResumeMenuOpen(false);
                            if (resumeData.url) {
                              window.open(resumeData.url, '_blank');
                            } else {
                              setFullPreviewOpen(true);
                            }
                          }}
                          className="w-full text-left px-2.5 py-1.5 hover:bg-slate-50 rounded-md cursor-pointer flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-600" />
                          <span>View Resume</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setResumeMenuOpen(false);
                            if (resumeData.url) {
                              const a = document.createElement('a');
                              a.href = resumeData.url;
                              a.download = resumeData.name || 'resume.pdf';
                              a.target = '_blank';
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                              showToast('Downloading resume...');
                            } else {
                              showToast('No resume file URL found.');
                            }
                          }}
                          className="w-full text-left px-2.5 py-1.5 hover:bg-slate-50 rounded-md cursor-pointer flex items-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5 text-slate-600" />
                          <span>Download</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setResumeMenuOpen(false);
                            handleExtractResume();
                          }}
                          className="w-full text-left px-2.5 py-1.5 hover:bg-blue-50 text-blue-700 rounded-md cursor-pointer flex items-center gap-1.5 font-semibold"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                          <span>Extract Info</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Extract Info Action Button */}
                <button
                  type="button"
                  onClick={handleExtractResume}
                  disabled={isExtracting}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
                  title="Extract name, skills, summary, education, and work history"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                  <span>{isExtracting ? 'Extracting Resume Info...' : '⚡ Extract Info from Resume'}</span>
                </button>

                {/* Actions: Replace Resume & Remove matching Screenshot */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setReplaceResumeModalOpen(true)}
                    className="flex-1 py-2 px-3 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Replace Resume</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to remove your resume?')) {
                        setResumeData({
                          name: 'No resume uploaded yet',
                          uploadDate: '-',
                          size: '-',
                          exists: false,
                          url: null
                        });
                        showToast('Resume removed.');
                      }
                    }}
                    className="py-2 px-3 rounded-xl border border-red-500 text-red-600 hover:bg-red-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>

              {/* Widget 2: Resume Preview matching Screenshot */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">Resume Preview</h3>
                  <button
                    type="button"
                    onClick={() => {
                      if (resumeData.url) window.open(resumeData.url, '_blank');
                      else setFullPreviewOpen(true);
                    }}
                    className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    View Full Preview
                  </button>
                </div>

                {/* Resume Preview: Actual Uploaded PDF Document or Structured Overview */}
                {resumeData.url ? (
                  <div className="rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-shadow bg-slate-50 flex flex-col">
                    <div className="relative w-full h-[300px] bg-slate-100 overflow-hidden group">
                      <iframe
                        src={`${resumeData.url}#toolbar=0&navpanes=0&scrollbar=0`}
                        title="Uploaded Resume Preview"
                        className="w-full h-full border-0 bg-white"
                      />
                      <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-[1px]">
                        <button
                          type="button"
                          onClick={() => window.open(resumeData.url, '_blank')}
                          className="px-4 py-2 bg-white text-[#1976D2] font-bold text-xs rounded-xl shadow-lg hover:bg-blue-50 flex items-center gap-1.5 transition-all transform group-hover:scale-105 cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Open Full Resume</span>
                        </button>
                      </div>
                    </div>
                    <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span className="font-semibold text-slate-800 truncate text-[11px]">
                          {resumeData.name || 'resume.pdf'}
                        </span>
                      </div>
                      <a
                        href={resumeData.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-blue-600 hover:underline flex-shrink-0 ml-2"
                      >
                        View Full PDF
                      </a>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => setFullPreviewOpen(true)}
                    className="rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-shadow cursor-pointer bg-white text-[10px]"
                  >
                    <div className="grid grid-cols-12 min-h-[260px]">
                      {/* Left Dark Column */}
                      <div className="col-span-5 bg-[#0A192F] text-white p-3 space-y-2 flex flex-col items-center text-center">
                        <img
                          src={avatarUrl || kavinAvatar}
                          alt={fullName || 'Candidate'}
                          className="w-10 h-10 rounded-full object-cover border border-white/20 mt-1"
                        />
                        <div>
                          <p className="font-bold text-[10px] text-white uppercase tracking-tight truncate max-w-full">
                            {fullName ? fullName.toUpperCase() : 'CANDIDATE'}
                          </p>
                          <p className="text-[8px] text-blue-300 truncate max-w-full">
                            {skillsList[0] ? `${skillsList[0]} Specialist` : 'Job Seeker'}
                          </p>
                        </div>

                        <div className="text-[7px] text-slate-300 space-y-1 w-full text-left pt-2 border-t border-slate-700/60">
                          <p className="truncate">✉ {email || 'Email not set'}</p>
                          <p>📞 {phoneNumber || 'Phone not set'}</p>
                          <p className="truncate">📍 {currentLocation || 'Tamil Nadu'}</p>
                        </div>

                        <div className="text-[7px] text-slate-300 space-y-0.5 w-full text-left pt-2 border-t border-slate-700/60">
                          <p className="font-bold text-white text-[8px] uppercase">Skills</p>
                          {skillsList && skillsList.length > 0 ? (
                            skillsList.slice(0, 4).map((sk, idx) => (
                              <p key={idx} className="truncate">• {sk}</p>
                            ))
                          ) : (
                            <>
                              <p>• Python, JavaScript</p>
                              <p>• React, Next.js</p>
                              <p>• MySQL, FastAPI</p>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Right Content Column */}
                      <div className="col-span-7 p-3 bg-white space-y-2 text-[8px] text-slate-700">
                        <div>
                          <p className="font-bold text-slate-900 uppercase text-[8px]">
                            Professional Summary
                          </p>
                          <p className="text-[7px] text-slate-500 line-clamp-3 mt-0.5 leading-tight">
                            {summary || 'Software engineering professional focused on building reliable systems, writing clean code, and contributing to high impact products.'}
                          </p>
                        </div>

                        <div className="pt-1 border-t border-slate-100">
                          <p className="font-bold text-slate-900 uppercase text-[8px]">Education</p>
                          {educationList && educationList.length > 0 ? (
                            educationList.slice(0, 2).map((edu, idx) => (
                              <div key={idx} className="mt-0.5">
                                <p className="font-semibold text-slate-800 text-[7px] truncate">{edu.degree}</p>
                                <p className="text-[6px] text-slate-400 truncate">{edu.institution} {edu.year ? `• ${edu.year}` : ''}</p>
                              </div>
                            ))
                          ) : (
                            <>
                              <p className="font-semibold text-slate-800 text-[7px] mt-0.5">B.Sc. Computer Science</p>
                              <p className="text-[6px] text-slate-400">Bharathiar University</p>
                            </>
                          )}
                        </div>

                        <div className="pt-1 border-t border-slate-100">
                          <p className="font-bold text-slate-900 uppercase text-[8px]">Experience & Projects</p>
                          {experienceList && experienceList.length > 0 ? (
                            experienceList.slice(0, 2).map((exp, idx) => (
                              <div key={idx} className="mt-0.5">
                                <p className="font-semibold text-slate-800 text-[7px] truncate">{exp.title} {exp.company ? `• ${exp.company}` : ''}</p>
                                <p className="text-[6px] text-slate-400 truncate">{exp.period || exp.location || ''}</p>
                              </div>
                            ))
                          ) : (
                            <>
                              <p className="font-semibold text-slate-800 text-[7px] mt-0.5">Software Developer Intern</p>
                              <p className="text-[6px] text-slate-400">Doozy Info Software Solutions</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Widget 3: Profile Tips matching Screenshot */}
              <div className="bg-[#EBFBF5] rounded-2xl border border-emerald-200/80 p-5 space-y-3">
                <div className="flex items-center gap-2 text-emerald-900">
                  <Lightbulb className="w-5 h-5 text-emerald-600" />
                  <h4 className="font-bold text-sm">Profile Tips</h4>
                </div>

                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Add a clear professional summary</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Include your key skills</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Upload an updated resume</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Keep your contact details correct</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Full Resume Preview Modal */}
      {fullPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900">
                  Curriculum Vitae — {fullName || 'Candidate'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setFullPreviewOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-5 rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="grid grid-cols-12 min-h-[420px]">
                {/* Left Sidebar in modal */}
                <div className="col-span-4 bg-[#0A192F] text-white p-5 space-y-4">
                  <div className="text-center">
                    <img
                      src={avatarUrl || kavinAvatar}
                      alt={fullName || 'Candidate'}
                      className="w-20 h-20 rounded-full object-cover mx-auto ring-2 ring-white/20"
                    />
                    <h4 className="font-bold text-sm text-white mt-2 uppercase">{fullName || 'Candidate'}</h4>
                    <p className="text-xs text-blue-300">{skillsList[0] ? `${skillsList[0]} Specialist` : 'Job Seeker'}</p>
                  </div>

                  <div className="text-xs space-y-2 pt-3 border-t border-slate-800 text-slate-300">
                    <p className="truncate">✉ {email || 'Email not set'}</p>
                    <p>📞 {phoneNumber || 'Phone not set'}</p>
                    <p>📍 {currentLocation || 'Tamil Nadu'}</p>
                    {portfolioUrl && <p className="truncate">🌐 {portfolioUrl}</p>}
                  </div>

                  <div className="pt-3 border-t border-slate-800 text-xs space-y-1">
                    <p className="font-bold text-white text-xs uppercase tracking-wide">Key Skills</p>
                    {skillsList.slice(0, 7).map((s) => (
                      <p key={s} className="text-slate-300 text-xs">• {s}</p>
                    ))}
                  </div>
                </div>

                {/* Right Body in modal */}
                <div className="col-span-8 p-6 bg-white space-y-4 text-xs text-slate-700">
                  <div>
                    <h5 className="font-bold text-slate-900 uppercase tracking-wide text-xs">
                      Professional Summary
                    </h5>
                    <p className="text-slate-600 leading-relaxed mt-1">{summary}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <h5 className="font-bold text-slate-900 uppercase tracking-wide text-xs mb-2">
                      Education
                    </h5>
                    {educationList.map((edu, i) => (
                      <div key={i} className="mb-2">
                        <p className="font-bold text-slate-900">{edu.degree}</p>
                        <p className="text-slate-500 text-[11px]">{edu.institution} ({edu.year})</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <h5 className="font-bold text-slate-900 uppercase tracking-wide text-xs mb-2">
                      Experience & Projects
                    </h5>
                    {experienceList.map((exp, i) => (
                      <div key={i} className="mb-2">
                        <p className="font-bold text-slate-900">{exp.title} • {exp.company}</p>
                        <p className="text-slate-500 text-[11px]">{exp.period}</p>
                        <p className="text-slate-600 mt-0.5">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              {resumeData.url && (
                <button
                  type="button"
                  onClick={() => window.open(resumeData.url, '_blank')}
                  className="px-4 py-2.5 text-xs font-bold text-[#1976D2] border border-blue-600 hover:bg-blue-50 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Uploaded PDF</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  if (resumeData.url) {
                    const a = document.createElement('a');
                    a.href = resumeData.url;
                    a.download = resumeData.name || 'resume.pdf';
                    a.target = '_blank';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    showToast('Downloading resume...');
                  } else {
                    showToast('Resume downloaded to your device!');
                  }
                  setFullPreviewOpen(false);
                }}
                className="px-5 py-2.5 text-xs font-bold text-white bg-[#1976D2] hover:bg-[#1565C0] rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Resume</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Replace Resume Modal */}
      {replaceResumeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Replace Resume</h3>
              <button
                type="button"
                onClick={() => setReplaceResumeModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-5 p-6 border-2 border-dashed border-blue-300 rounded-2xl bg-blue-50/40 text-center space-y-2">
              <Upload className="w-8 h-8 text-blue-600 mx-auto" />
              <p className="text-xs font-bold text-slate-800">Drag and drop your file here, or browse</p>
              <p className="text-[11px] text-slate-400">Supported formats: PDF, DOCX (Max 5MB)</p>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                id="modal-resume-upload"
                onChange={async (e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    try {
                      showToast('Uploading resume and extracting information...');
                      const res = await api.uploadResume(file, true);
                      setResumeData({
                        name: file.name,
                        uploadDate: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
                        size: `${(file.size / 1024).toFixed(0)} KB`,
                        exists: true,
                        url: res.resume_url || null
                      });

                      if (res.extracted) {
                        const ext = res.extracted;
                        if (ext.name) setFullName(ext.name);
                        if (ext.email) setEmail(ext.email);
                        if (ext.phone) setPhoneNumber(ext.phone);
                        if (ext.linkedin_url) setLinkedinUrl(ext.linkedin_url);
                        if (ext.professional_summary) setSummary(ext.professional_summary);
                        if (ext.skills && Array.isArray(ext.skills)) setSkillsList(ext.skills);
                        if (ext.education && Array.isArray(ext.education)) setEducationList(ext.education);
                        if (ext.work_history && Array.isArray(ext.work_history)) setExperienceList(ext.work_history);

                        const stored = api.getStoredUser?.() || {};
                        if (ext.name) stored.name = ext.name;
                        if (ext.email) stored.email = ext.email;
                        if (ext.phone) stored.phone = ext.phone;
                        localStorage.setItem('stark_user', JSON.stringify(stored));
                      }

                      setReplaceResumeModalOpen(false);
                      showToast('Resume uploaded and details auto-extracted successfully!');
                    } catch (err) {
                      console.error('Server resume upload error:', err);
                      setResumeData({
                        name: file.name,
                        uploadDate: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
                        size: `${(file.size / 1024).toFixed(0)} KB`,
                        exists: true
                      });
                      setReplaceResumeModalOpen(false);
                      showToast('Resume updated: ' + (err.message || 'Saved locally'));
                    }
                  }
                }}
              />
              <button
                type="button"
                onClick={() => document.getElementById('modal-resume-upload').click()}
                className="mt-2 px-4 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-semibold"
              >
                Choose File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
