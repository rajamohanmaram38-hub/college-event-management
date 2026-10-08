import { Router } from 'express';
import { RegistrationController } from '../controllers/registrationController.js';

const router = Router();

router.get('/', RegistrationController.getAll);
router.get('/student/:studentId', RegistrationController.getByStudent);
router.get('/verify/:query', RegistrationController.verifyCertificate);
router.post('/', RegistrationController.register);
router.patch('/:id/status', RegistrationController.updateStatus);
router.delete('/:id', RegistrationController.cancel);

export default router;
