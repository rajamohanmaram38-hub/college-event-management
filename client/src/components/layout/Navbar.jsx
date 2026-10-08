import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Calendar,
  Layers,
  User,
  ShieldCheck,
  LogOut,
  PlusCircle,
  Menu,
  X,
  Sparkles,
  Ticket,
  QrCode,
  Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEvents } from '../../context/EventContext';

export function Navbar() {
  const { currentUser, userRole, isStudent, isAdmin, logout, quickLoginDemo } = useAuth();
  const { isRealtimeFirestoreActive } = useEvents();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleQuickDemo = (role) => {
    quickLoginDemo(role);
    setMobileMenuOpen(false);
    if (role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top University Announcement & Quick Demo Switcher Bar */}
      <div className="bg-slate-900 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-medium text-[11px] sm:text-xs">
              Apex Institute of Technology • Campus Event & Schedule Portal
            </span>
            {isRealtimeFirestoreActive && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Live Firestore</span>
              </span>
            )}
          </div>

          {/* Quick Demo Switcher Pills */}
          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-slate-400 hidden md:inline">Quick Test:</span>
            <button
              onClick={() => handleQuickDemo('student')}
              className={`px-2 py-0.5 rounded font-semibold transition ${
                isStudent ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Demo Student
            </button>
            <button
              onClick={() => handleQuickDemo('admin')}
              className={`px-2 py-0.5 rounded font-semibold transition ${
                isAdmin ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Demo Admin
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-1">
                Campus<span className="text-indigo-600">Pulse</span>
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-1">
                Event Management
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                isActive('/')
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </Link>

            <Link
              to="/events"
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                isActive('/events')
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Events</span>
            </Link>

            <Link
              to="/scanner"
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                isActive('/scanner')
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Gate Scanner</span>
            </Link>

            <Link
              to="/verify"
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                isActive('/verify')
                  ? 'bg-amber-50 text-amber-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>Verify Certificate</span>
            </Link>

            {/* Student Specific Links */}
            {isStudent && (
              <>
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                    isActive('/dashboard')
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Dashboard
                </Link>

                <Link
                  to="/my-registrations"
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    isActive('/my-registrations')
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>My Registrations</span>
                </Link>
              </>
            )}

            {/* Admin Specific Links */}
            {isAdmin && (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    isActive('/admin/dashboard')
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Dashboard</span>
                </Link>

                <Link
                  to="/admin/events/new"
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    isActive('/admin/events/new')
                      ? 'bg-indigo-600 text-white'
                      : 'text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ Add Event</span>
                </Link>
              </>
            )}
          </nav>

          {/* Desktop User Action Controls */}
          <div className="hidden md:flex items-center gap-2">
            {currentUser ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.fullName}
                    className="w-8 h-8 rounded-full border border-indigo-200 object-cover shadow-sm shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : null}
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {currentUser.fullName}
                  </div>
                  <span
                    className={`inline-block text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                      isAdmin ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'
                    }`}
                  >
                    {isAdmin ? 'Administrator' : 'Student'}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                >
                  Student Login
                </Link>

                <Link
                  to="/admin/login"
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition"
                >
                  Admin Portal
                </Link>

                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-fade-in shadow-xl">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-100"
          >
            Home
          </Link>
          <Link
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-100"
          >
            All Events
          </Link>
          <Link
            to="/scanner"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-100"
          >
            Gate Scanner
          </Link>
          <Link
            to="/verify"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-bold text-amber-700 hover:bg-amber-50"
          >
            Verify Certificate
          </Link>

          {isStudent && (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-100"
              >
                Student Dashboard
              </Link>
              <Link
                to="/my-registrations"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-100"
              >
                My Registrations
              </Link>
            </>
          )}

          {isAdmin && (
            <>
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-100"
              >
                Admin Dashboard
              </Link>
              <Link
                to="/admin/events/new"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-bold text-indigo-600 hover:bg-indigo-50"
              >
                + Add New Event
              </Link>
            </>
          )}

          <div className="pt-3 border-t border-slate-100">
            {currentUser ? (
              <div className="space-y-2">
                <div className="px-3 py-1 text-xs text-slate-500">
                  Signed in as <strong className="text-slate-800">{currentUser.fullName}</strong> ({userRole})
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
                >
                  Student Login
                </Link>
                <Link
                  to="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 px-3 rounded-xl bg-indigo-50 text-xs font-bold text-indigo-700"
                >
                  Admin Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="col-span-2 text-center py-2 px-3 rounded-xl bg-indigo-600 text-xs font-bold text-white shadow"
                >
                  Student Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
