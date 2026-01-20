import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useStory } from '../../contexts/StoryContext';

export const WorldProgressBar: React.FC = () => {
  const { currentWorld, currentChapter, level } = useStory();

  const totalChapters = currentWorld.chapters.length;
  const progressPercent = (currentChapter / totalChapters) * 100;

  return (
    <div className="world-progress-bar">
      <div className="world-header">
        <span className="world-icon">{currentWorld.icon}</span>
        <div className="world-info">
          <span className="world-name">{currentWorld.name}</span>
          <span className="chapter-text">
            Chapter {currentChapter} of {totalChapters}
          </span>
        </div>
      </div>

      <div className="chapter-progress">
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ background: currentWorld.color }}
        />

        {/* Chapter dots */}
        <div className="chapter-dots">
          {currentWorld.chapters.map((_, i) => (
            <motion.div
              key={i}
              className={`chapter-dot ${i < currentChapter ? 'completed' : ''} ${i === currentChapter - 1 ? 'current' : ''}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              {i === currentChapter - 1 && (
                <motion.div
                  className="current-marker"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <MapPin size={12} />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Next world preview */}
      {level < 5 && (
        <div className="next-world-hint">
          <span className="hint-text">Next:</span>
          <span className="next-world-name">
            {level === 1
              ? '🏖️ Beat Beach'
              : level === 2
                ? '🏛️ Tempo Temple'
                : level === 3
                  ? '🌆 Syncopation City'
                  : '🎭 Grand Concert Hall'}
          </span>
        </div>
      )}

      <style>{`
        .world-progress-bar {
          background: rgba(45, 27, 78, 0.9);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 1.5rem;
          padding: 1rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          min-width: 280px;
        }

        .world-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .world-icon {
          font-size: 2rem;
        }

        .world-info {
          display: flex;
          flex-direction: column;
        }

        .world-name {
          font-weight: 800;
          font-size: 1.1rem;
          color: ${currentWorld.color};
        }

        .chapter-text {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 600;
        }

        .chapter-progress {
          position: relative;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: visible;
        }

        .progress-fill {
          height: 100%;
          border-radius: 4px;
          box-shadow: 0 0 10px ${currentWorld.color}80;
        }

        .chapter-dots {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          transform: translateY(-50%);
          display: flex;
          justify-content: space-between;
          padding: 0 4px;
        }

        .chapter-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .chapter-dot.completed {
          background: ${currentWorld.color};
          border-color: ${currentWorld.color};
        }

        .chapter-dot.current {
          background: white;
          border-color: ${currentWorld.color};
          box-shadow: 0 0 10px ${currentWorld.color};
        }

        .current-marker {
          position: absolute;
          top: -20px;
          color: ${currentWorld.color};
        }

        .next-world-hint {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding-top: 0.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .hint-text {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.4);
          font-weight: 600;
        }

        .next-world-name {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};
