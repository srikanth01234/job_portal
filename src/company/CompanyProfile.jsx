import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Calendar,
  Users,
  CheckCircle2,
  Edit3,
  FileText,
  Phone,
  Briefcase,
  Upload,
  Trash2,
  MoreVertical,
  Search,
  Bell,
  ChevronDown,
  Menu,
  Check,
  X,
  ExternalLink,
  ShieldCheck,
  Mail,
  Globe,
  FileCheck,
  Download,
  Eye,
  AlertCircle
} from 'lucide-react';
import CompanySidebar from './CompanySidebar';

// Initial verification documents list matching reference screenshot
const INITIAL_DOCUMENTS = [
  {
    id: 'doc-1',
    title: 'Business Registration Certificate',
    fileName: 'registration_certificate.pdf',
    uploadedOn: 'Oct 10, 2026',
    status: 'Verified',
    fileSize: '1.8 MB'
  },
  {
    id: 'doc-2',
    title: 'GST Certificate',
    fileName: 'gst_certificate.pdf',
    uploadedOn: 'Oct 10, 2026',
    status: 'Verified',
    fileSize: '950 KB'
  },
  {
    id: 'doc-3',
    title: 'Company PAN Card',
    fileName: 'pan_card.pdf',
    uploadedOn: 'Oct 10, 2026',
    status: 'Verified',
    fileSize: '420 KB'
  }
];

/**
 * Company Profile Page Component (Single File Implementation)
 * Faithfully reproduces the reference screenshot:
 * - Stark Jobs Employer Portal with reusable sidebar (Company Profile active)
 * - Top search, notifications, profile dropdown
 * - Breadcrumbs: Home > Company Profile
 * - Verified Company header badge with "View Documents"
 * - Company summary card with ABC logo, verified pill, tags
 * - Vertical sub-tab navigation (Basic Information, Contact Details, Address, Business Details, Company Documents)
 * - Basic Information form with live state, character counter, save button
 * - Company Logo widget with preview & change/remove buttons
 * - Verification Documents widget with verified status banner & document list
 */
export default function CompanyProfile({
  onLogout,
  onNavigateHome,
  onNavigateTab
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('basic'); // 'basic', 'contact', 'address', 'business', 'documents'
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [viewDocsModalOpen, setViewDocsModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Form states initialized with screenshot values
  const [formData, setFormData] = useState({
    companyName: 'ABC Industrial Services',
    industry: 'Industrial Services & Maintenance',
    companyType: 'Private Limited',
    yearOfEstablishment: '2018',
    companySize: '50 - 100 employees',
    website: 'https://www.abcindustrial.in',
    aboutCompany:
      'ABC Industrial Services provides industrial maintenance, equipment installation and technical support services across Tamil Nadu. We are committed to quality, safety and long-term client partnerships.',
    // Contact Details
    officialEmail: 'hr@abcindustrial.in',
    primaryPhone: '+91 98765 43210',
    secondaryPhone: '+91 461 2345678',
    contactPerson: 'S. Ramesh Kumar',
    designation: 'Head of Human Resources',
    // Address
    addressLine1: 'Plot No. 42, SIPCOT Industrial Complex',
    addressLine2: 'Madurai Bye-pass Road',
    district: 'Thoothukudi',
    state: 'Tamil Nadu',
    pincode: '628008',
    landmark: 'Near Power Grid Substation',
    // Business Details
    gstin: '33AABCA1234F1Z8',
    panNumber: 'AABCA1234F',
    msmeReg: 'UDYAM-TN-28-0012345',
    tradeLicense: 'TL-TH-2024-8971'
  });

  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  const [companyLogoUrl, setCompanyLogoUrl] = useState(null); // null uses default SVG branding

  const handleSidebarTabSelect = (tabId) => {
    if (tabId === 'profile') return;
    if (onNavigateTab) {
      onNavigateTab(tabId);
    }
  };

  const handleSaveBasic = (e) => {
    e.preventDefault();
    setSaveSuccessMsg('Company profile details updated successfully!');
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  const handleChangeLogo = () => {
    const newLogo = prompt('Enter image URL or press OK to use sample corporate logo:', 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&h=300&fit=crop');
    if (newLogo) {
      setCompanyLogoUrl(newLogo);
      alert('Logo updated successfully!');
    }
  };

  const handleRemoveLogo = () => {
    if (confirm('Are you sure you want to remove the custom company logo?')) {
      setCompanyLogoUrl(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex font-sans">
      {/* Reusable Sidebar with active tab: profile */}
      <CompanySidebar
        activeTab="profile"
        onSelectTab={handleSidebarTabSelect}
        onLogout={onLogout}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Navbar Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            {/* Mobile Hamburger Toggle */}
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidates, jobs, or anything..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Right Notification Bell & User Avatar */}
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

              {/* Notification Dropdown */}
              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h4 className="text-sm font-bold text-slate-900">Notifications</h4>
                    <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
                      2 Unread
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto mt-2 text-xs">
                    <div className="py-2.5">
                      <p className="font-semibold text-emerald-600">Company Profile Verified</p>
                      <p className="text-slate-500 mt-0.5">Your official documents are verified by Stark Sentinel.</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">Yesterday</span>
                    </div>
                    <div className="py-2.5">
                      <p className="font-semibold text-slate-800">Job Posting Approved</p>
                      <p className="text-slate-500 mt-0.5">Electrician role is now live in Thoothukudi.</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">2 days ago</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar & Chevron */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-[#0A192F] text-white font-bold text-xs flex items-center justify-center shadow-xs tracking-wider cursor-pointer">
                ABC
              </div>
              <ChevronDown className="w-4 h-4 text-slate-500 cursor-pointer hover:text-slate-800" />
            </div>
          </div>
        </header>

        {/* Profile Page Body */}
        <main className="p-4 sm:p-8 space-y-6 flex-1">
          {/* Top Breadcrumb & Page Title Strip */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              {/* Breadcrumb matching screenshot */}
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1.5">
                <button
                  type="button"
                  onClick={() => handleSidebarTabSelect('dashboard')}
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Home
                </button>
                <span>›</span>
                <span className="text-slate-700 font-semibold">Company Profile</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Company Profile
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Manage your company information and keep your profile up to date.
              </p>
            </div>

            {/* Verified Company Banner Card with "View Documents" button */}
            <div className="flex items-center gap-4 bg-white border border-emerald-200/90 px-4 py-3 rounded-2xl shadow-xs">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <div className="min-w-0 pr-2">
                <h4 className="text-sm font-bold text-slate-900 leading-tight">
                  Verified Company
                </h4>
                <p className="text-xs text-slate-500 leading-tight mt-0.5">
                  Your company profile has been verified.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewDocsModalOpen(true)}
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer whitespace-nowrap"
              >
                View Documents
              </button>
            </div>
          </div>

          {/* Company Summary Banner Card */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-center gap-4 sm:gap-5">
              {/* Big Logo Avatar */}
              <div className="w-20 h-20 rounded-2xl bg-blue-50/90 text-[#1976D2] font-black text-xl flex items-center justify-center flex-shrink-0 shadow-xs tracking-wider border border-blue-100">
                {companyLogoUrl ? (
                  <img
                    src={companyLogoUrl}
                    alt="Company Logo"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <span>ABC</span>
                )}
              </div>

              {/* Company Info */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {formData.companyName}
                  </h2>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                    Verified
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{formData.industry}</span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap pt-0.5">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    Thoothukudi, Tamil Nadu
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {formData.yearOfEstablishment}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    {formData.companySize}
                  </span>
                </div>
              </div>
            </div>

            {/* Edit Profile Action Button */}
            <button
              type="button"
              onClick={() => setActiveTab('basic')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200/80 rounded-xl text-xs sm:text-sm font-bold text-[#1976D2] transition-colors cursor-pointer self-start md:self-center"
            >
              <Edit3 className="w-4 h-4 stroke-[2.2]" />
              <span>Edit Profile</span>
            </button>
          </div>

          {/* Save Success Alert Feedback */}
          {saveSuccessMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs sm:text-sm font-bold text-emerald-800 animate-in fade-in duration-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {/* Main 3-Column Profile Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Sub-navigation Tabs (3 cols) */}
            <div className="lg:col-span-3 bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs space-y-1">
              {[
                { id: 'basic', label: 'Basic Information', icon: FileText },
                { id: 'contact', label: 'Contact Details', icon: Phone },
                { id: 'address', label: 'Address', icon: MapPin },
                { id: 'business', label: 'Business Details', icon: Briefcase },
                { id: 'documents', label: 'Company Documents', icon: FileCheck },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
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

            {/* Center Column: Active Tab Form (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
              {/* TAB 1: Basic Information (Matching Reference Screenshot) */}
              {activeTab === 'basic' && (
                <div>
                  <div className="mb-5 pb-3 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-900">Basic Information</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Update your company's basic details.
                    </p>
                  </div>

                  <form onSubmit={handleSaveBasic} className="space-y-4">
                    {/* Field 1: Company Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Company Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                      />
                    </div>

                    {/* Field 2: Industry */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Industry <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={formData.industry}
                          onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                          className="w-full appearance-none px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800 pr-9 cursor-pointer"
                        >
                          <option>Industrial Services & Maintenance</option>
                          <option>Manufacturing & Fabrication</option>
                          <option>Electrical & Power Engineering</option>
                          <option>Automotive & Heavy Equipment</option>
                          <option>Civil & Construction</option>
                          <option>Renewable Energy & Solar</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Field 3 & 4: Company Type & Year of Establishment */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Company Type <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            value={formData.companyType}
                            onChange={(e) => setFormData({ ...formData, companyType: e.target.value })}
                            className="w-full appearance-none px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800 pr-9 cursor-pointer"
                          >
                            <option>Private Limited</option>
                            <option>Public Limited</option>
                            <option>Partnership Firm</option>
                            <option>Proprietorship</option>
                            <option>Limited Liability Partnership (LLP)</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Year of Establishment <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.yearOfEstablishment}
                            onChange={(e) => setFormData({ ...formData, yearOfEstablishment: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800 pr-9"
                          />
                          <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Field 5: Company Size */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Company Size <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={formData.companySize}
                          onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                          className="w-full appearance-none px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800 pr-9 cursor-pointer"
                        >
                          <option>1 - 10 employees</option>
                          <option>11 - 50 employees</option>
                          <option>50 - 100 employees</option>
                          <option>100 - 250 employees</option>
                          <option>250 - 500 employees</option>
                          <option>500+ employees</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Field 6: Website */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Website
                      </label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                        placeholder="https://www.example.com"
                      />
                    </div>

                    {/* Field 7: About Company with Character counter */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        About Company <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        rows={4}
                        maxLength={500}
                        value={formData.aboutCompany}
                        onChange={(e) => setFormData({ ...formData, aboutCompany: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800 resize-none leading-relaxed"
                      />
                      <div className="text-right text-[11px] text-slate-400 mt-1">
                        {formData.aboutCompany.length}/500 characters
                      </div>
                    </div>

                    {/* Bottom Save Changes Button */}
                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-[#1976D2] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 2: Contact Details */}
              {activeTab === 'contact' && (
                <div>
                  <div className="mb-5 pb-3 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-900">Contact Details</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Recruitment and official company contact channels.
                    </p>
                  </div>

                  <form onSubmit={handleSaveBasic} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Official HR Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.officialEmail}
                        onChange={(e) => setFormData({ ...formData, officialEmail: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Primary Mobile Number *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.primaryPhone}
                          onChange={(e) => setFormData({ ...formData, primaryPhone: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Landline / Secondary
                        </label>
                        <input
                          type="text"
                          value={formData.secondaryPhone}
                          onChange={(e) => setFormData({ ...formData, secondaryPhone: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          HR Contact Person Name
                        </label>
                        <input
                          type="text"
                          value={formData.contactPerson}
                          onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Designation
                        </label>
                        <input
                          type="text"
                          value={formData.designation}
                          onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-[#1976D2] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        Save Contact Details
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 3: Address */}
              {activeTab === 'address' && (
                <div>
                  <div className="mb-5 pb-3 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-900">Office & Factory Address</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Your registered operating location in Tamil Nadu.
                    </p>
                  </div>

                  <form onSubmit={handleSaveBasic} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Address Line 1 (Street/Plot) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.addressLine1}
                        onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Address Line 2 (Area/Road)
                      </label>
                      <input
                        type="text"
                        value={formData.addressLine2}
                        onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          District *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.district}
                          onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          State *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          PIN Code *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.pincode}
                          onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Landmark
                      </label>
                      <input
                        type="text"
                        value={formData.landmark}
                        onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                      />
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-[#1976D2] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 4: Business Details */}
              {activeTab === 'business' && (
                <div>
                  <div className="mb-5 pb-3 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-900">Business & Statutory Details</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Statutory tax registrations and verified legal credentials.
                    </p>
                  </div>

                  <form onSubmit={handleSaveBasic} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        GST Identification Number (GSTIN) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.gstin}
                        onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800 uppercase tracking-wider"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Company PAN Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.panNumber}
                        onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800 uppercase tracking-wider"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          MSME Udyam Registration
                        </label>
                        <input
                          type="text"
                          value={formData.msmeReg}
                          onChange={(e) => setFormData({ ...formData, msmeReg: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800 uppercase"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Trade License Number
                        </label>
                        <input
                          type="text"
                          value={formData.tradeLicense}
                          onChange={(e) => setFormData({ ...formData, tradeLicense: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800 uppercase"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-[#1976D2] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        Save Business Details
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 5: Company Documents */}
              {activeTab === 'documents' && (
                <div>
                  <div className="mb-5 pb-3 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Company Documents</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Manage and review verified certificates.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => alert('Select a PDF certificate to upload')}
                      className="px-3 py-1.5 bg-[#1976D2] hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Upload New
                    </button>
                  </div>

                  <div className="space-y-3">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-3.5 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-all flex items-center justify-between gap-3 bg-slate-50/40"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#1976D2] flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-800 truncate">
                              {doc.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              {doc.fileName} • {doc.fileSize}
                            </p>
                            <span className="text-[10px] text-slate-400">
                              Uploaded on {doc.uploadedOn}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                            {doc.status}
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedDoc(doc)}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/70 transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Company Logo & Verification Documents Widgets (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Widget 1: Company Logo (Matching Screenshot) */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Company Logo</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Upload your company logo. Recommended size 400 × 400 px.
                  </p>
                </div>

                {/* Logo Preview Container */}
                <div className="w-full h-36 bg-slate-50 border border-slate-200/90 rounded-2xl flex items-center justify-center p-4">
                  {companyLogoUrl ? (
                    <img
                      src={companyLogoUrl}
                      alt="Company Logo Preview"
                      className="max-h-24 max-w-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="text-3xl font-black text-[#0A192F] tracking-tight leading-none">
                        ABC
                      </div>
                      <div className="text-[10px] font-black tracking-widest text-[#1976D2] mt-1 uppercase">
                        INDUSTRIAL SERVICES
                      </div>
                    </div>
                  )}
                </div>

                {/* Change Logo & Remove Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleChangeLogo}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 border border-blue-600 bg-white hover:bg-blue-50 text-[#1976D2] rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Change Logo</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 border border-rose-300 bg-white hover:bg-rose-50 text-rose-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>

              {/* Widget 2: Verification Documents (Matching Screenshot) */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Verification Documents</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Manage your verification documents.
                  </p>
                </div>

                {/* Top Status Banner: All documents verified */}
                <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/90 rounded-xl flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">
                      All documents verified
                    </h4>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                      Your company documents have been reviewed and approved.
                    </p>
                  </div>
                </div>

                {/* Document Items List matching screenshot */}
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors flex items-center justify-between gap-2.5 bg-slate-50/30 group"
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1976D2] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h5 className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                            {doc.title}
                          </h5>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5 font-mono">
                            {doc.fileName}
                          </p>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            Uploaded on {doc.uploadedOn}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                          {doc.status}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedDoc(doc)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* MODAL: View All Documents Preview */}
      {(viewDocsModalOpen || selectedDoc) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedDoc ? selectedDoc.title : 'Verified Corporate Documents'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    ABC Industrial Services • Thoothukudi, TN
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setViewDocsModalOpen(false);
                  setSelectedDoc(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {selectedDoc ? (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Document Name:</span>
                      <span className="font-bold text-slate-800">{selectedDoc.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">File Attachment:</span>
                      <span className="font-mono text-slate-800 font-semibold">{selectedDoc.fileName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Verification Status:</span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 font-bold rounded-full">
                        {selectedDoc.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Approved Date:</span>
                      <span className="text-slate-700 font-medium">{selectedDoc.uploadedOn}</span>
                    </div>
                  </div>

                  <div className="h-44 bg-slate-100 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                    <FileCheck className="w-10 h-10 text-emerald-500 mb-2" />
                    <p className="font-bold text-slate-700">Digital Certificate Cryptographically Signed</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Tamil Nadu Labour & Employment Regulatory Authority</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div key={doc.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900">{doc.title}</h4>
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5">{doc.fileName}</p>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 font-bold rounded-full text-[10px]">
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setViewDocsModalOpen(false);
                    setSelectedDoc(null);
                  }}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert('Downloading verification certificate package...');
                  }}
                  className="px-4 py-2 bg-[#1976D2] hover:bg-blue-700 text-white font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
