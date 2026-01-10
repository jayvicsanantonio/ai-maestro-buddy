import type { Request, Response } from 'express';
import { ttsService } from '../services/TTSService.js';

/**
 * Controller for Text-to-Speech operations.
 * Handles voice synthesis requests for the MaestroBuddy coaching system.
 */
export class TTSController {
  /**
   * Synthesizes text to speech audio.
   * Returns audio/mpeg content on success.
   */
  synthesize = async (req: Request, res: Response): Promise<void> => {
    const { text } = req.body;

    if (!text) {
      res.status(400).json({ error: 'Text is required' });
      return;
    }

    const audio = await ttsService.synthesize(text);

    if (!audio) {
      res.status(500).json({ error: 'Voice synthesis failed' });
      return;
    }

    res.set('Content-Type', 'audio/mpeg');
    res.send(Buffer.from(audio));
  };
}
