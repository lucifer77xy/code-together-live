import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { ENV } from '../config/env';

let io: Server | null = null;

export function initSocket(server: HttpServer): Server {
  io = new Server(server, {
    cors: {
      origin: [ENV.FRONTEND_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      credentials: true,
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log('[Socket] Client connected: ' + socket.id);

    socket.on('join_duo', (duoId: string) => {
      if (duoId) {
        socket.join('duo:' + duoId);
        socket.to('duo:' + duoId).emit('partner_presence', { status: 'ONLINE', timestamp: new Date() });
      }
    });

    socket.on('partner_action', (data: { duoId: string; action: string; user: string }) => {
      if (data.duoId) {
        socket.to('duo:' + data.duoId).emit('partner_activity', data);
      }
    });

    socket.on('trigger_celebration', (data: { duoId: string; title: string; user: string }) => {
      if (data.duoId) {
        io?.to('duo:' + data.duoId).emit('celebrate', data);
      }
    });

    socket.on('disconnect', () => {
      console.log('[Socket] Client disconnected: ' + socket.id);
    });
  });

  return io;
}

export function getIO(): Server {
  if (!io) throw new Error('Socket.io has not been initialized');
  return io;
}

export function emitToDuo(duoId: string, event: string, payload: any) {
  if (io) {
    io.to('duo:' + duoId).emit(event, payload);
  }
}
