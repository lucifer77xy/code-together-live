'use client';

import React, { useState } from 'react';
import { Trophy, Flame, Heart, Medal, Star } from 'lucide-react';

const DEMO_LEADERBOARD = [
  { rank: 1, couple: 'Maya & Alex 💕', score: 1240, streak: 14, badge: '👑 Duo Masters' },
  { rank: 2, couple: 'Sujan & Maya ✨', score: 980, streak: 11, badge: '💎 Power Couple' },
  { rank: 3, couple: 'Leo & Elena 🚀', score: 850, streak: 9, badge: '🔥 7-Day Spark' },
  { rank: 4, couple: 'Priya & Rahul 💻', score: 720, streak: 8, badge: '🚀 First Step' },
  { rank: 5, couple: 'Sam & Jordan ⚡', score: 640, streak: 6, badge: '🚀 First Step' },
];

export default function LeaderboardPage() {
  const [filter, setFilter] = useState<'WEEK' | 'MONTH' | 'ALL'>('ALL');

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white">Couple Productivity Leaderboard</h1>
        <p className="text-xs text-slate-400 mt-1">
          Top couples ranked by collective tasks solved, streak records, and pair programming hours.
        </p>
      </div>

      {/* Tab Filter */}
      <div className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800 w-fit text-xs font-semibold">
        <button
          onClick={() => setFilter('WEEK')}
          className={"px-4 py-2 rounded-xl transition-all " + (filter === 'WEEK' ? "bg-primary text-white" : "text-slate-400 hover:text-white")}
        >
          This Week
        </button>
        <button
          onClick={() => setFilter('MONTH')}
          className={"px-4 py-2 rounded-xl transition-all " + (filter === 'MONTH' ? "bg-primary text-white" : "text-slate-400 hover:text-white")}
        >
          This Month
        </button>
        <button
          onClick={() => setFilter('ALL')}
          className={"px-4 py-2 rounded-xl transition-all " + (filter === 'ALL' ? "bg-primary text-white" : "text-slate-400 hover:text-white")}
        >
          All Time
        </button>
      </div>

      {/* Table Card */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-2xl backdrop-blur-md">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
            <tr>
              <th className="p-4">Rank</th>
              <th className="p-4">Couple Duo</th>
              <th className="p-4">Streak</th>
              <th className="p-4">Productivity Pts</th>
              <th className="p-4 text-right">Badge</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {DEMO_LEADERBOARD.map(c => (
              <tr key={c.rank} className={"hover:bg-slate-850/50 transition-colors " + (c.rank === 1 ? "bg-pink-500/5 font-semibold text-white" : "")}>
                <td className="p-4 flex items-center gap-2">
                  {c.rank === 1 && <Medal className="w-4 h-4 text-amber-400" />}
                  {c.rank === 2 && <Medal className="w-4 h-4 text-slate-300" />}
                  {c.rank === 3 && <Medal className="w-4 h-4 text-amber-600" />}
                  <span>#{c.rank}</span>
                </td>
                <td className="p-4 font-bold text-slate-100">{c.couple}</td>
                <td className="p-4 text-orange-400 font-bold">{c.streak}d 🔥</td>
                <td className="p-4 text-pink-300 font-black text-sm">{c.score}</td>
                <td className="p-4 text-right">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
                    {c.badge}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
