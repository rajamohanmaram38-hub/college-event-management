import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Calendar,
  Users,
  PlusCircle,
  Search,
  Edit3,
  Trash2,
  Download,
  AlertTriangle,
  CheckCircle,
  Eye,
  SlidersHorizontal,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import { formatDate, exportToCSV, isDeadlinePassed } from '../utils/helpers';
import { CategoryBadge, StatusBadge } from '../components/common/Badge';
import { AttendeesModal } from '../components/registrations/AttendeesModal';
import { Modal } from '../components/common/Modal';
import { CATEGORIES } from '../data/mockData';

export function AdminDashboardPage() {
  const { currentUser, isAdmin, quickLoginDemo } = useAuth();
  const { events, registrations, deleteEvent, getEventAttendees } = useEvents();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedEventForAttendees, setSelectedEventForAttendees] = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  if (!currentUser || !isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-slate-100 text-slate-800 rounded-3xl mx-auto flex items-center justify-center">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Administrator Access Required</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          You must be logged in as a faculty coordinator or campus administrator to access this management dashboard.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              quickLoginDemo('admin');
              navigate('/admin/dashboard');
            }}
            className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition"
          >
            Quick Sign In as Demo Admin
          </button>
          <Link
            to="/admin/login"
            className="px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition"
          >
            Admin Login
          </Link>
        </div>
      </div>
    );
  }

  // Filter events
  const filteredEvents = events.filter((e) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = e.name.toLowerCase().includes(q);
      const matchVenue = e.venue.toLowerCase().includes(q);
      const matchOrg = e.organizer.toLowerCase().includes(q);
      if (!matchTitle && !matchVenue && !matchOrg) return false;
    }

    if (categoryFilter !== 'all' && e.category !== categoryFilter) {
      return false;
    }

    return true;
  });

  // Calculate Metrics
  const totalEvents = events.length;
  const totalRegistrations = registrations.length;
  const totalCapacity = events.reduce((sum, e) => sum + (e.maxParticipants || 0), 0);
  const overallFillRate = totalCapacity > 0 ? Math.round((totalRegistrations / totalCapacity) * 100) : 0;

  const handleDeleteConfirm = () => {
    if (eventToDelete) {
      const res = deleteEvent(eventToDelete.id);
      if (res.success) {
        setStatusMessage(`Event "${eventToDelete.name}" deleted successfully.`);
        setTimeout(() => setStatusMessage(''), 4000);
      }
      setEventToDelete(null);
    }
  };

  const handleExportAllEvents = () => {
    const data = events.map(e => {
      const attendees = getEventAttendees(e.id);
      return {
        'Event ID': e.id,
        'Event Name': e.name,
        'Category': e.category,
        'Date': e.date,
        'Time': e.time,
        'Venue': e.venue,
        'Organizer': e.organizer,
        'Registrations': attendees.length,
        'Max Capacity': e.maxParticipants,
        'Fill Rate %': Math.round((attendees.length / e.maxParticipants) * 100),
        'Registration Deadline': e.registrationDeadline
      };
    });
    exportToCSV('Campus_Events_Report.csv', data);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Toast */}
      {statusMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-800 flex items-center gap-3 text-xs animate-slide-up">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Administrative Console</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Campus Events Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish events, manage participant rosters, and monitor live attendance capacity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportAllEvents}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Report</span>
          </button>

          <Link
            to="/admin/events/new"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Event</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-400">Total Events</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{totalEvents}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Active in catalog</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-400">Total RSVPs</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{totalRegistrations}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Students registered</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-400">Seat Fill Rate</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{overallFillRate}%</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Avg across all venues</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-400">Categories</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{CATEGORIES.length - 1}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Activity streams</span>
        </div>
      </div>

      {/* Events Management Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4 p-6">
        {/* Table Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by event title, organizer, venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table Container */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden mt-2">
          {filteredEvents.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              No events found matching your search.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Event Info</th>
                    <th className="py-3.5 px-4">Date & Venue</th>
                    <th className="py-3.5 px-4">Registrations</th>
                    <th className="py-3.5 px-4">Deadline</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEvents.map((evt) => {
                    const attendees = getEventAttendees(evt.id);
                    const isExpired = isDeadlinePassed(evt.registrationDeadline);
                    const fillPercent = Math.min(Math.round((attendees.length / evt.maxParticipants) * 100), 100);

                    return (
                      <tr key={evt.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 line-clamp-1 max-w-[240px]">
                            <Link to={`/events/${evt.id}`} className="hover:text-indigo-600 transition">
                              {evt.name}
                            </Link>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <CategoryBadge category={evt.category} />
                            <span className="text-[10px] text-slate-400 truncate max-w-[150px]">
                              {evt.organizer}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-800">{formatDate(evt.date)}</div>
                          <div className="text-[11px] text-slate-500 truncate max-w-[150px]" title={evt.venue}>
                            📍 {evt.venue}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">
                            {attendees.length} / {evt.maxParticipants}
                          </div>
                          <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                            <div
                              className="h-full bg-indigo-600 rounded-full"
                              style={{ width: `${fillPercent}%` }}
                            />
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`text-[11px] font-semibold ${isExpired ? 'text-rose-600' : 'text-slate-700'}`}>
                            {formatDate(evt.registrationDeadline)}
                          </span>
                          <span className="block text-[10px] text-slate-400">
                            {isExpired ? 'Closed' : 'Active'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View Attendees */}
                            <button
                              onClick={() => setSelectedEventForAttendees(evt)}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold transition flex items-center gap-1"
                              title="View registered students roster"
                            >
                              <Users className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Roster ({attendees.length})</span>
                            </button>

                            {/* Edit */}
                            <Link
                              to={`/admin/events/edit/${evt.id}`}
                              className="p-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 rounded-lg transition"
                              title="Edit Event"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Link>

                            {/* Delete */}
                            <button
                              onClick={() => setEventToDelete(evt)}
                              className="p-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 rounded-lg transition"
                              title="Delete Event"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Attendees Roster Modal */}
      {selectedEventForAttendees && (
        <AttendeesModal
          isOpen={!!selectedEventForAttendees}
          onClose={() => setSelectedEventForAttendees(null)}
          event={selectedEventForAttendees}
          attendees={getEventAttendees(selectedEventForAttendees.id)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!eventToDelete}
        onClose={() => setEventToDelete(null)}
        title="Confirm Event Deletion"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <p>
              Are you sure you want to permanently delete{' '}
              <strong>"{eventToDelete?.name}"</strong>? All associated registrations and participant passes will be cancelled.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              onClick={() => setEventToDelete(null)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition shadow-sm"
            >
              Permanently Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
