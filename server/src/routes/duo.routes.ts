import { Router, Response } from 'express';
import { prisma } from '../config/prisma';
import { authenticate } from '../middleware/auth.middleware';
import { AuthRequest } from '../types';
import { emitToDuo } from '../socket';

export const duoRouter = Router();

duoRouter.post('/invite', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    let existingDuo = await prisma.duo.findFirst({
      where: {
        OR: [{ partner1Id: userId }, { partner2Id: userId }],
        status: 'ACTIVE',
      },
    });
    let code: string;
    if (existingDuo) {
      code = existingDuo.code;
    } else {
      code = Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 5);
      existingDuo = await prisma.duo.create({
        data: { code, partner1Id: userId, status: 'PENDING' },
      });
    }
    const inviteLink = (process.env.FRONTEND_URL || 'http://localhost:3000') + '/invite/' + code;
    res.json({ success: true, code, inviteLink, duoId: existingDuo.id });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

duoRouter.get('/invite/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const duo = await prisma.duo.findUnique({
      where: { code },
      include: {
        partner1: { select: { id: true, name: true, username: true, avatar: true, bio: true } },
        partner2: { select: { id: true, name: true, username: true, avatar: true } },
      },
    });
    if (!duo) return res.status(404).json({ success: false, message: 'Invite link is invalid or expired' });
    res.json({
      success: true,
      duo: {
        id: duo.id,
        code: duo.code,
        status: duo.status,
        partner1: duo.partner1,
        isFull: Boolean(duo.partner2Id),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

duoRouter.post('/accept', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { code } = req.body;
    const userId = req.user!.id;
    const duo = await prisma.duo.findUnique({
      where: { code },
      include: { partner1: true },
    });
    if (!duo) return res.status(404).json({ success: false, message: 'Invite code not found' });
    if (duo.partner1Id === userId) {
      return res.status(400).json({ success: false, message: 'You cannot accept your own invite!' });
    }
    if (duo.partner2Id && duo.partner2Id !== userId) {
      return res.status(400).json({ success: false, message: 'This duo already has two partners linked' });
    }
    await prisma.duo.updateMany({
      where: { OR: [{ partner1Id: userId }, { partner2Id: userId }], status: 'ACTIVE' },
      data: { status: 'UNLINKED' },
    });
    const updatedDuo = await prisma.duo.update({
      where: { id: duo.id },
      data: { partner2Id: userId, status: 'ACTIVE', connectedAt: new Date() },
      include: { partner1: true, partner2: true },
    });
    emitToDuo(updatedDuo.id, 'duo:linked', {
      duoId: updatedDuo.id,
      partner1: updatedDuo.partner1.name,
      partner2: updatedDuo.partner2?.name,
    });
    res.json({
      success: true,
      message: 'Partners linked successfully! Welcome to Code Together Duo 💕',
      duo: updatedDuo,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

duoRouter.get('/current', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const duo = await prisma.duo.findFirst({
      where: { OR: [{ partner1Id: userId }, { partner2Id: userId }], status: 'ACTIVE' },
      include: { partner1: true, partner2: true },
    });
    if (!duo) return res.json({ success: true, duo: null });
    const partner = duo.partner1Id === userId ? duo.partner2 : duo.partner1;
    const currentUser = duo.partner1Id === userId ? duo.partner1 : duo.partner2;
    res.json({
      success: true,
      duo: {
        id: duo.id,
        code: duo.code,
        coupleScore: duo.coupleScore,
        streakDays: duo.streakDays,
        connectedAt: duo.connectedAt,
        currentUser,
        partner,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

duoRouter.post('/unlink', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    await prisma.duo.updateMany({
      where: { OR: [{ partner1Id: userId }, { partner2Id: userId }], status: 'ACTIVE' },
      data: { status: 'UNLINKED' },
    });
    res.json({ success: true, message: 'Duo unlinked successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});
