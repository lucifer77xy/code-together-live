'use client';

import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Calendar as CalendarIcon, Flame, Award, CheckCircle } from 'lucide-react';

export default function CalendarPage() {
  const { user, duo } = useAuth();
  const [heatmapData, setHeatmapData] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/logs/heatmap').then(res => {
      if (res.success && res.data) {
        const map: Record<string, number> = {};
        res.data.forEach((item: any) => {
          map[item.date] = item.hours;
        });
        setHeatmapData(map);
      }
      setLoading(false);
    });
  }, [user?.id]);

  // Generate grid for past 90 days
  const days: { date: string; hours: number; level: number }[] = [];
  const now = new Date();
  for (let i = 89; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const hours = heatmapData[dateStr] || 0;
    let level = 0;
    if (hours > 0 && hours < 2) level = 1;
    else if (hours >= 2 && hours < 4) level = 2;
    else if (hours >= 4 && hours < 6) level = 3;
    else if (hours >= 6) level = 4;
    days.push({ date: dateStr, hours, level });
  }

  const colorClasses = [
    'bg-slate-900 border-slate-800',
    'bg-purple-950/60 border-purple-800 text-purple-200',
    'bg-purple-700 border-purple-600 text-white',
    'bg-pink-600 border-pink-500 text-white',
    'bg-rose-500 border-rose-400 shadow-md shadow-pink-500/30 text-white',
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white">Couple Coding Calendar</h1>
        <p className="text-xs text-slate-400 mt-1">
          GitHub-style contribution heatmap tracking combined daily study intensity over the past 90 days.
        </p>
      </div>

      {/* Heatmap Card */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">90-Day Duo Heatmap</h2>
              <p className="text-xs text-slate-400">Every green/pink block is a day you two studied together.</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Less</span>
            <span className="w-3 h-3 rounded-sm bg-slate-900 border border-slate-800 inline-block" />
            <span className="w-3 h-3 rounded-sm bg-purple-950/60 border border-purple-800 inline-block" />
            <span className="w-3 h-3 rounded-sm bg-purple-700 border border-purple-600 inline-block" />
            <span className="w-3 h-3 rounded-sm bg-pink-600 border border-pink-500 inline-block" />
            <span className="w-3 h-3 rounded-sm bg-rose-500 border border-rose-400 inline-block" />
            <span>More</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="flex flex-wrap gap-2 justify-center py-4">
          {days.map((d, i) => (
            <div
              key={i}
              title={d.date + ': ' + d.hours + ' hours'}
              className={"w-7 h-7 sm:w-8 sm:h-8 rounded-lg border flex items-center justify-center text-[10px] font-mono transition-transform hover:scale-125 cursor-pointer " + colorClasses[d.level]}
            >
              {d.hours > 0 ? Number(d.hours.toFixed(0)) : ''}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
