'use client';

import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import TaskModal from '../../components/TaskModal';
import {
  CheckSquare,
  PlusCircle,
  Clock,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Filter,
  Flame,
  Tag,
} from 'lucide-react';

export default function TasksPage() {
  const { user, duo } = useAuth();
  const { socket, triggerCelebration } = useSocket();
  const [tasks, setTasks] = useState<any[]>([]);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      let url = '/tasks';
      const params: string[] = [];
      if (filterCategory !== 'ALL') params.push('category=' + filterCategory);
      if (filterPriority !== 'ALL') params.push('priority=' + filterPriority);
      if (params.length > 0) url += '?' + params.join('&');

      const data = await apiFetch(url);
      if (data.success) {
        setTasks(data.tasks);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filterCategory, filterPriority]);

  // Real-time socket updates
  useEffect(() => {
    if (!socket) return;
    socket.on('task:created', fetchTasks);
    socket.on('task:updated', fetchTasks);
    socket.on('task:deleted', fetchTasks);
    return () => {
      socket.off('task:created');
      socket.off('task:updated');
      socket.off('task:deleted');
    };
  }, [socket]);

  const updateStatus = async (taskId: string, newStatus: string) => {
    try {
      await apiFetch('/tasks/' + taskId + '/status', {
        method: 'PATCH',
        body: JSON.stringify({
          status: newStatus,
          actualMinutes: newStatus === 'COMPLETED' ? 45 : undefined,
        }),
      });
      if (newStatus === 'COMPLETED') {
        triggerCelebration('Task Completed! 🎉');
      }
      fetchTasks();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await apiFetch('/tasks/' + taskId, { method: 'DELETE' });
      fetchTasks();
    } catch (e) {
      console.error(e);
    }
  };

  const columns = [
    { id: 'TODO', title: 'To Do', color: 'border-slate-700 bg-slate-900/40' },
    { id: 'IN_PROGRESS', title: 'In Progress ⏳', color: 'border-purple-500/30 bg-purple-950/10' },
    { id: 'COMPLETED', title: 'Completed ✨', color: 'border-emerald-500/30 bg-emerald-950/10' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Duo Task Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Both partners can create, edit, prioritize, and mark tasks completed in real time.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold shadow-lg shadow-primary/25 hover:scale-105 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          New Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800 text-xs">
        <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter by:</span>
        </div>

        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-primary"
        >
          <option value="ALL">All Categories</option>
          <option value="DSA">DSA</option>
          <option value="DEVELOPMENT">Development</option>
          <option value="BACKEND">Backend</option>
          <option value="FRONTEND">Frontend</option>
          <option value="AI">AI</option>
          <option value="SYSTEM_DESIGN">System Design</option>
          <option value="INTERVIEW_PREP">Interview Prep</option>
        </select>

        <select
          value={filterPriority}
          onChange={e => setFilterPriority(e.target.value)}
          className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-primary"
        >
          <option value="ALL">All Priorities</option>
          <option value="HIGH">High Priority</option>
          <option value="MEDIUM">Medium Priority</option>
          <option value="LOW">Low Priority</option>
        </select>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(col => {
          const colTasks = tasks.filter(t => t.status === col.id);
          return (
            <div key={col.id} className={"rounded-3xl border p-4 flex flex-col min-h-[500px] " + col.color}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
                <h3 className="font-bold text-sm text-slate-200">{col.title}</h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-400 font-mono">
                  {colTasks.length}
                </span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto">
                {colTasks.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-10">No tasks in this column</p>
                ) : (
                  colTasks.map(task => (
                    <div
                      key={task.id}
                      className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition-all shadow-md group"
                    >
                      {/* Badges */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] font-bold uppercase tracking-wider">
                          {task.category}
                        </span>
                        <span className={"px-2 py-0.5 rounded-md text-[10px] font-bold " + (task.priority === 'HIGH' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : task.priority === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-400')}
                        >
                          {task.priority}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white mb-1.5">{task.title}</h4>
                      {task.description && (
                        <p className="text-xs text-slate-400 mb-3 line-clamp-2">{task.description}</p>
                      )}

                      {/* Details & Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-900 text-xs text-slate-400">
                        <div className="flex items-center gap-1 text-[11px]">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{task.estimatedMinutes ? task.estimatedMinutes + 'm' : 'Untimed'}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {col.id === 'TODO' && (
                            <button
                              onClick={() => updateStatus(task.id, 'IN_PROGRESS')}
                              className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-[11px] font-semibold transition-colors"
                            >
                              Start ⏳
                            </button>
                          )}

                          {col.id === 'IN_PROGRESS' && (
                            <button
                              onClick={() => updateStatus(task.id, 'COMPLETED')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-semibold transition-colors flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              Finish
                            </button>
                          )}

                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTaskCreated={fetchTasks}
      />
    </div>
  );
}
