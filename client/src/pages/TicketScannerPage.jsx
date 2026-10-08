import React, { useState } from 'react';
import {
  QrCode,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  User,
  Hash,
  Download,
  Award
} from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { formatDate } from '../utils/helpers';
import { generateTicketPDF } from '../utils/pdfGenerator';
import { CertificateModal } from '../components/registrations/CertificateModal';

export function TicketScannerPage() {
  const { registrations, events, updateRegistrationStatus } = useEvents();
  const [ticketInput, setTicketInput] = useState('');
  const [scannedResult, setScannedResult] = useState(null);
  const [admittedList, setAdmittedList] = useState(new Set());
  const [searchHistory, setSearchHistory] = useState([]);
  const [showCertModal, setShowCertModal] = useState(false);

  const handleVerify = (codeToVerify) => {
    const code = (codeToVerify || ticketInput).trim().toUpperCase();
    if (!code) return;

    // Search registration by ticket code
    const reg = registrations.find(r => r.ticketCode.toUpperCase() === code);

    if (reg) {
      const event = events.find(e => e.id === reg.eventId) || reg.event;
      const isAlreadyAdmitted = reg.status === 'ATTENDED' || reg.status === 'CHECKED_IN' || admittedList.has(reg.id);

      const result = {
        valid: true,
        registration: reg,
        event,
        alreadyAdmitted: isAlreadyAdmitted
      };
      setScannedResult(result);
      setSearchHistory(prev => [result, ...prev.filter(item => item.registration.id !== reg.id)].slice(0, 5));
    } else {
      setScannedResult({
        valid: false,
        code
      });
    }
  };

  const handleAdmit = async () => {
    if (scannedResult && scannedResult.valid) {
      await updateRegistrationStatus(scannedResult.registration.id, 'ATTENDED');
      setAdmittedList(prev => new Set(prev).add(scannedResult.registration.id));
      setScannedResult(prev => ({
        ...prev,
        alreadyAdmitted: true,
        admittedAt: new Date().toLocaleTimeString(),
        registration: { ...prev.registration, status: 'ATTENDED' }
      }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
            <QrCode className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Gate Pass Verification Scanner
            </h1>
            <p className="text-xs text-slate-500">
              Verify attendee credentials, scan QR codes, and admit students at the entrance.
            </p>
          </div>
        </div>

        {/* Live Admitted KPI Counter */}
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Checked In: {admittedList.size} Students</span>
        </div>
      </div>

      {/* Verification Search Bar */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          Enter or Scan Ticket Code
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={ticketInput}
              onChange={(e) => setTicketInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
              placeholder="e.g. CAMPUS-EVT1-9A4B"
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono font-bold text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <button
            type="button"
            onClick={() => handleVerify()}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-xs font-bold rounded-2xl shadow-md transition flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verify Ticket</span>
          </button>
        </div>

        {/* Quick Sample Code Chips */}
        {registrations.length > 0 && (
          <div className="pt-2">
            <span className="text-[11px] text-slate-400 font-semibold block mb-1.5">
              Quick Test with Sample Registered Passes:
            </span>
            <div className="flex flex-wrap gap-2">
              {registrations.slice(0, 4).map(reg => (
                <button
                  key={reg.id}
                  type="button"
                  onClick={() => {
                    setTicketInput(reg.ticketCode);
                    handleVerify(reg.ticketCode);
                  }}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 rounded-lg text-[11px] font-mono font-bold text-slate-700 transition"
                >
                  {reg.ticketCode} ({reg.studentName})
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Verification Result Card */}
      {scannedResult && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {scannedResult.valid ? (
            <div className="bg-white rounded-3xl border-2 border-emerald-500 overflow-hidden shadow-xl p-6 sm:p-8 space-y-6">
              {/* Header Status */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <span>Valid Admission Pass</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                        VERIFIED
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Ticket verified against university registration registry.
                    </p>
                  </div>
                </div>

                <span className="font-mono text-sm font-black px-3.5 py-1.5 bg-slate-900 text-indigo-300 rounded-xl">
                  {scannedResult.registration.ticketCode}
                </span>
              </div>

              {/* Event & Student Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Student Profile Card */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">
                    Student Attendee
                  </span>
                  <div className="font-bold text-base text-slate-900">
                    {scannedResult.registration.studentName}
                  </div>
                  <div className="text-slate-600 space-y-1">
                    <div><strong>ID / Roll:</strong> {scannedResult.registration.studentIdNumber || 'N/A'}</div>
                    <div><strong>Department:</strong> {scannedResult.registration.department}</div>
                    <div><strong>Email:</strong> {scannedResult.registration.studentEmail}</div>
                  </div>
                </div>

                {/* Event Schedule Card */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">
                    Registered Session
                  </span>
                  <div className="font-bold text-base text-slate-900 line-clamp-1">
                    {scannedResult.event?.name}
                  </div>
                  <div className="text-slate-600 space-y-1">
                    <div><strong>Date:</strong> {formatDate(scannedResult.event?.date)}</div>
                    <div><strong>Time:</strong> {scannedResult.event?.time}</div>
                    <div><strong>Venue:</strong> {scannedResult.event?.venue}</div>
                  </div>
                </div>
              </div>

              {/* Admission Decision Action */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => generateTicketPDF(scannedResult.registration, scannedResult.event)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF Copy</span>
                  </button>
                </div>

                {scannedResult.alreadyAdmitted ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2 px-3.5 py-2 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Admitted Into Venue</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowCertModal(true)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 rounded-xl text-xs font-black shadow-md shadow-amber-500/20 transition active:scale-[0.98]"
                    >
                      <Award className="w-4 h-4 text-slate-950" />
                      <span>🎓 Issue & View Certificate</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleAdmit}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark as Admitted / Enter Gate</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto font-bold">
                <XCircle className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-rose-900">
                Invalid or Unregistered Ticket Code
              </h3>
              <p className="text-xs text-rose-700 max-w-md mx-auto">
                No active registration record was found matching ticket code <strong>"{scannedResult.code}"</strong>. Please verify the code or check student registration.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Certificate Modal */}
      {scannedResult?.valid && (
        <CertificateModal
          isOpen={showCertModal}
          onClose={() => setShowCertModal(false)}
          registration={scannedResult.registration}
          event={scannedResult.event}
        />
      )}
    </div>
  );
}
