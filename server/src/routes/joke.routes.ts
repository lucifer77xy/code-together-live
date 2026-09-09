import { Router, Request, Response } from 'express';
import { getRandomJoke } from '../services/joke.service';

export const jokeRouter = Router();

jokeRouter.get('/random', async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string | undefined;
    const joke = await getRandomJoke(category);
    res.json({ success: true, joke });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});
