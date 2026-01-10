import type { WebSocket } from 'ws';
import type { FileStore } from '../models/FileStore.js';
import { getHandler, type MessageContext } from './handlers/index.js';

/**
 * WebSocket service for handling real-time session communication.
 * Uses a handler registry pattern for message processing.
 */
export class SocketService {
  private store: FileStore;

  constructor(store: FileStore) {
    this.store = store;
  }

  /**
   * Handles a new WebSocket connection.
   * Sets up message handling and cleanup on close.
   */
  handleConnection(ws: WebSocket): void {
    console.log('New WebSocket connection');

    // Initialize connection context
    let ctx: MessageContext = {
      ws,
      sessionId: null,
      coach: null,
      metricsBuffer: [],
    };

    ws.on('message', async (msg: string) => {
      try {
        const data = JSON.parse(msg);
        const handler = getHandler(data.type);

        if (handler) {
          ctx = await handler.handle(data, ctx);
        } else {
          console.warn(`Unknown message type: ${data.type}`);
        }
      } catch (err) {
        console.error('Error processing WS message:', err);
      }
    });

    ws.on('close', () => {
      if (ctx.sessionId) {
        console.log(`WebSocket closed for session: ${ctx.sessionId}`);
      }
    });
  }
}
