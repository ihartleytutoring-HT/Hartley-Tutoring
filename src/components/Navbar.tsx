import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  BookOpen,
  CreditCard,
  Phone,
  ShieldCheck,
  LogOut,
  LogIn,
  Menu,
  X,
  User as UserIcon,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  onNavigate: (view: 'home' | 'services' | 'curriculum' | 'pricing' | 'about' | 'contact' | 'student-portal' | 'admin-portal') => void;
  currentView: string;
  onOpenSubscribe: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView, onOpenSubscribe }) => {
  const { user, profile, isAdmin, loginWithGoogle, logout, simulateAdminMode, isSimulatedAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNav = (view: any) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div
            onClick={() => handleNav('home')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-indigo-600 p-0.5 shadow-xl shadow-amber-500/25 group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center overflow-hidden p-0.5">
                <img
                  src="https://static.wixstatic.com/media/9d2cc8_fb65460968104dc5a824c9686eb63ae6~mv2.png/v1/fill/w_109,h_109,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/hartley_logo_badge.png"
                  alt="Hartley Tutoring Logo"
                  className="w-full h-full object-contain scale-110 drop-shadow-md"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
                  Hartley Tutoring
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => handleNav('home')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'home' ? 'text-amber-400 bg-slate-900' : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNav('services')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'services' ? 'text-amber-400 bg-slate-900' : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              Services
            </button>
            <button
              onClick={() => handleNav('about')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'about' ? 'text-amber-400 bg-slate-900' : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              About Imraan
            </button>
            <button
              onClick={() => handleNav('curriculum')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'curriculum' ? 'text-amber-400 bg-slate-900' : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              Curriculum & Grades
            </button>
            <button
              onClick={() => handleNav('pricing')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'pricing' ? 'text-amber-400 bg-slate-900' : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              Packages & Fees
            </button>
            <button
              onClick={() => handleNav('contact')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'contact' ? 'text-amber-400 bg-slate-900' : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              Contact
            </button>

            {/* Student Learning Portal CTA */}
            {user && (
              <button
                onClick={() => handleNav('student-portal')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  currentView === 'student-portal'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-indigo-950/70 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-900/60'
                }`}
              >
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>My Portal</span>
              </button>
            )}

            {/* Admin Portal Tab (Visible if admin email or simulated) */}
            {isAdmin && (
              <button
                onClick={() => handleNav('admin-portal')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                  currentView === 'admin-portal'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Admin Portal</span>
              </button>
            )}
          </nav>

          {/* Right Actions: Subscribe CTA & Auth */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onOpenSubscribe}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Enroll / Subscribe</span>
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-400/50"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-amber-400 font-bold text-xs">
                      {user.displayName?.charAt(0) || 'U'}
                    </div>
                  )}
                  <span className="text-xs font-medium text-slate-200 max-w-[100px] truncate">
                    {user.displayName?.split(' ')[0] || 'Account'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 text-xs">
                    <div className="px-4 py-3 border-b border-slate-800/80">
                      <p className="font-semibold text-white truncate">{user.displayName || 'Student'}</p>
                      <p className="text-slate-400 truncate mt-0.5">{user.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          Pre-Approved Admin
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        handleNav('student-portal');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-slate-200 hover:bg-slate-800 transition-colors"
                    >
                      <BookOpen className="w-4 h-4 text-indigo-400" />
                      <span>My Learning Portal</span>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          handleNav('admin-portal');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-amber-300 hover:bg-slate-800 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        <span>Admin Dashboard</span>
                      </button>
                    )}

                    {/* Developer Admin Simulation Toggle (helpful for demoing without admin google account) */}
                    <div className="px-4 py-2 border-t border-slate-800/80 my-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Admin Rights Toggle</span>
                        <input
                          type="checkbox"
                          checked={isAdmin}
                          onChange={(e) => simulateAdminMode(e.target.checked)}
                          className="rounded text-amber-500 focus:ring-0 cursor-pointer"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-rose-400 hover:bg-slate-800 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => loginWithGoogle()}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-700 hover:border-slate-500 hover:bg-slate-800 text-white transition-all cursor-pointer"
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
                <span>Sign in with Google</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onOpenSubscribe}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-slate-950"
            >
              Enroll
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-3 pb-6 space-y-2">
          <button
            onClick={() => handleNav('home')}
            className="w-full text-left px-3 py-2 rounded-lg text-slate-200 font-medium hover:bg-slate-900"
          >
            Home
          </button>
          <button
            onClick={() => handleNav('services')}
            className="w-full text-left px-3 py-2 rounded-lg text-slate-200 font-medium hover:bg-slate-900"
          >
            Services
          </button>
          <button
            onClick={() => handleNav('about')}
            className="w-full text-left px-3 py-2 rounded-lg text-slate-200 font-medium hover:bg-slate-900"
          >
            About Imraan Hartley
          </button>
          <button
            onClick={() => handleNav('curriculum')}
            className="w-full text-left px-3 py-2 rounded-lg text-slate-200 font-medium hover:bg-slate-900"
          >
            Curriculum & Grades
          </button>
          <button
            onClick={() => handleNav('pricing')}
            className="w-full text-left px-3 py-2 rounded-lg text-slate-200 font-medium hover:bg-slate-900"
          >
            Packages & Pricing
          </button>
          <button
            onClick={() => handleNav('contact')}
            className="w-full text-left px-3 py-2 rounded-lg text-slate-200 font-medium hover:bg-slate-900"
          >
            Contact & Location
          </button>

          {user && (
            <button
              onClick={() => handleNav('student-portal')}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-indigo-400 font-semibold bg-indigo-950/50"
            >
              <BookOpen className="w-4 h-4" />
              <span>My Learning Portal</span>
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => handleNav('admin-portal')}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Management Portal</span>
            </button>
          )}

          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
            {user ? (
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">{user.email}</span>
                <button
                  onClick={() => logout()}
                  className="text-xs text-rose-400 font-semibold px-2 py-1 bg-rose-500/10 rounded"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => loginWithGoogle()}
                className="w-full py-2.5 rounded-xl font-semibold text-xs bg-slate-900 border border-slate-700 text-white flex items-center justify-center gap-2"
              >
                <span>Sign in with Google</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
