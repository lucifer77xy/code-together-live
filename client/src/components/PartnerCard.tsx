'use client';

import React from 'react';
import { Flame, Clock, CheckCircle2, Wifi } from 'lucide-react';

interface PartnerProps {
  name: string;
  username: string;
  avatar?: string | null;
  tasksCompleted: number;
  codingTime: number;
  streak: number;
  isCurrentUser?: boolean;
  isOnline?: boolean;
}

export default function PartnerCard({
  name,
  username,
  avatar,
  tasksCompleted,
  codingTime,
  streak,
  isCurrentUser = false,
  isOnline = true,
}: PartnerProps) {
  return (
    <div className={"relative overflow-hidden rounded-3xl p-6 border transition-all duration-300 hover:scale-[1.02] shadow-xl " + (isCurrentUser ? "border-primary/40 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-purple-950/20" : "border-secondary/40 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-pink-950/20")}>
      {/* Top Banner */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={"w-2.5 h-2.5 rounded-full " + (isOnline ? "bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" : "bg-slate-500")} />
          <span className="text-xs font-semibold text-slate-400">
            {isOnline ? 'Active Now' : 'Offline'}
          </span>
        </div>
        <span className={"px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase " + (isCurrentUser ? "bg-primary/20 text-purple-300 border border-primary/30" : "bg-secondary/20 text-pink-300 border border-secondary/30")}>
          {isCurrentUser ? 'You (Partner 1)' : 'Partner 2 💕'}
        </span>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <img
            src={avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt={name}
            className={"w-16 h-16 rounded-2xl object-cover ring-2 shadow-lg " + (isCurrentUser ? "ring-primary/60" : "ring-secondary/60")}
          />
          <div className="absolute -bottom-2 -right-2 p-1 rounded-lg bg-slate-950 border border-slate-800 text-xs">
            {isCurrentUser ? '👩‍💻' : '👨‍💻'}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">{name}</h3>
          <p className="text-xs text-slate-400 font-mono">@{username}</p>
        </div>
      </div>

      {/* 3 Metric Pills */}
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-800/80">
        <div className="p-3 rounded-2xl bg-slate-950/50 border border-slate-800/60 text-center">
          <div className="flex items-center justify-center text-emerald-400 mb-1">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-base font-bold text-white block">{tasksCompleted}</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Tasks</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950/50 border border-slate-800/60 text-center">
          <div className="flex items-center justify-center text-purple-400 mb-1">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-base font-bold text-white block">{codingTime}h</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Studied</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950/50 border border-slate-800/60 text-center">
          <div className="flex items-center justify-center text-orange-400 mb-1">
            <Flame className="w-4 h-4 fill-orange-400" />
          </div>
          <span className="text-base font-bold text-white block">{streak}d</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Streak</span>
        </div>
      </div>
    </div>
  );
}
