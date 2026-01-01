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

            <h2>New Badge Earned!</h2>
            <div className="badge-name">
              {badge.type.replace('_', ' ')}
            </div>
            <p className="badge-reason">{badge.reason}</p>

            <button className="collect-button" onClick={onClose}>
              Awesome!
            </button>
          </motion.div>

          <style>{`
            .reveal-overlay {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0,0,0,0.8);
              backdrop-filter: blur(10px);
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 1000;
              padding: 2rem;
            }

            .reveal-card {
              background: #2d1b4e;
              border: 4px solid var(--primary);
              padding: 3rem;
              border-radius: 3rem;
              text-align: center;
              max-width: 400px;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 1.5rem;
              box-shadow: 0 0 50px rgba(255, 206, 0, 0.3);
            }

            .badge-icon-reveal {
              background: white;
              width: 150px;
              height: 150px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 10px 20px rgba(0,0,0,0.3);
              margin-bottom: 1rem;
            }

            h2 {
              color: white;
              font-size: 2rem;
              margin: 0;
            }

            .badge-name {
              color: var(--primary);
              font-size: 1.5rem;
              font-weight: 800;
              text-transform: uppercase;
            }

            .badge-reason {
              color: rgba(255,255,255,0.8);
              font-style: italic;
            }

            .collect-button {
              background: var(--primary);
              color: #2d1b4e;
              border: none;
              padding: 1rem 2.5rem;
              border-radius: 2rem;
              font-size: 1.25rem;
              font-weight: 800;
              cursor: pointer;
              transition: transform 0.2s;
            }

            .collect-button:hover {
              transform: scale(1.1);
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
