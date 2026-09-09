import { Router, Response } from 'express';
import { prisma } from '../config/prisma';
import { authenticate } from '../middleware/auth.middleware';
import { AuthRequest } from '../types';

export const analyticsRouter = Router();

analyticsRouter.get('/dashboard', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const duoId = req.user!.duoId;
    if (!duoId) return res.status(400).json({ success: false, message: 'Duo connection required' });
    const duo = await prisma.duo.findUnique({
      where: { id: duoId },
      include: { partner1: true, partner2: true },
    });
    if (!duo) return res.status(404).json({ success: false, message: 'Duo not found' });

    const tasks = await prisma.task.findMany({ where: { duoId } });
    const logs = await prisma.codingLog.findMany({ where: { duoId } });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
    const productivityPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const totalCodingHours = logs.reduce((sum, l) => sum + l.hoursStudied, 0);

    const p1Hours = logs.filter(l => l.userId === duo.partner1Id).reduce((s, l) => s + l.hoursStudied, 0);
    const p2Hours = duo.partner2Id ? logs.filter(l => l.userId === duo.partner2Id).reduce((s, l) => s + l.hoursStudied, 0) : 0;
    const p1Tasks = tasks.filter(t => t.creatorId === duo.partner1Id && t.status === 'COMPLETED').length;
    const p2Tasks = duo.partner2Id ? tasks.filter(t => t.creatorId === duo.partner2Id && t.status === 'COMPLETED').length : 0;

    const daysMap: Record<string, any> = {};
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      daysMap[key] = {
        date: key,
        day: dayName,
        p1Hours: 0,
        p2Hours: 0,
        totalHours: 0,
        tasksCompleted: 0,
      };
    }

    logs.forEach(l => {
      if (daysMap[l.date]) {
        if (l.userId === duo.partner1Id) daysMap[l.date].p1Hours += l.hoursStudied;
        else if (l.userId === duo.partner2Id) daysMap[l.date].p2Hours += l.hoursStudied;
        daysMap[l.date].totalHours += l.hoursStudied;
      }
    });

    tasks.filter(t => t.status === 'COMPLETED' && t.completedAt).forEach(t => {
      const key = t.completedAt!.toISOString().split('T')[0];
      if (daysMap[key]) daysMap[key].tasksCompleted++;
    });

    const categoryCounts: Record<string, number> = {};
    tasks.forEach(t => { categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1; });
    const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));

    res.json({
      success: true,
      stats: {
        totalTasksCompleted: completedTasks,
        totalTasks,
        productivityPercentage,
        currentStreak: duo.streakDays,
        totalCodingHours: Number(totalCodingHours.toFixed(1)),
        coupleScore: duo.coupleScore,
      },
      partnerCards: {
        partner1: {
          id: duo.partner1.id,
          name: duo.partner1.name,
          username: duo.partner1.username,
          avatar: duo.partner1.avatar,
          tasksCompleted: p1Tasks,
          codingTime: Number(p1Hours.toFixed(1)),
          streak: duo.partner1.streakDays,
        },
        partner2: duo.partner2 ? {
          id: duo.partner2.id,
          name: duo.partner2.name,
          username: duo.partner2.username,
          avatar: duo.partner2.avatar,
          tasksCompleted: p2Tasks,
          codingTime: Number(p2Hours.toFixed(1)),
          streak: duo.partner2.streakDays,
        } : null,
      },
      charts: {
        weeklyTrend: Object.values(daysMap),
        categoryDistribution: categoryData,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});
