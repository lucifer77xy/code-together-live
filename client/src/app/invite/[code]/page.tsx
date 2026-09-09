'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import { Heart, Users, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

export default function InvitePage() {
  const params = useParams();
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [inviteData, setInviteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState('');

  const code = params.code as string;

  useEffect(() => {
    if (code) {
      apiFetch('/duo/invite/' + code)
        .then(res => {
          if (res.success) setInviteData(res.duo);
          else setError(res.message);
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [code]);

  const acceptInvite = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    setAccepting(true);
    try {
      const res = await apiFetch('/duo/accept', {
        method: 'POST',
        body: JSON.stringify({ code }),
      });
      if (res.success) {
        await refreshUser();
        router.push('/dashboard');
      } else {
        setError(res.message);
      }
    } catch (e: any) {
      setError(e.message || 'Failed to accept invite');
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-pink-500 rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-medium">Verifying duo invite link...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4">
        <p className="text-sm text-red-400 font-semibold">{error}</p>
        <a href="/dashboard" className="text-xs text-pink-400 hover:underline inline-block">Return to Dashboard</a>
      </div>
    );
  }

  const partner1 = inviteData?.partner1;

  return (
    <div className="max-w-md mx-auto py-12 text-center">
      <div className="rounded-3xl border border-pink-500/30 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-xl mb-6">
          <Heart className="w-8 h-8 fill-white animate-pulse" />
        </div>

        <h2 className="text-2xl font-black text-white mb-2">Duo Invitation</h2>
        <p className="text-xs text-slate-400 mb-6">
          You have been invited to link as permanent coding partners on Code Together Duo!
        </p>

        {partner1 && (
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 mb-6 flex items-center gap-4 text-left">
            <img
              src={partner1.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={partner1.name}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-pink-500/50"
            />
            <div>
              <h4 className="text-sm font-bold text-white">{partner1.name}</h4>
              <p className="text-xs text-slate-400 font-mono">@{partner1.username}</p>
              <p className="text-[11px] text-pink-300 mt-1">{partner1.bio}</p>
            </div>
          </div>
        )}

        <button
          onClick={acceptInvite}
          disabled={accepting}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm shadow-lg shadow-primary/30 hover:scale-105 transition-all flex items-center justify-center gap-2"
        >
          <Users className="w-4 h-4" />
          {accepting ? 'Linking Duo...' : 'Accept & Link as Duo Partner 💕'}
        </button>
      </div>
    </div>
  );
}
