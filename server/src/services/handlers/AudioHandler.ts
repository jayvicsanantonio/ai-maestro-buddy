import type { MessageHandler, MessageContext } from './types.js';
import { MultimodalLiveService } from '../MultimodalLiveService.js';

/**
 * Handler for 'audio' type messages.
 * Initializes the Multimodal Live service if not already present.
 */
export const AudioHandler: MessageHandler = {
  type: 'audio',
  async handle(
    data: any,
    ctx: MessageContext
  ): Promise<MessageContext> {
    if (!ctx.sessionId) return ctx;

    // Use a custom property on the context to persist the live service
    // In a real app, this would be managed by a service registry or class field
    if (!(ctx as any).liveService) {
      (ctx as any).liveService = new MultimodalLiveService(ctx.ws);
      await (ctx as any).liveService.setup();
    }

    if (data.audio) {
      (ctx as any).liveService.sendAudio(data.audio);
    }

    return ctx;
  },
};
