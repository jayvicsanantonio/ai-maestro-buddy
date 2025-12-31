import React from 'react';
import { motion } from 'framer-motion';
import { Star, Award, Zap, Heart, Music } from 'lucide-react';

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
        return <Zap className="text-yellow-400" />;
      case 'rhythm_master':
        return <Award className="text-purple-400" />;
      case 'persistent_learner':
        return <Heart className="text-pink-400" />;
      case 'musical_ear':
        return <Music className="text-blue-400" />;
      case 'music_scholar':
        return <Star className="text-yellow-400" />;
      case 'theory_wiz':
        return <Award className="text-green-400" />;
      default:
        return <Star className="text-yellow-400" />;
    }
  };

  return (
    <div className="sticker-book-container">
      <h3>My Sticker Book</h3>
      <div className="sticker-grid">
        {badges.length === 0 ? (
          <p className="empty-message">
            Keep playing to earn stickers!
          </p>
        ) : (
          badges.map((badge, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: index % 2 === 0 ? 5 : -5 }}
              className="sticker"
              title={badge.reason}
            >
              <div className="sticker-inner">
                {getIcon(badge.type)}
                <span className="sticker-label">
                  {badge.type.replace('_', ' ')}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <style>{`
        .sticker-book-container {
          background: rgba(45, 27, 78, 0.6);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 2rem;
          padding: 1.5rem;
          width: 100%;
          max-width: 400px;
          color: white;
        }

        h3 {
          margin-bottom: 1rem;
          font-weight: 700;
          text-align: center;
          font-size: 1.2rem;
          color: var(--primary);
        }

        .sticker-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          min-height: 100px;
          justify-items: center;
        }

        .empty-message {
          grid-column: span 3;
          text-align: center;
          opacity: 0.5;
          font-style: italic;
          font-size: 0.9rem;
          padding: 1rem;
        }

        .sticker {
          width: 80px;
          height: 80px;
          background: white;
          border-radius: 50%;
          padding: 4px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          border: 2px dashed #eee;
        }

        .sticker-inner {
          width: 100%;
          height: 100%;
          background: #f8f8f8;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          color: #333;
        }

        .sticker-label {
          font-size: 0.5rem;
          text-transform: uppercase;
          font-weight: 800;
          text-align: center;
          line-height: 1;
        }

        .text-yellow-400 { color: #facc15; }
        .text-purple-400 { color: #c084fc; }
        .text-pink-400 { color: #f472b6; }
        .text-blue-400 { color: #60a5fa; }
        .text-green-400 { color: #4ade80; }
      `}</style>
    </div>
  );
};
