'use client';

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../lib/api';
import { Settings, Share2, Copy, CheckCircle2, LogOut, HeartCrack, User } from 'lucide-react';

export default function SettingsPage() {
  const { user, duo, refreshUser, logout } = useAuth();
  const [copied, setCopied] = useState(false);

  const inviteUrl = typeof window !== 'undefined' && duo?.code
    ? window.location.origin + '/invite/' + duo.code
    : 'https://code-together-duo.com/invite/' + (duo?.code || 'love-2026');

  const copyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const unlinkDuo = async () => {
    if (!confirm('Are you sure you want to unlink your duo? This will detach you from your current partner.')) return;
    try {
      await apiFetch('/duo/unlink', { method: 'POST' });
      await refreshUser();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white">Profile & Settings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your account profile, duo connection link, and partnership preferences.
        </p>
      </div>

      {/* Profile Card */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-800 mb-4">
          User Profile
        </h2>
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-primary/50"
          />
          <div>
            <h3 className="text-base font-bold text-white">{user?.name}</h3>
            <p className="text-xs text-slate-400 font-mono">@{user?.username}</p>
            <p className="text-xs text-slate-300 mt-1">{user?.bio}</p>
          </div>
        </div>
      </div>

      {/* Duo Invite Link Card (Core Feature #2) */}
      <div className="rounded-3xl border border-pink-500/30 bg-slate-900/60 p-6 shadow-xl">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-4">
          <Share2 className="w-4 h-4 text-pink-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Personal Duo Invite Link</h2>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Share this link with your partner. When they open and accept it, you both will be permanently linked on the platform.
        </p>

        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={inviteUrl}
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-pink-300 font-mono text-xs focus:outline-none"
          />
          <button
            onClick={copyLink}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold shadow-md hover:scale-105 transition-all flex items-center gap-1.5"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-3xl border border-red-500/30 bg-red-950/10 p-6 shadow-xl">
        <h2 className="text-sm font-bold text-red-400 uppercase tracking-wider pb-3 border-b border-red-500/20 mb-4">
          Danger Zone
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-white">Unlink Current Duo Partner</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Detach from your current partner to link with a new invite.</p>
          </div>
          <button
            onClick={unlinkDuo}
            className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <HeartCrack className="w-3.5 h-3.5" />
            Unlink Duo
          </button>
        </div>
      </div>
    </div>
  );
}
