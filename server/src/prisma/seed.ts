import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Code Together Duo Seed...');
  await prisma.notification.deleteMany({});
  await prisma.taskActivity.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.codingLog.deleteMany({});
  await prisma.achievement.deleteMany({});
  await prisma.analytics.deleteMany({});
  await prisma.inviteLink.deleteMany({});
  await prisma.duo.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.motivation.deleteMany({});
  await prisma.jokeHistory.deleteMany({});

  const maya = await prisma.user.create({
    data: {
      username: 'maya_codes',
      name: 'Maya Lin',
      email: 'maya@codetogether.dev',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: 'Full Stack Engineer & React enthusiast. Building apps and solving algorithms with Alex 💕',
      streakDays: 14,
      totalHours: 38.5,
      totalProblems: 28,
    },
  });

  const alex = await prisma.user.create({
    data: {
      username: 'alex_dev',
      name: 'Alex Chen',
      email: 'alex@codetogether.dev',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      bio: 'Backend & Systems developer. Excited about distributed systems and learning together! 🚀',
      streakDays: 14,
      totalHours: 44.0,
      totalProblems: 32,
    },
  });

  const duo = await prisma.duo.create({
    data: {
      code: 'duo-love-2026',
      partner1Id: maya.id,
      partner2Id: alex.id,
      status: 'ACTIVE',
      coupleScore: 1240,
      streakDays: 14,
      connectedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    },
  });

  const taskData = [
    {
      title: 'Implement Binary Search & Two Pointer Patterns',
      description: 'Solve 3 LeetCode medium questions and explain solutions to each other.',
      priority: 'HIGH',
      category: 'DSA',
      status: 'COMPLETED',
      estimatedMinutes: 60,
      actualMinutes: 55,
      creatorId: maya.id,
      assignedToId: alex.id,
      completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      title: 'Design Redis Caching Layer for Profile API',
      description: 'Benchmark latency with and without cache invalidation.',
      priority: 'HIGH',
      category: 'BACKEND',
      status: 'COMPLETED',
      estimatedMinutes: 90,
      actualMinutes: 80,
      creatorId: alex.id,
      assignedToId: alex.id,
      completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      title: 'Build Framer Motion Micro-interactions for Dashboard',
      description: 'Add glowing hover effects and romantic partner cards animation.',
      priority: 'MEDIUM',
      category: 'FRONTEND',
      status: 'IN_PROGRESS',
      estimatedMinutes: 45,
      creatorId: maya.id,
      assignedToId: maya.id,
    },
    {
      title: 'Explore Transformer Attention Heads with PyTorch',
      description: 'Step through multi-head self-attention formulas together.',
      priority: 'HIGH',
      category: 'AI',
      status: 'TODO',
      estimatedMinutes: 75,
      creatorId: maya.id,
      assignedToId: alex.id,
    },
    {
      title: 'System Design: Distributed Rate Limiter',
      description: 'Compare Token Bucket vs Leaky Bucket algorithms and mock an interview.',
      priority: 'MEDIUM',
      category: 'SYSTEM_DESIGN',
      status: 'TODO',
      estimatedMinutes: 60,
      creatorId: alex.id,
      assignedToId: maya.id,
    },
    {
      title: 'Technical Behavioral Interview Q&A Practice',
      description: '30-minute mock interview session using STAR method.',
      priority: 'LOW',
      category: 'INTERVIEW_PREP',
      status: 'TODO',
      estimatedMinutes: 30,
      creatorId: maya.id,
    },
  ];

  for (const t of taskData) {
    const created = await prisma.task.create({
      data: { ...t, duoId: duo.id },
    });
    await prisma.taskActivity.create({
      data: {
        taskId: created.id,
        userId: created.creatorId,
        action: created.status === 'COMPLETED' ? 'COMPLETED' : 'CREATED',
        details: 'Task initialized in state ' + created.status,
      },
    });
  }

  const now = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    await prisma.codingLog.create({
      data: {
        duoId: duo.id,
        userId: maya.id,
        date: dateStr,
        hoursStudied: 2.5 + (i % 3) * 0.5,
        problemsSolved: 2 + (i % 2),
        summary: 'Focused on React server components and dynamic routing.',
        notes: 'Had a fun pair debugging session with Alex on hydration mismatches!',
      },
    });

    await prisma.codingLog.create({
      data: {
        duoId: duo.id,
        userId: alex.id,
        date: dateStr,
        hoursStudied: 3.0 + (i % 2) * 0.5,
        problemsSolved: 2 + (i % 3),
        summary: 'Deep dive into database indexing and query optimization.',
        notes: 'Maya helped me spot a subtle state bug. Best duo ever!',
      },
    });
  }

  const badges = [
    { key: 'FIRST_TASK', title: 'First Step Together', description: 'Completed your very first task as a duo', icon: '🚀' },
    { key: 'STREAK_7', title: '7 Day Spark', description: 'Maintained a 7-day coding streak together', icon: '🔥' },
    { key: 'NIGHT_OWL', title: 'Midnight Hackers', description: 'Completed a coding challenge late at night', icon: '🌙' },
    { key: 'DUO_MASTERS', title: 'Duo Masters', description: 'Reached over 1000 collective Couple Productivity Points', icon: '👑' },
  ];

  for (const b of badges) {
    await prisma.achievement.create({
      data: { userId: maya.id, badgeKey: b.key, title: b.title, description: b.description, icon: b.icon },
    });
    await prisma.achievement.create({
      data: { userId: alex.id, badgeKey: b.key, title: b.title, description: b.description, icon: b.icon },
    });
  }

  await prisma.notification.create({
    data: {
      duoId: duo.id,
      senderId: alex.id,
      recipientId: maya.id,
      type: 'TASK_COMPLETED',
      title: 'Alex completed a Backend task!',
      message: 'Alex finished "Design Redis Caching Layer for Profile API" (+30 couple points) 🎉',
      read: false,
    },
  });

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => { console.error('Seed Error:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
