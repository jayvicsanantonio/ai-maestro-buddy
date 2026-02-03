import { Router } from 'express';
import { SessionController } from '../controllers/SessionController.js';
import { StudentController } from '../controllers/StudentController.js';
import { TTSController } from '../controllers/TTSController.js';
import { validate } from '../middleware/validate.js';
import {
  startSessionSchema,
  updateStudentSchema,
  ttsSchema,
} from '../schemas/api.js';
import type { IStore } from '../models/Store.js';

/**
 * Creates the main API router with all endpoints.
 * @param store - The data store instance for persistence
 */
export const createApiRouter = (store: IStore): Router => {
  const router = Router();

  // Controllers
  const sessionController = new SessionController(store);
  const studentController = new StudentController(store);
  const ttsController = new TTSController();

  // Session endpoints
  router.post(
    '/session/start',
    validate(startSessionSchema),
    sessionController.startSession
  );

  // Student endpoints
  router.post(
    '/student/update',
    validate(updateStudentSchema),
    studentController.updateProfile
  );

  // TTS endpoints
  router.post('/tts', validate(ttsSchema), ttsController.synthesize);

  return router;
};
