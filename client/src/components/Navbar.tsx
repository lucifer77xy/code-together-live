'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { apiFetch } from '../lib/api';
import JokeModal from './JokeModal';
import {
  Heart,
  Flame,
  Smile,
  Bell,
  CheckCircle2,
  LayoutDashboard,
  CheckSquare,
  BookOpen,
  BarChart3,
  Sparkles,
  Calendar,
  Trophy,
  Settings,
  LogOut,
  Users,
  UserCheck,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, duo, devLogin, logout } = useAuth();
  const { onlinePartner } = useSocket();
  const [isJokeOpen, setIsJokeOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const data = await apiFetch('/notifications');
      if (data.success) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Logs', href: '/logs', icon: BookOpen },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'AI Insights', href: '/ai-insights', icon: Sparkles },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Badges', href: '/achievements', icon: Trophy },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/75 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 text-white fill-white/80 animate-pulse" />
            </div>
            <div>
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-pink-400 to-rose-400">
                Code Together
              </span>
              <span className="ml-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                Duo
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          {user && (
            <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={"px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 " + (active ? "bg-primary/20 text-pink-300 border border-primary/30 shadow-sm" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50")}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {item.name}
                  </a>
                );
              })}
            </nav>
          )}

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Tell Me a Joke button */}
            <button
              onClick={() => setIsJokeOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 border border-pink-500/30 text-pink-300 shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              <Smile className="w-4 h-4 text-pink-400" />
              <span className="hidden sm:inline">Tell Me A Joke</span>
            </button>

            {user && duo && (
              <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                <Flame className="w-4 h-4 text-orange-400 fill-orange-400 animate-bounce" />
                <span className="font-bold text-orange-300">{duo.streakDays}d Streak</span>
                <span className="text-slate-600">|</span>
                <span className="text-pink-300 font-semibold">{duo.coupleScore} Pts</span>
              </div>
            )}

            {/* Notifications */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors relative"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pink-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {isNotifOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Notifications</h4>
                      <button
                        onClick={async () => {
                          await apiFetch('/notifications/read-all', { method: 'POST' });
                          fetchNotifications();
                        }}
                        className="text-[11px] text-pink-400 hover:underline"
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="max-h-60 overflow-y-auto flex flex-col gap-2">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-500 text-center py-4">No notifications yet</p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={"p-2.5 rounded-xl border text-xs " + (n.read ? "border-slate-800/60 bg-slate-950/40 text-slate-400" : "border-pink-500/30 bg-pink-500/5 text-slate-200")}
                          >
                            <p className="font-semibold text-pink-300">{n.title}</p>
                            <p className="text-slate-400 mt-0.5">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Dev Partner Switcher (Maya <-> Alex) */}
            {user && (
              <div className="flex items-center gap-1.5 bg-slate-900/80 px-2 py-1 rounded-xl border border-slate-800 text-xs">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <button
                  onClick={() => devLogin('maya_codes')}
                  className={"px-2 py-0.5 rounded-lg font-medium transition-all " + (user.username === 'maya_codes' ? "bg-primary text-white" : "text-slate-400 hover:text-white")}
                >
                  Maya
                </button>
                <span className="text-slate-600">|</span>
                <button
                  onClick={() => devLogin('alex_dev')}
                  className={"px-2 py-0.5 rounded-lg font-medium transition-all " + (user.username === 'alex_dev' ? "bg-secondary text-white" : "text-slate-400 hover:text-white")}
                >
                  Alex
                </button>
              </div>
            )}

            {/* Profile Avatar & Settings */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <a href="/settings" className="relative group">
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full ring-2 ring-pink-500/50 object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
                </a>
              </div>
            ) : (
              <a
                href="/login"
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
              >
                Log In
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Joke Modal Component */}
      <JokeModal isOpen={isJokeOpen} onClose={() => setIsJokeOpen(false)} />
    </>
  );
}
