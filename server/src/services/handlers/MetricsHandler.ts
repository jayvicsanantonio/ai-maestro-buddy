import { config } from '../../config/env.js';
import type { MessageHandler, MessageContext } from './types.js';

const METRICS_BATCH_SIZE = 5;

/**
 * Handles WebSocket 'metrics' messages.
 * Buffers metrics and processes them through the AI coach when batch is ready.
 */
export const MetricsHandler: MessageHandler = {
  type: 'metrics',

  async handle(
    data: { metrics: any },
    ctx: MessageContext
  ): Promise<MessageContext> {
    const { metricsBuffer, coach, sessionId, ws } = ctx;

    if (!coach || !sessionId) {
      return ctx;
    }

    metricsBuffer.push(data.metrics);

    // Process every METRICS_BATCH_SIZE metrics
    if (metricsBuffer.length >= METRICS_BATCH_SIZE && coach) {
      console.log(`Processing metrics window for ${sessionId}`);

      // AI Processing
      const { feedback, toolTrace } = await coach.processMetrics(
        metricsBuffer
      );

      const responsePayload: any = {
        type: 'feedback',
        content: feedback,
        toolTrace,
      };

      // Tool Execution Handling
      if (toolTrace && toolTrace.status === 'success') {
        const { tool, args } = toolTrace;

        // MCP Calls
        if (
          [
            'get_rhythm_exercises',
            'get_music_fact',
            'get_theory_lesson',
          ].includes(tool)
        ) {
          try {
            const mcpRes = await fetch(config.mcpGatewayUrl, {
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
          ['update_ui', 'set_metronome', 'reward_badge'].includes(tool)
        ) {
          responsePayload.stateUpdate = { tool, args };
        }
      }

      ws.send(JSON.stringify(responsePayload));

      // Return with cleared buffer
      return {
        ...ctx,
        metricsBuffer: [],
      };
    }

    return ctx;
  },
};
