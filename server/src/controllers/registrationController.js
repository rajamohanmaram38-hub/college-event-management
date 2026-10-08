import { RegistrationModel } from '../models/registrationModel.js';
import { EventModel } from '../models/eventModel.js';
import { StudentModel } from '../models/studentModel.js';

function generateTicketCode(eventId) {
  const cleanId = (eventId || 'EVT').replace('evt-', 'E').toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CAMPUS-${cleanId}-${rand}`;
}

export const RegistrationController = {
  // Get all registrations
  getAll(req, res, next) {
    try {
      const registrations = RegistrationModel.findAll();
      res.json({ success: true, data: registrations });
    } catch (err) {
      next(err);
    }
  },

  // Get student's registrations
  getByStudent(req, res, next) {
    try {
      const { studentId } = req.params;
      const registrations = RegistrationModel.findByStudentId(studentId);
      res.json({ success: true, data: registrations });
    } catch (err) {
      next(err);
    }
  },

  // Register for an event
  register(req, res, next) {
    try {
      const { eventId, student } = req.body;

      if (!eventId || !student || !student.id) {
        return res.status(400).json({ success: false, message: 'Event ID and Student details are required.' });
      }

      // 1. Verify Event existence
      const event = EventModel.findById(eventId);
      if (!event) {
        return res.status(404).json({ success: false, message: 'Event does not exist.' });
      }

      // 2. Check if already registered
      const existing = RegistrationModel.findExisting(eventId, student.id);
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'You have already registered for this event.',
          registration: existing
        });
      }

      // 3. Ensure student exists in database (e.g. Google-authenticated student)
      let studentRecord = StudentModel.findById(student.id);
      if (!studentRecord) {
        StudentModel.create({
          id: student.id,
          fullName: student.fullName || 'Student',
          email: student.email || `${student.id}@student.apex.edu`,
          password: 'external_auth_provider',
          studentIdNumber: student.studentIdNumber || 'APX-2026-G',
          department: student.department || 'General Studies',
          academicYear: student.academicYear || '3rd Year',
          registeredAt: new Date().toISOString()
        });
      }

      // 4. Check seat capacity
      const currentCount = RegistrationModel.countByEventId(eventId);
      if (currentCount >= event.maxParticipants) {
        return res.status(400).json({ success: false, message: 'Sorry, this event has reached maximum capacity.' });
      }

      // 5. Generate unique ticket and register
      const ticketCode = generateTicketCode(eventId);
      const newReg = RegistrationModel.create({
        id: `reg-${Date.now()}`,
        eventId,
        studentId: student.id,
        studentName: student.fullName,
        studentEmail: student.email,
        studentIdNumber: student.studentIdNumber || 'N/A',
        department: student.department || 'General',
        ticketCode,
        registeredAt: new Date().toISOString(),
        status: 'CONFIRMED'
      });

      res.status(201).json({
        success: true,
        message: 'Successfully registered! Your digital e-pass is ready.',
        data: {
          ...newReg,
          event
        }
      });
    } catch (err) {
      next(err);
    }
  },

  // Cancel registration
  cancel(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = RegistrationModel.delete(id);

      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Registration not found.' });
      }

      res.json({
        success: true,
        message: 'Registration successfully cancelled. Your seat has been released.'
      });
    } catch (err) {
      next(err);
    }
  },

  // Update registration status (e.g. ATTENDED, CHECKED_IN)
  updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updated = RegistrationModel.updateStatus(id, status || 'ATTENDED');
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Registration record not found.' });
      }

      res.json({
        success: true,
        message: `Registration status updated to ${status || 'ATTENDED'}.`,
        data: updated
      });
    } catch (err) {
      next(err);
    }
  },

  // Verify certificate credential by ticket code or ID
  verifyCertificate(req, res, next) {
    try {
      const { query } = req.params;
      let reg = RegistrationModel.findByTicketCode(query);
      if (!reg) {
        reg = RegistrationModel.findById(query);
      }

      if (!reg) {
        return res.status(404).json({
          success: false,
          verified: false,
          message: 'No credential found matching this identifier.'
        });
      }

      const event = EventModel.findById(reg.eventId);

      res.json({
        success: true,
        verified: true,
        data: {
          credentialId: `CERT-APX-2026-${(reg.ticketCode || reg.id).replace('CAMPUS-', '')}`,
          ticketCode: reg.ticketCode,
          studentName: reg.studentName,
          studentIdNumber: reg.studentIdNumber,
          department: reg.department,
          status: reg.status,
          eventName: event?.name || 'Campus Event',
          eventCategory: event?.category || 'Academic',
          eventDate: event?.date,
          eventVenue: event?.venue,
          organizer: event?.organizer,
          issuedAt: reg.registeredAt
        }
      });
    } catch (err) {
      next(err);
    }
  }
};
