import React, { useState } from 'react';
import {
  Award,
  Download,
  Printer,
  Copy,
  Check,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  X
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { formatDate } from '../../utils/helpers';
import { generateCertificatePDF } from '../../utils/pdfGenerator';

export function CertificateModal({ isOpen, onClose, registration, event }) {
  const [copied, setCopied] = useState(false);

  if (!registration || !event) return null;

  const credentialId = `CERT-APX-2026-${(registration.ticketCode || registration.id).replace('CAMPUS-', '')}`;
  const verifyUrl = `${window.location.origin}/verify?id=${registration.ticketCode || registration.id}`;

  const handleDownload = () => {
    generateCertificatePDF(registration, event);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official Certificate of Participation"
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Certificate Decorative Frame (Responsive On-Screen Preview) */}
        <div className="relative bg-[#fdfcf9] border-4 border-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden text-center select-none">
          {/* Inner Golden Border */}
          <div className="absolute inset-2 border-2 border-amber-600/60 rounded-2xl pointer-events-none" />
          <div className="absolute inset-3 border border-slate-200/80 rounded-xl pointer-events-none" />

          {/* Corner Flourish Motifs */}
          <div className="absolute top-4 left-4 w-3 h-3 bg-amber-600 rotate-45" />
          <div className="absolute top-4 right-4 w-3 h-3 bg-amber-600 rotate-45" />
          <div className="absolute bottom-4 left-4 w-3 h-3 bg-amber-600 rotate-45" />
          <div className="absolute bottom-4 right-4 w-3 h-3 bg-amber-600 rotate-45" />

          {/* University Seal Crest */}
          <div className="flex flex-col items-center justify-center space-y-1 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-900 text-amber-400 flex items-center justify-center font-bold text-xl shadow-md border-2 border-amber-500/50">
              A
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-wider uppercase mt-1">
              Apex Institute of Technology
            </h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700">
              Autonomous Institution • NAAC 'A++' Accredited • Centre of Excellence
            </p>
            <p className="text-[11px] text-slate-500 font-medium">
              Division of Student Affairs & Academic Life
            </p>
            <div className="text-amber-500 text-xs tracking-widest pt-1">
              ★ &nbsp; ★ &nbsp; ★
            </div>
          </div>

          {/* Certificate Main Title */}
          <div className="my-4">
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-wide uppercase">
              Certificate of Participation
            </h2>
            <p className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
              This is proudly conferred upon
            </p>
          </div>

          {/* Student Recipient Name */}
          <div className="my-5">
            <div className="text-2xl sm:text-4xl font-extrabold text-indigo-950 uppercase tracking-tight">
              {registration.studentName || 'Student Attendee'}
            </div>
            <div className="w-48 sm:w-64 h-0.5 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto my-2" />
            <p className="text-xs sm:text-sm font-semibold text-slate-600">
              Roll / ID: <span className="font-mono font-bold text-slate-900">{registration.studentIdNumber || 'APX-2026-N/A'}</span>
              {' '} • {' '}
              Department: <span className="font-bold text-slate-900">{registration.department || 'General Studies'}</span>
            </p>
          </div>

          {/* Citation Body */}
          <div className="max-w-2xl mx-auto my-4 space-y-2">
            <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed">
              for active, meritorious, and commendable participation in the campus event
            </p>
            <h4 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              « {event.name} »
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
              Category: <strong className="text-slate-700">{event.category}</strong> • Organized by <strong className="text-slate-700">{event.organizer}</strong> • Held on <strong className="text-slate-700">{formatDate(event.date)}</strong>
            </p>
          </div>

          {/* Authentication & Signatures Grid */}
          <div className="grid grid-cols-3 items-end pt-8 mt-6 border-t border-slate-200/80">
            {/* Left: Coordinator */}
            <div className="text-center space-y-1">
              <div className="font-serif italic text-base sm:text-lg text-blue-800 -mb-1 select-none">
                Marcus Vance
              </div>
              <div className="w-24 sm:w-36 h-px bg-slate-400 mx-auto" />
              <div className="text-xs font-bold text-slate-900">Prof. Marcus Vance</div>
              <div className="text-[10px] text-slate-500">Faculty Coordinator</div>
            </div>

            {/* Center: Gold Medallion Ribbon Seal */}
            <div className="flex flex-col items-center justify-center -mt-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 p-1 shadow-lg shadow-amber-500/30 flex items-center justify-center border-2 border-white">
                <div className="w-full h-full rounded-full border border-amber-200/80 flex flex-col items-center justify-center text-center p-1">
                  <span className="text-[8px] font-black uppercase tracking-tighter text-amber-950">Apex Seal</span>
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-amber-950 my-0.5" />
                  <span className="text-[7px] font-bold text-amber-950">2026</span>
                </div>
              </div>
              <span className="text-[9px] font-bold text-amber-800 uppercase tracking-wider mt-1">
                Verified Credential
              </span>
            </div>

            {/* Right: Dean */}
            <div className="text-center space-y-1">
              <div className="font-serif italic text-base sm:text-lg text-blue-800 -mb-1 select-none">
                Evelyn Reed
              </div>
              <div className="w-24 sm:w-36 h-px bg-slate-400 mx-auto" />
              <div className="text-xs font-bold text-slate-900">Dr. Evelyn Reed</div>
              <div className="text-[10px] text-slate-500">Dean of Academic Affairs</div>
            </div>
          </div>

          {/* Security Credential Footer */}
          <div className="pt-6 mt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-400 gap-2">
            <span>CREDENTIAL ID: <strong className="font-mono text-slate-600">{credentialId}</strong></span>
            <span>ISSUED VIA CAMPUSPULSE DIRECTORY</span>
            <span className="flex items-center gap-1 text-emerald-600 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              VERIFIED AUTHENTIC
            </span>
          </div>
        </div>

        {/* Action Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Link Copied!' : 'Copy Verification URL'}</span>
            </button>

            <a
              href={`/verify?id=${registration.ticketCode || registration.id}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2.5 text-slate-500 hover:text-indigo-600 text-xs font-semibold transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Verify Online</span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-black rounded-xl shadow-lg shadow-amber-600/30 transition active:scale-[0.98]"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Certificate</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
