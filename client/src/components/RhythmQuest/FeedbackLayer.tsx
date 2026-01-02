import { AnimatePresence } from 'framer-motion';
import { FeedbackPopup } from './FeedbackPopup';
import styles from './RhythmQuest.module.css';

interface FeedbackLayerProps {
  activeFeedback: {
    id: number;
    text: string;
    type: 'perfect' | 'good' | 'off';
  } | null;
}

export const FeedbackLayer: React.FC<FeedbackLayerProps> = ({
  activeFeedback,
}) => {
  return (
    <div className={styles.feedbackLayer}>
      <AnimatePresence>
        {activeFeedback && (
          <FeedbackPopup
            key={activeFeedback.id}
            text={activeFeedback.text}
            type={activeFeedback.type}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
