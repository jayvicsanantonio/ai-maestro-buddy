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

    const sessionCtx = ctx as any;
    if (!sessionCtx.liveService) {
      sessionCtx.liveService = new MultimodalLiveService(ctx.ws);
      sessionCtx.liveServiceSetupPromise =
        sessionCtx.liveService.setup();
    }

    if (data.audio) {
      try {
        // Ensure setup is complete before sending audio
        await sessionCtx.liveServiceSetupPromise;
        await sessionCtx.liveService.sendAudio(data.audio);
      } catch (err) {
        console.error('Error handling audio stream:', err);
      }
    }

    return ctx;
  },
};
