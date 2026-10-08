import { Router } from 'express';
import { EventController } from '../controllers/eventController.js';

const router = Router();

router.get('/', EventController.getAllEvents);
router.get('/:id', EventController.getEventById);
router.post('/', EventController.createEvent);
router.put('/:id', EventController.updateEvent);
router.delete('/:id', EventController.deleteEvent);
router.get('/:id/attendees', EventController.getEventAttendees);

export default router;
