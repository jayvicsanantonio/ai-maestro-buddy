import fs from 'fs/promises';
import path from 'path';
import type { IStore } from './Store.js';
import type { StudentProfile, SessionData } from '../types/shared.js';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const STUDENTS_FILE = path.join(DATA_DIR, 'students.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');

export class FileStore implements IStore {
  private studentsCache: Map<string, StudentProfile> = new Map();
  private sessionsCache: Map<string, SessionData> = new Map();
  private isInitialized = false;

  constructor() {
    this.init();
  }

  private async init() {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });

      try {
        const studentsData = await fs.readFile(
          STUDENTS_FILE,
          'utf-8'
        );
        const students = JSON.parse(studentsData);
        this.studentsCache = new Map(Object.entries(students));
      } catch {
        // File doesn't exist or invalid, start empty
        await this.saveStudents();
      }

      try {
        const sessionsData = await fs.readFile(
          SESSIONS_FILE,
          'utf-8'
        );
        const sessions = JSON.parse(sessionsData);
        this.sessionsCache = new Map(Object.entries(sessions));
      } catch {
        await this.saveSessions();
      }

      this.isInitialized = true;
      console.log('FileStore initialized successfully');
    } catch (e) {
      console.error('Failed to initialize FileStore:', e);
    }
  }

  private async saveStudents() {
    const obj = Object.fromEntries(this.studentsCache);
    await fs.writeFile(STUDENTS_FILE, JSON.stringify(obj, null, 2));
  }

  private async saveSessions() {
    const obj = Object.fromEntries(this.sessionsCache);
    await fs.writeFile(SESSIONS_FILE, JSON.stringify(obj, null, 2));
  }

  async getStudent(uid: string): Promise<StudentProfile> {
    if (!this.isInitialized) await this.init();

    if (!this.studentsCache.has(uid)) {
      const newStudent: StudentProfile = {
        uid,
        createdAt: new Date().toISOString(),
        onboardingCompleted: false,
        skill: { tempo_stability: 0.5, confidence: 0.1 },
        preferences: { coach_style: 'encouraging', difficulty: 1 },
        character: {
          color: '#4FB8FF',
          accessory: 'none',
          eyeStyle: 'round',
        },
      };
      this.studentsCache.set(uid, newStudent);
      await this.saveStudents();
    }
    return this.studentsCache.get(uid)!;
  }

  async updateStudent(
    uid: string,
    data: Partial<StudentProfile>
  ): Promise<StudentProfile> {
    const student = await this.getStudent(uid);
    const updated = {
      ...student,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    this.studentsCache.set(uid, updated);
    await this.saveStudents();
    return updated;
  }

  async saveSession(
    sessionId: string,
    data: SessionData
  ): Promise<void> {
    if (!this.isInitialized) await this.init();

    this.sessionsCache.set(sessionId, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
    await this.saveSessions();
  }

  async getSession(sessionId: string): Promise<SessionData | null> {
    if (!this.isInitialized) await this.init();
    return this.sessionsCache.get(sessionId) || null;
  }
}
