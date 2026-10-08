import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  Calendar,
  Clock,
  MapPin,
  Printer,
  Download,
  Maximize2,
  AlertTriangle,
  CheckCircle2,
  Award
} from 'lucide-react';
import { CategoryBadge, StatusBadge } from '../common/Badge';
import { formatDate } from '../../utils/helpers';
import { Modal } from '../common/Modal';
import { generateTicketPDF } from '../../utils/pdfGenerator';
import { DigitalPassModal } from './DigitalPassModal';
import { CertificateModal } from './CertificateModal';

export function TicketCard({ registration, onCancel }) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const event = registration.event;

  const isAttended = registration.status === 'ATTENDED' || registration.status === 'CHECKED_IN' || (event && new Date(event.date) < new Date());

  if (!event) return null;

  const qrPayload = JSON.stringify({
    ticketCode: registration.ticketCode,
    event: event.name,
    student: registration.studentName,
    studentId: registration.studentIdNumber,
    department: registration.department,
    date: event.date,
    status: registration.status || 'CONFIRMED'
  });

  const handleDownloadPDF = () => {
    generateTicketPDF(registration, event);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-md hover:shadow-lg transition-shadow flex flex-col md:flex-row">
      {/* Left: Main Ticket Details */}
      <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                Official E-Pass
              </span>
              <CategoryBadge category={event.category} />
            </div>
            <StatusBadge status={registration.status || 'CONFIRMED'} />
          </div>

          {/* Event Title */}
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">
            <Link to={`/events/${event.id}`} className="hover:text-indigo-600 transition">
              {event.name}
            </Link>
          </h3>

          <p className="text-xs text-slate-500 mb-6">
            Organized by <span className="font-semibold text-slate-700">{event.organizer}</span>
          </p>

          {/* Key Event Coordinates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs mb-6">
            <div className="flex items-center gap-2.5 text-slate-700">
              <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <span className="block text-[10px] text-slate-400 font-semibold uppercase">Event Date</span>
                <span className="font-bold text-slate-800">{formatDate(event.date)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-slate-700">
              <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <span className="block text-[10px] text-slate-400 font-semibold uppercase">Session Timing</span>
                <span className="font-bold text-slate-800">{event.time}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-slate-700 sm:col-span-2">
              <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
              <div>
                <span className="block text-[10px] text-slate-400 font-semibold uppercase">Venue / Room</span>
                <span className="font-bold text-slate-800">{event.venue}</span>
              </div>
            </div>
          </div>

          {/* Student Pass Holder Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs border-t border-slate-100 pt-4">
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Pass Holder</span>
              <span className="font-bold text-slate-800">{registration.studentName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Student Roll / ID</span>
              <span className="font-bold text-slate-800">{registration.studentIdNumber || 'N/A'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Department</span>
              <span className="font-bold text-slate-800 truncate block">{registration.department}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-slate-100 mt-6">
          <div className="flex items-center gap-2">
            {/* Download PDF Button */}
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm"
              title="Download PDF Pass"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            {/* Print Pass Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
              title="Print Pass"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            {/* Fullscreen Pass Button */}
            <button
              type="button"
              onClick={() => setShowPassModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
              title="Enlarge QR Code"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Enlarge QR</span>
            </button>

            {/* Certificate of Participation Button */}
            <button
              type="button"
              onClick={() => setShowCertModal(true)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                isAttended
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 shadow-amber-500/30'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80'
              }`}
              title={isAttended ? 'Official Certificate Unlocked' : 'Preview Certificate of Participation'}
            >
              <Award className="w-3.5 h-3.5 text-amber-950" />
              <span>{isAttended ? '🎓 Certificate' : 'Preview Certificate'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowCancelModal(true)}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-xl transition"
          >
            Cancel RSVP
          </button>
        </div>
      </div>

      {/* Right / Tear-Off Stub: Live Scannable QR Code Section */}
      <div className="relative border-t md:border-t-0 md:border-l border-dashed border-slate-200 bg-slate-900 text-white p-6 md:p-8 flex flex-col items-center justify-center text-center w-full md:w-64 shrink-0">
        <div className="mb-2">
          <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold block mb-1">
            Gate Pass Check-In
          </span>
          <span className="text-xs font-mono bg-slate-800 text-indigo-200 px-3 py-1 rounded-full font-bold inline-block border border-slate-700">
            {registration.ticketCode}
          </span>
        </div>

        {/* Real Scannable QR Code Matrix */}
        <div
          onClick={() => setShowPassModal(true)}
          className="bg-white p-3 rounded-2xl shadow-inner my-2 cursor-pointer group hover:scale-105 transition-transform"
          title="Click to enlarge QR pass"
        >
          <div className="relative">
            <QRCodeSVG
              value={qrPayload}
              size={120}
              level="H"
              includeMargin={false}
              className="rounded"
            />
            <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/10 rounded transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 bg-slate-900/80 text-white text-[9px] font-bold px-2 py-1 rounded shadow">
                Enlarge
              </span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 max-w-[180px] leading-tight">
          Scan with any mobile camera or scanner for gate check-in.
        </p>

        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Verified Entry Token</span>
        </div>
      </div>

      {/* Digital Pass Modal */}
      <DigitalPassModal
        isOpen={showPassModal}
        onClose={() => setShowPassModal(false)}
        registration={registration}
        event={event}
      />

      {/* Cancellation Confirmation Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Confirm Registration Cancellation"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <p className="text-xs">
              Are you sure you want to cancel your seat for <strong className="font-semibold">{event.name}</strong>? Your spot will immediately be released to other students.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => setShowCancelModal(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Keep My Spot
            </button>
            <button
              onClick={() => {
                setShowCancelModal(false);
                if (onCancel) onCancel(registration.id);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition shadow-sm"
            >
              Confirm Cancellation
            </button>
          </div>
        </div>
      </Modal>

      {/* Official Certificate Preview & Download Modal */}
      <CertificateModal
        isOpen={showCertModal}
        onClose={() => setShowCertModal(false)}
        registration={registration}
        event={event}
      />
    </div>
  );
}
