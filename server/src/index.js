import express, {} from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { GeminiCoach } from './agents/GeminiCoach.js';
import fetch from 'node-fetch';
dotenv.config();
const MCP_GATEWAY_URL = process.env.MCP_GATEWAY_URL || 'http://localhost:3002/mcp/execute';
const { app, getWss } = expressWs(express());
const port = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());
// --- Persistence Layer (Mock) ---
class Store {
    students = new Map();
    sessions = new Map();
    getStudent(uid) {
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
    saveSession(sessionId, data) {
        this.sessions.set(sessionId, {
            ...data,
            updatedAt: new Date().toISOString(),
        });
    }
    getSession(sessionId) {
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
    let currentSessionId = null;
    let coach = null;
    let metricsBuffer = [];
    ws.on('message', async (msg) => {
        try {
            const data = JSON.parse(msg);
            if (data.type === 'auth') {
                currentSessionId = data.sessionId;
                coach = new GeminiCoach();
                console.log(`WebSocket authenticated and Coach initialized for session: ${currentSessionId}`);
                ws.send(JSON.stringify({
                    type: 'system',
                    content: 'Connection ready',
                }));
                return;
            }
            if (data.type === 'metrics') {
                metricsBuffer.push(data.metrics);
                // Process every 5 metrics (roughly 1.5 - 3 seconds of activity)
                if (metricsBuffer.length >= 5 && coach) {
                    console.log(`Processing window of ${metricsBuffer.length} metrics for ${currentSessionId}`);
                    const { feedback, toolTrace } = await coach.processMetrics(metricsBuffer);
                    let responsePayload = {
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
                            }
                            catch (err) {
                                console.error('MCP Tool Execution Error:', err);
                                responsePayload.toolTrace.status = 'error';
                            }
                        }
                        // Local updates (UI, Metronome) are just passed to client
                        if (tool === 'update_ui' ||
                            tool === 'set_metronome' ||
                            tool === 'reward_badge') {
                            responsePayload.stateUpdate = { tool, args };
                        }
                    }
                    ws.send(JSON.stringify(responsePayload));
                    metricsBuffer = []; // Clear buffer
                }
            }
        }
        catch (err) {
            console.error('Error processing WS message:', err);
        }
    });
    ws.on('close', () => {
        console.log(`WebSocket connection closed for session: ${currentSessionId}`);
    });
});
app.listen(port, () => {
    console.log(`BFF Server running at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map