import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Calendar,
  Ticket,
  Clock,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Compass,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import { formatDate } from '../utils/helpers';
import { CategoryBadge } from '../components/common/Badge';

export function StudentDashboardPage() {
  const { currentUser } = useAuth();
  const { getStudentRegistrations, events } = useEvents();

  const myRegistrations = currentUser ? getStudentRegistrations(currentUser.id) : [];

  const earnedCertificates = myRegistrations.filter(
    r => r.status === 'ATTENDED' || r.status === 'CHECKED_IN' || (r.event && new Date(r.event.date) < new Date())
  );

  // Sort upcoming
  const upcomingRegistrations = [...myRegistrations].sort(
    (a, b) => new Date(a.event?.date) - new Date(b.event?.date)
  );

  const nextEvent = upcomingRegistrations[0];

  // Recommendations: events not registered yet
  const registeredEventIds = new Set(myRegistrations.map(r => r.eventId));
  const recommendedEvents = events
    .filter(e => !registeredEventIds.has(e.id))
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* 1. Student Profile Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative group shrink-0">
            {currentUser?.photoURL || currentUser?.avatarUrl ? (
              <img
                src={currentUser.photoURL || currentUser.avatarUrl}
                alt={currentUser.fullName || 'Student'}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-400/60 shadow-lg shadow-indigo-600/30"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-indigo-600/40">
                {currentUser?.fullName?.charAt(0) || 'S'}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">
                Welcome, {currentUser?.fullName || 'Student'}!
              </h1>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Active Student
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>Roll: <strong className="text-white font-mono">{currentUser?.studentIdNumber || 'N/A'}</strong></span>
              <span>•</span>
              <span>{currentUser?.department}</span>
              <span>•</span>
              <span>{currentUser?.academicYear || 'Undergraduate'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/events"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4" />
            <span>Discover Events</span>
          </Link>
          <Link
            to="/my-registrations"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition flex items-center gap-1.5"
          >
            <Ticket className="w-4 h-4" />
            <span>My Passes ({myRegistrations.length})</span>
          </Link>
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase text-slate-400 block tracking-wider">
              Total Registrations
            </span>
            <span className="text-2xl font-black text-slate-900">{myRegistrations.length}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase text-slate-400 block tracking-wider">
              Upcoming Sessions
            </span>
            <span className="text-2xl font-black text-slate-900">{upcomingRegistrations.length}</span>
          </div>
        </div>

        <Link
          to="/my-registrations"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4 hover:border-amber-400 hover:shadow-md transition group"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase text-slate-400 block tracking-wider">
              Earned Certificates
            </span>
            <span className="text-2xl font-black text-slate-900">
              {earnedCertificates.length}{' '}
              <span className="text-xs font-semibold text-amber-700">Available</span>
            </span>
          </div>
        </Link>
      </div>

      {/* 3. Next Upcoming Event Hero Spotlight */}
      {nextEvent && nextEvent.event ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Next Scheduled Event
            </span>
            <Link
              to="/my-registrations"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
            >
              View All Passes →
            </Link>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <CategoryBadge category={nextEvent.event.category} />
                <span className="text-xs font-mono font-bold text-slate-400">
                  Pass: {nextEvent.ticketCode}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                <Link to={`/events/${nextEvent.event.id}`} className="hover:text-indigo-600 transition">
                  {nextEvent.event.name}
                </Link>
              </h3>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-600 pt-1">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <span className="font-semibold text-slate-800">{formatDate(nextEvent.event.date)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>{nextEvent.event.time}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-600" />
                  <span>{nextEvent.event.venue}</span>
                </div>
              </div>
            </div>

            <Link
              to="/my-registrations"
              className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 transition shadow-md shadow-indigo-600/30 shrink-0"
            >
              <Ticket className="w-4 h-4" />
              <span>Open Digital Pass</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">You haven't registered for any events yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Explore our curated catalog of technical hackathons, cultural festivals, and career expos.
          </p>
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition shadow-sm mt-2"
          >
            <span>Explore Events Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 4. Recommended Events for Student */}
      {recommendedEvents.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Recommended For You</h3>
              <p className="text-xs text-slate-500">Popular upcoming events you haven't joined yet.</p>
            </div>
            <Link to="/events" className="text-xs font-bold text-indigo-600 hover:underline">
              See more →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-indigo-300 transition flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <CategoryBadge category={event.category} />
                    <span className="text-[11px] font-semibold text-slate-400">
                      {formatDate(event.date)}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                    <Link to={`/events/${event.id}`} className="hover:text-indigo-600">
                      {event.name}
                    </Link>
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {event.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 truncate max-w-[150px]">
                    📍 {event.venue}
                  </span>
                  <Link
                    to={`/events/${event.id}`}
                    className="text-xs font-bold text-indigo-600 hover:underline"
                  >
                    View →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
