import { Router } from 'express';
import { SessionController } from '../controllers/SessionController.js';
import { StudentController } from '../controllers/StudentController.js';
import { ttsService } from '../services/TTSService.js';
import { FileStore } from '../models/FileStore.js';

export const createApiRouter = (store: FileStore) => {
  const router = Router();
  const sessionController = new SessionController(store);
  const studentController = new StudentController(store);

  // Session
  router.post('/session/start', sessionController.startSession);

  // Student
  router.post('/student/update', studentController.updateProfile);

  // TTS
  router.post('/tts', async (req, res) => {
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
  });

  return router;
};
