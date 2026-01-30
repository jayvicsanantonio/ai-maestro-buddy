import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import { FileStore } from './FileStore.js';
import type { SessionData, StudentProfile } from '../types/shared.js';

vi.mock('fs/promises');

describe('FileStore', () => {
  let store: FileStore;

  beforeEach(() => {
    vi.clearAllMocks();
    store = new FileStore();
  });

  it('should correctly store and retrieve a session', async () => {
    const sessionId = 'test-session';
    const sessionData: SessionData = {
      sessionId,
      uid: 'user-123',
      student: {
        uid: 'user-123',
        onboardingCompleted: true,
      } as any,
      questState: {
        sessionId,
        uid: 'user-123',
        quest: 'rhythm',
        bpm: 100,
        status: 'playing',
      },
    };

    // Mock successful init and write
    (fs.mkdir as any).mockResolvedValue(undefined);
    (fs.readFile as any).mockImplementation((filePath: string) => {
      if (filePath.endsWith('students.json'))
        return Promise.resolve('[]');
      if (filePath.endsWith('sessions.json'))
        return Promise.resolve('[]');
      return Promise.reject(new Error('File not found'));
    });
    (fs.writeFile as any).mockResolvedValue(undefined);

    await store.saveSession(sessionId, sessionData);
    const retrieved = await store.getSession(sessionId);

    expect(retrieved).toMatchObject(sessionData);
    expect(retrieved?.updatedAt).toBeDefined();
  });

  it('should return null for non-existent session', async () => {
    (fs.mkdir as any).mockResolvedValue(undefined);
    (fs.readFile as any).mockResolvedValue('[]');

    const retrieved = await store.getSession('invalid-id');
    expect(retrieved).toBeNull();
  });
});
