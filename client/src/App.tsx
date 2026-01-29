import { useRef, useCallback, useState, use, Suspense } from 'react';
import { RhythmQuest } from './components/RhythmQuest/RhythmQuest';
import type { SessionData, CharacterSettings } from './types/shared';
import { OnboardingFlow } from './components/Onboarding/OnboardingFlow';
import {
  DeveloperHUD,
  type DeveloperHUDHandle,
  type ToolLog,
} from './components/HUD/DeveloperHUD';
import { RefreshCw } from 'lucide-react';
import { api } from './services/api';
import { StoryProvider } from './contexts/StoryContext';
import './App.css';

/**
 * Promise for the initial session.
 * In a real app, this might be better handled in a state management library
 * or a more robust cache, but for this demonstration, we'll keep it simple.
 */
const initialSessionPromise = api.startSession(
  localStorage.getItem('maestro_uid')
);

function AppContent({
  sessionPromise,
}: {
  sessionPromise: Promise<SessionData>;
}) {
  const hudRef = useRef<DeveloperHUDHandle>(null);
  const initialSession = use(sessionPromise);
  const [session, setSession] = useState<SessionData>(initialSession);
  const [showOnboarding, setShowOnboarding] = useState(
    !initialSession.student.onboardingCompleted
  );

  const handleLog = useCallback(
    (log: Omit<ToolLog, 'id' | 'timestamp'>) => {
      hudRef.current?.addLog(log);
    },
    []
  );

  const handleOnboardingComplete = async (
    settings: CharacterSettings
  ) => {
    try {
      const data = await api.updateStudent(session.uid, {
        character: settings,
        onboardingCompleted: true,
      });

      // Update session with new student data
      setSession((prev) => ({ ...prev, student: data.student }));
      setShowOnboarding(false);
    } catch (err) {
      console.error('Failed to complete onboarding:', err);
    }
  };

  return (
    <StoryProvider>
      <div className="app-layout">
        <div className="bg-gradient" />

        {/* Decorative Musical Notes */}
        <div className="decorations" aria-hidden="true">
          <div className="note n1">♪</div>
          <div className="note n2">♫</div>
          <div className="note n3">♬</div>
          <div className="note n4">♩</div>
        </div>

        <header className="app-header">
          <div className="logo">
            Maestro<span className="accent">Buddy</span>
          </div>
        </header>

        <div className="content-wrapper">
          {showOnboarding ? (
            <OnboardingFlow onComplete={handleOnboardingComplete} />
          ) : (
            <RhythmQuest
              onLog={handleLog}
              key={session.sessionId}
              initialSession={session}
            />
          )}
        </div>

        <DeveloperHUD ref={hudRef} />
      </div>
    </StoryProvider>
  );
}

function App() {
  return (
    <Suspense
      fallback={
        <div className="loading-screen">
          <RefreshCw className="spin" size={48} />
          <p>Loading your musical world...</p>
        </div>
      }
    >
      <AppContent sessionPromise={initialSessionPromise} />
    </Suspense>
  );
}

export default App;
