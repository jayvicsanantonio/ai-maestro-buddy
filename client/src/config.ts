/**
 * Client configuration.
 * Centralized configuration values for the frontend application.
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const WS_BASE_URL =
  import.meta.env.VITE_WS_URL || 'ws://localhost:3001';

export const config = {
  api: {
    baseUrl: API_BASE_URL,
    endpoints: {
      sessionStart: `${API_BASE_URL}/session/start`,
      studentUpdate: `${API_BASE_URL}/student/update`,
      tts: `${API_BASE_URL}/tts`,
    },
  },
  ws: {
    baseUrl: WS_BASE_URL,
    sessionStream: `${WS_BASE_URL}/api/session/stream`,
  },
} as const;
