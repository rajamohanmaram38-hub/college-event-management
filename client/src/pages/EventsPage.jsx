import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Calendar, Search, XCircle } from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import { EventCard } from '../components/events/EventCard';
import { EventFilter } from '../components/events/EventFilter';
import { RegistrationConfirmModal } from '../components/registrations/RegistrationConfirmModal';
import { isDeadlinePassed } from '../utils/helpers';

export function EventsPage() {
  const { events, registerForEvent, getEventAttendees } = useEvents();
  const { currentUser, isStudent, quickLoginDemo } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState('date-asc');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');

  const [selectedEventForModal, setSelectedEventForModal] = useState(null);
  const [recentRegistration, setRecentRegistration] = useState(null);

  // Sync state if URL search params change
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    if (urlCategory) setSelectedCategory(urlCategory);
    const urlSearch = searchParams.get('search');
    if (urlSearch) setSearchQuery(urlSearch);
  }, [searchParams]);

  // Filtering & Sorting Logic
  const filteredEvents = events.filter((event) => {
    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = event.name.toLowerCase().includes(q);
      const matchDesc = event.description.toLowerCase().includes(q);
      const matchVenue = event.venue.toLowerCase().includes(q);
      const matchOrg = event.organizer.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchVenue && !matchOrg) return false;
    }

    // 2. Category Filter
    if (selectedCategory !== 'all' && event.category !== selectedCategory) {
      return false;
    }

    // 3. Availability Filter
    if (availabilityFilter === 'available') {
      const attendees = getEventAttendees(event.id);
      if (attendees.length >= event.maxParticipants) return false;
    } else if (availabilityFilter === 'open-deadline') {
      if (isDeadlinePassed(event.registrationDeadline)) return false;
    }

    return true;
  });

  // Sort
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortBy === 'date-asc') {
      return new Date(a.date) - new Date(b.date);
    }
    if (sortBy === 'date-desc') {
      return new Date(b.date) - new Date(a.date);
    }
    if (sortBy === 'name-asc') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'popularity') {
      const countA = getEventAttendees(a.id).length;
      const countB = getEventAttendees(b.id).length;
      return countB - countA;
    }
    return 0;
  });

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

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setAvailabilityFilter('all');
    setSortBy('date-asc');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title & Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
          <Calendar className="w-4 h-4" />
          <span>Campus Catalog</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          College Events & Schedules
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Discover all upcoming competitions, lectures, club gatherings, and tournaments.
        </p>
      </div>

      {/* Filter Component */}
      <EventFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
        availabilityFilter={availabilityFilter}
        setAvailabilityFilter={setAvailabilityFilter}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200">
        <div>
          Showing <strong className="text-slate-800">{sortedEvents.length}</strong> of{' '}
          <strong className="text-slate-800">{events.length}</strong> total events
        </div>

        {(searchQuery || selectedCategory !== 'all' || availabilityFilter !== 'all') && (
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1 font-semibold text-rose-600 hover:text-rose-700 transition"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Events Grid */}
      {sortedEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onRegisterClick={handleRegisterClick}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No events matched your criteria</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Try adjusting your search terms, changing the category, or clearing the availability filter.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            Clear All Filters
          </button>
        </div>
      )}

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
