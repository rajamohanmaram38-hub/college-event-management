import { EventModel } from '../models/eventModel.js';
import { RegistrationModel } from '../models/registrationModel.js';
import { StudentModel } from '../models/studentModel.js';

export const StatsController = {
  getOverview(req, res, next) {
    try {
      const totalEvents = EventModel.count();
      const totalRegistrations = RegistrationModel.count();
      const totalStudents = StudentModel.count();

      const events = EventModel.findAll();
      const today = new Date().toISOString().split('T')[0];
      const upcomingEvents = events.filter(e => e.date >= today).length;

      res.json({
        success: true,
        data: {
          totalEvents,
          totalRegistrations,
          totalStudents,
          upcomingEvents
        }
      });
    } catch (err) {
      next(err);
    }
  }
};
