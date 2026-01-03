import type { StudentProfile } from '../types/shared.js';

export interface IStore {
  getStudent(uid: string): Promise<StudentProfile>;
  updateStudent(
    uid: string,
    data: Partial<StudentProfile>
  ): Promise<StudentProfile>;
  saveSession(sessionId: string, data: any): Promise<void>;
  getSession(sessionId: string): Promise<any | null>;
}
