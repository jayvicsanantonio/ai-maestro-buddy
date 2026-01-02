import { Play, Square } from 'lucide-react';
import styles from './RhythmQuest.module.css';

interface ControlPanelProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  isPlaying,
  onToggle,
}) => {
  return (
    <button
      className={`${styles.actionButton} ${
        isPlaying ? styles.stop : styles.start
      }`}
      onClick={onToggle}
    >
      {isPlaying ? (
        <Square fill="currentColor" />
      ) : (
        <Play fill="currentColor" />
      )}
      {isPlaying ? 'Stop Lesson' : 'Start Lesson'}
    </button>
  );
};
