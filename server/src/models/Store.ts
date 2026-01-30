import type { StudentProfile, SessionData } from '../types/shared.js';

export interface IStore {
  getStudent(uid: string): Promise<StudentProfile>;
  updateStudent(
    uid: string,
    data: Partial<StudentProfile>
  ): Promise<StudentProfile>;
  saveSession(sessionId: string, data: SessionData): Promise<void>;
  getSession(sessionId: string): Promise<SessionData | null>;
}
