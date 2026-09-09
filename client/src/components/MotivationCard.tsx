'use client';

import React, { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
import { Sparkles, Target, Quote, CheckCircle2 } from 'lucide-react';

export default function MotivationCard() {
  const [data, setData] = useState<any>(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    apiFetch('/motivation/today').then(res => {
      if (res.success) setData(res.motivation);
    });
  }, []);

  if (!data) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/30 p-6 shadow-xl mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Quote & Couple Inspiration */}
        <div className="flex-1">
          <div className="flex items-center gap-2 text-xs font-bold text-pink-400 uppercase tracking-wider mb-2">
            <Quote className="w-4 h-4" />
            <span>Daily Couple Motivation</span>
          </div>
          <p className="text-base lg:text-lg font-bold text-slate-100 italic mb-2">
            "{data.quote}"
          </p>
          <p className="text-xs text-slate-400 font-medium">
            {data.coupleMotivation}
          </p>
        </div>

        {/* Productivity Challenge */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 lg:max-w-md w-full">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1.5">
            <Target className="w-4 h-4" />
            <span>Today's Couple Challenge</span>
          </div>
          <p className="text-xs text-slate-300 mb-3">{data.challenge}</p>
          <button
            onClick={() => setCompleted(!completed)}
            className={"w-full py-2 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all " + (completed ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-primary/20 hover:bg-primary/30 text-purple-300 border border-primary/30")}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {completed ? 'Challenge Completed Together! 🎉' : 'Mark Challenge Completed'}
          </button>
        </div>
      </div>
    </div>
  );
}
