import { Request } from 'express';

export interface AuthenticatedUser {
  id: string;
  githubId?: string | null;
  username: string;
  name: string;
  avatar?: string | null;
  duoId?: string | null;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}
