import React from 'react';
import { motion } from 'framer-motion';
import {
  Star,
  Award,
  Zap,
  Heart,
  Music,
  Sparkles,
  Crown,
} from 'lucide-react';

interface Badge {
  type: string;
  reason: string;
}

interface StickerBookProps {
  badges: Badge[];
}

export const StickerBook: React.FC<StickerBookProps> = ({
  badges,
}) => {
  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'perfect_rhythm':
        return (
          <Zap size={32} className="text-yellow-400 glow-icon" />
        );
      case 'rhythm_master':
        return (
          <Crown size={32} className="text-yellow-500 glow-icon" />
        );
      case 'persistent_learner':
        return (
          <Heart size={32} className="text-pink-400 glow-icon" />
        );
      case 'musical_ear':
        return (
          <Music size={32} className="text-blue-400 glow-icon" />
        );
      case 'music_scholar':
        return (
          <Star size={32} className="text-yellow-300 glow-icon" />
        );
      case 'theory_wiz':
        return (
          <Award size={32} className="text-green-400 glow-icon" />
        );
      case 'silence_breaker':
        return (
          <Zap size={32} className="text-purple-400 glow-icon" />
        );
      default:
        return (
          <Star size={32} className="text-yellow-400 glow-icon" />
        );
    }
  };

  return (
    <div className="sticker-book-container">
      <div className="book-header">
        <Sparkles className="header-icon" />
        <h3>Hero's Collection</h3>
        <Sparkles className="header-icon" />
      </div>

      <div className="sticker-grid">
        {badges.length === 0 ? (
          <div className="empty-state">
            <div className="empty-circle">?</div>
            <p>Complete quests to find stickers!</p>
          </div>
        ) : (
          badges.map((badge, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0, rotate: -20 }}
              animate={{
                scale: 1,
                rotate: index % 2 === 0 ? 5 : -5,
                y: [0, -5, 0],
              }}
              transition={{
                delay: index * 0.1,
                y: {
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }}
              className="sticker"
              title={badge.reason}
            >
              <div className="sticker-outer">
                <div className="sticker-inner">
                  {getIcon(badge.type)}
                  <span className="sticker-label">
                    {badge.type.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <style>{`
        .sticker-book-container {
          background: linear-gradient(135deg, rgba(45, 27, 78, 0.9) 0%, rgba(26, 15, 46, 0.9) 100%);
          backdrop-filter: blur(20px);
          border: 3px solid rgba(255, 206, 0, 0.3);
          border-radius: 2.5rem;
          padding: 2rem;
          width: 100%;
          max-width: 450px;
          color: white;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }

        .book-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .header-icon {
          color: var(--primary);
          animation: pulse 2s infinite;
        }

        h3 {
          margin: 0;
          font-weight: 900;
          font-size: 1.5rem;
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 0.1rem;
        }

        .sticker-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          min-height: 150px;
          justify-items: center;
        }

        .empty-state {
          grid-column: span 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          opacity: 0.6;
          padding: 2rem 0;
        }

        .empty-circle {
          width: 60px;
          height: 60px;
          border: 3px dashed rgba(255,255,255,0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 900;
        }

        .sticker {
          width: 100px;
          height: 100px;
          position: relative;
          cursor: pointer;
        }

        .sticker-outer {
          width: 100%;
          height: 100%;
          background: white;
          border-radius: 50%;
          padding: 5px;
          box-shadow: 0 10px 20px rgba(0,0,0,0.4);
          transition: transform 0.2s;
        }

        .sticker:hover .sticker-outer {
          transform: scale(1.1) rotate(0deg);
        }

        .sticker-inner {
          width: 100%;
          height: 100%;
          background: #fdfdfd;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          color: #2d1b4e;
          border: 2px solid #eee;
        }

        .sticker-label {
          font-size: 0.6rem;
          text-transform: uppercase;
          font-weight: 900;
          text-align: center;
          line-height: 1;
          max-width: 80%;
        }

        .glow-icon {
          filter: drop-shadow(0 0 5px currentColor);
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 1; }
        }

        .text-yellow-400 { color: #facc15; }
        .text-yellow-500 { color: #eab308; }
        .text-purple-400 { color: #c084fc; }
        .text-pink-400 { color: #f472b6; }
        .text-blue-400 { color: #60a5fa; }
        .text-green-400 { color: #4ade80; }
        .text-yellow-300 { color: #fde047; }
      `}</style>
    </div>
  );
};
