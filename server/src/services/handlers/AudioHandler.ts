import type {
  MessageHandler,
  MessageContext,
  ClientMessage,
} from './types.js';
import { MultimodalLiveService } from '../MultimodalLiveService.js';

/**
 * Handler for 'audio' type messages.
 * Initializes the Multimodal Live service if not already present.
 */
export const AudioHandler: MessageHandler = {
  type: 'audio',
  async handle(
    data: ClientMessage,
    ctx: MessageContext
  ): Promise<MessageContext> {
    if (!ctx.sessionId) return ctx;

    if (!ctx.liveService) {
      ctx.liveService = new MultimodalLiveService(ctx.ws);
      ctx.liveServiceSetupPromise = ctx.liveService.setup();
    }

    if (data.audio) {
      try {
        // Ensure setup is complete before sending audio
        await ctx.liveServiceSetupPromise;
        await ctx.liveService.sendAudio(data.audio);
      } catch (err) {
        console.error('Error handling audio stream:', err);
      }
    }

    return ctx;
  },
};
