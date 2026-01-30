import type { WebSocket } from 'ws';
import { GeminiCoach } from '../../agents/GeminiCoach.js';
import { MultimodalLiveService } from '../MultimodalLiveService.js';
import type {
  PerformanceMetric,
  ClientMessage,
  ClientMessageType,
  ServerMessage,
} from '../../types/shared.js';

export type { ClientMessage, ClientMessageType, ServerMessage };

export interface MessageContext {
  ws: WebSocket;
  sessionId: string | null;
  coach: GeminiCoach | null;
  metricsBuffer: PerformanceMetric[];
  liveService?: MultimodalLiveService;
  liveServiceSetupPromise?: Promise<void>;
}

export interface MessageHandler {
  type: ClientMessageType;
  handle(
    data: ClientMessage,
    ctx: MessageContext
  ): Promise<MessageContext>;
}
