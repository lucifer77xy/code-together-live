import { Router, Response } from 'express';
import { prisma } from '../config/prisma';
import { authenticate } from '../middleware/auth.middleware';
import { AuthRequest } from '../types';

export const notificationRouter = Router();

notificationRouter.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const notifications = await prisma.notification.findMany({
      where: { recipientId: userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    const unreadCount = notifications.filter(n => !n.read).length;
    res.json({ success: true, notifications, unreadCount });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

notificationRouter.patch('/:id/read', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.notification.update({ where: { id }, data: { read: true } });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

notificationRouter.post('/read-all', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    await prisma.notification.updateMany({
      where: { recipientId: userId, read: false },
      data: { read: true },
    });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});
