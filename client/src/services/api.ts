import { config } from '../config';
import type { StudentProfile, SessionData } from '../types/shared';

/**
 * API service layer for centralized HTTP requests.
 * Provides typed methods for all API interactions.
 */
export const api = {
  /**
   * Starts a new session or retrieves existing session for a user.
   * @param uid - Optional user ID. If not provided, a guest session is created.
   */
  async startSession(uid?: string | null): Promise<SessionData> {
    const res = await fetch(config.api.endpoints.sessionStart, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid }),
    });

    if (!res.ok) {
      throw new Error(`Failed to start session: ${res.statusText}`);
    }

    return res.json();
  },

  /**
   * Updates a student's profile.
   * @param uid - User ID
   * @param updates - Partial profile updates to apply
   */
  async updateStudent(
    uid: string,
    updates: Partial<StudentProfile>
  ): Promise<{ student: StudentProfile }> {
    const res = await fetch(config.api.endpoints.studentUpdate, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, ...updates }),
    });

    if (!res.ok) {
      throw new Error(`Failed to update student: ${res.statusText}`);
    }

    return res.json();
  },

  /**
   * Synthesizes text to speech audio.
   * @param text - Text to convert to speech
   * @returns Audio blob for playback
   */
  async synthesizeSpeech(text: string): Promise<Blob> {
    const res = await fetch(config.api.endpoints.tts, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      throw new Error(`TTS failed: ${res.statusText}`);
    }

    return res.blob();
  },
};
