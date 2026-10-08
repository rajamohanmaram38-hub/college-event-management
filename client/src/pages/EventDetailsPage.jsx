import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Share2,
  Mail,
  ArrowLeft,
  Ticket,
  Sparkles,
  Info
} from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import { CategoryBadge, StatusBadge } from '../components/common/Badge';
import { CapacityBar } from '../components/events/CapacityBar';
import { formatDate, getDaysRemaining, isDeadlinePassed } from '../utils/helpers';
import { RegistrationConfirmModal } from '../components/registrations/RegistrationConfirmModal';
import { AttendeesModal } from '../components/registrations/AttendeesModal';

export function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEventById, getEventAttendees, isStudentRegistered, registerForEvent } = useEvents();
  const { currentUser, isStudent, isAdmin, quickLoginDemo } = useAuth();

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [attendeesModalOpen, setAttendeesModalOpen] = useState(false);
  const [recentRegistration, setRecentRegistration] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const event = getEventById(id);

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Event Not Found</h2>
        <p className="text-sm text-slate-500">
          The event you are looking for may have been removed or does not exist.
        </p>
        <Link
          to="/events"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Events</span>
        </Link>
      </div>
    );
  }

  const attendees = getEventAttendees(event.id);
  const currentCount = attendees.length;
  const isRegistered = isStudent && isStudentRegistered(event.id, currentUser?.id);
  const isFull = currentCount >= event.maxParticipants;
  const isExpired = isDeadlinePassed(event.registrationDeadline);
  const daysRemaining = getDaysRemaining(event.registrationDeadline);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleRegister = () => {
    if (!currentUser) {
      if (window.confirm('You must be signed in as a student to register. Would you like to sign in as Demo Student now?')) {
        const student = quickLoginDemo('student');
        const res = registerForEvent(event.id, student);
        if (res.success) {
          setRecentRegistration(res.registration);
          setConfirmModalOpen(true);
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
      setRecentRegistration(res.registration);
      setConfirmModalOpen(true);
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/events"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Events</span>
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copiedLink ? 'Link Copied!' : 'Share Event'}</span>
        </button>
      </div>

      {/* Hero Banner Section */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-slate-900 min-h-[320px] flex items-end">
        <img
          src={event.bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80'}
          alt={event.name}
          className="absolute inset-0 w-full h-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />

        <div className="relative z-10 p-6 sm:p-10 text-white w-full">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <CategoryBadge category={event.category} className="bg-white/95 text-slate-900" />
            {event.featured && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white shadow-sm">
                Spotlight Event
              </span>
            )}
            {isExpired ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/80 text-white">
                Registration Closed
              </span>
            ) : daysRemaining !== null && daysRemaining >= 0 ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/80 text-white">
                {daysRemaining === 0 ? 'Last Day to Register' : `${daysRemaining} days left to register`}
              </span>
            ) : null}
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight max-w-4xl mb-4">
            {event.name}
          </h1>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-400" />
              <span>{event.venue}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>By {event.organizer}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Event In-Depth Description & Agenda */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Event */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Info className="w-5 h-5 text-indigo-600" />
              <span>About This Event</span>
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Agenda / Schedule Breakdown (if available) */}
          {event.agenda && event.agenda.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                <span>Event Schedule & Agenda</span>
              </h2>

              <div className="space-y-4 border-l-2 border-indigo-100 pl-4 sm:pl-6 ml-2">
                {event.agenda.map((slot, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-[25px] sm:-left-[33px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-indigo-600 group-hover:scale-125 transition-transform" />
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <span className="text-xs font-bold text-indigo-600 block mb-1">
                        {slot.time}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">
                        {slot.title}
                      </h4>
                      {slot.description && (
                        <p className="text-xs text-slate-500 mt-1">
                          {slot.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prerequisites & Guidelines */}
          {event.prerequisites && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Prerequisites & Important Guidelines</span>
              </h2>
              <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl text-xs sm:text-sm text-emerald-900 leading-relaxed">
                {event.prerequisites}
              </div>
            </div>
          )}

          {/* Organizer Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Organizing Committee
                </span>
                <h4 className="text-sm font-bold text-slate-900">
                  {event.organizer}
                </h4>
                {event.contactEmail && (
                  <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <Mail className="w-3 h-3 text-slate-400" />
                    {event.contactEmail}
                  </span>
                )}
              </div>
            </div>

            {isAdmin && (
              <button
                onClick={() => setAttendeesModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm"
              >
                View Registered Students ({attendees.length})
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Sticky Registration / Action Box */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md sticky top-24 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Registration</h3>
              <StatusBadge status={isExpired ? 'FULL' : isFull ? 'FULL' : 'OPEN'} />
            </div>

            {/* Capacity Progress */}
            <div>
              <CapacityBar current={currentCount} max={event.maxParticipants} />
            </div>

            {/* Event Key Information Box */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Date</span>
                <span className="font-bold text-slate-800">{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Time</span>
                <span className="font-bold text-slate-800">{event.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Venue</span>
                <span className="font-bold text-slate-800 truncate max-w-[160px]" title={event.venue}>
                  {event.venue}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Reg. Deadline</span>
                <span className="font-bold text-rose-600">
                  {formatDate(event.registrationDeadline)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Pass Type</span>
                <span className="font-bold text-emerald-600">Free Student Entry</span>
              </div>
            </div>

            {/* Registration Action Buttons */}
            <div>
              {isRegistered ? (
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs text-emerald-800 font-semibold flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>You are registered for this event!</span>
                  </div>
                  <Link
                    to="/my-registrations"
                    className="w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-sm"
                  >
                    <Ticket className="w-4 h-4" />
                    <span>View Digital Ticket Pass</span>
                  </Link>
                </div>
              ) : isExpired ? (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-center text-xs text-rose-800 font-semibold flex items-center justify-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>Registration deadline has passed.</span>
                </div>
              ) : isFull ? (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-center text-xs text-amber-800 font-semibold flex items-center justify-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Event has reached maximum capacity.</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={handleRegister}
                    className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/30"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Register Online Now</span>
                  </button>
                  <p className="text-[11px] text-slate-400 text-center">
                    Instant confirmation. Seat is secured immediately.
                  </p>
                </div>
              )}
            </div>

            {/* Admin Management Helper */}
            {isAdmin && (
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Admin Controls
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to={`/admin/events/edit/${event.id}`}
                    className="py-2 px-3 text-center rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700"
                  >
                    Edit Event
                  </Link>
                  <button
                    onClick={() => setAttendeesModalOpen(true)}
                    className="py-2 px-3 text-center rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white"
                  >
                    Roster ({attendees.length})
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <RegistrationConfirmModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        registration={recentRegistration}
        event={event}
      />

      {/* Attendees Modal for Admin */}
      <AttendeesModal
        isOpen={attendeesModalOpen}
        onClose={() => setAttendeesModalOpen(false)}
        event={event}
        attendees={attendees}
      />
    </div>
  );
}
