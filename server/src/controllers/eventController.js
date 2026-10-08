import { EventModel } from '../models/eventModel.js';
import { RegistrationModel } from '../models/registrationModel.js';

export const EventController = {
  // Get all events with dynamic registration counts
  getAllEvents(req, res, next) {
    try {
      const { category, search } = req.query;
      const events = EventModel.findAll({ category, search });

      // Attach current registered count for real-time frontend seat status
      const enriched = events.map(evt => {
        const registeredCount = RegistrationModel.countByEventId(evt.id);
        return {
          ...evt,
          registeredCount,
          seatsLeft: Math.max(0, evt.maxParticipants - registeredCount)
        };
      });

      res.json({ success: true, data: enriched });
    } catch (err) {
      next(err);
    }
  },

  // Get single event by id
  getEventById(req, res, next) {
    try {
      const { id } = req.params;
      const event = EventModel.findById(id);

      if (!event) {
        return res.status(404).json({ success: false, message: 'Event not found.' });
      }

      const attendees = RegistrationModel.findByEventId(id);
      res.json({
        success: true,
        data: {
          ...event,
          registeredCount: attendees.length,
          seatsLeft: Math.max(0, event.maxParticipants - attendees.length),
          attendees
        }
      });
    } catch (err) {
      next(err);
    }
  },

  // Create new event
  createEvent(req, res, next) {
    try {
      const eventData = req.body;
      if (!eventData.name || !eventData.date || !eventData.category) {
        return res.status(400).json({ success: false, message: 'Event name, date, and category are required.' });
      }

      const created = EventModel.create(eventData);
      res.status(201).json({
        success: true,
        message: 'Event created successfully!',
        data: created
      });
    } catch (err) {
      next(err);
    }
  },

  // Update existing event
  updateEvent(req, res, next) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const updated = EventModel.update(id, updates);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Event not found.' });
      }

      res.json({
        success: true,
        message: 'Event updated successfully!',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  },

  // Delete event
  deleteEvent(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = EventModel.delete(id);

      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Event not found.' });
      }

      res.json({
        success: true,
        message: 'Event deleted successfully.'
      });
    } catch (err) {
      next(err);
    }
  },

  // Get attendees for a specific event
  getEventAttendees(req, res, next) {
    try {
      const { id } = req.params;
      const attendees = RegistrationModel.findByEventId(id);
      res.json({ success: true, data: attendees });
    } catch (err) {
      next(err);
    }
  }
};
