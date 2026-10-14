import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Key, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  CheckCircle2, 
  Fingerprint, 
  AlertCircle,
  Server,
  Activity,
  ArrowRight
} from 'lucide-react';
import Logo from './Logo';

/**
 * Super Admin Login Page Component
 * Built using the brand design system:
 * - Primary: Deep Navy #173E68
 * - Background: White #FFFFFF
 * - Secondary Background: Light Gray #F5F7FA
 * - Main Text: Charcoal #1F2937
 * - Accent: Teal #0F8B8D
 * - Typography: Inter
 * - Cards: Subtle borders, restrained shadows
 */
export default function SuperAdminLogin({ onBackToHome, onLoginSuccess, onLoginCompanySuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securityPin, setSecurityPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberSession, setRememberSession] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-fill Super Admin demo credentials
  const handleFillDemo = () => {
    setEmail('superadmin@starkjobs.com');
    setPassword('StarkAdmin#2026');
    setSecurityPin('849201');
    setErrorMessage('');
  };

  // Auto-fill Company Employer demo credentials
  const handleFillCompanyDemo = () => {
    setEmail('hr@abcindustrial.in');
    setPassword('ABCCompany#2026');
    setSecurityPin('123456');
    setErrorMessage('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter both your Admin ID and Security Password.');
      return;
    }

    setIsLoading(true);

    // Simulate enterprise authentication handshake
    setTimeout(() => {
      setIsLoading(false);
      setLoginSuccess(true);
      const emailLower = email.toLowerCase();

      if (emailLower.includes('abc') || emailLower.includes('company') || emailLower.includes('employer')) {
        if (onLoginCompanySuccess) {
          setTimeout(() => {
            onLoginCompanySuccess();
          }, 600);
          return;
        }
      }

      if (onLoginSuccess) {
        setTimeout(() => {
          onLoginSuccess();
        }, 600);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-secondary-bg flex flex-col justify-between selection:bg-accent-light selection:text-accent font-sans">
      
      {/* Top Header Bar */}
      <header className="w-full bg-white border-b border-card-border py-4 px-4 sm:px-8">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="hidden sm:inline-block h-5 w-px bg-card-border" />
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary text-white">
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />
              SUPER ADMIN CONSOLE
            </span>
          </div>

          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-main-text hover:text-accent transition-colors cursor-pointer py-1.5 px-3 rounded-lg hover:bg-secondary-bg border border-transparent hover:border-card-border"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Back to Main Site</span>
          </button>
        </div>
      </header>

      {/* Main Login Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl shadow-md border border-card-border overflow-hidden">
          
          {/* ================= LEFT BRAND & SECURITY COLUMN (5 cols) ================= */}
          <div className="lg:col-span-5 bg-primary text-white p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            
            {/* Subtle background security badge glow */}
            <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-accent/10 pointer-events-none" />
            <div className="absolute -left-10 top-20 w-44 h-44 rounded-full bg-white/5 pointer-events-none" />

            {/* Top Security Status Tag */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Security Gateway v4.2 Active</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black mt-6 tracking-tight leading-tight">
                Stark Jobs Master Control Environment
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Restricted access portal for authorized personnel. Centralized management of employers, candidates, verified trades, and platform infrastructure across India.
              </p>
            </div>

            {/* Center Security Features */}
            <div className="my-8 relative z-10 space-y-3.5">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <Fingerprint className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Multi-Factor Hardware 2FA</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">Automated biometric and hardware token verification.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <Server className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Zero-Trust Network Access</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">Every administrative command is audit-logged and encrypted.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <Activity className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Platform Uptime 99.98%</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">All 28 industrial trade regional databases active.</p>
                </div>
              </div>
            </div>

            {/* Bottom Security Compliance note */}
            <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <span>Encrypted Session • SHA-256</span>
              <span>ISO 27001 Certified</span>
            </div>
          </div>

          {/* ================= RIGHT FORM COLUMN (7 cols) ================= */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
            
            {/* Header info */}
            <div className="mb-8">
              <div className="flex items-center justify-between gap-3 mb-2">
                <h3 className="text-2xl sm:text-3xl font-black text-main-text tracking-tight">
                  Super Admin Login
                </h3>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-accent-light text-accent border border-accent-border">
                  Tier-1 Root
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-text font-medium">
                Enter your administrative credentials and security token to authenticate.
              </p>
            </div>

            {/* Simulated Success State */}
            {loginSuccess ? (
              <div className="bg-accent-light border border-accent-border rounded-2xl p-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-14 h-14 rounded-full bg-accent text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-primary">Authentication Verified!</h4>
                  <p className="text-xs sm:text-sm text-main-text mt-1">
                    Super Admin token verified for <strong className="font-bold">{email}</strong>.
                  </p>
                  <p className="text-xs text-muted-text mt-1">
                    Directing to Master Operations Dashboard...
                  </p>
                </div>
                <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                  {onLoginSuccess && (
                    <button
                      type="button"
                      onClick={onLoginSuccess}
                      className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <span>Open Admin Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onBackToHome}
                    className="px-4 py-2 text-xs font-bold text-main-text bg-white border border-card-border rounded-xl hover:bg-secondary-bg transition-colors cursor-pointer"
                  >
                    Return to Homepage
                  </button>
                </div>
              </div>
            ) : (
              /* Actual Authentication Form */
              <form onSubmit={handleLogin} className="space-y-4">
                
                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs font-semibold text-red-700 animate-in fade-in duration-150">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Field 1: Admin Email / ID */}
                <div>
                  <label className="block text-xs font-bold text-main-text uppercase tracking-wider mb-1.5">
                    Official Admin ID / Email
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-muted-text absolute left-3.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@starkjobs.com"
                      className="w-full bg-secondary-bg border border-card-border rounded-xl pl-10 pr-4 py-3 text-sm text-main-text font-medium placeholder-slate-400 focus:outline-none focus:border-accent focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                {/* Field 2: Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-main-text uppercase tracking-wider">
                      Master Password
                    </label>
                    <a
                      href="#support"
                      onClick={(e) => {
                        e.preventDefault();
                        alert('Contact Stark Jobs Internal IT Infrastructure team for password recovery.');
                      }}
                      className="text-xs font-semibold text-accent hover:underline cursor-pointer"
                    >
                      Forgot Credentials?
                    </a>
                  </div>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-muted-text absolute left-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-secondary-bg border border-card-border rounded-xl pl-10 pr-10 py-3 text-sm text-main-text font-medium placeholder-slate-400 focus:outline-none focus:border-accent focus:bg-white transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 text-muted-text hover:text-main-text focus:outline-none cursor-pointer"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Field 3: 2FA Security PIN / Hardware Token */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-main-text uppercase tracking-wider">
                      6-Digit Security Token PIN
                    </label>
                    <span className="text-[11px] font-medium text-muted-text">
                      From Google Authenticator / YubiKey
                    </span>
                  </div>
                  <div className="relative flex items-center">
                    <Key className="w-4 h-4 text-muted-text absolute left-3.5" />
                    <input
                      type="text"
                      maxLength={6}
                      value={securityPin}
                      onChange={(e) => setSecurityPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 849201"
                      className="w-full bg-secondary-bg border border-card-border rounded-xl pl-10 pr-4 py-3 text-sm font-mono tracking-widest text-main-text placeholder-slate-400 focus:outline-none focus:border-accent focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                {/* Remember Session Checkbox */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-xs font-medium text-main-text cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberSession}
                      onChange={(e) => setRememberSession(e.target.checked)}
                      className="w-4 h-4 text-accent rounded border-card-border focus:ring-accent"
                    />
                    <span>Keep admin workstation session active (12 hrs)</span>
                  </label>
                </div>

                {/* Primary Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 text-sm font-bold text-white bg-primary hover:bg-primary-hover active:scale-[0.99] rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed mt-2"
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Authenticating Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Authorize & Enter Console</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Quick-fill Demo Helper for testing */}
                <div className="pt-4 border-t border-card-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <span className="text-muted-text">Need test credentials?</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleFillDemo}
                      className="px-2.5 py-1.5 rounded-lg bg-secondary-bg border border-card-border text-primary hover:text-accent font-bold transition-colors cursor-pointer"
                    >
                      ⚡ Super Admin Demo
                    </button>
                    <button
                      type="button"
                      onClick={handleFillCompanyDemo}
                      className="px-2.5 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 font-bold transition-colors cursor-pointer"
                    >
                      🏢 Company Demo
                    </button>
                    {onLoginCompanySuccess && (
                      <button
                        type="button"
                        onClick={onLoginCompanySuccess}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 font-bold transition-colors cursor-pointer"
                      >
                        🚀 Employer Portal
                      </button>
                    )}
                  </div>
                </div>

              </form>
            )}

          </div>

        </div>
      </main>

      {/* Footer Bar */}
      <footer className="w-full py-4 text-center text-xs text-muted-text border-t border-card-border bg-white">
        <p>© {new Date().getFullYear()} Stark Jobs Inc. Protected by Stark Sentinel Cloud Security Shield. All Rights Reserved.</p>
      </footer>

    </div>
  );
}
