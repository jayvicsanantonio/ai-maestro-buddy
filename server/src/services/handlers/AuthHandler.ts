import { GeminiCoach } from '../../agents/GeminiCoach.js';
import type { MessageHandler, MessageContext } from './types.js';

/**
 * Handles WebSocket 'auth' messages.
 * Initializes the session and creates a new GeminiCoach instance.
 */
export const AuthHandler: MessageHandler = {
  type: 'auth',

  async handle(
    data: { sessionId: string },
    ctx: MessageContext
  ): Promise<MessageContext> {
    const sessionId = data.sessionId;
    const coach = new GeminiCoach();

    console.log(`WebSocket authenticated for session: ${sessionId}`);

    ctx.ws.send(
      JSON.stringify({
        type: 'system',
        content: 'Connection ready',
      })
    );

    return {
      ...ctx,
      sessionId,
      coach,
    };
  },
};
