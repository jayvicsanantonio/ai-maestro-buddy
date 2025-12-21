import React, { useRef, useCallback } from 'react';
import { RhythmQuest } from './components/RhythmQuest/RhythmQuest';
import {
  DeveloperHUD,
  DeveloperHUDHandle,
} from './components/HUD/DeveloperHUD';

function App() {
  const hudRef = useRef<DeveloperHUDHandle>(null);

  const handleLog = useCallback((log: any) => {
    hudRef.current?.addLog(log);
  }, []);

  return (
    <div className="app-layout">
      <div className="bg-gradient" />

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
        :root {
          --bg-dark: #050505;
          --primary: #4ade80;
          --accent: #fbbf24;
        }

        body {
          margin: 0;
          padding: 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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

        /* Prevent text selection during practice */
        * {
          user-select: none;
        }
      `}</style>
    </div>
  );
}

export default App;
