import React from 'react';
import { motion } from 'framer-motion';
import { SparkleBurst } from './SparkleBurst';

interface FeedbackPopupProps {
  text: string;
  type: 'perfect' | 'good' | 'off';
}

export const FeedbackPopup: React.FC<FeedbackPopupProps> = ({
  text,
  type,
}) => {
  const colors = {
    perfect: '#ffce00',
    good: '#4fb8ff',
    off: '#ff4785',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0.5, 1.2, 1, 1],
        y: -100,
      }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        zIndex: 100,
        pointerEvents: 'none',
        color: colors[type],
        fontSize: '2rem',
        fontWeight: 900,
        textShadow: '0 0 20px rgba(0,0,0,0.5)',
        fontFamily: "'Quicksand', sans-serif",
      }}
    >
      <SparkleBurst type={type} />
      {text}
    </motion.div>
  );
};
