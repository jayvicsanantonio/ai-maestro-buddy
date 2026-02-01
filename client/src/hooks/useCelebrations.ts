import { useState, useCallback } from 'react';

export const useCelebrations = () => {
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [celebrationLevel, setCelebrationLevel] = useState(1);
  const [streakMilestone, setStreakMilestone] = useState(0);
  const [showStreakCelebration, setShowStreakCelebration] =
    useState(false);

  const triggerLevelUp = useCallback((level: number) => {
    setCelebrationLevel(level);
    setShowLevelUp(true);
  }, []);

  const closeLevelUp = useCallback(() => {
    setShowLevelUp(false);
  }, []);

  const triggerStreak = useCallback((streak: number) => {
    setStreakMilestone(streak);
    setShowStreakCelebration(true);
    setTimeout(() => setShowStreakCelebration(false), 3000);
  }, []);

  return {
    showLevelUp,
    celebrationLevel,
    streakMilestone,
    showStreakCelebration,
    triggerLevelUp,
    closeLevelUp,
    triggerStreak,
  };
};
