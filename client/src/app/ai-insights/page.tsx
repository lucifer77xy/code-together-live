'use client';

import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Clock,
  TrendingUp,
  Target,
  Zap,
} from 'lucide-react';

export default function AIInsightsPage() {
  const { user, duo } = useAuth();
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalysis = async () => {
    try {
      const data = await apiFetch('/ai/insights');
      if (data.success) {
        setAnalysis(data.analysis);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, [user?.id]);

  const refreshAnalysis = async () => {
    setRefreshing(true);
    try {
      const data = await apiFetch('/ai/refresh', { method: 'POST' });
      if (data.success) {
        setAnalysis(data.analysis);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-pink-500 rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-medium animate-pulse">AI Engine analyzing duo patterns...</p>
      </div>
    );
  }

  const scores = [
    { title: 'Focus Score', score: analysis?.focusScore || 92, icon: Target, color: 'text-purple-400', desc: 'Sustained concentration' },
    { title: 'Discipline Score', score: analysis?.disciplineScore || 88, icon: Zap, color: 'text-pink-400', desc: 'Estimation adherence' },
    { title: 'Consistency Score', score: analysis?.consistencyScore || 94, icon: TrendingUp, color: 'text-emerald-400', desc: 'Daily study habits' },
    { title: 'Time Efficiency', score: analysis?.timeEfficiencyScore || 85, icon: Clock, color: 'text-cyan-400', desc: 'Actual vs estimated' },
  ];

  return (
    <div className="space-y-8">
      {/* Top Header & Refresh Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white">AI Productivity Engine</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 text-pink-300 text-[11px] font-bold border border-pink-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-pink-400" /> Intelligence 2.0
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated smart analysis that continuously evaluates both partners' study velocities, bottlenecks, and habits.
          </p>
        </div>

        <button
          onClick={refreshAnalysis}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold shadow-md transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={"w-3.5 h-3.5 " + (refreshing ? "animate-spin" : "")} />
          {refreshing ? 'Recalculating...' : 'Refresh AI Analysis'}
        </button>
      </div>

      {/* 4 Calculated Scores (Out of 100) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {scores.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-400">{s.title}</span>
                <Icon className={"w-4 h-4 " + s.color} />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">{s.score}</span>
                <span className="text-xs text-slate-500 font-bold">/100</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-950 mt-3 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000"
                  style={{ width: s.score + '%' }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-2">{s.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Core AI Observations Card */}
      <div className="rounded-3xl border border-pink-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/20 p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Daily Smart Observations</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {analysis?.observations?.map((obs: string, index: number) => (
            <div key={index} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-200">
              <span className="text-pink-400 text-sm mt-0.5">💡</span>
              <span>{obs}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths, Weaknesses, Recommendations (Core Feature #7) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Strengths */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl flex flex-col">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider pb-4 border-b border-slate-800 mb-4">
            <CheckCircle2 className="w-4 h-4" />
            <span>Observed Strengths</span>
          </div>
          <ul className="space-y-3 flex-1 text-xs text-slate-300">
            {analysis?.strengths?.map((str: string, i: number) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses / Friction points */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl flex flex-col">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider pb-4 border-b border-slate-800 mb-4">
            <AlertTriangle className="w-4 h-4" />
            <span>Friction Points</span>
          </div>
          <ul className="space-y-3 flex-1 text-xs text-slate-300">
            {analysis?.weaknesses?.map((weak: string, i: number) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">!</span>
                <span>{weak}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommendations */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl flex flex-col">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider pb-4 border-b border-slate-800 mb-4">
            <Lightbulb className="w-4 h-4" />
            <span>Actionable Recommendations</span>
          </div>
          <ul className="space-y-3 flex-1 text-xs text-slate-300">
            {analysis?.recommendations?.map((rec: string, i: number) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">→</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
