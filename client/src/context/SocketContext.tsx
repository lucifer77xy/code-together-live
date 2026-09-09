'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type?: 'success' | 'info' | 'celebration';
}

interface SocketContextType {
  socket: Socket | null;
  onlinePartner: boolean;
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
  triggerCelebration: (title: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { duo, user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlinePartner, setOnlinePartner] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addToast = (title: string, message: string, type: 'success' | 'info' | 'celebration' = 'info') => {
    const newToast: ToastMessage = { id: Math.random().toString(), title, message, type };
    setToasts(prev => [newToast, ...prev].slice(0, 5));
    setTimeout(() => removeToast(newToast.id), 6000);
  };

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5000';
    const s = io(socketUrl, { withCredentials: true });
    setSocket(s);

    s.on('connect', () => {
      if (duo?.id) {
        s.emit('join_duo', duo.id);
      }
    });

    s.on('partner_presence', () => {
      setOnlinePartner(true);
    });

    s.on('task:created', (data: any) => {
      addToast('New Duo Task Created', data.author + ' added: "' + data.task.title + '"', 'info');
    });

    s.on('task:updated', (data: any) => {
      if (data.task.status === 'COMPLETED') {
        addToast('Task Completed! 🎉', data.user + ' completed "' + data.task.title + '"', 'celebration');
      }
    });

    s.on('codingLog:created', (data: any) => {
      addToast('Coding Session Logged! 🔥', data.author + ' logged ' + data.log.hoursStudied + ' hours!', 'success');
    });

    s.on('celebrate', (data: any) => {
      addToast('Celebration! 💖', data.user + ' achieved: ' + data.title, 'celebration');
    });

    return () => {
      s.disconnect();
    };
  }, [duo?.id]);

  const triggerCelebration = (title: string) => {
    if (socket && duo?.id && user) {
      socket.emit('trigger_celebration', { duoId: duo.id, title, user: user.name });
    }
  };

  return (
    <SocketContext.Provider value={{ socket, onlinePartner, toasts, removeToast, triggerCelebration }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className="pointer-events-auto p-4 rounded-xl border border-primary/30 bg-slate-900/90 backdrop-blur-md shadow-2xl text-slate-100 transition-all transform translate-y-0 animate-in fade-in slide-in-from-bottom-2 flex items-start gap-3"
          >
            <div className="text-2xl mt-0.5">
              {t.type === 'celebration' ? '🎉' : t.type === 'success' ? '🔥' : '💌'}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm text-pink-300">{t.title}</h4>
              <p className="text-xs text-slate-300 mt-0.5">{t.message}</p>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-slate-100 text-xs font-bold"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket must be used within a SocketProvider');
  return context;
}
