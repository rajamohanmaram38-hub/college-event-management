import { queryAll, queryGet, queryRun } from '../../../database/dbConnection.js';

export const StudentModel = {
  findAll() {
    return queryAll('SELECT id, fullName, email, studentIdNumber, department, academicYear, registeredAt FROM students ORDER BY registeredAt DESC');
  },

  findById(id) {
    return queryGet('SELECT id, fullName, email, studentIdNumber, department, academicYear, registeredAt FROM students WHERE id = ?', [id]);
  },

  findByEmail(email) {
    return queryGet('SELECT * FROM students WHERE LOWER(email) = LOWER(?)', [email.trim()]);
  },

  create({ id, fullName, email, password, studentIdNumber, department, academicYear, registeredAt }) {
    queryRun(
      `INSERT INTO students (id, fullName, email, password, studentIdNumber, department, academicYear, registeredAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        fullName,
        email.trim().toLowerCase(),
        password,
        studentIdNumber,
        department,
        academicYear,
        registeredAt || new Date().toISOString()
      ]
    );
    return this.findById(id);
  },

  count() {
    const row = queryGet('SELECT COUNT(*) as count FROM students');
    return row ? row.count : 0;
  }
};
