import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { Play, Square, Music, Zap, RefreshCw } from 'lucide-react';
import { useAudioAnalyzer } from '../../hooks/useAudioAnalyzer';
import { motion, AnimatePresence } from 'framer-motion';

interface SessionData {
  sessionId: string;
  uid: string;
  questState: any;
}

export const RhythmQuest: React.FC<{ onLog: (log: any) => void }> = ({
  onLog,
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
  const [isConnecting, setIsConnecting] = useState(true);

  const questIdCounter = useRef(0);
  const wsRef = useRef<WebSocket | null>(null);
  const startTimeRef = useRef<number>(0);

  // Initialize Session
  useEffect(() => {
    const initSession = async () => {
      try {
        const storedUid = localStorage.getItem('maestro_uid');
        const res = await fetch(
          'http://localhost:3001/api/session/start',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uid: storedUid }),
          }
        );
        const data = await res.json();
        setSession(data);
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
        ws.onmessage = (e) => {
          const msg = JSON.parse(e.data);
          if (msg.type === 'feedback') {
            setFeedback(msg.content);
            if (msg.toolTrace) onLog(msg.toolTrace);
          }
        };
        wsRef.current = ws;
      } catch (err) {
        console.error('Failed to init session:', err);
      }
    };

    initSession();
    return () => wsRef.current?.close();
  }, [onLog]);

  const onPeak = useCallback(
    (time: number) => {
      // Basic detection logic: find offset from nearest beat
      const beatInterval = 60 / bpm;
      const elapsedTime = time - startTimeRef.current;
      const nearestBeat =
        Math.round(elapsedTime / beatInterval) * beatInterval;
      const offset = elapsedTime - nearestBeat;

      const newPeak = { id: questIdCounter.current++, time, offset };
      setPeaks((prev) => [...prev.slice(-9), newPeak]);

      // Send metrics to backend if we have a connection
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: 'metrics',
            sessionId: session?.sessionId,
            metrics: {
              timestamp: time,
              offset,
              bpm,
            },
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

  if (isConnecting) {
    return (
      <div className="loader">
        <RefreshCw className="spin" size={48} />
        <p>Connecting to Teacher...</p>
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
        <p className="feedback-text">{feedback}</p>
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
        }

        .spin {
          animation: spin 2s linear infinite;
          color: #4ade80;
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
          max-width: 800px;
          color: white;
        }

        .quest-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .feedback-text {
          font-size: 1.4rem;
          font-weight: 500;
          color: #eee;
          min-height: 2em;
          margin-top: 1rem;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0.5rem 1.2rem;
          border-radius: 2rem;
          font-size: 0.8rem;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.15rem;
          color: #4ade80;
        }

        .metronome-visual {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3rem;
          margin: 4rem 0;
        }

        .beaters {
          display: flex;
          gap: 2rem;
        }

        .beater {
          width: 24px;
          height: 24px;
          background: #4ade80;
          border-radius: 50%;
        }

        .bpm-display {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .bpm-value {
          font-size: 6rem;
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.2rem;
        }

        .bpm-label {
          color: #444;
          font-weight: 700;
          letter-spacing: 0.2rem;
        }

        .peak-history {
          display: flex;
          gap: 1rem;
          height: 80px;
          margin-top: 2rem;
          perspective: 1000px;
        }

        .peak-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .peak-indicator.perfect { color: #4ade80; }
        .peak-indicator.off { color: #fbbf24; }

        .offset-label {
          font-size: 0.7rem;
          font-weight: 600;
          font-family: 'JetBrains Mono', monospace;
          opacity: 0.8;
        }

        .action-button {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem 4rem;
          border-radius: 4rem;
          font-size: 1.4rem;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          margin-bottom: 2rem;
        }

        .action-button:hover {
          transform: scale(1.05) translateY(-2px);
          filter: brightness(1.1);
        }

        .action-button.start {
          background: white;
          color: #000;
          box-shadow: 0 10px 30px rgba(255, 255, 255, 0.2);
        }

        .action-button.stop {
          background: #ef4444;
          color: white;
          box-shadow: 0 10px 30px rgba(239, 68, 68, 0.3);
        }
      `}</style>
    </div>
  );
};
