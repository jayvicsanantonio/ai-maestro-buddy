import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { Play, Square, Music, Zap } from 'lucide-react';
import { useAudioAnalyzer } from '../../hooks/useAudioAnalyzer';
import { motion, AnimatePresence } from 'framer-motion';

export const RhythmQuest: React.FC = () => {
  const [bpm, setBpm] = useState(80);
  const [peaks, setPeaks] = useState<{ id: number; time: number }[]>(
    []
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const questIdCounter = useRef(0);

  const onPeak = useCallback((time: number) => {
    setPeaks((prev) => [
      ...prev.slice(-10),
      { id: questIdCounter.current++, time },
    ]);
  }, []);

  const { isListening, startListening, stopListening } =
    useAudioAnalyzer(onPeak);

  const toggleQuest = () => {
    if (isListening) {
      stopListening();
      setIsPlaying(false);
    } else {
      startListening();
      setIsPlaying(true);
    }
  };

  return (
    <div className="quest-container">
      <header className="quest-header">
        <div className="badge">
          <Music size={16} />
          <span>Rhythm Quest</span>
        </div>
        <h1>Feel the Beat</h1>
        <p>Clap or tap along with the metronome!</p>
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
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5],
                      }
                    : {}
                }
                transition={{
                  duration: 60 / bpm,
                  repeat: Infinity,
                  delay: (i - 1) * (60 / bpm),
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
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="peak-indicator"
              >
                <Zap size={20} fill="currentColor" />
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
        .quest-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 2rem;
          min-height: 80vh;
          color: white;
        }

        .quest-header {
          text-align: center;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          padding: 0.5rem 1rem;
          border-radius: 2rem;
          font-size: 0.8rem;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.1rem;
        }

        .metronome-visual {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
        }

        .beaters {
          display: flex;
          gap: 1rem;
        }

        .beater {
          width: 20px;
          height: 20px;
          background: #4ade80;
          border-radius: 50%;
          box-shadow: 0 0 15px rgba(74, 222, 128, 0.5);
        }

        .bpm-display {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .bpm-value {
          font-size: 4rem;
          font-weight: 800;
        }

        .peak-history {
          display: flex;
          gap: 0.5rem;
          height: 40px;
          margin-top: 2rem;
        }

        .peak-indicator {
          color: #fbbf24;
        }

        .action-button {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem 3rem;
          border-radius: 4rem;
          font-size: 1.2rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .action-button:hover {
          transform: scale(1.05);
        }

        .action-button.start {
          background: white;
          color: #1a1a1a;
        }

        .action-button.stop {
          background: #ef4444;
          color: white;
        }
      `}</style>
    </div>
  );
};
