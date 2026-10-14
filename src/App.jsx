import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CompanyLogos from './components/CompanyLogos';
import BrowseCategory from './components/BrowseCategory';
import RecentJobs from './components/RecentJobs';
import JobBoardFeature from './components/JobBoardFeature';
import HappyCustomers from './components/HappyCustomers';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import RevealOnScroll from './components/RevealOnScroll';
import SuperAdminLogin from './components/SuperAdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import AdminJobSeekers from './admin/AdminJobSeekers';
import AdminCompanies from './admin/AdminCompanies';
import AdminJobListings from './admin/AdminJobListings';
import AdminDistrictsCategories from './admin/AdminDistrictsCategories';
import CompanyDashboard from './company/CompanyDashboard';
import CompanyProfile from './company/CompanyProfile';
import CompanyMyJobs from './company/CompanyMyJobs';
import CompanyApplicants from './company/CompanyApplicants';
import CompanyInterviews from './company/CompanyInterviews';
import CompanyAccountSettings from './company/CompanyAccountSettings';

// Helper to determine the current page from URL path or hash
const getPageFromUrl = () => {
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();

  // Employer / Company Account Settings route
  if (
    path.includes('company/settings') ||
    path.includes('company-settings') ||
    path.includes('company/account-settings') ||
    path.includes('company-account-settings') ||
    path.includes('employer/settings') ||
    path.includes('employer-settings') ||
    hash === '#company-settings' ||
    hash === '#settings' ||
    hash === '#account-settings' ||
    hash === '#company/settings'
  ) {
    return 'company-settings';
  }

  // Employer / Company Interviews route
  if (
    path.includes('company/interviews') ||
    path.includes('company-interviews') ||
    path.includes('employer/interviews') ||
    path.includes('employer-interviews') ||
    hash === '#company-interviews' ||
    hash === '#interviews' ||
    hash === '#company/interviews'
  ) {
    return 'company-interviews';
  }

  // Employer / Company Applicants route
  if (
    path.includes('company/applicants') ||
    path.includes('company-applicants') ||
    path.includes('employer/applicants') ||
    path.includes('employer-applicants') ||
    hash === '#company-applicants' ||
    hash === '#applicants' ||
    hash === '#company/applicants'
  ) {
    return 'company-applicants';
  }

  // Employer / Company My Jobs route
  if (
    path.includes('company/jobs') ||
    path.includes('company/my-jobs') ||
    path.includes('company-jobs') ||
    path.includes('employer/jobs') ||
    path.includes('employer/my-jobs') ||
    path.includes('employer-jobs') ||
    hash === '#company-jobs' ||
    hash === '#my-jobs' ||
    hash === '#company/jobs'
  ) {
    return 'company-jobs';
  }

  // Company Profile route
  if (
    path.includes('company/profile') ||
    path.includes('company-profile') ||
    path.includes('employer/profile') ||
    path.includes('employer-profile') ||
    hash === '#company-profile' ||
    hash === '#profile' ||
    hash === '#company/profile'
  ) {
    return 'company-profile';
  }

  // Employer / Company Dashboard routes
  if (
    path.includes('company-dashboard') ||
    path.includes('company/dashboard') ||
    path.includes('employer-dashboard') ||
    path.includes('employer/dashboard') ||
    path === '/company' ||
    path.startsWith('/company/') ||
    path === '/employer' ||
    path.startsWith('/employer/') ||
    hash === '#company' ||
    hash === '#company-dashboard' ||
    hash === '#employer' ||
    hash === '#employer-dashboard'
  ) {
    return 'company-dashboard';
  }

  if (
    path.includes('districts') ||
    path.includes('districts-categories') ||
    hash === '#districts' ||
    hash === '#districts-categories'
  ) {
    return 'admin-districts';
  }

  if (
    path.includes('job-listings') ||
    path.includes('/jobs') ||
    hash === '#jobs' ||
    hash === '#job-listings'
  ) {
    return 'admin-jobs';
  }

  if (
    path.includes('companies') ||
    hash === '#companies'
  ) {
    return 'admin-companies';
  }

  if (
    path.includes('job-seekers') ||
    hash === '#job-seekers' ||
    hash === '#seekers'
  ) {
    return 'admin-job-seekers';
  }

  if (
    path.includes('admin-dashboard') ||
    path.includes('dashboard') ||
    hash === '#admin-dashboard' ||
    hash === '#dashboard'
  ) {
    return 'admin-dashboard';
  }

  if (
    path.includes('super-admin') ||
    path === '/admin' ||
    path.startsWith('/admin/') ||
    hash === '#admin' ||
    hash === '#super-admin'
  ) {
    return 'admin';
  }

  return 'home';
};

function App() {
  const [currentPage, setCurrentPage] = useState(getPageFromUrl); // 'home', 'admin', 'admin-dashboard', 'admin-job-seekers', 'admin-companies', 'admin-jobs', 'admin-districts', 'company-dashboard'
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'

  // Listen to both browser path navigation (popstate) and hash changes
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPage(getPageFromUrl());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const handleOpenAuth = (mode = 'signin') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleCloseAuth = () => {
    setAuthModalOpen(false);
  };

  const handleNavigateAdmin = () => {
    window.history.pushState(null, '', '/admin');
    setCurrentPage('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateAdminDashboard = () => {
    window.history.pushState(null, '', '/admin-dashboard');
    setCurrentPage('admin-dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateJobSeekers = () => {
    window.history.pushState(null, '', '/admin/job-seekers');
    setCurrentPage('admin-job-seekers');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateCompanies = () => {
    window.history.pushState(null, '', '/admin/companies');
    setCurrentPage('admin-companies');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateJobs = () => {
    window.history.pushState(null, '', '/admin/job-listings');
    setCurrentPage('admin-jobs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateDistricts = () => {
    window.history.pushState(null, '', '/admin/districts-categories');
    setCurrentPage('admin-districts');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateCompanyDashboard = () => {
    window.history.pushState(null, '', '/company/dashboard');
    setCurrentPage('company-dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateCompanyProfile = () => {
    window.history.pushState(null, '', '/company/profile');
    setCurrentPage('company-profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateCompanyJobs = () => {
    window.history.pushState(null, '', '/company/jobs');
    setCurrentPage('company-jobs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateCompanyApplicants = () => {
    window.history.pushState(null, '', '/company/applicants');
    setCurrentPage('company-applicants');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateCompanyInterviews = () => {
    window.history.pushState(null, '', '/company/interviews');
    setCurrentPage('company-interviews');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateCompanySettings = () => {
    window.history.pushState(null, '', '/company/settings');
    setCurrentPage('company-settings');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateCompanyTab = (tabId) => {
    if (tabId === 'dashboard') {
      handleNavigateCompanyDashboard();
    } else if (tabId === 'profile') {
      handleNavigateCompanyProfile();
    } else if (tabId === 'jobs' || tabId === 'my-jobs') {
      handleNavigateCompanyJobs();
    } else if (tabId === 'applicants') {
      handleNavigateCompanyApplicants();
    } else if (tabId === 'interviews') {
      handleNavigateCompanyInterviews();
    } else if (tabId === 'settings' || tabId === 'account-settings') {
      handleNavigateCompanySettings();
    } else {
      alert(`Opening ${tabId} module for ABC Industrial Services...`);
    }
  };

  const handleNavigateTab = (tabId) => {
    if (tabId === 'dashboard') {
      handleNavigateAdminDashboard();
    } else if (tabId === 'job-seekers') {
      handleNavigateJobSeekers();
    } else if (tabId === 'companies') {
      handleNavigateCompanies();
    } else if (tabId === 'jobs' || tabId === 'job-listings') {
      handleNavigateJobs();
    } else if (tabId === 'districts' || tabId === 'categories') {
      handleNavigateDistricts();
    } else {
      alert(`Opening ${tabId} module...`);
    }
  };

  const handleBackToHome = () => {
    window.history.pushState(null, '', '/');
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If Company Account Settings page is active
  if (currentPage === 'company-settings') {
    return (
      <CompanyAccountSettings
        onLogout={handleNavigateAdmin}
        onNavigateHome={handleBackToHome}
        onNavigateTab={handleNavigateCompanyTab}
      />
    );
  }

  // If Company Interviews page is active
  if (currentPage === 'company-interviews') {
    return (
      <CompanyInterviews
        onLogout={handleNavigateAdmin}
        onNavigateHome={handleBackToHome}
        onNavigateTab={handleNavigateCompanyTab}
      />
    );
  }

  // If Company Applicants page is active
  if (currentPage === 'company-applicants') {
    return (
      <CompanyApplicants
        onLogout={handleNavigateAdmin}
        onNavigateHome={handleBackToHome}
        onNavigateTab={handleNavigateCompanyTab}
      />
    );
  }

  // If Company My Jobs page is active
  if (currentPage === 'company-jobs') {
    return (
      <CompanyMyJobs
        onLogout={handleNavigateAdmin}
        onNavigateHome={handleBackToHome}
        onNavigateTab={handleNavigateCompanyTab}
      />
    );
  }

  // If Company Profile page is active
  if (currentPage === 'company-profile') {
    return (
      <CompanyProfile
        onLogout={handleNavigateAdmin}
        onNavigateHome={handleBackToHome}
        onNavigateTab={handleNavigateCompanyTab}
      />
    );
  }

  // If Company / Employer Dashboard is active
  if (currentPage === 'company-dashboard') {
    return (
      <CompanyDashboard
        onLogout={handleNavigateAdmin}
        onNavigateHome={handleBackToHome}
        onNavigateTab={handleNavigateCompanyTab}
      />
    );
  }

  // If Admin Districts & Categories page is active
  if (currentPage === 'admin-districts') {
    return (
      <AdminDistrictsCategories
        onLogout={handleNavigateAdmin}
        onNavigateHome={handleBackToHome}
        onNavigateTab={handleNavigateTab}
      />
    );
  }

  // If Admin Job Listings page is active
  if (currentPage === 'admin-jobs') {
    return (
      <AdminJobListings
        onLogout={handleNavigateAdmin}
        onNavigateHome={handleBackToHome}
        onNavigateTab={handleNavigateTab}
      />
    );
  }

  // If Admin Companies page is active
  if (currentPage === 'admin-companies') {
    return (
      <AdminCompanies
        onLogout={handleNavigateAdmin}
        onNavigateHome={handleBackToHome}
        onNavigateTab={handleNavigateTab}
      />
    );
  }

  // If Admin Job Seekers page is active
  if (currentPage === 'admin-job-seekers') {
    return (
      <AdminJobSeekers
        onLogout={handleNavigateAdmin}
        onNavigateHome={handleBackToHome}
        onNavigateTab={handleNavigateTab}
      />
    );
  }

  // If Admin Dashboard is active, render full-screen Admin Dashboard
  if (currentPage === 'admin-dashboard') {
    return (
      <AdminDashboard
        onLogout={handleNavigateAdmin}
        onNavigateHome={handleBackToHome}
        onNavigateTab={handleNavigateTab}
      />
    );
  }

  // If Super Admin Login Page is active, render full-screen Super Admin portal
  if (currentPage === 'admin') {
    return (
      <SuperAdminLogin
        onBackToHome={handleBackToHome}
        onLoginSuccess={handleNavigateAdminDashboard}
        onLoginCompanySuccess={handleNavigateCompanyDashboard}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-main-text selection:bg-accent-light selection:text-accent">
      {/* Reusable Modern Navbar with Sign In & Sign Up triggers */}
      <Navbar onOpenAuth={handleOpenAuth} />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Reusable Hero Section with gentle entry reveal */}
        <RevealOnScroll duration={900} distance={24}>
          <Hero />
        </RevealOnScroll>

        {/* Reusable Company Logos Carousel Strip */}
        <RevealOnScroll duration={800} distance={28} delay={50}>
          <CompanyLogos />
        </RevealOnScroll>

        {/* Reusable Browse by Category Section */}
        <RevealOnScroll duration={850} distance={32}>
          <BrowseCategory />
        </RevealOnScroll>

        {/* Reusable Recent Jobs Section */}
        <RevealOnScroll duration={850} distance={32}>
          <RecentJobs />
        </RevealOnScroll>

        {/* Reusable Job Board Feature Section */}
        <RevealOnScroll duration={850} distance={32}>
          <JobBoardFeature />
        </RevealOnScroll>

        {/* Reusable Our Happy Customer Section */}
        <RevealOnScroll duration={850} distance={32}>
          <HappyCustomers />
        </RevealOnScroll>
      </main>

      {/* Reusable Modern Footer with scroll reveal */}
      <RevealOnScroll duration={800} distance={24}>
        <Footer onNavigateAdmin={handleNavigateAdmin} />
      </RevealOnScroll>

      {/* Reusable Sign In / Sign Up Modal Popup */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={handleCloseAuth}
        initialMode={authMode}
        onNavigateCompany={handleNavigateCompanyDashboard}
        onNavigateAdmin={handleNavigateAdminDashboard}
      />
    </div>
  );
}

export default App;
