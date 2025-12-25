import { useState, useCallback, useEffect, useRef } from 'react';
import {
  Play,
  Square,
  Music,
  Zap,
  RefreshCw,
  Star,
} from 'lucide-react';
import { useAudioAnalyzer } from '../../hooks/useAudioAnalyzer';
import { useSpeech } from '../../hooks/useSpeech';
import { motion, AnimatePresence } from 'framer-motion';
import { type ToolLog } from '../HUD/DeveloperHUD';
import {
  MaestroCharacter,
  type CharacterSettings,
} from '../MaestroCharacter/MaestroCharacter';
import { CharacterCreator } from '../CharacterCreator/CharacterCreator';

interface RhythmExercise {
  id: string;
  name: string;
  style: string;
  level: number;
  bpm: number;
  pattern: number[];
  instructions: string;
}

export interface SessionData {
  sessionId: string;
  uid: string;
  student: {
    character: CharacterSettings;
  };
  questState: {
    bpm: number;
    quest: string;
  };
}

interface RhythmQuestProps {
  onLog: (log: Omit<ToolLog, 'id' | 'timestamp'>) => void;
  initialSession?: SessionData;
}

export const RhythmQuest: React.FC<RhythmQuestProps> = ({
  onLog,
  initialSession,
}) => {
  const [session, setSession] = useState<SessionData | null>(null);
  const [bpm, setBpm] = useState(80);
  const [peaks, setPeaks] = useState<
    { id: number; time: number; offset: number }[]
  >([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState(
    "Tap 'Start Lesson' to begin!"
  );
  const { speak, isSpeaking } = useSpeech();
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionError, setConnectionError] = useState<
    string | null
  >(null);
  const [availableExercises, setAvailableExercises] = useState<
    RhythmExercise[]
  >([]);
  const [showCreator, setShowCreator] = useState(false);
  const [characterSettings, setCharacterSettings] =
    useState<CharacterSettings | null>(
      initialSession?.student.character || null
    );

  // Speak feedback when it changes
  useEffect(() => {
    if (feedback && feedback !== "Tap 'Start Lesson' to begin!") {
      speak(feedback);
    }
  }, [feedback, speak]);

  const questIdCounter = useRef(0);
  const wsRef = useRef<WebSocket | null>(null);
  const startTimeRef = useRef<number>(0);

  // Initialize Session
  useEffect(() => {
    const initSession = async () => {
      try {
        let data: SessionData;

        if (initialSession && !session) {
          data = initialSession;
          setSession(data);
          setCharacterSettings(data.student.character);
        } else {
          const storedUid = localStorage.getItem('maestro_uid');
          const res = await fetch(
            'http://localhost:3001/api/session/start',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ uid: storedUid }),
            }
          );
          data = await res.json();
          setSession(data);
          setCharacterSettings(data.student.character);
        }

        localStorage.setItem('maestro_uid', data.uid);

        // Connect WebSocket
        const ws = new WebSocket(
          'ws://localhost:3001/api/session/stream'
        );
        ws.onopen = () => {
          ws.send(
            JSON.stringify({
              type: 'auth',
              sessionId: data.sessionId,
            })
          );
          setIsConnecting(false);
        };
        // ... rest of ws logic same ...

        ws.onmessage = (e) => {
          const msg = JSON.parse(e.data);

          if (msg.type === 'feedback') {
            setFeedback(msg.content);
            if (msg.toolTrace) onLog(msg.toolTrace);

            // Handle State Updates from Agent
            if (msg.stateUpdate) {
              const { tool, args } = msg.stateUpdate;
              if (tool === 'set_metronome' && args.bpm) {
                setBpm(args.bpm);
              }
              if (tool === 'reward_badge') {
                setFeedback(
                  `🏆 BADGE EARNED: ${args.type}! ${args.reason}`
                );
              }
            }

            // Handle MCP Results
            if (msg.mcpResult) {
              setAvailableExercises(msg.mcpResult);
            }
          }
        };
        wsRef.current = ws;
      } catch (err) {
        console.error('Failed to init session:', err);
        setConnectionError(
          'Could not reach the AI Teacher. Please make sure the server is running.'
        );
        setIsConnecting(false);
      }
    };

    initSession();
    return () => wsRef.current?.close();
  }, [onLog, initialSession, session]);

  const onPeak = useCallback(
    (time: number) => {
      const beatInterval = 60 / bpm;
      const elapsedTime = time - startTimeRef.current;
      const nearestBeat =
        Math.round(elapsedTime / beatInterval) * beatInterval;
      const offset = elapsedTime - nearestBeat;

      const newPeak = { id: questIdCounter.current++, time, offset };
      setPeaks((prev) => [...prev.slice(-9), newPeak]);

      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: 'metrics',
            sessionId: session?.sessionId,
            metrics: { timestamp: time, offset, bpm },
          })
        );
      }
    },
    [bpm, session]
  );

  const { startListening, stopListening } = useAudioAnalyzer(onPeak);

  const toggleQuest = () => {
    if (isPlaying) {
      stopListening();
      setIsPlaying(false);
    } else {
      startTimeRef.current = performance.now() / 1000;
      startListening();
      setIsPlaying(true);
      setFeedback('Listen to the beat and clap along!');
    }
  };

  const handleSaveCharacter = async (settings: CharacterSettings) => {
    if (!session) return;
    try {
      const res = await fetch(
        'http://localhost:3001/api/student/update',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid: session.uid,
            character: settings,
          }),
        }
      );
      const data = await res.json();
      setCharacterSettings(data.student.character);
      setShowCreator(false);
    } catch (err) {
      console.error('Failed to update character:', err);
    }
  };

  if (connectionError) {
    return (
      <div className="loader error">
        <RefreshCw className="error-icon" size={48} />
        <h2>Connection Failed</h2>
        <p>{connectionError}</p>
        <button
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Retry Connection
        </button>
      </div>
    );
  }

  if (isConnecting) {
    return (
      <div className="loader">
        <RefreshCw className="spin" size={48} />
        <p>Connecting to Teacher...</p>
      </div>
    );
  }

  if (showCreator) {
    return (
      <div className="creator-view">
        <CharacterCreator
          initialSettings={characterSettings || undefined}
          onSave={handleSaveCharacter}
          onCancel={() => setShowCreator(false)}
        />
      </div>
    );
  }

  return (
    <div className="quest-container">
      <header className="quest-header">
        <div className="badge">
          <Music size={16} />
          <span>Rhythm Quest</span>
        </div>
        <h1>Feel the Beat</h1>
        <motion.p
          className="feedback-text"
          animate={{
            scale: isSpeaking ? [1, 1.05, 1] : 1,
            color: isSpeaking ? 'var(--primary)' : '#ffffff',
          }}
          transition={{
            scale: isSpeaking
              ? { repeat: Infinity, duration: 1.5 }
              : { duration: 0.3 },
          }}
        >
          {feedback}
        </motion.p>

        <div className="character-zone">
          <MaestroCharacter
            isSpeaking={isSpeaking}
            isPlaying={isPlaying}
            settings={characterSettings || undefined}
          />
          {!isPlaying && (
            <button
              className="edit-character-button"
              onClick={() => setShowCreator(true)}
            >
              Change Look
            </button>
          )}
        </div>
      </header>

      <main className="quest-main">
        <div className="metronome-visual">
          <div className="bpm-display">
            <span className="bpm-value">{bpm}</span>
            <span className="bpm-label">BPM</span>
          </div>
          <div className="beaters">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="beater"
                animate={
                  isPlaying
                    ? {
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 1, 0.3],
                        boxShadow: [
                          '0 0 0px rgba(74, 222, 128, 0)',
                          '0 0 20px rgba(74, 222, 128, 0.5)',
                          '0 0 0px rgba(74, 222, 128, 0)',
                        ],
                      }
                    : {}
                }
                transition={{
                  duration: 60 / bpm,
                  repeat: Infinity,
                  delay: (i - 1) * (60 / bpm),
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        </div>

        <div className="peak-history">
          <AnimatePresence>
            {peaks.map((peak) => (
              <motion.div
                key={peak.id}
                initial={{ scale: 0, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                className={`peak-indicator ${
                  Math.abs(peak.offset) < 0.05 ? 'perfect' : 'off'
                }`}
              >
                <Zap size={24} fill="currentColor" />
                <span className="offset-label">
                  {peak.offset > 0 ? '+' : ''}
                  {peak.offset.toFixed(2)}s
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {availableExercises.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="exercise-shelf"
          >
            <div className="shelf-header">
              <Star size={14} className="accent" />
              <span>Recommended Lessons</span>
            </div>
            <div className="exercise-list">
              {availableExercises.map((ex) => (
                <button
                  key={ex.id}
                  className="exercise-card"
                  onClick={() => {
                    setBpm(ex.bpm);
                    setFeedback(
                      `Starting: ${ex.name}. ${ex.instructions}`
                    );
                    setAvailableExercises([]);
                  }}
                >
                  <span className="ex-title">{ex.name}</span>
                  <span className="ex-meta">
                    {ex.style} • {ex.bpm} BPM
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </main>

      <footer className="quest-footer">
        <button
          className={`action-button ${isPlaying ? 'stop' : 'start'}`}
          onClick={toggleQuest}
        >
          {isPlaying ? (
            <Square fill="currentColor" />
          ) : (
            <Play fill="currentColor" />
          )}
          {isPlaying ? 'Stop Lesson' : 'Start Lesson'}
        </button>
      </footer>

      <style>{`
        .loader {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          color: #888;
          text-align: center;
          max-width: 400px;
        }

        .loader.error h2 { color: #ef4444; margin: 0; }
        .error-icon { color: #ef4444; }

        .retry-button {
          padding: 0.75rem 2rem;
          background: #333;
          border: 1px solid #444;
          color: white;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }

        .retry-button:hover {
          background: #444;
          border-color: #666;
        }

        .spin {
          animation: spin 2s linear infinite;
          color: var(--primary);
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .quest-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 2rem;
          min-height: 85vh;
          width: 100%;
          max-width: 900px;
          color: white;
        }

        .quest-header {
          text-align: center;
          margin-bottom: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .character-zone {
          margin-top: -1rem;
          margin-bottom: -2rem;
        }

        .feedback-text {
          font-size: 1.6rem;
          font-weight: 700;
          color: #eee;
          min-height: 2em;
          margin-top: 1rem;
          background: rgba(255, 255, 255, 0.1);
          padding: 1rem 2.5rem;
          border-radius: 3rem;
          border: 2px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--accent);
          border: 2px solid rgba(255, 255, 255, 0.2);
          padding: 0.6rem 1.5rem;
          border-radius: 2rem;
          font-size: 0.9rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.1rem;
          color: white;
          box-shadow: 0 4px 15px rgba(255, 71, 133, 0.3);
        }

        .metronome-visual {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2.5rem;
          margin: 2rem 0;
          background: rgba(255, 255, 255, 0.03);
          padding: 3rem;
          border-radius: 4rem;
          border: 2px dashed rgba(255, 255, 255, 0.1);
        }

        .beaters {
          display: flex;
          gap: 2.5rem;
        }

        .beater {
          width: 32px;
          height: 32px;
          background: var(--primary);
          border-radius: 50%;
          border: 4px solid rgba(255, 255, 255, 0.3);
        }

        .bpm-display {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .bpm-value {
          font-size: 7rem;
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.2rem;
          color: var(--primary);
          text-shadow: 0 0 30px rgba(255, 206, 0, 0.3);
        }

        .bpm-label {
          color: rgba(255, 255, 255, 0.4);
          font-weight: 700;
          letter-spacing: 0.3rem;
          font-size: 1rem;
        }

        .peak-history {
          display: flex;
          gap: 1.2rem;
          height: 90px;
          margin-top: 1rem;
          perspective: 1000px;
        }

        .peak-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.05);
          padding: 0.8rem;
          border-radius: 1rem;
        }

        .peak-indicator.perfect { 
          color: var(--primary);
          background: rgba(255, 206, 0, 0.1);
          border: 1px solid var(--primary);
        }
        .peak-indicator.off { 
          color: var(--soft-blue); 
          background: rgba(79, 184, 255, 0.1);
          border: 1px solid var(--soft-blue);
        }

        .offset-label {
          font-size: 0.75rem;
          font-weight: 700;
          font-family: 'Quicksand', sans-serif;
        }

        .exercise-shelf {
          margin-top: 2rem;
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 2rem;
          padding: 1.5rem;
        }

        .shelf-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1rem;
          margin-bottom: 1.25rem;
        }

        .shelf-header .accent { color: var(--primary); }

        .exercise-list {
          display: flex;
          gap: 1.2rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
        }

        .exercise-card {
          flex: 0 0 220px;
          background: white;
          border: none;
          border-radius: 1.5rem;
          padding: 1.2rem;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }

        .exercise-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 15px 30px rgba(255, 206, 0, 0.2);
        }

        .ex-title {
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--bg-dark);
        }

        .ex-meta {
          font-size: 0.8rem;
          color: #666;
          font-weight: 600;
        }

        .action-button {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem 4.5rem;
          border-radius: 4rem;
          font-size: 1.6rem;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          margin-bottom: 1.5rem;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
        }

        .action-button.start {
          background: var(--primary);
          color: var(--bg-dark);
        }

        .action-button.stop {
          background: var(--accent);
          color: white;
        }

        .edit-character-button {
          margin-top: 1rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 1rem;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .edit-character-button:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        .creator-view {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 80vh;
        }
      `}</style>
    </div>
  );
};
