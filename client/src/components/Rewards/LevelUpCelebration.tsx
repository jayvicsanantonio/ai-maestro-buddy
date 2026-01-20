import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Sparkles, Crown, Rocket } from 'lucide-react';
import {
  LEVEL_UP_MESSAGES,
  getWorldForLevel,
} from '../../data/storyContent';
import { MaestroCharacter } from '../MaestroCharacter/MaestroCharacter';
import { useSpeech } from '../../hooks/useSpeech';

interface LevelUpCelebrationProps {
  level: number;
  isVisible: boolean;
  onClose: () => void;
}

const Confetti: React.FC<{
  color: string;
  delay: number;
  index: number;
}> = ({ color, delay, index }) => {
  // Use useMemo with index as seed for stable random values
  const { randomX, randomRotation, size, duration, isRound } =
    useMemo(() => {
      // Simple seeded random based on index
      const seed = (index * 9301 + 49297) % 233280;
      const rand1 = seed / 233280;
      const rand2 = ((seed * 7) % 233280) / 233280;
      const rand3 = ((seed * 13) % 233280) / 233280;
      const rand4 = ((seed * 17) % 233280) / 233280;
      const rand5 = ((seed * 23) % 233280) / 233280;

      return {
        randomX: rand1 * 100,
        randomRotation: rand2 * 360,
        size: 8 + rand3 * 12,
        duration: 3 + rand4 * 2,
        isRound: rand5 > 0.5,
      };
    }, [index]);

  return (
    <motion.div
      initial={{ y: -20, x: `${randomX}vw`, opacity: 1, rotate: 0 }}
      animate={{
        y: '100vh',
        rotate: randomRotation + 720,
        opacity: [1, 1, 0],
      }}
      transition={{
        duration,
        delay,
        ease: 'easeIn',
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: isRound ? '50%' : '2px',
        zIndex: 1001,
        pointerEvents: 'none',
      }}
    />
  );
};

export const LevelUpCelebration: React.FC<
  LevelUpCelebrationProps
> = ({ level, isVisible, onClose }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const { speak } = useSpeech();
  const levelData = LEVEL_UP_MESSAGES[level] || {
    title: `Level ${level}`,
    message: "You're getting stronger!",
    unlockText: 'Keep going!',
  };
  const newWorld = getWorldForLevel(level);

  const confettiColors = [
    '#FFD700',
    '#FF6B6B',
    '#4ECDC4',
    '#9B5DE5',
    '#FF4785',
    '#00D4FF',
  ];

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      speak(`Level Up! ${levelData.title}! ${levelData.message}`);
      const timer = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, speak, levelData.title, levelData.message]);

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Confetti Layer */}
          {showConfetti && (
            <>
              {Array.from({ length: 50 }).map((_, i) => (
                <Confetti
                  key={i}
                  index={i}
                  color={confettiColors[i % confettiColors.length]}
                  delay={i * 0.05}
                />
              ))}
            </>
          )}

          {/* Main Celebration Modal */}
          <motion.div
            className="levelup-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="levelup-card"
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 20 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 15,
              }}
            >
              {/* Star Burst Background */}
              <motion.div
                className="star-burst"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />

              {/* Treasure Chest Animation */}
              <motion.div
                className="treasure-chest-wrapper"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
              >
                <motion.div
                  className="chest-icon"
                  animate={{
                    rotate: [-2, 2, -2],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 0.5, repeat: 3 }}
                >
                  <div className="chest-top">📦</div>
                  <motion.div
                    className="chest-reward"
                    initial={{ y: 0, opacity: 0, scale: 0 }}
                    animate={{ y: -60, opacity: 1, scale: 1.5 }}
                    transition={{ delay: 1.5, type: 'spring' }}
                  >
                    {newWorld.icon}
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Level Badge */}
              <motion.div
                className="level-badge"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              >
                <Star size={40} fill="#FFD700" color="#FFD700" />
                <span className="level-number">{level}</span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                LEVEL UP!
              </motion.h1>

              {/* New Title */}
              <motion.div
                className="new-title"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
              >
                <Crown size={24} className="crown-icon" />
                <span>{levelData.title}</span>
              </motion.div>

              {/* Character Celebrating */}
              <motion.div
                className="character-celebrate"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <MaestroCharacter
                  isSpeaking={true}
                  isPlaying={true}
                  mood="celebrating"
                />
              </motion.div>

              {/* Story Message */}
              <motion.p
                className="story-message"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                {levelData.message}
              </motion.p>

              {/* Unlock Text */}
              <motion.div
                className="unlock-banner"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <Rocket size={20} />
                <span>{levelData.unlockText}</span>
              </motion.div>

              {/* World Preview */}
              <motion.div
                className="world-preview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                <span className="world-icon">{newWorld.icon}</span>
                <span className="world-name">{newWorld.name}</span>
              </motion.div>

              {/* Continue Button */}
              <motion.button
                className="continue-btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles size={20} />
                <span>LET'S GO!</span>
              </motion.button>
            </motion.div>

            <style>{`
              .levelup-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.9);
                backdrop-filter: blur(20px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
                padding: 2rem;
              }

              .levelup-card {
                position: relative;
                background: linear-gradient(135deg, #2d1b4e 0%, #1a0f2e 100%);
                border: 4px solid #FFD700;
                padding: 3rem;
                border-radius: 3rem;
                text-align: center;
                max-width: 450px;
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 1rem;
                box-shadow: 
                  0 0 60px rgba(255, 215, 0, 0.4),
                  0 0 120px rgba(255, 215, 0, 0.2);
                overflow: hidden;
              }

              .star-burst {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 200%;
                height: 200%;
                background: conic-gradient(
                  from 0deg,
                  transparent 0deg,
                  rgba(255, 215, 0, 0.1) 10deg,
                  transparent 20deg
                );
                transform: translate(-50%, -50%);
                pointer-events: none;
              }

              .level-badge {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1;
              }

              .level-badge .level-number {
                position: absolute;
                font-size: 1.2rem;
                font-weight: 900;
                color: #2d1b4e;
              }

              .levelup-card h1 {
                font-size: 3rem;
                font-weight: 900;
                color: #FFD700;
                text-shadow: 0 0 30px rgba(255, 215, 0, 0.8);
                margin: 0;
                z-index: 1;
              }

              .new-title {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                background: rgba(255, 215, 0, 0.2);
                padding: 0.75rem 1.5rem;
                border-radius: 2rem;
                z-index: 1;
              }

              .new-title span {
                font-size: 1.5rem;
                font-weight: 800;
                color: #FFD700;
                text-transform: uppercase;
              }

              .crown-icon {
                color: #FFD700;
              }

              .character-celebrate {
                z-index: 1;
                transform: scale(0.8);
              }

              .story-message {
                font-size: 1.1rem;
                color: rgba(255, 255, 255, 0.9);
                line-height: 1.5;
                max-width: 350px;
                z-index: 1;
                margin: 0;
              }

              .unlock-banner {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                background: linear-gradient(90deg, #FF4785, #9B5DE5);
                padding: 0.75rem 1.5rem;
                border-radius: 1rem;
                z-index: 1;
              }

              .unlock-banner span {
                font-weight: 700;
                color: white;
              }

              .world-preview {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                z-index: 1;
              }

              .world-icon {
                font-size: 2rem;
              }

              .world-name {
                font-size: 1.2rem;
                font-weight: 700;
                color: ${newWorld.color};
              }

              .treasure-chest-wrapper {
                position: relative;
                height: 80px;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2;
                margin-top: -2rem;
              }

              .chest-icon {
                font-size: 3.5rem;
                cursor: pointer;
                position: relative;
              }

              .chest-reward {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                background: white;
                border-radius: 50%;
                width: 60px;
                height: 60px;
                box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
                border: 3px solid #FFD700;
              }
            `}</style>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
