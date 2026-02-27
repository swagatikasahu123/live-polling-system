import { Router } from 'express';
import { pollController } from '../controllers/PollController';

const router = Router();

router.get('/poll/active', (req, res) => pollController.getActivePoll(req, res));
router.get('/poll/history', (req, res) => pollController.getPollHistory(req, res));

export default router;
