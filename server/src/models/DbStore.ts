import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { students, sessions } from '../db/schema.js';
import type { IStore } from './Store.js';
import type { StudentProfile, SessionData } from '../types/shared.js';

export class DbStore implements IStore {
  async getStudent(uid: string): Promise<StudentProfile> {
    const [existing] = await db
      .select()
      .from(students)
      .where(eq(students.uid, uid));

    if (existing) {
      return {
        ...existing,
        skill: JSON.parse(existing.skill),
        preferences: JSON.parse(existing.preferences),
        character: JSON.parse(existing.character),
      } as StudentProfile;
    }

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

    await db.insert(students).values({
      uid: newStudent.uid,
      createdAt: newStudent.createdAt,
      onboardingCompleted: newStudent.onboardingCompleted,
      skill: JSON.stringify(newStudent.skill),
      preferences: JSON.stringify(newStudent.preferences),
      character: JSON.stringify(newStudent.character),
    });

    return newStudent;
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

    const updateValues: Record<string, unknown> = {
      updatedAt: updated.updatedAt,
    };

    if (data.onboardingCompleted !== undefined)
      updateValues.onboardingCompleted = data.onboardingCompleted;
    if (data.skill) updateValues.skill = JSON.stringify(data.skill);
    if (data.preferences)
      updateValues.preferences = JSON.stringify(data.preferences);
    if (data.character)
      updateValues.character = JSON.stringify(data.character);

    await db
      .update(students)
      .set(updateValues)
      .where(eq(students.uid, uid));

    return updated;
  }

  async saveSession(
    sessionId: string,
    data: SessionData
  ): Promise<void> {
    await db
      .insert(sessions)
      .values({
        sessionId,
        uid: data.uid,
        updatedAt: new Date().toISOString(),
        data: JSON.stringify(data),
      })
      .onConflictDoUpdate({
        target: sessions.sessionId,
        set: {
          updatedAt: new Date().toISOString(),
          data: JSON.stringify(data),
        },
      });
  }

  async getSession(sessionId: string): Promise<SessionData | null> {
    const [session] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.sessionId, sessionId));

    if (!session) return null;
    return JSON.parse(session.data) as SessionData;
  }
}
