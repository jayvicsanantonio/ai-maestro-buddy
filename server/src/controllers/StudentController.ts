import type { Request, Response } from 'express';
import { FileStore } from '../models/FileStore.js';

export class StudentController {
  private store: FileStore;

  constructor(store: FileStore) {
    this.store = store;
  }

  updateProfile = async (req: Request, res: Response) => {
    const { uid, ...updates } = req.body;
    if (!uid) {
      res.status(400).json({ error: 'UID is required' });
      return;
    }

    const student = await this.store.updateStudent(uid, updates);
    res.json({ student });
  };
}
