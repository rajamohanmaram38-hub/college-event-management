import { queryAll, queryGet, queryRun } from '../../../database/dbConnection.js';
import { EventModel } from './eventModel.js';

export const RegistrationModel = {
  findAll() {
    return queryAll('SELECT * FROM registrations ORDER BY registeredAt DESC');
  },

  findById(id) {
    return queryGet('SELECT * FROM registrations WHERE id = ?', [id]);
  },

  findByEventId(eventId) {
    return queryAll('SELECT * FROM registrations WHERE eventId = ? ORDER BY registeredAt ASC', [eventId]);
  },

  findByStudentId(studentId) {
    const registrations = queryAll('SELECT * FROM registrations WHERE studentId = ? ORDER BY registeredAt DESC', [studentId]);
    return registrations.map(reg => {
      const event = EventModel.findById(reg.eventId);
      return {
        ...reg,
        event
      };
    });
  },

  findExisting(eventId, studentId) {
    return queryGet('SELECT * FROM registrations WHERE eventId = ? AND studentId = ?', [eventId, studentId]);
  },

  countByEventId(eventId) {
    const row = queryGet("SELECT COUNT(*) as count FROM registrations WHERE eventId = ? AND status != 'CANCELLED'", [eventId]);
    return row ? row.count : 0;
  },

  create(regData) {
    const id = regData.id || `reg-${Date.now()}`;
    const registeredAt = regData.registeredAt || new Date().toISOString();
    const status = regData.status || 'CONFIRMED';

    queryRun(
      `INSERT INTO registrations (
        id, eventId, studentId, studentName, studentEmail,
        studentIdNumber, department, ticketCode, registeredAt, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        regData.eventId,
        regData.studentId,
        regData.studentName,
        regData.studentEmail,
        regData.studentIdNumber,
        regData.department,
        regData.ticketCode,
        registeredAt,
        status
      ]
    );

    return this.findById(id);
  },

  delete(id) {
    const result = queryRun('DELETE FROM registrations WHERE id = ?', [id]);
    return result && result.changes > 0;
  },

  updateStatus(id, status) {
    queryRun('UPDATE registrations SET status = ? WHERE id = ?', [status, id]);
    return this.findById(id);
  },

  findByTicketCode(ticketCode) {
    return queryGet('SELECT * FROM registrations WHERE ticketCode = ?', [ticketCode]);
  },

  count() {
    const row = queryGet("SELECT COUNT(*) as count FROM registrations WHERE status != 'CANCELLED'");
    return row ? row.count : 0;
  }
};
