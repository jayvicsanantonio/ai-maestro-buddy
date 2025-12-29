import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MaestroCharacter,
  type CharacterSettings,
  type CharacterMood,
} from './MaestroCharacter';
import { useSpeech } from '../../hooks/useSpeech';

interface MaestroGuideProps {
  text: string;
  isPlaying?: boolean;
  settings?: CharacterSettings;
  mood?: CharacterMood;
  className?: string;
}

export const MaestroGuide: React.FC<MaestroGuideProps> = ({
  text,
  isPlaying = false,
  settings,
  mood = 'neutral',
  className = '',
}) => {
  const { speak, isSpeaking } = useSpeech();

  useEffect(() => {
    if (text) {
      speak(text);
    }
  }, [text, speak]);

  return (
    <div className={`maestro-guide ${className}`}>
      <div className="guide-content">
        <div className="character-wrapper">
          <MaestroCharacter
            isSpeaking={isSpeaking}
            isPlaying={isPlaying}
            settings={settings}
            mood={mood}
          />
        </div>

        <AnimatePresence mode="wait">
          {text && (
            <motion.div
              key={text}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              className="speech-bubble"
            >
              <div className="bubble-pointer" />
              <p>{text}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .maestro-guide {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          width: 100%;
          max-width: 600px;
        }

        .guide-content {
          display: flex;
          align-items: center;
          gap: 2rem;
          width: 100%;
        }

        .character-wrapper {
          flex-shrink: 0;
        }

        .speech-bubble {
          position: relative;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          padding: 1.5rem 2rem;
          border-radius: 2rem;
          color: white;
          font-weight: 600;
          font-size: 1.2rem;
          line-height: 1.4;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          flex-grow: 1;
        }

        .bubble-pointer {
          position: absolute;
          left: -10px;
          top: 50%;
          transform: translateY(-50%) rotate(45deg);
          width: 20px;
          height: 20px;
          background: rgba(255, 255, 255, 0.1);
          border-left: 2px solid rgba(255, 255, 255, 0.2);
          border-bottom: 2px solid rgba(255, 255, 255, 0.2);
        }

        @media (max-width: 600px) {
          .guide-content {
            flex-direction: column;
            text-align: center;
          }
          .bubble-pointer {
            left: 50%;
            top: -10px;
            transform: translateX(-50%) rotate(45deg);
            border: none;
            border-left: 2px solid rgba(255, 255, 255, 0.2);
            border-top: 2px solid rgba(255, 255, 255, 0.2);
          }
        }
      `}</style>
    </div>
  );
};
