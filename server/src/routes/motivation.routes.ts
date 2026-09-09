import { Router, Request, Response } from 'express';
import { getTodayMotivation } from '../services/motivation.service';

export const motivationRouter = Router();

motivationRouter.get('/today', (req: Request, res: Response) => {
  const motivation = getTodayMotivation();
  res.json({ success: true, motivation });
});
