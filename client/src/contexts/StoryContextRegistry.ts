import { createContext } from 'react';
import type { World } from '../data/storyContent';

export interface StoryState {
  level: number;
  xp: number;
  totalStars: number;
  currentWorldId: number;
  currentChapter: number;
  completedChapters: number[];
  unlockedAbilities: string[];
}

export interface StoryContextValue extends StoryState {
  currentWorld: World;
  addXp: (amount: number) => { leveledUp: boolean; newLevel: number };
  completeChapter: (worldId: number, chapterId: number) => void;
  unlockAbility: (ability: string) => void;
  addStars: (amount: number) => void;
  resetStory: () => void;
  chapterProgress: number; // 0-1 progress through current world's chapters
}

export const StoryContext = createContext<StoryContextValue | null>(
  null
);
