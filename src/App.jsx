import React, { useState } from 'react';
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

function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'

  const handleOpenAuth = (mode = 'signin') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleCloseAuth = () => {
    setAuthModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-purple-100 selection:text-purple-700">
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
        <Footer />
      </RevealOnScroll>

      {/* Reusable Sign In / Sign Up Modal Popup */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={handleCloseAuth}
        initialMode={authMode}
      />
    </div>
  );
}

export default App;
