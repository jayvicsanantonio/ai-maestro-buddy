import React, {
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import {
  getWorldForLevel,
  getChapterProgress,
} from '../data/storyContent';
import {
  StoryContext,
  type StoryContextValue,
} from './StoryContextRegistry';

interface StoryState {
  level: number;
  xp: number;
  totalStars: number;
  currentWorldId: number;
  currentChapter: number;
  completedChapters: number[];
  unlockedAbilities: string[];
}

const STORAGE_KEY = 'maestro_story_progress';

const defaultState: StoryState = {
  level: 1,
  xp: 0,
  totalStars: 0,
  currentWorldId: 1,
  currentChapter: 1,
  completedChapters: [],
  unlockedAbilities: [],
};

interface StoryProviderProps {
  children: ReactNode;
}

export const StoryProvider: React.FC<StoryProviderProps> = ({
  children,
}) => {
  const [state, setState] = useState<StoryState>(() => {
    // Load from localStorage on init
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...defaultState, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Failed to load story progress:', e);
    }
    return defaultState;
  });

  // Persist to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save story progress:', e);
    }
  }, [state]);

  // Calculate XP needed for next level (increases each level)

  const addXp = useCallback(
    (amount: number): { leveledUp: boolean; newLevel: number } => {
      let leveledUp = false;
      let newLevel = state.level;

      setState((prev) => {
        const newXp = prev.xp + amount;
        const xpNeeded = prev.level * 100;

        if (newXp >= xpNeeded) {
          leveledUp = true;
          newLevel = prev.level + 1;

          // Update world/chapter based on new level
          const { world, chapterIndex } =
            getChapterProgress(newLevel);

          return {
            ...prev,
            xp: newXp - xpNeeded,
            level: newLevel,
            currentWorldId: world.id,
            currentChapter: chapterIndex + 1,
          };
        }

        return {
          ...prev,
          xp: newXp,
        };
      });

      return { leveledUp, newLevel };
    },
    [state.level]
  );

  const completeChapter = useCallback(
    (worldId: number, chapterId: number) => {
      const chapterKey = worldId * 100 + chapterId;
      setState((prev) => {
        if (prev.completedChapters.includes(chapterKey)) {
          return prev;
        }
        return {
          ...prev,
          completedChapters: [...prev.completedChapters, chapterKey],
          totalStars: prev.totalStars + 1,
        };
      });
    },
    []
  );

  const unlockAbility = useCallback((ability: string) => {
    setState((prev) => {
      if (prev.unlockedAbilities.includes(ability)) {
        return prev;
      }
      return {
        ...prev,
        unlockedAbilities: [...prev.unlockedAbilities, ability],
      };
    });
  }, []);

  const addStars = useCallback((amount: number) => {
    setState((prev) => ({
      ...prev,
      totalStars: prev.totalStars + amount,
    }));
  }, []);

  const resetStory = useCallback(() => {
    setState(defaultState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Compute derived values
  const currentWorld = getWorldForLevel(state.level);
  const { chapterIndex } = getChapterProgress(state.level);
  const chapterProgress =
    (chapterIndex + 1) / currentWorld.chapters.length;

  const value: StoryContextValue = {
    ...state,
    currentWorld,
    chapterProgress,
    addXp,
    completeChapter,
    unlockAbility,
    addStars,
    resetStory,
  };

  return (
    <StoryContext.Provider value={value}>
      {children}
    </StoryContext.Provider>
  );
};
