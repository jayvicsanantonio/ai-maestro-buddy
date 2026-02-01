import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Zap, Star, Crown } from 'lucide-react';
import { STREAK_MESSAGES } from '../../data/storyContent';

interface StreakCelebrationProps {
  streak: number;
  isVisible: boolean;
}

const getStreakIcon = (streak: number) => {
  if (streak >= 20)
    return <Crown size={32} className="streak-icon crown" />;
  if (streak >= 15)
    return <Star size={32} className="streak-icon star" />;
  if (streak >= 10)
    return <Zap size={32} className="streak-icon zap" />;
  return <Flame size={32} className="streak-icon flame" />;
};

const getStreakColor = (streak: number): string => {
  if (streak >= 20) return '#FFD700';
  if (streak >= 15) return '#FF4785';
  if (streak >= 10) return '#9B5DE5';
  return '#FF6B6B';
};

export const StreakCelebration: React.FC<StreakCelebrationProps> = ({
  streak,
  isVisible,
}) => {
  // Only show for milestone streaks
  const message = STREAK_MESSAGES[streak];
  if (!message) return null;

  const color = getStreakColor(streak);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="streak-celebration"
          initial={{ scale: 0, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0, y: -50, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <motion.div
            className="streak-content"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, -2, 2, 0],
            }}
            transition={{ duration: 0.5, repeat: 2 }}
          >
            <motion.div
              className="icon-wrapper"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.3, repeat: 3 }}
            >
              {getStreakIcon(streak)}
            </motion.div>

            <div className="streak-text">
              <span className="streak-count">x{streak}</span>
              <span className="streak-message">{message}</span>
            </div>
          </motion.div>

          {/* Particle burst */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="streak-particle"
              initial={{ scale: 1, x: 0, y: 0, opacity: 1 }}
              animate={{
                scale: 0,
                x: Math.cos((i / 8) * Math.PI * 2) * 80,
                y: Math.sin((i / 8) * Math.PI * 2) * 80,
                opacity: 0,
              }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{ background: color }}
            />
          ))}

          <style>{`
            .streak-celebration {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              z-index: 1500;
              pointer-events: none;
            }

            .streak-content {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 0.5rem;
              background: rgba(0, 0, 0, 0.85);
              backdrop-filter: blur(10px);
              border: 3px solid ${color};
              padding: 1.5rem 2.5rem;
              border-radius: 2rem;
              box-shadow: 0 0 40px ${color}80;
            }

            .icon-wrapper {
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .streak-icon {
              filter: drop-shadow(0 0 10px currentColor);
            }

            .streak-icon.flame { color: #FF6B6B; }
            .streak-icon.zap { color: #9B5DE5; }
            .streak-icon.star { color: #FF4785; }
            .streak-icon.crown { color: #FFD700; }

            .streak-text {
              display: flex;
              flex-direction: column;
              align-items: center;
            }

            .streak-count {
              font-size: 2rem;
              font-weight: 900;
              color: ${color};
              text-shadow: 0 0 20px ${color};
            }

            .streak-message {
              font-size: 1.1rem;
              font-weight: 700;
              color: white;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }

            .streak-particle {
              position: absolute;
              top: 50%;
              left: 50%;
              width: 12px;
              height: 12px;
              border-radius: 50%;
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
