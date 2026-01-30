/** @vitest-environment jsdom */
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRhythmGame } from './useRhythmGame';

// Mock useStory
vi.mock('./useStory', () => ({
  useStory: vi.fn().mockReturnValue({
    xp: 0,
    level: 1,
    addXp: vi.fn().mockReturnValue({ leveledUp: false, newLevel: 1 }),
  }),
}));

// Mock useAudioAnalyzer
vi.mock('./useAudioAnalyzer', () => ({
  useAudioAnalyzer: vi.fn().mockReturnValue({
    startListening: vi.fn(),
    stopListening: vi.fn(),
  }),
}));

// Mock AudioManager
vi.mock('../utils/AudioManager', () => ({
  audioManager: {
    playHit: vi.fn(),
    playMiss: vi.fn(),
  },
}));

describe('useRhythmGame', () => {
  const mockOnPeakDetected = vi.fn();

  it('should initialize with default state', () => {
    const { result } = renderHook(() =>
      useRhythmGame({
        bpm: 60,
        onPeakDetected: mockOnPeakDetected,
      })
    );

    expect(result.current.isPlaying).toBe(false);
    expect(result.current.streak).toBe(0);
    expect(result.current.level).toBe(1);
  });

  it('should toggle playing state', async () => {
    const { result } = renderHook(() =>
      useRhythmGame({
        bpm: 60,
        onPeakDetected: mockOnPeakDetected,
      })
    );

    await act(async () => {
      await result.current.toggleGame();
    });

    expect(result.current.isPlaying).toBe(true);
  });
});
