import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Award, Zap, Heart, Music } from 'lucide-react';

interface Badge {
  type: string;
  reason: string;
}

interface BadgeRevealProps {
  badge: Badge | null;
  onClose: () => void;
}

export const BadgeReveal: React.FC<BadgeRevealProps> = ({
  badge,
  onClose,
}) => {
  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'perfect_rhythm':
        return <Zap size={80} className="text-yellow-400" />;
      case 'rhythm_master':
        return <Award size={80} className="text-purple-400" />;
      case 'persistent_learner':
        return <Heart size={80} className="text-pink-400" />;
      case 'musical_ear':
        return <Music size={80} className="text-blue-400" />;
      case 'music_scholar':
        return <Star size={80} className="text-yellow-400" />;
      case 'theory_wiz':
        return <Award size={80} className="text-green-400" />;
      default:
        return <Star size={80} className="text-yellow-400" />;
    }
  };

  return (
    <AnimatePresence>
      {badge && (
        <div className="reveal-overlay">
          <motion.div
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="reveal-card"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="badge-icon-reveal"
            >
              {getIcon(badge.type)}
            </motion.div>

            <h2>Quest Reward Found!</h2>
            <div className="badge-name">
              {badge.type.replace('_', ' ')}
            </div>
            <p className="badge-reason">"{badge.reason}"</p>
            <p className="story-snippet">
              The music in the Kingdom grows stronger with this
              artifact!
            </p>

            <button className="collect-button" onClick={onClose}>
              Add to Collection
            </button>
          </motion.div>

          <style>{`
            .reveal-overlay {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0,0,0,0.9);
              backdrop-filter: blur(20px);
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 2000;
              padding: 2rem;
            }

            .reveal-card {
              background: linear-gradient(135deg, #2d1b4e 0%, #1a0f2e 100%);
              border: 4px solid #FFD700;
              padding: 3.5rem;
              border-radius: 4rem;
              text-align: center;
              max-width: 450px;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 1.5rem;
              box-shadow: 0 0 80px rgba(255, 215, 0, 0.4);
            }

            .badge-icon-reveal {
              background: white;
              width: 160px;
              height: 160px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 15px 30px rgba(0,0,0,0.4);
              margin-bottom: 1rem;
              border: 5px solid #FFD700;
            }

            h2 {
              color: white;
              font-size: 2.5rem;
              font-weight: 900;
              margin: 0;
              text-shadow: 0 0 20px rgba(255,255,255,0.3);
            }

            .badge-name {
              color: #FFD700;
              font-size: 1.8rem;
              font-weight: 900;
              text-transform: uppercase;
              letter-spacing: 0.1rem;
            }

            .badge-reason {
              color: rgba(255,255,255,0.9);
              font-size: 1.2rem;
              font-weight: 600;
            }

            .story-snippet {
              color: var(--primary);
              font-style: italic;
              font-size: 1rem;
              opacity: 0.8;
            }

            .collect-button {
              background: #FFD700;
              color: #2d1b4e;
              border: none;
              padding: 1.2rem 3rem;
              border-radius: 2.5rem;
              font-size: 1.4rem;
              font-weight: 900;
              cursor: pointer;
              transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
              box-shadow: 0 10px 20px rgba(255, 215, 0, 0.3);
              margin-top: 1rem;
            }

            .collect-button:hover {
              transform: scale(1.1) translateY(-5px);
              box-shadow: 0 15px 30px rgba(255, 215, 0, 0.4);
            }

            .text-yellow-400 { color: #facc15; }
            .text-purple-400 { color: #c084fc; }
            .text-pink-400 { color: #f472b6; }
            .text-blue-400 { color: #60a5fa; }
            .text-green-400 { color: #4ade80; }
          `}</style>
        </div>
      )}
    </AnimatePresence>
  );
};
