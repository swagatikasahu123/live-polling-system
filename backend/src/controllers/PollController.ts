import { Request, Response } from 'express';
import { pollService } from '../services/PollService';

export class PollController {
  async getActivePoll(req: Request, res: Response) {
    try {
      const state = await pollService.getPollState();
      res.json({ success: true, data: state });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  async getPollHistory(req: Request, res: Response) {
    try {
      const polls = await pollService.getPollHistory();
      res.json({ success: true, data: polls });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
}

export const pollController = new PollController();
