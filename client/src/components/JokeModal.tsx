'use client';

import React, { useState } from 'react';
import { apiFetch } from '../lib/api';
import { useSocket } from '../context/SocketContext';
import { Sparkles, Laugh, RefreshCw, X, Heart } from 'lucide-react';

interface JokeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JokeModal({ isOpen, onClose }: JokeModalProps) {
  const { triggerCelebration } = useSocket();
  const [joke, setJoke] = useState<{ setup: string; punchline: string } | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchJoke = async () => {
    setLoading(true);
    setRevealed(false);
    try {
      const data = await apiFetch('/jokes/random');
      if (data.success) {
        setJoke(data.joke);
      }
    } catch (e) {
      setJoke({
        setup: 'Why do programmers love relationships?',
        punchline: 'Because they finally found someone who understands their bugs!',
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      fetchJoke();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-pink-500/30 p-8 shadow-2xl text-center overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-pink-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Joke Icon */}
        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/30 mb-6">
          <Laugh className="w-7 h-7 animate-bounce" />
        </div>

        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400 mb-4">
          Code & Couple Humor
        </h3>

        {/* Joke Card */}
        <div className="min-h-[140px] flex flex-col items-center justify-center bg-slate-950/60 rounded-2xl p-6 border border-slate-800 mb-6">
          {loading ? (
            <p className="text-sm text-slate-400 animate-pulse">Fetching a giggle for you two...</p>
          ) : (
            <>
              <p className="text-base font-semibold text-slate-100 mb-3">
                "{joke?.setup}"
              </p>
              {revealed ? (
                <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-300 font-bold text-sm animate-in zoom-in-95 duration-300">
                  ✨ {joke?.punchline} ✨
                </div>
              ) : (
                <button
                  onClick={() => setRevealed(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-xs font-bold text-white shadow-md hover:scale-105 transition-transform"
                >
                  Reveal Punchline 🎭
                </button>
              )}
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={fetchJoke}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            <RefreshCw className={"w-3.5 h-3.5 " + (loading ? "animate-spin" : "")} />
            Another Joke
          </button>

          <button
            onClick={() => {
              triggerCelebration('Shared a couple joke laugh! 😂');
              onClose();
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-semibold shadow-lg shadow-pink-500/20 hover:scale-105 transition-transform"
          >
            <Heart className="w-3.5 h-3.5 fill-white" />
            Send Smile to Partner
          </button>
        </div>
      </div>
    </div>
  );
}
