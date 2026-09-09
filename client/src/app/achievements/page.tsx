'use client';

import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Trophy, Award, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AchievementsPage() {
  const { user } = useAuth();
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/achievements').then(res => {
      if (res.success) setBadges(res.badges || []);
      setLoading(false);
    });
  }, [user?.id]);

  const unlockedCount = badges.filter(b => b.isUnlocked).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Achievements & Badges</h1>
          <p className="text-xs text-slate-400 mt-1">
            Celebrate coding milestones as you build habits, sustain streaks, and tackle hard problems together.
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-gradient-to-r from-primary/20 to-secondary/20 border border-pink-500/30 text-xs font-bold text-pink-300 flex items-center gap-2 self-start sm:self-auto">
          <Trophy className="w-4 h-4 text-pink-400" />
          <span>{unlockedCount} of {badges.length} Badges Unlocked</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map(b => (
          <div
            key={b.key}
            className={"p-6 rounded-3xl border transition-all duration-300 shadow-xl relative overflow-hidden " + (b.isUnlocked ? "bg-slate-900/80 border-primary/40 hover:scale-[1.02]" : "bg-slate-950/40 border-slate-800/60 opacity-60")}
          >
            {b.isUnlocked && (
              <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-l from-emerald-500/20 to-transparent text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Unlocked
              </div>
            )}

            <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-3xl shadow-lg mb-4">
              {b.icon}
            </div>

            <h3 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
              <span>{b.title}</span>
              {!b.isUnlocked && <Lock className="w-3.5 h-3.5 text-slate-500" />}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">{b.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
