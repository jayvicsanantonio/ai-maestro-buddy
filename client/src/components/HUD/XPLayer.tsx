import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface XPLayerProps {
  xp: number;
  level: number;
  xpToNextLevel: number;
}

const levelNames: Record<number, string> = {
  1: 'Rhythm Trainee',
  2: 'Beat Seeker',
  3: 'Tempo Master',
  4: 'Syncopation Ninja',
  5: 'Maestro Buddy',
};

export const XPLayer: React.FC<XPLayerProps> = ({
  xp,
  level,
  xpToNextLevel,
}) => {
  const progress = (xp / xpToNextLevel) * 100;

  return (
    <div className="xp-layer">
      <div className="level-info">
        <div className="star-container">
          <Star size={24} fill="#ffce00" color="#ffce00" />
          <span className="level-number">{level}</span>
        </div>
        <div className="text-info">
          <span className="level-name">
            {levelNames[level] || 'Pro Musician'}
          </span>
          <span className="xp-text">
            {xp} / {xpToNextLevel} XP
          </span>
        </div>
      </div>

      <div className="progress-container">
        <motion.div
          className="progress-bar"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        <div
          className="progress-glow"
          style={{ width: `${progress}%` }}
        />
      </div>

      <style>{`
        .xp-layer {
          background: rgba(45, 27, 78, 0.8);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 1.5rem;
          padding: 1rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          min-width: 250px;
        }

        .level-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .star-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .level-number {
          position: absolute;
          font-size: 0.75rem;
          font-weight: 900;
          color: #2d1b4e;
          top: 55%;
          transform: translateY(-50%);
        }

        .text-info {
          display: flex;
          flex-direction: column;
        }

        .level-name {
          font-weight: 700;
          font-size: 1rem;
          color: var(--primary);
        }

        .xp-text {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 600;
        }

        .progress-container {
          position: relative;
          height: 10px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 5px;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #ffce00, #ff4785);
          border-radius: 5px;
        }

        .progress-glow {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: white;
          opacity: 0.2;
          filter: blur(4px);
        }
      `}</style>
    </div>
  );
};
