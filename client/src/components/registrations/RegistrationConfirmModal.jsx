import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Calendar, MapPin, Ticket, Clock, ArrowRight, Download } from 'lucide-react';
import { Modal } from '../common/Modal';
import { formatDate } from '../../utils/helpers';
import { CategoryBadge } from '../common/Badge';
import { generateTicketPDF } from '../../utils/pdfGenerator';

export function RegistrationConfirmModal({ isOpen, onClose, registration, event }) {
  if (!registration || !event) return null;

  const handleDownloadPDF = () => {
    generateTicketPDF(registration, event);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registration Confirmed! 🎉"
      maxWidth="max-w-md"
    >
      <div className="space-y-5 text-center">
        {/* Success Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <h4 className="text-lg font-bold text-slate-900 mb-1">
            You are officially registered!
          </h4>
          <p className="text-xs text-slate-500">
            A seat has been reserved under your name. Your e-ticket has been added to your dashboard.
          </p>
        </div>

        {/* Card details */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
              Pass ID: {registration.ticketCode}
            </span>
            <CategoryBadge category={event.category} />
          </div>

          <h5 className="font-bold text-slate-900 text-sm">
            {event.name}
          </h5>

          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          </div>
        </div>

        {/* Quick Instant PDF Download Option */}
        <button
          type="button"
          onClick={handleDownloadPDF}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-sm"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Download PDF Gate Pass</span>
        </button>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition"
          >
            Continue Browsing
          </button>
          
          <Link
            to="/my-registrations"
            onClick={onClose}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-sm"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>View All Passes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </Modal>
  );
}
