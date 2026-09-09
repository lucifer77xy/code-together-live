'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { apiFetch } from '../../lib/api';
import PartnerCard from '../../components/PartnerCard';
import MotivationCard from '../../components/MotivationCard';
import TaskModal from '../../components/TaskModal';
import {
  Flame,
  CheckCircle2,
  Clock,
  Trophy,
  TrendingUp,
  PlusCircle,
  Share2,
  Sparkles,
  Calendar,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, duo, refreshUser } = useAuth();
  const { onlinePartner } = useSocket();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const data = await apiFetch('/analytics/dashboard');
      if (data.success) {
        setDashboardData(data);
      }
    } catch (e) {
      console.error('Failed to load dashboard:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-pink-500 rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-medium animate-pulse">Syncing duo metrics...</p>
      </div>
    );
  }

  const stats = dashboardData?.stats || {
    totalTasksCompleted: 18,
    productivityPercentage: 88,
    currentStreak: 14,
    totalCodingHours: 82.5,
    coupleScore: 1240,
  };

  const p1 = dashboardData?.partnerCards?.partner1 || {
    name: 'Maya Lin',
    username: 'maya_codes',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    tasksCompleted: 10,
    codingTime: 38.5,
    streak: 14,
  };

  const p2 = dashboardData?.partnerCards?.partner2 || {
    name: 'Alex Chen',
    username: 'alex_dev',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    tasksCompleted: 8,
    codingTime: 44.0,
    streak: 14,
  };

  const isUserP1 = user?.username === p1.username;

  return (
    <div className="space-y-8">
      {/* Motivation & Daily Quote Banner */}
      <MotivationCard />

      {/* Top Duo Banner & Metric Summary */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">Duo Headquarters</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[11px] font-bold border border-pink-500/30">
                Active Partner Session
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Connected since {duo?.connectedAt ? new Date(duo.connectedAt).toLocaleDateString() : 'February 2026'}. Only 1 active duo per user.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              Create Task
            </button>
            <a
              href="/logs"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Log Hours
            </a>
          </div>
        </div>

        {/* 5 Big Shared Duo Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-2 text-orange-400 mb-1">
              <Flame className="w-4 h-4 fill-orange-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Streak</span>
            </div>
            <p className="text-2xl font-black text-white">{stats.currentStreak} Days</p>
            <p className="text-[10px] text-orange-300/80 mt-0.5">🔥 Unbroken couple record</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Completed</span>
            </div>
            <p className="text-2xl font-black text-white">{stats.totalTasksCompleted}</p>
            <p className="text-[10px] text-emerald-300/80 mt-0.5">Duo tickets resolved</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-2 text-purple-400 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Coding Time</span>
            </div>
            <p className="text-2xl font-black text-white">{stats.totalCodingHours}h</p>
            <p className="text-[10px] text-purple-300/80 mt-0.5">Total combined study</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-2 text-pink-400 mb-1">
              <Trophy className="w-4 h-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Couple Score</span>
            </div>
            <p className="text-2xl font-black text-white">{stats.coupleScore}</p>
            <p className="text-[10px] text-pink-300/80 mt-0.5">Productivity points</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 text-cyan-400 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Productivity</span>
            </div>
            <p className="text-2xl font-black text-white">{stats.productivityPercentage}%</p>
            <p className="text-[10px] text-cyan-300/80 mt-0.5">High completion cadence</p>
          </div>
        </div>
      </div>

      {/* Side-by-Side Partner Cards (Core Feature #3) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PartnerCard
          name={p1.name}
          username={p1.username}
          avatar={p1.avatar}
          tasksCompleted={p1.tasksCompleted}
          codingTime={p1.codingTime}
          streak={p1.streak}
          isCurrentUser={isUserP1}
          isOnline={isUserP1 ? true : onlinePartner}
        />

        <PartnerCard
          name={p2.name}
          username={p2.username}
          avatar={p2.avatar}
          tasksCompleted={p2.tasksCompleted}
          codingTime={p2.codingTime}
          streak={p2.streak}
          isCurrentUser={!isUserP1}
          isOnline={!isUserP1 ? true : onlinePartner}
        />
      </div>

      {/* Direct link navigation shortcut cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a
          href="/tasks"
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-primary/40 transition-all flex items-center justify-between group shadow-md"
        >
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">Manage Tasks Board</h4>
            <p className="text-xs text-slate-400 mt-0.5">Track DSA & dev tickets</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-300 group-hover:translate-x-1 transition-all" />
        </a>

        <a
          href="/ai-insights"
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-pink-500/40 transition-all flex items-center justify-between group shadow-md"
        >
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-pink-300 transition-colors">AI Productivity Insights</h4>
            <p className="text-xs text-slate-400 mt-0.5">Peak hours & time management</p>
          </div>
          <Sparkles className="w-4 h-4 text-slate-500 group-hover:text-pink-300 group-hover:scale-110 transition-all" />
        </a>

        <a
          href="/calendar"
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center justify-between group shadow-md"
        >
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">GitHub Heatmap</h4>
            <p className="text-xs text-slate-400 mt-0.5">Combined contribution calendar</p>
          </div>
          <Calendar className="w-4 h-4 text-slate-500 group-hover:text-emerald-300 group-hover:translate-x-1 transition-all" />
        </a>
      </div>

      {/* Create Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onTaskCreated={fetchDashboard}
      />
    </div>
  );
}
