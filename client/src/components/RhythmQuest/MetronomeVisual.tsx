import { motion } from 'framer-motion';
import styles from './RhythmQuest.module.css';

interface MetronomeVisualProps {
  bpm: number;
  isPlaying: boolean;
}

export const MetronomeVisual: React.FC<MetronomeVisualProps> = ({
  bpm,
  isPlaying,
}) => {
  return (
    <div className={styles.metronomeVisual}>
      <div className={styles.bpmDisplay}>
        <span className={styles.bpmValue}>{bpm}</span>
        <span className={styles.bpmLabel}>BPM</span>
      </div>
      <div className={styles.beaters}>
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className={styles.beater}
            animate={
              isPlaying
                ? {
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 1, 0.3],
                    boxShadow: [
                      '0 0 0px rgba(74, 222, 128, 0)',
                      '0 0 20px rgba(74, 222, 128, 0.5)',
                      '0 0 0px rgba(74, 222, 128, 0)',
                    ],
                  }
                : {}
            }
            transition={{
              duration: 60 / bpm,
              repeat: Infinity,
              delay: (i - 1) * (60 / bpm),
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  );
};
