import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Award,
  Search,
  CheckCircle2,
  XCircle,
  Download,
  Calendar,
  MapPin,
  User,
  Building,
  GraduationCap,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { apiClient } from '../api/apiClient';
import { formatDate } from '../utils/helpers';
import { generateCertificatePDF } from '../utils/pdfGenerator';

export function CertificateVerifyPage() {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const { registrations, events } = useEvents();
  const [searchInput, setSearchInput] = useState(initialId);
  const [verifyData, setVerifyData] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const performVerification = async (queryId) => {
    const q = (queryId || searchInput).trim();
    if (!q) return;

    setIsLoading(true);
    setNotFound(false);

    // 1. Try local context first
    const cleanCode = q.replace(/^CERT-APX-2026-/, '').replace(/^CAMPUS-/, '');
    const localReg = registrations.find(
      r => r.ticketCode === q ||
           r.ticketCode.includes(cleanCode) ||
           r.id === q
    );

    if (localReg) {
      const event = events.find(e => e.id === localReg.eventId) || localReg.event;
      setVerifyData({
        registration: localReg,
        event,
        credentialId: `CERT-APX-2026-${localReg.ticketCode.replace('CAMPUS-', '')}`,
        studentName: localReg.studentName,
        studentIdNumber: localReg.studentIdNumber,
        department: localReg.department,
        status: localReg.status,
        eventName: event?.name || 'College Event',
        eventCategory: event?.category || 'Academic',
        eventDate: event?.date,
        eventVenue: event?.venue,
        organizer: event?.organizer
      });
      setIsLoading(false);
      return;
    }

    // 2. Try backend API verification endpoint
    try {
      const res = await apiClient.verifyCertificate(q);
      if (res && res.verified && res.data) {
        setVerifyData({
          ...res.data,
          registration: {
            studentName: res.data.studentName,
            studentIdNumber: res.data.studentIdNumber,
            department: res.data.department,
            ticketCode: res.data.ticketCode
          },
          event: {
            name: res.data.eventName,
            category: res.data.eventCategory,
            date: res.data.eventDate,
            venue: res.data.eventVenue,
            organizer: res.data.organizer
          }
        });
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      performVerification(initialId);
    }
  }, [initialId]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200/80 rounded-full text-amber-800 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <span>Apex University Credential Registry</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Verify Certificate Authenticity
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Confirm the validity and authenticity of student event participation credentials issued by Apex Institute of Technology.
        </p>
      </div>

      {/* Verification Query Input */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          Enter Credential ID, Ticket Code, or Student Registration ID
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && performVerification()}
              placeholder="e.g. CERT-APX-2026-9A4B or CAMPUS-EVT1-9A4B"
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <button
            type="button"
            onClick={() => performVerification()}
            disabled={isLoading}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl shadow-md transition flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isLoading ? 'Verifying...' : 'Verify Credential'}</span>
          </button>
        </div>

        {/* Quick Sample Links */}
        {registrations.length > 0 && (
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold">Try sample credentials:</span>
            {registrations.slice(0, 3).map(r => (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  setSearchInput(r.ticketCode);
                  performVerification(r.ticketCode);
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg font-mono text-[11px] font-bold text-slate-700 transition"
              >
                {r.ticketCode} ({r.studentName})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Verification Result Card */}
      {verifyData && (
        <div className="bg-white rounded-3xl border-2 border-emerald-500 shadow-xl overflow-hidden animate-in fade-in duration-300">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm text-white flex items-center justify-center shadow-lg">
                <Award className="w-8 h-8 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black">Official Certificate Verified</h3>
                  <span className="bg-white text-emerald-800 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                    ACTIVE & VALID
                  </span>
                </div>
                <p className="text-xs text-emerald-100 mt-0.5">
                  Apex Institute of Technology • Division of Student Affairs
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right bg-black/20 p-3 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-emerald-200 block">Credential ID</span>
              <span className="font-mono text-sm font-black text-white">{verifyData.credentialId}</span>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recipient Card */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>Credential Recipient</span>
                </span>
                <div className="text-xl font-extrabold text-slate-900">
                  {verifyData.studentName}
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <div><strong>Student ID / Roll:</strong> <span className="font-mono font-bold text-slate-800">{verifyData.studentIdNumber || 'N/A'}</span></div>
                  <div><strong>Department:</strong> {verifyData.department}</div>
                  <div><strong>Accreditation Status:</strong> <span className="text-emerald-700 font-bold">Meritorious Participant</span></div>
                </div>
              </div>

              {/* Event Program Card */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Campus Event Program</span>
                </span>
                <div className="text-xl font-extrabold text-slate-900">
                  {verifyData.eventName}
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <div><strong>Category:</strong> {verifyData.eventCategory}</div>
                  <div><strong>Conducted On:</strong> {formatDate(verifyData.eventDate)}</div>
                  <div><strong>Venue:</strong> {verifyData.eventVenue}</div>
                  <div><strong>Organizer:</strong> {verifyData.organizer}</div>
                </div>
              </div>
            </div>

            {/* Official Certification Statement */}
            <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-xs text-amber-900 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Official University Attestation:</strong> This record certifies that the above-named student was officially registered and completed participation in the designated academic / co-curricular event at Apex Institute of Technology.
              </div>
            </div>

            {/* Download Button */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Link
                to="/events"
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
              >
                Browse All Events
              </Link>

              {verifyData.registration && verifyData.event && (
                <button
                  type="button"
                  onClick={() => generateCertificatePDF(verifyData.registration, verifyData.event)}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-600/30 transition flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Official PDF Certificate</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Not Found Alert */}
      {notFound && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <XCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-rose-900">
            No Matching Certificate Record Found
          </h3>
          <p className="text-xs text-rose-700 max-w-md mx-auto">
            We could not verify any certificate associated with <strong>"{searchInput}"</strong>. Please verify the credential code or contact the event administration office.
          </p>
        </div>
      )}
    </div>
  );
}
