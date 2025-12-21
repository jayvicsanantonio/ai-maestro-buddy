import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const { app, getWss } = expressWs(express());
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- Persistence Layer (Mock) ---
class Store {
  private students = new Map<string, any>();
  private sessions = new Map<string, any>();

  getStudent(uid: string) {
    if (!this.students.has(uid)) {
      this.students.set(uid, {
        uid,
        createdAt: new Date().toISOString(),
        skill: { tempo_stability: 0.5, confidence: 0.1 },
        preferences: { coach_style: 'encouraging', difficulty: 1 },
      });
    }
    return this.students.get(uid);
  }

  saveSession(sessionId: string, data: any) {
    this.sessions.set(sessionId, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  }

  getSession(sessionId: string) {
    return this.sessions.get(sessionId);
  }
}

const store = new Store();

// --- BFF Endpoints ---

// Pre-flight / Health
app.get('/health', (req, res) => {
  res.json({ status: 'ok', server: 'BFF' });
});

// Start a new session
app.post('/api/session/start', (req, res) => {
  const uid = req.body.uid || `guest-${uuidv4().slice(0, 8)}`;
  const sessionId = uuidv4();

  const student = store.getStudent(uid);

  const questState = {
    sessionId,
    uid,
    quest: 'rhythm',
    bpm: 80,
    status: 'idle',
  };

  store.saveSession(sessionId, questState);

  res.json({
    sessionId,
    uid,
    student,
    questState,
  });
});

// WebSocket for real-time coaching and metrics
app.ws('/api/session/stream', (ws, req) => {
  console.log('New WebSocket connection');
  let currentSessionId: string | null = null;

  ws.on('message', (msg: string) => {
    try {
      const data = JSON.parse(msg);

      if (data.type === 'auth') {
        currentSessionId = data.sessionId;
        console.log(
          `WebSocket authenticated for session: ${currentSessionId}`
        );
        ws.send(
          JSON.stringify({
            type: 'system',
            content: 'Connection ready',
          })
        );
        return;
      }

      if (data.type === 'metrics') {
        console.log(
          `Received metrics for session ${currentSessionId}:`,
          data.metrics
        );
        // TODO: Forward to Agent Engine / Lesson Planner
        // For now, mock a response
        ws.send(
          JSON.stringify({
            type: 'feedback',
            content: 'I see you clapping! Keep it up.',
            toolTrace: {
              tool: 'analyze_audio_window',
              status: 'success',
              args: data.metrics,
            },
          })
        );
      }
    } catch (err) {
      console.error('Error processing WS message:', err);
    }
  });

  ws.on('close', () => {
    console.log(
      `WebSocket connection closed for session: ${currentSessionId}`
    );
  });
});

app.listen(port, () => {
  console.log(`BFF Server running at http://localhost:${port}`);
});
