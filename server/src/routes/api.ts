import { Router } from 'express';
import { SessionController } from '../controllers/SessionController.js';
import { StudentController } from '../controllers/StudentController.js';
import { TTSController } from '../controllers/TTSController.js';
import type { FileStore } from '../models/FileStore.js';

/**
 * Creates the main API router with all endpoints.
 * @param store - The data store instance for persistence
 */
export const createApiRouter = (store: FileStore): Router => {
  const router = Router();

  // Controllers
  const sessionController = new SessionController(store);
  const studentController = new StudentController(store);
  const ttsController = new TTSController();

  // Session endpoints
  router.post('/session/start', sessionController.startSession);

  // Student endpoints
  router.post('/student/update', studentController.updateProfile);

  // TTS endpoints
  router.post('/tts', ttsController.synthesize);

  return router;
};
