import React, { useState } from 'react';
import { Search, Download, Users, Mail, Hash, Calendar, CheckCircle, Clock, QrCode, Award } from 'lucide-react';
import { Modal } from '../common/Modal';
import { exportToCSV, formatDate } from '../../utils/helpers';
import { StatusBadge } from '../common/Badge';
import { DigitalPassModal } from './DigitalPassModal';
import { CertificateModal } from './CertificateModal';
import { generateTicketPDF, generateCertificatePDF } from '../../utils/pdfGenerator';

export function AttendeesModal({ isOpen, onClose, event, attendees = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPass, setSelectedPass] = useState(null);
  const [selectedCert, setSelectedCert] = useState(null);

  if (!event) return null;

  const filteredAttendees = attendees.filter(att => {
    const q = searchTerm.toLowerCase();
    return (
      att.studentName.toLowerCase().includes(q) ||
      att.studentEmail.toLowerCase().includes(q) ||
      (att.studentIdNumber && att.studentIdNumber.toLowerCase().includes(q)) ||
      (att.department && att.department.toLowerCase().includes(q)) ||
      att.ticketCode.toLowerCase().includes(q)
    );
  });

  const handleExport = () => {
    const dataForExport = attendees.map(a => ({
      'Ticket Code': a.ticketCode,
      'Student Name': a.studentName,
      'Email Address': a.studentEmail,
      'Student ID': a.studentIdNumber,
      'Department': a.department,
      'Registered Timestamp': a.registeredAt,
      'Status': a.status
    }));
    exportToCSV(`${event.name.replace(/[^a-zA-Z0-9]/g, '_')}_Attendees.csv`, dataForExport);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Attendees Roster: ${event.name}`}
        maxWidth="max-w-4xl"
      >
        <div className="space-y-4">
          {/* Metric Summary Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-semibold block uppercase">Total Registered</span>
                <span className="text-lg font-bold text-slate-900">{attendees.length} / {event.maxParticipants}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-semibold block uppercase">Fill Rate</span>
                <span className="text-lg font-bold text-slate-900">
                  {Math.round((attendees.length / event.maxParticipants) * 100)}%
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-semibold block uppercase">Available Spots</span>
                <span className="text-lg font-bold text-slate-900">
                  {Math.max(event.maxParticipants - attendees.length, 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Search & Export Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by student name, roll number, or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <button
              onClick={handleExport}
              disabled={attendees.length === 0}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white rounded-xl text-xs font-semibold shadow-sm transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Roster (CSV)</span>
            </button>
          </div>

          {/* Attendees List / Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden mt-3">
            {filteredAttendees.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                {attendees.length === 0 ? 'No students have registered for this event yet.' : 'No attendees match your search query.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Student Details</th>
                      <th className="py-3 px-4">Student ID / Roll</th>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4">Ticket Code</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">E-Pass Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAttendees.map((att) => (
                      <tr key={att.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">{att.studentName}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span>{att.studentEmail}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono font-medium text-slate-800">
                          {att.studentIdNumber || 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-block max-w-[150px] truncate" title={att.department}>
                            {att.department}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-indigo-700 bg-indigo-50/50">
                          {att.ticketCode}
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={att.status || 'CONFIRMED'} />
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedPass({ registration: att, event })}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-[11px] transition"
                              title="View QR & Download PDF Pass"
                            >
                              <QrCode className="w-3 h-3" />
                              <span>Pass</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setSelectedCert({ registration: att, event })}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 font-bold text-[11px] transition"
                              title="Generate & View Certificate"
                            >
                              <Award className="w-3 h-3 text-amber-600" />
                              <span>Certificate</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Interactive Pass Modal for Selected Attendee */}
      {selectedPass && (
        <DigitalPassModal
          isOpen={Boolean(selectedPass)}
          onClose={() => setSelectedPass(null)}
          registration={selectedPass.registration}
          event={selectedPass.event}
        />
      )}

      {/* Certificate of Participation Modal */}
      {selectedCert && (
        <CertificateModal
          isOpen={Boolean(selectedCert)}
          onClose={() => setSelectedCert(null)}
          registration={selectedCert.registration}
          event={selectedCert.event}
        />
      )}
    </>
  );
}
