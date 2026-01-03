import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import { config } from './config/env.js';
import { FileStore } from './models/FileStore.js';
import { createApiRouter } from './routes/api.js';
import { SocketService } from './services/SocketService.js';

const { app } = expressWs(express());

// Initialize Core Services
const store = new FileStore();
const socketService = new SocketService(store);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', server: 'BFF' });
});

app.use('/api', createApiRouter(store));

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
