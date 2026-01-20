import { useState, useCallback, useEffect, useRef } from 'react';
import { Music, Star } from 'lucide-react';
import { motion } from 'framer-motion';

import { useMaestroSession } from '../../hooks/useMaestroSession';
import { useRhythmGame } from '../../hooks/useRhythmGame';
import type {
  CharacterSettings,
  ToolLog,
  SessionData,
} from '../../types/shared';

import { MaestroGuide } from '../MaestroCharacter/MaestroGuide';
import { CharacterCreator } from '../CharacterCreator/CharacterCreator';
import { StickerBook } from '../Rewards/StickerBook';
import { XPLayer } from '../HUD/XPLayer';
import { BadgeReveal } from '../Rewards/BadgeReveal';
import { LevelUpCelebration } from '../Rewards/LevelUpCelebration';
import { FactCard } from '../HUD/FactCard';
import { WorldProgressBar } from '../HUD/WorldProgressBar';

import { MetronomeVisual } from './MetronomeVisual';
import { ControlPanel } from './ControlPanel';
import { PeakHistory } from './PeakHistory';
import { FeedbackLayer } from './FeedbackLayer';
import { StreakCelebration } from './StreakCelebration';

import styles from './RhythmQuest.module.css';

// Types
interface RhythmExercise {
  id: string;
  name: string;
  style: string;
  level: number;
  bpm: number;
  pattern: number[];
  instructions: string;
}

interface RhythmQuestProps {
  onLog: (log: Omit<ToolLog, 'id' | 'timestamp'>) => void;
  initialSession?: SessionData;
}

const debugBtnStyle = {
  background: 'none',
  border: '1px solid white',
  color: 'white',
  fontSize: '0.7rem',
  padding: '5px 10px',
  cursor: 'pointer',
  borderRadius: '5px',
};

export const RhythmQuest: React.FC<RhythmQuestProps> = ({
  onLog,
  initialSession,
}) => {
  // Local State
  const [bpm, setBpm] = useState(80);
  const [feedback, setFeedback] = useState(
    "Tap 'Start Lesson' to begin!"
  );
  const [showCreator, setShowCreator] = useState(false);
  const [availableExercises, setAvailableExercises] = useState<
    RhythmExercise[]
  >([]);
  const [badges, setBadges] = useState<
    { type: string; reason: string }[]
  >([]);
  const [newBadgeToReveal, setNewBadgeToReveal] = useState<{
    type: string;
    reason: string;
  } | null>(null);
  const [currentFact, setCurrentFact] = useState<string | null>(null);

  // Celebration State
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [celebrationLevel, setCelebrationLevel] = useState(1);
  const [streakMilestone, setStreakMilestone] = useState(0);
  const [showStreakCelebration, setShowStreakCelebration] =
    useState(false);

  // Session Hook
  const {
    session,
    isConnecting,
    connectionError,
    sendMetrics,
    updateCharacter,
  } = useMaestroSession({
    initialSession,
    onLog,
    onFeedback: (text: string) => setFeedback(text),
    onStateUpdate: (tool: string, args: Record<string, unknown>) => {
      if (tool === 'set_metronome' && typeof args.bpm === 'number') {
        setBpm(args.bpm);
      }
      if (tool === 'reward_badge') {
        const badgeType = args.type as string;
        const badgeReason = args.reason as string;
        setFeedback(`🏆 BADGE EARNED: ${badgeType}! ${badgeReason}`);
        setBadges((prev: { type: string; reason: string }[]) => [
          ...prev,
          { type: badgeType, reason: badgeReason },
        ]);
        setNewBadgeToReveal({ type: badgeType, reason: badgeReason });
      }
    },
    onMcpResult: (result: unknown) => {
      if (result && typeof result === 'object' && 'fact' in result) {
        const fact = (result as { fact: string }).fact;
        if (typeof fact === 'string') {
          setCurrentFact(fact);
          return;
        }
      }

      if (
        result &&
        typeof result === 'object' &&
        'lesson' in result
      ) {
        const lesson = (result as { lesson: string }).lesson;
        if (typeof lesson === 'string') {
          setFeedback(lesson);
          return;
        }
      }

      setAvailableExercises(result as RhythmExercise[]);
    },
  });

  // Game Hook
  const onPeakDetected = useCallback(
    (time: number, offset: number, currentBpm: number) => {
      sendMetrics({ timestamp: time, offset, bpm: currentBpm });
    },
    [sendMetrics]
  );

  const {
    isPlaying,
    peaks,
    streak,
    xp,
    level,
    xpToNextLevel,
    mood,
    activeFeedback,
    toggleGame,
  } = useRhythmGame({
    bpm,
    onPeakDetected,
    onLevelUp: (newLevel) => {
      setCelebrationLevel(newLevel);
      setShowLevelUp(true);
    },
    onStreakMilestone: (streak) => {
      setStreakMilestone(streak);
      setShowStreakCelebration(true);
      setTimeout(() => setShowStreakCelebration(false), 3000);
    },
  });

  // Handlers
  const handleSaveCharacter = async (settings: CharacterSettings) => {
    await updateCharacter(settings);
    setShowCreator(false);
  };

  // Render Loading / Error
  if (connectionError) {
    return (
      <div className={`${styles.loader} ${styles.error}`}>
        <div className={styles.errorIcon}>⚠️</div>
        <h2>Connection Failed</h2>
        <p>{connectionError}</p>
        <button
          className={styles.retryButton}
          onClick={() => window.location.reload()}
        >
          Retry Connection
        </button>
      </div>
    );
  }

  if (isConnecting) {
    return (
      <div className={styles.loader}>
        <div className={styles.spin}>↻</div>
        <p>Connecting to Teacher...</p>
      </div>
    );
  }

  if (showCreator) {
    return (
      <div className="creator-view">
        <CharacterCreator
          initialSettings={session?.student.character}
          onSave={handleSaveCharacter}
          onCancel={() => setShowCreator(false)}
        />
      </div>
    );
  }

  return (
    <div className={styles.questContainer}>
      <header className={styles.questHeader}>
        <div className={styles.badge}>
          <Music size={16} />
          <span>Rhythm Quest</span>
        </div>
        <WorldProgressBar />
        <h1>Feel the Beat</h1>
        <div className={styles.characterZone}>
          <MaestroGuide
            text={feedback}
            isPlaying={isPlaying}
            bpm={bpm}
            settings={session?.student.character}
            mood={mood}
          />
          {!isPlaying && (
            <button
              className={styles.editCharacterButton}
              onClick={() => setShowCreator(true)}
            >
              Change Look
            </button>
          )}
        </div>
      </header>

      <main
        className="quest-main"
        style={{ width: '100%', maxWidth: '800px' }}
      >
        <MetronomeVisual bpm={bpm} isPlaying={isPlaying} />
        <FeedbackLayer activeFeedback={activeFeedback} />
        <PeakHistory peaks={peaks} />

        {availableExercises.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.exerciseShelf}
          >
            <div className={styles.shelfHeader}>
              <Star size={14} className={styles.accent} />
              <span>Recommended Lessons</span>
            </div>
            <div className={styles.exerciseList}>
              {availableExercises.map((ex: RhythmExercise) => (
                <button
                  key={ex.id}
                  className={styles.exerciseCard}
                  onClick={() => {
                    setBpm(ex.bpm);
                    setFeedback(
                      `Starting: ${ex.name}. ${ex.instructions}`
                    );
                    setAvailableExercises([]);
                  }}
                >
                  <span className={styles.exTitle}>{ex.name}</span>
                  <span className={styles.exMeta}>
                    {ex.style} • {ex.bpm} BPM
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <div className="rewards-zone" style={{ marginTop: '2rem' }}>
          <XPLayer
            xp={xp}
            level={level}
            xpToNextLevel={xpToNextLevel}
          />
          <StickerBook badges={badges} />
        </div>
      </main>

      <footer className="quest-footer">
        <BadgeReveal
          badge={newBadgeToReveal}
          onClose={() => setNewBadgeToReveal(null)}
        />
        <LevelUpCelebration
          level={celebrationLevel}
          isVisible={showLevelUp}
          onClose={() => setShowLevelUp(false)}
        />
        <StreakCelebration
          streak={streakMilestone}
          isVisible={showStreakCelebration}
        />
        <FactCard
          fact={currentFact}
          onClose={() => setCurrentFact(null)}
        />
        <ControlPanel isPlaying={isPlaying} onToggle={toggleGame} />
      </footer>
    </div>
  );
};
