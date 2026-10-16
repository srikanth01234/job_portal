import React, { useState } from 'react';
import {
  User,
  Bell,
  MapPin,
  ShieldCheck,
  Lock,
  Trash2,
  Camera,
  Calendar,
  ChevronDown,
  Mail,
  FileText,
  Megaphone,
  Briefcase,
  GraduationCap,
  IndianRupee,
  BarChart3,
  Edit3,
  Check,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  X,
  Search,
  Menu,
  Sliders,
  Shield,
  Smartphone
} from 'lucide-react';
import JobSeekerSidebar from './JobSeekerSidebar';
import kavinAvatar from '../assets/kavin_avatar.jpg';

export default function JobSeekerSettings({
  onLogout,
  onNavigateTab,
  onNavigateHome
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Active Sub-Tab
  const [activeSubTab, setActiveSubTab] = useState('account'); // 'account', 'notifications', 'job-pref', 'privacy', 'password', 'delete'

  // Account Form States
  const [fullName, setFullName] = useState('Kavin Raj');
  const [dob, setDob] = useState('12 Mar 2000');
  const [email, setEmail] = useState('kavinraj@gmail.com');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('98765 43210');
  const [gender, setGender] = useState('Male');
  const [currentLocation, setCurrentLocation] = useState('Thoothukudi, Tamil Nadu');

  // Notification Preferences Toggles
  const [notifPreferences, setNotifPreferences] = useState({
    jobRecommendations: true,
    applicationUpdates: true,
    interviewReminders: true,
    promotionalEmails: false,
    smsAlerts: true,
    whatsappAlerts: false
  });

  // Job Preferences States
  const [jobPreferences, setJobPreferences] = useState({
    locations: 'Thoothukudi, Tirunelveli',
    jobTypes: 'Full-time, Part-time',
    categories: 'IT & Software, Education',
    expectedSalary: '₹ 15,000 – 25,000',
    experienceLevel: '0 – 3 years'
  });
  const [editPrefModalOpen, setEditPrefModalOpen] = useState(false);

  // Privacy & Visibility States
  const [profileVisibility, setProfileVisibility] = useState('Public'); // 'Public', 'Applied Only', 'Private'
  const [showContactDetails, setShowContactDetails] = useState(true);
  const [allowSearchEngines, setAllowSearchEngines] = useState(false);

  // Change Password States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Delete Account Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

  // Toast
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleToggleNotification = (key) => {
    setNotifPreferences((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
    showToast('Notification preference updated');
  };

  const handleSaveAccount = (e) => {
    e.preventDefault();
    showToast('Account details saved successfully!');
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('Please fill all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match');
      return;
    }
    showToast('Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmationText.toLowerCase() !== 'delete') {
      showToast('Please type "DELETE" to confirm');
      return;
    }
    setDeleteModalOpen(false);
    showToast('Account deleted. Logging out...');
    setTimeout(() => {
      if (onLogout) onLogout();
    }, 1200);
  };

  const SUB_TABS = [
    {
      id: 'account',
      title: 'Account Settings',
      sub: 'Personal information and login',
      icon: User
    },
    {
      id: 'notifications',
      title: 'Notification Preferences',
      sub: 'Manage email and alerts',
      icon: Bell
    },
    {
      id: 'job-pref',
      title: 'Job Preferences',
      sub: 'Your preferred job details',
      icon: MapPin
    },
    {
      id: 'privacy',
      title: 'Privacy & Visibility',
      sub: 'Control your profile visibility',
      icon: ShieldCheck
    },
    {
      id: 'password',
      title: 'Change Password',
      sub: 'Update your password',
      icon: Lock
    },
    {
      id: 'delete',
      title: 'Delete Account',
      sub: 'Permanently delete your account',
      icon: Trash2
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans antialiased text-slate-800">
      {/* Job Seeker Sidebar with 'settings' active tab */}
      <JobSeekerSidebar
        activeTab="settings"
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
                      Settings Updated
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 py-3">
                    Your password was last updated 30 days ago.
                  </p>
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
                      onClick={() => onNavigateTab && onNavigateTab('profile')}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50"
                    >
                      My Profile & Resume
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

          {/* Page Heading matching Screenshot */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Settings
            </h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1">
              Manage your account, preferences and notifications.
            </p>
          </div>

          {/* 2-Column Architecture matching Screenshot */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Sub-navigation Menu (4 cols) */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-3 space-y-1">
              {SUB_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeSubTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveSubTab(tab.id)}
                    className={`w-full flex items-start gap-3.5 px-4 py-3 rounded-xl transition-all cursor-pointer text-left relative ${
                      isActive
                        ? 'bg-[#EBF5FF] text-[#1976D2]'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {/* Active Left Indicator Bar */}
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#1976D2] rounded-r-md" />
                    )}

                    <div className="mt-0.5">
                      <Icon className={`w-5 h-5 ${isActive ? 'text-[#1976D2]' : 'text-slate-400'}`} />
                    </div>

                    <div className="min-w-0">
                      <h4 className={`text-xs sm:text-sm font-bold ${isActive ? 'text-[#1976D2]' : 'text-slate-900'}`}>
                        {tab.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {tab.sub}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Main Content Area (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* VIEW 1: Account Settings (Default / Matching Screenshot) */}
              {(activeSubTab === 'account' || activeSubTab === 'notifications' || activeSubTab === 'job-pref') && (
                <>
                  {/* Card 1: Account Settings matching Screenshot */}
                  <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-6">
                    <form onSubmit={handleSaveAccount} className="space-y-6">
                      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                        <div>
                          <h2 className="text-base sm:text-lg font-bold text-slate-900">
                            Account Settings
                          </h2>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Update your personal information and account details.
                          </p>
                        </div>

                        <button
                          type="submit"
                          className="bg-[#1976D2] hover:bg-[#1565C0] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer shadow-xs"
                        >
                          Save Changes
                        </button>
                      </div>

                      {/* Photo Section */}
                      <div className="flex items-center gap-5">
                        <div className="relative">
                          <img
                            src={kavinAvatar}
                            alt="Kavin Raj"
                            className="w-20 h-20 rounded-full object-cover shadow-sm ring-2 ring-slate-100"
                          />
                          <label
                            htmlFor="settings-photo"
                            className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#0A192F] text-white flex items-center justify-center cursor-pointer shadow-xs hover:bg-blue-600 transition-colors"
                          >
                            <Camera className="w-3.5 h-3.5" />
                            <input
                              id="settings-photo"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={() => showToast('Photo updated successfully!')}
                            />
                          </label>
                        </div>

                        <div>
                          <button
                            type="button"
                            onClick={() => document.getElementById('settings-photo').click()}
                            className="px-3.5 py-1.5 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-50 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Change Photo
                          </button>
                          <p className="text-[11px] text-slate-400 mt-1.5">
                            Recommended size 400 × 400 px
                          </p>
                          <p className="text-[11px] text-slate-400">JPG, PNG (Max 2MB)</p>
                        </div>
                      </div>

                      {/* Form Inputs Grid matching Screenshot */}
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
                    </form>
                  </div>

                  {/* Card 2: Notification Preferences matching Screenshot */}
                  <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-5">
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-slate-900">
                        Notification Preferences
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Choose what updates you want to receive.
                      </p>
                    </div>

                    <div className="divide-y divide-slate-100 space-y-1">
                      {/* Toggle 1: New job recommendations */}
                      <div className="pt-3 flex items-center justify-between gap-4">
                        <div className="flex items-start gap-3.5">
                          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                            <Mail className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                              New job recommendations
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Get notified about new jobs matching your profile.
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleNotification('jobRecommendations')}
                          className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
                            notifPreferences.jobRecommendations ? 'bg-[#1976D2]' : 'bg-slate-300'
                          }`}
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                              notifPreferences.jobRecommendations ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Toggle 2: Application status updates */}
                      <div className="pt-4 flex items-center justify-between gap-4">
                        <div className="flex items-start gap-3.5">
                          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                              Application status updates
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Get notified when there is an update on your applications.
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleNotification('applicationUpdates')}
                          className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
                            notifPreferences.applicationUpdates ? 'bg-[#1976D2]' : 'bg-slate-300'
                          }`}
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                              notifPreferences.applicationUpdates ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Toggle 3: Interview reminders */}
                      <div className="pt-4 flex items-center justify-between gap-4">
                        <div className="flex items-start gap-3.5">
                          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                            <Calendar className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                              Interview reminders
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Get reminders for upcoming interviews.
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleNotification('interviewReminders')}
                          className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
                            notifPreferences.interviewReminders ? 'bg-[#1976D2]' : 'bg-slate-300'
                          }`}
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                              notifPreferences.interviewReminders ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Toggle 4: Promotional emails */}
                      <div className="pt-4 flex items-center justify-between gap-4">
                        <div className="flex items-start gap-3.5">
                          <div className="p-2 bg-slate-100 text-slate-600 rounded-xl">
                            <Megaphone className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                              Promotional emails
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Receive tips, career guidance and important updates.
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleNotification('promotionalEmails')}
                          className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
                            notifPreferences.promotionalEmails ? 'bg-[#1976D2]' : 'bg-slate-300'
                          }`}
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                              notifPreferences.promotionalEmails ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Job Preferences matching Screenshot */}
                  <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-base sm:text-lg font-bold text-slate-900">
                          Job Preferences
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Set your preferences to get better job recommendations.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setEditPrefModalOpen(true)}
                        className="px-4 py-2 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-50 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Preferences</span>
                      </button>
                    </div>

                    {/* 5 Badges matching Screenshot */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                      {/* 1. Preferred Locations */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-semibold text-slate-500">Preferred Locations</span>
                        </div>
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {jobPreferences.locations}
                        </p>
                      </div>

                      {/* 2. Job Types */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Briefcase className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-semibold text-slate-500">Job Types</span>
                        </div>
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {jobPreferences.jobTypes}
                        </p>
                      </div>

                      {/* 3. Categories */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <GraduationCap className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-semibold text-slate-500">Categories</span>
                        </div>
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {jobPreferences.categories}
                        </p>
                      </div>

                      {/* 4. Expected Salary */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <IndianRupee className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-semibold text-slate-500">Expected Salary</span>
                        </div>
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {jobPreferences.expectedSalary}
                        </p>
                      </div>

                      {/* 5. Experience Level */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1 col-span-2 sm:col-span-1">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <BarChart3 className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-semibold text-slate-500">Experience Level</span>
                        </div>
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {jobPreferences.experienceLevel}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* VIEW 2: Privacy & Visibility Sub-page */}
              {activeSubTab === 'privacy' && (
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-6">
                  <div className="pb-4 border-b border-slate-100">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">
                      Privacy & Visibility
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Control who can view your profile, contact details, and uploaded resume.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      Profile Visibility Mode
                    </h3>

                    <div className="space-y-3">
                      {[
                        {
                          id: 'Public',
                          title: 'Public (Recommended)',
                          desc: 'All registered employers and recruiters across Tamil Nadu can discover your profile and invite you to apply.'
                        },
                        {
                          id: 'Applied Only',
                          title: 'Visible Only to Applied Employers',
                          desc: 'Only companies you actively submit job applications to can view your CV and profile information.'
                        },
                        {
                          id: 'Private',
                          title: 'Private / Anonymous',
                          desc: 'Your profile is hidden from all searches. Suitable when currently employed.'
                        }
                      ].map((opt) => (
                        <label
                          key={opt.id}
                          onClick={() => {
                            setProfileVisibility(opt.id);
                            showToast(`Visibility set to ${opt.id}`);
                          }}
                          className={`p-4 rounded-xl border flex items-start gap-3.5 cursor-pointer transition-all ${
                            profileVisibility === opt.id
                              ? 'border-[#1976D2] bg-blue-50/40 ring-1 ring-blue-500/20'
                              : 'border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="visibility"
                            checked={profileVisibility === opt.id}
                            onChange={() => setProfileVisibility(opt.id)}
                            className="mt-1 text-blue-600"
                          />
                          <div>
                            <p className="text-xs sm:text-sm font-bold text-slate-900">{opt.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-slate-100 space-y-3">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                        Contact Details Privacy
                      </h3>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-slate-800">Show Phone Number to Verified Employers</p>
                          <p className="text-[11px] text-slate-400">Allow employers to call directly for urgent interview schedules</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setShowContactDetails(!showContactDetails);
                            showToast('Contact privacy setting updated');
                          }}
                          className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                            showContactDetails ? 'bg-[#1976D2]' : 'bg-slate-300'
                          }`}
                        >
                          <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${showContactDetails ? 'translate-x-5' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 3: Change Password Sub-page */}
              {activeSubTab === 'password' && (
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-6">
                  <div className="pb-4 border-b border-slate-100">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">
                      Change Password
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Ensure your account stays secure by using a strong password.
                    </p>
                  </div>

                  <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-lg">
                    {/* Current Password */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Current Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPass ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password"
                          className="w-full px-3.5 py-2 pr-10 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPass(!showCurrentPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        New Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPass ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password (min. 8 characters)"
                          className="w-full px-3.5 py-2 pr-10 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPass(!showNewPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm New Password */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Confirm New Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPass ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          className="w-full px-3.5 py-2 pr-10 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPass(!showConfirmPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="bg-[#1976D2] hover:bg-[#1565C0] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs cursor-pointer"
                      >
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* VIEW 4: Delete Account Sub-page */}
              {activeSubTab === 'delete' && (
                <div className="bg-white rounded-2xl border border-red-200 shadow-xs p-6 space-y-5">
                  <div className="flex items-center gap-3 text-red-600 pb-3 border-b border-red-100">
                    <AlertTriangle className="w-6 h-6 flex-shrink-0" />
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-red-600">
                        Delete Account
                      </h2>
                      <p className="text-xs text-slate-500">
                        Permanently delete your Stark Jobs job seeker account and all associated data.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-red-50 rounded-xl border border-red-200 text-xs text-red-800 space-y-2">
                    <p className="font-bold">Warning: This action is permanent and cannot be undone.</p>
                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                      <li>All your saved jobs, applications, and interview records will be erased.</li>
                      <li>Companies will no longer be able to review your profile or contact you.</li>
                      <li>Your uploaded resume file and skill endorsements will be deleted.</li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => setDeleteModalOpen(true)}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Delete My Account
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Edit Job Preferences Modal */}
      {editPrefModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Edit Job Preferences</h3>
              <button
                type="button"
                onClick={() => setEditPrefModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Preferred Locations</label>
                <input
                  type="text"
                  value={jobPreferences.locations}
                  onChange={(e) => setJobPreferences({ ...jobPreferences, locations: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Job Types</label>
                <input
                  type="text"
                  value={jobPreferences.jobTypes}
                  onChange={(e) => setJobPreferences({ ...jobPreferences, jobTypes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Categories</label>
                <input
                  type="text"
                  value={jobPreferences.categories}
                  onChange={(e) => setJobPreferences({ ...jobPreferences, categories: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Expected Salary</label>
                <input
                  type="text"
                  value={jobPreferences.expectedSalary}
                  onChange={(e) => setJobPreferences({ ...jobPreferences, expectedSalary: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Experience Level</label>
                <input
                  type="text"
                  value={jobPreferences.experienceLevel}
                  onChange={(e) => setJobPreferences({ ...jobPreferences, experienceLevel: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 mt-5 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditPrefModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditPrefModalOpen(false);
                  showToast('Job preferences saved!');
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-[#1976D2] hover:bg-[#1565C0] rounded-xl"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 text-center">
              Are you absolutely sure?
            </h3>
            <p className="text-xs text-slate-500 text-center mt-2 leading-relaxed">
              This action cannot be undone. Please type <span className="font-bold text-red-600">DELETE</span> to confirm.
            </p>

            <input
              type="text"
              value={deleteConfirmationText}
              onChange={(e) => setDeleteConfirmationText(e.target.value)}
              placeholder="Type DELETE"
              className="mt-4 w-full px-3.5 py-2 text-xs border border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 text-center font-bold"
            />

            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
