import { Router } from 'express';
import { StatsController } from '../controllers/statsController.js';

const router = Router();

router.get('/overview', StatsController.getOverview);

export default router;
