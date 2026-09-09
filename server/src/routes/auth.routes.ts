import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { prisma } from '../config/prisma';
import { ENV } from '../config/env';
import { authenticate } from '../middleware/auth.middleware';
import { AuthRequest } from '../types';

export const authRouter = Router();

authRouter.post('/dev-login', async (req: Request, res: Response) => {
  try {
    const { username } = req.body;
    const targetUsername = username || 'maya_codes';

    let user = await prisma.user.findUnique({
      where: { username: targetUsername },
      include: {
        duoAsPartner1: { where: { status: 'ACTIVE' } },
        duoAsPartner2: { where: { status: 'ACTIVE' } },
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          username: targetUsername,
          name: targetUsername === 'maya_codes' ? 'Maya Lin' : 'Alex Chen',
          avatar: targetUsername === 'maya_codes'
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          bio: 'Full Stack enthusiast learning together with my partner 💕',
          streakDays: 14,
          totalHours: 42.5,
          totalProblems: 38,
        },
        include: {
          duoAsPartner1: true,
          duoAsPartner2: true,
        },
      });
    }

    const activeDuo = user.duoAsPartner1[0] || user.duoAsPartner2[0] || null;

    const token = jwt.sign(
      {
        id: user.id,
        githubId: user.githubId,
        username: user.username,
        name: user.name,
        avatar: user.avatar,
        duoId: activeDuo ? activeDuo.id : null,
      },
      ENV.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
        streakDays: user.streakDays,
        totalHours: user.totalHours,
        totalProblems: user.totalProblems,
        duoId: activeDuo ? activeDuo.id : null,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

authRouter.get('/github', (req: Request, res: Response) => {
  if (!ENV.GITHUB_CLIENT_ID) {
    return res.redirect(ENV.FRONTEND_URL + '/login?error=no_github_credentials');
  }
  const githubAuthUrl = 'https://github.com/login/oauth/authorize?client_id=' + ENV.GITHUB_CLIENT_ID + '&redirect_uri=' + encodeURIComponent(ENV.GITHUB_REDIRECT_URI) + '&scope=read:user,user:email';
  res.redirect(githubAuthUrl);
});

authRouter.get('/github/callback', async (req: Request, res: Response) => {
  const { code } = req.query;
  if (!code) {
    return res.redirect(ENV.FRONTEND_URL + '/login?error=no_code');
  }
  try {
    const tokenRes = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: ENV.GITHUB_CLIENT_ID,
        client_secret: ENV.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: ENV.GITHUB_REDIRECT_URI,
      },
      { headers: { Accept: 'application/json' } }
    );
    const accessToken = tokenRes.data.access_token;
    if (!accessToken) {
      return res.redirect(ENV.FRONTEND_URL + '/login?error=token_failed');
    }
    const userRes = await axios.get('https://api.github.com/user', {
      headers: { Authorization: 'Bearer ' + accessToken },
    });
    const ghUser = userRes.data;
    let user = await prisma.user.findFirst({
      where: { OR: [{ githubId: String(ghUser.id) }, { username: ghUser.login }] },
      include: {
        duoAsPartner1: { where: { status: 'ACTIVE' } },
        duoAsPartner2: { where: { status: 'ACTIVE' } },
      },
    });
    if (!user) {
      user = await prisma.user.create({
        data: {
          githubId: String(ghUser.id),
          username: ghUser.login,
          name: ghUser.name || ghUser.login,
          avatar: ghUser.avatar_url,
          bio: ghUser.bio || 'Coding with my partner on Code Together Duo 💕',
          email: ghUser.email,
          lastLoginAt: new Date(),
        },
        include: { duoAsPartner1: true, duoAsPartner2: true },
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLoginAt: new Date(),
          avatar: ghUser.avatar_url,
          name: ghUser.name || user.name,
        },
        include: {
          duoAsPartner1: { where: { status: 'ACTIVE' } },
          duoAsPartner2: { where: { status: 'ACTIVE' } },
        },
      });
    }
    const activeDuo = user.duoAsPartner1[0] || user.duoAsPartner2[0] || null;
    const token = jwt.sign(
      {
        id: user.id,
        githubId: user.githubId,
        username: user.username,
        name: user.name,
        avatar: user.avatar,
        duoId: activeDuo ? activeDuo.id : null,
      },
      ENV.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.redirect(ENV.FRONTEND_URL + '/login?token=' + token);
  } catch (err: any) {
    res.redirect(ENV.FRONTEND_URL + '/login?error=auth_failed');
  }
});

authRouter.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        duoAsPartner1: {
          where: { status: 'ACTIVE' },
          include: { partner1: true, partner2: true },
        },
        duoAsPartner2: {
          where: { status: 'ACTIVE' },
          include: { partner1: true, partner2: true },
        },
        achievements: true,
      },
    });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const duo = user.duoAsPartner1[0] || user.duoAsPartner2[0] || null;
    let partner = null;
    if (duo) {
      partner = duo.partner1Id === user.id ? duo.partner2 : duo.partner1;
    }
    res.json({
      success: true,
      user: {
        id: user.id,
        githubId: user.githubId,
        username: user.username,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
        streakDays: user.streakDays,
        totalHours: user.totalHours,
        totalProblems: user.totalProblems,
        achievements: user.achievements,
      },
      duo: duo ? {
        id: duo.id,
        code: duo.code,
        status: duo.status,
        coupleScore: duo.coupleScore,
        streakDays: duo.streakDays,
        connectedAt: duo.connectedAt,
        partner: partner ? {
          id: partner.id,
          name: partner.name,
          username: partner.username,
          avatar: partner.avatar,
          streakDays: partner.streakDays,
          totalHours: partner.totalHours,
        } : null,
      } : null,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});
