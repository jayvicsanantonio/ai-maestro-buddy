import type { WebSocket } from 'ws';
import { GeminiCoach } from '../../agents/GeminiCoach.js';

export interface MessageContext {
  ws: WebSocket;
  sessionId: string | null;
  coach: GeminiCoach | null;
  metricsBuffer: any[];
}

export interface MessageHandler {
  type: string;
  handle(data: any, ctx: MessageContext): Promise<MessageContext>;
}
