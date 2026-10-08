import { queryGet } from '../../../database/dbConnection.js';

export const AdminModel = {
  findByEmail(email) {
    return queryGet('SELECT * FROM admins WHERE LOWER(email) = LOWER(?)', [email.trim()]);
  },

  findById(id) {
    return queryGet('SELECT id, fullName, email, designation, department FROM admins WHERE id = ?', [id]);
  }
};
