import express, { Request, Response } from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { GeminiCoach } from './agents/GeminiCoach.js';

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
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', server: 'BFF' });
});

// Start a new session
app.post('/api/session/start', (req: Request, res: Response) => {
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
  let coach: GeminiCoach | null = null;
  let metricsBuffer: any[] = [];

  ws.on('message', async (msg: string) => {
    try {
      const data = JSON.parse(msg);

      if (data.type === 'auth') {
        currentSessionId = data.sessionId;
        coach = new GeminiCoach();
        console.log(
          `WebSocket authenticated and Coach initialized for session: ${currentSessionId}`
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
        metricsBuffer.push(data.metrics);

        // Process every 5 metrics (roughly 1.5 - 3 seconds of activity)
        if (metricsBuffer.length >= 5 && coach) {
          console.log(
            `Processing window of ${metricsBuffer.length} metrics for ${currentSessionId}`
          );
          const { feedback, toolTrace } = await coach.processMetrics(
            metricsBuffer
          );

          ws.send(
            JSON.stringify({
              type: 'feedback',
              content: feedback,
              toolTrace,
            })
          );

          metricsBuffer = []; // Clear buffer
        }
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
