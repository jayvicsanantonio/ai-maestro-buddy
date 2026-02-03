import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { config } from './config/env.js';
import { DbStore } from './models/DbStore.js';
import type { IStore } from './models/Store.js';
import { createApiRouter } from './routes/api.js';
import { SocketService } from './services/SocketService.js';
import { errorHandler } from './middleware/error.js';

const { app } = expressWs(express());

// Initialize Core Services
const store: IStore = new DbStore();
const socketService = new SocketService(store);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// Routes
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', server: 'BFF' });
});

app.use('/api', createApiRouter(store));

// Error Handling
app.use(errorHandler);

// WebSocket
app.ws('/api/session/stream', (ws, _req) => {
  socketService.handleConnection(ws);
});

// Start Server
app.listen(config.port, () => {
  console.log(
    `BFF Server running at http://localhost:${config.port}`
  );
});

// Handle unhandled rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

process.on('uncaughtException', (err: Error) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});
