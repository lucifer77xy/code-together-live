'use client';

import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { BarChart3, TrendingUp, PieChart as PieIcon, Clock, Award } from 'lucide-react';

const COLORS = ['#7C3AED', '#EC4899', '#38BDF8', '#34D399', '#FBBF24', '#F43F5E'];

export default function AnalyticsPage() {
  const { user, duo } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/analytics/dashboard').then(res => {
      if (res.success) setData(res);
      setLoading(false);
    });
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-pink-500 rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-medium">Loading Recharts analytics...</p>
      </div>
    );
  }

  const weeklyTrend = data?.charts?.weeklyTrend || [];
  const categoryData = data?.charts?.categoryDistribution || [
    { name: 'DSA', value: 8 },
    { name: 'Development', value: 6 },
    { name: 'Backend', value: 5 },
    { name: 'Frontend', value: 4 },
    { name: 'AI', value: 2 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white">Advanced Analytics</h1>
        <p className="text-xs text-slate-400 mt-1">
          Visualize your couple study velocity, category distributions, and partner hours comparison with Recharts.
        </p>
      </div>

      {/* Chart 1: Productivity Trend (AreaChart) */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-pink-400" />
            <h2 className="text-sm font-bold text-white">Productivity Velocity (Tasks & Hours Over Time)</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Past 7 Days</span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyTrend} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="hoursGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EC4899" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="tasksGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
              <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} />
              <YAxis stroke="#94A3B8" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="totalHours" name="Hours Studied" stroke="#EC4899" strokeWidth={2.5} fillOpacity={1} fill="url(#hoursGradient)" />
              <Area type="monotone" dataKey="tasksCompleted" name="Tasks Completed" stroke="#7C3AED" strokeWidth={2.5} fillOpacity={1} fill="url(#tasksGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2 & 3: Side-by-side Partner Hours & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Dual Bar Chart: Partner 1 vs Partner 2 */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-bold text-white">Partner Hours Comparison (Maya vs Alex)</h2>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyTrend} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="p1Hours" name="Maya's Hours" fill="#7C3AED" radius={[6, 6, 0, 0]} />
                <Bar dataKey="p2Hours" name="Alex's Hours" fill="#EC4899" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie / Donut Chart: Category Distribution */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 mb-6">
            <PieIcon className="w-4 h-4 text-pink-400" />
            <h2 className="text-sm font-bold text-white">Category Focus Distribution</h2>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry: any, index: number) => (
                    <Cell key={"cell-" + index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
