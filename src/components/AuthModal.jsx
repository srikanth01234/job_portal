import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Briefcase, GraduationCap } from 'lucide-react';
import Logo from './Logo';
import { colors } from '../theme/colors';

/**
 * Reusable AuthModal Component
 * Supports seamless switching between Sign In and Sign Up, role selection, social login, and validation
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
  const [userRole, setUserRole] = useState('candidate'); // 'candidate' or 'employer'
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rememberMe: false,
    agreeTerms: false,
  });

  useEffect(() => {
    setMode(initialMode);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailLower = (formData.email || '').toLowerCase();

    // Check for Super Admin
    if (emailLower.includes('superadmin') || emailLower.includes('admin@starkjobs')) {
      alert('Authenticated as Super Admin! Redirecting to Master Control Environment...');
      onClose();
      if (onNavigateAdmin) onNavigateAdmin();
      return;
    }

    // Check for Employer / Company Admin
    if (
      userRole === 'employer' ||
      emailLower.includes('company') ||
      emailLower.includes('employer') ||
      emailLower.includes('abc')
    ) {
      alert('Authenticated as Employer (ABC Industrial Services)! Redirecting to Employer Dashboard...');
      onClose();
      if (onNavigateCompany) onNavigateCompany();
      return;
    }

    // Standard Candidate / Job Seeker
    onClose();
    if (onNavigateSeeker) {
      onNavigateSeeker();
    } else {
      alert(`${mode === 'signin' ? 'Signed in' : 'Account created'} successfully as Candidate! (Demo)`);
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
      <div className="relative w-full max-w-[480px] bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-card-border p-5 sm:p-9 z-10 transition-all animate-in zoom-in-95 duration-200 my-4 sm:my-8">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-secondary-bg hover:bg-slate-200 text-main-text/70 hover:text-main-text flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
        </button>

        {/* Modal Header: Logo + Switcher */}
        <div className="flex flex-col items-center text-center mb-6">
          <Logo className="scale-110 mb-3" />
          <h3 className="text-2xl sm:text-[26px] font-black text-primary tracking-tight">
            {mode === 'signin' ? 'Welcome Back!' : 'Create your Account'}
          </h3>
          <p className="text-xs sm:text-sm text-main-text/75 mt-1 font-medium">
            {mode === 'signin'
              ? 'Enter your credentials to access your Stark Jobs portal'
              : 'Join over 500,000 skilled technicians & employers across India'}
          </p>
        </div>

        {/* Mode Toggle Tabs (Sign In / Sign Up) */}
        <div className="flex items-center p-1 bg-secondary-bg rounded-xl mb-6 border border-card-border">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all cursor-pointer ${
              mode === 'signin'
                ? 'bg-white text-primary shadow-xs'
                : 'text-main-text/70 hover:text-main-text'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-white text-primary shadow-xs'
                : 'text-main-text/70 hover:text-main-text'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Role Selector (Available for both Sign In and Sign Up) */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            type="button"
            onClick={() => {
              setUserRole('candidate');
              if (mode === 'signin') {
                setFormData(prev => ({ ...prev, email: 'candidate@starkjobs.com' }));
              }
            }}
            className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
              userRole === 'candidate'
                ? 'border-accent bg-accent-light text-accent ring-2 ring-accent'
                : 'border-card-border hover:border-slate-300 text-main-text'
            }`}
          >
            <GraduationCap className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold leading-tight">Job Seeker</p>
              <p className="text-[11px] text-main-text/70 mt-0.5 font-medium">Find work</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setUserRole('employer');
              if (mode === 'signin') {
                setFormData(prev => ({ ...prev, email: 'hr@abcindustrial.in' }));
              }
            }}
            className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
              userRole === 'employer'
                ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-600'
                : 'border-card-border hover:border-slate-300 text-main-text'
            }`}
          >
            <Briefcase className="w-5 h-5 flex-shrink-0 text-blue-600" />
            <div>
              <p className="text-xs font-bold leading-tight">Employer</p>
              <p className="text-[11px] text-main-text/70 mt-0.5 font-medium">Post jobs</p>
            </div>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name Field (Sign Up Only) */}
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-main-text uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-main-text/50 absolute left-3.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-secondary-bg border border-card-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-main-text font-medium placeholder-slate-400 focus:outline-none focus:border-accent focus:bg-white transition-colors"
                />
              </div>
            </div>
          )}

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-main-text uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-main-text/50 absolute left-3.5" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-secondary-bg border border-card-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-main-text font-medium placeholder-slate-400 focus:outline-none focus:border-accent focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-bold text-main-text uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-main-text/50 absolute left-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-secondary-bg border border-card-border rounded-xl pl-10 pr-10 py-2.5 text-sm text-main-text font-medium placeholder-slate-400 focus:outline-none focus:border-accent focus:bg-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-main-text/50 hover:text-main-text focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Options Row (Remember me / Forgot password) */}
          {mode === 'signin' ? (
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-main-text font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  className="w-4 h-4 text-accent rounded border-card-border focus:ring-accent"
                />
                <span>Remember me</span>
              </label>
              <a href="#" className="font-bold text-accent hover:underline">
                Forgot password?
              </a>
            </div>
          ) : (
            <div className="flex items-start gap-2 text-xs text-main-text font-medium pt-1">
              <input
                type="checkbox"
                required
                checked={formData.agreeTerms}
                onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                className="w-4 h-4 text-accent rounded border-card-border focus:ring-accent mt-0.5"
              />
              <span>
                I agree to the{' '}
                <a href="#" className="text-accent font-bold underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-accent font-bold underline">
                  Privacy Policy
                </a>
              </span>
            </div>
          )}

          {/* Primary Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 text-sm font-bold text-white rounded-xl transition-all duration-200 bg-primary hover:bg-primary-hover active:scale-95 shadow-xs cursor-pointer mt-2"
          >
            {mode === 'signin' ? 'Sign In to Stark Jobs' : 'Create Account'}
          </button>
        </form>

        {/* Or Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-card-border" />
          </div>
          <span className="relative bg-white px-3 text-xs text-main-text/60 font-medium">
            or continue with
          </span>
        </div>

        {/* Social Login Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {/* Google */}
          <button
            type="button"
            onClick={() => alert('Google login integration (Demo)')}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-card-border hover:bg-secondary-bg text-xs font-semibold text-main-text transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google</span>
          </button>

          {/* LinkedIn */}
          <button
            type="button"
            onClick={() => alert('LinkedIn login integration (Demo)')}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-card-border hover:bg-secondary-bg text-xs font-semibold text-main-text transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 text-[#0077B5]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
            <span>LinkedIn</span>
          </button>
        </div>

        {/* Bottom Switcher */}
        <div className="mt-6 text-center text-xs text-main-text/75 font-medium">
          {mode === 'signin' ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="font-bold text-accent hover:underline cursor-pointer"
              >
                Sign up for free
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="font-bold text-accent hover:underline cursor-pointer"
              >
                Sign in
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
