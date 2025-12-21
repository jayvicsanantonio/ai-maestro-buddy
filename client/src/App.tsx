import React from 'react';
import { RhythmQuest } from './components/RhythmQuest/RhythmQuest';
import { DeveloperHUD } from './components/HUD/DeveloperHUD';

function App() {
  return (
    <div className="app-layout">
      <div className="bg-gradient" />
      <div className="content-wrapper">
        <RhythmQuest />
      </div>
      <DeveloperHUD />

      <style>{`
        :root {
          --bg-dark: #0a0a0b;
          --primary: #4ade80;
          --accent: #fbbf24;
        }

        body {
          margin: 0;
          padding: 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: var(--bg-dark);
          color: white;
          overflow-x: hidden;
        }

        .app-layout {
          position: relative;
          min-height: 100vh;
          width: 100vw;
          display: flex;
          flex-direction: column;
        }

        .bg-gradient {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 20%, rgba(74, 222, 128, 0.05) 0%, transparent 40%),
            radial-gradient(circle at 80% 80%, rgba(251, 191, 36, 0.05) 0%, transparent 40%),
            var(--bg-dark);
          z-index: -1;
        }

        .content-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        h1 {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #fff 0%, #888 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        p {
          color: #888;
          font-size: 1.1rem;
        }
      `}</style>
    </div>
  );
}

export default App;
