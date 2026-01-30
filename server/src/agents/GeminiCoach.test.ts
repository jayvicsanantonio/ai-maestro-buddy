import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GeminiCoach } from './GeminiCoach.js';
import type { PerformanceMetric } from '../types/shared.js';

// Mock config
vi.mock('../config/env.js', () => ({
  config: {
    projectId: 'test-project',
    location: 'us-central1',
    geminiModel: 'gemini-2.0-flash-exp',
  },
}));

// Mock the GoogleGenAI SDK to match GeminiCoach.ts implementation
vi.mock('@google/genai', () => {
  const mockChat = {
    sendMessage: vi.fn(),
  };
  return {
    GoogleGenAI: vi.fn().mockImplementation(function (this: any) {
      this.chats = {
        create: vi.fn().mockReturnValue(mockChat),
      };
    }),
    HarmCategory: { HARM_CATEGORY_HATE_SPEECH: 'HATE' },
    HarmBlockThreshold: { BLOCK_LOW_AND_ABOVE: 'LOW' },
    Type: {
      OBJECT: 'OBJECT',
      ARRAY: 'ARRAY',
      STRING: 'STRING',
      NUMBER: 'NUMBER',
      INTEGER: 'INTEGER',
      BOOLEAN: 'BOOLEAN',
    },
  };
});

describe('GeminiCoach', () => {
  let coach: GeminiCoach;

  beforeEach(() => {
    coach = new GeminiCoach();
  });

  it('should process metrics and filter thought blocks', async () => {
    const metrics: PerformanceMetric[] = [{ offset: 10, bpm: 80 }];

    // Setup mock response with thoughts
    const mockSendMessage = (coach as any).chat.sendMessage;
    mockSendMessage.mockResolvedValue({
      candidates: [
        {
          content: {
            parts: [
              {
                thought: true,
                text: 'Thinking about the rhythm...',
              },
              { text: 'Great job!' },
            ],
          },
        },
      ],
    });

    const result = await coach.processMetrics(metrics);
    expect(result.feedback).toBe('Great job!');
  });

  it('should handle tool calls correctly', async () => {
    const metrics: PerformanceMetric[] = [{ offset: 10, bpm: 80 }];
    const mockSendMessage = (coach as any).chat.sendMessage;

    mockSendMessage.mockResolvedValue({
      candidates: [
        {
          content: {
            parts: [
              { text: 'Let me help you.' },
              {
                functionCall: {
                  name: 'set_metronome',
                  args: { bpm: 70 },
                },
              },
            ],
          },
        },
      ],
    });

    const result = await coach.processMetrics(metrics);
    expect(result.feedback).toBe('Let me help you.');
    expect(result.toolTrace?.tool).toBe('set_metronome');
    expect(result.toolTrace?.args.bpm).toBe(70);
  });
});
