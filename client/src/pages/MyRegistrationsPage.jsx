import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Search, Calendar, Compass, ArrowRight, CheckCircle2, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import { TicketCard } from '../components/registrations/TicketCard';

export function MyRegistrationsPage() {
  const { currentUser, isStudent, quickLoginDemo } = useAuth();
  const { getStudentRegistrations, cancelRegistration } = useEvents();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState('upcoming'); // 'all', 'upcoming', 'past', 'certificates'
  const [successToast, setSuccessToast] = useState('');

  if (!currentUser || !isStudent) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl mx-auto flex items-center justify-center">
          <Ticket className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Student Sign-In Required</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Please log in with your student credentials to view and manage your registered event passes.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => quickLoginDemo('student')}
            className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition"
          >
            Quick Sign In as Demo Student
          </button>
          <Link
            to="/login"
            className="px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  const rawRegistrations = getStudentRegistrations(currentUser.id);

  const certificatesCount = rawRegistrations.filter(r =>
    r.status === 'ATTENDED' || r.status === 'CHECKED_IN' || (r.event && new Date(r.event.date) < new Date())
  ).length;

  // Filter tab & search
  const filteredRegistrations = rawRegistrations.filter((reg) => {
    const event = reg.event;
    if (!event) return false;

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = event.name.toLowerCase().includes(q);
      const matchVenue = event.venue.toLowerCase().includes(q);
      const matchCode = reg.ticketCode.toLowerCase().includes(q);
      if (!matchName && !matchVenue && !matchCode) return false;
    }

    // Time filter
    const eventDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (filterTab === 'upcoming' && eventDate < today) {
      return false;
    }
    if (filterTab === 'past' && eventDate >= today) {
      return false;
    }
    if (filterTab === 'certificates') {
      const isAttended = reg.status === 'ATTENDED' || reg.status === 'CHECKED_IN' || eventDate < today;
      if (!isAttended) return false;
    }

    return true;
  });

  const handleCancel = (registrationId) => {
    const res = cancelRegistration(registrationId);
    if (res.success) {
      setSuccessToast('Registration was successfully cancelled.');
      setTimeout(() => setSuccessToast(''), 4000);
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-800 flex items-center gap-3 text-xs animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Ticket className="w-4 h-4" />
            <span>Digital Gate Passes</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Registered Events
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Display your official admission passes or print them for on-campus verification.
          </p>
        </div>

        <Link
          to="/events"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm self-start md:self-auto"
        >
          <Compass className="w-4 h-4" />
          <span>Discover More Events</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
        {/* Tab Controls */}
        <div className="flex items-center gap-1 w-full sm:w-auto">
          <button
            onClick={() => setFilterTab('upcoming')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              filterTab === 'upcoming'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Upcoming Events
          </button>
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              filterTab === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Passes ({rawRegistrations.length})
          </button>
          <button
            onClick={() => setFilterTab('past')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              filterTab === 'past'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Past Events
          </button>
          <button
            onClick={() => setFilterTab('certificates')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              filterTab === 'certificates'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-sm'
                : 'text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/60'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-900" />
            <span>Earned Certificates ({certificatesCount})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search your passes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Ticket Cards Stream */}
      {filteredRegistrations.length > 0 ? (
        <div className="space-y-6">
          {filteredRegistrations.map((reg) => (
            <TicketCard
              key={reg.id}
              registration={reg}
              onCancel={handleCancel}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <Ticket className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            {searchTerm ? 'No passes matched your search' : 'No passes in this view'}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {searchTerm
              ? 'Try modifying your search query.'
              : 'You have not registered for any upcoming events in this category yet.'}
          </p>
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            <span>Browse Upcoming Events</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
