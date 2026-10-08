import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, RefreshCw, Heart } from 'lucide-react';
import { useEvents } from '../../context/EventContext';

export function Footer() {
  const { resetDemoData } = useEvents();

  const handleReset = () => {
    if (window.confirm('Reset all events and registrations back to default sample state?')) {
      resetDemoData();
      alert('Sample data has been reset to defaults.');
      window.location.reload();
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & College Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-base font-bold tracking-tight">
                Campus<span className="text-indigo-400">Pulse</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Official centralized event scheduling, registrations, and engagement portal for Apex Institute of Technology students and faculty.
            </p>
            <div className="pt-2 text-[11px] text-slate-500">
              Approved by the Directorate of Student Affairs & Campus Life.
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Explore Portal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-white transition">Home</Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-white transition">All Upcoming Events</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition">Student Dashboard</Link>
              </li>
              <li>
                <Link to="/my-registrations" className="hover:text-white transition">My Registrations & Passes</Link>
              </li>
              <li>
                <Link to="/scanner" className="hover:text-white transition">Gate Scanner Console</Link>
              </li>
              <li>
                <Link to="/verify" className="text-amber-400 hover:text-amber-300 font-bold transition">🎓 Verify Certificate</Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-white transition">Faculty & Admin Portal</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Event Categories */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Event Types
            </h4>
            <ul className="space-y-2">
              <li><span className="text-slate-400">Hackathons & Coding Jams</span></li>
              <li><span className="text-slate-400">Technical Workshops & Labs</span></li>
              <li><span className="text-slate-400">Cultural & Fine Arts Fests</span></li>
              <li><span className="text-slate-400">Intramural Sports Leagues</span></li>
              <li><span className="text-slate-400">Campus Placements & Expos</span></li>
            </ul>
          </div>

          {/* Col 4: Campus Contact & Data Tools */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Event Helpdesk
            </h4>
            <div className="space-y-2 text-slate-400 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Student Activity Center, Block D, Room 204</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>events-support@apex.college.edu</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>+1 (555) 234-EVENT (ext. 408)</span>
              </div>
            </div>

            <div className="pt-3">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold border border-slate-700 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Demo Sample Data</span>
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} Apex Institute of Technology. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            Built for seamless campus engagement
          </div>
        </div>
      </div>
    </footer>
  );
}
