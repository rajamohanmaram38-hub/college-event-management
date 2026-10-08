import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Sparkles,
  Users,
  Trophy,
  ArrowRight,
  Search,
  CheckCircle2,
  Clock,
  Compass,
  GraduationCap,
  ShieldCheck,
  Star
} from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import { EventCard } from '../components/events/EventCard';
import { CATEGORIES } from '../data/mockData';
import { RegistrationConfirmModal } from '../components/registrations/RegistrationConfirmModal';

export function HomePage() {
  const { events, registerForEvent } = useEvents();
  const { currentUser, isStudent, quickLoginDemo } = useAuth();
  const navigate = useNavigate();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedEventForModal, setSelectedEventForModal] = useState(null);
  const [recentRegistration, setRecentRegistration] = useState(null);

  const featuredEvents = events.filter(e => e.featured).slice(0, 3);
  const upcomingEvents = events.slice(0, 6);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/events?search=${encodeURIComponent(searchKeyword)}`);
  };

  const handleRegisterClick = (event) => {
    if (!currentUser) {
      if (window.confirm('You must be signed in as a student to register. Would you like to sign in as Demo Student now?')) {
        const student = quickLoginDemo('student');
        const res = registerForEvent(event.id, student);
        if (res.success) {
          setSelectedEventForModal(event);
          setRecentRegistration(res.registration);
        } else {
          alert(res.message);
        }
      } else {
        navigate('/login');
      }
      return;
    }

    if (!isStudent) {
      alert('You are currently logged in as an Administrator. Please log in as a student to register.');
      return;
    }

    const res = registerForEvent(event.id, currentUser);
    if (res.success) {
      setSelectedEventForModal(event);
      setRecentRegistration(res.registration);
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-900 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-indigo-900/50">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Official Campus Event Discovery & Registration</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Never Miss a Moment on <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-indigo-200">Campus.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Explore hackathons, technical workshops, cultural celebrations, sports matches, and career placement drives. Reserve your seat online with 1-click passes.
            </p>

            {/* Quick Hero Search Bar */}
            <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto flex gap-2 p-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl">
              <div className="relative flex-1 flex items-center">
                <Search className="w-5 h-5 absolute left-3.5 text-slate-300" />
                <input
                  type="text"
                  placeholder="Search events, workshops, cultural fests..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full pl-11 pr-3 py-3 bg-transparent text-white placeholder:text-slate-400 text-sm focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-indigo-500/30 shrink-0"
              >
                <span>Find Events</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Call to Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                to="/events"
                className="px-5 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold transition shadow"
              >
                Browse All Events
              </Link>

              {currentUser ? (
                isStudent ? (
                  <Link
                    to="/my-registrations"
                    className="px-5 py-2.5 rounded-xl bg-indigo-600/60 hover:bg-indigo-600 border border-indigo-400/40 text-white text-xs font-bold transition"
                  >
                    My Registered Events
                  </Link>
                ) : (
                  <Link
                    to="/admin/dashboard"
                    className="px-5 py-2.5 rounded-xl bg-indigo-600/60 hover:bg-indigo-600 border border-indigo-400/40 text-white text-xs font-bold transition"
                  >
                    Admin Dashboard
                  </Link>
                )
              ) : (
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition"
                >
                  Create Student Account
                </Link>
              )}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto pt-8 border-t border-slate-800 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">{events.length}+</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Live Campus Events</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400">1,200+</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Registered Students</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">25+</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Active Clubs & Societies</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">100%</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Verified Gate Passes</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Events Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>Spotlight Events</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Campus Happenings
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Top events selected by the Student Affairs Council for maximum engagement.
            </p>
          </div>

          <Link
            to="/events"
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
          >
            <span>View All ({events.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onRegisterClick={handleRegisterClick}
            />
          ))}
        </div>
      </section>

      {/* 3. Browse by Category */}
      <section className="bg-slate-100/70 py-12 px-4 sm:px-6 lg:px-8 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Explore by Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Filter through our diverse extracurricular and academic programming.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigate(`/events?category=${encodeURIComponent(cat.name)}`)}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-indigo-400 shadow-xs hover:shadow-md transition-all text-center group flex flex-col items-center justify-center space-y-3"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${cat.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition">
                    {cat.name}
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    {events.filter(e => e.category === cat.name).length} events
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Upcoming Events Stream */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Calendar className="w-4 h-4" />
              <span>Upcoming Schedule</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Upcoming College Events
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Secure your spot early before registration deadlines pass.
            </p>
          </div>

          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm"
          >
            <span>Explore Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onRegisterClick={handleRegisterClick}
            />
          ))}
        </div>
      </section>

      {/* 5. How It Works / Value Props */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block mb-2">
              For Students & Campus Clubs
            </span>
            <h3 className="text-2xl sm:text-3xl font-black mb-4">
              Everything You Need for Effortless Event Participation
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-8">
              No more searching through bulletin boards or messy message chats. CampusPulse streamlines university event coordination into a single, intuitive platform.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h4 className="font-bold text-sm text-white">Find Events Fast</h4>
                <p className="text-xs text-slate-400">
                  Search by department, category, venue, and date with live seats tracking.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h4 className="font-bold text-sm text-white">1-Click Online RSVP</h4>
                <p className="text-xs text-slate-400">
                  Instant registration with verifiable digital passes and QR codes.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h4 className="font-bold text-sm text-white">Admin Management</h4>
                <p className="text-xs text-slate-400">
                  Organizers can publish events, track capacity, and download attendance rosters.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Confirmation Modal */}
      <RegistrationConfirmModal
        isOpen={!!selectedEventForModal}
        onClose={() => {
          setSelectedEventForModal(null);
          setRecentRegistration(null);
        }}
        registration={recentRegistration}
        event={selectedEventForModal}
      />
    </div>
  );
}
