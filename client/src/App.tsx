import { useRef, useCallback } from 'react';
import { RhythmQuest } from './components/RhythmQuest/RhythmQuest';
import {
  DeveloperHUD,
  type DeveloperHUDHandle,
  type ToolLog,
} from './components/HUD/DeveloperHUD';

function App() {
  const hudRef = useRef<DeveloperHUDHandle>(null);

  const handleLog = useCallback(
    (log: Omit<ToolLog, 'id' | 'timestamp'>) => {
      hudRef.current?.addLog(log);
    },
    []
  );

  return (
    <div className="app-layout">
      <div className="bg-gradient" />

      {/* Decorative Musical Notes */}
      <div className="decorations">
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
        <RhythmQuest onLog={handleLog} />
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

        /* Decorative Notes */
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

        /* Prevent text selection during practice */
        * {
          user-select: none;
        }
      `}</style>
    </div>
  );
}

export default App;
