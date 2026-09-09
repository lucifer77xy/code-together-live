import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { authenticate } from '../middleware/auth.middleware';
import { AuthRequest } from '../types';
import { emitToDuo } from '../socket';

export const codingLogRouter = Router();

const logSchema = z.object({
  hoursStudied: z.number().positive(),
  problemsSolved: z.number().int().min(0).default(0),
  notes: z.string().optional(),
  summary: z.string().optional(),
  date: z.string().optional(),
});

codingLogRouter.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const duoId = req.user!.duoId;
    if (!duoId) return res.status(400).json({ success: false, message: 'Duo connection required' });
    const logs = await prisma.codingLog.findMany({
      where: { duoId },
      include: { user: { select: { id: true, name: true, avatar: true, username: true } } },
      orderBy: { date: 'desc' },
      take: 60,
    });
    res.json({ success: true, logs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

codingLogRouter.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const duoId = req.user!.duoId;
    if (!duoId) return res.status(400).json({ success: false, message: 'Duo connection required' });
    const validated = logSchema.parse(req.body);
    const dateStr = validated.date || new Date().toISOString().split('T')[0];
    const log = await prisma.codingLog.create({
      data: {
        duoId,
        userId: req.user!.id,
        date: dateStr,
        hoursStudied: validated.hoursStudied,
        problemsSolved: validated.problemsSolved,
        notes: validated.notes || null,
        summary: validated.summary || null,
      },
      include: { user: { select: { id: true, name: true, avatar: true } } },
    });
    await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        totalHours: { increment: validated.hoursStudied },
        totalProblems: { increment: validated.problemsSolved },
      },
    });
    await prisma.duo.update({
      where: { id: duoId },
      data: {
        coupleScore: { increment: Math.round(validated.hoursStudied * 15 + validated.problemsSolved * 10) },
      },
    });
    emitToDuo(duoId, 'codingLog:created', { log, author: req.user!.name });
    res.status(201).json({ success: true, log });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

codingLogRouter.get('/heatmap', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const duoId = req.user!.duoId;
    if (!duoId) return res.status(400).json({ success: false, message: 'Duo connection required' });
    const logs = await prisma.codingLog.findMany({
      where: { duoId },
      select: { date: true, hoursStudied: true, problemsSolved: true, userId: true },
    });
    const aggregated: Record<string, { date: string; hours: number; problems: number; count: number }> = {};
    logs.forEach(l => {
      if (!aggregated[l.date]) {
        aggregated[l.date] = { date: l.date, hours: 0, problems: 0, count: 0 };
      }
      aggregated[l.date].hours += l.hoursStudied;
      aggregated[l.date].problems += l.problemsSolved;
      aggregated[l.date].count += 1;
    });
    res.json({ success: true, data: Object.values(aggregated) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});
