import React, { useState } from 'react';
import {
  User,
  Lock,
  Bell,
  Users,
  CreditCard,
  ShieldCheck,
  Trash2,
  Check,
  Eye,
  EyeOff,
  Camera,
  AlertTriangle,
  Download,
  AlertCircle,
  Mail,
  Calendar,
  FileText,
  Megaphone,
  Search,
  ChevronDown,
  Menu,
  Shield,
  CheckCircle2,
  X,
  Plus
} from 'lucide-react';
import CompanySidebar from './CompanySidebar';

/**
 * Company Account Settings Component (Single File Implementation)
 * Exact recreation of the reference screenshot:
 * - Reusable Employer Sidebar (Account Settings active tab)
 * - Top header with search, notification, and profile avatar
 * - Breadcrumbs: Home > Account Settings
 * - Left sub-navigation tab list (Profile & Access, Change Password, Notification Preferences, Team Members, Billing & Plans, Data & Privacy, Delete Account)
 * - Main 2x2 grid cards:
 *   - Card 1: Profile & Access (Avatar ABC, Change Photo, Verified Company badge, Full Name, Email, Phone, Designation, Save Changes button)
 *   - Card 2: Change Password (Current Password, New Password, Confirm New Password, Eye toggles, Update Password button)
 *   - Card 3: Notification Preferences (5 Toggle switches with icons)
 *   - Card 4: Data & Privacy (Download My Data, Deactivate Account)
 *   - Card 5: Delete Account (Danger alert card with Delete Account button)
 * - Interactive modals for Team Members, Billing, and Photo change
 */
export default function CompanyAccountSettings({
  onLogout,
  onNavigateHome,
  onNavigateTab
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('profile'); // 'profile', 'password', 'notifications', 'team', 'billing', 'privacy', 'delete'

  // Profile Form States
  const [fullName, setFullName] = useState('ABC Industrial Services');
  const [emailAddress, setEmailAddress] = useState('abcindustrial@gmail.com');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('98765 43210');
  const [designation, setDesignation] = useState('HR Manager');
  const [customPhoto, setCustomPhoto] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState('');

  // Password Form States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Notification Preferences Toggles
  const [notifications, setNotifications] = useState({
    newApplications: true,
    interviewReminders: true,
    jobStatusUpdates: true,
    accountSecurity: true,
    marketingUpdates: false,
  });

  // Modals for secondary tabs
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [billingModalOpen, setBillingModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Toggle helper
  const handleToggle = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Profile Save
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSaveSuccess('Profile and account details saved successfully!');
    setTimeout(() => setSaveSuccess(''), 4000);
  };

  // Password Update
  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!currentPassword) {
      alert('Please enter your current password.');
      return;
    }
    if (newPassword.length < 6) {
      alert('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('New password and confirmation do not match.');
      return;
    }
    setPasswordSuccess('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(''), 4000);
  };

  const handleChangePhoto = () => {
    const url = prompt('Enter custom profile photo image URL or leave empty for default:', 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=150&h=150&fit=crop');
    if (url) {
      setCustomPhoto(url);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex font-sans">
      {/* Reusable Employer Sidebar with active tab: settings */}
      <CompanySidebar
        activeTab="settings"
        onSelectTab={(tabId) => {
          if (tabId === 'settings') return;
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
                placeholder="Search candidates, jobs, or anything..."
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
                    <h4 className="text-sm font-bold text-slate-900">Account Alerts</h4>
                    <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
                      1 New
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto mt-2 text-xs">
                    <div className="py-2.5">
                      <p className="font-semibold text-slate-800">Security audit complete</p>
                      <p className="text-slate-500 mt-0.5">Your employer account has 2FA enabled.</p>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">Today</span>
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

        {/* Account Settings Main Content */}
        <main className="p-4 sm:p-8 space-y-6 flex-1">
          {/* Breadcrumbs & Page Header Strip */}
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
              <span className="text-slate-700 font-semibold">Account Settings</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Account Settings
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Manage your account, notifications and preferences.
            </p>
          </div>

          {/* Feedback Banners */}
          {saveSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs sm:text-sm font-bold text-emerald-800 animate-in fade-in duration-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{saveSuccess}</span>
            </div>
          )}

          {passwordSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs sm:text-sm font-bold text-emerald-800 animate-in fade-in duration-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          {/* Main Workspace (Left Sub-Navigation + Right Content Cards) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT SUB-NAVIGATION TABS (3 cols) */}
            <div className="lg:col-span-3 bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs space-y-1">
              {[
                { id: 'profile', label: 'Profile & Access', icon: User },
                { id: 'password', label: 'Change Password', icon: Lock },
                { id: 'notifications', label: 'Notification Preferences', icon: Bell },
                { id: 'team', label: 'Team Members', icon: Users, isModal: true },
                { id: 'billing', label: 'Billing & Plans', icon: CreditCard, isModal: true },
                { id: 'privacy', label: 'Data & Privacy', icon: ShieldCheck },
                { id: 'delete', label: 'Delete Account', icon: Trash2 },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeSubTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      if (tab.isModal) {
                        if (tab.id === 'team') setTeamModalOpen(true);
                        if (tab.id === 'billing') setBillingModalOpen(true);
                        return;
                      }
                      setActiveSubTab(tab.id);
                      // Smooth scroll to target card if in single-page view
                      const el = document.getElementById(`section-${tab.id}`);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer text-left select-none ${
                      isActive
                        ? 'bg-blue-50 text-[#1976D2] border border-blue-200/60 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#1976D2]' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* RIGHT CONTENT CARDS AREA (9 cols) */}
            <div className="lg:col-span-9 space-y-6">
              {/* CARD 1: Profile & Access (Full Width) */}
              <div
                id="section-profile"
                className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Profile & Access</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Manage your account information and login details.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    className="px-5 py-2 bg-[#1976D2] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-center"
                  >
                    Save Changes
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Left Avatar & Photo Action */}
                  <div className="md:col-span-5 flex items-center gap-4">
                    <div className="relative">
                      {customPhoto ? (
                        <img
                          src={customPhoto}
                          alt="Avatar"
                          className="w-18 h-18 rounded-full object-cover border-2 border-slate-200 shadow-xs"
                        />
                      ) : (
                        <div className="w-18 h-18 rounded-full bg-[#0A192F] text-white font-black text-xl flex items-center justify-center shadow-xs tracking-wider">
                          ABC
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={handleChangePhoto}
                        className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white border border-slate-300 text-slate-600 flex items-center justify-center shadow-xs hover:bg-slate-50 cursor-pointer"
                        title="Upload Photo"
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">
                        ABC Industrial Services
                      </h4>
                      <p className="text-xs text-slate-500 leading-tight">
                        Employer Account
                      </p>
                      <div className="pt-0.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Verified Company</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Change Photo Button & Recommendation */}
                  <div className="md:col-span-7 flex flex-col sm:flex-row sm:items-center gap-3">
                    <button
                      type="button"
                      onClick={handleChangePhoto}
                      className="px-3.5 py-2 border border-blue-600 bg-white hover:bg-blue-50 text-[#1976D2] font-bold text-xs rounded-xl transition-colors cursor-pointer self-start"
                    >
                      Change Photo
                    </button>
                    <span className="text-[11px] text-slate-400">
                      Recommended size 400 × 400 px
                    </span>
                  </div>
                </div>

                {/* Form Fields matching screenshot */}
                <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex gap-2">
                        <div className="flex items-center gap-1 px-3 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs font-bold text-slate-700">
                          <span>🇮🇳</span>
                          <span>+91</span>
                          <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
                        </div>
                        <input
                          type="text"
                          required
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="flex-1 px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Designation */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Designation
                      </label>
                      <input
                        type="text"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </form>
              </div>

              {/* ROW 2: 2 Column Cards (Change Password & Notification Preferences) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* CARD 2: Change Password */}
                <div
                  id="section-password"
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1976D2] flex items-center justify-center flex-shrink-0">
                        <Lock className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 leading-tight">
                          Change Password
                        </h3>
                        <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                          Update your account password regularly.
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleUpdatePassword} className="space-y-3.5">
                      {/* Current Password */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Current Password <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrent ? 'text' : 'password'}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter current password"
                            className="w-full px-3.5 py-2 bg-slate-50/60 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 pr-9"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrent(!showCurrent)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showCurrent ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* New Password */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          New Password <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showNew ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            className="w-full px-3.5 py-2 bg-slate-50/60 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 pr-9"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNew(!showNew)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showNew ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Confirm New Password */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Confirm New Password <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirm ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            className="w-full px-3.5 py-2 bg-slate-50/60 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 pr-9"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showConfirm ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-[#1976D2] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                        >
                          Update Password
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* CARD 3: Notification Preferences */}
                <div
                  id="section-notifications"
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1976D2] flex items-center justify-center flex-shrink-0">
                      <Bell className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">
                        Notification Preferences
                      </h3>
                      <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                        Choose what updates you want to receive.
                      </p>
                    </div>
                  </div>

                  {/* Toggles list matching screenshot */}
                  <div className="space-y-3 pt-1">
                    {/* Toggle 1: New Applications */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <Mail className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 leading-tight">
                            New Applications
                          </h4>
                          <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                            Get notified when candidates apply to your jobs.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggle('newApplications')}
                        className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer flex-shrink-0 ${
                          notifications.newApplications ? 'bg-[#1976D2]' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            notifications.newApplications ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Toggle 2: Interview Reminders */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <Calendar className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 leading-tight">
                            Interview Reminders
                          </h4>
                          <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                            Receive reminders for scheduled interviews.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggle('interviewReminders')}
                        className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer flex-shrink-0 ${
                          notifications.interviewReminders ? 'bg-[#1976D2]' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            notifications.interviewReminders ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Toggle 3: Job Status Updates */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <FileText className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 leading-tight">
                            Job Status Updates
                          </h4>
                          <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                            Get updates when your job postings are approved.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggle('jobStatusUpdates')}
                        className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer flex-shrink-0 ${
                          notifications.jobStatusUpdates ? 'bg-[#1976D2]' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            notifications.jobStatusUpdates ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Toggle 4: Account & Security */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <ShieldCheck className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 leading-tight">
                            Account & Security
                          </h4>
                          <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                            Important account related notifications.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggle('accountSecurity')}
                        className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer flex-shrink-0 ${
                          notifications.accountSecurity ? 'bg-[#1976D2]' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            notifications.accountSecurity ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Toggle 5: Marketing & Product Updates */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <Megaphone className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 leading-tight">
                            Marketing & Product Updates
                          </h4>
                          <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                            Receive tips, new features and platform updates.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggle('marketingUpdates')}
                        className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer flex-shrink-0 ${
                          notifications.marketingUpdates ? 'bg-[#1976D2]' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            notifications.marketingUpdates ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ROW 3: 2 Column Cards (Data & Privacy + Delete Account) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* CARD 4: Data & Privacy */}
                <div
                  id="section-privacy"
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1976D2] flex items-center justify-center flex-shrink-0">
                      <Shield className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">
                        Data & Privacy
                      </h3>
                      <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                        Manage your data and account privacy.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3.5 pt-1">
                    {/* Download My Data */}
                    <div className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-start gap-2.5">
                        <Download className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 leading-tight">
                            Download My Data
                          </h4>
                          <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                            Get a copy of your company data, jobs and applicants.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => alert('Compiling company data export... Download will begin shortly.')}
                        className="px-3 py-1.5 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer flex-shrink-0"
                      >
                        Download
                      </button>
                    </div>

                    {/* Deactivate Account */}
                    <div className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 leading-tight">
                            Deactivate Account
                          </h4>
                          <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                            Temporarily deactivate your account.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm('Are you sure you want to temporarily deactivate your company portal account?')) {
                            alert('Your account is set to inactive. Contact Stark Jobs support to reactivate.');
                          }
                        }}
                        className="px-3 py-1.5 border border-amber-300 bg-white hover:bg-amber-50 text-amber-700 font-bold text-xs rounded-xl transition-colors cursor-pointer flex-shrink-0"
                      >
                        Deactivate
                      </button>
                    </div>
                  </div>
                </div>

                {/* CARD 5: Delete Account */}
                <div
                  id="section-delete"
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
                      <Trash2 className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">
                        Delete Account
                      </h3>
                      <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                        Permanently delete your account and all data.
                      </p>
                    </div>
                  </div>

                  {/* Warning Box matching screenshot */}
                  <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-xl flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-rose-700 leading-tight">
                        This action cannot be undone.
                      </h4>
                      <p className="text-[11px] text-rose-600 leading-snug mt-0.5">
                        All your data, job postings and applicant information will be permanently deleted.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-center sm:justify-end">
                    <button
                      type="button"
                      onClick={() => setDeleteModalOpen(true)}
                      className="px-4 py-2 border border-rose-300 bg-white hover:bg-rose-50 text-rose-600 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* MODAL 1: Team Members Management */}
      {teamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#1976D2] flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Recruitment Team Members</h3>
                  <p className="text-xs text-slate-500">ABC Industrial Services • 3 Members</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTeamModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-3.5 text-xs">
              <div className="divide-y divide-slate-100">
                <div className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0A192F] text-white font-bold flex items-center justify-center">
                      HR
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Ramesh Kumar (You)</h4>
                      <p className="text-[11px] text-slate-500">hr@abcindustrial.in • Admin</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px]">
                    Owner
                  </span>
                </div>

                <div className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center">
                      SK
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Siva Kumar</h4>
                      <p className="text-[11px] text-slate-500">plant.manager@abcindustrial.in • Interviewer</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                    Manager
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => alert('Invite link copied!')}
                  className="px-3.5 py-1.5 bg-[#1976D2] hover:bg-blue-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
                >
                  + Invite Member
                </button>
                <button
                  type="button"
                  onClick={() => setTeamModalOpen(false)}
                  className="px-4 py-1.5 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Billing & Plans */}
      {billingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Employer Plan & Billing</h3>
                  <p className="text-xs text-slate-500">Corporate Enterprise Subscription</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBillingModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 space-y-1">
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Current Active Plan</span>
                <h4 className="text-base font-black text-slate-900">Tamil Nadu Enterprise Recruitment Tier</h4>
                <p className="text-slate-600">Unlimited job postings across 38 districts with verified ITI technician pool.</p>
                <span className="text-xs font-bold text-emerald-600 block pt-1">Renews: October 31, 2027</span>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setBillingModalOpen(false)}
                  className="px-4 py-2 bg-[#1976D2] text-white font-bold rounded-xl cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Delete Account Confirmation */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-rose-200 overflow-hidden">
            <div className="p-5 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Confirm Account Deletion?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to delete <span className="font-bold text-slate-800">ABC Industrial Services</span>? This will permanently erase all posted jobs, applicant histories, and corporate certificates.
              </p>
              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(false)}
                  className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert('Company account deletion request submitted to Stark Jobs Administrator.');
                    setDeleteModalOpen(false);
                    if (onLogout) onLogout();
                  }}
                  className="flex-1 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
