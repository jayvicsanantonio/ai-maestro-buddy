import { useRef, useCallback, useState, useEffect } from 'react';
import { RhythmQuest } from './components/RhythmQuest/RhythmQuest';
import type { SessionData } from './types/shared';
import { OnboardingFlow } from './components/Onboarding/OnboardingFlow';
import type { CharacterSettings } from './types/shared';
import {
  DeveloperHUD,
  type DeveloperHUDHandle,
  type ToolLog,
} from './components/HUD/DeveloperHUD';
import { RefreshCw } from 'lucide-react';

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

  const API_URL =
    import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  const initSession = useCallback(async () => {
    try {
      const storedUid = localStorage.getItem('maestro_uid');
      const res = await fetch(`${API_URL}/session/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: storedUid }),
      });
      const data = await res.json();
      setSession(data);
      localStorage.setItem('maestro_uid', data.uid);

      if (!data.student.onboardingCompleted) {
        setShowOnboarding(true);
      }
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to init session:', err);
      setIsLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    void initSession();
  }, [initSession]);

  const handleOnboardingComplete = async (
    settings: CharacterSettings
  ) => {
    if (!session) return;
    try {
      await fetch(`${API_URL}/student/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: session.uid,
          character: settings,
          onboardingCompleted: true,
        }),
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
        <style>{`
          .loading-screen {
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #2d1b4e;
            color: white;
            gap: 1.5rem;
          }
          .spin { animation: spin 2s linear infinite; color: #ffce00; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
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

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap');

        :root {
          --bg-dark: #2d1b4e;
          --primary: #ffce00;
          --accent: #ff4785;
          --soft-blue: #4fb8ff;
        }

        body {
          margin: 0;
          padding: 0;
          font-family: 'Quicksand', sans-serif;
          background: var(--bg-dark);
          color: white;
          overflow: hidden;
        }

        .app-layout {
          position: relative;
          height: 100vh;
          width: 100vw;
          display: flex;
          flex-direction: column;
        }

        .app-header {
          padding: 2rem;
          display: flex;
          justify-content: center;
          z-index: 10;
        }

        .logo {
          font-size: 1.5rem;
          font-weight: 900;
          letter-spacing: -0.05rem;
          text-transform: uppercase;
        }

        .accent {
          color: var(--primary);
        }

        .bg-gradient {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 10% 10%, rgba(74, 222, 128, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 90% 90%, rgba(251, 191, 36, 0.03) 0%, transparent 50%),
            var(--bg-dark);
          z-index: -1;
        }

        .content-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 1;
        }

        .decorations {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        .note {
          position: absolute;
          font-size: 2.5rem;
          color: rgba(255, 255, 255, 0.1);
          animation: float 8s infinite ease-in-out;
        }

        .n1 { top: 15%; left: 10%; animation-delay: 0s; }
        .n2 { top: 70%; left: 15%; animation-delay: 2s; font-size: 3rem; }
        .n3 { top: 20%; left: 85%; animation-delay: 4s; }
        .n4 { top: 75%; left: 80%; animation-delay: 1s; font-size: 2rem; }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(20deg); }
        }

        * {
          user-select: none;
        }
      `}</style>
    </div>
  );
}

export default App;
