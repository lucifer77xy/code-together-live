import { prisma } from '../config/prisma';

export interface BadgeDefinition {
  key: string;
  title: string;
  description: string;
  icon: string;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    key: 'FIRST_TASK',
    title: 'First Step Together',
    description: 'Completed your very first task as a duo',
    icon: '🚀',
  },
  {
    key: 'STREAK_7',
    title: '7 Day Spark',
    description: 'Maintained a 7-day coding streak together',
    icon: '🔥',
  },
  {
    key: 'STREAK_30',
    title: '30 Day Power Couple',
    description: 'Achieved an extraordinary 30-day coding streak',
    icon: '💎',
  },
  {
    key: 'TASKS_100',
    title: 'Centurion Coders',
    description: 'Completed 100 tasks collectively',
    icon: '🏆',
  },
  {
    key: 'NIGHT_OWL',
    title: 'Midnight Hackers',
    description: 'Completed a coding challenge late at night',
    icon: '🌙',
  },
  {
    key: 'EARLY_BIRD',
    title: 'Sunrise Scripters',
    description: 'Logged hours or completed tasks before 8:00 AM',
    icon: '🌅',
  },
  {
    key: 'DUO_MASTERS',
    title: 'Duo Masters',
    description: 'Reached over 1000 collective Couple Productivity Points',
    icon: '👑',
  },
];

export async function evaluateAchievements(userId: string, duoId: string): Promise<string[]> {
  const unlockedBadges: string[] = [];
  const existing = await prisma.achievement.findMany({ where: { userId } });
  const existingKeys = new Set(existing.map(a => a.badgeKey));

  const completedTasksCount = await prisma.task.count({
    where: { duoId, status: 'COMPLETED' },
  });

  const duo = await prisma.duo.findUnique({ where: { id: duoId } });

  if (completedTasksCount >= 1 && !existingKeys.has('FIRST_TASK')) {
    await awardBadge(userId, 'FIRST_TASK');
    unlockedBadges.push('FIRST_TASK');
  }
  if (completedTasksCount >= 100 && !existingKeys.has('TASKS_100')) {
    await awardBadge(userId, 'TASKS_100');
    unlockedBadges.push('TASKS_100');
  }
  if (duo && duo.streakDays >= 7 && !existingKeys.has('STREAK_7')) {
    await awardBadge(userId, 'STREAK_7');
    unlockedBadges.push('STREAK_7');
  }
  if (duo && duo.streakDays >= 30 && !existingKeys.has('STREAK_30')) {
    await awardBadge(userId, 'STREAK_30');
    unlockedBadges.push('STREAK_30');
  }
  if (duo && duo.coupleScore >= 1000 && !existingKeys.has('DUO_MASTERS')) {
    await awardBadge(userId, 'DUO_MASTERS');
    unlockedBadges.push('DUO_MASTERS');
  }
  return unlockedBadges;
}

async function awardBadge(userId: string, badgeKey: string) {
  const def = BADGE_DEFINITIONS.find(b => b.key === badgeKey);
  if (!def) return;
  await prisma.achievement.create({
    data: {
      userId,
      badgeKey,
      title: def.title,
      description: def.description,
      icon: def.icon,
    },
  });
}
