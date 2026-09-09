'use client';

import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { BookOpen, PlusCircle, Clock, CheckCircle, Calendar, MessageSquare, Flame } from 'lucide-react';

export default function LogsPage() {
  const { user, duo } = useAuth();
  const { triggerCelebration } = useSocket();
  const [logs, setLogs] = useState<any[]>([]);
  const [hoursStudied, setHoursStudied] = useState<number>(2.5);
  const [problemsSolved, setProblemsSolved] = useState<number>(3);
  const [summary, setSummary] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    try {
      const data = await apiFetch('/logs');
      if (data.success) {
        setLogs(data.logs || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiFetch('/logs', {
        method: 'POST',
        body: JSON.stringify({
          hoursStudied: Number(hoursStudied),
          problemsSolved: Number(problemsSolved),
          summary,
          notes,
        }),
      });
      setSummary('');
      setNotes('');
      triggerCelebration('Logged ' + hoursStudied + ' study hours! 🔥');
      fetchLogs();
    } catch (err: any) {
      alert(err.message || 'Failed to submit log');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white">Daily Coding Log</h1>
        <p className="text-xs text-slate-400 mt-1">
          Track your daily hours, problem counts, and pair programming retrospectives. Stored historically.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Submit Form */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl h-fit">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-800 mb-5">
            <PlusCircle className="w-4 h-4 text-pink-400" />
            <h2 className="text-sm font-bold text-white">Log Today's Session</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Hours Studied (e.g. 2.5) *</label>
              <input
                type="number"
                step="0.25"
                min="0.25"
                max="24"
                required
                value={hoursStudied}
                onChange={e => setHoursStudied(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Problems Solved (DSA / Tickets) *</label>
              <input
                type="number"
                min="0"
                max="50"
                required
                value={problemsSolved}
                onChange={e => setProblemsSolved(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Learning Summary</label>
              <input
                type="text"
                value={summary}
                onChange={e => setSummary(e.target.value)}
                placeholder="e.g. React 19 hooks and dynamic routing patterns"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Partner Notes & Reflections</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="What did you two learn? Any roadblocks you solved together?"
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-primary resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Flame className="w-4 h-4 fill-white" />
              {loading ? 'Submitting...' : 'Save Study Log'}
            </button>
          </form>
        </div>

        {/* Historical Logs List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Historical Duo Logs</h2>
            <span className="text-xs text-slate-500 font-mono">{logs.length} sessions logged</span>
          </div>

          {logs.length === 0 ? (
            <div className="p-8 text-center rounded-3xl bg-slate-900/50 border border-slate-800 text-slate-400 text-xs">
              No coding logs yet. Submit your first study session above!
            </div>
          ) : (
            logs.map(log => (
              <div
                key={log.id}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all shadow-md"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/60 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={log.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50'}
                      alt={log.user?.name}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-primary/40"
                    />
                    <div>
                      <span className="text-xs font-bold text-white">{log.user?.name}</span>
                      <span className="text-[10px] text-slate-400 ml-2 font-mono">{log.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 font-bold border border-purple-500/20">
                      {log.hoursStudied}h Studied
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 font-bold border border-emerald-500/20">
                      {log.problemsSolved} Solved
                    </span>
                  </div>
                </div>

                {log.summary && (
                  <p className="text-xs font-semibold text-slate-200 mb-1.5">
                    🎯 {log.summary}
                  </p>
                )}

                {log.notes && (
                  <p className="text-xs text-slate-400 italic bg-slate-950/40 p-3 rounded-xl border border-slate-850">
                    "{log.notes}"
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
