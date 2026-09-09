import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { SocketProvider } from '../context/SocketContext';
import Navbar from '../components/Navbar';

export const metadata: Metadata = {
  title: 'Code Together Duo - Coding Productivity for Couples',
  description: 'Pair programming accountability, shared tasks, Recharts analytics, and AI productivity insights for couples learning code together.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col selection:bg-pink-500/30 selection:text-pink-200">
        <AuthProvider>
          <SocketProvider>
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
