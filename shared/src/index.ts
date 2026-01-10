// Character and User Types
export interface CharacterSettings {
  color: string;
  accessory: 'none' | 'headphones' | 'cap' | 'bow';
  eyeStyle: 'round' | 'star' | 'wink';
}

export interface StudentProfile {
  uid: string;
  createdAt: string;
  updatedAt?: string;
  onboardingCompleted: boolean;
  character: CharacterSettings;
  skill: {
    tempo_stability: number;
    confidence: number;
  };
  preferences: {
    coach_style: string;
    difficulty: number;
  };
}

// Session Types
export interface QuestState {
  sessionId: string;
  uid: string;
  quest: string;
  bpm: number;
  status: 'idle' | 'playing' | 'paused';
}

export interface SessionData {
  sessionId: string;
  uid: string;
  student: StudentProfile;
  questState: QuestState;
}

// Tool Types
export interface ToolLog {
  id: number;
  timestamp: number;
  tool: string;
  args: Record<string, unknown>;
  status: 'success' | 'error' | 'pending';
  result?: unknown;
}
