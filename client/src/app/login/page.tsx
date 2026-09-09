'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Heart, Github, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { loginWithToken, devLogin, user } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      loginWithToken(token).then(() => {
        router.push('/dashboard');
      });
    }
  }, [searchParams]);

  const handleGithubLogin = () => {
    window.location.href = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api') + '/auth/github';
  };

  return (
    <div className="max-w-md mx-auto py-12 text-center">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-xl shadow-primary/30 mb-6">
          <Heart className="w-8 h-8 fill-white/80 animate-pulse" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Welcome to Duo</h2>
        <p className="text-xs text-slate-400 mb-8">
          Sign in with GitHub to link with your partner and access your shared accountability board.
        </p>

        {/* Official GitHub Login */}
        <button
          onClick={handleGithubLogin}
          className="w-full py-3.5 px-4 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-slate-700 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.02] mb-6 group"
        >
          <Github className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
          <span>Continue with GitHub</span>
        </button>

        <div className="relative flex py-2 items-center mb-6">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">
            Or Quick Test Demo
          </span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* Dev 1-Click Login buttons */}
        <div className="space-y-2.5">
          <button
            onClick={async () => {
              setLoading(true);
              await devLogin('maya_codes');
              router.push('/dashboard');
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-primary/20 hover:bg-primary/30 border border-primary/40 text-purple-200 text-xs font-semibold flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-2">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50"
                alt="Maya"
                className="w-6 h-6 rounded-full object-cover"
              />
              <span>Sign in as Maya Lin (Partner 1)</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-purple-300" />
          </button>

          <button
            onClick={async () => {
              setLoading(true);
              await devLogin('alex_dev');
              router.push('/dashboard');
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-secondary/20 hover:bg-secondary/30 border border-secondary/40 text-pink-200 text-xs font-semibold flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-2">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50"
                alt="Alex"
                className="w-6 h-6 rounded-full object-cover"
              />
              <span>Sign in as Alex Chen (Partner 2)</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-pink-300" />
          </button>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>End-to-end encrypted duo link session</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs text-slate-400">Loading duo login...</div>}>
      <LoginContent />
    </Suspense>
  );
}
