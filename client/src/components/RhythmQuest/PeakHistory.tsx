import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';
import styles from './RhythmQuest.module.css';

interface PeakHistoryProps {
  peaks: { id: number; time: number; offset: number }[];
}

export const PeakHistory: React.FC<PeakHistoryProps> = ({
  peaks,
}) => {
  return (
    <div className={styles.peakHistory}>
      <AnimatePresence>
        {peaks.map((peak) => (
          <motion.div
            key={peak.id}
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            className={`${styles.peakIndicator} ${
              Math.abs(peak.offset) < 0.05
                ? styles.perfect
                : styles.off
            }`}
          >
            <Zap size={24} fill="currentColor" />
            <span className={styles.offsetLabel}>
              {peak.offset > 0 ? '+' : ''}
              {peak.offset.toFixed(2)}s
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
