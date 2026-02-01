import { useState, useCallback } from 'react';

export interface RhythmExercise {
  id: string;
  name: string;
  style: string;
  level: number;
  bpm: number;
  pattern: number[];
  instructions: string;
}

interface UseExercisesProps {
  onBpmChange: (bpm: number) => void;
  onFeedbackChange: (text: string) => void;
}

export const useExercises = ({
  onBpmChange,
  onFeedbackChange,
}: UseExercisesProps) => {
  const [availableExercises, setAvailableExercises] = useState<
    RhythmExercise[]
  >([]);

  const handleLessonResult = useCallback(
    (result: unknown) => {
      if (
        result &&
        typeof result === 'object' &&
        'lesson' in result
      ) {
        const lesson = (result as { lesson: string }).lesson;
        if (typeof lesson === 'string') {
          onFeedbackChange(lesson);
          return true;
        }
      }
      return false;
    },
    [onFeedbackChange]
  );

  const selectExercise = useCallback(
    (ex: RhythmExercise) => {
      onBpmChange(ex.bpm);
      onFeedbackChange(`Starting: ${ex.name}. ${ex.instructions}`);
      setAvailableExercises([]);
    },
    [onBpmChange, onFeedbackChange]
  );

  const clearExercises = useCallback(() => {
    setAvailableExercises([]);
  }, []);

  return {
    availableExercises,
    setAvailableExercises,
    handleLessonResult,
    selectExercise,
    clearExercises,
  };
};
