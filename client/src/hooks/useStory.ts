import { useContext } from 'react';
import {
  StoryContext,
  type StoryContextValue,
} from '../contexts/StoryContextRegistry';

export const useStory = (): StoryContextValue => {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error('useStory must be used within a StoryProvider');
  }
  return context;
};
