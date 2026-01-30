import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock AudioContext
(globalThis as any).AudioContext = vi.fn().mockImplementation(() => ({
  createOscillator: vi.fn().mockReturnValue({
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  }),
  createGain: vi.fn().mockReturnValue({
    connect: vi.fn(),
    gain: { value: 0 },
  }),
  close: vi.fn(),
}));

// Mock performance.now
if (!(globalThis as any).performance) {
  (globalThis as any).performance = { now: vi.fn() } as any;
}
