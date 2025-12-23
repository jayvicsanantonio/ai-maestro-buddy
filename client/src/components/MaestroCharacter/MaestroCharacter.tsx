import React from 'react';
import { motion } from 'framer-motion';

interface MaestroCharacterProps {
  isSpeaking: boolean;
  isPlaying: boolean;
}

export const MaestroCharacter: React.FC<MaestroCharacterProps> = ({
  isSpeaking,
  isPlaying,
}) => {
  return (
    <motion.div
      className="maestro-character"
      animate={{
        y: isPlaying ? [0, -10, 0] : [0, -5, 0],
      }}
      transition={{
        duration: isPlaying ? 0.5 : 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{
        width: '200px',
        height: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))',
      }}
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Antennas */}
        <motion.circle
          cx="80"
          cy="30"
          r="4"
          fill="#FFD700"
          animate={{ scale: isSpeaking ? [1, 1.5, 1] : 1 }}
        />
        <motion.circle
          cx="120"
          cy="30"
          r="4"
          fill="#FFD700"
          animate={{ scale: isSpeaking ? [1, 1.5, 1] : 1 }}
        />
        <path d="M80 30L90 50" stroke="#666" strokeWidth="2" />
        <path d="M120 30L110 50" stroke="#666" strokeWidth="2" />

        {/* Body/Head */}
        <rect
          x="50"
          y="50"
          width="100"
          height="90"
          rx="40"
          fill="#4FB8FF"
        />
        <rect
          x="60"
          y="60"
          width="80"
          height="50"
          rx="30"
          fill="#003D66"
        />

        {/* Eyes */}
        <motion.circle
          cx="85"
          cy="85"
          r="8"
          fill="#FFF"
          animate={{
            scaleY: isSpeaking ? [1, 0.2, 1] : 1,
            translateY: isSpeaking ? [0, 2, 0] : 0,
          }}
          transition={{
            duration: 0.15,
            repeat: isSpeaking ? Infinity : 0,
            repeatDelay: 0.5,
          }}
        />
        <motion.circle
          cx="115"
          cy="85"
          r="8"
          fill="#FFF"
          animate={{
            scaleY: isSpeaking ? [1, 0.2, 1] : 1,
            translateY: isSpeaking ? [0, 2, 0] : 0,
          }}
          transition={{
            duration: 0.15,
            repeat: isSpeaking ? Infinity : 0,
            repeatDelay: 0.5,
          }}
        />

        {/* Mouth */}
        <motion.path
          d={
            isSpeaking
              ? 'M85 115 Q100 130 115 115'
              : 'M85 115 Q100 120 115 115'
          }
          stroke="#FFF"
          strokeWidth="4"
          strokeLinecap="round"
          animate={{
            d: isSpeaking
              ? [
                  'M85 115 Q100 135 115 115',
                  'M85 120 Q100 125 115 120',
                  'M85 115 Q100 135 115 115',
                ]
              : 'M85 115 Q100 120 115 115',
          }}
          transition={{ duration: 0.3, repeat: Infinity }}
        />

        {/* Hands */}
        <motion.path
          d="M40 100 Q30 110 45 120"
          stroke="#4FB8FF"
          strokeWidth="8"
          strokeLinecap="round"
          animate={{ rotate: isPlaying ? [0, -20, 0] : 0 }}
        />
        <motion.path
          d="M160 100 Q170 110 155 120"
          stroke="#4FB8FF"
          strokeWidth="8"
          strokeLinecap="round"
          animate={{ rotate: isPlaying ? [0, 20, 0] : 0 }}
        />
      </svg>
    </motion.div>
  );
};
