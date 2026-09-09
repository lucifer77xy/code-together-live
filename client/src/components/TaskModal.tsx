'use client';

import React, { useState } from 'react';
import { apiFetch } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { X, PlusCircle, Clock, Tag, Flag } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: () => void;
}

export default function TaskModal({ isOpen, onClose, onTaskCreated }: TaskModalProps) {
  const { user, duo } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [category, setCategory] = useState('DEVELOPMENT');
  const [estimatedMinutes, setEstimatedMinutes] = useState(45);
  const [assignedToId, setAssignedToId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await apiFetch('/tasks', {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          priority,
          category,
          estimatedMinutes: Number(estimatedMinutes),
          assignedToId: assignedToId || null,
        }),
      });
      setTitle('');
      setDescription('');
      onTaskCreated();
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to create task');
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-white mb-1">Create Duo Task</h3>
        <p className="text-xs text-slate-400 mb-5">Add a new challenge or milestone for you or your partner.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Task Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Implement Dijkstra Algorithm / Design Auth Flow"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description (Optional)</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Notes, LeetCode links, or pair goals..."
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-primary"
              >
                <option value="DSA">DSA & Algorithms</option>
                <option value="DEVELOPMENT">Full Stack Development</option>
                <option value="BACKEND">Backend & Databases</option>
                <option value="FRONTEND">Frontend & UI</option>
                <option value="AI">AI & Machine Learning</option>
                <option value="SYSTEM_DESIGN">System Design</option>
                <option value="INTERVIEW_PREP">Interview Prep</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-primary"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High (30 Couple Pts)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Estimated Time (Mins)</label>
              <input
                type="number"
                min={5}
                max={480}
                value={estimatedMinutes}
                onChange={e => setEstimatedMinutes(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Assignee</label>
              <select
                value={assignedToId}
                onChange={e => setAssignedToId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-primary"
              >
                <option value="">Unassigned (Either)</option>
                {user && <option value={user.id}>Assigned to Me ({user.name})</option>}
                {duo?.partner && <option value={duo.partner.id}>Assigned to {duo.partner.name}</option>}
              </select>
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
