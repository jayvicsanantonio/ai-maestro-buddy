import type { WebSocket } from 'ws';
import type { IStore } from '../models/Store.js';
import { getHandler, type MessageContext } from './handlers/index.js';

/**
 * WebSocket service for handling real-time session communication.
 * Uses a handler registry pattern for message processing.
 */
export class SocketService {
  private store: IStore;

  constructor(store: IStore) {
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

    ws.on('message', async (msg: unknown) => {
      try {
        const raw =
          typeof msg === 'string'
            ? msg
            : Buffer.isBuffer(msg)
              ? msg.toString('utf-8')
              : msg instanceof ArrayBuffer
                ? Buffer.from(msg).toString('utf-8')
                : '';
        if (!raw) {
          console.warn('Received non-text WS message');
          return;
        }
        const data = JSON.parse(raw);
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
