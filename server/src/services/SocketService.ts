import type { WebSocket } from 'ws';
import { GeminiCoach } from '../agents/GeminiCoach.js';
import { FileStore } from '../models/FileStore.js';

const MCP_GATEWAY_URL =
  process.env.MCP_GATEWAY_URL || 'http://localhost:3002/mcp/execute';

export class SocketService {
  private store: FileStore;

  constructor(store: FileStore) {
    this.store = store;
  }

  handleConnection(ws: WebSocket) {
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
          metricsBuffer.push(data.metrics);

          // Process every 5 metrics
          if (metricsBuffer.length >= 5 && coach) {
            console.log(
              `Processing metrics window for ${currentSessionId}`
            );

            // AI Processing
            const { feedback, toolTrace } =
              await coach.processMetrics(metricsBuffer);

            const responsePayload: any = {
              type: 'feedback',
              content: feedback,
              toolTrace,
            };

            // Tool Execution Handling
            if (toolTrace && toolTrace.status === 'success') {
              const { tool, args } = toolTrace;

              // MCP Calls
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

              // Local UI/Game State Updates
              if (
                [
                  'update_ui',
                  'set_metronome',
                  'reward_badge',
                  'get_music_fact',
                ].includes(tool)
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
      if (currentSessionId) {
        console.log(
          `WebSocket closed for session: ${currentSessionId}`
        );
      }
    });
  }
}
