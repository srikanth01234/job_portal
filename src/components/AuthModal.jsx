import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Briefcase, 
  GraduationCap, 
  ShieldCheck, 
  AlertCircle,
  Phone,
  Building2,
  KeyRound
} from 'lucide-react';
import Logo from './Logo';
import api from '../services/api';

/**
 * Clean & Flexible AuthModal Component
 * - Sign In: strictly 2 fields (Username/Email + Password)
 * - Sign Up: extra details tailored to Job Seeker, Company, or Super Admin
 * - Direct authentication with MySQL database via Laravel API
 */
export default function AuthModal({
  isOpen,
  onClose,
  initialMode = 'signin',
  onNavigateCompany,
  onNavigateAdmin,
  onNavigateSeeker
}) {
  const [mode, setMode] = useState(initialMode); // 'signin' or 'signup'
  const [userRole, setUserRole] = useState('seeker'); // 'seeker', 'company', or 'admin'
  const [showPassword, setShowPassword] = useState(false);
  
  // Sign In state (2 fields only)
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // Extra Sign Up state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [adminSecret, setAdminSecret] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setMode(initialMode);
    setErrorMessage('');
  }, [initialMode, isOpen]);

  // Handle ESC key press and body scroll locking
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (mode === 'signin') {
      if (!identifier.trim() || !password) {
        setErrorMessage('Please provide both username/email and password.');
        return;
      }
    } else {
      // Sign Up validation
      if (!email.trim() || !password) {
        setErrorMessage('Email and password are required.');
        return;
      }
      if (userRole === 'company' && !companyName.trim()) {
        setErrorMessage('Company Name is required.');
        return;
      }
      if (userRole === 'admin' && !adminSecret.trim()) {
        setErrorMessage('Super Admin security passcode is required (use "starkadmin2026").');
        return;
      }
    }

    setIsLoading(true);

    try {
      let res;
      if (mode === 'signup') {
        res = await api.register({
          role: userRole,
          name: fullName.trim() || undefined,
          email: email.trim(),
          phone: phone.trim() || undefined,
          company_name: companyName.trim() || undefined,
          admin_secret: adminSecret.trim() || undefined,
          password: password,
        });
      } else {
        // Sign In via MySQL database (2 fields)
        res = await api.login(identifier.trim(), password);
      }

      if (res && res.user) {
        setIsLoading(false);
        onClose();

        // Direct based on actual authenticated user role from MySQL
        const role = res.user.role;
        if (role === 'admin') {
          if (onNavigateAdmin) onNavigateAdmin();
        } else if (role === 'company') {
          if (onNavigateCompany) onNavigateCompany();
        } else {
          if (onNavigateSeeker) onNavigateSeeker();
        }
      } else {
        throw new Error('Unexpected response from authentication server.');
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Authentication failed. Please verify your credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Dimmed Glassmorphism Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-[460px] bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200/80 p-5 sm:p-7 z-10 transition-all animate-in zoom-in-95 duration-200 my-4 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4 stroke-[2.2]" />
        </button>

        {/* Modal Header: Logo + Switcher */}
        <div className="flex flex-col items-center text-center mb-4">
          <Logo className="scale-105 mb-2" />
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {mode === 'signin' ? 'Welcome Back' : 'Create an Account'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            {mode === 'signin'
              ? 'Sign in to access your Stark Jobs portal'
              : 'Join Stark Jobs with your role details'}
          </p>
        </div>

        {/* Mode Toggle Tabs (Sign In / Sign Up) */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl mb-4 border border-slate-200/80">
          <button
            type="button"
            onClick={() => { setMode('signin'); setErrorMessage(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === 'signin'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMessage(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Role Selector (Job Seeker / Company / Super Admin) */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <button
            type="button"
            onClick={() => setUserRole('seeker')}
            className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all cursor-pointer ${
              userRole === 'seeker'
                ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-600'
                : 'border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span className="text-[11px] font-bold">Job Seeker</span>
          </button>

          <button
            type="button"
            onClick={() => setUserRole('company')}
            className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all cursor-pointer ${
              userRole === 'company'
                ? 'border-emerald-600 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-600'
                : 'border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <Briefcase className="w-4 h-4 text-emerald-600" />
            <span className="text-[11px] font-bold">Company</span>
          </button>

          <button
            type="button"
            onClick={() => setUserRole('admin')}
            className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all cursor-pointer ${
              userRole === 'admin'
                ? 'border-purple-600 bg-purple-50 text-purple-700 ring-2 ring-purple-600'
                : 'border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span className="text-[11px] font-bold">Super Admin</span>
          </button>
        </div>

        {/* Error Alert Message */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-rose-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* FORM SECTION */}
        <form onSubmit={handleSubmit} className="space-y-3">
          
          {/* ========================================= */}
          {/* 1. SIGN IN: STRICTLY 2 FIELDS             */}
          {/* ========================================= */}
          {mode === 'signin' ? (
            <>
              {/* Field 1: Username or Email */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Username or Email
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder={
                      userRole === 'admin'
                        ? 'superadmin or superadmin@starkjobs.com'
                        : userRole === 'company'
                        ? 'e.g. stark or info@starksoftech.com'
                        : 'e.g. kavin or srikanthm1523@gmail.com'
                    }
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Field 2: Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                </div>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                    aria-label="Toggle password"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* ========================================= */
            /* 2. SIGN UP: ROLE-SPECIFIC EXTRA DETAILS   */
            /* ========================================= */
            <>
              {/* Extra: Company Name (If Company) */}
              {userRole === 'company' && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Company / Organization Name *
                  </label>
                  <div className="relative flex items-center">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Stark Industries, Titan Forge Ltd"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {userRole === 'company' ? 'HR / Contact Person Name *' : 'Full Name *'}
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <input
                    type="text"
                    required
                    placeholder={userRole === 'company' ? 'e.g. Tony Stark' : userRole === 'admin' ? 'e.g. System Admin' : 'e.g. Kavin Kumar'}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {userRole === 'company' ? 'Official Work Email *' : 'Email Address *'}
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <input
                    type="email"
                    required
                    placeholder={userRole === 'company' ? 'hr@company.com' : userRole === 'admin' ? 'admin@starkjobs.com' : 'candidate@gmail.com'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Phone Number (Seeker & Company) */}
              {userRole !== 'admin' && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone / Mobile Number
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5" />
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Super Admin Passcode (If Admin Role) */}
              {userRole === 'admin' && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Security Passcode *
                  </label>
                  <div className="relative flex items-center">
                    <KeyRound className="w-4 h-4 text-purple-500 absolute left-3.5" />
                    <input
                      type="password"
                      required
                      placeholder="Enter 'starkadmin2026'"
                      value={adminSecret}
                      onChange={(e) => setAdminSecret(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white transition-colors"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Master key required to provision administrative rights.</p>
                </div>
              )}

              {/* Password */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Create Password *
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                    aria-label="Toggle password"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Primary Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 text-xs sm:text-sm font-bold text-white rounded-xl transition-all duration-200 bg-[#1976D2] hover:bg-[#1565C0] active:scale-98 shadow-xs cursor-pointer flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>
                {mode === 'signin'
                  ? `Sign In as ${userRole === 'admin' ? 'Super Admin' : userRole === 'company' ? 'Company' : 'Job Seeker'}`
                  : `Create ${userRole === 'admin' ? 'Super Admin' : userRole === 'company' ? 'Company' : 'Job Seeker'} Account`}
              </span>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
