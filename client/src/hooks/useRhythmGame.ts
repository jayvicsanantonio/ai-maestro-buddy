import { useState, useRef, useCallback } from 'react';
import { useAudioAnalyzer } from './useAudioAnalyzer';
import { audioManager } from '../utils/AudioManager';
import type { CharacterMood } from '../components/MaestroCharacter/MaestroCharacter';

interface UseRhythmGameProps {
  bpm: number;
  onPeakDetected: (
    timestamp: number,
    offset: number,
    bpm: number
  ) => void;
}

export const useRhythmGame = ({
  bpm,
  onPeakDetected,
}: UseRhythmGameProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [peaks, setPeaks] = useState<
    { id: number; time: number; offset: number }[]
  >([]);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [mood, setMood] = useState<CharacterMood>('neutral');
  const [activeFeedback, setActiveFeedback] = useState<{
    id: number;
    text: string;
    type: 'perfect' | 'good' | 'off';
  } | null>(null);

  const startTimeRef = useRef<number>(0);
  const questIdCounter = useRef(0);
  const xpToNextLevel = level * 100;

  const handlePeak = useCallback(
    (time: number) => {
      const beatInterval = 60 / bpm;
      const elapsedTime = time - startTimeRef.current;
      const nearestBeat =
        Math.round(elapsedTime / beatInterval) * beatInterval;
      const offset = elapsedTime - nearestBeat;

      const newPeak = { id: questIdCounter.current++, time, offset };
      setPeaks((prev) => [...prev.slice(-9), newPeak]);

      // Report to session
      onPeakDetected(time, offset, bpm);

      // Game Logic
      const absOffset = Math.abs(offset);
      let hitType: 'perfect' | 'good' | 'off' = 'off';
      let feedbackText = 'Keep trying!';
      let nextStreak = streak;

      if (absOffset < 0.05) {
        hitType = 'perfect';
        feedbackText = 'PERFECT!';
        nextStreak = streak + 1;
        audioManager.playHit(true);
      } else if (absOffset < 0.15) {
        hitType = 'good';
        feedbackText = 'GREAT!';
        nextStreak = streak + 1;
        audioManager.playHit(false);
      } else {
        // Miss
        hitType = 'off';
        feedbackText = 'WHOOPS!';
        nextStreak = 0;
        audioManager.playMiss();
      }

      setStreak(nextStreak);

      // XP
      if (hitType !== 'off') {
        const gain = hitType === 'perfect' ? 10 : 5;
        setXp((prev) => {
          const next = prev + gain;
          if (next >= xpToNextLevel) {
            setLevel((l) => l + 1);
            return next - xpToNextLevel;
          }
          return next;
        });
      }

      // Mood
      if (hitType === 'off') {
        setMood('focused');
      } else if (nextStreak >= 10) {
        setMood('celebrating');
      } else if (nextStreak >= 5) {
        setMood('happy');
      } else if (hitType === 'perfect') {
        setMood('surprised');
        setTimeout(
          () => setMood((m) => (m === 'surprised' ? 'neutral' : m)),
          500
        );
      } else {
        setMood('neutral');
      }

      setActiveFeedback({
        id: Date.now(),
        text:
          nextStreak > 0 && hitType !== 'off'
            ? `${feedbackText} x${nextStreak}`
            : feedbackText,
        type: hitType,
      });
    },
    [bpm, streak, xpToNextLevel, onPeakDetected]
  );

  const { startListening, stopListening } =
    useAudioAnalyzer(handlePeak);

  const toggleGame = () => {
    if (isPlaying) {
      stopListening();
      setIsPlaying(false);
    } else {
      startTimeRef.current = performance.now() / 1000;
      startListening();
      setIsPlaying(true);
      setMood('neutral');
    }
  };

  return {
    isPlaying,
    peaks,
    streak,
    xp,
    level,
    xpToNextLevel,
    mood,
    activeFeedback,
    toggleGame,
    setMood,
  };
};
