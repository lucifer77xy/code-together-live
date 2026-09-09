import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { ENV } from './config/env';
import { initSocket } from './socket';

import { authRouter } from './routes/auth.routes';
import { duoRouter } from './routes/duo.routes';
import { taskRouter } from './routes/task.routes';
import { codingLogRouter } from './routes/codingLog.routes';
import { analyticsRouter } from './routes/analytics.routes';
import { aiRouter } from './routes/ai.routes';
import { motivationRouter } from './routes/motivation.routes';
import { jokeRouter } from './routes/joke.routes';
import { achievementRouter } from './routes/achievement.routes';
import { notificationRouter } from './routes/notification.routes';

const app = express();
const server = http.createServer(app);

initSocket(server);

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: [ENV.FRONTEND_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
}));
app.use(express.json());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Code Together Duo Backend', timestamp: new Date() });
});

app.use('/api/auth', authRouter);
app.use('/api/duo', duoRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/logs', codingLogRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/ai', aiRouter);
app.use('/api/motivation', motivationRouter);
app.use('/api/jokes', jokeRouter);
app.use('/api/achievements', achievementRouter);
app.use('/api/notifications', notificationRouter);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal Server Error' });
});

server.listen(ENV.PORT, () => {
  console.log('✨ [Code Together Duo] Backend running on port ' + ENV.PORT + ' [' + ENV.NODE_ENV + ']');
  console.log('🔗 Sockets listening, Frontend origin: ' + ENV.FRONTEND_URL);
});
