'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Heart,
  Sparkles,
  Flame,
  CheckCircle2,
  BarChart2,
  Smile,
  Users,
  ShieldCheck,
  ArrowRight,
  Laptop,
  Code2,
} from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();

  const features = [
    {
      icon: Users,
      title: 'Permanent Duo Linking',
      desc: 'Connect with your partner via a personal invite link. One duo, unified accountability.',
    },
    {
      icon: CheckCircle2,
      title: 'Shared Task Management',
      desc: 'Collaborate on DSA challenges, backend APIs, and system design with estimated vs actual time tracking.',
    },
    {
      icon: Sparkles,
      title: 'AI Productivity Analysis',
      desc: 'Smart heuristic insights that uncover peak focus hours, tech stack time balance, and strengths.',
    },
    {
      icon: BarChart2,
      title: 'Deep Recharts Analytics',
      desc: 'Visualize weekly trends, category breakdown, and side-by-side partner hours comparison.',
    },
    {
      icon: Flame,
      title: 'Duo Streaks & Milestones',
      desc: 'Keep the couple flame burning bright with collective streak records and unlockable badges.',
    },
    {
      icon: Smile,
      title: 'Couple & Developer Jokes',
      desc: 'Break the tension of tough merge conflicts with curated humor with animated punchline reveals.',
    },
  ];

  return (
    <div className="space-y-24 py-6">
      {/* Hero Section */}
      <section className="relative text-center max-w-4xl mx-auto pt-10 pb-16">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10" />
        <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-secondary/15 rounded-full blur-3xl -z-10" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-pink-500/30 text-pink-300 text-xs font-semibold mb-6 shadow-md shadow-pink-500/10 animate-pulse">
          <Heart className="w-3.5 h-3.5 fill-pink-400" />
          <span>The Accountability Platform Built For Couples Learning Code</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Grow Your Skills. Build Projects. <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-pink-400 to-rose-400">
            Level Up Together.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          Code Together Duo connects two partners into a shared coding sanctuary. Track daily study sessions, solve interview problems, unlock achievements, and receive AI-guided time management recommendations.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href={user ? '/dashboard' : '/login'}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm shadow-xl shadow-primary/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5"
          >
            <span>{user ? 'Open Duo Dashboard' : 'Get Started With GitHub'}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="/dashboard"
            className="px-8 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 text-slate-200 font-semibold text-sm transition-all hover:border-slate-700"
          >
            Live Demo Dashboard
          </a>
        </div>
      </section>

      {/* Live Duo Preview Card */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 max-w-5xl mx-auto shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="ml-2 text-xs font-mono text-slate-400">code-together-duo // live preview</span>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Live Synchronized
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Maya Lin Preview */}
          <div className="p-6 rounded-2xl bg-slate-950/70 border border-primary/30">
            <div className="flex items-center gap-4 mb-4">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
                alt="Maya"
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-primary/60"
              />
              <div>
                <h4 className="font-bold text-white text-sm">Maya Lin</h4>
                <p className="text-xs text-purple-300 font-mono">Full Stack Explorer</p>
              </div>
              <span className="ml-auto text-xs px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-semibold">14d Streak 🔥</span>
            </div>
            <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 mb-2">
              Just completed: <span className="text-purple-300 font-semibold">"Binary Search & Two Pointer Patterns"</span> (+30 couple pts)
            </p>
          </div>

          {/* Alex Chen Preview */}
          <div className="p-6 rounded-2xl bg-slate-950/70 border border-secondary/30">
            <div className="flex items-center gap-4 mb-4">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
                alt="Alex"
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-secondary/60"
              />
              <div>
                <h4 className="font-bold text-white text-sm">Alex Chen</h4>
                <p className="text-xs text-pink-300 font-mono">Systems & Backend</p>
              </div>
              <span className="ml-auto text-xs px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-semibold">14d Streak 🔥</span>
            </div>
            <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 mb-2">
              Current Sprint: <span className="text-pink-300 font-semibold">"Redis Caching Layer Architecture"</span> (in progress)
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Everything You Need to Succeed as a Couple
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            From morning study prompts to late-night algorithm retrospectives, stay accountable together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 hover:border-pink-500/40 transition-all hover:scale-[1.02] shadow-lg group"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary/20 to-secondary/20 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-5 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pricing Banner: 100% Free for Couples */}
      <section className="rounded-3xl border border-pink-500/30 bg-gradient-to-r from-purple-950/40 via-slate-900 to-pink-950/40 p-10 text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-300 mb-4">
          <Heart className="w-7 h-7 fill-pink-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          100% Free Forever for Couples
        </h3>
        <p className="text-xs text-slate-300 max-w-md mx-auto mb-6">
          No credit cards, no subscriptions. Just you, your partner, and infinite lines of code.
        </p>
        <a
          href="/login"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs shadow-lg shadow-pink-500/25 hover:scale-105 transition-transform inline-block"
        >
          Link With Your Partner Now
        </a>
      </section>
    </div>
  );
}
