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

// Session and Metrics Types
export interface PerformanceMetric {
  offset: number;
  bpm: number;
  timestamp?: number;
}

export interface SessionData {
  sessionId: string;
  uid: string;
  student: StudentProfile;
  questState: QuestState;
  updatedAt?: string;
}

export interface QuestState {
  sessionId: string;
  uid: string;
  quest: string;
  bpm: number;
  status: 'idle' | 'playing' | 'paused';
}

// WebSocket Communication Types
export type ClientMessageType = 'auth' | 'metrics' | 'audio';
export type ServerMessageType = 'system' | 'feedback' | 'error';

export interface ClientMessage {
  type: ClientMessageType;
  sessionId?: string;
  metrics?: PerformanceMetric;
  audio?: string;
}

export interface ServerMessage {
  type: ServerMessageType;
  content?: string;
  message?: string;
  audio?: string;
  toolTrace?: {
    tool: string;
    args: Record<string, unknown>;
    status: 'success' | 'error' | 'pending';
  };
  mcpResult?: unknown;
  stateUpdate?: {
    tool: string;
    args: Record<string, unknown>;
  };
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
