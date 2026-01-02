import React from 'react';
import { motion } from 'framer-motion';

import type { CharacterSettings } from '../../types/shared';

export type CharacterMood =
  | 'happy'
  | 'neutral'
  | 'surprised'
  | 'celebrating'
  | 'focused';

interface MaestroCharacterProps {
  isSpeaking: boolean;
  isPlaying: boolean;
  bpm?: number;
  settings?: CharacterSettings;
  mood?: CharacterMood;
}

export const MaestroCharacter: React.FC<MaestroCharacterProps> = ({
  isSpeaking,
  isPlaying,
  bpm = 120,
  settings = {
    color: '#4FB8FF',
    accessory: 'none',
    eyeStyle: 'round',
  },
  mood = 'neutral',
}) => {
  const isExcited = mood === 'happy' || mood === 'celebrating';

  return (
    <motion.div
      className="maestro-character"
      animate={{
        y: isPlaying ? [0, -15, 0] : [0, -5, 0],
        rotate: mood === 'celebrating' ? [0, -10, 10, -10, 0] : 0,
        scale: mood === 'surprised' ? [1, 1.2, 1] : 1,
      }}
      transition={{
        duration: isPlaying ? 60 / bpm : 2,
        repeat: Infinity,
        ease: isPlaying ? 'backOut' : 'easeInOut',
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
          fill={isExcited ? '#FF4785' : '#FFD700'}
          animate={{
            scale: isSpeaking || isExcited ? [1, 1.5, 1] : 1,
          }}
        />
        <motion.circle
          cx="120"
          cy="30"
          r="4"
          fill={isExcited ? '#FF4785' : '#FFD700'}
          animate={{
            scale: isSpeaking || isExcited ? [1, 1.5, 1] : 1,
          }}
        />
        <path d="M80 30L90 50" stroke="#666" strokeWidth="2" />
        <path d="M120 30L110 50" stroke="#666" strokeWidth="2" />

        {/* Accessory: Headphones */}
        {settings.accessory === 'headphones' && (
          <g>
            <path
              d="M45 100 Q45 40 100 40 Q155 40 155 100"
              stroke="#333"
              strokeWidth="8"
              fill="none"
            />
            <rect
              x="35"
              y="90"
              width="20"
              height="30"
              rx="10"
              fill="#333"
            />
            <rect
              x="145"
              y="90"
              width="20"
              height="30"
              rx="10"
              fill="#333"
            />
          </g>
        )}

        {/* Accessory: Cap */}
        {settings.accessory === 'cap' && (
          <g transform="translate(0, -10)">
            <path
              d="M60 60 Q100 30 140 60"
              fill={settings.color}
              stroke="#333"
              strokeWidth="2"
            />
            <path
              d="M140 60 L170 80 L140 70 Z"
              fill={settings.color}
              stroke="#333"
              strokeWidth="2"
            />
          </g>
        )}

        {/* Accessory: Bow */}
        {settings.accessory === 'bow' && (
          <g transform="translate(130, 50) rotate(15)">
            <path
              d="M-15 -10 L15 10 L-15 10 L15 -10 Z"
              fill="#FF4785"
              stroke="#333"
              strokeWidth="2"
            />
            <circle
              r="5"
              fill="#FF4785"
              stroke="#333"
              strokeWidth="2"
            />
          </g>
        )}

        {/* Body/Head */}
        <motion.rect
          x="50"
          y="50"
          width="100"
          height="90"
          rx="40"
          fill={settings.color}
          animate={{
            fill: mood === 'focused' ? '#2D1B4E' : settings.color,
            stroke: mood === 'focused' ? settings.color : 'none',
            strokeWidth: mood === 'focused' ? 4 : 0,
          }}
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
        <g>
          {(settings.eyeStyle === 'round' ||
            mood === 'surprised' ||
            mood === 'focused') && (
            <>
              <motion.circle
                cx="85"
                cy="85"
                r={mood === 'surprised' ? 12 : 8}
                fill="#FFF"
                animate={{
                  scaleY:
                    mood === 'focused'
                      ? 0.2
                      : isSpeaking
                      ? [1, 0.2, 1]
                      : 1,
                }}
              />
              <motion.circle
                cx="115"
                cy="85"
                r={mood === 'surprised' ? 12 : 8}
                fill="#FFF"
                animate={{
                  scaleY:
                    mood === 'focused'
                      ? 0.2
                      : isSpeaking
                      ? [1, 0.2, 1]
                      : 1,
                }}
              />
            </>
          )}

          {settings.eyeStyle === 'star' &&
            mood !== 'surprised' &&
            mood !== 'focused' && (
              <>
                <motion.path
                  d="M85 75 L87 82 L95 82 L89 87 L91 95 L85 90 L79 95 L81 87 L75 82 L83 82 Z"
                  fill="#FFF"
                  animate={{
                    rotate: isSpeaking || isExcited ? [0, 360] : 0,
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
                <motion.path
                  d="M115 75 L117 82 L125 82 L119 87 L121 95 L115 90 L109 95 L111 87 L105 82 L113 82 Z"
                  fill="#FFF"
                  animate={{
                    rotate: isSpeaking || isExcited ? [0, 360] : 0,
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
              </>
            )}

          {settings.eyeStyle === 'wink' &&
            mood !== 'surprised' &&
            mood !== 'focused' && (
              <>
                <motion.circle cx="85" cy="85" r="8" fill="#FFF" />
                <motion.path
                  d="M105 85 Q115 95 125 85"
                  stroke="#FFF"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
              </>
            )}
        </g>

        {/* Mouth */}
        <motion.path
          d={
            isExcited || isSpeaking
              ? 'M85 115 Q100 135 115 115'
              : mood === 'surprised'
              ? 'M90 125 A10 10 0 1 0 110 125 A10 10 0 1 0 90 125'
              : 'M85 115 Q100 120 115 115'
          }
          stroke={mood === 'surprised' ? 'none' : '#FFF'}
          fill={mood === 'surprised' ? '#FFF' : 'none'}
          strokeWidth="4"
          strokeLinecap="round"
          animate={{
            y: mood === 'celebrating' ? [0, -5, 0] : 0,
          }}
        />

        {/* Hands */}
        <motion.path
          d="M40 100 Q30 110 45 120"
          stroke={settings.color}
          strokeWidth="8"
          strokeLinecap="round"
          animate={{
            rotate:
              mood === 'celebrating'
                ? [0, -40, 0]
                : isPlaying
                ? [0, -30, 0]
                : 0,
            y: isPlaying ? [0, -10, 0] : 0,
          }}
          transition={{
            duration: isPlaying ? 60 / bpm : 0.3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.path
          d="M160 100 Q170 110 155 120"
          stroke={settings.color}
          strokeWidth="8"
          strokeLinecap="round"
          animate={{
            rotate:
              mood === 'celebrating'
                ? [0, 40, 0]
                : isPlaying
                ? [0, 30, 0]
                : 0,
            y: isPlaying ? [0, -10, 0] : 0,
          }}
          transition={{
            duration: isPlaying ? 60 / bpm : 0.3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </svg>
    </motion.div>
  );
};
