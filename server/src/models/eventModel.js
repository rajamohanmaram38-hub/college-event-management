import { queryAll, queryGet, queryRun } from '../../../database/dbConnection.js';

function formatEvent(row) {
  if (!row) return null;
  let parsedAgenda = [];
  try {
    parsedAgenda = typeof row.agenda === 'string' ? JSON.parse(row.agenda) : (row.agenda || []);
  } catch {
    parsedAgenda = [];
  }
  return {
    ...row,
    featured: Boolean(row.featured),
    agenda: parsedAgenda
  };
}

export const EventModel = {
  findAll({ category, search } = {}) {
    let sql = 'SELECT * FROM events WHERE 1=1';
    const params = [];

    if (category && category !== 'all') {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (search && search.trim()) {
      sql += ' AND (name LIKE ? OR description LIKE ? OR organizer LIKE ? OR venue LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term);
    }

    sql += ' ORDER BY date ASC';

    const rows = queryAll(sql, params);
    return rows.map(formatEvent);
  },

  findById(id) {
    const row = queryGet('SELECT * FROM events WHERE id = ?', [id]);
    return formatEvent(row);
  },

  create(eventData) {
    const agendaJson = typeof eventData.agenda === 'object' ? JSON.stringify(eventData.agenda) : (eventData.agenda || '[]');
    const id = eventData.id || `evt-${Date.now()}`;
    const featuredVal = eventData.featured ? 1 : 0;
    const createdAt = eventData.createdAt || new Date().toISOString();

    queryRun(
      `INSERT INTO events (
        id, name, description, date, time, venue, organizer, category,
        registrationDeadline, maxParticipants, bannerUrl, prerequisites,
        agenda, contactEmail, featured, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        eventData.name,
        eventData.description,
        eventData.date,
        eventData.time,
        eventData.venue,
        eventData.organizer,
        eventData.category,
        eventData.registrationDeadline,
        Number(eventData.maxParticipants) || 100,
        eventData.bannerUrl,
        eventData.prerequisites || '',
        agendaJson,
        eventData.contactEmail,
        featuredVal,
        createdAt
      ]
    );

    return this.findById(id);
  },

  update(id, updates) {
    const current = this.findById(id);
    if (!current) return null;

    const merged = { ...current, ...updates };
    const agendaJson = typeof merged.agenda === 'object' ? JSON.stringify(merged.agenda) : (merged.agenda || '[]');
    const featuredVal = merged.featured ? 1 : 0;

    queryRun(
      `UPDATE events SET
        name = ?, description = ?, date = ?, time = ?, venue = ?, organizer = ?, category = ?,
        registrationDeadline = ?, maxParticipants = ?, bannerUrl = ?, prerequisites = ?,
        agenda = ?, contactEmail = ?, featured = ?
      WHERE id = ?`,
      [
        merged.name,
        merged.description,
        merged.date,
        merged.time,
        merged.venue,
        merged.organizer,
        merged.category,
        merged.registrationDeadline,
        Number(merged.maxParticipants) || 100,
        merged.bannerUrl,
        merged.prerequisites || '',
        agendaJson,
        merged.contactEmail,
        featuredVal,
        id
      ]
    );

    return this.findById(id);
  },

  delete(id) {
    const result = queryRun('DELETE FROM events WHERE id = ?', [id]);
    return result && result.changes > 0;
  },

  count() {
    const row = queryGet('SELECT COUNT(*) as count FROM events');
    return row ? row.count : 0;
  }
};
