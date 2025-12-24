import express, { type Request, type Response } from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { GeminiCoach } from './agents/GeminiCoach.js';
import fetch from 'node-fetch';
import textToSpeech from '@google-cloud/text-to-speech';

dotenv.config();

const MCP_GATEWAY_URL =
  process.env.MCP_GATEWAY_URL || 'http://localhost:3002/mcp/execute';

const { app, getWss } = expressWs(express());
const port = process.env.PORT || 3001;

let ttsClient: textToSpeech.TextToSpeechClient | null = null;
try {
  // We initialize lazily or inside a try catch to prevent startup crash if no ADC
  ttsClient = new textToSpeech.TextToSpeechClient();
} catch (e) {
  console.error('Failed to initialize Google Cloud TTS Client:', e);
}

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
        character: {
          color: '#4FB8FF',
          accessory: 'none',
          eyeStyle: 'round',
        },
      });
    }
    return this.students.get(uid);
  }

  updateStudent(uid: string, data: any) {
    const student = this.getStudent(uid);
    const updated = {
      ...student,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    this.students.set(uid, updated);
    return updated;
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

// Update student profile (e.g. character settings)
app.post('/api/student/update', (req: Request, res: Response) => {
  const { uid, ...updates } = req.body;
  if (!uid) {
    res.status(400).json({ error: 'UID is required' });
    return;
  }

  const student = store.updateStudent(uid, updates);
  res.json({ student });
});

// Text-to-Speech proxy
app.post('/api/tts', async (req: Request, res: Response) => {
  const { text } = req.body;
  if (!text) {
    res.status(400).json({ error: 'Text is required' });
    return;
  }

  if (!ttsClient) {
    res.status(503).json({
      error: 'TTS service not initialized. Check credentials.',
    });
    return;
  }

  try {
    const [response] = await ttsClient.synthesizeSpeech({
      input: { text },
      voice: {
        languageCode: 'en-US',
        name: 'en-US-Journey-F', // Premium Journey voice
      },
      audioConfig: { audioEncoding: 'MP3' },
    });

    res.set('Content-Type', 'audio/mpeg');
    res.send(response.audioContent);
  } catch (err) {
    console.error('TTS Error:', err);
    res.status(500).json({ error: 'Voice synthesis failed' });
  }
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

          let responsePayload: any = {
            type: 'feedback',
            content: feedback,
            toolTrace,
          };

          // Handle Tool Call Execution
          if (toolTrace && toolTrace.status === 'success') {
            const { tool, args } = toolTrace;

            if (tool === 'get_rhythm_exercises') {
              try {
                const mcpRes = await fetch(MCP_GATEWAY_URL, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ tool, args }),
                });
                const result = await mcpRes.json();
                responsePayload.mcpResult = result;
              } catch (err) {
                console.error('MCP Tool Execution Error:', err);
                responsePayload.toolTrace.status = 'error';
              }
            }

            // Local updates (UI, Metronome) are just passed to client
            if (
              tool === 'update_ui' ||
              tool === 'set_metronome' ||
              tool === 'reward_badge'
            ) {
              responsePayload.stateUpdate = { tool, args };
            }
          }

          ws.send(JSON.stringify(responsePayload));
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
