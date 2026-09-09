import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { authenticate } from '../middleware/auth.middleware';
import { AuthRequest } from '../types';
import { emitToDuo } from '../socket';
import { evaluateAchievements } from '../services/achievement.service';

export const taskRouter = Router();

const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  category: z.enum(['DSA', 'DEVELOPMENT', 'BACKEND', 'FRONTEND', 'AI', 'SYSTEM_DESIGN', 'INTERVIEW_PREP', 'OTHER']).default('DEVELOPMENT'),
  estimatedMinutes: z.number().int().positive().optional(),
  assignedToId: z.string().optional().nullable(),
});

taskRouter.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const duoId = req.user!.duoId;
    if (!duoId) return res.status(400).json({ success: false, message: 'You must be linked in a duo' });
    const { status, category, priority } = req.query;
    const whereClause: any = { duoId };
    if (status) whereClause.status = String(status);
    if (category) whereClause.category = String(category);
    if (priority) whereClause.priority = String(priority);
    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: {
        creator: { select: { id: true, name: true, avatar: true, username: true } },
        assignedTo: { select: { id: true, name: true, avatar: true, username: true } },
        activities: { orderBy: { timestamp: 'desc' }, take: 5 },
      },
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    });
    res.json({ success: true, tasks });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

taskRouter.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const duoId = req.user!.duoId;
    if (!duoId) return res.status(400).json({ success: false, message: 'You must be linked in a duo' });
    const validated = createTaskSchema.parse(req.body);
    const task = await prisma.task.create({
      data: {
        duoId,
        creatorId: req.user!.id,
        assignedToId: validated.assignedToId || null,
        title: validated.title,
        description: validated.description || null,
        priority: validated.priority,
        category: validated.category,
        estimatedMinutes: validated.estimatedMinutes || null,
        status: 'TODO',
      },
      include: {
        creator: { select: { id: true, name: true, avatar: true } },
        assignedTo: { select: { id: true, name: true, avatar: true } },
      },
    });
    await prisma.taskActivity.create({
      data: {
        taskId: task.id,
        userId: req.user!.id,
        action: 'CREATED',
        details: 'Task created with ' + task.priority + ' priority',
      },
    });
    emitToDuo(duoId, 'task:created', { task, author: req.user!.name });
    res.status(201).json({ success: true, task });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

taskRouter.patch('/:id/status', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, actualMinutes } = req.body;
    const duoId = req.user!.duoId!;
    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing || existing.duoId !== duoId) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    const isCompleting = status === 'COMPLETED' && existing.status !== 'COMPLETED';
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        status,
        actualMinutes: actualMinutes ? Number(actualMinutes) : existing.actualMinutes,
        completedAt: isCompleting ? new Date() : existing.completedAt,
      },
      include: {
        creator: { select: { id: true, name: true, avatar: true } },
        assignedTo: { select: { id: true, name: true, avatar: true } },
      },
    });
    await prisma.taskActivity.create({
      data: {
        taskId: id,
        userId: req.user!.id,
        action: isCompleting ? 'COMPLETED' : 'STATUS_CHANGED',
        details: 'Status changed to ' + status,
      },
    });
    if (isCompleting) {
      const points = updatedTask.priority === 'HIGH' ? 30 : updatedTask.priority === 'MEDIUM' ? 20 : 10;
      await prisma.duo.update({
        where: { id: duoId },
        data: { coupleScore: { increment: points } },
      });
      await evaluateAchievements(req.user!.id, duoId);
      const duo = await prisma.duo.findUnique({ where: { id: duoId } });
      const partnerId = duo?.partner1Id === req.user!.id ? duo?.partner2Id : duo?.partner1Id;
      if (partnerId) {
        await prisma.notification.create({
          data: {
            duoId,
            senderId: req.user!.id,
            recipientId: partnerId,
            type: 'TASK_COMPLETED',
            title: req.user!.name + ' finished a task!',
            message: 'Completed "' + updatedTask.title + '" (+' + points + ' couple points) 🎉',
          },
        });
      }
    }
    emitToDuo(duoId, 'task:updated', { task: updatedTask, user: req.user!.name });
    res.json({ success: true, task: updatedTask });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

taskRouter.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const duoId = req.user!.duoId!;
    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing || existing.duoId !== duoId) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    await prisma.task.delete({ where: { id } });
    emitToDuo(duoId, 'task:deleted', { taskId: id });
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});
