import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const { app, getWss } = expressWs(express());
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// WebSocket for real-time coaching
app.ws('/api/session/stream', (ws, req) => {
  console.log('New WebSocket connection');

  ws.on('message', (msg) => {
    console.log('Received message:', msg);
    // TODO: Forward to Agent Engine
    ws.send(
      JSON.stringify({
        type: 'feedback',
        content: 'Connection established!',
      })
    );
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

app.listen(port, () => {
  console.log(`BFF Server running at http://localhost:${port}`);
});
