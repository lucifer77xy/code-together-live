import { Router, Response } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { AuthRequest } from '../types';
import { generateAIAnalysis } from '../services/ai.service';
import { prisma } from '../config/prisma';

export const aiRouter = Router();

aiRouter.get('/insights', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const duoId = req.user!.duoId;
    if (!duoId) return res.status(400).json({ success: false, message: 'Duo connection required' });
    const recent = await prisma.analytics.findFirst({
      where: { duoId },
      orderBy: { generatedAt: 'desc' },
    });
    if (recent && recent.insightsJson) {
      try {
        const parsed = JSON.parse(recent.insightsJson);
        return res.json({ success: true, analysis: parsed, cachedAt: recent.generatedAt });
      } catch (e) {}
    }
    const fresh = await generateAIAnalysis(duoId, req.user!.id);
    res.json({ success: true, analysis: fresh });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

aiRouter.post('/refresh', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const duoId = req.user!.duoId;
    if (!duoId) return res.status(400).json({ success: false, message: 'Duo connection required' });
    const fresh = await generateAIAnalysis(duoId, req.user!.id);
    res.json({ success: true, analysis: fresh, message: 'AI insights regenerated with latest data' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});
