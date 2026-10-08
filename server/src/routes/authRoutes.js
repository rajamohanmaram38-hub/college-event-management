import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';

const router = Router();

router.post('/login/student', AuthController.loginStudent);
router.post('/register/student', AuthController.registerStudent);
router.post('/login/admin', AuthController.loginAdmin);
router.get('/students', AuthController.getAllStudents);

export default router;
