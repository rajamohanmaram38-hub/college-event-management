import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Image,
  Plus,
  Trash2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../data/mockData';
import { EventCard } from '../components/events/EventCard';
import { ImageUploadDropzone } from '../components/common/ImageUploadDropzone';

const SAMPLE_BANNERS = [
  { label: 'Tech & Hackathon', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80' },
  { label: 'AI Workshop', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Cultural Fest', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Career Fair', url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Sports Arena', url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Keynote Lecture', url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80' }
];

export function AddEditEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addEvent, updateEvent, getEventById } = useEvents();
  const { currentUser, isAdmin } = useAuth();

  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Tech & Coding',
    description: '',
    date: '',
    time: '10:00 AM - 04:00 PM',
    venue: '',
    organizer: '',
    contactEmail: '',
    registrationDeadline: '',
    maxParticipants: 100,
    bannerUrl: SAMPLE_BANNERS[0].url,
    prerequisites: '',
    featured: false,
    agenda: [
      { time: '10:00 AM', title: 'Welcome & Registration' },
      { time: '11:00 AM', title: 'Main Session' },
      { time: '02:00 PM', title: 'Interactive Showcase & Closing' }
    ]
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const existing = getEventById(id);
      if (existing) {
        setFormData({
          ...existing,
          agenda: existing.agenda || []
        });
      } else {
        setErrorMsg('Event to edit was not found.');
      }
    }
  }, [id, isEditMode, getEventById]);

  if (!currentUser || !isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <ShieldCheck className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Admin Authentication Required</h2>
        <p className="text-xs text-slate-500">
          Only authorized administrators and faculty organizers can publish or modify college events.
        </p>
        <Link
          to="/admin/login"
          className="inline-block px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
        >
          Admin Login
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAgendaChange = (index, field, value) => {
    const updated = [...formData.agenda];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, agenda: updated }));
  };

  const addAgendaRow = () => {
    setFormData(prev => ({
      ...prev,
      agenda: [...prev.agenda, { time: '12:00 PM', title: 'New Agenda Session' }]
    }));
  };

  const removeAgendaRow = (index) => {
    setFormData(prev => ({
      ...prev,
      agenda: prev.agenda.filter((_, idx) => idx !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || !formData.date || !formData.venue.trim() || !formData.organizer.trim()) {
      setErrorMsg('Please complete all required fields (Name, Date, Venue, Organizer).');
      return;
    }

    if (formData.registrationDeadline && new Date(formData.registrationDeadline) > new Date(formData.date)) {
      setErrorMsg('Registration deadline cannot be after the event date.');
      return;
    }

    if (Number(formData.maxParticipants) <= 0) {
      setErrorMsg('Maximum participants must be at least 1.');
      return;
    }

    if (isEditMode) {
      const res = updateEvent(id, formData);
      if (res.success) {
        navigate('/admin/dashboard');
      } else {
        setErrorMsg(res.message);
      }
    } else {
      const res = addEvent(formData);
      if (res.success) {
        navigate('/admin/dashboard');
      } else {
        setErrorMsg(res.message);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Admin Dashboard</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {isEditMode ? 'Edit College Event' : 'Publish New College Event'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Provide comprehensive event details, scheduling, and capacity constraints for students.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition self-start sm:self-auto"
        >
          <Eye className="w-4 h-4 text-indigo-600" />
          <span>{showPreview ? 'Hide Preview' : 'Live Card Preview'}</span>
        </button>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Optional Live Preview Drawer */}
      {showPreview && (
        <div className="bg-slate-100 p-6 rounded-3xl border border-slate-200 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Preview in Student Catalog</span>
          </div>
          <div className="max-w-md mx-auto">
            <EventCard
              event={{
                ...formData,
                id: 'preview-id',
                maxParticipants: Number(formData.maxParticipants) || 100
              }}
            />
          </div>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md space-y-8">
        {/* Section 1: Basic Event Identity */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            1. Event Information & Category
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Event Name / Title *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Apex Annual Hackathon 2026"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Event Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Organizing Club / Department *
              </label>
              <input
                type="text"
                name="organizer"
                required
                value={formData.organizer}
                onChange={handleChange}
                placeholder="e.g. Google Developer Student Club (GDSC)"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Event Description *
            </label>
            <textarea
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Detail what students will learn, do, or experience during this event..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Section 2: Scheduling & Venue */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            2. Date, Time & Venue
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Event Date *
              </label>
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Time Window *
              </label>
              <input
                type="text"
                name="time"
                required
                value={formData.time}
                onChange={handleChange}
                placeholder="e.g. 10:00 AM - 04:00 PM"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Venue / Hall / Room *
              </label>
              <input
                type="text"
                name="venue"
                required
                value={formData.venue}
                onChange={handleChange}
                placeholder="e.g. Sir MV Auditorium, Block C"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Organizer Contact Email
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="events@apex.college.edu"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Registration Rules & Capacity */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            3. Registration Rules & Capacity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Registration Deadline *
              </label>
              <input
                type="date"
                name="registrationDeadline"
                required
                value={formData.registrationDeadline}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Maximum Participants Capacity *
              </label>
              <input
                type="number"
                name="maxParticipants"
                required
                min={1}
                value={formData.maxParticipants}
                onChange={handleChange}
                placeholder="100"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Prerequisites & Guidelines
            </label>
            <textarea
              name="prerequisites"
              rows={2}
              value={formData.prerequisites}
              onChange={handleChange}
              placeholder="e.g. Bring student RFID card and laptop with Python pre-installed..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
            <label htmlFor="featured" className="text-xs font-semibold text-slate-700 cursor-pointer">
              Spotlight as "Featured Event" on Homepage
            </label>
          </div>
        </div>

        {/* Section 4: Banner Image Upload (Firebase Cloud Storage & Themes) */}
        <div className="space-y-4">
          <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              4. Event Banner / Poster Image
            </h3>
            <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100/80 flex items-center gap-1">
              ☁️ Firebase Storage Integrated
            </span>
          </div>

          <ImageUploadDropzone
            currentUrl={formData.bannerUrl}
            onImageSelected={(url) => setFormData(prev => ({ ...prev, bannerUrl: url }))}
            presets={SAMPLE_BANNERS}
          />
        </div>

        {/* Section 5: Dynamic Agenda Sessions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-base font-bold text-slate-900">
              5. Schedule & Sessions Agenda (Optional)
            </h3>
            <button
              type="button"
              onClick={addAgendaRow}
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Session</span>
            </button>
          </div>

          <div className="space-y-3">
            {formData.agenda.map((slot, index) => (
              <div key={index} className="flex items-center gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <input
                  type="text"
                  placeholder="Time (e.g. 10:00 AM)"
                  value={slot.time}
                  onChange={(e) => handleAgendaChange(index, 'time', e.target.value)}
                  className="w-32 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Session Title"
                  value={slot.title}
                  onChange={(e) => handleAgendaChange(index, 'title', e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeAgendaRow(index)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
          <Link
            to="/admin/dashboard"
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isEditMode ? 'Save Event Changes' : 'Publish Event to Portal'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
