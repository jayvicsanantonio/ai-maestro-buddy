import type { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { FileStore } from '../models/FileStore.js';
import type { QuestState, SessionData } from '../types/shared.js';

export class SessionController {
  private store: FileStore;

  constructor(store: FileStore) {
    this.store = store;
  }

  startSession = async (req: Request, res: Response) => {
    const uid = req.body.uid || `guest-${uuidv4().slice(0, 8)}`;
    const sessionId = uuidv4();

    const student = await this.store.getStudent(uid);

    const questState: QuestState = {
      sessionId,
      uid,
      quest: 'rhythm',
      bpm: 80,
      status: 'idle',
    };

    const sessionData: SessionData = {
      sessionId,
      uid,
      student,
      questState,
    };

    await this.store.saveSession(sessionId, sessionData);

    res.json(sessionData);
  };
}
