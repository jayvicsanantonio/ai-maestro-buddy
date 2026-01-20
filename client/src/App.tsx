import { useRef, useCallback, useState, useEffect } from 'react';
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
 * Main application component.
 * Handles session initialization, onboarding flow, and game rendering.
 */
function App() {
  const hudRef = useRef<DeveloperHUDHandle>(null);
  const [session, setSession] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleLog = useCallback(
    (log: Omit<ToolLog, 'id' | 'timestamp'>) => {
      hudRef.current?.addLog(log);
    },
    []
  );

  const initSession = useCallback(async () => {
    try {
      const storedUid = localStorage.getItem('maestro_uid');
      const data = await api.startSession(storedUid);
      setSession(data);
      localStorage.setItem('maestro_uid', data.uid);

      if (!data.student.onboardingCompleted) {
        setShowOnboarding(true);
      }
    } catch (err) {
      console.error('Failed to init session:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void initSession();
  }, [initSession]);

  const handleOnboardingComplete = async (
    settings: CharacterSettings
  ) => {
    if (!session) return;

    try {
      await api.updateStudent(session.uid, {
        character: settings,
        onboardingCompleted: true,
      });

      // Refresh session to get updated data
      await initSession();
      setShowOnboarding(false);
    } catch (err) {
      console.error('Failed to complete onboarding:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <RefreshCw className="spin" size={48} />
        <p>Loading your musical world...</p>
      </div>
    );
  }

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
              key={session?.sessionId}
              initialSession={session || undefined}
            />
          )}
        </div>

        <DeveloperHUD ref={hudRef} />
      </div>
    </StoryProvider>
  );
}

export default App;
