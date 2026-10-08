import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import { CategoryBadge } from '../common/Badge';
import { CapacityBar } from './CapacityBar';
import { formatDate, isDeadlinePassed } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import { useEvents } from '../../context/EventContext';

export function EventCard({ event, onRegisterClick }) {
  const { currentUser, isStudent } = useAuth();
  const { getEventAttendees, isStudentRegistered } = useEvents();

  const attendees = getEventAttendees(event.id);
  const currentCount = attendees.length;
  const isRegistered = isStudent && isStudentRegistered(event.id, currentUser?.id);
  const isFull = currentCount >= event.maxParticipants;
  const isExpired = isDeadlinePassed(event.registrationDeadline);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-indigo-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Image Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={event.bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'}
          alt={event.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
        
        {/* Badges on Top */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <CategoryBadge category={event.category} className="shadow-sm bg-white/95 backdrop-blur-sm" />
          {event.featured && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white shadow-sm">
              Featured
            </span>
          )}
        </div>

        {/* Registered Indicator */}
        {isRegistered && (
          <div className="absolute top-3 right-3 bg-emerald-600 text-white px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-md">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Registered
          </div>
        )}

        {/* Date Stamp on Bottom of Image */}
        <div className="absolute bottom-3 left-3 text-white">
          <p className="text-xs uppercase font-bold tracking-wider text-indigo-200">
            {formatDate(event.date)}
          </p>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-2">
            <Link to={`/events/${event.id}`}>
              {event.name}
            </Link>
          </h3>

          <p className="text-slate-600 text-sm line-clamp-2 mb-4 leading-relaxed">
            {event.description}
          </p>

          {/* Details Grid */}
          <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span className="truncate">{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-teal-500 shrink-0" />
              <span className="truncate font-medium text-slate-700">By {event.organizer}</span>
            </div>
          </div>
        </div>

        {/* Capacity Bar & Footer Action */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <CapacityBar current={currentCount} max={event.maxParticipants} />

          <div className="flex items-center gap-2 pt-1">
            <Link
              to={`/events/${event.id}`}
              className="flex-1 text-center py-2 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
            >
              Details
            </Link>

            {isRegistered ? (
              <Link
                to="/my-registrations"
                className="flex-1 text-center py-2 px-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition"
              >
                View Ticket
              </Link>
            ) : isExpired ? (
              <button
                disabled
                className="flex-1 py-2 px-3 rounded-xl bg-slate-100 text-slate-400 text-xs font-semibold cursor-not-allowed"
              >
                Closed
              </button>
            ) : isFull ? (
              <button
                disabled
                className="flex-1 py-2 px-3 rounded-xl bg-slate-100 text-slate-400 text-xs font-semibold cursor-not-allowed"
              >
                Full
              </button>
            ) : (
              <button
                onClick={() => onRegisterClick && onRegisterClick(event)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm hover:shadow transition"
              >
                <span>Register</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
