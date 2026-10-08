import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer, CheckCircle2, ShieldCheck, Calendar, Clock, MapPin } from 'lucide-react';
import { Modal } from '../common/Modal';
import { formatDate } from '../../utils/helpers';
import { generateTicketPDF } from '../../utils/pdfGenerator';

export function DigitalPassModal({ isOpen, onClose, registration, event }) {
  if (!registration || !event) return null;

  // JSON string or URL payload for barcode scanners
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Digital Gate Pass & Scanner"
      maxWidth="max-w-lg"
    >
      <div className="space-y-6">
        {/* Pass Visual Card */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden text-center">
          {/* Subtle background glow */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-emerald-950 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Verified Entry Pass
            </span>
            <h4 className="text-lg sm:text-xl font-black mt-2 tracking-tight text-white line-clamp-1">
              {event.name}
            </h4>
            <p className="text-xs text-slate-400">
              {event.organizer}
            </p>
          </div>

          {/* QR Code Container with Scanner Laser Beam Effect */}
          <div className="relative inline-block my-2 p-4 bg-white rounded-2xl shadow-xl mx-auto border-4 border-slate-800">
            <QRCodeSVG
              value={qrPayload}
              size={180}
              level="H"
              includeMargin={false}
              className="rounded"
            />
            {/* Animated Laser Scanner Line */}
            <div
              className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent pointer-events-none animate-pulse"
              style={{
                top: '50%',
                boxShadow: '0 0 12px 2px rgba(99, 102, 241, 0.8)'
              }}
            />
          </div>

          {/* Ticket Code Tag */}
          <div className="mt-3">
            <span className="font-mono text-sm sm:text-base font-black px-4 py-1.5 bg-slate-800 text-indigo-300 rounded-xl inline-block border border-slate-700 tracking-wider">
              {registration.ticketCode}
            </span>
          </div>

          {/* Details Pill */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-3 text-left text-xs text-slate-300">
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Attendee</span>
              <span className="font-bold text-white truncate block">{registration.studentName}</span>
              <span className="text-[10px] text-slate-400">{registration.studentIdNumber}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Schedule</span>
              <span className="font-bold text-white block">{formatDate(event.date)}</span>
              <span className="text-[10px] text-slate-400 truncate block">{event.venue}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-indigo-200"
          >
            <Download className="w-4 h-4" />
            <span>Download Official PDF Pass</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print Pass Badge</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
