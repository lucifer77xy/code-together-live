import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { AuthRequest, AuthenticatedUser } from '../types';
import { prisma } from '../config/prisma';

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return;
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as AuthenticatedUser;
    const dbUser = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        duoAsPartner1: { where: { status: 'ACTIVE' } },
        duoAsPartner2: { where: { status: 'ACTIVE' } },
      },
    });
    if (!dbUser) {
      res.status(401).json({ success: false, message: 'User no longer exists' });
      return;
    }
    const activeDuo = dbUser.duoAsPartner1[0] || dbUser.duoAsPartner2[0] || null;
    req.user = {
      id: dbUser.id,
      githubId: dbUser.githubId,
      username: dbUser.username,
      name: dbUser.name,
      avatar: dbUser.avatar,
      duoId: activeDuo ? activeDuo.id : null,
    };
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}
