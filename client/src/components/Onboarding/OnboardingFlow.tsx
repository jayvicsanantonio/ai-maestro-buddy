import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CharacterCreator } from '../CharacterCreator/CharacterCreator';
import { type CharacterSettings } from '../MaestroCharacter/MaestroCharacter';
import { Music, Sparkles, Rocket, ArrowRight } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: (settings: CharacterSettings) => void;
}

type OnboardingStep =
  | 'splash'
  | 'intro'
  | 'character'
  | 'tutorial'
  | 'ready';

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  onComplete,
}) => {
  const [step, setStep] = useState<OnboardingStep>('splash');
  const [characterSettings, setCharacterSettings] =
    useState<CharacterSettings>({
      color: '#4FB8FF',
      accessory: 'none',
      eyeStyle: 'round',
    });

  const nextStep = () => {
    if (step === 'splash') setStep('intro');
    else if (step === 'intro') setStep('character');
    else if (step === 'character') setStep('tutorial');
    else if (step === 'tutorial') setStep('ready');
    else if (step === 'ready') onComplete(characterSettings);
  };

  return (
    <div className="onboarding-overlay">
      <AnimatePresence mode="wait">
        {step === 'splash' && (
          <motion.div
            key="splash"
            className="onboarding-card splash-screen"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
          >
            <div className="splash-logo">
              <Music size={80} className="floating-icon" />
              <h1>
                Maestro<span className="accent">Buddy</span>
              </h1>
            </div>
            <p className="splash-tagline">
              Your Magical Music Adventure Awaits!
            </p>
            <button
              className="onboarding-primary-button pulse"
              onClick={nextStep}
            >
              <Rocket size={24} />
              <span>Let's Start!</span>
            </button>
          </motion.div>
        )}

        {step === 'intro' && (
          <motion.div
            key="intro"
            className="onboarding-card intro-screen"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
          >
            <Sparkles size={60} color="var(--primary)" />
            <h2>Hi there!</h2>
            <p>
              I'm so excited to be your music teacher. We're going to
              explore the world of rhythm together!
            </p>
            <p className="sub-text">
              But first, let's get you ready for the quest...
            </p>
            <button
              className="onboarding-primary-button"
              onClick={nextStep}
            >
              <span>Next</span>
              <ArrowRight size={24} />
            </button>
          </motion.div>
        )}

        {step === 'character' && (
          <motion.div
            key="character"
            className="onboarding-card-full"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
          >
            <div className="creator-wrapper">
              <CharacterCreator
                initialSettings={characterSettings}
                onSave={(settings) => {
                  setCharacterSettings(settings);
                  nextStep();
                }}
              />
            </div>
          </motion.div>
        )}

        {step === 'tutorial' && (
          <motion.div
            key="tutorial"
            className="onboarding-card tutorial-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="tutorial-visual">
              <div className="wave-icon">🔊</div>
            </div>
            <h2>How to Play</h2>
            <p>1. Listen to my beat!</p>
            <p>2. Clap or tap along when you feel the rhythm.</p>
            <p>3. Earn cool badges as you get better!</p>
            <button
              className="onboarding-primary-button"
              onClick={nextStep}
            >
              <span>Got it!</span>
              <Check size={24} />
            </button>
          </motion.div>
        )}

        {step === 'ready' && (
          <motion.div
            key="ready"
            className="onboarding-card ready-screen"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="party-popper">🎉</div>
            <h2>You're Ready!</h2>
            <p>Your journey starts now. Let's make some music!</p>
            <button
              className="onboarding-primary-button big"
              onClick={nextStep}
            >
              <span>Enter the World</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .onboarding-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--bg-dark);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          overflow-y: auto;
        }

        .onboarding-card {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 3rem;
          padding: 3rem;
          max-width: 500px;
          width: 100%;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          backdrop-filter: blur(20px);
        }

        .onboarding-card-full {
          width: 100%;
          max-width: 600px;
        }

        .splash-logo h1 {
          font-size: 3.5rem;
          font-weight: 900;
          margin: 1rem 0;
          letter-spacing: -0.1rem;
        }

        .splash-tagline {
          font-size: 1.4rem;
          font-weight: 600;
          color: rgba(255,255,255,0.7);
        }

        .onboarding-primary-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          background: var(--primary);
          color: var(--bg-dark);
          border: none;
          padding: 1.2rem 2.5rem;
          border-radius: 2rem;
          font-size: 1.4rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 10px 20px rgba(255, 206, 0, 0.3);
        }

        .onboarding-primary-button:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 15px 30px rgba(255, 206, 0, 0.4);
        }

        .onboarding-primary-button.big {
          padding: 1.5rem 4rem;
          font-size: 1.8rem;
        }

        .pulse {
          animation: onboarding-pulse 2s infinite;
        }

        @keyframes onboarding-pulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 206, 0, 0.7); }
          70% { box-shadow: 0 0 0 20px rgba(255, 206, 0, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 206, 0, 0); }
        }

        .onboarding-card h2 {
          font-size: 2.5rem;
          margin: 0;
          color: var(--primary);
        }

        .onboarding-card p {
          font-size: 1.2rem;
          line-height: 1.6;
          color: rgba(255,255,255,0.9);
        }

        .sub-text {
          font-size: 1rem !important;
          color: rgba(255,255,255,0.5) !important;
        }

        .floating-icon {
          animation: float-icon 3s infinite ease-in-out;
          color: var(--primary);
        }

        @keyframes float-icon {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }

        .tutorial-visual {
          width: 120px;
          height: 120px;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 4rem;
        }

        .party-popper {
          font-size: 5rem;
        }
      `}</style>
    </div>
  );
};

const Check = ({ size, color }: { size: number; color?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color || 'currentColor'}
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);
