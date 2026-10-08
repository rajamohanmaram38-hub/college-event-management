import { jsPDF } from 'jspdf';
import { formatDate } from './helpers';

/**
 * Generates an official, beautifully styled PDF event pass and initiates download.
 * @param {Object} registration - The registration object with ticketCode, student details
 * @param {Object} event - The associated event object
 */
export function generateTicketPDF(registration, event) {
  if (!registration || !event) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a5' // A5 is standard for badges / passes (148 x 210 mm)
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const primaryColor = [79, 70, 229]; // Indigo-600
  const darkColor = [15, 23, 42];     // Slate-900
  const lightBg = [248, 250, 252];    // Slate-50
  const accentEmerald = [16, 185, 129]; // Emerald-500

  // 1. Top Decorative Header Banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('CAMPUSPULSE • OFFICIAL EVENT PASS', pageWidth / 2, 12, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Apex Institute of Technology • Division of Student Affairs', pageWidth / 2, 19, { align: 'center' });

  // 2. Ticket Code Capsule Box
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(12, 34, pageWidth - 24, 22, 3, 3, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(12, 34, pageWidth - 24, 22, 3, 3, 'D');

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('UNIQUE GATE PASS CODE', 18, 41);

  doc.setTextColor(...primaryColor);
  doc.setFont('courier', 'bold');
  doc.setFontSize(14);
  doc.text(registration.ticketCode || 'CAMPUS-PASS-000', 18, 50);

  // Status Pill
  doc.setFillColor(...accentEmerald);
  doc.roundedRect(pageWidth - 46, 39, 30, 8, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('CONFIRMED', pageWidth - 31, 44.5, { align: 'center' });

  // 3. Event Details Section
  let currentY = 64;

  doc.setTextColor(...darkColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  const eventTitleLines = doc.splitTextToSize(event.name, pageWidth - 24);
  doc.text(eventTitleLines, 12, currentY);
  currentY += eventTitleLines.length * 6 + 2;

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`Category: ${event.category}   |   Organized by: ${event.organizer}`, 12, currentY);
  currentY += 8;

  // Key Event Metrics Card
  doc.setFillColor(...lightBg);
  doc.roundedRect(12, currentY, pageWidth - 24, 32, 3, 3, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(12, currentY, pageWidth - 24, 32, 3, 3, 'D');

  // Date
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('EVENT DATE', 18, currentY + 8);
  doc.setTextColor(...darkColor);
  doc.setFontSize(9.5);
  doc.text(formatDate(event.date), 18, currentY + 14);

  // Time
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7.5);
  doc.text('SESSION TIME', pageWidth / 2 + 5, currentY + 8);
  doc.setTextColor(...darkColor);
  doc.setFontSize(9.5);
  doc.text(event.time || 'TBA', pageWidth / 2 + 5, currentY + 14);

  // Venue
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7.5);
  doc.text('VENUE / LOCATION', 18, currentY + 22);
  doc.setTextColor(...darkColor);
  doc.setFontSize(9);
  const venueLines = doc.splitTextToSize(event.venue, pageWidth - 36);
  doc.text(venueLines, 18, currentY + 28);

  currentY += 40;

  // 4. Pass Holder (Student) Information
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('PASS HOLDER INFORMATION', 12, currentY);
  currentY += 6;

  doc.setFillColor(255, 255, 255);
  doc.roundedRect(12, currentY, pageWidth - 24, 26, 3, 3, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(12, currentY, pageWidth - 24, 26, 3, 3, 'D');

  // Student Name
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7);
  doc.text('STUDENT NAME', 18, currentY + 7);
  doc.setTextColor(...darkColor);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.text(registration.studentName || 'Student', 18, currentY + 13);

  // Student Roll / ID
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('ROLL / STUDENT ID', pageWidth / 2 + 5, currentY + 7);
  doc.setTextColor(...darkColor);
  doc.setFontSize(9.5);
  doc.text(registration.studentIdNumber || 'N/A', pageWidth / 2 + 5, currentY + 13);

  // Department
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7);
  doc.text('DEPARTMENT', 18, currentY + 19);
  doc.setTextColor(...darkColor);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(registration.department || 'General', 18, currentY + 23.5);

  currentY += 34;

  // 5. Security & Verification Footer
  doc.setDrawColor(203, 213, 225);
  doc.setLineDashPattern([2, 2], 0);
  doc.line(12, currentY, pageWidth - 12, currentY);
  currentY += 6;

  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('INSTRUCTIONS & ENTRY POLICIES:', 12, currentY);
  currentY += 4;
  doc.text('1. Please carry your University RFID ID card along with this pass for validation.', 12, currentY);
  currentY += 3.5;
  doc.text('2. Pass is non-transferable and admits one student only.', 12, currentY);
  currentY += 3.5;
  doc.text(`3. Issued at: ${new Date().toLocaleDateString()} via CampusPulse Portal`, 12, currentY);

  // Save the PDF
  const safeFilename = `EPass-${registration.ticketCode || 'pass'}.pdf`;
  doc.save(safeFilename);
}

/**
 * Generates an official, prestigious Certificate of Participation PDF (Landscape A4)
 * @param {Object} registration - Student registration details
 * @param {Object} event - Event details
 */
export function generateCertificatePDF(registration, event) {
  if (!registration || !event) return;

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4' // 297 x 210 mm
  });

  const pageWidth = 297;
  const pageHeight = 210;

  const navyDark = [15, 23, 42];      // Slate-900 / Oxford Navy
  const navyRoyal = [30, 58, 138];    // Blue-900
  const goldPrimary = [202, 138, 4];  // Amber-600 / Metallic Gold
  const goldLight = [254, 240, 138];  // Soft Gold
  const slateMuted = [100, 116, 139]; // Slate-500
  const parchmentBg = [254, 253, 250]; // Soft Parchment

  // 1. Warm Parchment Background
  doc.setFillColor(...parchmentBg);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // 2. Double Architectural Borders
  // Outer Border: Thick Navy Frame
  doc.setDrawColor(...navyDark);
  doc.setLineWidth(2.5);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20, 'D');

  // Middle Border: Gold Pinstripe
  doc.setDrawColor(...goldPrimary);
  doc.setLineWidth(0.8);
  doc.rect(13, 13, pageWidth - 26, pageHeight - 26, 'D');

  // Inner Border: Subtle Fine Frame
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.rect(15, 15, pageWidth - 30, pageHeight - 30, 'D');

  // 3. Four Ornamental Gold Corner Accents (Diamond Rosettes)
  const drawCornerFlourish = (x, y) => {
    doc.setFillColor(...goldPrimary);
    doc.circle(x, y, 1.8, 'F');
    doc.setDrawColor(...goldPrimary);
    doc.setLineWidth(0.5);
    doc.line(x - 4, y, x + 4, y);
    doc.line(x, y - 4, x, y + 4);
  };
  drawCornerFlourish(13, 13);
  drawCornerFlourish(pageWidth - 13, 13);
  drawCornerFlourish(13, pageHeight - 13);
  drawCornerFlourish(pageWidth - 13, pageHeight - 13);

  // 4. University Header & Seal
  const crestX = pageWidth / 2;
  doc.setFillColor(...navyRoyal);
  doc.roundedRect(crestX - 8, 20, 16, 11, 2, 2, 'F');
  doc.setFillColor(...goldPrimary);
  doc.circle(crestX, 25.5, 3.2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('A', crestX, 26.5, { align: 'center' });

  // University Header Text
  doc.setTextColor(...navyDark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('APEX INSTITUTE OF TECHNOLOGY', pageWidth / 2, 36, { align: 'center' });

  doc.setTextColor(...goldPrimary);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('AUTONOMOUS INSTITUTION  •  NAAC "A++" ACCREDITED  •  CENTRE OF EXCELLENCE', pageWidth / 2, 40.5, { align: 'center' });

  doc.setTextColor(...slateMuted);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('DIVISION OF STUDENT AFFAIRS & CAMPUS LIFE', pageWidth / 2, 45, { align: 'center' });

  // Decorative Central Stars Divider
  doc.setTextColor(...goldPrimary);
  doc.setFontSize(9);
  doc.text('★    ★    ★', pageWidth / 2, 49.5, { align: 'center' });

  // 5. Certificate Main Title
  doc.setTextColor(...navyDark);
  doc.setFont('times', 'bold');
  doc.setFontSize(23);
  doc.text('CERTIFICATE OF PARTICIPATION', pageWidth / 2, 60, { align: 'center' });

  // Presentation Subtitle
  doc.setTextColor(...slateMuted);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('THIS CERTIFICATE IS PROUDLY PRESENTED TO', pageWidth / 2, 67, { align: 'center' });

  // 6. Student Recipient Name (Prominent & Distinguished)
  doc.setTextColor(...navyRoyal);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  const studentName = (registration.studentName || 'Student Participant').toUpperCase();
  doc.text(studentName, pageWidth / 2, 80, { align: 'center' });

  // Elegant Gold Underline with Diamond Center
  doc.setDrawColor(...goldPrimary);
  doc.setLineWidth(0.8);
  doc.line(crestX - 45, 83.5, crestX + 45, 83.5);
  doc.setFillColor(...goldPrimary);
  doc.circle(crestX, 83.5, 1.2, 'F');

  // Student Roll & Department
  doc.setTextColor(...slateMuted);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  const studentMeta = `Roll / ID: ${registration.studentIdNumber || 'APX-2026-N/A'}    |    Department: ${registration.department || 'General Engineering'}`;
  doc.text(studentMeta, pageWidth / 2, 90, { align: 'center' });

  // 7. Citation Body
  doc.setTextColor(...slateMuted);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.text('for active, meritorious, and commendable participation in the campus event', pageWidth / 2, 99, { align: 'center' });

  // Event Name
  doc.setTextColor(...navyDark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14.5);
  const eventTitle = `« ${event.name} »`;
  doc.text(eventTitle, pageWidth / 2, 107, { align: 'center' });

  // Event Context & Metadata
  doc.setTextColor(...slateMuted);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const eventDetailsLine = `Category: ${event.category}    •    Organized by: ${event.organizer}    •    Venue: ${event.venue}`;
  doc.text(eventDetailsLine, pageWidth / 2, 114, { align: 'center' });

  const eventDateLine = `Held on ${formatDate(event.date)} at Apex University Campus.`;
  doc.text(eventDateLine, pageWidth / 2, 119.5, { align: 'center' });

  // 8. Bottom Authentication Block (Signatures & Gold Seal)
  const bottomY = 158;

  // --- Left Signature: Faculty Coordinator ---
  doc.setDrawColor(29, 78, 216);
  doc.setLineWidth(0.7);
  doc.line(38, bottomY - 6, 48, bottomY - 9);
  doc.line(48, bottomY - 9, 60, bottomY - 5);
  doc.line(60, bottomY - 5, 75, bottomY - 10);
  doc.line(75, bottomY - 10, 85, bottomY - 7);

  doc.setDrawColor(...slateMuted);
  doc.setLineWidth(0.4);
  doc.line(32, bottomY, 92, bottomY);

  doc.setTextColor(...navyDark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('Prof. Marcus Vance', 62, bottomY + 5, { align: 'center' });
  doc.setTextColor(...slateMuted);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('Faculty Event Coordinator', 62, bottomY + 9, { align: 'center' });

  // --- Center: Prestigious Gold Medallion Seal ---
  const sealX = pageWidth / 2;
  const sealY = bottomY - 4;

  doc.setFillColor(...goldPrimary);
  doc.circle(sealX, sealY, 15, 'F');

  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.6);
  doc.circle(sealX, sealY, 13.5, 'D');

  doc.setFillColor(...navyDark);
  doc.circle(sealX, sealY, 12, 'F');

  doc.setTextColor(...goldLight);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.5);
  doc.text('APEX INSTITUTE', sealX, sealY - 4.5, { align: 'center' });
  doc.setFontSize(8);
  doc.text('★ ★ ★', sealX, sealY - 0.5, { align: 'center' });
  doc.setFontSize(5.5);
  doc.text('OFFICIAL SEAL', sealX, sealY + 3.5, { align: 'center' });
  doc.setFontSize(4.5);
  doc.text('2026', sealX, sealY + 7, { align: 'center' });

  // Ribbon Tails
  doc.setFillColor(...goldPrimary);
  doc.triangle(sealX - 8, sealY + 12, sealX - 3, sealY + 12, sealX - 7, sealY + 22, 'F');
  doc.triangle(sealX + 8, sealY + 12, sealX + 3, sealY + 12, sealX + 7, sealY + 22, 'F');

  // --- Right Signature: Dean of Academic Affairs ---
  doc.setDrawColor(29, 78, 216);
  doc.setLineWidth(0.7);
  doc.line(212, bottomY - 8, 225, bottomY - 5);
  doc.line(225, bottomY - 5, 238, bottomY - 11);
  doc.line(238, bottomY - 11, 252, bottomY - 6);
  doc.line(252, bottomY - 6, 265, bottomY - 8);

  doc.setDrawColor(...slateMuted);
  doc.setLineWidth(0.4);
  doc.line(205, bottomY, 265, bottomY);

  doc.setTextColor(...navyDark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('Dr. Evelyn Reed', 235, bottomY + 5, { align: 'center' });
  doc.setTextColor(...slateMuted);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('Dean of Academic Affairs', 235, bottomY + 9, { align: 'center' });

  // 9. Security Credential Bar (Footer)
  const credentialCode = `CERT-APX-2026-${(registration.ticketCode || registration.id).replace('CAMPUS-', '')}`;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(16, pageHeight - 20, pageWidth - 16, pageHeight - 20);

  doc.setTextColor(...slateMuted);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.text(`VERIFIABLE CREDENTIAL ID: ${credentialCode}`, 20, pageHeight - 16);
  doc.text(`ISSUED ON: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`, pageWidth / 2, pageHeight - 16, { align: 'center' });
  doc.text('VERIFY AUTHENTICITY VIA CAMPUSPULSE /VERIFY', pageWidth - 20, pageHeight - 16, { align: 'right' });

  // Save the Certificate
  const safeFilename = `Certificate-${(registration.studentName || 'Student').replace(/\s+/g, '_')}-${event.name.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20)}.pdf`;
  doc.save(safeFilename);
}
