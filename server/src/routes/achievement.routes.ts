import { Router, Response } from 'express';
import { prisma } from '../config/prisma';
import { authenticate } from '../middleware/auth.middleware';
import { AuthRequest } from '../types';
import { BADGE_DEFINITIONS } from '../services/achievement.service';

export const achievementRouter = Router();

achievementRouter.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const userAchievements = await prisma.achievement.findMany({ where: { userId } });
    const unlockedMap = new Map(userAchievements.map(a => [a.badgeKey, a]));
    const badges = BADGE_DEFINITIONS.map(def => {
      const unlocked = unlockedMap.get(def.key);
      return {
        ...def,
        isUnlocked: Boolean(unlocked),
        unlockedAt: unlocked ? unlocked.unlockedAt : null,
      };
    });
    res.json({ success: true, badges });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});
